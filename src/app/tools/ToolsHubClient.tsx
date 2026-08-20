"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface HubTool {
  slug: string;
  name: string;
  description: string;
  catSlug: string;
  catName: string;
}

export interface HubCat {
  slug: string;
  name: string;
  short: string;
}

export default function ToolsHubClient({
  tools,
  categories,
}: {
  tools: HubTool[];
  categories: HubCat[];
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (cat !== "all" && t.catSlug !== cat) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.catName.toLowerCase().includes(q)
      );
    });
  }, [tools, query, cat]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools… (e.g. pdf, image, json, converter)"
          aria-label="Search tools"
          className="w-full bg-white border border-ink/15 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat("all")}
            className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
              cat === "all"
                ? "bg-deep text-paper"
                : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            ALL ({tools.length})
          </button>
          {categories.map((c) => {
            const n = tools.filter((t) => t.catSlug === c.slug).length;
            return (
              <button
                key={c.slug}
                onClick={() => setCat(c.slug)}
                className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                  cat === c.slug
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                {c.short.toUpperCase()} ({n})
              </button>
            );
          })}
        </div>
        <p className="font-mono text-xs text-ink/40">
          {filtered.length} TOOL{filtered.length === 1 ? "" : "S"}
          {query && ` MATCHING “${query.trim()}”`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-ink/10 rounded-xl p-10 text-center">
          <p className="font-mono text-xs text-ink/40 mb-4">
            NO TOOLS FOUND — TRY ANOTHER TERM OR CATEGORY
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.catSlug}/${t.slug}`}
              className="group bg-white border border-ink/10 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all"
            >
              <p className="font-mono text-[10px] tracking-widest text-ink/30 mb-2">
                {t.catName.toUpperCase()}
              </p>
              <h2 className="font-display font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                {t.name}
              </h2>
              <p className="text-sm text-ink/60 line-clamp-2">{t.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
