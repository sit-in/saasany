"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingCTA({
  variant,
  label,
}: {
  variant: "default" | "outline";
  label: string;
}) {
  return (
    <Link
      href="/sign-up"
      className={cn(
        buttonVariants({ variant, size: "lg" }),
        "w-full justify-center rounded-full"
      )}
    >
      {label}
    </Link>
  );
}
