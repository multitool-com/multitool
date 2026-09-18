"use client";

import { useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { trackToolUsed, trackDownload } from "@/lib/analytics";

// ---------- tipos de bloco ----------
type Block =
  | { t: "h1" | "h2" | "h3" | "p" | "li" | "oli" | "code"; text: string }
  | { t: "hr" };

function parseMarkdown(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let para: string[] = [];
  let code: string[] | null = null;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ t: "p", text: para.join(" ") });
      para = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (code !== null) {
      if (/^```/.test(line.trim())) {
        blocks.push({ t: "code", text: code.join("\n") });
        code = null;
      } else {
        code.push(raw);
      }
      continue;
    }
    if (/^```/.test(line.trim())) {
      flushPara();
      code = [];
      continue;
    }
    if (!line.trim()) {
      flushPara();
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      blocks.push({ t: `h${h[1].length}` as "h1" | "h2" | "h3", text: h[2] });
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushPara();
      blocks.push({ t: "hr" });
      continue;
    }
    const ul = /^[-*+]\s+(.*)$/.exec(line);
    if (ul) {
      flushPara();
      blocks.push({ t: "li", text: ul[1] });
      continue;
    }
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ol) {
      flushPara();
      blocks.push({ t: "oli", text: ol[1] });
      continue;
    }
    para.push(line.trim());
  }
  flushPara();
  if (code) blocks.push({ t: "code", text: code.join("\n") });
  return blocks;
}

const stripMd = (s: string) =>
  s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

function wrap(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export default function MarkdownPdfClient() {
  const [md, setMd] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const convert = async () => {
    if (!md.trim()) {
      setError("Paste some Markdown first.");
      return;
    }
    setBusy(true);
    setError("");
    setDone("");
    try {
      trackToolUsed("markdown-to-pdf", "pdf-tools");
      const doc = await PDFDocument.create();
      const regular = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const mono = await doc.embedFont(StandardFonts.Courier);

      const A4: [number, number] = [595.28, 841.89];
      const margin = 56;
      const maxWidth = A4[0] - margin * 2;
      const ink = rgb(0.11, 0.12, 0.11);
      const soft = rgb(0.42, 0.44, 0.42);

      let page: PDFPage = doc.addPage(A4);
      let y = A4[1] - margin;

      const newPage = () => {
        page = doc.addPage(A4);
        y = A4[1] - margin;
      };
      const need = (h: number) => {
        if (y - h < margin) newPage();
      };

      const blocks = parseMarkdown(md);
      for (const b of blocks) {
        if (b.t === "hr") {
          need(24);
          y -= 10;
          page.drawLine({
            start: { x: margin, y },
            end: { x: A4[0] - margin, y },
            thickness: 0.8,
            color: soft,
          });
          y -= 14;
          continue;
        }
        if (b.t === "code") {
          const size = 9.5;
          const lines = b.text.split("\n");
          for (const ln of lines) {
            const wrapped = wrap(ln || " ", mono, size, maxWidth - 16);
            for (const wl of wrapped) {
              need(size * 1.5 + 8);
              y -= size * 1.5;
              page.drawRectangle({
                x: margin - 6,
                y: y - 4,
                width: maxWidth + 12,
                height: size * 1.5,
                color: rgb(0.96, 0.95, 0.93),
              });
              page.drawText(wl, { x: margin + 2, y, size, font: mono, color: ink });
            }
          }
          y -= 10;
          continue;
        }
        const conf = {
          h1: { size: 22, font: bold, before: 18, after: 10 },
          h2: { size: 16, font: bold, before: 14, after: 8 },
          h3: { size: 13, font: bold, before: 12, after: 6 },
          p: { size: 10.5, font: regular, before: 0, after: 8 },
          li: { size: 10.5, font: regular, before: 0, after: 4 },
          oli: { size: 10.5, font: regular, before: 0, after: 4 },
        }[b.t];
        const text = stripMd(b.text);
        const lines = wrap(text, conf.font, conf.size, maxWidth - (b.t === "li" || b.t === "oli" ? 16 : 0));
        need(conf.size * 1.35 * lines.length + conf.before + conf.after);
        y -= conf.before;
        for (let i = 0; i < lines.length; i++) {
          y -= conf.size * 1.35;
          const x = margin + (b.t === "li" || b.t === "oli" ? 16 : 0);
          if ((b.t === "li" || b.t === "oli") && i === 0) {
            page.drawText(b.t === "li" ? "•" : "–", { x: margin + 2, y, size: conf.size, font: bold, color: ink });
          }
          page.drawText(lines[i], { x, y, size: conf.size, font: conf.font, color: ink });
        }
        y -= conf.after;
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "document.pdf";
      a.click();
      URL.revokeObjectURL(a.href);
      setDone(`DONE — ${doc.getPageCount()} page(s).`);
      trackDownload("markdown-to-pdf", "pdf-tools");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  };

  const loadFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setMd(String(reader.result || ""));
    reader.readAsText(f);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            ref={fileRef}
            type="file"
            accept=".md,.markdown,.txt"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs tracking-widest px-4 py-2 rounded-lg transition-colors"
          >
            LOAD .MD FILE
          </button>
          <span className="flex-1" />
          <button
            onClick={convert}
            disabled={busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            {busy ? "CONVERTING…" : "CONVERT TO PDF"}
          </button>
        </div>
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder={"# Title\n\nA paragraph with **bold** and *italic*.\n\n- A list item\n- Another item\n\n```js\nconst code = true;\n```"}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
        {done && (
          <div className="mt-3 bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
            {done}
          </div>
        )}
        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs">
            {error}
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your Markdown never leaves your device.
      </p>
    </div>
  );
}
