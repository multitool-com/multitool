"use client";

import { useState } from "react";

const WORDS = [
  "apple", "breeze", "canyon", "dolphin", "ember", "forest", "galaxy", "harbor", "island", "jasmine",
  "kettle", "lagoon", "meadow", "nectar", "ocean", "pixel", "quartz", "river", "sunset", "thunder",
  "umbrella", "valley", "willow", "zenith", "anchor", "blossom", "crystal", "dune", "echo", "falcon",
  "garden", "horizon", "ivory", "jungle", "kite", "lantern", "mosaic", "nebula", "orbit", "petal",
  "quiver", "raven", "sapphire", "tundra", "unity", "vortex", "whisper", "yonder", "zephyr", "aurora",
];

export default function RandomWordGeneratorClient() {
  const [count, setCount] = useState(1);
  const [words, setWords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, Math.min(count, WORDS.length)));
    setCopied(false);
  };

  const copyAll = async () => {
    if (words.length === 0) return;
    try {
      await navigator.clipboard.writeText(words.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* ignore */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label htmlFor="rw-count" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            HOW MANY WORDS
          </label>
          <input
            id="rw-count"
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            className="w-24 border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="button"
          onClick={generate}
          className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent"
        >
          GENERATE
        </button>
        {words.length > 0 && (
          <button
            type="button"
            onClick={copyAll}
            className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
          >
            {copied ? "✓ COPIED" : "COPY ALL"}
          </button>
        )}
      </div>

      {words.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {words.map((w, i) => (
            <span key={i} className="bg-paper border border-ink/10 rounded-full px-4 py-2 font-mono text-sm font-semibold text-ink">
              {w}
            </span>
          ))}
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Uses:</strong> creative writing prompts,
        game names, passwords made of words, or just a spark of inspiration.
      </div>
    </div>
  );
}
