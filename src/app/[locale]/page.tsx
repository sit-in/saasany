import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection
          title={t("title")}
          subtitle={t("subtitle")}
          cta={t("cta")}
          secondaryCta={t("secondaryCta")}
        />
        <FeaturesSection locale={locale} />
        <PricingSection locale={locale} />
      </main>
      <Footer />
    </>
  );
}
