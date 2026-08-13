"use client";

import { useMemo, useState } from "react";

const SAMPLE = `The quick brown fox jumps over the lazy dog. The dog sleeps all day. This is a very simple text that almost anyone can understand easily.`;

// English syllable approximation: each vowel run counts as one syllable,
// with corrections for silent e and common endings.
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  let count = 0;
  let prevVowel = false;
  for (const ch of w) {
    const isVowel = "aeiouy".includes(ch);
    if (isVowel && !prevVowel) count += 1;
    prevVowel = isVowel;
  }
  if (w.endsWith("e") && !w.endsWith("le")) count -= 1;
  if (count < 1) count = 1;
  return count;
}

function analyze(text: string) {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w));
  const wordCount = words.length;

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => /[a-zA-Z0-9]/.test(s));
  const sentenceCount = Math.max(1, sentences.length);

  let syllableCount = 0;
  for (const word of words) syllableCount += countSyllables(word);

  if (wordCount === 0) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      score: null,
      grade: null,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
    };
  }

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  const score =
    206.835 -
    1.015 * avgWordsPerSentence -
    84.6 * avgSyllablesPerWord;

  const grade =
    0.39 * avgWordsPerSentence +
    11.8 * avgSyllablesPerWord -
    15.59;

  return {
    wordCount,
    sentenceCount,
    syllableCount,
    score,
    grade,
    avgWordsPerSentence,
    avgSyllablesPerWord,
  };
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Very easy to read";
  if (score >= 80) return "Easy to read";
  if (score >= 70) return "Fairly easy to read";
  if (score >= 60) return "Plain English";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

export default function ReadabilityClient() {
  const [text, setText] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => analyze(text), [text]);

  const score = stats.score === null ? null : Math.max(0, Math.min(100, stats.score));
  const grade =
    stats.grade === null ? null : Math.max(0, Math.min(18, stats.grade));
  const verdict =
    score === null
      ? "—"
      : `${scoreLabel(score)} · Grade ${Math.round(grade ?? 0)}`;

  const copyReport = async () => {
    if (!text.trim()) return;
    const lines = [
      "READABILITY REPORT",
      "==================",
      `Words: ${stats.wordCount}`,
      `Sentences: ${stats.sentenceCount}`,
      `Syllables: ${stats.syllableCount}`,
      `Words per sentence: ${stats.avgWordsPerSentence.toFixed(1)}`,
      `Syllables per word: ${stats.avgSyllablesPerWord.toFixed(2)}`,
      "",
      `Flesch Reading Ease: ${score === null ? "—" : Math.round(score)}`,
      `Flesch-Kincaid Grade: ${grade === null ? "—" : grade.toFixed(1)}`,
      `Verdict: ${verdict}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable: ignore
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label
          htmlFor="readability-text"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          YOUR TEXT
        </label>
        <textarea
          id="readability-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setText(SAMPLE)}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          LOAD SAMPLE
        </button>
        <button
          type="button"
          onClick={() => setText("")}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          CLEAR
        </button>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          FLESCH READING EASE
        </span>
        {score !== null ? (
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">
              {Math.round(score)}
            </span>
            <span className="font-mono text-sm text-paper/70">
              / 100 · {verdict}
            </span>
          </div>
        ) : (
          <span className="font-mono text-5xl font-semibold text-accent">—</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBlock label="WORDS" value={String(stats.wordCount)} highlight />
        <StatBlock label="SENTENCES" value={String(stats.sentenceCount)} />
        <StatBlock label="SYLLABLES" value={String(stats.syllableCount)} />
        <StatBlock
          label="GRADE LEVEL"
          value={grade === null ? "—" : grade.toFixed(1)}
          highlight
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widest text-ink/60">
          SCALE
        </span>
        <div className="bg-paper border border-ink/10 rounded-lg p-4">
          <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mb-3" />
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 font-mono text-[10px] text-ink/50">
            <span>0–29 VERY DIFFICULT</span>
            <span>30–49 DIFFICULT</span>
            <span>50–59 FAIRLY DIFFICULT</span>
            <span>60–69 PLAIN ENGLISH</span>
            <span>70–79 FAIRLY EASY</span>
            <span>80–89 EASY</span>
            <span>90–100 VERY EASY</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          <strong className="text-ink">Words per sentence:</strong>{" "}
          {stats.avgWordsPerSentence.toFixed(1)}
          <br />
          <span className="text-ink/50">
            Aim for 15–20 in plain English.
          </span>
        </div>
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          <strong className="text-ink">Syllables per word:</strong>{" "}
          {stats.avgSyllablesPerWord.toFixed(2)}
          <br />
          <span className="text-ink/50">
            Short words (≈1.5) are easier to read.
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={copyReport}
        disabled={!text.trim()}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
      >
        {copied ? "✓ REPORT COPIED" : "COPY REPORT"}
      </button>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> Scores are estimates
        based on standard formulas (Flesch Reading Ease and Flesch-Kincaid).
        Syllable counting is approximate — it works best with English text.
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg px-3 py-3 ${
        highlight
          ? "bg-accent/10 border-accent/30"
          : "bg-paper border-ink/10"
      }`}
    >
      <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
        {label}
      </span>
      <span
        className={`font-mono text-sm font-semibold ${
          highlight ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
