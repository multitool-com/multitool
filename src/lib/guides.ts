import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { getAllTools } from "@/lib/tools";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

export interface GuideTool {
  name: string;
  href: string;
  description: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  readingTime: number;
  tools: GuideTool[];
  html: string;
}

/** marked: links externos em nova aba, imagens lazy */
const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    link(
      this: { parser: { parseInline(t: unknown[]): string } },
      token: Tokens.Link
    ) {
      const external = /^https?:\/\//.test(token.href);
      const attrs = external
        ? ' target="_blank" rel="noopener nofollow"'
        : "";
      const text = this.parser.parseInline(token.tokens);
      return `<a href="${token.href}"${attrs}>${text}</a>`;
    },
    image(token: Tokens.Image) {
      return `<img src="${token.href}" alt="${token.text ?? ""}" loading="lazy" decoding="async" />`;
    },
  },
});

function parseFile(
  file: string,
  toolIndex: Map<string, { name: string; description: string; cat: string }>
): Guide | null {
  const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
  const { data, content } = matter(raw);
  if (data.draft === true) return null;
  const toolSlugs: string[] = Array.isArray(data.tools) ? data.tools : [];
  const tools: GuideTool[] = toolSlugs.flatMap((s) => {
    const t = toolIndex.get(s);
    return t
      ? [{ name: t.name, href: `/tools/${t.cat}/${s}`, description: t.description }]
      : [];
  });
  return {
    slug: data.slug || file.replace(/\.md$/, ""),
    title: data.title || "Guide",
    description: data.description || "",
    date: String(data.date || "2026-01-01"),
    updated: String(data.updated || data.date || "2026-01-01"),
    readingTime: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
    tools,
    html: marked.parse(content) as string,
  };
}

let cache: Guide[] | null = null;

/** Todos os guias, do mais novo para o mais antigo */
export function getAllGuides(): Guide[] {
  if (cache) return cache;
  const toolIndex = new Map<
    string,
    { name: string; description: string; cat: string }
  >();
  for (const t of getAllTools()) {
    toolIndex.set(t.slug, {
      name: t.name,
      description: t.description,
      cat: t.categorySlug,
    });
  }
  const files = fs.existsSync(GUIDES_DIR)
    ? fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".md"))
    : [];
  cache = files
    .map((f) => parseFile(f, toolIndex))
    .filter((g): g is Guide => g !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
