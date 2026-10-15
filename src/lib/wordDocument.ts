/**
 * Word document reader.
 *
 * Turns a .docx (OOXML, a ZIP of XML) or a legacy .doc (OLE2 container) into a
 * neutral block model that the PDF writer can lay out. Nothing here touches the
 * DOM or the network: the same code runs in the browser and in plain Node,
 * which is how the conversion is tested.
 *
 * Fidelity contract:
 *   .docx  — text, headings, bold/italic/underline, bullet and numbered lists,
 *            tables (with column spans), embedded PNG/JPEG images, page breaks.
 *   .doc   — text only, extracted from the WordDocument stream (piece table
 *            when present, plain fcMin/fcMac range or a text scan as fallback).
 *            Formatting of the legacy format is not reconstructed, and the
 *            reader says so in `warnings` instead of guessing.
 */

import JSZip from "jszip";
import { readCfb } from "./cfbReader";
import {
  attrLocal,
  childrenNamed,
  findFirst,
  findAll,
  firstChildNamed,
  localName,
  parseXml,
  valIsOn,
  type XmlNode,
} from "./xmlLite";

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

export interface WordRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  /** Font size in points, when the document states one. */
  size?: number;
  /** Monospace font detected (code snippets keep their look). */
  mono?: boolean;
}

export type WordParagraphStyle =
  | "body"
  | "title"
  | "subtitle"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "quote"
  | "caption";

export interface WordParagraph {
  kind: "paragraph";
  style: WordParagraphStyle;
  runs: WordRun[];
  align?: "left" | "center" | "right" | "justify";
  list?: { ordered: boolean; level: number; marker: string };
  spaceBefore?: number;
  spaceAfter?: number;
}

export interface WordImageBlock {
  kind: "image";
  data: Uint8Array;
  mime: "image/png" | "image/jpeg";
  widthPt: number;
  heightPt: number;
}

export interface WordPageBreak {
  kind: "page-break";
}

export interface WordTableCell {
  /** Number of grid columns this cell occupies (w:gridSpan). */
  span: number;
  blocks: WordParagraph[];
}

export interface WordTable {
  kind: "table";
  rows: { header: boolean; cells: WordTableCell[] }[];
}

export type WordBlock = WordParagraph | WordTable | WordImageBlock | WordPageBreak;

export interface WordDocumentModel {
  blocks: WordBlock[];
  source: "docx" | "doc";
  title?: string;
  warnings: string[];
  stats: {
    paragraphs: number;
    tables: number;
    images: number;
    /** Images present in the file but not embeddable (EMF/WMF/GIF/…). */
    skippedImages: number;
    words: number;
  };
}

export class WordReadError extends Error {}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function countWords(model: Pick<WordDocumentModel, "blocks">): number {
  let words = 0;
  const add = (text: string) => {
    words += text.split(/\s+/).filter(Boolean).length;
  };
  const visit = (blocks: WordBlock[]) => {
    for (const block of blocks) {
      if (block.kind === "paragraph") add(block.runs.map((r) => r.text).join(""));
      else if (block.kind === "table") {
        for (const row of block.rows) for (const cell of row.cells) visit(cell.blocks);
      }
    }
  };
  visit(model.blocks);
  return words;
}

function isZipFile(bytes: Uint8Array): boolean {
  return bytes[0] === 0x50 && bytes[1] === 0x4b;
}

function textOfRuns(runs: WordRun[]): string {
  return runs.map((run) => run.text).join("");
}

/* ------------------------------------------------------------------ */
/* .docx — styles and numbering                                        */
/* ------------------------------------------------------------------ */

interface StyleInfo {
  name: string;
  basedOn?: string;
  bold?: boolean;
  italic?: boolean;
  sizePt?: number;
  outlineLevel?: number;
  mono?: boolean;
}

type StyleMap = Map<string, StyleInfo>;

function readStyles(xml: string | null): { styles: StyleMap; defaultSize: number } {
  const styles: StyleMap = new Map();
  let defaultSize = 11;
  if (!xml) return { styles, defaultSize };

  const root = parseXml(xml);

  const docDefaults = findFirst(root, "docDefaults");
  if (docDefaults) {
    const rPr = findFirst(docDefaults, "rPr");
    const sz = rPr ? findFirst(rPr, "sz") : null;
    const half = sz ? Number(attrLocal(sz, "val")) : NaN;
    if (Number.isFinite(half) && half > 0) defaultSize = half / 2;
  }

  for (const styleNode of findAll(root, "style")) {
    const id = attrLocal(styleNode, "styleId");
    const type = attrLocal(styleNode, "type") ?? "paragraph";
    if (!id || type !== "paragraph") continue;
    const nameNode = firstChildNamed(styleNode, "name");
    const basedOn = firstChildNamed(styleNode, "basedOn");
    const pPr = firstChildNamed(styleNode, "pPr");
    const rPr = firstChildNamed(styleNode, "rPr");

    const info: StyleInfo = {
      name: nameNode ? attrLocal(nameNode, "val") ?? id : id,
      basedOn: basedOn ? attrLocal(basedOn, "val") ?? undefined : undefined,
    };

    if (rPr) {
      const bold = firstChildNamed(rPr, "b");
      const italic = firstChildNamed(rPr, "i");
      const sz = firstChildNamed(rPr, "sz");
      const fonts = firstChildNamed(rPr, "rFonts");
      if (bold) info.bold = valIsOn(bold);
      if (italic) info.italic = valIsOn(italic);
      if (sz) {
        const half = Number(attrLocal(sz, "val"));
        if (Number.isFinite(half) && half > 0) info.sizePt = half / 2;
      }
      if (fonts) {
        const family = `${attrLocal(fonts, "ascii") ?? ""} ${attrLocal(fonts, "hAnsi") ?? ""}`;
        if (/consol|courier|mono|menlo|inconsolata|code/i.test(family)) info.mono = true;
      }
    }

    if (pPr) {
      const outline = firstChildNamed(pPr, "outlineLvl");
      if (outline) {
        const level = Number(attrLocal(outline, "val"));
        if (Number.isFinite(level)) info.outlineLevel = level;
      }
    }

    styles.set(id, info);
  }

  // one level of inheritance is enough for the documents people convert
  for (const [id, info] of styles) {
    const parent = info.basedOn ? styles.get(info.basedOn) : undefined;
    if (!parent) continue;
    info.bold ??= parent.bold;
    info.italic ??= parent.italic;
    info.sizePt ??= parent.sizePt;
    info.outlineLevel ??= parent.outlineLevel;
    info.mono ??= parent.mono;
    if (!info.name || info.name === id) info.name = parent.name;
  }

  return { styles, defaultSize };
}

interface NumberingLevel {
  format: string;
  start: number;
}

type NumberingMap = Map<string, Map<number, NumberingLevel>>; // numId → level → info

function readNumbering(xml: string | null): NumberingMap {
  const numbering: NumberingMap = new Map();
  if (!xml) return numbering;

  const root = parseXml(xml);
  const abstract = new Map<string, Map<number, NumberingLevel>>();

  for (const node of findAll(root, "abstractNum")) {
    const id = attrLocal(node, "abstractNumId");
    if (id === null) continue;
    const levels = new Map<number, NumberingLevel>();
    for (const lvl of childrenNamed(node, "lvl")) {
      const ilvl = Number(attrLocal(lvl, "ilvl") ?? "0");
      const numFmt = firstChildNamed(lvl, "numFmt");
      const start = firstChildNamed(lvl, "start");
      levels.set(ilvl, {
        format: numFmt ? attrLocal(numFmt, "val") ?? "decimal" : "decimal",
        start: start ? Number(attrLocal(start, "val")) || 1 : 1,
      });
    }
    abstract.set(id, levels);
  }

  for (const node of findAll(root, "num")) {
    const numId = attrLocal(node, "numId");
    const abstractNode = firstChildNamed(node, "abstractNumId");
    const abstractId = abstractNode ? attrLocal(abstractNode, "val") : null;
    if (numId === null || abstractId === null) continue;
    numbering.set(numId, abstract.get(abstractId) ?? new Map());
  }

  return numbering;
}

/* ------------------------------------------------------------------ */
/* .docx — document walk                                               */
/* ------------------------------------------------------------------ */

interface DocxContext {
  styles: StyleMap;
  defaultSize: number;
  numbering: NumberingMap;
  rels: Map<string, string>;
  media: Map<string, Uint8Array>;
  counters: Map<string, number>;
  warnings: string[];
  skippedImages: { count: number };
}

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

function listMarker(ctx: DocxContext, numId: string, ilvl: number): { ordered: boolean; marker: string } {
  const level = ctx.numbering.get(numId)?.get(ilvl);
  const format = level?.format ?? "decimal";
  const ordered = !["bullet", "none"].includes(format);

  if (!ordered) {
    const glyph = ilvl === 0 ? "•" : ilvl === 1 ? "◦" : "▪";
    return { ordered: false, marker: glyph };
  }

  const key = `${numId}:${ilvl}`;
  const next = (ctx.counters.get(key) ?? (level?.start ?? 1) - 1) + 1;
  ctx.counters.set(key, next);
  // a new item at a deeper level restarts the deeper counters
  for (const counterKey of [...ctx.counters.keys()]) {
    const [id, levelText] = counterKey.split(":");
    if (id === numId && Number(levelText) > ilvl) ctx.counters.delete(counterKey);
  }

  const label =
    format === "lowerLetter"
      ? String.fromCharCode(96 + ((next - 1) % 26) + 1)
      : format === "upperLetter"
        ? String.fromCharCode(64 + ((next - 1) % 26) + 1)
        : format === "lowerRoman"
          ? ROMAN[(next - 1) % 10]
          : format === "upperRoman"
            ? ROMAN[(next - 1) % 10].toUpperCase()
            : String(next);

  return { ordered: true, marker: format === "bullet" ? "•" : `${label}.` };
}

function readRunProperties(ctx: DocxContext, rPr: XmlNode | null, styleMono = false): Omit<WordRun, "text"> {
  const props: Omit<WordRun, "text"> = {};
  if (styleMono) props.mono = true;
  if (!rPr) return props;

  const bold = firstChildNamed(rPr, "b");
  const italic = firstChildNamed(rPr, "i");
  const underline = firstChildNamed(rPr, "u");
  const strike = firstChildNamed(rPr, "strike");
  const sz = firstChildNamed(rPr, "sz");
  const fonts = firstChildNamed(rPr, "rFonts");

  if (bold) props.bold = valIsOn(bold);
  if (italic) props.italic = valIsOn(italic);
  if (underline) props.underline = valIsOn(underline);
  if (strike) props.strike = valIsOn(strike);
  if (sz) {
    const half = Number(attrLocal(sz, "val"));
    if (Number.isFinite(half) && half > 0) props.size = half / 2;
  }
  if (fonts) {
    const family = `${attrLocal(fonts, "ascii") ?? ""} ${attrLocal(fonts, "hAnsi") ?? ""} ${attrLocal(fonts, "cs") ?? ""}`;
    if (/consol|courier|mono|menlo|inconsolata|code/i.test(family)) props.mono = true;
  }
  return props;
}

/** Walks a `w:r` element, producing runs and any embedded images. */
function readRun(ctx: DocxContext, run: XmlNode, styleMono: boolean, out: WordRun[], images: WordImageBlock[]): void {
  const rPr = firstChildNamed(run, "rPr");
  const props = readRunProperties(ctx, rPr, styleMono);

  for (const child of run.children) {
    const name = localName(child.name);
    if (name === "t" || name === "delText") {
      if (name === "delText") continue; // tracked deletion: not part of the document
      out.push({ ...props, text: child.text });
    } else if (name === "tab") {
      out.push({ ...props, text: "\t" });
    } else if (name === "br" || name === "cr") {
      const type = attrLocal(child, "type");
      if (type === "page") images.push({ kind: "image", data: new Uint8Array(), mime: "image/png", widthPt: 0, heightPt: 0 });
      else out.push({ ...props, text: "\n" });
    } else if (name === "drawing" || name === "pict" || name === "object") {
      const image = readDrawing(ctx, child);
      if (image) images.push(image);
    } else if (name === "instrText") {
      // field instruction (PAGE, HYPERLINK…): keep the result, drop the code
      continue;
    }
  }
}

function readDrawing(ctx: DocxContext, node: XmlNode): WordImageBlock | null {
  const blip = findFirst(node, "blip") ?? findFirst(node, "imagedata");
  if (!blip) return null;
  const relId = attrLocal(blip, "embed") ?? attrLocal(blip, "id");
  if (!relId) return null;

  const target = ctx.rels.get(relId);
  if (!target) return null;
  const path = target.startsWith("/") ? target.slice(1) : `word/${target}`.replace(/\/\.\//g, "/");
  const bytes = ctx.media.get(path) ?? ctx.media.get(path.replace("word/word/", "word/"));
  if (!bytes) return null;

  const extension = (path.split(".").pop() ?? "").toLowerCase();
  const mime =
    extension === "png"
      ? ("image/png" as const)
      : extension === "jpg" || extension === "jpeg"
        ? ("image/jpeg" as const)
        : null;

  if (!mime) {
    // EMF/WMF/SVG/GIF/BMP/TIFF files cannot be embedded by the PDF writer.
    ctx.skippedImages.count += 1;
    return null;
  }

  // wp:extent carries the display size in EMU (914400 EMU = 1 inch = 72 pt)
  const extent = findFirst(node, "extent");
  let widthPt = extent ? Number(attrLocal(extent, "cx")) / 12700 : 0;
  let heightPt = extent ? Number(attrLocal(extent, "cy")) / 12700 : 0;
  if (!Number.isFinite(widthPt) || widthPt <= 1) widthPt = 0;
  if (!Number.isFinite(heightPt) || heightPt <= 1) heightPt = 0;

  return { kind: "image", data: bytes, mime, widthPt, heightPt };
}

function paragraphStyleFrom(styleId: string | null, info: StyleInfo | undefined): WordParagraphStyle {
  const name = (info?.name ?? styleId ?? "").toLowerCase();

  if (/^(title)$/.test(name)) return "title";
  if (/^(subtitle)$/.test(name)) return "subtitle";
  if (/quote/.test(name)) return "quote";
  if (/caption|legenda/.test(name)) return "caption";

  const headingMatch = /heading\s*([1-6])/.exec(name) ?? /^h([1-6])$/.exec(styleId?.toLowerCase() ?? "");
  if (headingMatch) return `h${headingMatch[1]}` as WordParagraphStyle;

  const outline = info?.outlineLevel;
  if (outline !== undefined && outline >= 0 && outline <= 5) return `h${outline + 1}` as WordParagraphStyle;

  return "body";
}

function readParagraph(ctx: DocxContext, node: XmlNode): { paragraph: WordParagraph | null; images: WordImageBlock[] } {
  const pPr = firstChildNamed(node, "pPr");
  const styleNode = pPr ? firstChildNamed(pPr, "pStyle") : null;
  const styleId = styleNode ? attrLocal(styleNode, "val") : null;
  const styleInfo = styleId ? ctx.styles.get(styleId) : undefined;

  const runs: WordRun[] = [];
  const images: WordImageBlock[] = [];

  for (const child of node.children) {
    const name = localName(child.name);
    if (name === "r") readRun(ctx, child, styleInfo?.mono ?? false, runs, images);
    else if (name === "hyperlink") {
      for (const inner of childrenNamed(child, "r")) readRun(ctx, inner, false, runs, images);
    } else if (name === "fldSimple") {
      for (const inner of childrenNamed(child, "r")) readRun(ctx, inner, false, runs, images);
    } else if (name === "sdt") {
      const content = firstChildNamed(child, "sdtContent");
      if (content) for (const inner of childrenNamed(content, "r")) readRun(ctx, inner, false, runs, images);
    }
  }

  // A run made only of a page break becomes its own block, not a paragraph.
  const hasText = runs.some((run) => run.text.replace(/[\s\n]/g, "") !== "");
  if (!hasText && images.length === 0) return { paragraph: null, images };

  const style = paragraphStyleFrom(styleId, styleInfo);

  const paragraph: WordParagraph = {
    kind: "paragraph",
    style,
    runs: runs.filter((run) => run.text !== ""),
  };

  if (styleInfo?.bold && style === "body") {
    paragraph.runs = paragraph.runs.map((run) => ({ ...run, bold: run.bold ?? true }));
  }

  const jc = pPr ? firstChildNamed(pPr, "jc") : null;
  if (jc) {
    const value = attrLocal(jc, "val");
    if (value === "center" || value === "right" || value === "both" || value === "justify" || value === "left") {
      paragraph.align = value === "both" ? "justify" : value;
    }
  }

  const numPr = pPr ? firstChildNamed(pPr, "numPr") : null;
  if (numPr) {
    const ilvlNode = firstChildNamed(numPr, "ilvl");
    const numIdNode = firstChildNamed(numPr, "numId");
    const numId = numIdNode ? attrLocal(numIdNode, "val") ?? "" : "";
    const level = ilvlNode ? Number(attrLocal(ilvlNode, "val")) || 0 : 0;
    const { ordered, marker } = listMarker(ctx, numId, level);
    paragraph.list = { ordered, level, marker };
  }

  const spacing = pPr ? firstChildNamed(pPr, "spacing") : null;
  if (spacing) {
    const before = Number(attrLocal(spacing, "before"));
    const after = Number(attrLocal(spacing, "after"));
    if (Number.isFinite(before) && before > 0) paragraph.spaceBefore = Math.min(36, before / 20);
    if (Number.isFinite(after) && after > 0) paragraph.spaceAfter = Math.min(36, after / 20);
  }

  return { paragraph, images };
}

function readTable(ctx: DocxContext, node: XmlNode): WordTable {
  const rows: WordTable["rows"] = [];
  const rowNodes = childrenNamed(node, "tr");

  rowNodes.forEach((rowNode, rowIndex) => {
    const cells: WordTableCell[] = [];
    for (const cellNode of childrenNamed(rowNode, "tc")) {
      const tcPr = firstChildNamed(cellNode, "tcPr");
      const spanNode = tcPr ? firstChildNamed(tcPr, "gridSpan") : null;
      const span = spanNode ? Math.max(1, Number(attrLocal(spanNode, "val")) || 1) : 1;

      const blocks: WordParagraph[] = [];
      for (const child of cellNode.children) {
        const name = localName(child.name);
        if (name === "p") {
          const { paragraph } = readParagraph(ctx, child);
          if (paragraph) blocks.push(paragraph);
        } else if (name === "tbl") {
          // nested tables are flattened into the cell text
          const nested = readTable(ctx, child);
          for (const nestedRow of nested.rows) {
            blocks.push({
              kind: "paragraph",
              style: "body",
              runs: [
                {
                  text: nestedRow.cells
                    .map((cell) => textOfRuns(cell.blocks.flatMap((b) => b.runs)))
                    .join(" | "),
                },
              ],
            });
          }
        }
      }
      cells.push({ span, blocks });
    }

    const trPr = firstChildNamed(rowNode, "trPr");
    const header = trPr ? firstChildNamed(trPr, "tblHeader") !== null : rowIndex === 0;
    rows.push({ header: header && rowIndex === 0, cells });
  });

  return { kind: "table", rows };
}

function readBody(ctx: DocxContext, body: XmlNode, blocks: WordBlock[]): void {
  for (const child of body.children) {
    const name = localName(child.name);
    if (name === "p") {
      const { paragraph, images } = readParagraph(ctx, child);
      if (paragraph) blocks.push(paragraph);
      for (const image of images) {
        // An image with no size data is a stray marker from a page break run.
        if (image.data.length > 0) blocks.push(image);
      }
    } else if (name === "tbl") {
      blocks.push(readTable(ctx, child));
    } else if (name === "sdt") {
      const content = firstChildNamed(child, "sdtContent");
      if (content) readBody(ctx, content, blocks);
    }
    // sectPr, bookmarks and other structural nodes carry no content
  }
}

/** Parses a .docx file into the block model. */
export async function parseDocx(bytes: Uint8Array, fileName = ""): Promise<WordDocumentModel> {
  const warnings: string[] = [];

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(bytes);
  } catch {
    throw new WordReadError("This file is not a readable .docx (the ZIP container is damaged).");
  }

  const documentXml = await zip.file("word/document.xml")?.async("string");
  if (!documentXml) {
    const hasDoc = zip.file(/word\/.*\.xml$/).length > 0;
    throw new WordReadError(
      hasDoc
        ? "This .docx has no word/document.xml — the file looks incomplete."
        : "This .docx does not contain a Word document inside."
    );
  }

  const stylesXml = (await zip.file("word/styles.xml")?.async("string")) ?? null;
  const numberingXml = (await zip.file("word/numbering.xml")?.async("string")) ?? null;
  const relsXml = (await zip.file("word/_rels/document.xml.rels")?.async("string")) ?? null;
  const coreXml = (await zip.file("docProps/core.xml")?.async("string")) ?? null;

  const { styles, defaultSize } = readStyles(stylesXml);
  const numbering = readNumbering(numberingXml);

  const rels = new Map<string, string>();
  if (relsXml) {
    const relsRoot = parseXml(relsXml);
    for (const rel of findAll(relsRoot, "Relationship")) {
      const id = attrLocal(rel, "Id");
      const target = attrLocal(rel, "Target");
      if (id && target) rels.set(id, target);
    }
  }

  const media = new Map<string, Uint8Array>();
  for (const path of Object.keys(zip.files)) {
    if (!path.startsWith("word/media/")) continue;
    const file = zip.file(path);
    if (!file) continue;
    media.set(path, await file.async("uint8array"));
  }

  let title: string | undefined;
  if (coreXml) {
    const coreRoot = parseXml(coreXml);
    const titleNode = findFirst(coreRoot, "title");
    if (titleNode?.text.trim()) title = titleNode.text.trim();
  }

  const ctx: DocxContext = {
    styles,
    defaultSize,
    numbering,
    rels,
    media,
    counters: new Map(),
    warnings,
    skippedImages: { count: 0 },
  };

  const root = parseXml(documentXml);
  const body = findFirst(root, "body");
  const blocks: WordBlock[] = [];
  if (body) readBody(ctx, body, blocks);

  if (ctx.skippedImages.count > 0) {
    warnings.push(
      `${ctx.skippedImages.count} image(s) are in a format PDF cannot embed (EMF, WMF, SVG, GIF, BMP or TIFF) and were left out. Re-save them as PNG or JPEG in Word and convert again.`
    );
  }
  if (media.size === 0) {
    warnings.push(
      "No embedded images were found in the file. Images pasted as links (instead of embedded) never travel inside a .docx."
    );
  }

  const images = blocks.filter((b) => b.kind === "image").length;
  const tables = blocks.filter((b) => b.kind === "table").length;
  const paragraphs = blocks.filter((b) => b.kind === "paragraph").length;

  return {
    blocks,
    source: "docx",
    title: title ?? (fileName ? fileName.replace(/\.docx?$/i, "") : undefined),
    warnings,
    stats: {
      paragraphs,
      tables,
      images,
      skippedImages: ctx.skippedImages.count,
      words: countWords({ blocks }),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Legacy .doc — text extraction from the WordDocument stream          */
/* ------------------------------------------------------------------ */

const CP1252_HIGH: Record<number, string> = {
  0x80: "€", 0x82: "‚", 0x83: "ƒ", 0x84: "„", 0x85: "…", 0x86: "†", 0x87: "‡",
  0x88: "ˆ", 0x89: "‰", 0x8a: "Š", 0x8b: "‹", 0x8c: "Œ", 0x8e: "Ž", 0x91: "‘",
  0x92: "’", 0x93: "“", 0x94: "”", 0x95: "•", 0x96: "–", 0x97: "—", 0x98: "˜",
  0x99: "™", 0x9a: "š", 0x9b: "›", 0x9c: "œ", 0x9e: "ž", 0x9f: "Ÿ",
};

function decodeCp1252(bytes: Uint8Array, from: number, length: number): string {
  let out = "";
  const end = Math.min(bytes.length, from + length);
  for (let i = Math.max(0, from); i < end; i++) {
    const byte = bytes[i];
    out += byte < 0x80 ? String.fromCharCode(byte) : (CP1252_HIGH[byte] ?? String.fromCharCode(byte));
  }
  return out;
}

function decodeUtf16(bytes: Uint8Array, from: number, chars: number): string {
  let out = "";
  const end = Math.min(bytes.length, from + chars * 2);
  for (let i = Math.max(0, from); i + 1 < end; i += 2) {
    const code = bytes[i] | (bytes[i + 1] << 8);
    out += String.fromCharCode(code);
  }
  return out;
}

/** Reads the piece table (CLX) — the authoritative text map of a Word 97+ file. */
function readPieceTable(stream: Uint8Array, fcClx: number, lcbClx: number): string | null {
  if (lcbClx <= 0 || fcClx + lcbClx > stream.length) return null;

  let at = fcClx;
  const end = fcClx + lcbClx;
  let plcPcdOffset = -1;
  let lcb = 0;

  while (at < end) {
    const marker = stream[at];
    if (marker === 0x01) {
      const cb = stream[at + 1] | (stream[at + 2] << 8);
      at += 3 + cb;
    } else if (marker === 0x02) {
      lcb = stream[at + 1] | (stream[at + 2] << 8) | (stream[at + 3] << 16) | (stream[at + 4] << 24);
      plcPcdOffset = at + 5;
      break;
    } else {
      at += 1;
    }
  }
  if (plcPcdOffset < 0 || lcb <= 4) return null;

  const pieces = Math.floor((lcb - 4) / 12);
  const readU32 = (offset: number) =>
    (stream[offset] | (stream[offset + 1] << 8) | (stream[offset + 2] << 16) | (stream[offset + 3] << 24)) >>> 0;

  let text = "";
  for (let i = 0; i < pieces; i++) {
    const cpStart = readU32(plcPcdOffset + i * 4);
    const cpEnd = readU32(plcPcdOffset + (i + 1) * 4);
    const pcdOffset = plcPcdOffset + (pieces + 1) * 4 + i * 8;
    if (pcdOffset + 8 > stream.length) break;

    const rawFc = readU32(pcdOffset + 2);
    const compressed = (rawFc & 0x40000000) !== 0;
    const fc = rawFc & 0x3fffffff;
    const length = Math.max(0, cpEnd - cpStart);

    text += compressed
      ? decodeCp1252(stream, Math.floor(fc / 2), length)
      : decodeUtf16(stream, fc, length);
  }

  return text.length ? text : null;
}

/** Last resort: the longest stretch of printable text in the stream. */
function scanForText(stream: Uint8Array): string {
  const isPrintable = (code: number) =>
    code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 0xfffd) ;
  const plausible = (code: number) =>
    isPrintable(code) && code !== 0 && code < 0xfff0;

  let best = "";
  let current = "";

  // UTF-16LE candidate: char followed by a zero byte
  for (let i = 0; i + 1 < stream.length; i += 2) {
    const code = stream[i] | (stream[i + 1] << 8);
    if (stream[i + 1] === 0 && plausible(code)) current += String.fromCharCode(code);
    else {
      if (current.length > best.length && current.length > 80) best = current;
      current = "";
    }
  }
  if (current.length > best.length && current.length > 80) best = current;

  // 8-bit candidate
  let current8 = "";
  for (let i = 0; i < stream.length; i++) {
    const byte = stream[i];
    if (plausible(byte)) current8 += decodeCp1252(stream, i, 1);
    else {
      if (current8.length > best.length && current8.length > 120) best = current8;
      current8 = "";
    }
  }
  if (current8.length > best.length && current8.length > 120) best = current8;

  return best;
}

/** Removes field codes: \x13 instruction \x14 result \x15 → keeps the result. */
function stripFieldCodes(text: string): string {
  let out = "";
  let depth = 0;
  let inResult = false;
  for (const char of text) {
    if (char === "\u0013") {
      depth += 1;
      inResult = false;
      continue;
    }
    if (char === "\u0014") {
      inResult = true;
      continue;
    }
    if (char === "\u0015") {
      depth = Math.max(0, depth - 1);
      inResult = depth > 0;
      continue;
    }
    if (depth > 0 && !inResult) continue;
    out += char;
  }
  return out;
}

function docTextToBlocks(text: string, warnings: string[]): WordBlock[] {
  const cleaned = stripFieldCodes(text)
    .replace(/\u0007/g, "\t") // cell / row end
    .replace(/[\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0008\u000b]/g, " ")
    .replace(/\u000c/g, "\n\n");

  const blocks: WordBlock[] = [];
  const paragraphs = cleaned.split(/\r\n|\r|\n/);

  for (const raw of paragraphs) {
    const line = raw.replace(/\t/g, "  ").replace(/\s+$/, "").trim();
    if (!line) continue;

    // Structure heuristics: legacy .doc has no styles to read, only this
    // text stream. Numbers like "3.2 Título" and short ALL-CAPS lines are
    // almost always headings in study material.
    let style: WordParagraphStyle = "body";
    const numbered = /^(\d{1,2}(?:\.\d{1,2}){0,3})[.)]?\s+(\S.*)$/.exec(line);
    if (numbered && line.length <= 90) {
      const depth = numbered[1].split(".").length;
      style = `h${Math.min(6, depth + 1)}` as WordParagraphStyle;
    } else if (line.length <= 70 && line === line.toUpperCase() && /[A-ZÀ-Þ]{4}/.test(line)) {
      style = "h2";
    }

    if (/^\s*[•\-*\u00b7]\s+/.test(line)) {
      const item = line.replace(/^\s*[•\-*\u00b7]\s+/, "");
      blocks.push({
        kind: "paragraph",
        style: "body",
        runs: [{ text: item }],
        list: { ordered: false, level: 0, marker: "•" },
      });
      continue;
    }

    blocks.push({ kind: "paragraph", style, runs: [{ text: line }] });
  }

  if (blocks.length === 0) warnings.push("No readable text was found in this .doc file.");
  return blocks;
}

/** Parses a legacy .doc file (best effort: text only). */
export function parseLegacyDoc(bytes: Uint8Array, fileName = ""): WordDocumentModel {
  const warnings: string[] = [];
  const archive = readCfb(bytes);
  if (!archive) {
    throw new WordReadError(
      "This .doc file could not be opened — the file is damaged or uses an older/unknown container. Open it in Word or LibreOffice and save as .docx, then convert again."
    );
  }

  const stream = archive.get("WordDocument") ?? archive.get("worddocument");
  if (!stream || stream.data.length === 0) {
    throw new WordReadError(
      "This .doc has no WordDocument stream — the file may be a different OLE document (or a password-protected file)."
    );
  }

  const data = stream.data;
  const readU32 = (offset: number) =>
    (data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24)) >>> 0;
  const readU16 = (offset: number) => data[offset] | (data[offset + 1] << 8);

  const flags = readU16(0x0a);
  const complex = (flags & 0x0004) !== 0;
  const fcMin = readU32(0x18);
  const fcMac = readU32(0x1c);
  const fcClx = readU32(0x01a2);
  const lcbClx = readU32(0x01a6);

  let text: string | null = readPieceTable(data, fcClx, lcbClx);

  if (!text && !complex && fcMac > fcMin && fcMac <= data.length) {
    const slice = data.subarray(fcMin, fcMac);
    const zeroOdd = slice.filter((_, index) => index % 2 === 1 && slice[index] === 0).length;
    text =
      zeroOdd > slice.length / 4
        ? decodeUtf16(data, fcMin, Math.floor((fcMac - fcMin) / 2))
        : decodeCp1252(data, fcMin, fcMac - fcMin);
  }

  if (!text || text.replace(/[^\x20-\x7e]/g, "").length < 20) {
    text = scanForText(data);
    if (text) {
      warnings.push(
        "The formatted text map of this .doc could not be read, so the text was recovered by scanning the file. Check the preview carefully — reading order may be imperfect."
      );
    }
  }

  if (!text) {
    throw new WordReadError(
      "No text could be recovered from this .doc file. Open it in Word or LibreOffice, save as .docx and convert again."
    );
  }

  warnings.push(
    "Legacy .doc files store no structure this tool can trust: the PDF keeps the text (paragraphs, lists, numbered headings) but loses fonts, colours, images and tables. For a faithful copy, save the file as .docx first."
  );

  const blocks = docTextToBlocks(text, warnings);

  return {
    blocks,
    source: "doc",
    title: fileName ? fileName.replace(/\.doc$/i, "") : undefined,
    warnings,
    stats: {
      paragraphs: blocks.filter((b) => b.kind === "paragraph").length,
      tables: 0,
      images: 0,
      skippedImages: 0,
      words: countWords({ blocks }),
    },
  };
}

/** Dispatches on the file signature: ZIP ⇒ .docx, OLE ⇒ legacy .doc. */
export async function readWordDocument(bytes: Uint8Array, fileName = ""): Promise<WordDocumentModel> {
  if (bytes.length === 0) throw new WordReadError("The file is empty.");
  if (isZipFile(bytes)) return parseDocx(bytes, fileName);
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf) return parseLegacyDoc(bytes, fileName);
  if (/\.docx$/i.test(fileName)) return parseDocx(bytes, fileName);
  throw new WordReadError(
    "This file is neither a .docx (ZIP) nor a .doc (OLE) document. Check that the extension matches the real format."
  );
}
