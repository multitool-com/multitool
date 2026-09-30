/**
 * PDF → Markdown reconstruction engine.
 *
 * Pure module: no React, no DOM and no pdf.js. The client extracts positioned
 * text items from every page (pdf.js `getTextContent`) and hands them here.
 * This module then reconstructs structure that PDFs do not store natively:
 *
 *   1. groups items into visual lines (vertical position + font size),
 *   2. measures the document's body font size to guess heading levels,
 *   3. recognises bullet / numbered lists and monospace code runs,
 *   4. joins hard-wrapped lines back into paragraphs,
 *   5. removes running heads, footers and page numbers,
 *   6. renders Markdown with escaped line starts.
 *
 * Everything is deterministic given the same input items, which is why the
 * logic lives outside the component: it can be exercised in plain Node.
 */

/** One positioned piece of text as returned by pdf.js (already normalised). */
export interface PdfTextItem {
  /** The visible text of this item. */
  str: string;
  /** Left edge, in page units (PDF space, origin bottom-left). */
  x: number;
  /** Distance from the TOP of the page — smaller means higher up. */
  y: number;
  /** Advance width of the item, in page units. */
  width: number;
  /** Approximate font size (pdf.js `height`, absolute value). */
  height: number;
  /** Font family plus embedded font name, used for bold/italic/mono hints. */
  fontName?: string;
}

export interface PdfPageText {
  items: PdfTextItem[];
  /** Page size in PDF units (used to guess the header/footer zone). */
  width: number;
  height: number;
}

export interface PdfToMarkdownOptions {
  /** Guess heading levels from font size and short bold lines. */
  headings: boolean;
  /** Turn "•" / "1." / "a)" leads into real Markdown lists. */
  lists: boolean;
  /** Wrap monospace runs into fenced code blocks. */
  code: boolean;
  /** Join hard-wrapped lines back into flowing paragraphs. */
  joinWrapped: boolean;
  /** Drop running heads, footers and page numbers repeated across pages. */
  stripRunningHeads: boolean;
  /** Insert a horizontal rule (---) between pages. */
  pageBreaks: boolean;
  /** Prepend a YAML front-matter block with source metadata. */
  frontMatter: boolean;
}

export const DEFAULT_PDF_TO_MARKDOWN_OPTIONS: PdfToMarkdownOptions = {
  headings: true,
  lists: true,
  code: true,
  joinWrapped: true,
  stripRunningHeads: true,
  pageBreaks: false,
  frontMatter: false,
};

export interface PdfToMarkdownStats {
  pages: number;
  lines: number;
  headings: number;
  listItems: number;
  codeBlocks: number;
  words: number;
  chars: number;
}

export type PdfToMarkdownNote =
  | "no-text-layer"
  | "possibly-multi-column"
  | "possibly-table";

export interface PdfToMarkdownResult {
  markdown: string;
  stats: PdfToMarkdownStats;
  notes: PdfToMarkdownNote[];
}

export interface PdfToMarkdownMeta {
  /** Original file name, used by the front matter and by callers. */
  fileName?: string;
  /** Pre-formatted date (YYYY-MM-DD) — kept as a string to stay pure. */
  date?: string;
}

/** A visual line, after grouping and measurement. */
interface Line {
  text: string;
  size: number;
  boldFrac: number;
  mono: boolean;
  x: number;
  y: number;
  /** The original positioned items, kept for grid-accurate code recovery. */
  raw: RawItem[];
}

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; markers: string[]; items: string[] }
  | { kind: "code"; text: string };

/* ------------------------------------------------------------------ */
/* Text hints                                                          */
/* ------------------------------------------------------------------ */

const MONO_RE = /(mono|courier|consol|menlo|inconsolata|code|typewriter)/i;
const BOLD_RE = /(bold|black|heavy|semibold|demibold)/i;

/** Monospace font? */
export function isMonoFont(fontName?: string): boolean {
  return !!fontName && MONO_RE.test(fontName);
}

/** Weight, 0 or 1, used to decide a line is visually bold. */
function boldWeight(fontName?: string): number {
  return fontName && BOLD_RE.test(fontName) ? 1 : 0;
}

/** Bullet glyphs that PDF generators actually emit in front of list items. */
const BULLET_RE = /^([•▪▫◦‣∙·●○■□–—*+-])\s+(\S.*)$/;
/** "1." / "1)" / "a)" / "iv." numbering. */
const NUMBERED_RE = /^(\d{1,3}|[a-z]|[ivxlcdm]{1,5})[.)]\s+(\S.*)$/;

function matchListMarker(
  text: string
): { ordered: boolean; marker: string; rest: string } | null {
  const bullet = BULLET_RE.exec(text);
  if (bullet) {
    // Plain "-" or "*" leads that are really dashes are rare in PDFs; keep them.
    return { ordered: false, marker: "-", rest: bullet[2] };
  }
  const num = NUMBERED_RE.exec(text);
  if (num) {
    const raw = num[1];
    // Only Arabic numerals keep their printed number; "a)" style becomes bullets
    // so the output stays valid Markdown (no invented sequence).
    const ordered = /^\d+$/.test(raw);
    return { ordered, marker: ordered ? `${raw}.` : "-", rest: num[2] };
  }
  return null;
}

/** A single monospace line is only treated as code when it looks like code. */
const CODEISH_RE = /[{};=<>()[\]]|\/\/|#\s*$|^\s{2,}|\$ |=>/;

/* ------------------------------------------------------------------ */
/* Step 1 — items → visual lines                                       */
/* ------------------------------------------------------------------ */

interface RawItem extends PdfTextItem {
  fontName?: string;
}

function groupIntoLines(items: RawItem[]): RawItem[][] {
  const usable = items.filter((i) => i.str && i.str.trim() !== "");
  const sorted = [...usable].sort((a, b) => a.y - b.y || a.x - b.x);

  const groups: RawItem[][] = [];
  let current: RawItem[] = [];
  let currentY = 0;
  let currentSize = 0;
  let weight = 0;

  for (const item of sorted) {
    const size = Math.abs(item.height) || 10;
    if (current.length === 0) {
      current = [item];
      currentY = item.y;
      currentSize = size;
      weight = 1;
      continue;
    }
    const tolerance = Math.max(2, Math.max(currentSize, size) * 0.55);
    if (Math.abs(item.y - currentY) <= tolerance) {
      current.push(item);
      // incremental mean keeps the baseline stable while tolerating jitter
      currentY = (currentY * weight + item.y) / (weight + 1);
      currentSize = Math.max(currentSize, size);
      weight += 1;
    } else {
      groups.push(current);
      current = [item];
      currentY = item.y;
      currentSize = size;
      weight = 1;
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

/** Join the items of one visual line, inserting spaces from geometric gaps. */
function assembleLine(items: RawItem[]): Line {
  const ordered = [...items].sort((a, b) => a.x - b.x);
  let text = "";
  let prev: RawItem | null = null;
  let totalWidth = 0;
  let boldWidth = 0;
  let monoItems = 0;
  let size = 0;

  for (const item of ordered) {
    const itemSize = Math.abs(item.height) || 10;
    size = Math.max(size, itemSize);
    const w = Math.abs(item.width) || 0;
    totalWidth += w;
    boldWidth += w * boldWeight(item.fontName);
    if (isMonoFont(item.fontName)) monoItems += 1;

    if (prev) {
      const gap = item.x - (prev.x + Math.abs(prev.width));
      const spaceWidth = Math.max(itemSize, Math.abs(prev.height) || 10) * 0.22;
      if (gap > spaceWidth) text += " ";
    }
    text += item.str;
    prev = item;
  }

  const mono = monoItems === ordered.length;
  // Monospace lines keep their inner spacing (code alignment); the rest is
  // collapsed so PDF kerning artefacts do not leak into the Markdown.
  const cleaned = mono
    ? text.replace(/\s+$/, "")
    : text.replace(/\s+/g, " ").trim();

  return {
    text: cleaned,
    size: size || 10,
    boldFrac: totalWidth > 0 ? boldWidth / totalWidth : 0,
    mono,
    x: ordered[0]?.x ?? 0,
    y: ordered[0]?.y ?? 0,
    raw: ordered,
  };
}

/**
 * Rebuild monospace lines on their character grid.
 *
 * PDF has no spaces: indentation and alignment live in the x coordinates, so
 * we measure the character width of the run and place every item at its column.
 * That is what keeps `  const batch = queue.take(50);` indented after the trip.
 */
export function renderMonoRun(run: Line[]): string {
  const items = run.flatMap((line) => line.raw);
  if (!items.length) return "";

  const baseX = Math.min(...items.map((item) => item.x));
  const widths: number[] = [];
  for (const item of items) {
    if (item.str.trim().length >= 2 && item.str.length) {
      const perChar = Math.abs(item.width) / item.str.length;
      if (perChar > 0.5) widths.push(perChar);
    }
  }
  widths.sort((a, b) => a - b);
  const fallback = (run[0]?.size ?? 10) * 0.6;
  const charWidth = widths.length ? widths[Math.floor(widths.length / 2)] : fallback;
  if (!charWidth || !Number.isFinite(charWidth)) return run.map((l) => l.text).join("\n");

  return run
    .map((line) => {
      const chars: string[] = [];
      for (const item of line.raw) {
        if (!item.str.trim().length) continue; // pure spacing is rebuilt by the grid
        const column = Math.min(
          60,
          Math.max(0, Math.round((item.x - baseX) / charWidth))
        );
        while (chars.length < column) chars.push(" ");
        for (let i = 0; i < item.str.length; i++) {
          const index = column + i;
          if (index >= chars.length) chars.push(item.str[i]);
          else chars[index] = item.str[i];
        }
      }
      return chars.join("").replace(/\s+$/, "");
    })
    .join("\n");
}

/**
 * Layout warning: PDFs have no concept of paragraphs, columns or tables, so we
 * look at the horizontal structure of each line (how many well-separated
 * clusters of items it contains) to warn the user that the reading order may
 * need a light cleanup. Heuristic only — never blocks the conversion.
 */
function analyseLayout(
  pages: PdfPageText[],
  groupsPerPage: RawItem[][][]
): PdfToMarkdownNote[] {
  const notes = new Set<PdfToMarkdownNote>();
  let groups = 0;
  let twoColumnLines = 0;
  let multiClusterLines = 0;

  pages.forEach((page, index) => {
    const pageWidth = page.width || 612;
    for (const group of groupsPerPage[index]) {
      if (group.length < 2) {
        groups += 1;
        continue;
      }
      groups += 1;
      const size = group.reduce(
        (acc, i) => Math.max(acc, Math.abs(i.height) || 10),
        10
      );
      const gapMin = Math.max(size * 2.5, pageWidth * 0.04);
      const ordered = [...group].sort((a, b) => a.x - b.x);
      const clusters: { start: number; end: number }[] = [];
      for (const item of ordered) {
        const last = clusters[clusters.length - 1];
        if (!last || item.x - last.end > gapMin) {
          clusters.push({
            start: item.x,
            end: item.x + Math.abs(item.width),
          });
        } else {
          last.end = Math.max(last.end, item.x + Math.abs(item.width));
        }
      }
      if (clusters.length >= 3) multiClusterLines += 1;
      else if (clusters.length === 2 && clusters[1].start > pageWidth * 0.5) {
        twoColumnLines += 1;
      }
    }
  });

  if (groups >= 8) {
    if (twoColumnLines / groups >= 0.25) notes.add("possibly-multi-column");
    if (multiClusterLines / groups >= 0.2) notes.add("possibly-table");
  }
  return [...notes];
}

/** Weighted median of font sizes (weights = characters) ⇒ body text size. */
function estimateBodySize(lines: Line[]): number {
  const buckets = new Map<number, number>();
  for (const line of lines) {
    const key = Math.round(line.size * 2) / 2;
    buckets.set(key, (buckets.get(key) ?? 0) + line.text.length);
  }
  const entries = [...buckets.entries()].sort((a, b) => a[0] - b[0]);
  const total = entries.reduce((acc, [, w]) => acc + w, 0);
  if (total === 0) return 11;
  let acc = 0;
  for (const [size, w] of entries) {
    acc += w;
    if (acc >= total / 2) return size;
  }
  return entries[entries.length - 1]?.[0] ?? 11;
}

/* ------------------------------------------------------------------ */
/* Step 2 — running heads, footers and page numbers                    */
/* ------------------------------------------------------------------ */

function normalizeRunningText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/\s+/g, " ")
    .replace(/^[\s|·•-]+|[\s|·•-]+$/g, "")
    .trim();
}

const PAGE_NUMBER_RE =
  /^(page\s*)?\d{1,4}(\s*(of|\/|-|—)\s*\d{1,4})?(\s*page)?$/i;

function stripRunningHeadsAndFooters(pages: Line[][]): Line[][] {
  if (pages.length < 3) return pages;

  const candidatesPerPage = pages.map((lines) => {
    const indexes = new Set<number>();
    for (let i = 0; i < Math.min(2, lines.length); i++) indexes.add(i);
    for (let i = Math.max(0, lines.length - 2); i < lines.length; i++)
      indexes.add(i);
    return indexes;
  });

  const counts = new Map<string, number>();
  const sample = new Map<string, string>();
  pages.forEach((lines, p) => {
    for (const idx of candidatesPerPage[p]) {
      const key = normalizeRunningText(lines[idx]?.text ?? "");
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (!sample.has(key)) sample.set(key, lines[idx].text);
    }
  });

  const threshold = Math.max(3, Math.ceil(pages.length * 0.6));
  const running = new Set<string>();
  for (const [key, count] of counts) {
    if (count >= threshold) running.add(key);
    else if (PAGE_NUMBER_RE.test(key) && count >= 2) running.add(key);
  }
  if (running.size === 0) return pages;

  return pages.map((lines, p) =>
    lines.filter((line, idx) => {
      if (!candidatesPerPage[p].has(idx)) return true;
      return !running.has(normalizeRunningText(line.text));
    })
  );
}

/* ------------------------------------------------------------------ */
/* Step 3 — lines → blocks                                             */
/* ------------------------------------------------------------------ */

function headingLevel(line: Line, body: number): number {
  const ratio = line.size / body;
  if (ratio >= 1.5) return 1;
  if (ratio >= 1.23) return 2;
  if (ratio >= 1.08 && line.text.length <= 80) return 3;
  // Short bold lines at body size are the classic Word/Google Docs subheading.
  if (
    line.boldFrac >= 0.6 &&
    line.text.length <= 70 &&
    !/[.,;:]$/.test(line.text) &&
    !matchListMarker(line.text)
  )
    return 3;
  return 0;
}

function isHeading(
  line: Line,
  body: number,
  opts: PdfToMarkdownOptions
): number {
  if (!opts.headings || line.mono) return 0;
  return headingLevel(line, body);
}

/** Vertical rhythm of a page, used to tell line wraps from paragraph breaks. */
function medianGap(lines: Line[]): number {
  const gaps: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const gap = lines[i].y - lines[i - 1].y;
    if (gap > 0.5) gaps.push(gap);
  }
  if (!gaps.length) return 0;
  const sorted = gaps.sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function shouldJoin(prev: Line, next: Line, gap: number): boolean {
  const lineGap = next.y - prev.y;
  // Clearly more space than a normal line ⇒ new paragraph.
  if (gap > 0 && lineGap > gap * 1.55) return false;
  // Previous line ended a sentence ⇒ new paragraph.
  if (/[.!?]["')\]]?$/.test(prev.text.trim())) return false;
  return true;
}

function paragraphToBlocks(
  lines: Line[],
  start: number,
  body: number,
  opts: PdfToMarkdownOptions,
  gap: number
): { block: Block; next: number } {
  const first = lines[start];
  const parts: string[] = [first.text];
  let i = start + 1;
  while (i < lines.length) {
    const prev = lines[i - 1];
    const line = lines[i];
    if (isHeading(line, body, opts) || matchListMarker(line.text)) break;
    if (opts.code && line.mono) break;
    if (opts.joinWrapped) {
      if (!shouldJoin(prev, line, gap)) break;
      const last = parts[parts.length - 1];
      if (/-$/.test(last) && /^[a-zà-ÿ]/.test(line.text)) {
        // Soft hyphenation at a line wrap: "docu-\nment" ⇒ "document".
        parts[parts.length - 1] = `${last.replace(/-$/, "")}${line.text}`;
      } else {
        parts.push(line.text);
      }
    } else {
      parts.push(line.text);
    }
    i += 1;
  }

  const text = opts.joinWrapped ? parts.join(" ") : parts.join("  \n");
  return { block: { kind: "paragraph", text: text.trim() }, next: i };
}

function buildBlocks(
  lines: Line[],
  body: number,
  opts: PdfToMarkdownOptions
): Block[] {
  const blocks: Block[] = [];
  const gap = medianGap(lines);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.text.trim()) {
      i += 1;
      continue;
    }

    // ---- code fence -------------------------------------------------
    if (opts.code && line.mono) {
      const run: Line[] = [];
      while (
        i < lines.length &&
        lines[i].mono &&
        lines[i].text.trim() !== "" &&
        !isHeading(lines[i], body, opts)
      ) {
        run.push(lines[i]);
        i += 1;
      }
      const codeish = run.length >= 2 || CODEISH_RE.test(run[0]?.text ?? "");
      if (codeish) blocks.push({ kind: "code", text: renderMonoRun(run) });
      else blocks.push({ kind: "paragraph", text: run.map((l) => l.text).join(" ") });
      continue;
    }

    // ---- list -------------------------------------------------------
    const marker = opts.lists ? matchListMarker(line.text) : null;
    if (marker) {
      const items: string[] = [marker.rest.trim()];
      const markers: string[] = [marker.marker];
      const ordered = marker.ordered;
      i += 1;
      while (i < lines.length) {
        const next = lines[i];
        if (!next.text.trim()) break;
        const nextMarker = matchListMarker(next.text);
        if (nextMarker && nextMarker.ordered === ordered) {
          items.push(nextMarker.rest.trim());
          markers.push(nextMarker.marker);
          i += 1;
          continue;
        }
        if (nextMarker) break;
        if (isHeading(next, body, opts)) break;
        // Indented continuation of the previous item.
        const indent = next.x - line.x;
        if (indent > 3 && !next.mono) {
          if (opts.joinWrapped && !/[.!?]$/.test(items[items.length - 1])) {
            items[items.length - 1] += ` ${next.text}`;
          } else {
            items.push(next.text);
            markers.push("-");
          }
          i += 1;
          continue;
        }
        break;
      }
      blocks.push({ kind: "list", ordered, markers, items });
      continue;
    }

    // ---- heading ----------------------------------------------------
    const level = isHeading(line, body, opts);
    if (level > 0) {
      blocks.push({ kind: "heading", level, text: line.text.trim() });
      i += 1;
      continue;
    }

    // ---- paragraph --------------------------------------------------
    const { block, next } = paragraphToBlocks(lines, i, body, opts, gap);
    blocks.push(block);
    i = next;
  }

  return blocks;
}

/* ------------------------------------------------------------------ */
/* Step 4 — blocks → Markdown                                          */
/* ------------------------------------------------------------------ */

/** Escape characters that would start a different Markdown block. */
function escapeLineStart(text: string): string {
  return text
    .split("\n")
    .map((line) =>
      line.replace(/^(\s*)(#{1,6}\s|>|[|]|[-*+]\s|\d{1,3}[.)]\s)/, "$1\\$2")
    )
    .join("\n");
}

function renderBlocks(blocks: Block[]): string {
  const chunks: string[] = [];
  for (const block of blocks) {
    if (block.kind === "heading") {
      chunks.push(`${"#".repeat(block.level)} ${block.text}`);
    } else if (block.kind === "paragraph") {
      chunks.push(escapeLineStart(block.text));
    } else if (block.kind === "list") {
      // Unordered items become "-"; ordered items keep the numbers printed in
      // the PDF (so a list starting at 3 stays at 3).
      chunks.push(
        block.items
          .map((item, idx) =>
            block.ordered ? `${block.markers[idx] ?? `${idx + 1}.`} ${item}` : `- ${item}`
          )
          .join("\n")
      );
    } else if (block.kind === "code") {
      chunks.push(["```", block.text, "```"].join("\n"));
    }
  }
  return chunks.join("\n\n");
}

function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/* ------------------------------------------------------------------ */
/* Public entry point                                                  */
/* ------------------------------------------------------------------ */

/**
 * Convert positioned text items (one entry per page) into Markdown.
 *
 * The caller is responsible for extracting `items` with pdf.js — this function
 * performs no I/O, which keeps it deterministic and unit-testable.
 */
export function convertPdfTextToMarkdown(
  pages: PdfPageText[],
  options: Partial<PdfToMarkdownOptions> = {},
  meta: PdfToMarkdownMeta = {}
): PdfToMarkdownResult {
  const opts: PdfToMarkdownOptions = {
    ...DEFAULT_PDF_TO_MARKDOWN_OPTIONS,
    ...options,
  };

  const allItems = pages.flatMap((p) => p.items ?? []);
  const totalChars = allItems.reduce((acc, i) => acc + (i.str?.length ?? 0), 0);

  const notes = new Set<PdfToMarkdownNote>();
  if (totalChars < 20) notes.add("no-text-layer");

  // ---- line model per page ----------------------------------------
  const groupsPerPage = pages.map((page) => groupIntoLines(page.items ?? []));

  if (totalChars >= 20) {
    for (const note of analyseLayout(pages, groupsPerPage)) notes.add(note);
  }

  let pageLines: Line[][] = groupsPerPage.map((groups) =>
    groups.map(assembleLine)
  );

  if (opts.stripRunningHeads) {
    pageLines = stripRunningHeadsAndFooters(pageLines);
  }

  const body = estimateBodySize(pageLines.flat());

  const blocksPerPage = pageLines.map((lines) =>
    buildBlocks(lines, body, opts)
  );

  const sections: string[] = [];
  blocksPerPage.forEach((blocks, index) => {
    const rendered = renderBlocks(blocks).trim();
    if (!rendered) return;
    if (index > 0 && opts.pageBreaks) sections.push("---");
    sections.push(rendered);
  });

  let markdown = sections.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();

  const flatBlocks = blocksPerPage.flat();
  const listBlocks = flatBlocks.filter(
    (b): b is Extract<Block, { kind: "list" }> => b.kind === "list"
  );

  const stats: PdfToMarkdownStats = {
    pages: pages.length,
    lines: pageLines.reduce((acc, l) => acc + l.length, 0),
    headings: flatBlocks.filter((b) => b.kind === "heading").length,
    listItems: listBlocks.reduce((acc, b) => acc + b.items.length, 0),
    codeBlocks: flatBlocks.filter((b) => b.kind === "code").length,
    words: markdown ? markdown.split(/\s+/).filter(Boolean).length : 0,
    chars: markdown.length,
  };

  if (opts.frontMatter) {
    const lines = [
      "---",
      `title: ${yamlString(meta.fileName?.replace(/\.pdf$/i, "") ?? "Document")}`,
    ];
    if (meta.fileName) lines.push(`source: ${yamlString(meta.fileName)}`);
    lines.push(`pages: ${stats.pages}`);
    if (meta.date) lines.push(`extracted: ${meta.date}`);
    lines.push("---", "");
    markdown = `${lines.join("\n")}\n${markdown}`.trim();
    stats.chars = markdown.length;
  }

  return { markdown, stats, notes: [...notes] };
}

/** Text of a single page, useful for previews and quick checks. */
export function pageToPlainText(page: PdfPageText): string {
  return groupIntoLines(page.items ?? [])
    .map((group) => assembleLine(group).text)
    .join("\n");
}
