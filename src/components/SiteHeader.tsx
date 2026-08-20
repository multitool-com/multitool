"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE_CONFIG, categories } from "@/lib/tools";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="bg-deep sticky top-0 z-50" role="banner">
      <div className="relative max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${SITE_CONFIG.name} — Home`}
          className="font-display text-xl font-bold text-paper tracking-tight focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-deep rounded-md shrink-0"
        >
          Multi<span className="text-accent">Tool</span>
        </Link>

        <form
          action="/search"
          role="search"
          aria-label="Search tools"
          className="flex-1 max-w-md hidden md:block"
        >
          <label htmlFor="header-search" className="sr-only">
            Search tools
          </label>
          <input
            id="header-search"
            type="text"
            name="q"
            placeholder="Search tools..."
            aria-label="Search tools"
            className="w-full bg-paper/95 border border-transparent rounded-full px-4 py-1.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </form>

        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-3 text-xs font-medium"
        >
          <Link
            href="/tools"
            className="text-paper/75 hover:text-accent focus:outline-none focus:text-accent transition-colors whitespace-nowrap"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools/${cat.slug}`}
              className="text-paper/75 hover:text-accent focus:outline-none focus:text-accent transition-colors whitespace-nowrap"
            >
              {cat.shortName}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded-md border border-paper/20 shrink-0"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block w-5 h-0.5 bg-paper" />
          <span className="block w-5 h-0.5 bg-paper" />
          <span className="block w-5 h-0.5 bg-paper" />
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden bg-deep border-t border-paper/10 flex flex-col px-4 py-3"
        >
          <form action="/search" role="search" className="mb-3 md:hidden">
            <label htmlFor="mobile-search" className="sr-only">
              Search tools
            </label>
            <input
              id="mobile-search"
              type="text"
              name="q"
              placeholder="Search tools..."
              className="w-full bg-paper rounded-full px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </form>
          <Link
            href="/tools"
            className="py-2.5 text-accent font-semibold border-b border-paper/10"
          >
            All Tools
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools/${cat.slug}`}
              className="py-2.5 text-paper/85 hover:text-accent border-b border-paper/10 last:border-0"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}