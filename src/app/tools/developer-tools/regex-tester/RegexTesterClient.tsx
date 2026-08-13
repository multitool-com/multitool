"use client";

import { useMemo, useState } from "react";

type Flag = "g" | "i" | "m" | "s";

const FLAG_META: { id: Flag; label: string }[] = [
  { id: "g", label: "G GLOBAL" },
  { id: "i", label: "I IGNORE CASE" },
  { id: "m", label: "M MULTILINE" },
  { id: "s", label: "S DOTALL" },
];

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState("\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b");
  const [flags, setFlags] = useState<Flag[]>(["g", "i"]);
  const [text, setText] = useState(
    "Contact us at hello@multitoolbox.online or team@example.com today."
  );

  const toggleFlag = (id: Flag) => {
    setFlags((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  };

  const compiled = useMemo(() => {
    if (!pattern) return { error: null as string | null, regex: null as RegExp | null };
    try {
      return {
        error: null,
        regex: new RegExp(pattern, flags.join("")),
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Invalid regular expression",
        regex: null,
      };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!compiled.regex || !text) return [];
    const regex = new RegExp(compiled.regex.source, compiled.regex.flags);
    const found: { index: number; text: string; groups: string[] }[] = [];
    if (!regex.global) {
      const one = regex.exec(text);
      if (one && one.index !== undefined) {
        found.push({
          index: one.index,
          text: one[0],
          groups: one.slice(1),
        });
      }
      return found;
    }
    let hit: RegExpExecArray | null;
    let guard = 0;
    while ((hit = regex.exec(text)) !== null && guard < 500) {
      found.push({
        index: hit.index,
        text: hit[0],
        groups: hit.slice(1),
      });
      if (hit[0] === "") regex.lastIndex += 1;
      guard += 1;
    }
    return found;
  }, [compiled.regex, text]);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label
          htmlFor="regex-pattern"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          PATTERN
        </label>
        <input
          id="regex-pattern"
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          spellCheck={false}
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          FLAGS
        </span>
        <div className="flex gap-2 flex-wrap">
          {FLAG_META.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleFlag(item.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                flags.includes(item.id)
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="regex-text"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          TEST STRING
        </label>
        <textarea
          id="regex-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          MATCHES
        </span>
        {compiled.error ? (
          <span className="font-mono text-lg text-accent">{compiled.error}</span>
        ) : (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">
              {matches.length}
            </span>
            <span className="font-mono text-sm text-paper/70">
              {matches.length === 1 ? "match" : "matches"}
            </span>
          </div>
        )}
      </div>

      {matches.length > 0 && (
        <div className="flex flex-col gap-2">
          {matches.map((m, i) => (
            <div
              key={`${m.index}-${i}`}
              className="bg-paper border border-ink/10 rounded-lg px-3 py-3"
            >
              <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
                #{i + 1} · INDEX {m.index}
              </span>
              <span className="font-mono text-sm font-semibold text-accent break-all">
                {m.text}
              </span>
              {m.groups.length > 0 && (
                <p className="font-mono text-[11px] text-ink/50 mt-1 break-all">
                  groups: {m.groups.map((g, gi) => `${gi + 1}=${g || "∅"}`).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> JavaScript / ECMAScript
        regex only. Do not wrap the pattern in slashes.
      </div>
    </div>
  );
}