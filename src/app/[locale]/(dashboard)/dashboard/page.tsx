import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscription, apiKey, creditBalance } from "@/lib/db/schema";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Coins,
  KeyRound,
  Zap,
  MessageSquare,
  CreditCard,
} from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/${locale}/sign-in`);

  const t = await getTranslations("dashboard");

  const userId = session.user.id;

  // 并发查询所有数据
  const [subscriptions, apiKeys, credits] = await Promise.all([
    db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1),
    db.select().from(apiKey).where(eq(apiKey.userId, userId)),
    db
      .select()
      .from(creditBalance)
      .where(eq(creditBalance.userId, userId))
      .limit(1),
  ]);

  const currentSub = subscriptions[0];
  const isPro = currentSub?.plan === "pro" && currentSub?.status === "active";
  const creditsLeft = credits[0]?.balance ?? 0;
  const activeKeyCount = apiKeys.length;

  // 模拟请求数（实际应从 analytics 表获取）
  const totalRequests = 1247;

  // 简单 bar chart 数据（模拟近 7 天使用量）
  const chartData = [120, 98, 210, 175, 310, 280, 184];
  const maxVal = Math.max(...chartData);

  const statsCards = [
    {
      title: t("totalRequests"),
      value: totalRequests.toLocaleString(),
      icon: Activity,
      description: t("thisMonth"),
    },
    {
      title: t("creditsLeft"),
      value: creditsLeft.toLocaleString(),
      icon: Coins,
      description: t("available"),
    },
    {
      title: t("activeKeys"),
      value: activeKeyCount.toString(),
      icon: KeyRound,
      description: t("apiKeys"),
    },
    {
      title: t("currentPlan"),
      value: isPro ? t("pro") : t("free"),
      icon: Zap,
      description: isPro ? t("proPlanDesc") : t("freePlanDesc"),
      badge: isPro ? "Pro" : undefined,
    },
  ];

  const quickActions = [
    {
      title: t("startChat"),
      description: t("startChatDesc"),
      href: `/${locale}/chat`,
      icon: MessageSquare,
    },
    {
      title: t("manageKeys"),
      description: t("manageKeysDesc"),
      href: `/${locale}/api-keys`,
      icon: KeyRound,
    },
    {
      title: t("viewBilling"),
      description: t("viewBillingDesc"),
      href: `/${locale}/billing`,
      icon: CreditCard,
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t("welcome", { name: session.user.name })}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{t("overview")}</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>{card.title}</CardDescription>
                <card.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">
                  {card.value}
                </CardTitle>
                {card.badge && (
                  <Badge variant="default" className="text-xs">
                    {card.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("usageChart")}</CardTitle>
          <CardDescription>{t("last7Days")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {chartData.map((val, i) => {
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              const heightPct = Math.round((val / maxVal) * 100);
              return (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-sm bg-primary/80 transition-all"
                    style={{ height: `${heightPct}%` }}
                    title={`${val} requests`}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {days[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div>
        <h3 className="text-base font-semibold mb-3">{t("quickActions")}</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <action.icon className="size-4" />
                  </div>
                  <CardTitle className="text-sm">{action.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline" render={<Link href={action.href} />}>
                  {t("goTo")} &rarr;
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
