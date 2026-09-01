"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DIFFICULTIES,
  findConflicts,
  generatePuzzle,
  isSolved,
  peersOf,
  type Difficulty,
  type Grid,
} from "@/lib/sudoku";
import { track, trackToolUsed } from "@/lib/analytics";

const STORAGE_KEY = "mt-sudoku-v1";
const EMPTY: Grid = new Array(81).fill(0);

interface Sound {
  ctx: AudioContext | null;
  enabled: boolean;
}
class SoundImpl {
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
  private tone(
    freq: number,
    dur: number,
    type: OscillatorType = "sine",
    vol = 0.08,
    delay = 0
  ) {
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
  place() { this.tone(640, 0.07, "sine", 0.09); this.tone(880, 0.05, "sine", 0.05, 0.05); }
  erase() { this.tone(300, 0.06, "sine", 0.06); }
  error() { this.tone(170, 0.16, "sawtooth", 0.07); }
  note() { this.tone(460, 0.04, "sine", 0.05); }
  hint() { this.tone(740, 0.08, "sine", 0.08); this.tone(1108, 0.1, "sine", 0.07, 0.09); }
  select() { this.tone(520, 0.025, "sine", 0.03); }
  win() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      this.tone(f, 0.16, "sine", 0.09, i * 0.11)
    );
  }
}

interface SavedState {
  difficulty: Difficulty;
  puzzle: Grid;
  solution: Grid;
  board: Grid;
  notes: number[];
  fixed: boolean[];
  seconds: number;
  mistakes: number;
  hints: number;
  won: boolean;
  soundOn: boolean;
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function SudokuClient() {
  const [loaded, setLoaded] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [puzzle, setPuzzle] = useState<Grid>(EMPTY);
  const [solution, setSolution] = useState<Grid>(EMPTY);
  const [board, setBoard] = useState<Grid>(EMPTY);
  const [notes, setNotes] = useState<number[]>(new Array(81).fill(0));
  const [fixed, setFixed] = useState<boolean[]>(new Array(81).fill(false));
  const [selected, setSelected] = useState<number | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(3);
  const [history, setHistory] = useState<{ board: Grid; notes: number[] }[]>([]);
  const [won, setWon] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const soundRef = useRef<SoundImpl | null>(null);
  const firedRef = useRef(false);

  const sound = useCallback(() => {
    if (!soundRef.current) soundRef.current = new SoundImpl();
    return soundRef.current;
  }, []);

  // ---------- carregar sessão ou gerar puzzle (client-only) ----------
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as SavedState;
        if (
          Array.isArray(s.board) && s.board.length === 81 &&
          Array.isArray(s.solution) && s.solution.length === 81 &&
          Array.isArray(s.puzzle) && s.puzzle.length === 81
        ) {
          setDifficulty(s.difficulty);
          setPuzzle(s.puzzle);
          setSolution(s.solution);
          setBoard(s.board);
          setNotes(s.notes ?? new Array(81).fill(0));
          setFixed(s.fixed ?? s.puzzle.map((v) => v !== 0));
          setSeconds(s.seconds ?? 0);
          setMistakes(s.mistakes ?? 0);
          setHints(s.hints ?? 3);
          setWon(!!s.won);
          setSoundOn(s.soundOn !== false);
          if (soundRef.current) soundRef.current.enabled = s.soundOn !== false;
          setLoaded(true);
          return;
        }
      }
    } catch { /* sessão inválida -> novo jogo */ }
    newGame("easy");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- persistir ----------
  useEffect(() => {
    if (!loaded) return;
    try {
      const s: SavedState = {
        difficulty, puzzle, solution, board, notes, fixed,
        seconds, mistakes, hints, won, soundOn,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch { /* quota — ignora */ }
  }, [loaded, difficulty, puzzle, solution, board, notes, fixed, seconds, mistakes, hints, won, soundOn]);

  // ---------- timer (pausa com aba oculta) ----------
  useEffect(() => {
    if (!loaded || won) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [loaded, won]);

  // ---------- novo jogo ----------
  const newGame = (diff: Difficulty) => {
    const { puzzle: p, solution: sol } = generatePuzzle(diff, Math.random);
    setDifficulty(diff);
    setPuzzle(p);
    setSolution(sol);
    setBoard([...p]);
    setNotes(new Array(81).fill(0));
    setFixed(p.map((v) => v !== 0));
    setSelected(null);
    setNoteMode(false);
    setSeconds(0);
    setMistakes(0);
    setHints(3);
    setHistory([]);
    setWon(false);
    setLoaded(true);
    sound().hint();
  };

  const markUsed = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    trackToolUsed("sudoku", "games");
  }, []);

  const pushHistory = useCallback((b: Grid, n: number[]) => {
    setHistory((h) => [...h.slice(-199), { board: [...b], notes: [...n] }]);
  }, []);

  const checkWin = useCallback(
    (b: Grid) => {
      if (isSolved(b, solution)) {
        setWon(true);
        sound().win();
        track("game_won", "sudoku", "games", { difficulty });
      }
    },
    [solution, difficulty, sound]
  );

  // ---------- entrada ----------
  const inputDigit = useCallback(
    (d: number) => {
      if (won || selected === null || fixed[selected]) return;
      const i = selected;
      markUsed();
      if (noteMode) {
        if (board[i] !== 0) return;
        pushHistory(board, notes);
        setNotes((ns) => {
          const next = [...ns];
          next[i] = next[i] ^ (1 << d);
          return next;
        });
        sound().note();
        return;
      }
      if (board[i] === d) {
        pushHistory(board, notes);
        setBoard((b) => {
          const nb = [...b];
          nb[i] = 0;
          return nb;
        });
        sound().erase();
        return;
      }
      pushHistory(board, notes);
      const correct = d === solution[i];
      setBoard((b) => {
        const nb = [...b];
        nb[i] = d;
        if (correct) {
          setNotes((ns) => {
            const nn = [...ns];
            nn[i] = 0;
            for (const p of peersOf(i)) if (nn[p] & (1 << d)) nn[p] &= ~(1 << d);
            return nn;
          });
        }
        return nb;
      });
      if (correct) {
        sound().place();
        setBoard((b) => {
          if (isSolved(b, solution)) {
            setWon(true);
            sound().win();
            track("game_won", "sudoku", "games", { difficulty });
          }
          return b;
        });
      } else {
        setMistakes((m) => m + 1);
        sound().error();
      }
    },
    [won, selected, fixed, noteMode, board, notes, solution, difficulty, markUsed, pushHistory, sound]
  );

  const erase = useCallback(() => {
    if (won || selected === null || fixed[selected]) return;
    if (board[selected] === 0 && notes[selected] === 0) return;
    markUsed();
    pushHistory(board, notes);
    setBoard((b) => {
      const nb = [...b];
      nb[selected] = 0;
      return nb;
    });
    setNotes((ns) => {
      const nn = [...ns];
      nn[selected] = 0;
      return nn;
    });
    sound().erase();
  }, [won, selected, fixed, board, notes, markUsed, pushHistory, sound]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setBoard(last.board);
      setNotes(last.notes);
      return h.slice(0, -1);
    });
    sound().select();
  }, [sound]);

  const hint = useCallback(() => {
    if (won || hints <= 0) return;
    const candidates: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (!fixed[i] && board[i] !== solution[i]) candidates.push(i);
    }
    if (candidates.length === 0) return;
    markUsed();
    const target =
      selected !== null && candidates.includes(selected)
        ? selected
        : candidates[Math.floor(Math.random() * candidates.length)];
    pushHistory(board, notes);
    const d = solution[target];
    setBoard((b) => {
      const nb = [...b];
      nb[target] = d;
      setNotes((ns) => {
        const nn = [...ns];
        nn[target] = 0;
        for (const p of peersOf(target)) if (nn[p] & (1 << d)) nn[p] &= ~(1 << d);
        return nn;
      });
      if (isSolved(nb, solution)) {
        setWon(true);
        sound().win();
        track("game_won", "sudoku", "games", { difficulty });
      }
      return nb;
    });
    setFixed((f) => {
      const nf = [...f];
      nf[target] = true;
      return nf;
    });
    setHints((h) => h - 1);
    sound().hint();
  }, [won, hints, fixed, board, notes, solution, selected, difficulty, markUsed, pushHistory, sound]);

  // ---------- teclado ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!loaded) return;
      const k = e.key;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Backspace"].includes(k)) {
        e.preventDefault();
      }
      const move = (di: number, dj: number) => {
        setSelected((cur) => {
          if (cur === null) return 40;
          const r = Math.min(8, Math.max(0, Math.floor(cur / 9) + di));
          const c = Math.min(8, Math.max(0, (cur % 9) + dj));
          return r * 9 + c;
        });
      };
      switch (k) {
        case "ArrowUp": case "w": case "W": move(-1, 0); break;
        case "ArrowDown": case "s": case "S": move(1, 0); break;
        case "ArrowLeft": case "a": case "A": move(0, -1); break;
        case "ArrowRight": case "d": case "D": move(0, 1); break;
        case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
          inputDigit(Number(k));
          break;
        case "0": case "Backspace": case "Delete": erase(); break;
        case "n": case "N": setNoteMode((v) => !v); break;
        case "h": case "H": hint(); break;
        case "u": case "U": undo(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loaded, inputDigit, erase, hint, undo]);

  // ---------- render helpers ----------
  const conflicts = findConflicts(board);
  const selVal = selected !== null ? board[selected] : 0;
  const peerSet = new Set<number>();
  if (selected !== null) {
    const r = Math.floor(selected / 9);
    const c = selected % 9;
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let k = 0; k < 9; k++) {
      peerSet.add(r * 9 + k);
      peerSet.add(k * 9 + c);
      peerSet.add((br + Math.floor(k / 3)) * 9 + bc + (k % 3));
    }
  }
  const counts: Record<number, number> = {};
  for (const v of board) if (v) counts[v] = (counts[v] ?? 0) + 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-deep rounded-xl p-4 sm:p-6 relative">
        {/* barra superior: dificuldade + status */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 flex-wrap">
            {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => newGame(d)}
                className={`font-mono text-[10px] sm:text-xs tracking-widest rounded-full px-3 py-1.5 transition-colors ${
                  difficulty === d && !won
                    ? "bg-accent text-paper"
                    : "bg-white/5 text-paper/60 border border-white/15 hover:border-accent hover:text-accent"
                }`}
              >
                {DIFFICULTIES[d].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-paper/70">
            <span title="Time">⏱ {fmtTime(seconds)}</span>
            {mistakes > 0 && (
              <span title="Mistakes" className="text-red-400">✗ {mistakes}</span>
            )}
            <button
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                if (soundRef.current) soundRef.current.enabled = next;
                sound().select();
              }}
              className="text-paper/70 hover:text-accent transition-colors"
              aria-label={soundOn ? "Mute sounds" : "Unmute sounds"}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => newGame(difficulty)}
              className="bg-white/5 border border-white/15 hover:border-accent hover:text-accent rounded-full px-3 py-1 transition-colors"
            >
              NEW
            </button>
          </div>
        </div>

        {/* grade */}
        <div className="mx-auto w-full max-w-md aspect-square grid grid-cols-9 grid-rows-9 rounded-lg overflow-hidden border-2 border-white/25">
          {!loaded
            ? Array.from({ length: 81 }).map((_, i) => (
                <div key={i} className="bg-white/[0.03] animate-pulse border border-white/5" />
              ))
            : Array.from({ length: 81 }).map((_, i) => {
                const r = Math.floor(i / 9);
                const c = i % 9;
                const isFixed = fixed[i];
                const v = board[i];
                const conflict = v !== 0 && conflicts[i];
                const same = selVal !== 0 && v === selVal;
                const isSel = selected === i;
                const isPeer = peerSet.has(i);
                let bg = "bg-transparent";
                if (!isFixed && !v) bg = "bg-white/[0.02]";
                if (isPeer) bg = "bg-white/[0.07]";
                if (same) bg = "bg-accent/15";
                if (isSel) bg = "bg-accent/30";
                if (conflict) bg = "bg-red-500/20";
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelected(i);
                      if (!fixed[i]) markUsed();
                      sound().select();
                    }}
                    className={`relative flex items-center justify-center font-mono transition-colors ${bg}
                      ${c < 8 ? (c % 3 === 2 ? "border-r-2 border-r-white/25" : "border-r border-r-white/10") : ""}
                      ${r < 8 ? (r % 3 === 2 ? "border-b-2 border-b-white/25" : "border-b border-b-white/10") : ""}`}
                  >
                    {v !== 0 ? (
                      <span
                        className={`text-base sm:text-2xl ${
                          conflict
                            ? "text-red-400"
                            : isFixed
                              ? "text-paper font-semibold"
                              : "text-accent"
                        }`}
                      >
                        {v}
                      </span>
                    ) : notes[i] !== 0 ? (
                      <span className="grid grid-cols-3 grid-rows-3 w-full h-full p-[6%] text-paper/45 leading-none">
                        {Array.from({ length: 9 }).map((__, d) => (
                          <span key={d} className="flex items-center justify-center text-[7px] sm:text-[10px]">
                            {notes[i] & (1 << (d + 1)) ? d + 1 : ""}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </button>
                );
              })}
        </div>

        {/* controles */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setNoteMode((v) => !v)}
              className={`font-mono text-[10px] sm:text-xs tracking-widest rounded-lg px-3 py-2 transition-colors ${
                noteMode
                  ? "bg-accent text-paper"
                  : "bg-white/5 text-paper/70 border border-white/15 hover:border-accent hover:text-accent"
              }`}
            >
              ✏ NOTES {noteMode ? "ON" : "OFF"}
            </button>
            <button
              onClick={undo}
              className="font-mono text-[10px] sm:text-xs tracking-widest rounded-lg px-3 py-2 bg-white/5 text-paper/70 border border-white/15 hover:border-accent hover:text-accent transition-colors"
            >
              ↩ UNDO
            </button>
            <button
              onClick={erase}
              className="font-mono text-[10px] sm:text-xs tracking-widest rounded-lg px-3 py-2 bg-white/5 text-paper/70 border border-white/15 hover:border-accent hover:text-accent transition-colors"
            >
              ⌫ ERASE
            </button>
            <button
              onClick={hint}
              disabled={hints === 0 || won}
              className="font-mono text-[10px] sm:text-xs tracking-widest rounded-lg px-3 py-2 bg-white/5 text-paper/70 border border-white/15 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
            >
              💡 {hints}
            </button>
          </div>
          <div className="grid grid-cols-9 gap-1">
            {Array.from({ length: 9 }).map((_, idx) => {
              const d = idx + 1;
              const remaining = 9 - (counts[d] ?? 0);
              return (
                <button
                  key={d}
                  onClick={() => inputDigit(d)}
                  className="flex flex-col items-center bg-white/5 border border-white/15 hover:border-accent hover:bg-accent/10 rounded-lg py-1.5 transition-colors"
                >
                  <span className="font-mono text-lg sm:text-xl text-paper">{d}</span>
                  <span className={`font-mono text-[9px] ${remaining === 0 ? "text-paper/20" : "text-accent/80"}`}>
                    {remaining}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* overlay de vitória */}
        {won && (
          <div className="absolute inset-0 bg-deep/95 rounded-xl flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-5xl">🏆</p>
            <h2 className="font-mono text-2xl font-bold text-accent tracking-widest">
              SOLVED!
            </h2>
            <p className="font-mono text-xs text-paper/70">
              {DIFFICULTIES[difficulty].label} · {fmtTime(seconds)} ·{" "}
              {mistakes} mistake{mistakes === 1 ? "" : "s"} · {3 - hints} hint{3 - hints === 1 ? "" : "s"}
            </p>
            <button
              onClick={() => newGame(difficulty)}
              className="bg-accent text-paper font-mono text-xs tracking-widest rounded-full px-6 py-3 hover:bg-accent/80 transition-colors"
            >
              NEW PUZZLE
            </button>
            <div className="flex gap-1 flex-wrap justify-center">
              {(Object.keys(DIFFICULTIES) as Difficulty[])
                .filter((d) => d !== difficulty)
                .map((d) => (
                  <button
                    key={d}
                    onClick={() => newGame(d)}
                    className="font-mono text-[10px] tracking-widest rounded-full px-3 py-1.5 bg-white/5 text-paper/60 border border-white/15 hover:border-accent hover:text-accent transition-colors"
                  >
                    {DIFFICULTIES[d].label}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-ink/40 font-mono text-center">
        Keyboard: arrows move · 1–9 place · N notes · H hint · U undo · ⌫ erase —
        your game is saved until you close the tab.
      </p>
    </div>
  );
}
