import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getDocBySlug, getAllDocs } from "@/lib/docs";
import { getAllDocSlugs } from "@/config/docs";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsPager } from "@/components/docs/docs-pager";

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = await getDocBySlug(slug, locale);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const doc = await getDocBySlug(slug, locale);

  if (!doc) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "docs" });

  // Build titles map for pager
  const allDocs = getAllDocs(locale);
  const titles: Record<string, string> = {};
  for (const d of allDocs) {
    titles[d.slug] = d.title;
  }

  // Add heading IDs to HTML for TOC
  const contentWithIds = doc.contentHtml.replace(
    /<(h[23])>(.*?)<\/h[23]>/gi,
    (_, tag, text) => {
      const id = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<${tag} id="${id}">${text}</${tag}>`;
    }
  );

  return (
    <div className="flex flex-1 gap-8 min-w-0">
      <article className="flex-1 min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
          {doc.description && (
            <p className="mt-2 text-lg text-muted-foreground">
              {doc.description}
            </p>
          )}
        </div>
        <div
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:scroll-mt-20
            prose-code:before:content-none prose-code:after:content-none
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
            prose-pre:bg-muted prose-pre:border prose-pre:border-border"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
        <DocsPager currentSlug={slug} titles={titles} />
      </article>
      <DocsToc contentHtml={contentWithIds} />
    </div>
  );
}
