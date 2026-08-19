"use client";

import { useState } from "react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
];

export function generateLorem(words: number, paragraphs: number, startClassic = true): string {
  const n = Math.max(1, Math.min(1000, Math.floor(words) || 1));
  const p = Math.max(1, Math.min(50, Math.floor(paragraphs) || 1));
  const out: string[] = [];
  for (let para = 0; para < p; para++) {
    const parts: string[] = [];
    for (let i = 0; i < n; i++) {
      parts.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    let sentence = parts.join(" ");
    // capitaliza e pontua em frases de ~12 palavras
    let res = "";
    const wordsArr = sentence.split(" ");
    let buf: string[] = [];
    for (const w of wordsArr) {
      buf.push(w);
      if (buf.length >= 12) {
        const s = buf.join(" ");
        res += s.charAt(0).toUpperCase() + s.slice(1) + ". ";
        buf = [];
      }
    }
    if (buf.length) {
      const s = buf.join(" ");
      res += s.charAt(0).toUpperCase() + s.slice(1) + ".";
    }
    out.push(res.trim());
  }
  const prefix = startClassic && p >= 1 ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." : "";
  return out.map((o, i) => (startClassic && i === 0 && prefix ? prefix + " " + o.replace(/^[A-Z][^.]*\.\s*/, "") : o)).join("\n\n");
}

export default function LoremIpsumGeneratorClient() {
  const [words, setWords] = useState("50");
  const [paragraphs, setParagraphs] = useState("3");
  const [classic, setClassic] = useState(true);
  const [result, setResult] = useState("");

  const generate = () => setResult(generateLorem(parseInt(words, 10) || 50, parseInt(paragraphs, 10) || 3, classic));

  const copy = async () => {
    try { await navigator.clipboard.writeText(result); } catch { /* noop */ }
  };

  const inputCls = "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">WORDS / PARAGRAPH (max 1000)</label>
          <input type="number" min="1" max="1000" value={words} onChange={(e) => setWords(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">PARAGRAPHS (max 50)</label>
          <input type="number" min="1" max="50" value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} className={inputCls} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer select-none">
        <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} className="accent-accent w-4 h-4" />
        Start with the classic "Lorem ipsum dolor sit amet…"
      </label>

      <button type="button" onClick={generate} className="self-center bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors">✨ GENERATE</button>

      {result && (
        <div>
          <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">OUTPUT</div>
          <div className="relative">
            <textarea readOnly value={result} rows={10} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs text-ink/80 bg-paper focus:outline-none resize-y" />
            <button type="button" onClick={copy} className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors">📋 COPY</button>
          </div>
        </div>
      )}
    </div>
  );
}
