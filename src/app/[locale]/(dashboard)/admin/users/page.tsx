import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, ilike, or, desc, count } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const PAGE_SIZE = 20;

interface UsersPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function AdminUsersPage({
  params,
  searchParams,
}: UsersPageProps) {
  const { locale } = await params;
  const { q, page: pageParam } = await searchParams;

  // 权限检查（双重保障）
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations("admin");

  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  // 构建搜索条件
  const whereClause = q
    ? or(
        ilike(schema.user.email, `%${q}%`),
        ilike(schema.user.name, `%${q}%`)
      )
    : undefined;

  // 并行查询用户列表和总数
  const [users, totalResult] = await Promise.all([
    db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        email: schema.user.email,
        image: schema.user.image,
        role: schema.user.role,
        banned: schema.user.banned,
        createdAt: schema.user.createdAt,
        subscriptionStatus: schema.subscription.status,
        subscriptionPlan: schema.subscription.plan,
      })
      .from(schema.user)
      .leftJoin(
        schema.subscription,
        eq(schema.user.id, schema.subscription.userId)
      )
      .where(whereClause)
      .orderBy(desc(schema.user.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ value: count() })
      .from(schema.user)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.value ?? 0;
  const totalPages = Math.max(1, Math.ceil(Number(total) / PAGE_SIZE));

  function buildUrl(newPage: number, newQ?: string): string {
    const params = new URLSearchParams();
    const query = newQ !== undefined ? newQ : (q ?? "");
    if (query) params.set("q", query);
    if (newPage > 1) params.set("page", newPage.toString());
    const qs = params.toString();
    return `/${locale}/admin/users${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("users")}</h1>
        <p className="text-muted-foreground">{t("userList")}</p>
      </div>

      {/* 搜索框 */}
      <form method="GET" action={`/${locale}/admin/users`}>
        <div className="flex gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder={t("search")}
              className="pl-8"
            />
          </div>
          <Button type="submit" variant="secondary">
            {t("search")}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("userList")} ({total.toString()})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("subscriptionStatus")}</TableHead>
                <TableHead>{t("joinedAt")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    {t("noUsers")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {user.image && (
                            <AvatarImage src={user.image} alt={user.name} />
                          )}
                          <AvatarFallback className="text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="default">{user.role}</Badge>
                      ) : (
                        <Badge variant="secondary">{user.role ?? "user"}</Badge>
                      )}
                      {user.banned && (
                        <Badge variant="destructive" className="ml-1">
                          banned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.subscriptionStatus === "active" ? (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                          {user.subscriptionPlan ?? "active"}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          {user.subscriptionStatus ?? "free"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button
                variant="outline"
                size="sm"
                render={<a href={buildUrl(page - 1)} />}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("previous")}
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("previous")}
              </Button>
            )}
            {page < totalPages ? (
              <Button
                variant="outline"
                size="sm"
                render={<a href={buildUrl(page + 1)} />}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
