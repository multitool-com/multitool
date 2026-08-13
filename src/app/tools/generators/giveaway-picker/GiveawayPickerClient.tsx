"use client";

import { useMemo, useState } from "react";

function normalizeName(raw: string): string {
  return raw.trim().replace(/^@+/, "").replace(/\s+/g, " ");
}

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,;]+/)
    .map(normalizeName)
    .filter((line) => line.length > 0);
}

function uniquePreserve(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function cryptoShuffle<T>(input: T[]): T[] {
  const arr = [...input];
  const bytes = new Uint32Array(arr.length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < arr.length; i += 1) bytes[i] = Math.floor(Math.random() * 2 ** 32);
  }
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = bytes[i] % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export default function GiveawayPickerClient() {
  const [raw, setRaw] = useState("");
  const [excludeRaw, setExcludeRaw] = useState("");
  const [winnerCount, setWinnerCount] = useState("1");
  const [dedupe, setDedupe] = useState(true);
  const [winners, setWinners] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [fileLabel, setFileLabel] = useState("");

  const entries = useMemo(() => {
    const parsed = parseList(raw);
    const base = dedupe ? uniquePreserve(parsed) : parsed;
    const excluded = new Set(parseList(excludeRaw).map((n) => n.toLowerCase()));
    return base.filter((n) => !excluded.has(n.toLowerCase()));
  }, [raw, excludeRaw, dedupe]);

  const duplicatesRemoved = useMemo(() => {
    const parsed = parseList(raw);
    return Math.max(0, parsed.length - uniquePreserve(parsed).length);
  }, [raw]);

  const draw = () => {
    const n = parseInt(winnerCount, 10);
    if (!entries.length || isNaN(n) || n < 1) {
      setWinners([]);
      return;
    }
    const shuffled = cryptoShuffle(entries);
    setWinners(shuffled.slice(0, Math.min(n, shuffled.length)));
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setRaw((current) => (current.trim() ? `${current.trim()}\n${text}` : text));
    setFileLabel(file.name);
  };

  const copyWinners = async () => {
    try {
      await navigator.clipboard.writeText(winners.map((w, i) => `${i + 1}. @${w}`).join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label
          htmlFor="giveaway-list"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          PARTICIPANTS (ONE PER LINE)
        </label>
        <textarea
          id="giveaway-list"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          placeholder={"@ana\n@bruno\n@carla\n..."}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div>
        <label
          htmlFor="giveaway-file"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          OR UPLOAD .TXT / .CSV
        </label>
        <input
          id="giveaway-file"
          type="file"
          accept=".txt,.csv,text/plain,text/csv"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="w-full font-mono text-xs file:mr-3 file:font-mono file:text-xs file:tracking-widest file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-deep file:text-paper"
        />
        {fileLabel && (
          <p className="font-mono text-[10px] text-ink/40 mt-1">LOADED: {fileLabel}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="giveaway-exclude"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          EXCLUDE (HOST / PAST WINNERS)
        </label>
        <textarea
          id="giveaway-exclude"
          value={excludeRaw}
          onChange={(e) => setExcludeRaw(e.target.value)}
          rows={2}
          placeholder="@yourprofile"
          className="w-full border border-ink/15 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 items-end">
        <div>
          <label
            htmlFor="winner-count"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            WINNERS
          </label>
          <input
            id="winner-count"
            type="number"
            min="1"
            max="100"
            step="1"
            value={winnerCount}
            onChange={(e) => setWinnerCount(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-4 py-3">
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-sm">Remove duplicate names</span>
        </label>
      </div>

      <button
        type="button"
        onClick={draw}
        disabled={entries.length === 0}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
      >
        DRAW
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBlock label="IN THE POT" value={String(entries.length)} highlight />
        <StatBlock label="DUPLICATES REMOVED" value={String(duplicatesRemoved)} />
        <StatBlock label="DRAWN" value={String(winners.length)} highlight />
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs text-paper/50 tracking-widest">
            WINNER{winners.length === 1 ? "" : "S"}
          </span>
          {winners.length > 0 && (
            <button
              type="button"
              onClick={copyWinners}
              className="font-mono text-[10px] tracking-widest text-paper/70 hover:text-accent"
            >
              {copied ? "✓ COPIED" : "COPY"}
            </button>
          )}
        </div>
        {winners.length === 0 ? (
          <span className="font-mono text-3xl font-semibold text-paper/30">—</span>
        ) : (
          <ul className="flex flex-col gap-2">
            {winners.map((name, i) => (
              <li key={`${name}-${i}`} className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-paper/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-2xl font-semibold text-accent break-all">
                  @{name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> We cannot read Instagram
        for you. Paste the comment or follower list yourself. The file never
        leaves this device.
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