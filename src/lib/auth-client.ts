import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // better-auth 在浏览器中会自动推断 baseURL，
  // 服务端渲染时可通过 NEXT_PUBLIC_BETTER_AUTH_URL 覆盖
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
