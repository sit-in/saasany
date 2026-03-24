"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { docsNav } from "@/config/docs";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocsSidebar() {
  const pathname = usePathname();
  const t = useTranslations("docs");
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentSlug = pathname.split("/docs/")[1] || "";

  const sidebar = (
    <nav className="space-y-6" aria-label="Docs navigation">
      {docsNav.map((group) => (
        <div key={group.group}>
          <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t(`nav.${group.group}`)}
          </h4>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = currentSlug === item.slug;
              return (
                <li key={item.slug}>
                  <Link
                    href={`/docs/${item.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {t(`titles.${item.slug}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="sticky top-16 z-30 flex items-center border-b border-border bg-background px-4 py-2 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="gap-2"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="text-sm">{t("menu")}</span>
        </Button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[7.5rem] z-20 bg-background p-4 overflow-y-auto lg:hidden">
          {sidebar}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pb-8">
          {sidebar}
        </div>
      </aside>
    </>
  );
}
