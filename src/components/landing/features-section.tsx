import { getTranslations } from "next-intl/server";
import { Shield, CreditCard, Sparkles, Globe, LayoutDashboard, Search } from "lucide-react";

const icons = [Shield, CreditCard, Sparkles, Globe, LayoutDashboard, Search] as const;
const featureKeys = ["authentication", "payments", "ai", "i18n", "dashboard", "seo"] as const;

export async function FeaturesSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "features" });

  return (
    <section
      id="features"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-16"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div
                key={key}
                className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border/60 hover:shadow-lg hover:-translate-y-0.5"
                aria-label={t(`items.${key}.title`)}
              >
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
