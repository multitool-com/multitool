"use client";

import { useState } from "react";
import format from "xml-formatter";
import { trackToolUsed, trackCopy } from "@/lib/analytics";

function validateXml(xml: string): string | null {
  try {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const err = doc.getElementsByTagName("parsererror")[0];
    if (err) return err.textContent || "Invalid XML.";
    return null;
  } catch {
    return "Could not parse this XML.";
  }
}

export default function XmlFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<"2" | "4">("2");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [copied, setCopied] = useState(false);

  const run = (mode: "format" | "minify" | "validate") => {
    setError("");
    setOk("");
    setCopied(false);
    if (!input.trim()) {
      setError("Paste some XML first.");
      return;
    }
    const v = validateXml(input);
    if (v) {
      setError(v);
      return;
    }
    if (mode === "validate") {
      setOk("VALID — the XML is well-formed.");
      return;
    }
    try {
      trackToolUsed("xml-formatter", "developer-tools");
      const out = format(input, {
        indentation: indent === "2" ? "  " : "    ",
        filter: (node) => node.type !== "Comment",
        collapseContent: true,
        lineSeparator: "\n",
      });
      setOutput(mode === "minify" ? out.replace(/>\s+</g, "><").trim() : out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not format this XML.");
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      trackCopy("xml-formatter", "developer-tools");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Clipboard not available in this browser.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
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
                {i} SPACES
              </button>
            ))}
          </div>
          <span className="flex-1" />
          <button
            onClick={() => run("format")}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            FORMAT
          </button>
          <button
            onClick={() => run("minify")}
            className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs tracking-widest px-6 py-3 rounded-lg transition-colors"
          >
            MINIFY
          </button>
          <button
            onClick={() => run("validate")}
            className="bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent font-mono text-xs tracking-widest px-6 py-3 rounded-lg transition-colors"
          >
            VALIDATE
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          placeholder="<root>&#10;  <item id=&quot;1&quot;>Paste your XML here</item>&#10;</root>"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs whitespace-pre-wrap">
            {error}
          </div>
        )}
        {ok && (
          <div className="mt-3 bg-accent/10 border border-accent/30 text-accent rounded-lg px-4 py-3 font-mono text-xs">
            {ok}
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
            <pre className="bg-deep text-paper/90 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap break-all">
              {output}
            </pre>
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Everything runs in your browser — your XML is never uploaded.
      </p>
    </div>
  );
}
