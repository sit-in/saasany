import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { AIGenerateClient } from "./ai-generate-client";

export default async function AIGeneratePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/${locale}/sign-in`);

  const t = await getTranslations("ai.generate");

  const translations = {
    title: t("title"),
    inputPlaceholder: t("inputPlaceholder"),
    generate: t("generate"),
    generating: t("generating"),
    result: t("result"),
    copy: t("copy"),
    copied: t("copied"),
    templates: {
      summarize: t("templates.summarize"),
      translate: t("templates.translate"),
      rewrite: t("templates.rewrite"),
    },
  };

  return <AIGenerateClient translations={translations} />;
}
