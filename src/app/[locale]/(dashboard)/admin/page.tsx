import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, gte, count, sql } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, CreditCard, UserPlus, DollarSign } from "lucide-react";

export default async function AdminPage() {
  const t = await getTranslations("admin");

  // 本月第一天
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 并行查询所有统计数据
  const [totalUsersResult, activeSubsResult, newUsersResult] =
    await Promise.all([
      db.select({ value: count() }).from(schema.user),
      db
        .select({ value: count() })
        .from(schema.subscription)
        .where(eq(schema.subscription.status, "active")),
      db
        .select({ value: count() })
        .from(schema.user)
        .where(gte(schema.user.createdAt, firstDayOfMonth)),
    ]);

  const totalUsers = totalUsersResult[0]?.value ?? 0;
  const activeSubscriptions = activeSubsResult[0]?.value ?? 0;
  const newUsersThisMonth = newUsersResult[0]?.value ?? 0;

  const stats = [
    {
      titleKey: "totalUsers" as const,
      value: totalUsers.toString(),
      icon: Users,
      description: "+0% from last month",
    },
    {
      titleKey: "activeSubscriptions" as const,
      value: activeSubscriptions.toString(),
      icon: CreditCard,
      description: "Currently active",
    },
    {
      titleKey: "newUsersThisMonth" as const,
      value: newUsersThisMonth.toString(),
      icon: UserPlus,
      description: "This calendar month",
    },
    {
      titleKey: "totalRevenue" as const,
      value: "$0",
      icon: DollarSign,
      description: "Stripe integration needed",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("overview")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.titleKey}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(stat.titleKey)}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
