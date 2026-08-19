"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "hello", "world",
  "time", "life", "work", "love", "home", "city", "river", "mountain", "ocean", "forest",
  "light", "night", "music", "dance", "dream", "hope", "peace", "story", "book", "page",
  "window", "door", "garden", "flower", "stone", "cloud", "rain", "snow", "wind", "fire",
  "water", "earth", "sky", "star", "moon", "sun", "bird", "tree", "leaf", "grass",
  "road", "bridge", "tower", "castle", "village", "market", "coffee", "bread", "cheese", "apple",
  "orange", "banana", "grapes", "melon", "peach", "lemon", "sugar", "honey", "milk", "butter",
  "yellow", "purple", "orange", "silver", "golden", "purple", "bright", "dark", "soft", "loud",
  "happy", "sad", "calm", "wild", "free", "brave", "kind", "smart", "funny", "quiet",
  "simple", "clean", "fresh", "green", "blue", "black", "white", "pink", "red", "gray",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function wpm(typed: number, correct: number, seconds: number): { wpm: number; accuracy: number; cpm: number } {
  const minutes = seconds / 60;
  const wpmRaw = minutes > 0 ? (correct / 5) / minutes : 0;
  const accuracy = typed > 0 ? (correct / typed) * 100 : 0;
  return { wpm: Math.round(wpmRaw), accuracy: Math.round(accuracy * 10) / 10, cpm: Math.round(correct / minutes) };
}

export default function TypingTestClient() {
  const [duration, setDuration] = useState(30);
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [correctCount, setCorrectCount] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (d: number) => {
    setDuration(d);
    setWords(shuffle(WORDS).slice(0, 200));
    setTyped("");
    setStatus("running");
    setTimeLeft(d);
    setCorrectCount(0);
    setTypedCount(0);
    setErrors(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const onType = (v: string) => {
    if (status !== "running") return;
    setTyped(v);
    const expected = words.join(" ").slice(0, v.length);
    let correct = 0;
    for (let i = 0; i < v.length; i++) if (v[i] === expected[i]) correct++;
    setCorrectCount(correct);
    setTypedCount(v.length);
    setErrors(v.length - correct);
  };

  const res = status === "done" ? wpm(typedCount, correctCount, duration) : null;
  const currentWordIndex = words.length ? typed.split(" ").length - 1 : 0;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        {[15, 30, 60].map((d) => (
          <button key={d} type="button" onClick={() => start(d)} disabled={status === "running"} className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${duration === d ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"} disabled:opacity-40`}>{d}s</button>
        ))}
      </div>

      {status !== "idle" && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-2xl font-bold text-accent tabular-nums">{timeLeft}s</span>
          {status === "running" && (
            <span className="font-mono text-xs text-ink/50">word {currentWordIndex + 1}</span>
          )}
        </div>
      )}

      {status !== "idle" && (
        <div className="bg-paper border border-ink/10 rounded-xl px-4 py-4 font-mono text-lg leading-relaxed max-h-40 overflow-hidden">
          {words.join(" ").slice(0, 400).split("").map((ch, i) => {
            const t = typed[i];
            const cls = t === undefined ? "text-ink/40" : t === ch ? "text-deep" : "text-red-500 bg-red-100 rounded";
            return (
              <span key={i} className={cls}>{ch}</span>
            );
          })}
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={(e) => onType(e.target.value)}
        disabled={status !== "running"}
        placeholder={status === "idle" ? "Pick a duration to start" : "Type here…"}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40"
      />

      {status === "running" && (
        <div className="flex gap-4 font-mono text-xs text-ink/50 justify-center">
          <span>chars: {typedCount}</span>
          <span>errors: {errors}</span>
          <span>acc: {typedCount ? Math.round(((typedCount - errors) / typedCount) * 100) : 100}%</span>
        </div>
      )}

      {status === "done" && res && (
        <div className="bg-deep rounded-xl px-6 py-6 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-paper/60">YOUR SPEED</span>
          <span className="font-display text-6xl font-bold text-accent">{res.wpm}</span>
          <span className="font-mono text-xs text-paper/70">WPM (words per minute)</span>
          <div className="flex gap-6 mt-2 font-mono text-xs text-paper/70">
            <span>CPM: {res.cpm}</span>
            <span>Accuracy: {res.accuracy}%</span>
            <span>Errors: {errors}</span>
          </div>
          <button type="button" onClick={() => start(duration)} className="mt-3 bg-accent text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">↻ TRY AGAIN</button>
        </div>
      )}
    </div>
  );
}
