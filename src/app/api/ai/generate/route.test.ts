import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---

const mockGetSession = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: {
    api: { getSession: (...args: unknown[]) => mockGetSession(...args) },
  },
}));

vi.mock("@/lib/ai", () => ({
  aiModel: "mock-model",
  systemPrompt: "You are a test assistant.",
}));

const mockGenerateText = vi.fn();
vi.mock("ai", () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// --- Import ---

import { POST } from "./route";

// --- Tests ---

describe("POST /api/ai/generate", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "hello" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when prompt is missing", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "1" } });
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when prompt is not a string", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "1" } });
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: 123 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 on invalid JSON body", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "1" } });
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns generated text on success", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "1" } });
    mockGenerateText.mockResolvedValue({ text: "Hello world!" });

    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "Write a haiku" }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.text).toBe("Hello world!");
  });

  it("returns 500 when generation fails", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "1" } });
    mockGenerateText.mockRejectedValue(new Error("API error"));

    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt: "Write a haiku" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
