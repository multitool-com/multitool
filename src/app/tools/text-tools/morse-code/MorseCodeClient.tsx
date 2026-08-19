"use client";

import { useEffect, useState } from "react";

const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "'": ".----.",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "$": "...-..-", "@": ".--.-.", " ": "/",
};

const REVERSE: Record<string, string> = {};
Object.entries(MORSE).forEach(([k, v]) => { REVERSE[v] = k; });

const UNIT_MS = 90; // duration of one dot

/**
 * Bullet-proof sound engine.
 *
 * The ENTIRE morse message is pre-rendered into ONE finite audio buffer
 * (sample by sample) and played with a single AudioBufferSourceNode.
 * The sound ends when the buffer ends — a continuous tone is impossible
 * by construction. STOP and MUTE close the whole AudioContext (hard stop).
 * Every step is wrapped in try/catch so the UI can never get stuck.
 */
export class MorseSound {
  private ctx: AudioContext | null = null;
  private src: AudioBufferSourceNode | null = null;
  enabled = true;

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      try {
        this.ctx = new AC();
      } catch {
        this.ctx = null;
        return null;
      }
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** Hard stop: destroys every node, buffer and pending sound. */
  private hardStop() {
    if (this.src) {
      const old = this.src;
      this.src = null; // clear FIRST so the old node's "ended" is ignored
      try {
        old.stop();
      } catch {
        // already ended: ignore
      }
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // already closed: ignore
      }
      this.ctx = null;
    }
  }

  /**
   * Render the whole morse message into one finite buffer and play it.
   * Returns true if playback started. Never throws.
   */
  async play(morse: string, onEnded?: () => void): Promise<boolean> {
    if (!this.enabled) return false;
    this.hardStop(); // kill anything from a previous play FIRST...
    const ctx = this.ensure(); // ...then grab a fresh context
    if (!ctx) return false;
    if (ctx.state !== "running") {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    try {
      const sampleRate = ctx.sampleRate;
      const freq = 700;

      // --- Build the on/off timeline (classic timings) ---
      // dot = 1 unit, dash = 3 units, gap between symbols = 1 unit,
      // gap between letters = 3 units, gap between words = 7 units.
      const events: { on: boolean; ms: number }[] = [];
      let totalMs = 0;
      const chars = morse.split("");
      const add = (on: boolean, ms: number) => {
        events.push({ on, ms });
        totalMs += ms;
      };
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const signalAhead = chars.slice(i + 1).some(
          (c) => c === "." || c === "-"
        );
        if (ch === ".") {
          add(true, UNIT_MS);
          if (signalAhead) add(false, UNIT_MS);
        } else if (ch === "-") {
          add(true, UNIT_MS * 3);
          if (signalAhead) add(false, UNIT_MS);
        } else if (ch === " " && signalAhead) {
          add(false, UNIT_MS * 2); // letter gap (1 symbol gap already added)
        } else if (ch === "/" && signalAhead) {
          add(false, UNIT_MS * 6); // word gap (1 symbol gap already added)
        }
      }
      if (events.length === 0) return false;

      // --- Pre-render the samples into a single finite buffer ---
      const totalSamples = Math.max(1, Math.ceil((totalMs / 1000) * sampleRate));
      const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
      const data = buffer.getChannelData(0);
      const attack = Math.max(1, Math.round(0.004 * sampleRate));
      const release = Math.max(1, Math.round(0.012 * sampleRate));
      const twoPiF = 2 * Math.PI * freq;
      let idx = 0;
      for (const ev of events) {
        const n = Math.round((ev.ms / 1000) * sampleRate);
        for (let j = 0; j < n && idx < totalSamples; j++, idx++) {
          if (!ev.on) {
            data[idx] = 0;
            continue;
          }
          // fade in/out to avoid clicks
          const env = Math.min(1, j / attack, (n - 1 - j) / release);
          data[idx] = Math.sin(twoPiF * (j / sampleRate)) * 0.14 * Math.max(0, env);
        }
      }

      // --- Play the buffer once ---
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.addEventListener("ended", () => {
        if (this.src === src) onEnded?.();
      });
      this.src = src;
      src.start();
      return true;
    } catch {
      return false; // never leave the UI stuck on a broken engine
    }
  }

  stop() {
    this.hardStop();
  }
}

const sound = new MorseSound();

export default function MorseCodeClient() {
  const [text, setText] = useState("");
  const [morse, setMorse] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Kill any residual audio when the component unmounts
  // (navigation, reload, Fast Refresh during development).
  useEffect(() => {
    return () => {
      sound.stop();
    };
  }, []);

  const textToMorse = (s: string) =>
    s
      .toLowerCase()
      .split("")
      .map((c) => MORSE[c] ?? "")
      .filter(Boolean)
      .join(" ");

  const morseToText = (s: string) =>
    s
      .split(/\s+/)
      .map((code) => REVERSE[code] ?? "")
      .join("");

  const onTextChange = (v: string) => {
    setText(v);
    setMorse(textToMorse(v));
  };

  const onMorseChange = (v: string) => {
    setMorse(v);
    setText(morseToText(v));
  };

  const play = async () => {
    if (!morse || playing) return;
    if (!sound.enabled) {
      // Pressing play with the mute on is a clear intent to hear: unmute.
      sound.enabled = true;
      setSoundOn(true);
    }
    setPlaying(true);
    try {
      const started = await sound.play(morse, () => setPlaying(false));
      if (!started) setPlaying(false);
    } catch {
      setPlaying(false); // the button must NEVER stay stuck
    }
  };

  const stop = () => {
    sound.stop();
    setPlaying(false);
  };

  const toggleSound = () => {
    setSoundOn((p) => {
      const next = !p;
      sound.enabled = next;
      if (!next) sound.stop(); // mute kills any sound immediately
      return next;
    });
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="morse-text" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          TEXT
        </label>
        <textarea
          id="morse-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={3}
          placeholder="Hello world"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>
      <div>
        <label htmlFor="morse-code" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          MORSE CODE
        </label>
        <textarea
          id="morse-code"
          value={morse}
          onChange={(e) => onMorseChange(e.target.value)}
          rows={3}
          placeholder=".... . .-.. .-.. ---"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={play}
          disabled={!morse || playing}
          className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent disabled:opacity-40"
        >
          {playing ? "PLAYING…" : "▶ PLAY SOUND"}
        </button>
        {playing && (
          <button
            type="button"
            onClick={stop}
            className="font-mono text-xs tracking-widest px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-accent"
          >
            ■ STOP
          </button>
        )}
        <button
          type="button"
          onClick={toggleSound}
          className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
            soundOn ? "bg-accent/10 border border-accent/30 text-accent" : "bg-paper text-ink/60 border border-ink/15"
          }`}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Morse alphabet:</strong> A .- · B -...
        · C -.-. · D -.. · E . · F ..-. · G --. · H .... · I .. · J .--- ·
        K -.- · L .-.. · M -- · N -. · O --- · P .--. · Q --.- · R .-. ·
        S ... · T - · U ..- · V ...- · W .-- · X -..- · Y -.-- · Z --..
      </div>
    </div>
  );
}
