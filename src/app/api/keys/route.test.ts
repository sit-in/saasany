import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks (must be before imports) ---

const mockGetSession = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: {
    api: { getSession: (...args: unknown[]) => mockGetSession(...args) },
  },
}));

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    insert: (...args: unknown[]) => mockInsert(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  apiKey: {
    id: "id",
    userId: "user_id",
    name: "name",
    key: "key",
    lastUsedAt: "last_used_at",
    createdAt: "created_at",
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// --- Import after mocks ---

import { GET, POST, DELETE } from "./route";

// --- Helpers ---

function mockAuthenticated() {
  mockGetSession.mockResolvedValue({
    user: { id: "user-123", name: "Test", email: "test@test.com" },
  });
}

function mockUnauthenticated() {
  mockGetSession.mockResolvedValue(null);
}

// --- Tests ---

describe("GET /api/keys", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated();
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns user keys with truncated prefix", async () => {
    mockAuthenticated();
    const chain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([
        {
          id: "k1",
          name: "Key 1",
          keyPrefix: "sk-abc123def456789",
          lastUsedAt: null,
          createdAt: new Date(),
        },
      ]),
    };
    mockSelect.mockReturnValue(chain);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.keys).toHaveLength(1);
    expect(data.keys[0].keyPrefix).toBe("sk-abc123d...");
  });
});

describe("POST /api/keys", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated();
    const req = new Request("http://localhost/api/keys", {
      method: "POST",
      body: JSON.stringify({ name: "test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when name is missing", async () => {
    mockAuthenticated();
    const req = new Request("http://localhost/api/keys", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when name is empty string", async () => {
    mockAuthenticated();
    const req = new Request("http://localhost/api/keys", {
      method: "POST",
      body: JSON.stringify({ name: "   " }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates a key and returns 201 with sk- prefix", async () => {
    mockAuthenticated();
    const chain = { values: vi.fn().mockResolvedValue([]) };
    mockInsert.mockReturnValue(chain);

    const req = new Request("http://localhost/api/keys", {
      method: "POST",
      body: JSON.stringify({ name: "My Key" }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.key).toMatch(/^sk-/);
    expect(data.name).toBe("My Key");
    expect(data.id).toBeTruthy();
  });
});

describe("DELETE /api/keys", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockUnauthenticated();
    const req = new Request("http://localhost/api/keys?id=k1", {
      method: "DELETE",
    });
    const res = await DELETE(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when id is missing", async () => {
    mockAuthenticated();
    const req = new Request("http://localhost/api/keys", {
      method: "DELETE",
    });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when key not found", async () => {
    mockAuthenticated();
    const chain = {
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([]),
    };
    mockDelete.mockReturnValue(chain);

    const req = new Request("http://localhost/api/keys?id=nonexistent", {
      method: "DELETE",
    });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });

  it("returns success when key is deleted", async () => {
    mockAuthenticated();
    const chain = {
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: "k1" }]),
    };
    mockDelete.mockReturnValue(chain);

    const req = new Request("http://localhost/api/keys?id=k1", {
      method: "DELETE",
    });
    const res = await DELETE(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
