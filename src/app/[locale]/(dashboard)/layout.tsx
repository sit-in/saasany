import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  // 服务端认证检查
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/${locale}/sign-in`);
  }

  const tDash = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };

  const sidebarTranslations = {
    dashboard: tNav("dashboard"),
    aiChat: "AI Chat",
    apiKeys: "API Keys",
    billing: tDash("billing"),
    settings: tDash("settings"),
    signOut: tDash("signOut"),
  };

  const headerTranslations = {
    profile: tDash("settings"),
    billing: tDash("billing"),
    signOut: tDash("signOut"),
  };

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={user}
        locale={locale}
        translations={sidebarTranslations}
      />
      <SidebarInset>
        <DashboardHeader
          user={user}
          locale={locale}
          pageTitle={tDash("title")}
          translations={headerTranslations}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
