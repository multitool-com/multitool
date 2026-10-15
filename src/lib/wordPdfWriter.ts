/**
 * Word → PDF writer.
 *
 * Lays out the neutral block model produced by `wordDocument.ts` onto real PDF
 * pages with pdf-lib: A4/Letter/Legal, configurable margins and body size,
 * headings, bullet/numbered lists, tables with borders and header shading,
 * embedded images, page breaks, page numbers and an optional running header.
 *
 * The writer never fails on odd characters: pdf-lib's built-in fonts speak
 * WinAnsi, so text is transliterated first (→ becomes "->", ✓ becomes "v") and
 * the count of dropped glyphs is reported instead of silently losing content.
 */

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import type { WordBlock, WordDocumentModel, WordParagraph, WordParagraphStyle, WordRun } from "./wordDocument";

export type PageSizeId = "a4" | "letter" | "legal";
export type MarginId = "narrow" | "normal" | "wide";

export interface WordPdfOptions {
  pageSize: PageSizeId;
  margins: MarginId;
  /** Base body size in points (headings scale from it). */
  bodySize: number;
  pageNumbers: boolean;
  /** Running header with the document title. */
  runningHeader: boolean;
  /** Include embedded images. */
  images: boolean;
}

export const DEFAULT_WORD_PDF_OPTIONS: WordPdfOptions = {
  pageSize: "a4",
  margins: "normal",
  bodySize: 11,
  pageNumbers: true,
  runningHeader: false,
  images: true,
};

export interface WordPdfResult {
  bytes: Uint8Array;
  pages: number;
  /** Characters that had no WinAnsi equivalent and were replaced or dropped. */
  replacedChars: number;
  droppedChars: number;
}

const PAGE_SIZES: Record<PageSizeId, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  legal: [612, 1008],
};

const MARGINS: Record<MarginId, number> = {
  narrow: 36,
  normal: 56,
  wide: 85,
};

/* ------------------------------------------------------------------ */
/* WinAnsi text preparation                                            */
/* ------------------------------------------------------------------ */

/**
 * Characters Windows-1252 (what the built-in PDF fonts speak) can encode but
 * that live above Latin-1. Everything here survives the trip untouched.
 */
const WINANSI_EXTRA = new Set<number>([
  0x20ac, // €
  0x201a, 0x201e, 0x2026, // ‚ „ …
  0x2020, 0x2021, 0x2030, // † ‡ ‰
  0x02c6, 0x02dc, // ˆ ˜
  0x0160, 0x0161, 0x017d, 0x017e, 0x0152, 0x0153, 0x0178, // Š š Ž ž Œ œ Ÿ
  0x2018, 0x2019, 0x201c, 0x201d, // ‘ ’ “ ”
  0x2022, 0x2013, 0x2014, 0x2122, 0x2039, 0x203a, 0x0192, // • – — ™ ‹ › ƒ
]);

/** Glyphs outside WinAnsi that have an honest plain-text equivalent. */
const REPLACEMENTS: [RegExp, string][] = [
  [/\u00a0/g, " "], // no-break space
  [/\u2015|\u2212/g, "\u2014"], // horizontal bar / minus → em dash
  [/[\u2023\u2043\u25aa\u25cf\u25a0\u25e6]/g, "\u2022"], // other bullets → •
  [/\u2192/g, "->"],
  [/\u2190/g, "<-"],
  [/\u21d2/g, "=>"],
  [/\u21d4/g, "<=>"],
  [/\u2264/g, "<="],
  [/\u2265/g, ">="],
  [/\u2260/g, "!="],
  [/\u2248/g, "~"],
  [/[\u2713\u2714\u2611\u2612]/g, "v"],
  [/[\u2717\u2718\u2715\u2716]/g, "x"],
  [/\u2610/g, "[ ]"],
  [/\u00ad/g, ""], // soft hyphen
  [/[\u2500-\u257f]/g, "-"], // box drawing
  [/[\u25b2\u25b4\u2191]/g, "^"],
  [/[\u25bc\u25be\u2193]/g, "v"],
  [/\u2032/g, "'"],
  [/\u2033/g, '"'],
];

/**
 * Returns text the built-in PDF fonts can encode, plus how many characters were
 * substituted or dropped. Nothing else in the pipeline needs to care.
 */
export function prepareTextForPdf(input: string): { text: string; replaced: number; dropped: number } {
  let replaced = 0;
  let text = input;
  for (const [pattern, value] of REPLACEMENTS) {
    text = text.replace(pattern, () => {
      replaced += 1;
      return value;
    });
  }

  let dropped = 0;
  let out = "";
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (char === "\n" || char === "\t" || (code >= 0x20 && code <= 0x7e)) {
      out += char;
    } else if (code >= 0xa0 && code <= 0xff) {
      out += char; // Latin-1 is inside WinAnsi
    } else if (WINANSI_EXTRA.has(code)) {
      out += char; // typographic punctuation, €, ™, …
    } else {
      dropped += 1; // emoji, CJK, math symbols: the built-in fonts cannot draw them
    }
  }

  return { text: out.replace(/\t/g, "    "), replaced, dropped };
}

/* ------------------------------------------------------------------ */
/* Style scale                                                         */
/* ------------------------------------------------------------------ */

interface TextStyle {
  sizeDelta: number;
  bold?: boolean;
  italic?: boolean;
  before: number;
  after: number;
  lineHeight: number;
  gray?: boolean;
  align?: "left" | "center" | "right" | "justify";
}

function styleSpec(style: WordParagraphStyle): TextStyle {
  switch (style) {
    case "title":
      return { sizeDelta: 15, bold: true, before: 0, after: 10, lineHeight: 1.2 };
    case "subtitle":
      return { sizeDelta: 3, before: 0, after: 16, lineHeight: 1.35, gray: true };
    case "h1":
      return { sizeDelta: 8, bold: true, before: 20, after: 8, lineHeight: 1.25 };
    case "h2":
      return { sizeDelta: 4.5, bold: true, before: 16, after: 7, lineHeight: 1.3 };
    case "h3":
      return { sizeDelta: 2, bold: true, before: 13, after: 6, lineHeight: 1.3 };
    case "h4":
      return { sizeDelta: 1, bold: true, before: 11, after: 5, lineHeight: 1.35 };
    case "h5":
      return { sizeDelta: 0.5, bold: true, before: 10, after: 4, lineHeight: 1.4 };
    case "h6":
      return { sizeDelta: 0, bold: true, italic: true, before: 10, after: 4, lineHeight: 1.4 };
    case "quote":
      return { sizeDelta: 0, italic: true, before: 6, after: 10, lineHeight: 1.45, gray: true };
    case "caption":
      return { sizeDelta: -1.5, before: 4, after: 10, lineHeight: 1.35, gray: true, align: "center" };
    default:
      return { sizeDelta: 0, before: 0, after: 8, lineHeight: 1.45 };
  }
}

function isHeadingStyle(style: WordParagraphStyle): boolean {
  return /^h[1-6]$/.test(style) || style === "title";
}

/* ------------------------------------------------------------------ */
/* Font book                                                           */
/* ------------------------------------------------------------------ */

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
  mono: PDFFont;
  monoBold: PDFFont;
}

interface StyledRun {
  text: string;
  font: PDFFont;
  size: number;
  color: ReturnType<typeof rgb>;
}

/* ------------------------------------------------------------------ */
/* Writer                                                              */
/* ------------------------------------------------------------------ */

class PdfWriter {
  private doc!: PDFDocument;
  private fonts!: Fonts;
  private page!: PDFPage;
  private y = 0;
  private contentWidth = 0;
  private contentHeight = 0;
  private readonly pageSize: [number, number];
  private readonly margin: number;
  private readonly base: number;
  private readonly options: WordPdfOptions;
  private replacedChars = 0;
  private droppedChars = 0;
  private currentTitle = "";

  constructor(options: WordPdfOptions) {
    this.options = options;
    this.pageSize = PAGE_SIZES[options.pageSize];
    this.margin = MARGINS[options.margins];
    this.base = options.bodySize;
    this.contentWidth = this.pageSize[0] - this.margin * 2;
    this.contentHeight = this.pageSize[1] - this.margin * 2;
  }

  async render(model: WordDocumentModel): Promise<WordPdfResult> {
    this.doc = await PDFDocument.create();
    this.currentTitle = model.title ?? "Document";
    this.fonts = {
      regular: await this.doc.embedFont(StandardFonts.Helvetica),
      bold: await this.doc.embedFont(StandardFonts.HelveticaBold),
      italic: await this.doc.embedFont(StandardFonts.HelveticaOblique),
      boldItalic: await this.doc.embedFont(StandardFonts.HelveticaBoldOblique),
      mono: await this.doc.embedFont(StandardFonts.Courier),
      monoBold: await this.doc.embedFont(StandardFonts.CourierBold),
    };

    this.addPage();

    for (const block of model.blocks) {
      if (block.kind === "paragraph") this.drawParagraph(block);
      else if (block.kind === "table") this.drawTable(block);
      else if (block.kind === "image") await this.drawImage(block);
      else if (block.kind === "page-break") this.addPage();
    }

    this.drawFurniture();

    this.doc.setTitle(this.sanitize(this.currentTitle).text);
    this.doc.setProducer("MultiTool — Word to PDF (browser)");
    this.doc.setCreator("MultiTool");
    this.doc.setCreationDate(new Date());
    this.doc.setModificationDate(new Date());

    const bytes = await this.doc.save();
    return {
      bytes,
      pages: this.doc.getPageCount(),
      replacedChars: this.replacedChars,
      droppedChars: this.droppedChars,
    };
  }

  /* ---------------- text preparation ---------------- */

  private sanitize(input: string): { text: string; replaced: number; dropped: number } {
    const result = prepareTextForPdf(input);
    this.replacedChars += result.replaced;
    this.droppedChars += result.dropped;
    return result;
  }

  /* ---------------- page handling ---------------- */

  private addPage(): void {
    this.page = this.doc.addPage(this.pageSize);
    this.y = this.pageSize[1] - this.margin;
  }

  /** Adds a page when the next block would not fit. */
  private ensure(height: number): void {
    if (this.y - height < this.margin) this.addPage();
  }

  private drawFurniture(): void {
    const pages = this.doc.getPages();
    pages.forEach((page, index) => {
      if (this.options.runningHeader && this.currentTitle) {
        const header = this.sanitize(this.currentTitle).text;
        const size = 8;
        const width = this.fonts.regular.widthOfTextAtSize(header, size);
        if (width < this.contentWidth) {
          page.drawText(header, {
            x: this.margin,
            y: this.pageSize[1] - this.margin + 22,
            size,
            font: this.fonts.regular,
            color: rgb(0.45, 0.45, 0.45),
          });
          page.drawLine({
            start: { x: this.margin, y: this.pageSize[1] - this.margin + 16 },
            end: { x: this.pageSize[0] - this.margin, y: this.pageSize[1] - this.margin + 16 },
            thickness: 0.4,
            color: rgb(0.8, 0.8, 0.8),
          });
        }
      }

      if (this.options.pageNumbers) {
        const label = `${index + 1} / ${pages.length}`;
        const size = 8.5;
        const width = this.fonts.regular.widthOfTextAtSize(label, size);
        page.drawText(label, {
          x: this.pageSize[0] / 2 - width / 2,
          y: this.margin - 26,
          size,
          font: this.fonts.regular,
          color: rgb(0.45, 0.45, 0.45),
        });
      }
    });
  }

  /* ---------------- inline layout ---------------- */

  private fontFor(run: WordRun, spec: TextStyle): PDFFont {
    if (run.mono) return run.bold ? this.fonts.monoBold : this.fonts.mono;
    const bold = run.bold ?? spec.bold ?? false;
    const italic = run.italic ?? spec.italic ?? false;
    if (bold && italic) return this.fonts.boldItalic;
    if (bold) return this.fonts.bold;
    if (italic) return this.fonts.italic;
    return this.fonts.regular;
  }

  private runSize(run: WordRun, spec: TextStyle): number {
    // Headings scale from the document structure, not from local formatting.
    const base = this.base + spec.sizeDelta;
    if (run.size && spec.sizeDelta === 0) {
      const scaled = Math.min(this.base * 1.6, Math.max(this.base * 0.75, run.size));
      return Number.isFinite(scaled) ? scaled : base;
    }
    return base;
  }

  /** Turns runs into styled runs, splitting on explicit line breaks. */
  private toStyledRuns(paragraph: WordParagraph, spec: TextStyle, sizeOverride?: number): StyledRun[][] {
    const color = spec.gray ? rgb(0.38, 0.4, 0.38) : rgb(0.11, 0.12, 0.11);
    const lines: StyledRun[][] = [[]];

    for (const run of paragraph.runs) {
      const size = sizeOverride ?? this.runSize(run, spec);
      const font = this.fontFor(run, spec);
      const prepared = this.sanitize(run.text).text;
      const parts = prepared.split("\n");
      parts.forEach((part, index) => {
        if (index > 0) lines.push([]);
        if (part === "") return;
        lines[lines.length - 1].push({
          text: part,
          font,
          size,
          color: spec.gray && run.bold ? rgb(0.28, 0.3, 0.28) : color,
        });
      });
    }

    return lines.filter((line) => line.length > 0);
  }

  /** Wraps styled runs to a width, producing lines ready to be drawn. */
  private wrapRuns(runs: StyledRun[], maxWidth: number): StyledRun[][] {
    const lines: StyledRun[][] = [];
    let current: StyledRun[] = [];
    let currentWidth = 0;

    const pushCurrent = () => {
      if (current.length) lines.push(current);
      current = [];
      currentWidth = 0;
    };

    for (const run of runs) {
      const words = run.text.split(/(\s+)/); // keep the spaces as their own tokens
      for (const token of words) {
        if (token === "") continue;
        const tokenWidth = run.font.widthOfTextAtSize(token, run.size);

        if (/^\s+$/.test(token)) {
          if (current.length) {
            const last = current[current.length - 1];
            if (last.font === run.font && last.size === run.size) last.text += token;
            else current.push({ ...run, text: token });
            currentWidth += tokenWidth;
          }
          continue;
        }

        if (currentWidth + tokenWidth > maxWidth && currentWidth > 0) {
          // trim the trailing space before breaking
          const last = current[current.length - 1];
          if (last && /^\s+$/.test(last.text)) {
            currentWidth -= last.font.widthOfTextAtSize(last.text, last.size);
            current.pop();
          }
          pushCurrent();
        }

        const previous = current[current.length - 1];
        if (previous && previous.font === run.font && previous.size === run.size) {
          previous.text += token;
        } else {
          current.push({ ...run, text: token });
        }
        currentWidth += tokenWidth;
      }
    }
    pushCurrent();
    return lines.length ? lines : [[]];
  }

  private lineHeight(runs: StyledRun[], multiplier: number): number {
    let size = this.base;
    for (const run of runs) size = Math.max(size, run.size);
    return size * multiplier;
  }

  private drawLine(runs: StyledRun[], x: number, y: number, align: TextStyle["align"], maxWidth: number): void {
    if (!runs.length) return;
    const width = runs.reduce((acc, run) => acc + run.font.widthOfTextAtSize(run.text, run.size), 0);
    let cursor = x;
    if (align === "center") cursor = x + (maxWidth - width) / 2;
    else if (align === "right") cursor = x + (maxWidth - width);

    for (const run of runs) {
      if (run.text.trim() !== "") {
        this.page.drawText(run.text, { x: cursor, y, size: run.size, font: run.font, color: run.color });
      }
      cursor += run.font.widthOfTextAtSize(run.text, run.size);
    }
  }

  /* ---------------- paragraphs ---------------- */

  private drawParagraph(paragraph: WordParagraph): void {
    const spec = styleSpec(paragraph.style);
    const listIndent = paragraph.list ? 16 + paragraph.list.level * 16 : 0;
    const maxWidth = this.contentWidth - listIndent - (paragraph.style === "quote" ? 14 : 0);

    const sourceLines = this.toStyledRuns(paragraph, spec);
    const lines: StyledRun[][] = [];
    for (const sourceLine of sourceLines) lines.push(...this.wrapRuns(sourceLine, maxWidth));

    const before = Math.max(spec.before, paragraph.spaceBefore ?? 0);
    const after = Math.max(spec.after, paragraph.spaceAfter ?? 0);
    const firstLineHeight = this.lineHeight(lines[0] ?? [], spec.lineHeight);
    const blockHeight = lines.reduce((acc, line) => acc + this.lineHeight(line, spec.lineHeight), 0);

    // keep a heading attached to its first lines instead of orphaning it
    const keepWith = isHeadingStyle(paragraph.style) ? 40 : firstLineHeight;
    this.ensure(before + Math.min(keepWith, blockHeight) + 2);

    this.y -= before;

    lines.forEach((line, index) => {
      const height = this.lineHeight(line, spec.lineHeight);
      this.ensure(height + 2);
      this.y -= height;

      const x = this.margin + listIndent + (paragraph.style === "quote" ? 14 : 0);
      this.drawLine(line, x, this.y + height * 0.22, paragraph.align ?? spec.align, maxWidth);

      if (paragraph.style === "quote" && index === 0) {
        this.page.drawLine({
          start: { x: this.margin + 2, y: this.y + height },
          end: { x: this.margin + 2, y: this.y + 2 },
          thickness: 2,
          color: rgb(0.85, 0.85, 0.85),
        });
      }

      if (index === 0 && paragraph.list) {
        const marker = this.sanitize(paragraph.list.marker).text;
        const size = this.base;
        const markerFont = paragraph.list.ordered ? this.fonts.regular : this.fonts.bold;
        const markerWidth = markerFont.widthOfTextAtSize(marker, size);
        this.page.drawText(marker, {
          x: this.margin + listIndent - Math.max(12, markerWidth + 4),
          y: this.y + height * 0.22,
          size,
          font: markerFont,
          color: rgb(0.11, 0.12, 0.11),
        });
      }
    });

    this.y -= after;
  }

  /* ---------------- tables ---------------- */

  private drawTable(table: { rows: { header: boolean; cells: { span: number; blocks: WordParagraph[] }[] }[] }): void {
    if (table.rows.length === 0) return;

    const gridColumns = Math.max(
      1,
      ...table.rows.map((row) => row.cells.reduce((acc, cell) => acc + cell.span, 0))
    );

    // ---- preferred widths from the longest text of each column ----
    const preferred = new Array(gridColumns).fill(30);
    for (const row of table.rows) {
      let column = 0;
      for (const cell of row.cells) {
        const width = this.measureBlocks(cell.blocks, this.base);
        for (let i = 0; i < cell.span && column + i < gridColumns; i++) {
          preferred[column + i] = Math.max(preferred[column + i], width / cell.span + 12);
        }
        column += cell.span;
      }
    }

    const padding = 5;
    const totalPreferred = preferred.reduce((acc, value) => acc + value, 0);
    const widths: number[] = [];
    for (let i = 0; i < gridColumns; i++) {
      const share = (preferred[i] / totalPreferred) * (this.contentWidth - padding * 2 * gridColumns);
      widths.push(Math.max(this.contentWidth / (gridColumns * 2.6), share) + padding * 2);
    }
    const scale = (this.contentWidth - 2) / widths.reduce((acc, value) => acc + value, 0);
    for (let i = 0; i < widths.length; i++) widths[i] = widths[i] * scale;

    const borderColor = rgb(0.72, 0.74, 0.72);
    const headerFill = rgb(0.94, 0.94, 0.92);

    const drawRow = (row: { header: boolean; cells: { span: number; blocks: WordParagraph[] }[] }, repeat: boolean) => {
      // ---- layout the row: wrap every cell first ----
      const cellLines: { lines: StyledRun[][]; height: number; span: number }[] = [];
      let rowHeight = 0;
      let column = 0;

      for (const cell of row.cells) {
        const span = Math.min(cell.span, gridColumns - column);
        const width = widths.slice(column, column + span).reduce((acc, value) => acc + value, 0);
        const spec: TextStyle = { sizeDelta: -0.5, before: 0, after: 0, lineHeight: 1.32, bold: row.header };
        const lines: StyledRun[][] = [];
        for (const block of cell.blocks) {
          const sourceLines = this.toStyledRuns(
            row.header
              ? { ...block, runs: block.runs.map((run) => ({ ...run, bold: true })) }
              : block,
            spec
          );
          for (const sourceLine of sourceLines) lines.push(...this.wrapRuns(sourceLine, width - padding * 2));
        }
        const height = lines.reduce((acc, line) => acc + this.lineHeight(line, spec.lineHeight), 0);
        cellLines.push({ lines, height, span });
        rowHeight = Math.max(rowHeight, height + padding * 2);
        column += span;
      }

      if (repeat) {
        this.ensure(rowHeight + 4);
      } else {
        this.ensure(Math.min(rowHeight, 24) + 4);
        if (this.y - rowHeight < this.margin) this.addPage();
      }

      const top = this.y;
      const bottom = top - rowHeight;

      let x = this.margin;
      let index = 0;
      for (const cell of cellLines) {
        const width = widths.slice(index, index + cell.span).reduce((acc, value) => acc + value, 0);
        if (row.header) {
          this.page.drawRectangle({
            x,
            y: bottom,
            width,
            height: rowHeight,
            color: headerFill,
          });
        }
        this.page.drawRectangle({
          x,
          y: bottom,
          width,
          height: rowHeight,
          borderColor,
          borderWidth: 0.5,
        });

        let textY = top - padding;
        for (const line of cell.lines) {
          const height = this.lineHeight(line, 1.32);
          textY -= height;
          this.drawLine(line, x + padding, textY + height * 0.22, "left", width - padding * 2);
        }
        x += width;
        index += cell.span;
      }

      this.y = bottom;
    };

    drawRow(table.rows[0], true);
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      // repeated header when the table crosses a page
      if (this.y - 30 < this.margin && table.rows[0] !== row) {
        this.addPage();
        drawRow(table.rows[0], true);
      }
      drawRow(row, false);
    }

    this.y -= 12;
  }

  private measureBlocks(blocks: WordParagraph[], size: number): number {
    let width = 0;
    for (const block of blocks) {
      const text = block.runs.map((run) => this.sanitize(run.text).text).join("");
      for (const line of text.split("\n")) {
        width = Math.max(width, this.fonts.regular.widthOfTextAtSize(line, size));
      }
    }
    return width;
  }

  /* ---------------- images ---------------- */

  private async drawImage(block: { data: Uint8Array; mime: "image/png" | "image/jpeg"; widthPt: number; heightPt: number }): Promise<void> {
    if (!this.options.images) return;

    let image: PDFImage;
    try {
      image = block.mime === "image/png" ? await this.doc.embedPng(block.data) : await this.doc.embedJpg(block.data);
    } catch {
      // A corrupt or exotic file should not abort the whole conversion.
      this.sanitize("[imagem ignorada]");
      this.y -= 18;
      return;
    }

    const naturalWidth = block.widthPt > 1 ? block.widthPt : image.width;
    const naturalHeight = block.heightPt > 1 ? block.heightPt : image.height;
    const aspect = naturalHeight / naturalWidth;

    let width = Math.min(naturalWidth, this.contentWidth);
    let height = width * aspect;
    const maxHeight = this.contentHeight * 0.72;
    if (height > maxHeight) {
      height = maxHeight;
      width = height / aspect;
    }

    this.ensure(height + 12);
    this.y -= height + 6;
    this.page.drawImage(image, {
      x: this.margin + (this.contentWidth - width) / 2,
      y: this.y,
      width,
      height,
    });
    this.y -= 6;
  }
}

/**
 * Renders the document model as PDF bytes.
 * Pure function of (model, options) — the caller does the file reading.
 */
export async function renderWordToPdf(
  model: WordDocumentModel,
  options: Partial<WordPdfOptions> = {}
): Promise<WordPdfResult> {
  const writer = new PdfWriter({ ...DEFAULT_WORD_PDF_OPTIONS, ...options });
  return writer.render(model);
}

/** Short plain-text preview used by the interface before downloading. */
export function modelToPreview(model: WordDocumentModel, maxChars = 1200): string {
  const parts: string[] = [];
  let length = 0;

  const pushParagraph = (paragraph: WordParagraph) => {
    const text = paragraph.runs.map((run) => run.text).join("").trim();
    if (!text) return;
    const prefix = paragraph.list ? `${paragraph.list.marker} ` : "";
    const line = `${prefix}${text}`;
    parts.push(line);
    length += line.length;
  };

  for (const block of model.blocks) {
    if (length > maxChars) break;
    if (block.kind === "paragraph") pushParagraph(block);
    else if (block.kind === "table") {
      for (const row of block.rows) {
        const cells = row.cells.map((cell) => cell.blocks.map((b) => b.runs.map((r) => r.text).join("")).join(" "));
        const line = cells.join(" | ");
        parts.push(line);
        length += line.length;
      }
    } else if (block.kind === "image") {
      parts.push("[imagem]");
      length += 9;
    }
  }

  const text = parts.join("\n");
  return text.length > maxChars ? `${text.slice(0, maxChars)}…` : text;
}
