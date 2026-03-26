"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.4, ease: "easeOut" as const },
  },
};

function DashboardPreview() {
  const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95];
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16 select-none">
      {/* Glow */}
      <div className="absolute -inset-4 rounded-3xl bg-primary/8 dark:bg-primary/12 blur-2xl pointer-events-none" />

      <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/5 dark:shadow-primary/10 overflow-hidden backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
          </div>
          <div className="mx-auto flex h-5 w-64 items-center justify-center rounded bg-background/60 px-3">
            <span className="text-[10px] text-muted-foreground/60 font-mono">saasany.com/dashboard</span>
          </div>
        </div>

        <div className="flex" style={{ minHeight: 300 }}>
          {/* Sidebar */}
          <div className="hidden sm:flex flex-col gap-1 w-40 border-r border-border/50 bg-muted/10 p-2.5">
            <div className="flex items-center gap-2 mb-2 px-2 py-1">
              <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
                <Zap className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-[10px] font-semibold text-foreground/70">Saasany</span>
            </div>
            {["Dashboard", "AI Chat", "API Keys", "Billing", "Settings"].map((item, i) => (
              <div
                key={item}
                className={cn(
                  "h-7 rounded-md px-2.5 flex items-center text-[10px] font-medium transition-colors",
                  i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"
                )}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 space-y-3">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: "Revenue", value: "$12,480", change: "+14%" },
                { label: "Users", value: "1,842", change: "+8%" },
                { label: "AI Requests", value: "48.2K", change: "+22%" },
                { label: "Uptime", value: "99.9%", change: "stable" },
              ].map(({ label, value, change }) => (
                <div key={label} className="rounded-lg border border-border/40 bg-background/80 p-2.5">
                  <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">{label}</p>
                  <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">{value}</p>
                  <p className="text-[9px] text-primary font-medium">{change}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-lg border border-border/40 bg-background/80 p-3 h-24 flex items-end gap-[3px] overflow-hidden">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t bg-primary/25 dark:bg-primary/35"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                />
              ))}
            </div>

            {/* Table rows */}
            <div className="rounded-lg border border-border/40 bg-background/80 divide-y divide-border/30">
              {[
                { name: "Jane C.", email: "jane@...", plan: "Pro" },
                { name: "Alex K.", email: "alex@...", plan: "Pro" },
                { name: "Maria L.", email: "maria@...", plan: "Free" },
              ].map((row) => (
                <div key={row.name} className="flex items-center gap-2 px-3 py-1.5 text-[10px]">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                    {row.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="font-medium text-foreground/70">{row.name}</span>
                  <span className="text-muted-foreground/40 hidden sm:inline">{row.email}</span>
                  <span className={cn(
                    "ml-auto text-[8px] font-medium px-1.5 py-0.5 rounded-full",
                    row.plan === "Pro" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/50"
                  )}>
                    {row.plan}
                  </span>
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
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_70%)]" />
        {/* Accent glow */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/4 dark:bg-primary/8 blur-[100px]" />
      </div>

      <motion.div
        className="w-full max-w-5xl mx-auto text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Now in public beta
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed text-muted-foreground"
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
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

        {/* No credit card */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-sm text-muted-foreground/70"
        >
          {noCreditCard}
        </motion.p>

        {/* Dashboard preview */}
        <motion.div variants={scaleIn}>
          <DashboardPreview />
        </motion.div>
      </motion.div>
    </section>
  );
}
