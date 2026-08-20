"use client";

import { useState } from "react";
import { format } from "sql-formatter";
import { trackToolUsed, trackCopy } from "@/lib/analytics";

const DIALECTS = [
  { id: "postgresql", label: "POSTGRESQL" },
  { id: "mysql", label: "MYSQL" },
  { id: "mariadb", label: "MARIADB" },
  { id: "sqlite", label: "SQLITE" },
  { id: "transactsql", label: "T-SQL" },
  { id: "bigquery", label: "BIGQUERY" },
] as const;

type Dialect = (typeof DIALECTS)[number]["id"];

export default function SqlFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("postgresql");
  const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");
  const [indent, setIndent] = useState<"2" | "4">("2");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) {
      setError("Paste a SQL query first.");
      return;
    }
    try {
      trackToolUsed("sql-formatter", "developer-tools");
      const out = format(input, {
        language: dialect,
        keywordCase,
        tabWidth: indent === "2" ? 2 : 4,
        expressionWidth: 60,
      });
      setOutput(out);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not format: ${e.message}`
          : "Could not format this query."
      );
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      trackCopy("sql-formatter", "developer-tools");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Clipboard not available in this browser.");
    }
  };

  const selectCls =
    "border border-ink/15 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent bg-white";

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as Dialect)}
            className={selectCls}
            aria-label="SQL dialect"
          >
            {DIALECTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          <select
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value as typeof keywordCase)}
            className={selectCls}
            aria-label="Keyword case"
          >
            <option value="upper">KEYWORDS: UPPER</option>
            <option value="lower">keywords: lower</option>
            <option value="preserve">preserve</option>
          </select>
          <div className="flex gap-1">
            {(["2", "4"] as const).map((i) => (
              <button
                key={i}
                onClick={() => setIndent(i)}
                className={`font-mono text-xs tracking-widest rounded-full px-4 py-1.5 transition-colors ${
                  indent === i
                    ? "bg-deep text-paper"
                    : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <span className="flex-1" />
          <button
            onClick={run}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            FORMAT SQL
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          placeholder="select u.id, u.name, count(o.id) from users u join orders o on o.user_id = u.id where u.active = true group by u.id, u.name order by count(o.id) desc;"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs whitespace-pre-wrap">
            {error}
          </div>
        )}

        {output && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-ink/40">RESULT</span>
              <button
                onClick={copy}
                className="font-mono text-xs text-accent hover:underline"
              >
                {copied ? "COPIED ✓" : "COPY"}
              </button>
            </div>
            <pre className="bg-deep text-paper/90 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto whitespace-pre">
              {output}
            </pre>
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your queries are never uploaded.
      </p>
    </div>
  );
}
