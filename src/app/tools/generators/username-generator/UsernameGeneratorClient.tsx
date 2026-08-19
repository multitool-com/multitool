"use client";

import { useState } from "react";

const ADJECTIVES = [
  "cool", "epic", "fast", "wild", "dark", "lucky", "neon", "silent", "brave", "crimson",
  "golden", "hidden", "icy", "jolly", "krazy", "lunar", "mighty", "ninja", "omega", "pixel",
  "quantum", "rapid", "shadow", "turbo", "ultra", "vivid", "witty", "zen", "cosmic", "frozen",
];

const NOUNS = [
  "wolf", "tiger", "falcon", "dragon", "phoenix", "shark", "eagle", "panther", "viper", "raven",
  "bear", "cobra", "fox", "hawk", "jaguar", "lion", "owl", "panda", "rhino", "snake",
  "turtle", "unicorn", "whale", "zebra", "gamer", "knight", "rider", "storm", "blaze", "frost",
];

const SUFFIXES = ["", "", "", "x", "z", "99", "007", "42", "_", ".", "!", "king", "pro", "xX", "Xx"];

export default function UsernameGeneratorClient() {
  const [count, setCount] = useState(5);
  const [style, setStyle] = useState<"mix" | "word" | "leet">("mix");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const leet = (s: string) =>
    s.replace(/a/g, "4").replace(/e/g, "3").replace(/i/g, "1").replace(/o/g, "0").replace(/s/g, "5").replace(/t/g, "7");

  const generate = () => {
    const out: string[] = [];
    const seen = new Set<string>();
    let guard = 0;
    while (out.length < count && guard < 200) {
      guard += 1;
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
      const num = Math.floor(Math.random() * 100);
      let name: string;
      if (style === "word") {
        name = `${adj}${noun}${suffix}`;
      } else if (style === "leet") {
        name = leet(`${adj}${noun}`) + num;
      } else {
        const r = Math.random();
        name = r < 0.5 ? `${adj}${noun}${suffix}` : `${adj}_${noun}${num}`;
      }
      if (seen.has(name)) continue;
      seen.add(name);
      out.push(name);
    }
    setUsernames(out);
  };

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      setTimeout(() => setCopied(null), 1400);
    } catch { /* ignore */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="grid sm:grid-cols-2 gap-3 items-end">
        <div>
          <label htmlFor="un-count" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            HOW MANY
          </label>
          <input
            id="un-count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">STYLE</span>
          <div className="flex gap-2 flex-wrap">
            {(["mix", "word", "leet"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                  style === s ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent"
      >
        GENERATE USERNAMES
      </button>

      {usernames.length > 0 && (
        <div className="flex flex-col gap-2">
          {usernames.map((name, i) => (
            <div key={i} className="bg-paper border border-ink/10 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <span className="font-mono text-sm font-semibold text-ink break-all">@{name}</span>
              <button
                type="button"
                onClick={() => copy(name)}
                className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent transition-colors shrink-0"
              >
                {copied === name ? "✓" : "COPY"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Tip:</strong> check availability on
        your platform before committing — many names are taken. The leet
        style replaces letters with numbers (e.g. "shadow" → "5h4d0w").
      </div>
    </div>
  );
}
