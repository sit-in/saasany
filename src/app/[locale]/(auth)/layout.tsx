import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("site");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* 品牌 Logo */}
      <Link
        href="/"
        className="mb-8 text-xl font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
      >
        {t("name")}
      </Link>
      {/* 卡片区域 */}
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
