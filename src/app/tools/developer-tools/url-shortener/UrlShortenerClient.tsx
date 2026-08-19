"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  original: string;
  short: string;
}

export default function UrlShortenerClient() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load session history
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("multitool-url-shortener-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = (items: HistoryItem[]) => {
    try {
      sessionStorage.setItem("multitool-url-shortener-history", JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const shorten = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Paste a URL first.");
      return;
    }
    // basic client validation
    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      setError("That does not look like a valid URL — include https://");
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setError("Only http:// and https:// URLs are supported.");
      return;
    }

    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as { result_url?: string; error?: string };
      if (!res.ok || !data.result_url) {
        setError(data.error || "Shortening failed. Try again.");
        return;
      }
      setResult(data.result_url);
      const item: HistoryItem = { original: trimmed, short: data.result_url };
      const next = [item, ...history.filter((h) => h.original !== trimmed)].slice(0, 8);
      setHistory(next);
      saveHistory(next);
    } catch {
      setError("Shortening failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable: ignore
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label
          htmlFor="url-shortener-input"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          LONG URL
        </label>
        <input
          id="url-shortener-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") shorten();
          }}
          placeholder="https://example.com/some/very/long/path?with=params"
          spellCheck={false}
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <button
        type="button"
        onClick={shorten}
        disabled={busy}
        className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
      >
        {busy ? "SHORTENING…" : "SHORTEN"}
      </button>

      {error && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 font-mono text-xs text-accent break-all">
          {error}
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest text-ink/60">
            SHORT LINK
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm font-semibold text-accent hover:underline break-all flex-1 min-w-0"
            >
              {result}
            </a>
            <button
              type="button"
              onClick={() => copy(result)}
              className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
            >
              {copied ? "✓ COPIED" : "COPY"}
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              RECENT ({history.length})
            </span>
            <button
              type="button"
              onClick={() => {
                setHistory([]);
                saveHistory([]);
              }}
              className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
            >
              CLEAR
            </button>
          </div>
          <div className="bg-paper border border-ink/10 rounded-lg divide-y divide-ink/5">
            {history.map((h, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-ink/50 truncate">{h.original}</p>
                  <p className="font-mono text-xs font-semibold text-accent break-all">
                    {h.short}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(h.short)}
                  className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent transition-colors shrink-0"
                >
                  COPY
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Privacy note:</strong> the URL is sent
        to a third-party service (cleanuri.com) to create the redirect —
        that is how URL shorteners work. Do not shorten private or sensitive
        links. Your history stays only in this browser for the session.
      </div>
    </div>
  );
}
