import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Billing 页面占位。
 * Dashboard 阶段完善：展示当前订阅状态、Stripe Customer Portal 入口。
 */
export default async function BillingPage() {
  const t = await getTranslations("billing");
  const tNav = await getTranslations("nav");

  return (
    <>
      <Header />
      <main className="flex-1 py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="mt-2 text-muted-foreground">{t("description")}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("currentPlan")}</CardTitle>
              <CardDescription>{t("comingSoon")}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link
                href="/pricing"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                {t("upgradeNow")}
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
