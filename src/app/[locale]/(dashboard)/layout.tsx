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
  const tAi = await getTranslations("ai");
  const tApiKeys = await getTranslations("apiKeys");
  const tAdmin = await getTranslations("admin");

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    role: session.user.role ?? null,
  };

  const sidebarTranslations = {
    dashboard: tDash("title"),
    aiChat: tAi("chat.title"),
    aiGenerate: tAi("generate.title"),
    apiKeys: tApiKeys("title"),
    billing: tDash("billing"),
    settings: tDash("settings"),
    signOut: tDash("signOut"),
    admin: tAdmin("title"),
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
