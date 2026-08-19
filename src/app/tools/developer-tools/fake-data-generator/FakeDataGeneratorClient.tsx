"use client";

import { useState } from "react";

const FIRST = ["James", "Maria", "Liam", "Sofia", "Noah", "Emma", "Lucas", "Ava", "Mateo", "Isabella", "Ethan", "Mia", "Gabriel", "Chloe", "Daniel", "Luna", "Henry", "Alice", "Leo", "Stella", "Arthur", "Maya", "Diego", "Nina", "Samuel", "Elena", "Owen", "Clara", "Adam", "Lara", "Ben", "Ivy", "Kai", "Rosa", "Max", "Talia", "Viktor", "Zoe", "Omar", "Aisha"];
const LAST = ["Smith", "Silva", "Johnson", "Santos", "Brown", "Oliveira", "Garcia", "Souza", "Miller", "Pereira", "Wilson", "Costa", "Davis", "Ferreira", "Moore", "Almeida", "Taylor", "Rodrigues", "Anderson", "Nunes", "Thomas", "Ribeiro", "Jackson", "Carvalho", "White", "Moreira", "Harris", "Gomes", "Martin", "Lima", "Thompson", "Rocha", "Young", "Martins", "King", "Barbosa", "Wright", "Mendes", "Lewis", "Dias"];
const CITIES = ["New York", "São Paulo", "London", "Berlin", "Tokyo", "Lisbon", "Paris", "Madrid", "Toronto", "Sydney", "Rome", "Amsterdam", "Dublin", "Vienna", "Zurich", "Oslo", "Prague", "Warsaw", "Athens", "Buenos Aires"];
const STREETS = ["Main St", "High Street", "Park Avenue", "King Street", "Sunset Blvd", "Maple Road", "Ocean Drive", "Central Ave", "Lake View", "Station Road"];
const JOBS = ["Designer", "Engineer", "Teacher", "Doctor", "Writer", "Manager", "Analyst", "Developer", "Chef", "Lawyer", "Nurse", "Architect"];
const COMPANIES = ["Acme Inc", "Globex", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises", "Cyberdyne", "Hooli", "Pied Piper", "Vandelay Industries"];
const COUNTRIES = ["United States", "Brazil", "United Kingdom", "Germany", "Japan", "Portugal", "France", "Spain", "Canada", "Australia"];
const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "proton.me", "example.com", "icloud.com"];

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export type FieldId = "name" | "email" | "phone" | "address" | "city" | "country" | "company" | "job" | "date" | "uuid" | "ssn";

export function generateFakeData(fields: FieldId[], rows: number): string[][] {
  const n = Math.max(1, Math.min(50, rows));
  const out: string[][] = [];
  for (let i = 0; i < n; i++) {
    const f = rand(FIRST), l = rand(LAST);
    const row = fields.map((fd) => {
      switch (fd) {
        case "name": return `${f} ${l}`;
        case "email": return `${f.toLowerCase()}.${l.toLowerCase()}${Math.floor(Math.random() * 99)}@${rand(EMAIL_DOMAINS)}`;
        case "phone": return `+${[1, 44, 55, 49, 351, 81, 33][Math.floor(Math.random() * 7)]} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
        case "address": return `${Math.floor(1 + Math.random() * 999)} ${rand(STREETS)}`;
        case "city": return rand(CITIES);
        case "country": return rand(COUNTRIES);
        case "company": return rand(COMPANIES);
        case "job": return rand(JOBS);
        case "date": return `${2026}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, "0")}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, "0")}`;
        case "uuid": {
          const c = globalThis.crypto;
          return c && "randomUUID" in c ? c.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => { const r = (Math.random() * 16) | 0; return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16); });
        }
        case "ssn": return `${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 90) + 10)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      }
    });
    out.push(row);
  }
  return out;
}

export function toCsv(header: string[], rows: string[][]): string {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [header.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

const FIELD_LABELS: { id: FieldId; label: string }[] = [
  { id: "name", label: "Full name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "address", label: "Address" },
  { id: "city", label: "City" },
  { id: "country", label: "Country" },
  { id: "company", label: "Company" },
  { id: "job", label: "Job title" },
  { id: "date", label: "Date" },
  { id: "uuid", label: "UUID" },
  { id: "ssn", label: "SSN" },
];

export default function FakeDataGeneratorClient() {
  const [fields, setFields] = useState<FieldId[]>(["name", "email", "phone", "city"]);
  const [rows, setRows] = useState("8");
  const [data, setData] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);

  const toggle = (id: FieldId) =>
    setFields((fs) => (fs.includes(id) ? fs.filter((f) => f !== id) : [...fs, id]));

  const generate = () => setData(generateFakeData(fields, parseInt(rows, 10) || 8));
  const header = fields.map((f) => FIELD_LABELS.find((x) => x.id === f)!.label);

  const copy = async (v: string) => {
    try { await navigator.clipboard.writeText(v); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  const download = () => {
    const blob = new Blob([toCsv(header, data)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fake-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">FIELDS</div>
        <div className="flex gap-2 flex-wrap">
          {FIELD_LABELS.map((f) => (
            <button key={f.id} type="button" onClick={() => toggle(f.id)} className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${fields.includes(f.id) ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"}`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="font-mono text-xs tracking-widest text-ink/60 block mb-2">ROWS (1–50)</label>
          <input type="number" min="1" max="50" value={rows} onChange={(e) => setRows(e.target.value)} className="w-24 border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <button type="button" onClick={generate} disabled={fields.length === 0} className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors">⚡ GENERATE</button>
        {data.length > 0 && (
          <>
            <button type="button" onClick={() => copy(toCsv(header, data))} className="bg-paper border border-ink/15 font-mono text-xs tracking-widest px-5 py-3 rounded-lg text-ink/70 hover:border-accent hover:text-accent transition-colors">{copied ? "✓ COPIED" : "📋 COPY CSV"}</button>
            <button type="button" onClick={download} className="bg-paper border border-ink/15 font-mono text-xs tracking-widest px-5 py-3 rounded-lg text-ink/70 hover:border-accent hover:text-accent transition-colors">⬇ CSV</button>
          </>
        )}
      </div>

      {data.length > 0 && (
        <div className="overflow-x-auto border border-ink/10 rounded-lg">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-paper text-[10px] tracking-widest text-ink/50">
                {header.map((h) => <th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h.toUpperCase()}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i} className="border-t border-ink/5 text-ink/70">
                  {r.map((v, j) => <td key={j} className="px-3 py-1.5 whitespace-nowrap">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-ink/50">All data is fictional and generated locally — perfect for testing forms, mockups and databases.</p>
    </div>
  );
}
