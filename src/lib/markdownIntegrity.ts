/**
 * Markdown integrity engine.
 *
 * Answers one question: "did the edited Markdown keep everything the original
 * document had?" It compares a baseline (the text extracted from the original
 * PDF, or an earlier .md file) against a candidate Markdown file that went
 * through a layout rewrite somewhere else.
 *
 * The comparison is deliberately order-insensitive and formatting-insensitive,
 * because that is exactly what a layout rework changes: headings become bold
 * paragraphs, lists become tables, paragraphs get rewrapped. What must NOT
 * change is the content — so the engine audits four things:
 *
 *   1. text units (sentences / list items / headings) and the significant
 *      words inside them,
 *   2. numbers, which is where silent damage usually hides,
 *   3. section headings,
 *   4. figure references (an image can never travel inside extracted text).
 *
 * Pure module: no DOM, no React — so it can be exercised in plain Node.
 */

export type BaselineKind = "pdf" | "text";

export interface IntegritySegment {
  /** 1-based page number, when the baseline came from a PDF. */
  page: number;
  text: string;
}

export interface IntegrityInput {
  /** Plain text of the original document (PDF extraction or older .md). */
  baselineText: string;
  /** The edited Markdown to be audited. */
  candidateMarkdown: string;
  baselineKind: BaselineKind;
  /** Per-page baseline text, used to point at the page of each problem. */
  segments?: IntegritySegment[];
  /** Figure count detected in the original PDF (raster images). */
  baselineImages?: number;
  /** 1-based pages that contain at least one figure (PDF baselines). */
  baselineImagePages?: number[];
  /** File names, echoed in the report. */
  baselineName?: string;
  candidateName?: string;
}

export interface UnitIssue {
  text: string;
  page: number | null;
  /** 1 = every significant word recovered, 0 = nothing recovered. */
  coverage: number;
  missingWords: string[];
}

export interface ValueIssue {
  value: string;
  page: number | null;
}

export interface IntegrityCounts {
  units: number;
  unitsMissing: number;
  unitsPartial: number;
  numbers: number;
  numbersMissing: number;
  headings: number;
  headingsMissing: number;
  wordsBaseline: number;
  wordsCandidate: number;
  wordsAdded: number;
  baselineImages: number;
  candidateImages: number;
}

export interface IntegrityReport {
  verdict: "intact" | "review" | "loss";
  /** % of baseline text units recovered with every significant word present. */
  score: number;
  /** % of significant words of the baseline that still exist in the file. */
  wordCoverage: number;
  counts: IntegrityCounts;
  missingUnits: UnitIssue[];
  partialUnits: UnitIssue[];
  numberIssues: ValueIssue[];
  headingIssues: ValueIssue[];
  /** baselineImages − candidateImages; > 0 means figures are not referenced. */
  imageGap: number;
  imagePages: number[];
  notes: string[];
}

/* ------------------------------------------------------------------ */
/* Normalisation                                                       */
/* ------------------------------------------------------------------ */

const LIGATURES: [RegExp, string][] = [
  [/\u00a0/g, " "], // no-break space
  [/[\u2018\u2019\u201a\u201b\u2032]/g, "'"],
  [/[\u201c\u201d\u201e\u201f\u2033]/g, '"'],
  [/[\u2013\u2014\u2015]/g, "-"],
  [/\u2026/g, "..."],
  [/\ufb01/g, "fi"],
  [/\ufb02/g, "fl"],
  [/\u00ad/g, ""], // soft hyphen
];

/**
 * Case, space, typography and accent-insensitive form used for every
 * comparison. Accents matter: PDFs extracted by many tools lose diacritics
 * ("potencia"), while a Markdown rework usually restores them ("potência") —
 * that difference must never be reported as lost content.
 */
export function normalizeText(value: string): string {
  let out = value.normalize("NFKC");
  for (const [pattern, replacement] of LIGATURES) out = out.replace(pattern, replacement);
  return out
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining accents
    .toLowerCase()
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Words that carry no meaning on their own — excluded from coverage maths. */
const STOPWORDS = new Set(
  (
    // English
    "the a an and or but of to in on at by for with from as is are was were be been being this that these those it its " +
    "you your we our they their he she his her not no do does did done can could should would may might must will shall " +
    "there here then than so such into over under about above below between during before after again more most other some " +
    "any all both each few many much own same too very s t just don now if when while because which who whom whose what " +
    // Portuguese
    "o a os as um uma uns umas de do da dos das em no na nos nas por para com sem sob sobre entre ate apos antes depois " +
    "que quem qual quais quando onde como porque pois se e ou mas tambem nao sim ja foi ser sao esta estao este esta estes " +
    "estas isso isto aquilo seu sua seus suas meu minha nosso nossa dele dela deles delas lhe lhes me te nos vos ao aos aquele " +
    "aquela aqueles aquelas pelo pela pelos pelas num numa e ainda mais menos muito pouco todos todas todo toda cada"
  ).split(/\s+/)
);

/**
 * Words that carry meaning: numbers (kept whole, together with their decimal
 * separator so "0,85" stays one token) plus words of 3+ letters that are not
 * stopwords. Applied to already-normalised text.
 */
export function significantTokens(text: string): string[] {
  const tokens = normalizeText(text).match(/[0-9]+(?:[.,][0-9]+)*%?|[a-z]{3,}/gi) ?? [];
  const out: string[] = [];
  for (const token of tokens) {
    if (/[0-9]/.test(token)) {
      out.push(token);
      continue;
    }
    if (STOPWORDS.has(token)) continue;
    out.push(token);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Markdown analysis                                                   */
/* ------------------------------------------------------------------ */

export interface MarkdownAnalysis {
  /** Plain text of the Markdown, newlines preserved between blocks. */
  text: string;
  /** Number of image references (![]() or <img>). */
  images: number;
  /** Image targets, in reading order. */
  imageRefs: string[];
  /** Heading texts, in reading order. */
  headings: string[];
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

/**
 * Reduces Markdown to the text a reader would see, while collecting the two
 * things that can vanish without a trace: images and headings.
 */
export function analyzeMarkdown(markdown: string): MarkdownAnalysis {
  const imageRefs: string[] = [];
  const headings: string[] = [];

  let text = markdown.replace(/\r\n?/g, "\n");
  text = text.replace(/```[^\n]*\n?/g, "\n"); // fence markers only, code stays

  // <img ...> (HTML images) — keep the alt text, count the image
  text = text.replace(/<img\b[^>]*>/gi, (tag) => {
    const alt = /alt\s*=\s*["']([^"']*)["']/i.exec(tag);
    const src = /src\s*=\s*["']([^"']*)["']/i.exec(tag);
    imageRefs.push(src?.[1] ?? "");
    return alt?.[1] ? ` ${alt[1]} ` : " ";
  });

  // ![alt](src "title")
  text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, alt: string, src: string) => {
    imageRefs.push(src);
    return alt ? ` ${alt} ` : " ";
  });

  // [label](url) → label
  text = text.replace(/\[([^\]]*)\]\(([^)]+)\)/g, "$1");

  // headings
  text = text.replace(/^(#{1,6})[ \t]+(.+)$/gm, (_m, _hashes: string, title: string) => {
    headings.push(title.trim());
    return title;
  });

  // tables: separator rows disappear, cell pipes become spaces
  text = text.replace(/^[ \t]*\|?[ \t]*:?-{2,}:?[ \t]*(\|[ \t]*:?-{2,}:?[ \t]*)*\|?[ \t]*$/gm, "");
  text = text.replace(/[ \t]*\|[ \t]*/g, "  ");

  // structural markers that are not content
  text = text.replace(/^[ \t]*>[ \t]?/gm, "");
  text = text.replace(/^[ \t]*[-*_]{3,}[ \t]*$/gm, "");
  text = text.replace(/^[ \t]*(?:[-*+]|\d{1,3}[.)])[ \t]+/gm, "");
  text = text.replace(/(\*\*|__|\*|_|~~|`)/g, "");
  text = text.replace(/<\/?[a-z][^>]*>/gi, " ");
  text = decodeEntities(text);

  return { text, images: imageRefs.length, imageRefs, headings };
}

/* ------------------------------------------------------------------ */
/* Units                                                               */
/* ------------------------------------------------------------------ */

const SENTENCE_SPLIT = /(?<=[.!?…])\s+(?=[A-ZÀ-Þ0-9"'(])/;

function splitSentences(value: string): string[] {
  const parts = value
    .split(SENTENCE_SPLIT)
    .map((p) => p.trim())
    .filter(Boolean);
  const merged: string[] = [];
  for (const part of parts) {
    const last = merged[merged.length - 1];
    // Glue very short fragments back to their neighbour (initials, "ex.", ...)
    if (last && (last.length < 25 || part.length < 12)) merged[merged.length - 1] = `${last} ${part}`;
    else merged.push(part);
  }
  return merged;
}

/** A unit is one claim to verify: a heading, a list item or a sentence. */
export function splitUnits(value: string): string[] {
  const units: string[] = [];
  const blocks = value.split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    // Merge soft-wrapped prose lines back into one paragraph.
    const paragraphs: string[] = [];
    for (const line of lines) {
      const last = paragraphs[paragraphs.length - 1];
      const isHeadingish = line.length <= 80 && !/[.!,;:]$/.test(line);
      if (last && !isHeadingish && !/[.!?…:;]$/.test(last) && !/^\s*(?:[-*+]|\d{1,3}[.)])\s/.test(line)) {
        paragraphs[paragraphs.length - 1] = `${last} ${line}`;
      } else {
        paragraphs.push(line);
      }
    }

    for (const paragraph of paragraphs) {
      if (paragraph.length <= 240) {
        units.push(paragraph);
      } else {
        units.push(...splitSentences(paragraph));
      }
    }
  }

  return units
    .map((u) => u.trim())
    .filter((u) => u.length >= 3)
    // Fence markers and other decoration are not claims to verify.
    .filter((u) => /[a-zà-ÿ0-9]/i.test(u));
}

/* ------------------------------------------------------------------ */
/* Numbers                                                             */
/* ------------------------------------------------------------------ */

const NUMBER_RE =
  /(?:R\$|US\$|\$|€|£)?\s?\d+(?:[.,]\d{3})*(?:[.,]\d+)?\s?(?:(?:%|°C|°F|m2|km|cm|mm|kg|mg|ml|min|h|l|g|s|x)(?![a-z0-9]))?/gi;

interface NumberToken {
  raw: string;
  /** Canonical numeric value as text: separators solved, trailing zeros gone. */
  value: string;
}

function parseNumber(raw: string): NumberToken | null {
  const cleaned = raw.trim();
  if (!/\d/.test(cleaned)) return null;
  const numeric = cleaned.replace(/^(R\$|US\$|\$|€|£)\s?/i, "").replace(/[^\d.,]/g, "");
  if (!numeric) return null;

  const hasComma = numeric.includes(",");
  const hasDot = numeric.includes(".");
  let integerDigits = numeric;
  let decimalDigits = "";

  if (hasComma && hasDot) {
    // "1.240,50" (pt-BR) or "1,240.50" (en-US): the last separator is the decimal one
    const decimalSeparator = numeric.lastIndexOf(",") > numeric.lastIndexOf(".") ? "," : ".";
    const splitAt = numeric.lastIndexOf(decimalSeparator);
    integerDigits = numeric.slice(0, splitAt);
    decimalDigits = numeric.slice(splitAt + 1);
  } else if (hasComma || hasDot) {
    const separator = hasComma ? "," : ".";
    const occurrences = numeric.split(separator).length - 1;
    const splitAt = numeric.lastIndexOf(separator);
    const tail = numeric.slice(splitAt + 1);
    // "1.240" / "1,240" are thousands; "96,4" / "96.4" are decimals.
    const isGrouping = tail.length === 3 && (occurrences > 1 || numeric.length > 4);
    integerDigits = isGrouping ? numeric : numeric.slice(0, splitAt);
    decimalDigits = isGrouping ? "" : tail;
  }

  const integer = integerDigits.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");
  const decimals = decimalDigits.replace(/[^\d]/g, "").replace(/0+$/, "");
  if (!integer) return null;

  // Canonical value text: "336,0" → "336", "96,40" → "96.4", "1.240" → "1240".
  return { raw: cleaned, value: decimals ? `${integer}.${decimals}` : integer };
}

/**
 * NFKC form used when scanning for numbers, so that "mm²" becomes "mm2" and
 * fits are counted as digits instead of being swallowed by their exponent.
 * Line breaks are kept: the list-marker filter works line by line.
 */
function normalizeNumberScan(value: string): string {
  return value.normalize("NFKC").replace(/\u00ad/g, "");
}

function isListMarker(line: string): boolean {
  return /^\s*(?:\d{1,2}[.)]\s|\d{1,2}\s*$)/.test(line);
}

function extractNumbers(text: string, ignoreListMarkers: boolean): NumberToken[] {
  const out: NumberToken[] = [];
  for (const line of text.split("\n")) {
    if (ignoreListMarkers && isListMarker(line)) continue;
    const matches = line.match(NUMBER_RE) ?? [];
    for (const match of matches) {
      const parsed = parseNumber(match);
      if (parsed) out.push(parsed);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Headings                                                            */
/* ------------------------------------------------------------------ */

function collectHeadingCandidates(baselineKind: BaselineKind, baselineText: string): string[] {
  const out: string[] = [];
  const lines = baselineText.split("\n").map((l) => l.trim());

  for (const line of lines) {
    if (!line) continue;
    const md = /^#{1,6}\s+(.+)$/.exec(line);
    if (md) {
      out.push(md[1].trim());
      continue;
    }
    if (baselineKind === "pdf" && line.length <= 70 && line.split(/\s+/).length <= 10) {
      const isHeadingish =
        !/[.,;:!?]$/.test(line) &&
        !/^(?:[-*+]|\d{1,3}[.)])\s/.test(line) &&
        !/^\d+$/.test(line) &&
        /[a-zà-öø-ÿ]/i.test(line);
      if (isHeadingish) out.push(line);
    }
  }
  return [...new Set(out)];
}

/* ------------------------------------------------------------------ */
/* The check                                                           */
/* ------------------------------------------------------------------ */

function coverageOfUnit(
  unit: string,
  candidateText: string,
  candidateTokenCount: Map<string, number>,
  candidateNumberValues: Set<string>
): { coverage: number; missingWords: string[] } {
  const tokens = significantTokens(unit);
  const normalized = normalizeText(unit);

  // Fast path: the unit exists verbatim (whitespace/format already normalised).
  if (normalized.length >= 12 && candidateText.includes(normalized)) {
    return { coverage: 1, missingWords: [] };
  }
  if (tokens.length === 0) {
    return { coverage: candidateText.includes(normalized) ? 1 : 0, missingWords: tokens };
  }

  const unique = [...new Set(tokens)];
  const missingWords = unique.filter((token) => {
    if (candidateTokenCount.has(token)) return false;
    // A number written differently is not a missing word: "336,0" and "336"
    // are the same figure. Only a different value is a real finding — and the
    // number audit reports those separately.
    if (/\d/.test(token)) {
      const parsed = parseNumber(token);
      if (parsed && candidateNumberValues.has(parsed.value)) return false;
    }
    return true;
  });
  const coverage = (unique.length - missingWords.length) / unique.length;
  return { coverage, missingWords };
}

export function checkIntegrity(input: IntegrityInput): IntegrityReport {
  const notes: string[] = [];
  // The baseline may arrive as plain text (PDF extraction) or as an earlier
  // .md file — analysing it the same way removes structural markers from both
  // sides, so a heading is compared with a heading, not with "##".
  const baselineAnalysis = analyzeMarkdown(input.baselineText);
  const candidate = analyzeMarkdown(input.candidateMarkdown);

  const baselinePlain = baselineAnalysis.text;
  const segments = (input.segments ?? []).map((segment) => ({
    page: segment.page,
    text: analyzeMarkdown(segment.text).text,
  }));
  const candidateText = normalizeText(candidate.text);

  const candidateTokenCount = new Map<string, number>();
  for (const token of significantTokens(candidate.text)) {
    candidateTokenCount.set(token, (candidateTokenCount.get(token) ?? 0) + 1);
  }

  const candidateNumbers = extractNumbers(normalizeNumberScan(candidate.text), true);
  const candidateNumberValues = new Set(candidateNumbers.map((n) => n.value));

  /* ---- units, with page attribution ---- */
  const pageOf = (unit: string): number | null => {
    const normalized = normalizeText(unit).slice(0, 60);
    if (!normalized || !segments.length) return null;
    for (const segment of segments) {
      if (normalizeText(segment.text).includes(normalized)) return segment.page;
    }
    return null;
  };

  const unitEntries: { text: string; page: number | null }[] = [];
  if (segments.length) {
    for (const segment of segments) {
      for (const unit of splitUnits(segment.text)) unitEntries.push({ text: unit, page: segment.page });
    }
  } else {
    for (const unit of splitUnits(baselinePlain)) unitEntries.push({ text: unit, page: null });
  }

  const missingUnits: UnitIssue[] = [];
  const partialUnits: UnitIssue[] = [];
  let unitsRecovered = 0;
  let baselineSignificantTokens = 0;
  let recoveredSignificantTokens = 0;

  for (const entry of unitEntries) {
    const { coverage, missingWords } = coverageOfUnit(
      entry.text,
      candidateText,
      candidateTokenCount,
      candidateNumberValues
    );
    const unique = [...new Set(significantTokens(entry.text))];
    baselineSignificantTokens += unique.length;
    recoveredSignificantTokens += unique.length - missingWords.length;

    if (coverage >= 1) {
      unitsRecovered += 1;
    } else if (coverage >= 0.6) {
      partialUnits.push({
        text: entry.text,
        page: entry.page ?? pageOf(entry.text),
        coverage,
        missingWords: missingWords.slice(0, 12),
      });
    } else {
      missingUnits.push({
        text: entry.text,
        page: entry.page ?? pageOf(entry.text),
        coverage,
        missingWords: missingWords.slice(0, 12),
      });
    }
  }

  /* ---- numbers (the place silent damage hides) ---- */
  const baselineNumbers = extractNumbers(normalizeNumberScan(baselinePlain), true);
  // Values are compared as numbers, not as strings: "336,0" and "336" are the
  // same figure written differently, while "96,4" and "96" are not.
  const numberIssues: ValueIssue[] = [];
  const seenValues = new Set<string>();
  for (const number of baselineNumbers) {
    if (candidateNumberValues.has(number.value)) continue;
    if (seenValues.has(number.value)) continue;
    seenValues.add(number.value);
    numberIssues.push({ value: number.raw.trim(), page: null });
  }

  /* ---- headings ---- */
  const headingCandidates = collectHeadingCandidates(input.baselineKind, baselinePlain);
  const headingIssues: ValueIssue[] = [];
  for (const heading of headingCandidates) {
    const tokens = significantTokens(heading);
    if (tokens.length === 0) continue;
    const normalizedHeading = normalizeText(heading);
    if (normalizedHeading && candidateText.includes(normalizedHeading)) continue;
    const recovered = tokens.filter((token) => candidateTokenCount.has(token)).length / tokens.length;
    if (recovered >= 0.9) continue;
    headingIssues.push({ value: heading, page: null });
  }

  /* ---- figures ---- */
  const baselineImages =
    input.baselineKind === "pdf" ? input.baselineImages ?? 0 : baselineAnalysis.images;
  const imageGap = Math.max(0, baselineImages - candidate.images);

  if (input.baselineKind === "pdf" && baselineImages === 0) {
    notes.push(
      "No embedded raster figures were found in the PDF. Charts drawn as vector graphics cannot be counted automatically — check them visually (export the pages with PDF to Images)."
    );
  }

  const wordsBaseline = normalizeText(baselinePlain).split(" ").filter(Boolean).length;
  const wordsCandidate = normalizeText(candidate.text).split(" ").filter(Boolean).length;

  /* ---- verdict ---- */
  const units = unitEntries.length;
  const score = units > 0 ? (unitsRecovered / units) * 100 : 100;
  const wordCoverage =
    baselineSignificantTokens > 0 ? (recoveredSignificantTokens / baselineSignificantTokens) * 100 : 100;

  const hasLoss =
    missingUnits.length > 0 || numberIssues.length > 0 || headingIssues.length > 0 || imageGap > 0;
  const verdict: IntegrityReport["verdict"] = hasLoss ? "loss" : partialUnits.length > 0 ? "review" : "intact";

  if (wordsCandidate > wordsBaseline * 1.4 && wordsBaseline > 40) {
    notes.push(
      "The candidate file is much longer than the baseline — layout wrappers, navigation or duplicated content may have been added. Additions are not penalised, but they are worth a quick look."
    );
  }

  return {
    verdict,
    score,
    wordCoverage,
    counts: {
      units,
      unitsMissing: missingUnits.length,
      unitsPartial: partialUnits.length,
      numbers: baselineNumbers.length,
      numbersMissing: numberIssues.length,
      headings: headingCandidates.length,
      headingsMissing: headingIssues.length,
      wordsBaseline,
      wordsCandidate,
      wordsAdded: Math.max(0, wordsCandidate - wordsBaseline),
      baselineImages,
      candidateImages: candidate.images,
    },
    missingUnits: missingUnits.slice(0, 60),
    partialUnits: partialUnits.slice(0, 60),
    numberIssues: numberIssues.slice(0, 60),
    headingIssues: headingIssues.slice(0, 60),
    imageGap,
    imagePages: input.baselineImagePages ?? [],
    notes,
  };
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

function listOrNone(items: string[], empty: string): string {
  if (!items.length) return `_${empty}_\n`;
  return `${items.join("\n")}\n`;
}

/** Human-readable report; also the file the user downloads and can re-share. */
export function buildReportMarkdown(
  report: IntegrityReport,
  meta: { baselineName?: string; candidateName?: string; date?: string } = {}
): string {
  const { counts } = report;
  const verdictLabel =
    report.verdict === "intact"
      ? "INTACT — nothing was lost"
      : report.verdict === "review"
        ? "REVIEW — content is there, wording changed in places"
        : "LOSS DETECTED — items below are missing from the candidate file";

  const page = (n: number | null) => (n ? ` (page ${n})` : "");

  const lines: string[] = [];
  lines.push("# Markdown integrity report");
  lines.push("");
  lines.push(`- **Baseline:** ${meta.baselineName ?? "original document"} (${report.counts.wordsBaseline} words)`);
  lines.push(`- **Candidate:** ${meta.candidateName ?? "edited markdown"} (${report.counts.wordsCandidate} words)`);
  if (meta.date) lines.push(`- **Checked on:** ${meta.date}`);
  lines.push("");
  lines.push(`## ${verdictLabel}`);
  lines.push("");
  lines.push(`- Text units recovered fully: **${counts.units - counts.unitsMissing - counts.unitsPartial}/${counts.units}** (${report.score.toFixed(1)}%)`);
  lines.push(`- Significant words recovered: **${report.wordCoverage.toFixed(1)}%**`);
  lines.push(`- Missing text units: **${counts.unitsMissing}** · partly reworded: **${counts.unitsPartial}**`);
  lines.push(`- Numbers missing or changed: **${counts.numbersMissing}** of ${counts.numbers}`);
  lines.push(`- Headings missing: **${counts.headingsMissing}** of ${counts.headings}`);
  lines.push(`- Figures: baseline **${counts.baselineImages}** · referenced in the Markdown **${counts.candidateImages}**`);
  lines.push("");

  if (report.missingUnits.length) {
    lines.push("## Missing text");
    lines.push("");
    lines.push(
      listOrNone(
        report.missingUnits.map(
          (u) => `- ${u.text.replace(/\s+/g, " ")}${page(u.page)}\n  - words not found: ${u.missingWords.join(", ") || "—"}`
        ),
        "Nothing missing."
      )
    );
  }

  if (report.partialUnits.length) {
    lines.push("## Reworded text (content kept, wording changed)");
    lines.push("");
    lines.push(
      listOrNone(
        report.partialUnits.map(
          (u) => `- ${u.text.replace(/\s+/g, " ")}${page(u.page)} — ${(u.coverage * 100).toFixed(0)}% recovered\n  - words not found: ${u.missingWords.join(", ") || "—"}`
        ),
        "Nothing reworded."
      )
    );
  }

  if (report.numberIssues.length) {
    lines.push("## Numbers missing or changed");
    lines.push("");
    lines.push(report.numberIssues.map((n) => `- \`${n.value}\`${page(n.page)}`).join("\n") + "\n");
  }

  if (report.headingIssues.length) {
    lines.push("## Headings missing");
    lines.push("");
    lines.push(report.headingIssues.map((h) => `- ${h.value}${page(h.page)}`).join("\n") + "\n");
  }

  if (report.counts.baselineImages > 0) {
    lines.push("## Figures");
    lines.push("");
    lines.push(
      `The baseline contains **${report.counts.baselineImages}** embedded figure(s)` +
        (report.imagePages.length ? ` on page(s) ${report.imagePages.join(", ")}` : "") +
        `, and the Markdown references **${report.counts.candidateImages}** image(s).`
    );
    lines.push("");
    if (report.imageGap > 0) {
      lines.push(
        `**${report.imageGap} figure(s) are not referenced in the Markdown.** Text extraction never carries images: export the pages with the PDF to Images tool and insert the files, then run this check again.`
      );
      lines.push("");
    }
  }

  if (report.notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const note of report.notes) lines.push(`- ${note}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    "Generated by MultiTool — Markdown Integrity Check. Everything ran in the browser; no file was uploaded."
  );

  return lines.join("\n");
}
