"use client";

import { useMemo, useState } from "react";

const ROLES: { id: string; label: string; text: string }[] = [
  {
    id: "assistant",
    label: "HELPFUL ASSISTANT",
    text: "You are a helpful, accurate assistant.",
  },
  {
    id: "expert",
    label: "EXPERT",
    text: "You are an expert in the user's field with deep, up-to-date knowledge.",
  },
  {
    id: "writer",
    label: "WRITER",
    text: "You are a professional writer known for clear, engaging prose.",
  },
  {
    id: "developer",
    label: "SOFTWARE DEVELOPER",
    text: "You are a senior software engineer who writes clean, well-documented code.",
  },
  {
    id: "translator",
    label: "TRANSLATOR",
    text: "You are a professional translator. You translate meaning, not just words.",
  },
  {
    id: "teacher",
    label: "TEACHER",
    text: "You are a patient teacher who explains concepts step by step.",
  },
  {
    id: "analyst",
    label: "DATA ANALYST",
    text: "You are a data analyst who thinks in numbers, evidence and trade-offs.",
  },
  {
    id: "custom",
    label: "CUSTOM ROLE",
    text: "",
  },
];

const TONES: { id: string; label: string; text: string }[] = [
  { id: "neutral", label: "NEUTRAL", text: "Keep a neutral, factual tone." },
  { id: "friendly", label: "FRIENDLY", text: "Use a warm, friendly and encouraging tone." },
  { id: "professional", label: "PROFESSIONAL", text: "Use a formal, professional tone." },
  { id: "concise", label: "CONCISE", text: "Be concise. Prefer short sentences and avoid fluff." },
  { id: "casual", label: "CASUAL", text: "Use a casual, conversational tone." },
];

const CONSTRAINTS: { id: string; label: string; text: string }[] = [
  { id: "no-invent", label: "NEVER INVENT FACTS", text: "Never invent facts, statistics or citations. Say when you are unsure." },
  { id: "ask", label: "ASK BEFORE ACTING", text: "If the request is ambiguous, ask one clarifying question before answering." },
  { id: "json", label: "OUTPUT JSON", text: "Always respond with valid JSON, with no extra text outside the JSON." },
  { id: "no-markdown", label: "NO MARKDOWN", text: "Do not use Markdown formatting. Use plain text." },
  { id: "short", label: "KEEP IT SHORT", text: "Keep answers as short as possible while remaining complete." },
  { id: "level", label: "SIMPLE LANGUAGE", text: "Explain everything as if the user has no background in the topic." },
  { id: "examples", label: "ALWAYS GIVE EXAMPLES", text: "Illustrate answers with concrete examples." },
  { id: "step-by-step", label: "STEP BY STEP", text: "Break complex answers into clear, numbered steps." },
];

const FORMATS: { id: string; label: string; text: string }[] = [
  { id: "text", label: "PLAIN TEXT", text: "" },
  { id: "markdown", label: "MARKDOWN", text: "Format the answer using Markdown: headings, lists and bold where useful." },
  { id: "bullets", label: "BULLET LIST", text: "Answer as a bullet list." },
  { id: "table", label: "TABLE", text: "Present comparative information as a table." },
];

function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function countChars(text: string): number {
  return text.length;
}

function estimateTokens(text: string): number {
  return Math.max(0, Math.round(countChars(text) / 4));
}

export default function SystemPromptBuilderClient() {
  const [roleId, setRoleId] = useState("assistant");
  const [customRole, setCustomRole] = useState("");
  const [toneId, setToneId] = useState("neutral");
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [selected, setSelected] = useState<string[]>([
    "no-invent",
    "ask",
  ]);
  const [formatId, setFormatId] = useState("markdown");
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  };

  const roleText = useMemo(() => {
    const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0];
    if (roleId === "custom") {
      return customRole.trim()
        ? `You are: ${customRole.trim()}`
        : "";
    }
    return role.text;
  }, [roleId, customRole]);

  const prompt = useMemo(() => {
    const lines: string[] = [];

    if (roleText) lines.push(roleText);

    const tone = TONES.find((t) => t.id === toneId);
    if (tone && tone.text) lines.push(tone.text);

    if (task.trim()) lines.push(`Task: ${task.trim()}`);

    const selectedConstraints = CONSTRAINTS.filter((c) =>
      selected.includes(c.id)
    ).map((c) => c.text);
    if (selectedConstraints.length > 0) {
      lines.push("Rules:");
      selectedConstraints.forEach((c) => lines.push(`- ${c}`));
    }

    const format = FORMATS.find((f) => f.id === formatId);
    if (format && format.text) lines.push(format.text);

    if (context.trim()) {
      lines.push("");
      lines.push("Context:");
      lines.push(context.trim());
    }

    return lines.join("\n");
  }, [roleText, toneId, task, selected, formatId, context]);

  const words = countWords(prompt);
  const chars = countChars(prompt);
  const tokens = estimateTokens(prompt);

  const copy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable: ignore
    }
  };

  const loadSample = () => {
    setRoleId("developer");
    setToneId("concise");
    setTask(
      "Review the code the user pastes and explain bugs, risks and improvements. Suggest fixes with short code snippets."
    );
    setContext("The user is a junior developer working with TypeScript and React.");
    setSelected(["no-invent", "ask", "examples", "step-by-step"]);
    setFormatId("markdown");
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Role */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          ROLE
        </span>
        <div className="flex gap-2 flex-wrap">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleId(r.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                roleId === r.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {roleId === "custom" && (
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="e.g. You are a nutritionist specialized in sports…"
            className="mt-3 w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        )}
      </div>

      {/* Tone */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          TONE
        </span>
        <div className="flex gap-2 flex-wrap">
          {TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setToneId(t.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                toneId === t.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task */}
      <div>
        <label
          htmlFor="spp-task"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          TASK (WHAT SHOULD THE AI DO?)
        </label>
        <textarea
          id="spp-task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={3}
          placeholder="e.g. Summarize the text the user pastes into 5 bullet points…"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      {/* Constraints */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          CONSTRAINTS
        </span>
        <div className="flex gap-2 flex-wrap">
          {CONSTRAINTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`font-mono text-[10px] tracking-widest px-3 py-2 rounded-full transition-colors ${
                selected.includes(c.id)
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output format */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          OUTPUT FORMAT
        </span>
        <div className="flex gap-2 flex-wrap">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormatId(f.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                formatId === f.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Context */}
      <div>
        <label
          htmlFor="spp-context"
          className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
        >
          CONTEXT (OPTIONAL)
        </label>
        <textarea
          id="spp-context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
          placeholder="e.g. The user is a beginner. The audience is marketing managers."
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={loadSample}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          LOAD SAMPLE
        </button>
        <button
          type="button"
          onClick={() => {
            setTask("");
            setContext("");
            setSelected([]);
            setCustomRole("");
          }}
          className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors"
        >
          CLEAR
        </button>
      </div>

      {/* Prompt output */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest text-ink/60">
            SYSTEM PROMPT
          </span>
          <button
            type="button"
            onClick={copy}
            disabled={!prompt}
            className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
          >
            {copied ? "✓ COPIED" : "COPY PROMPT"}
          </button>
        </div>
        <textarea
          id="spp-output"
          readOnly
          value={prompt}
          rows={12}
          spellCheck={false}
          className="w-full bg-deep text-paper border-0 rounded-lg px-4 py-3 font-mono text-xs leading-relaxed focus:outline-none resize-y"
        />
        {!prompt && (
          <p className="font-mono text-[10px] text-ink/40">
            Choose a role or write a task to start building.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="WORDS" value={String(words)} highlight />
        <StatBlock label="CHARS" value={String(chars)} />
        <StatBlock label="≈ TOKENS" value={String(tokens)} highlight />
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> No AI is used to build
        the prompt — it is assembled from your choices. Paste the result in
        ChatGPT (Custom Instructions), Claude, Gemini or any LLM API.
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
