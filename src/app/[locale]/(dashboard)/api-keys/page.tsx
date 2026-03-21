import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { apiKey } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { APIKeysClient } from "./api-keys-client";

export default async function APIKeysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/${locale}/sign-in`);

  const t = await getTranslations("apiKeys");

  const keys = await db
    .select({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key,
      lastUsedAt: apiKey.lastUsedAt,
      createdAt: apiKey.createdAt,
    })
    .from(apiKey)
    .where(eq(apiKey.userId, session.user.id))
    .orderBy(apiKey.createdAt);

  // 只暴露前缀给客户端
  const sanitizedKeys = keys.map((k) => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.key.slice(0, 10) + "...",
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
  }));

  const translations = {
    title: t("title"),
    create: t("create"),
    name: t("name"),
    key: t("key"),
    createdAt: t("createdAt"),
    lastUsed: t("lastUsed"),
    delete: t("delete"),
    deleteConfirm: t("deleteConfirm"),
    created: t("created"),
    copyKey: t("copyKey"),
    never: t("never"),
    namePlaceholder: t("namePlaceholder"),
    creating: t("creating"),
    noKeys: t("noKeys"),
    copied: t("copied"),
    copyKeyWarning: t("copyKeyWarning"),
  };

  return <APIKeysClient initialKeys={sanitizedKeys} translations={translations} />;
}
