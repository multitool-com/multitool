"use client";

import { useState } from "react";

export function passwordScore(pw: string): { score: number; max: number; checks: { label: string; ok: boolean }[]; entropy: number } {
  const checks = [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "Uppercase + lowercase letters", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { label: "At least one number", ok: /\d/.test(pw) },
    { label: "At least one symbol", ok: /[^A-Za-z0-9]/.test(pw) },
    { label: "No repeated patterns (aaa, 123)", ok: !/(.)\1{2,}/.test(pw) && !/(123|234|345|456|567|678|789|abc|bcd|cde)/i.test(pw) },
    { label: "Not in common passwords list", ok: !COMMON.has(pw.toLowerCase()) },
  ];
  const passed = checks.filter((c) => c.ok).length;
  // entropy estimate: pool size by classes
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
  const entropy = pw.length > 0 && pool > 0 ? pw.length * Math.log2(pool) : 0;
  const score = Math.min(4, Math.round((passed / checks.length) * 4));
  return { score, max: 4, checks, entropy };
}

const COMMON = new Set([
  "password", "123456", "12345678", "123456789", "qwerty", "abc123", "letmein", "welcome",
  "iloveyou", "monkey", "dragon", "football", "baseball", "admin", "12345", "1234567",
  "111111", "000000", "password1", "qwerty123", "admin123", "letmein1", "sunshine", "princess",
]);

const LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-lime-500", "bg-green-500"];

export default function PasswordStrengthClient() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const r = passwordScore(pw);

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="ps-pw" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">PASSWORD</label>
        <div className="relative">
          <input
            id="ps-pw"
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Type a password…"
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent pr-16"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-ink/50 hover:text-accent">{show ? "🙈" : "👁"}</button>
        </div>
      </div>

      {pw.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < r.score ? COLORS[r.score] : "bg-ink/10"}`} />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold" style={{ color: r.score >= 3 ? "#16a34a" : r.score === 2 ? "#ca8a04" : "#dc2626" }}>
                {LABELS[r.score]}
              </span>
              <span className="font-mono text-[10px] text-ink/50">~{Math.round(r.entropy)} bits of entropy</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {r.checks.map((c, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm ${c.ok ? "text-green-600" : "text-ink/50"}`}>
                <span className="font-mono text-xs w-5 text-center">{c.ok ? "✓" : "○"}</span>
                {c.label}
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/50">No password is sent anywhere — everything is checked locally in your browser.</p>
        </>
      )}
    </div>
  );
}
