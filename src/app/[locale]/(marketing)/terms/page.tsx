import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("title"),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  const lastUpdated = "January 1, 2025";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("lastUpdated", { date: lastUpdated })}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        <p>{t("intro")}</p>

        <h2>{t("sections.acceptance.title")}</h2>
        <p>{t("sections.acceptance.content")}</p>

        <h2>{t("sections.use.title")}</h2>
        <p>{t("sections.use.content")}</p>
        <ul>
          <li>{t("sections.use.items.lawful")}</li>
          <li>{t("sections.use.items.noAbuse")}</li>
          <li>{t("sections.use.items.noInfringe")}</li>
        </ul>

        <h2>{t("sections.account.title")}</h2>
        <p>{t("sections.account.content")}</p>

        <h2>{t("sections.payment.title")}</h2>
        <p>{t("sections.payment.content")}</p>

        <h2>{t("sections.ip.title")}</h2>
        <p>{t("sections.ip.content")}</p>

        <h2>{t("sections.disclaimer.title")}</h2>
        <p>{t("sections.disclaimer.content")}</p>

        <h2>{t("sections.limitation.title")}</h2>
        <p>{t("sections.limitation.content")}</p>

        <h2>{t("sections.termination.title")}</h2>
        <p>{t("sections.termination.content")}</p>

        <h2>{t("sections.contact.title")}</h2>
        <p>
          {t.rich("sections.contact.content", {
            email: (chunks) => (
              <a href="mailto:legal@sassany.com">{chunks}</a>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
