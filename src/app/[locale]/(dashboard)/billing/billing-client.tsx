"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Zap, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BillingClientProps {
  isPro: boolean;
  planName: string;
  status: string;
  periodEnd: string | null;
  locale: string;
}

export function BillingClient({
  isPro,
  planName,
  status,
  periodEnd,
  locale,
}: BillingClientProps) {
  const t = useTranslations("billing");
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleManageSubscription() {
    setLoadingPortal(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create portal session");
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch {
      setError(t("portalError"));
      setLoadingPortal(false);
    }
  }

  const proFeatures = [
    "Unlimited projects",
    "50,000 AI requests / month",
    "Priority email support",
    "Advanced authentication",
    "Full analytics dashboard",
    "Custom domain support",
    "Remove Saasany branding",
  ];

  const freeFeatures = [
    "Up to 3 projects",
    "1,000 AI requests / month",
    "Community support",
    "Core authentication",
    "Basic analytics",
  ];

  const features = isPro ? proFeatures : freeFeatures;

  function statusLabel(): string {
    if (status === "active") return t("active");
    if (status === "canceled") return t("canceled");
    return t("inactive");
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t("description")}</p>
      </div>

      {/* Current plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("currentPlan")}</CardTitle>
            <Badge variant={isPro ? "default" : "secondary"}>{planName}</Badge>
          </div>
          <CardDescription>{statusLabel()}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              {isPro ? (
                <Zap className="size-5 text-primary" />
              ) : (
                <CreditCard className="size-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold">
                {isPro ? t("proPlan") : t("freePlan")}
              </p>
              {isPro && periodEnd && (
                <p className="text-xs text-muted-foreground">
                  {t("renewsOn", { date: periodEnd })}
                </p>
              )}
              {!isPro && (
                <p className="text-xs text-muted-foreground">
                  {t("comingSoon")}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <ul className="flex flex-col gap-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex gap-3">
          {isPro ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              disabled={loadingPortal}
            >
              {loadingPortal ? t("loading") : t("manageSubscription")}
            </Button>
          ) : (
            <Button size="sm" render={<Link href={`/${locale}/pricing`} />}>
              {t("upgradeNow")}
            </Button>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardFooter>
      </Card>

      {/* Upgrade CTA for free users */}
      {!isPro && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">{t("upgradeTitle")}</CardTitle>
            <CardDescription>{t("upgradeDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href={`/${locale}/pricing`} />}>
              {t("upgradeNow")} &rarr;
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
