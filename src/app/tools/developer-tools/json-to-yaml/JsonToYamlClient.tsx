"use client";

import { useState } from "react";
import { parse, stringify } from "yaml";
import { trackToolUsed, trackCopy } from "@/lib/analytics";

type Dir = "json2yaml" | "yaml2json";

export default function JsonToYamlClient() {
  const [dir, setDir] = useState<Dir>("json2yaml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) {
      setError(`Paste ${dir === "json2yaml" ? "JSON" : "YAML"} first.`);
      return;
    }
    try {
      trackToolUsed("json-to-yaml", "developer-tools");
      if (dir === "json2yaml") {
        const obj = JSON.parse(input);
        setOutput(stringify(obj, { indent: 2, lineWidth: 0 }));
      } else {
        const obj = parse(input, { merge: true });
        setOutput(JSON.stringify(obj, null, 2));
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? `${dir === "json2yaml" ? "Invalid JSON" : "Invalid YAML"}: ${e.message}`
          : "Could not convert this input."
      );
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      trackCopy("json-to-yaml", "developer-tools");
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
            <button
              onClick={() => {
                setDir("json2yaml");
                setOutput("");
                setError("");
              }}
              className={`font-mono text-xs tracking-widest rounded-full px-5 py-1.5 transition-colors ${
                dir === "json2yaml"
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              JSON → YAML
            </button>
            <button
              onClick={() => {
                setDir("yaml2json");
                setOutput("");
                setError("");
              }}
              className={`font-mono text-xs tracking-widest rounded-full px-5 py-1.5 transition-colors ${
                dir === "yaml2json"
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              YAML → JSON
            </button>
          </div>
          <span className="flex-1" />
          <button
            onClick={convert}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            CONVERT
          </button>
        </div>

        <label className="font-mono text-[10px] tracking-widest text-ink/40">
          {dir === "json2yaml" ? "JSON INPUT" : "YAML INPUT"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          placeholder={
            dir === "json2yaml"
              ? '{\n  "name": "multiTool",\n  "tools": ["json", "yaml"],\n  "private": true\n}'
              : "name: multiTool\ntools:\n  - json\n  - yaml\nprivate: true"
          }
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y mt-1"
        />

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs whitespace-pre-wrap">
            {error}
          </div>
        )}

        {output && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-ink/40">
                {dir === "json2yaml" ? "YAML OUTPUT" : "JSON OUTPUT"}
              </span>
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
        Everything runs in your browser — your data is never uploaded.
      </p>
    </div>
  );
}
