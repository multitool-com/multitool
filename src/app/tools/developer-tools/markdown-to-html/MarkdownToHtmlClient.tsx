"use client";

import { useMemo, useState } from "react";

// ---------- Markdown parser (subset sólido, sem dependências) ----------
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ESC[c as keyof typeof ESC]);
}

function sanitizeUrl(url: string): string {
  const u = url.trim();
  if (/^\s*(javascript|data|vbscript):/i.test(u)) return "#";
  return esc(u);
}

/** Inline: code `x`, bold **x**, italic *x*, strike ~~x~~, links [t](u), images ![a](u) */
function inline(md: string): string {
  let s = esc(md);
  // images first: ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, alt, url) => {
    return `<img src="${sanitizeUrl(url)}" alt="${esc(alt)}" loading="lazy" />`;
  });
  // links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, text, url) => {
    return `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });
  // inline code (before bold/italic so * inside code is safe)
  s = s.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);
  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  // strikethrough
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  return s;
}

/** Block-level parser: headings, hr, code fences, blockquotes, lists, paragraphs. */
export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (!listType) return;
    const tag = listType;
    out.push(`<${tag}>\n${listItems.map((li) => `  <li>${li}</li>`).join("\n")}\n</${tag}>`);
    listType = null;
    listItems = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    // code fence
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flushList();
      const lang = esc(fence[1]);
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      const attrs = lang ? ` class="language-${lang}"` : "";
      out.push(`<pre><code${attrs}>${esc(code.join("\n"))}</code></pre>`);
      continue;
    }

    // hr
    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) {
      flushList();
      out.push("<hr />");
      i++;
      continue;
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushList();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // blockquote (uma ou mais linhas)
    if (/^\s*>\s?/.test(line)) {
      flushList();
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>\n  <p>${inline(quote.join(" "))}</p>\n</blockquote>`);
      continue;
    }

    // unordered list
    const ul = line.match(/^\s*[-+*]\s+(.*)$/);
    // ordered list
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      const type: "ul" | "ol" = ul ? "ul" : "ol";
      const content = (ul ? ul[1] : ol![1]);
      if (listType !== type) {
        flushList();
        listType = type;
      }
      listItems.push(inline(content));
      i++;
      continue;
    }

    // blank line
    if (/^\s*$/.test(line)) {
      flushList();
      i++;
      continue;
    }

    // paragraph (agrupa linhas consecutivas)
    flushList();
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*[-+*]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^\s*([-*_])\s*(\1\s*){2,}$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }

  flushList();
  return out.join("\n\n");
}

const DEFAULT_MD = `# Hello, Markdown!

This **tool** converts *Markdown* to HTML instantly. ~~Try it~~.

## Features

- Headings (h1 to h6)
- Bold, *italic*, \`inline code\` and [links](https://multitoolbox.online)
- Ordered lists:
1. One
2. Two
3. Three

> A blockquote for emphasis.

\`\`\`js
function hello() {
  return "world";
}
\`\`\`

---

Made with care. Your text never leaves your browser.`;

export default function MarkdownToHtmlClient() {
  const [md, setMd] = useState(DEFAULT_MD);
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => markdownToHtml(md), [md]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="md-input" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            MARKDOWN
          </label>
          <textarea
            id="md-input"
            value={md}
            onChange={(e) => setMd(e.target.value)}
            rows={14}
            spellCheck={false}
            className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          />
        </div>
        <div>
          <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">PREVIEW</div>
          <div className="w-full border border-ink/15 rounded-lg px-4 py-3 bg-paper text-sm text-ink/80 prose-preview min-h-[21rem] overflow-auto">
            <div
              className="[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:font-semibold [&_h1]:mb-2 [&_h2]:mb-2 [&_h3]:mb-2 [&_h4]:mb-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:mb-2 [&_ol]:mb-2 [&_li]:mb-0.5 [&_blockquote]:border-l-4 [&_blockquote]:border-accent/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:mb-2 [&_pre]:bg-deep [&_pre]:text-paper [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-auto [&_pre]:mb-2 [&_code]:bg-accent/10 [&_code]:px-1 [&_code]:rounded [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_a]:text-accent [&_a]:underline [&_hr]:my-3 [&_img]:max-w-full [&_img]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">HTML OUTPUT</div>
        <div className="relative">
          <textarea
            readOnly
            value={html}
            rows={8}
            spellCheck={false}
            className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs text-ink/80 focus:outline-none resize-y bg-paper"
          />
          <button
            type="button"
            onClick={() => copy(html)}
            className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            {copied ? "✓ COPIED" : "📋 COPY HTML"}
          </button>
        </div>
      </div>
    </div>
  );
}
