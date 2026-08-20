"use client";

import { useMemo, useState, useEffect, useRef} from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";

const SAMPLE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL211bHRpdG9vbGJveC5vbmxpbmUiLCJzdWIiOiIxMjM0NTY3ODkwIiwiYXVkIjpbImFwaSIsIndlYiJdLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzg2NjM2ODUyLCJleHAiOjE3ODY4MTMyNTIsImp0aSI6ImExYjJjM2Q0In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const KNOWN_CLAIMS = ["iss", "sub", "aud", "exp", "iat", "nbf", "jti"];

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function parseJson(text: string): { ok: boolean; value: unknown } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, value: null };
  }
}

function formatRelative(seconds: number, now: number): string {
  const diff = seconds - now;
  const abs = Math.abs(diff);
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [size, label] of units) {
    if (abs >= size) {
      const n = Math.floor(abs / size);
      return `${diff >= 0 ? "in" : ""} ${n} ${label}${n > 1 ? "s" : ""}${diff >= 0 ? "" : " ago"}`.trim();
    }
  }
  return diff >= 0 ? "in seconds" : "just now";
}

function pretty(part: string | undefined): string {
  if (!part) return "";
  try {
    return JSON.stringify(JSON.parse(part), null, 2);
  } catch {
    return part;
  }
}

type Decoded =
  | { state: "empty" }
  | { state: "invalid"; reason: string }
  | {
      state: "ok";
      headerRaw: string;
      payloadRaw: string;
      signatureRaw: string;
      headerJson: unknown;
      payloadJson: unknown;
      headerPretty: string;
      payloadPretty: string;
      claims: { key: string; value: unknown }[];
      now: number;
    };

export default function JwtDecoderClient() {

  const [token, setToken] = useState(SAMPLE_TOKEN);

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    if (token !== SAMPLE_TOKEN) {
      firedRef.current = true;
      trackToolUsed("jwt-decoder", "developer-tools");
    }
  }, [token]);
  const [copied, setCopied] = useState<"header" | "payload" | null>(null);

  const decoded = useMemo<Decoded>(() => {
    const t = token.trim();
    if (!t) return { state: "empty" };
    const parts = t.split(".");
    if (parts.length !== 3 || !parts[0] || !parts[1]) {
      return {
        state: "invalid",
        reason:
          "A JWT must have exactly three parts separated by dots: header.payload.signature.",
      };
    }
    const [headerRaw, payloadRaw, signatureRaw] = parts;
    let headerText: string;
    let payloadText: string;
    try {
      headerText = base64UrlDecode(headerRaw);
      payloadText = base64UrlDecode(payloadRaw);
    } catch {
      return {
        state: "invalid",
        reason: "The token is not valid base64url. Check that you copied the whole token.",
      };
    }
    const header = parseJson(headerText);
    const payload = parseJson(payloadText);
    if (!header.ok) {
      return { state: "invalid", reason: "The header is not valid JSON after decoding." };
    }
    if (!payload.ok) {
      return { state: "invalid", reason: "The payload is not valid JSON after decoding." };
    }
    const payloadObj =
      payload.value && typeof payload.value === "object"
        ? (payload.value as Record<string, unknown>)
        : {};
    const claims = KNOWN_CLAIMS.filter((k) => k in payloadObj).map((k) => ({
      key: k,
      value: payloadObj[k],
    }));
    return {
      state: "ok",
      headerRaw,
      payloadRaw,
      signatureRaw,
      headerJson: header.value,
      payloadJson: payload.value,
      headerPretty: pretty(headerText),
      payloadPretty: pretty(payloadText),
      claims,
      now: Math.floor(Date.now() / 1000),
    };
  }, [token]);

  const copy = async (kind: "header" | "payload") => {
    trackCopy("jwt-decoder", "developer-tools");
    if (decoded.state !== "ok") return;
    const text = kind === "header" ? decoded.headerPretty : decoded.payloadPretty;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard unavailable (older browsers / iframe): ignore silently
    }
  };

  const claimCell = (value: unknown): string => {
    if (typeof value === "number") {
      return `${new Date(value * 1000).toISOString()} · ${formatRelative(value, decoded.state === "ok" ? decoded.now : 0)}`;
    }
    if (Array.isArray(value)) return value.join(", ");
    if (value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label
          htmlFor="jwt-token"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          JWT TOKEN
        </label>
        <textarea
          id="jwt-token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          spellCheck={false}
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent resize-y break-all"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setToken(SAMPLE_TOKEN)}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          LOAD SAMPLE
        </button>
        <button
          type="button"
          onClick={() => setToken("")}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          CLEAR
        </button>
      </div>

      <div className="bg-deep rounded-lg px-5 py-4">
        <span className="font-mono text-xs text-paper/50 tracking-widest block mb-2">
          PARTS
        </span>
        {decoded.state === "ok" ? (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-5xl font-semibold text-accent">3</span>
            <span className="font-mono text-sm text-paper/70">
              header · payload · signature
            </span>
          </div>
        ) : (
          <span className="font-mono text-5xl font-semibold text-accent">—</span>
        )}
        {decoded.state === "invalid" && (
          <p className="font-mono text-xs text-paper/70 mt-2">{decoded.reason}</p>
        )}
      </div>

      {decoded.state === "ok" && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-ink/60">
                HEADER
              </span>
              <button
                type="button"
                onClick={() => copy("header")}
                className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
              >
                {copied === "header" ? "COPIED ✓" : "COPY JSON"}
              </button>
            </div>
            <pre className="bg-paper border border-ink/10 rounded-lg px-4 py-3 font-mono text-xs text-ink/80 overflow-x-auto whitespace-pre-wrap break-all">
              {decoded.headerPretty}
            </pre>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-ink/60">
                PAYLOAD
              </span>
              <button
                type="button"
                onClick={() => copy("payload")}
                className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
              >
                {copied === "payload" ? "COPIED ✓" : "COPY JSON"}
              </button>
            </div>
            <pre className="bg-paper border border-ink/10 rounded-lg px-4 py-3 font-mono text-xs text-ink/80 overflow-x-auto whitespace-pre-wrap break-all">
              {decoded.payloadPretty}
            </pre>
          </div>

          {decoded.claims.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-widest text-ink/60">
                COMMON CLAIMS
              </span>
              <div className="bg-paper border border-ink/10 rounded-lg overflow-hidden">
                {decoded.claims.map((claim, i) => (
                  <div
                    key={claim.key}
                    className={`flex flex-col sm:flex-row sm:items-baseline gap-1 px-4 py-3 ${
                      i > 0 ? "border-t border-ink/10" : ""
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold text-accent w-16 shrink-0">
                      {claim.key}
                    </span>
                    <span className="font-mono text-xs text-ink/80 break-all">
                      {claimCell(claim.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-widest text-ink/60">
              SIGNATURE
            </span>
            <pre className="bg-paper border border-ink/10 rounded-lg px-4 py-3 font-mono text-xs text-ink/50 overflow-x-auto whitespace-pre-wrap break-all">
              {decoded.signatureRaw}
            </pre>
          </div>

          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
            <strong className="text-ink">Note:</strong> this tool decodes the
            token only. The signature is <strong>not verified</strong> —
            verification requires the HMAC secret or public key. Keep secrets
            and sensitive data out of JWT payloads.
          </div>
        </>
      )}

      {decoded.state === "empty" && (
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          Paste a JWT above, or click <strong>Load sample</strong> to see a
          decoded token.
        </div>
      )}
    </div>
  );
}
