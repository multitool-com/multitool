"use client";

import { useEffect, useRef, useState } from "react";

type VoiceInfo = { name: string; lang: string; default: boolean };

export default function TextToSpeechClient() {
  const [text, setText] = useState(
    "Hello! This text is being read aloud by your browser. Type anything and press speak."
  );
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const keepAlive = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadVoices = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const list = window.speechSynthesis
      .getVoices()
      .map((v) => ({ name: v.name, lang: v.lang, default: v.default }));
    if (list.length) setVoices(list);
  };

  useEffect(() => {
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (keepAlive.current) clearInterval(keepAlive.current);
    };
  }, []);

  // Chrome stops long utterances after ~15s; keep it alive with a soft resume.
  const startKeepAlive = () => {
    if (keepAlive.current) clearInterval(keepAlive.current);
    keepAlive.current = setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  const stopKeepAlive = () => {
    if (keepAlive.current) {
      clearInterval(keepAlive.current);
      keepAlive.current = null;
    }
  };

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const all = window.speechSynthesis.getVoices();
    const chosen = all[voiceIdx] ?? all.find((v) => v.lang.startsWith("en")) ?? null;
    if (chosen) u.voice = chosen;
    u.rate = rate;
    u.pitch = pitch;
    u.onstart = () => {
      setSpeaking(true);
      setPaused(false);
      startKeepAlive();
    };
    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
      stopKeepAlive();
    };
    u.onerror = () => {
      setSpeaking(false);
      setPaused(false);
      stopKeepAlive();
    };
    window.speechSynthesis.speak(u);
  };

  const togglePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    stopKeepAlive();
  };

  if (!supported) {
    return (
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm">
        <p className="text-sm text-ink/70">
          Your browser does not support the Web Speech API. Try the latest version of
          Chrome, Edge, Safari or Firefox.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="tts-text" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          TEXT
        </label>
        <textarea
          id="tts-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Type or paste anything…"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="tts-voice" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            VOICE ({voices.length})
          </label>
          <select
            id="tts-voice"
            value={voiceIdx}
            onChange={(e) => setVoiceIdx(parseInt(e.target.value, 10))}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
          >
            {voices.length === 0 && <option value={0}>Loading voices…</option>}
            {voices.map((v, i) => (
              <option key={`${v.name}-${i}`} value={i}>
                {v.name} ({v.lang}){v.default ? " ★" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tts-rate" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            SPEED: {rate.toFixed(1)}×
          </label>
          <input
            id="tts-rate"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-accent mt-3"
          />
        </div>
        <div>
          <label htmlFor="tts-pitch" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            PITCH: {pitch.toFixed(1)}
          </label>
          <input
            id="tts-pitch"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-accent mt-3"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={speak}
          disabled={speaking && !paused}
          className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"
        >
          {speaking && !paused ? "🔊 SPEAKING…" : "▶ SPEAK"}
        </button>
        {speaking && (
          <>
            <button
              type="button"
              onClick={togglePause}
              className="font-mono text-xs tracking-widest px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-accent"
            >
              {paused ? "▶ RESUME" : "⏸ PAUSE"}
            </button>
            <button
              type="button"
              onClick={stop}
              className="font-mono text-xs tracking-widest px-4 py-3 rounded-lg bg-paper border border-ink/15 text-ink/70 hover:border-accent hover:text-accent transition-colors"
            >
              ■ STOP
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-ink/50">
        Speech is generated locally by your device — nothing is uploaded. Voices depend on
        your operating system and browser.
      </p>
    </div>
  );
}
