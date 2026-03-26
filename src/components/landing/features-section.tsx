"use client";

import { useTranslations } from "next-intl";
import { Shield, CreditCard, Sparkles, Globe, LayoutDashboard, Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const icons = [Shield, CreditCard, Sparkles, Globe, LayoutDashboard, Search] as const;
const featureKeys = ["authentication", "payments", "ai", "i18n", "dashboard", "seo"] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function FeaturesSection({ locale }: { locale: string }) {
  const t = useTranslations("features");

  return (
    <section
      id="features"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-16"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureKeys.map((key, i) => {
            const Icon = icons[i];
            const isLarge = i === 0 || i === 2;
            return (
              <motion.div
                key={key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, delay: i * 0.06, ease: "easeOut" },
                  },
                }}
                className={cn(
                  "group relative flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300",
                  "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
                  isLarge && "sm:col-span-2 lg:col-span-1"
                )}
              >
                {/* Icon with glow on hover */}
                <div className="relative">
                  <div className="absolute -inset-2 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-lg transition-opacity" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary/15 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${key}.description`)}
                  </p>
                </div>

                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-tr-2xl pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
