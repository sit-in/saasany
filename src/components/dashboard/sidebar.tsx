"use client";

import {
  LayoutDashboard,
  MessageSquare,
  KeyRound,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  locale: string;
  translations: {
    dashboard: string;
    aiChat: string;
    aiGenerate: string;
    apiKeys: string;
    billing: string;
    settings: string;
    signOut: string;
  };
}

const navItems = (locale: string) => [
  {
    key: "dashboard",
    href: `/${locale}/dashboard`,
    icon: LayoutDashboard,
    matchExact: true,
  },
  {
    key: "aiChat",
    href: `/${locale}/chat`,
    icon: MessageSquare,
    matchExact: false,
  },
  {
    key: "aiGenerate",
    href: `/${locale}/ai-generate`,
    icon: Sparkles,
    matchExact: false,
  },
  {
    key: "apiKeys",
    href: `/${locale}/api-keys`,
    icon: KeyRound,
    matchExact: false,
  },
  {
    key: "billing",
    href: `/${locale}/billing`,
    icon: CreditCard,
    matchExact: false,
  },
  {
    key: "settings",
    href: `/${locale}/settings`,
    icon: Settings,
    matchExact: false,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardSidebar({
  user,
  locale,
  translations,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const items = navItems(locale);

  function isActive(href: string, matchExact: boolean): boolean {
    if (matchExact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    window.location.href = `/${locale}/sign-in`;
  }

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={`/${locale}/dashboard`} />}
              tooltip="Sassany"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">S</span>
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Sassany</span>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={isActive(item.href, item.matchExact)}
                    tooltip={translations[item.key as keyof typeof translations]}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>
                      {translations[item.key as keyof typeof translations]}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: user info + sign out */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={user.email}>
              <Avatar size="sm">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name} />
                )}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none min-w-0">
                <span className="truncate font-medium text-sm">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={translations.signOut}
              onClick={handleSignOut}
            >
              <LogOut />
              <span>{translations.signOut}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
