"use client";

import { useState, useMemo } from "react";

interface TextStats {
  words: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export default function WordCounterClient() {
  const [text, setText] = useState("");

  const stats = useMemo<TextStats>(() => {
    if (!text.trim()) {
      return {
        words: 0,
        charactersWithSpaces: 0,
        charactersWithoutSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
      };
    }

    const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const charactersWithSpaces = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // 225 words per minute (reading), 130 wpm (speaking)
    const readingTimeMinutes = words / 225;
    const speakingTimeMinutes = words / 130;

    return {
      words,
      charactersWithSpaces,
      charactersWithoutSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60);
      return `${seconds} sec`;
    }
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Textarea */}
      <div>
        <label
          htmlFor="text-input"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          ENTER YOUR TEXT
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={10}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      {/* Visor principal — Word Count */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          WORD COUNT
        </span>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-5xl font-semibold text-accent">
            {stats.words}
          </span>
          <span className="font-mono text-sm text-paper/70">words</span>
        </div>
      </div>

      {/* Breakdown Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBlock
          label="CHARACTERS"
          value={stats.charactersWithSpaces.toLocaleString()}
          sublabel={`(without spaces: ${stats.charactersWithoutSpaces.toLocaleString()})`}
        />
        <StatBlock
          label="SENTENCES"
          value={stats.sentences.toLocaleString()}
        />
        <StatBlock
          label="PARAGRAPHS"
          value={stats.paragraphs.toLocaleString()}
        />
        <StatBlock
          label="READING TIME"
          value={formatTime(stats.readingTimeMinutes)}
          highlight
        />
        <StatBlock
          label="SPEAKING TIME"
          value={formatTime(stats.speakingTimeMinutes)}
          highlight
        />
      </div>

      {!text.trim() && (
        <p className="text-sm text-ink/50 text-center italic">
          Start typing to see real-time statistics.
        </p>
      )}
    </div>
  );
}

function StatBlock({
  label,
  value,
  sublabel,
  highlight = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
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
      {sublabel && (
        <span className="font-mono text-[9px] text-ink/40 block mt-1">
          {sublabel}
        </span>
      )}
    </div>
  );
}