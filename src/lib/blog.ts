import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

const contentDir = path.join(process.cwd(), "src/content/blog");

function getPostsDir(locale: string): string {
  return path.join(contentDir, locale);
}

export function getAllPosts(locale: string): PostMeta[] {
  const dir = getPostsDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, "");
    const fullPath = path.join(dir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      author: data.author ?? "",
      image: data.image,
    } satisfies PostMeta;
  });

  // 按日期倒序排列
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string, locale: string): Promise<Post | null> {
  const dir = getPostsDir(locale);

  // 尝试 .mdx 和 .md 两种扩展名
  let fullPath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(dir, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(remarkHtml, { sanitize: false }).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    image: data.image,
    contentHtml,
  };
}
