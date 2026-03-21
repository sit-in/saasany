import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKey } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateApiKey(): string {
  const prefix = "sk-";
  const random = randomBytes(32).toString("hex");
  return `${prefix}${random}`;
}

// GET /api/keys — 列出当前用户的 API Keys
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await db
    .select({
      id: apiKey.id,
      name: apiKey.name,
      // 只返回 key 前缀，安全考虑
      keyPrefix: apiKey.key,
      lastUsedAt: apiKey.lastUsedAt,
      createdAt: apiKey.createdAt,
    })
    .from(apiKey)
    .where(eq(apiKey.userId, session.user.id))
    .orderBy(apiKey.createdAt);

  // 仅暴露 key 前 10 个字符作为标识
  const sanitized = keys.map((k) => ({
    ...k,
    keyPrefix: k.keyPrefix.slice(0, 10) + "...",
  }));

  return Response.json({ keys: sanitized });
}

// POST /api/keys — 创建新 API Key
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let name: string;
  try {
    const body = await req.json();
    name = body.name?.trim();
    if (!name) {
      return Response.json({ error: "name is required" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  const key = generateApiKey();
  const id = randomBytes(16).toString("hex");

  await db.insert(apiKey).values({
    id,
    userId: session.user.id,
    name,
    key,
  });

  // 创建成功后返回完整 key（只这一次）
  return Response.json({ id, name, key }, { status: 201 });
}

// DELETE /api/keys?id=xxx — 删除指定 API Key
export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const deleted = await db
    .delete(apiKey)
    .where(and(eq(apiKey.id, id), eq(apiKey.userId, session.user.id)))
    .returning({ id: apiKey.id });

  if (deleted.length === 0) {
    return Response.json({ error: "Key not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
