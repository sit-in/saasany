import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---

const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: (...args: unknown[]) => mockSend(...args) };
  },
}));

vi.mock("@/components/emails/welcome-email", () => ({
  welcomeEmailHtml: vi.fn(() => "<html>welcome</html>"),
}));

vi.mock("@/components/emails/subscription-email", () => ({
  subscriptionEmailHtml: vi.fn(() => "<html>subscription</html>"),
}));

vi.mock("@/config/site", () => ({
  siteConfig: {
    email: { from: "Saasany <noreply@saasany.com>" },
  },
}));

// --- Import ---

import { sendWelcomeEmail, sendSubscriptionEmail } from "./email";

// --- Tests ---

describe("sendWelcomeEmail", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends email successfully", async () => {
    mockSend.mockResolvedValue({ data: { id: "email-1" }, error: null });
    const result = await sendWelcomeEmail("user@test.com", "Alice");
    expect(result.success).toBe(true);
    expect(result.id).toBe("email-1");
  });

  it("returns error when Resend API returns error", async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { message: "Rate limit exceeded" },
    });
    const result = await sendWelcomeEmail("user@test.com", "Alice");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Rate limit exceeded");
  });

  it("handles thrown exceptions", async () => {
    mockSend.mockRejectedValue(new Error("Network error"));
    const result = await sendWelcomeEmail("user@test.com", "Alice");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });
});

describe("sendSubscriptionEmail", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends subscription confirmation", async () => {
    mockSend.mockResolvedValue({ data: { id: "email-2" }, error: null });
    const result = await sendSubscriptionEmail(
      "user@test.com",
      "Alice",
      "Pro"
    );
    expect(result.success).toBe(true);
    expect(result.id).toBe("email-2");
  });

  it("returns error on failure", async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { message: "Invalid email" },
    });
    const result = await sendSubscriptionEmail(
      "invalid",
      "Alice",
      "Pro"
    );
    expect(result.success).toBe(false);
  });
});
