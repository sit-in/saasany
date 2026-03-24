import {
  Rocket,
  Settings,
  Shield,
  Database,
  CreditCard,
  Sparkles,
  Mail,
  Globe,
  Palette,
  Cloud,
} from "lucide-react";

export const docsNav = [
  {
    group: "guide",
    items: [
      { slug: "getting-started", icon: Rocket },
      { slug: "configuration", icon: Settings },
      { slug: "deployment", icon: Cloud },
    ],
  },
  {
    group: "core",
    items: [
      { slug: "authentication", icon: Shield },
      { slug: "database", icon: Database },
      { slug: "i18n", icon: Globe },
      { slug: "themes", icon: Palette },
    ],
  },
  {
    group: "extensions",
    items: [
      { slug: "payments", icon: CreditCard },
      { slug: "ai-integration", icon: Sparkles },
      { slug: "email", icon: Mail },
    ],
  },
] as const;

export function getAllDocSlugs(): string[] {
  return docsNav.flatMap((g) => g.items.map((i) => i.slug));
}

export function getAdjacentDocs(currentSlug: string) {
  const slugs = getAllDocSlugs();
  const idx = slugs.indexOf(currentSlug);
  return {
    prev: idx > 0 ? slugs[idx - 1] : null,
    next: idx < slugs.length - 1 ? slugs[idx + 1] : null,
  };
}
