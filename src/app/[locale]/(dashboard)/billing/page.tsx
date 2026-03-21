import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import { BillingClient } from "./billing-client";

export default async function BillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/${locale}/sign-in`);

  await getTranslations("billing"); // ensure translations are loaded

  const userId = session.user.id;
  const subscriptions = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);

  const currentSub = subscriptions[0];
  const isPro = currentSub?.plan === "pro" && currentSub?.status === "active";
  const status = currentSub?.status ?? "inactive";

  let periodEnd: string | null = null;
  if (currentSub?.stripeCurrentPeriodEnd) {
    periodEnd = new Date(currentSub.stripeCurrentPeriodEnd).toLocaleDateString(
      locale === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  }

  return (
    <BillingClient
      isPro={isPro}
      planName={isPro ? "Pro" : "Free"}
      status={status}
      periodEnd={periodEnd}
      locale={locale}
    />
  );
}
