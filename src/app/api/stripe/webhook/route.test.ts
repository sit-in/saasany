import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---

const mockConstructEvent = vi.fn();
const mockSubscriptionsRetrieve = vi.fn();
vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
    },
    subscriptions: {
      retrieve: (...args: unknown[]) => mockSubscriptionsRetrieve(...args),
    },
  },
}));

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    insert: (...args: unknown[]) => mockInsert(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  subscription: {
    id: "id",
    userId: "user_id",
    stripeCustomerId: "stripe_customer_id",
    stripeSubscriptionId: "stripe_subscription_id",
    stripePriceId: "stripe_price_id",
    stripeCurrentPeriodStart: "stripe_current_period_start",
    stripeCurrentPeriodEnd: "stripe_current_period_end",
    status: "status",
    plan: "plan",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col, val) => ({ col, val })),
}));

// --- Import ---

import { POST } from "./route";

// --- Helpers ---

function makeRequest(
  body: string,
  signature: string | null = "valid-sig"
): Request {
  const headers = new Headers();
  if (signature) headers.set("stripe-signature", signature);
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    body,
    headers,
  });
}

const NOW = Math.floor(Date.now() / 1000);

function mockCheckoutEvent(userId: string = "user-123") {
  mockConstructEvent.mockReturnValue({
    type: "checkout.session.completed",
    data: {
      object: {
        mode: "subscription",
        subscription: "sub_123",
        customer: "cus_123",
        metadata: { userId },
      },
    },
  });

  mockSubscriptionsRetrieve.mockResolvedValue({
    status: "active",
    items: {
      data: [
        {
          price: { id: "price_123" },
          current_period_start: NOW,
          current_period_end: NOW + 86400 * 30,
        },
      ],
    },
  });
}

function mockDbSelectReturns(rows: unknown[]) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(rows),
  };
  mockSelect.mockReturnValue(chain);
}

function mockDbInsertOk() {
  const chain = { values: vi.fn().mockResolvedValue([]) };
  mockInsert.mockReturnValue(chain);
}

function mockDbUpdateOk() {
  const chain = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
  };
  mockUpdate.mockReturnValue(chain);
}

// --- Tests ---

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => vi.clearAllMocks());

  // --- Signature validation ---

  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await POST(makeRequest("{}", null) as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("stripe-signature");
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const res = await POST(makeRequest("{}", "bad-sig") as any);
    expect(res.status).toBe(400);
  });

  // --- checkout.session.completed ---

  it("inserts new subscription on checkout.session.completed", async () => {
    mockCheckoutEvent();
    mockDbSelectReturns([]); // no existing subscription
    mockDbInsertOk();

    const res = await POST(makeRequest("body") as any);
    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("updates existing subscription on checkout.session.completed", async () => {
    mockCheckoutEvent();
    mockDbSelectReturns([{ id: "existing-sub" }]); // existing subscription
    mockDbUpdateOk();

    const res = await POST(makeRequest("body") as any);
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("ignores checkout for non-subscription mode", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: { mode: "payment", metadata: {} },
      },
    });

    const res = await POST(makeRequest("body") as any);
    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  // --- customer.subscription.updated ---

  it("updates subscription on customer.subscription.updated", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_123",
          status: "active",
          cancel_at_period_end: false,
          metadata: { userId: "user-123" },
          items: {
            data: [
              {
                price: { id: "price_123" },
                current_period_start: NOW,
                current_period_end: NOW + 86400 * 30,
              },
            ],
          },
        },
      },
    });
    mockDbUpdateOk();

    const res = await POST(makeRequest("body") as any);
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("sets plan to free when subscription is canceled", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_123",
          status: "active",
          cancel_at_period_end: true,
          metadata: { userId: "user-123" },
          items: {
            data: [
              {
                price: { id: "price_123" },
                current_period_start: NOW,
                current_period_end: NOW + 86400 * 30,
              },
            ],
          },
        },
      },
    });

    const updateSet = vi.fn().mockReturnThis();
    const updateWhere = vi.fn().mockResolvedValue([]);
    mockUpdate.mockReturnValue({ set: updateSet, where: updateWhere });

    const res = await POST(makeRequest("body") as any);
    expect(res.status).toBe(200);
    // Verify the set was called with plan: "free"
    expect(updateSet).toHaveBeenCalled();
    const setArg = updateSet.mock.calls[0][0];
    expect(setArg.plan).toBe("free");
  });

  // --- customer.subscription.deleted ---

  it("marks subscription as canceled on deletion", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: { id: "sub_123" },
      },
    });

    const updateSet = vi.fn().mockReturnThis();
    const updateWhere = vi.fn().mockResolvedValue([]);
    mockUpdate.mockReturnValue({ set: updateSet, where: updateWhere });

    const res = await POST(makeRequest("body") as any);
    expect(res.status).toBe(200);
    const setArg = updateSet.mock.calls[0][0];
    expect(setArg.status).toBe("canceled");
    expect(setArg.plan).toBe("free");
  });

  // --- Unknown event ---

  it("returns 200 for unknown event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "invoice.payment_succeeded",
      data: { object: {} },
    });

    const res = await POST(makeRequest("body") as any);
    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
