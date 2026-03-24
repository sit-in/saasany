import { vi } from "vitest";

export const mockSession = {
  user: {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    emailVerified: true,
    image: null,
    role: "user",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  session: {
    id: "session-123",
    token: "token-abc",
    userId: "user-123",
    expiresAt: new Date(Date.now() + 86400000),
  },
};

/**
 * Mock auth.api.getSession - 返回一个可以被 mockResolvedValue 控制的函数
 */
export function createMockGetSession() {
  return vi.fn().mockResolvedValue(mockSession);
}
