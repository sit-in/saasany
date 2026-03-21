"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingPlans } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type Interval = "monthly" | "yearly";

export default function PricingPage() {
  const t = useTranslations("pricing");
  const router = useRouter();

  const [interval, setInterval] = useState<Interval>("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const freeFeatures = t.raw("free.features") as string[];
  const proFeatures = t.raw("pro.features") as string[];

  // 年付相比月付的折扣：$290 vs $29*12=$348，约节省 17%
  const yearlyDiscountPercent = Math.round(
    ((pricingPlans[1].price.monthly * 12 - pricingPlans[1].price.yearly) /
      (pricingPlans[1].price.monthly * 12)) *
      100
  );

  async function handleCheckout(planId: string) {
    if (planId === "free") {
      router.push("/sign-up");
      return;
    }

    const plan = pricingPlans.find((p) => p.id === planId);
    if (!plan) return;

    const priceId = plan.stripePriceId[interval];
    if (!priceId) {
      setError(t("errorOccurred"));
      return;
    }

    setError(null);
    setLoadingPlanId(planId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, interval }),
      });

      if (response.status === 401) {
        // 未登录，跳转到登录页
        router.push("/sign-in");
        return;
      }

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? t("errorOccurred"));
        return;
      }

      window.location.href = data.url;
    } catch {
      setError(t("errorOccurred"));
    } finally {
      setLoadingPlanId(null);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
            >
              {t("subtitle")}
            </motion.p>

            {/* Monthly / Yearly 切换 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1"
              role="group"
              aria-label="Billing interval"
            >
              <button
                type="button"
                onClick={() => setInterval("monthly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  interval === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t("monthly")}
              </button>
              <button
                type="button"
                onClick={() => setInterval("yearly")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  interval === "yearly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t("yearly")}
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  {t("savePercent", { percent: yearlyDiscountPercent })}
                </Badge>
              </button>
            </motion.div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 max-w-3xl mx-auto rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-8"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("free.name")}
                </h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    $0
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("free.period")}
                  </span>
                </div>
              </div>

              <ul
                className="flex-1 space-y-3 mb-8"
                aria-label={`${t("free.name")} features`}
              >
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full"
                onClick={() => handleCheckout("free")}
              >
                {t("free.cta")}
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col rounded-2xl border-2 border-primary bg-card p-8 relative shadow-lg"
            >
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="px-3 py-1 text-xs font-semibold">
                  <Zap className="mr-1 h-3 w-3" aria-hidden="true" />
                  {t("popular")}
                </Badge>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("pro.name")}
                </h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    {interval === "monthly"
                      ? `$${pricingPlans[1].price.monthly}`
                      : `$${pricingPlans[1].price.yearly}`}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {interval === "monthly" ? t("perMonth") : t("perYear")}
                  </span>
                </div>
                {interval === "yearly" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("billedYearly")}
                  </p>
                )}
              </div>

              <ul
                className="flex-1 space-y-3 mb-8"
                aria-label={`${t("pro.name")} features`}
              >
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full rounded-full"
                onClick={() => handleCheckout("pro")}
                disabled={loadingPlanId === "pro"}
              >
                {loadingPlanId === "pro" ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("redirecting")}
                  </>
                ) : interval === "monthly" ? (
                  t("pro.cta")
                ) : (
                  t("pro.ctaYearly")
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
