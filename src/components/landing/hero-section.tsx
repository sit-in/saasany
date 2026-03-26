"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  }),
};

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16 select-none">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-xl opacity-60 dark:opacity-40 pointer-events-none" />
      <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <div className="h-3 w-3 rounded-full bg-green-400/70" />
          </div>
          <div className="mx-auto flex h-6 w-72 items-center justify-center rounded-md bg-background/80 px-3">
            <span className="text-xs text-muted-foreground">app.saasany.com/dashboard</span>
          </div>
        </div>
        <div className="flex" style={{ minHeight: 320 }}>
          <div className="hidden sm:flex flex-col gap-2 w-44 border-r border-border bg-muted/20 p-3">
            {["Dashboard", "Analytics", "Users", "Billing", "Settings"].map((item, i) => (
              <div
                key={item}
                className={cn(
                  "h-8 rounded-md px-3 flex items-center text-xs font-medium",
                  i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="flex-1 p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Revenue", value: "$12,480" },
                { label: "Users", value: "1,842" },
                { label: "Requests", value: "48.2K" },
                { label: "Uptime", value: "99.9%" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border bg-background p-4 h-28 md:h-36 flex items-end gap-1 overflow-hidden">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/20 dark:bg-primary/30"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="rounded-lg border border-border bg-background divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2">
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="h-3 w-28 rounded bg-muted" />
                  <div className="ml-auto h-3 w-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  cta: string;
  secondaryCta: string;
  noCreditCard: string;
}

export function HeroSection({ title, subtitle, cta, secondaryCta, noCreditCard }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-16"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl mx-auto text-center">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-8"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          Now in public beta
        </motion.div>

        <motion.h1
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
        >
          {title}
        </motion.h1>

        <motion.p
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl leading-8 text-muted-foreground"
        >
          {subtitle}
        </motion.p>

        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-12 px-8 text-base rounded-full"
            )}
          >
            {cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="#demo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 px-8 text-base rounded-full"
            )}
          >
            <Play className="mr-2 h-4 w-4" />
            {secondaryCta}
          </Link>
        </motion.div>

        <motion.p
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 text-sm text-muted-foreground"
        >
          {noCreditCard}
        </motion.p>

        <motion.div
          custom={0.5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
