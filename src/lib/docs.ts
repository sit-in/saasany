import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
}

export interface Doc extends DocMeta {
  contentHtml: string;
}

const contentDir = path.join(process.cwd(), "src/content/docs");

function getDocsDir(locale: string): string {
  return path.join(contentDir, locale);
}

export function getAllDocs(locale: string): DocMeta[] {
  const dir = getDocsDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const docs = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, "");
    const fullPath = path.join(dir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      order: data.order ?? 99,
    } satisfies DocMeta;
  });

  return docs.sort((a, b) => a.order - b.order);
}

export async function getDocBySlug(
  slug: string,
  locale: string
): Promise<Doc | null> {
  const dir = getDocsDir(locale);

  let fullPath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(dir, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    order: data.order ?? 99,
    contentHtml,
  };
}
