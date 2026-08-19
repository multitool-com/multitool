"use client";

import { useState } from "react";

const enc = new TextEncoder();
const dec = new TextDecoder();

/** Uint8Array -> ArrayBuffer (evita erro de tipo Uint8Array<ArrayBufferLike> no TS 5.7+) */
function toBuf(u8: Uint8Array): ArrayBuffer {
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
}

async function getKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const subtle = (globalThis as { crypto?: { subtle?: SubtleCrypto } }).crypto?.subtle!;
  const base = await subtle.importKey("raw", toBuf(enc.encode(passphrase)), "PBKDF2", false, ["deriveKey"]);
  return subtle.deriveKey(
    { name: "PBKDF2", salt: toBuf(salt), iterations: 100000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(plain: string, passphrase: string): Promise<string> {
  const subtle = (globalThis as { crypto?: { subtle?: SubtleCrypto } }).crypto?.subtle!;
  const salt = (globalThis as { crypto?: Crypto }).crypto!.getRandomValues(new Uint8Array(12));
  const iv = (globalThis as { crypto?: Crypto }).crypto!.getRandomValues(new Uint8Array(12));
  const key = await getKey(passphrase, salt);
  const ct = await subtle.encrypt({ name: "AES-GCM", iv: toBuf(iv) }, key, toBuf(enc.encode(plain)));
  const merged = new Uint8Array(salt.length + iv.length + ct.byteLength);
  merged.set(salt, 0);
  merged.set(iv, salt.length);
  merged.set(new Uint8Array(ct), salt.length + iv.length);
  return btoa(String.fromCharCode(...merged));
}

export async function decryptText(payload: string, passphrase: string): Promise<string> {
  const subtle = (globalThis as { crypto?: { subtle?: SubtleCrypto } }).crypto?.subtle!;
  const raw = Uint8Array.from(atob(payload.trim()), (c) => c.charCodeAt(0));
  if (raw.length < 25) throw new Error("bad payload");
  const salt = raw.slice(0, 12);
  const iv = raw.slice(12, 24);
  const ct = raw.slice(24);
  const key = await getKey(passphrase, salt);
  const pt = await subtle.decrypt({ name: "AES-GCM", iv: toBuf(iv) }, key, toBuf(ct));
  return dec.decode(pt);
}

export default function TextEncryptorClient() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [text, setText] = useState("This is a secret message.");
  const [pass, setPass] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setError("");
    setOutput("");
    if (!pass) {
      setError("Enter a passphrase.");
      return;
    }
    setBusy(true);
    try {
      setOutput(mode === "encrypt" ? await encryptText(text, pass) : await decryptText(text, pass));
    } catch {
      setError(mode === "decrypt" ? "Could not decrypt — wrong passphrase or corrupted data." : "Encryption failed.");
    }
    setBusy(false);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => { setMode("encrypt"); setOutput(""); setError(""); }} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "encrypt" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>🔒 ENCRYPT</button>
        <button type="button" onClick={() => { setMode("decrypt"); setOutput(""); setError(""); }} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${mode === "decrypt" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>🔓 DECRYPT</button>
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">{mode === "encrypt" ? "TEXT" : "ENCRYPTED TEXT"}</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y" />
      </div>

      <div>
        <label htmlFor="te-pass" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">PASSPHRASE</label>
        <input id="te-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="A long passphrase is safer…" className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>

      <button type="button" onClick={run} disabled={busy} className="self-center bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors">
        {busy ? "WORKING…" : mode === "encrypt" ? "🔒 ENCRYPT" : "🔓 DECRYPT"}
      </button>

      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}

      {output && (
        <div>
          <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">RESULT</div>
          <div className="relative">
            <textarea readOnly value={output} rows={4} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs text-ink/80 bg-paper focus:outline-none resize-y" />
            <button type="button" onClick={copy} className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY"}</button>
          </div>
        </div>
      )}

      <p className="text-xs text-ink/50">AES-256-GCM with PBKDF2 key derivation (100,000 iterations). The passphrase never leaves your device — if you lose it, the data is unrecoverable.</p>
    </div>
  );
}
