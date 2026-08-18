"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Curated list of common 5-letter words.
const WORDS = [
  "ABOUT", "ABOVE", "ACTOR", "ADMIN", "AGAIN", "AGENT", "ALERT", "ALIEN", "ALIVE", "ALLOW",
  "ALONE", "ALONG", "ALPHA", "ANGEL", "ANGER", "ANGLE", "APART", "APPLE", "APPLY", "ARENA",
  "ARISE", "ARMOR", "ARRAY", "ARROW", "ASIDE", "ASSET", "ATLAS", "AUDIO", "AUDIT", "AVOID",
  "AWARD", "AWARE", "BADGE", "BAKER", "BASIC", "BEACH", "BEARD", "BEAST", "BEGIN", "BEING",
  "BELOW", "BENCH", "BIRTH", "BLACK", "BLADE", "BLAME", "BLANK", "BLAST", "BLAZE", "BLEND",
  "BLESS", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND",
  "BRAVE", "BREAD", "BREAK", "BREED", "BRICK", "BRIDE", "BRIEF", "BRING", "BROAD", "BROOK",
  "BUILD", "BUILT", "BUNCH", "BURST", "CABIN", "CABLE", "CANDY", "CARGO", "CARRY", "CATCH",
  "CAUSE", "CHAIN", "CHAIR", "CHALK", "CHAMP", "CHART", "CHASE", "CHEAP", "CHECK", "CHESS",
  "CHEST", "CHIEF", "CHILD", "CHILL", "CHIPS", "CHORD", "CIVIC", "CIVIL", "CLAIM", "CLASS",
  "CLEAN", "CLEAR", "CLICK", "CLIMB", "CLOCK", "CLOSE", "CLOUD", "CLOWN", "COACH", "COAST",
  "COLOR", "COMET", "COMIC", "CORAL", "COUCH", "COULD", "COUNT", "COURT", "COVER", "CRACK",
  "CRAFT", "CRANE", "CRASH", "CRAZY", "CREAM", "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE",
  "CRUSH", "CURVE", "CYCLE", "DAILY", "DAIRY", "DANCE", "DEALT", "DEATH", "DEBUT", "DELAY",
  "DELTA", "DENSE", "DEPTH", "DERBY", "DIGIT", "DINER", "DIRTY", "DODGE", "DOZEN", "DRAFT",
  "DRAIN", "DRAMA", "DRANK", "DREAM", "DRESS", "DRILL", "DRINK", "DRIVE", "DROVE", "DYING",
  "EAGER", "EAGLE", "EARLY", "EARTH", "EIGHT", "ELBOW", "ELDER", "ELECT", "EMPTY", "ENEMY",
  "ENJOY", "ENTRY", "EQUAL", "ERROR", "ESSAY", "EVENT", "EVERY", "EXACT", "EXAMS",
  "EXCEL", "EXIST", "EXTRA", "FABLE", "FACTS", "FAIRY", "FAITH", "FALSE", "FANCY", "FATAL",
  "FAULT", "FAVOR", "FEAST", "FENCE", "FERRY", "FIBER", "FIELD", "FIERY", "FIFTH", "FIFTY",
  "FIGHT", "FINAL", "FIRST", "FLAKE", "FLAME", "FLASH", "FLASK", "FLEET", "FLESH", "FLICK",
  "FLING", "FLINT", "FLOAT", "FLOCK", "FLOOD", "FLOOR", "FLOUR", "FLUID", "FLUSH", "FOCUS",
  "FORCE", "FORGE", "FORTY", "FORUM", "FOUND", "FRAME", "FRESH", "FRONT", "FROST", "FRUIT",
  "FULLY", "FUNNY", "GAMER", "GAMES", "GHOST", "GIANT", "GIVEN", "GLASS", "GLAZE", "GLOBE",
  "GLORY", "GLOVE", "GOING", "GRADE", "GRAIN", "GRAND", "GRANT", "GRAPE", "GRAPH", "GRASP",
  "GRASS", "GRAVE", "GREAT", "GREED", "GREEN", "GREET", "GRIEF", "GRILL", "GRIND", "GROSS",
  "GROUP", "GROVE", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "GUILD", "HABIT", "HAPPY",
  "HARDY", "HARSH", "HASTE", "HAUNT", "HAVOC", "HEART", "HEAVY", "HEDGE", "HELLO", "HENCE",
  "HINGE", "HONEY", "HORSE", "HOTEL", "HOUSE", "HUMAN", "HUMOR", "HURRY", "IDEAL", "IMAGE",
  "IMPLY", "INDEX", "INNER", "INPUT", "IRONY", "IVORY", "JELLY", "JEWEL", "JOINT", "JOKER",
  "JUDGE", "JUICE", "JUMBO", "KAYAK", "KNIFE", "KNOCK", "KNOWN", "LABEL", "LABOR", "LARGE",
  "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEAST", "LEAVE", "LEMON", "LEVEL", "LIGHT",
  "LIMIT", "LIVER", "LOCAL", "LODGE", "LOGIC", "LOOPY", "LOOSE", "LORRY", "LOVED", "LOWER",
  "LOYAL", "LUCKY", "LUNAR", "LUNCH", "MAGIC", "MAJOR", "MAKER", "MANGO", "MANOR", "MAPLE",
  "MARCH", "MARRY", "MARSH", "MAYBE", "MAYOR", "MEDAL", "MEDIA", "MEDIC", "MELON", "MERCY",
  "MERGE", "MERIT", "METAL", "METRO", "MICRO", "MIDST", "MIGHT", "MINER", "MINOR", "MINUS",
  "MIXED", "MODEL", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE",
  "MUSIC", "NAIVE", "NAKED", "NEEDS", "NEVER", "NEWLY", "NIGHT", "NINJA", "NOBLE", "NOISE",
  "NORTH", "NOTED", "NOVEL", "NURSE", "NYLON", "OASIS", "OCEAN", "OFFER", "OFTEN", "OLIVE",
  "ONION", "OPERA", "ORBIT", "ORDER", "ORGAN", "OTHER", "OUGHT", "OUTER", "OWNER", "PAINT",
  "PANEL", "PANIC", "PAPER", "PARTY", "PASTA", "PATCH", "PATIO", "PAUSE", "PEACE", "PEACH",
  "PEARL", "PENNY", "PHASE", "PHONE", "PHOTO", "PIANO", "PIECE", "PILOT", "PINCH", "PITCH",
  "PIXEL", "PIZZA", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "PLAZA", "PLEAD", "PLUCK",
  "PLUMB", "POINT", "POLAR", "POLLY", "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME",
  "PRINT", "PRIOR", "PRIZE", "PROBE", "PROOF", "PROUD", "PROVE", "PULSE", "PUNCH", "PUPIL",
  "PUPPY", "PURSE", "QUEEN", "QUEST", "QUEUE", "QUICK", "QUIET", "QUILT", "QUITE", "QUOTA",
  "RADIO", "RAINY", "RAISE", "RALLY", "RANGE", "RAPID", "RATIO", "REACH", "REACT", "READY",
  "REALM", "REBEL", "REFER", "RELAX", "REPLY", "RIDER", "RIDGE", "RIFLE", "RIGHT", "RIGID",
  "RIVER", "ROBIN", "ROBOT", "ROCKY", "ROGER", "ROMAN", "ROUTE", "ROYAL", "RULER", "RURAL",
  "RUSTY", "SAINT", "SALAD", "SALES", "SANDY", "SAUCE", "SCALE", "SCENE", "SCOPE", "SCORE",
  "SCREW", "SENSE", "SERVE", "SEVEN", "SHADE", "SHAPE", "SHARE", "SHARK", "SHARP", "SHEEP",
  "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK", "SHOOT", "SHORE", "SHORT",
  "SHOUT", "SHOWN", "SIGHT", "SILKY", "SILLY", "SINCE", "SIXTH", "SIXTY", "SKILL", "SKIRT",
  "SLATE", "SLEEP", "SLEET", "SLICE", "SLIDE", "SLOPE", "SMALL", "SMART", "SMILE", "SMOKE",
  "SNAKE", "SOLID", "SOLVE", "SONIC", "SOUND", "SOUTH", "SPACE", "SPARE", "SPARK", "SPEAK",
  "SPEED", "SPELL", "SPEND", "SPICE", "SPINE", "SPLIT", "SPOKE", "SPORT", "SPRAY", "SQUAD",
  "STAFF", "STAGE", "STAIR", "STAKE", "STAND", "STARE", "START", "STATE", "STEAK", "STEAM",
  "STEEL", "STEEP", "STEER", "STICK", "STILL", "STOCK", "STONE", "STORE", "STORM", "STORY",
  "STOVE", "STRAW", "STRIP", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE", "SUNNY", "SUPER",
  "SURGE", "SUSHI", "SWAMP", "SWEET", "SWIFT", "SWING", "SWORD", "SYRUP", "TABLE", "TAKEN",
  "TASTE", "TAXES", "TEACH", "TEETH", "TEMPO", "TENSE", "TENTH", "THEIR", "THEME",
  "THERE", "THESE", "THICK", "THING", "THINK", "THIRD", "THOSE", "THREE", "THROW", "THUMB",
  "TIDAL", "TIGER", "TIGHT", "TIMER", "TITLE", "TOAST", "TODAY", "TOKEN", "TOOTH", "TOPIC",
  "TORCH", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TOXIC", "TRACE", "TRACK", "TRADE", "TRAIL",
  "TRAIN", "TRASH", "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRUCK", "TRULY",
  "TRUMP", "TRUNK", "TRUST", "TRUTH", "TULIP", "TUMOR", "TUNER", "TURBO", "TUTOR", "TWICE",
  "TWIST", "TYPED", "ULTRA", "UNCLE", "UNDER", "UNION", "UNITE", "UNITY", "UPPER", "UPSET",
  "URBAN", "USAGE", "USUAL", "UTTER", "VAGUE", "VALID", "VALUE", "VALVE", "VAPOR", "VAULT",
  "VENUE", "VERSE", "VIDEO", "VIGOR", "VILLA", "VINYL", "VIOLA", "VIRUS", "VISIT", "VISOR",
  "VISTA", "VITAL", "VIVID", "VOCAL", "VOICE", "VOTED", "VOTER", "WAGON", "WASTE", "WATCH",
  "WATER", "WEAVE", "WEDGE", "WEIRD", "WHALE", "WHEAT", "WHEEL", "WHERE", "WHICH", "WHILE",
  "WHITE", "WHOLE", "WHOSE", "WIDER", "WIDOW", "WIDTH", "WINDY", "WITCH", "WOMAN", "WOODS",
  "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WRIST", "WRITE", "WRONG",
  "WROTE", "YACHT", "YEARS", "YOUNG", "YOURS", "YOUTH", "ZEBRA", "ZESTY",
  ];

type Status = "correct" | "present" | "absent";

const KEY_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACK"],
];

// ---- Sound engine ----
class Sound {
  private ctx: AudioContext | null = null;
  enabled = true;
  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  private tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.1, delay = 0) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }
  key() { this.tone(220, 0.04, "triangle", 0.04); }
  correct() { this.tone(520, 0.12, "triangle", 0.12); }
  present() { this.tone(390, 0.12, "triangle", 0.12); }
  absent() { this.tone(180, 0.12, "sine", 0.08); }
  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => this.tone(n, 0.16, "triangle", 0.12, i * 0.11));
  }
  lose() {
    this.tone(300, 0.4, "sawtooth", 0.12, 90);
  }
}
const sound = new Sound();

// ---- feedback algorithm (handles duplicate letters correctly) ----
function evaluate(guess: string, target: string): Status[] {
  const result: Status[] = Array(5).fill("absent");
  const counts: Record<string, number> = {};
  for (const ch of target) counts[ch] = (counts[ch] ?? 0) + 1;
  // greens first
  for (let i = 0; i < 5; i += 1) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      counts[guess[i]] -= 1;
    }
  }
  // yellows
  for (let i = 0; i < 5; i += 1) {
    if (result[i] === "correct") continue;
    if ((counts[guess[i]] ?? 0) > 0) {
      result[i] = "present";
      counts[guess[i]] -= 1;
    }
  }
  return result;
}

interface Guess {
  word: string;
  statuses: Status[];
}

export default function WordGuessClient() {
  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState<"win" | "lose" | null>(null);
  const [keyStatus, setKeyStatus] = useState<Record<string, Status>>({});
  const [stats, setStats] = useState({ played: 0, wins: 0, streak: 0, best: 0 });
  const [soundOn, setSoundOn] = useState(true);
  const [ready, setReady] = useState(false);
  const firstRender = useRef(true);

  // pick word (client-only, avoids SSR mismatch)
  const pickWord = useCallback(() => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTarget(w);
    setGuesses([]);
    setCurrent("");
    setDone(null);
    setKeyStatus({});
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("multitool-wg-stats");
      if (saved) setStats(JSON.parse(saved));
    } catch { /* ignore */ }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready && firstRender.current) {
      firstRender.current = false;
      pickWord();
    }
  }, [ready, pickWord]);

  const saveStats = (s: typeof stats) => {
    try {
      sessionStorage.setItem("multitool-wg-stats", JSON.stringify(s));
    } catch { /* ignore */ }
  };

  const submit = useCallback(() => {
    if (done) return;
    if (current.length !== 5) return;
    if (!WORDS.includes(current)) return; // must be a valid word
    const statuses = evaluate(current, target);
    const newGuesses = [...guesses, { word: current, statuses }];
    setGuesses(newGuesses);
    sound.key();

    // update keyboard colors (only upgrade: correct > present > absent)
    setKeyStatus((prev) => {
      const next = { ...prev };
      current.split("").forEach((ch, i) => {
        const rank = { absent: 0, present: 1, correct: 2 };
        if (rank[statuses[i]] > (rank[next[ch]] ?? -1)) next[ch] = statuses[i];
      });
      return next;
    });

    if (statuses.every((s) => s === "correct")) {
      setDone("win");
      sound.win();
      setStats((prev) => {
        const next = {
          played: prev.played + 1,
          wins: prev.wins + 1,
          streak: prev.streak + 1,
          best: Math.max(prev.best, prev.streak + 1),
        };
        saveStats(next);
        return next;
      });
      return;
    }
    if (newGuesses.length >= 6) {
      setDone("lose");
      sound.lose();
      setStats((prev) => {
        const next = { ...prev, played: prev.played + 1, streak: 0 };
        saveStats(next);
        return next;
      });
      return;
    }
    setCurrent("");
  }, [current, done, guesses, target]);

  const handleKey = useCallback(
    (key: string) => {
      if (done) return;
      if (key === "ENTER") { submit(); return; }
      if (key === "BACK") { setCurrent((c) => c.slice(0, -1)); return; }
      if (/^[A-Z]$/.test(key) && current.length < 5) {
        setCurrent((c) => c + key);
        sound.key();
      }
    },
    [current.length, done, submit]
  );

  // physical keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") { e.preventDefault(); handleKey("ENTER"); return; }
      if (e.key === "Backspace") { e.preventDefault(); handleKey("BACK"); return; }
      if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey]);

  const cellClass = (status: Status | undefined, filled: boolean) => {
    const base = "w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 flex items-center justify-center font-display text-2xl font-bold transition-all duration-300";
    if (status === "correct") return `${base} bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/40`;
    if (status === "present") return `${base} bg-yellow-500 border-yellow-400 text-white shadow-lg shadow-yellow-500/40`;
    if (status === "absent") return `${base} bg-white/10 border-white/15 text-paper/50`;
    if (filled) return `${base} bg-white/15 border-accent/60 text-paper shadow-lg shadow-accent/20`;
    return `${base} bg-white/5 border-white/15 text-paper/30`;
  };

  const keyClass = (k: string) => {
    const st = keyStatus[k];
    const base = "font-mono text-xs sm:text-sm font-semibold rounded-lg px-2 py-3 transition-colors";
    if (st === "correct") return `${base} bg-green-600 text-white shadow shadow-green-500/40`;
    if (st === "present") return `${base} bg-yellow-500 text-white shadow shadow-yellow-500/40`;
    if (st === "absent") return `${base} bg-white/10 text-paper/40`;
    return `${base} bg-white/10 text-paper hover:bg-white/20`;
  };

  return (
    <div className="bg-deep rounded-xl p-6 flex flex-col gap-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <StatBlock label="PLAYED" value={String(stats.played)} highlight />
          <StatBlock label="WINS" value={String(stats.wins)} />
          <StatBlock label="STREAK" value={String(stats.streak)} />
          <StatBlock label="BEST" value={String(stats.best)} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setSoundOn((p) => { sound.enabled = !p; return !p; }); }}
            className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
              soundOn ? "bg-accent/20 border border-accent/40 text-accent" : "bg-white/5 text-paper/60 border border-white/15"
            }`}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            type="button"
            onClick={pickWord}
            className="font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-accent text-paper hover:opacity-90 transition-colors"
          >
            NEW WORD
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-2 mx-auto">
        {Array.from({ length: 6 }, (_, row) => {
          const guess = guesses[row];
          return (
            <div key={row} className="flex gap-2">
              {Array.from({ length: 5 }, (_, col) => {
                if (guess) {
                  return (
                    <div key={col} className={cellClass(guess.statuses[col], true)}>
                      {guess.word[col]}
                    </div>
                  );
                }
                if (row === guesses.length) {
                  return (
                    <div key={col} className={cellClass(undefined, col < current.length)}>
                      {current[col] ?? ""}
                    </div>
                  );
                }
                return <div key={col} className={cellClass(undefined, false)} />;
              })}
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 mx-auto w-full max-w-[460px]">
        {KEY_ROWS.map((row, i) => (
          <div key={i} className="flex gap-1.5 justify-center">
            {row.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handleKey(k)}
                className={`${keyClass(k)} ${k.length > 1 ? "px-3" : "flex-1 max-w-[44px]"}`}
              >
                {k === "BACK" ? "⌫" : k}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Result */}
      {done && (
        <div className={`border rounded-lg px-4 py-3 text-center ${done === "win" ? "bg-green-600/20 border-green-500/40" : "bg-accent/10 border-accent/30"}`}>
          <p className="font-display font-bold text-paper">
            {done === "win" ? `🎉 YOU GOT IT — ${target}!` : `😢 The word was ${target}`}
          </p>
          <button
            type="button"
            onClick={pickWord}
            className="mt-2 font-mono text-xs tracking-widest px-4 py-2 rounded-full bg-deep text-paper hover:bg-accent transition-colors"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-paper/70">
        <strong className="text-paper">How to play:</strong> guess the
        5-letter word in 6 tries. 🟩 right place · 🟨 wrong place · ⬜ not
        in the word. Type with your keyboard or tap the keys.
      </div>
    </div>
  );
}

function StatBlock({
  label, value, highlight = false,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-lg px-3 py-3 ${highlight ? "bg-accent/10 border-accent/30" : "bg-white/5 border-white/10"}`}>
      <span className={`font-mono text-[10px] tracking-widest block mb-1 ${highlight ? "text-accent" : "text-paper/50"}`}>{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? "text-accent" : "text-paper"}`}>{value}</span>
    </div>
  );
}
