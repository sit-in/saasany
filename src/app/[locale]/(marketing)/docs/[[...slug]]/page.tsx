import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound, redirect } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!slug || slug.length === 0) {
    redirect(`/${locale}/docs/getting-started`);
  }
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = source.getPage(slug, locale);
  if (!page) return {};
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
