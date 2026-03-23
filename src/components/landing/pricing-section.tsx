import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PricingCTA } from "./pricing-cta";

export async function PricingSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "pricing" });

  const freeFeatures = t.raw("free.features") as string[];
  const proFeatures = t.raw("pro.features") as string[];

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-muted/30"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">{t("free.name")}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{t("free.price")}</span>
                <span className="text-sm text-muted-foreground">/ {t("free.period")}</span>
              </div>
            </div>

            <ul className="flex-1 space-y-3 mb-8" aria-label={`${t("free.name")} features`}>
              {freeFeatures.map((feature: string) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <PricingCTA variant="outline" label={t("free.cta")} />
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col rounded-2xl border-2 border-primary bg-card p-8 relative shadow-lg transition-shadow hover:shadow-xl">
            {/* Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="px-3 py-1 text-xs font-semibold">Popular</Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">{t("pro.name")}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{t("pro.price")}</span>
                <span className="text-sm text-muted-foreground">/ {t("pro.period")}</span>
              </div>
            </div>

            <ul className="flex-1 space-y-3 mb-8" aria-label={`${t("pro.name")} features`}>
              {proFeatures.map((feature: string) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <PricingCTA variant="default" label={t("pro.cta")} />
          </div>
        </div>
      </div>
    </section>
  );
}
