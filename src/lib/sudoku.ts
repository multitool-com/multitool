/**
 * Sudoku engine — geração, solução e validação.
 * Funções puras (sem DOM), testáveis em Node.
 */

export type Grid = number[]; // 81 células, 0 = vazia
export type Difficulty = "easy" | "medium" | "hard" | "expert";

export const DIFFICULTIES: Record<
  Difficulty,
  { label: string; targetClues: number; minClues: number }
> = {
  easy: { label: "EASY", targetClues: 41, minClues: 38 },
  medium: { label: "MEDIUM", targetClues: 34, minClues: 30 },
  hard: { label: "HARD", targetClues: 28, minClues: 25 },
  expert: { label: "EXPERT", targetClues: 24, minClues: 22 },
};

/** PRNG determinístico (mulberry32) — permite testes reproduzíveis. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- máscaras por unidade ----------
// rows[r] | cols[c] | boxes[b] com bit (1<<d) para dígito d (1..9)
interface Masks {
  rows: number[];
  cols: number[];
  boxes: number[];
}

function masksOf(grid: Grid): Masks {
  const rows = new Array(9).fill(0);
  const cols = new Array(9).fill(0);
  const boxes = new Array(9).fill(0);
  for (let i = 0; i < 81; i++) {
    const v = grid[i];
    if (!v) continue;
    const r = Math.floor(i / 9);
    const c = i % 9;
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    const bit = 1 << v;
    rows[r] |= bit;
    cols[c] |= bit;
    boxes[b] |= bit;
  }
  return { rows, cols, boxes };
}

/** Grade completa válida via backtracking com ordem aleatória. */
export function generateSolved(rng: () => number): Grid {
  const grid: Grid = new Array(81).fill(0);
  const { rows, cols, boxes } = masksOf(grid);

  const candidates = (i: number): number[] => {
    const r = Math.floor(i / 9);
    const c = i % 9;
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    const used = rows[r] | cols[c] | boxes[b];
    const out: number[] = [];
    for (let d = 1; d <= 9; d++) if (!(used & (1 << d))) out.push(d);
    return shuffle(out, rng);
  };

  const fill = (i: number): boolean => {
    if (i === 81) return true;
    // células pré-preenchidas (não há, mas seguro)
    if (grid[i] !== 0) return fill(i + 1);
    const r = Math.floor(i / 9);
    const c = i % 9;
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    for (const d of candidates(i)) {
      grid[i] = d;
      rows[r] |= 1 << d;
      cols[c] |= 1 << d;
      boxes[b] |= 1 << d;
      if (fill(i + 1)) return true;
      grid[i] = 0;
      rows[r] &= ~(1 << d);
      cols[c] &= ~(1 << d);
      boxes[b] &= ~(1 << d);
    }
    return false;
  };
  fill(0);
  return grid;
}


/** As 27 unidades (9 linhas + 9 colunas + 9 caixas) — índices de células. */
let UNITS: number[][] | null = null;
function allUnits(): number[][] {
  if (UNITS) return UNITS;
  const units: number[][] = [];
  for (let r = 0; r < 9; r++) units.push([...Array(9).keys()].map((c) => r * 9 + c));
  for (let c = 0; c < 9; c++) units.push([...Array(9).keys()].map((r) => r * 9 + c));
  for (let b = 0; b < 9; b++) {
    const br = Math.floor(b / 3) * 3;
    const bc = (b % 3) * 3;
    const cells: number[] = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push((br + r) * 9 + bc + c);
    units.push(cells);
  }
  UNITS = units;
  return units;
}

/** Dados iniciais contraditórios (duplicata em unidade)? */
function givensConflict(grid: Grid): boolean {
  for (const cells of allUnits()) {
    const seen = new Set<number>();
    for (const i of cells) {
      const v = grid[i];
      if (!v) continue;
      if (seen.has(v)) return true;
      seen.add(v);
    }
  }
  return false;
}

/**
 * Conta soluções (até `limit`) — solver com heurística de menor nº de
 * candidatos. Rápido o suficiente para validação de unicidade em massa.
 */
export function countSolutions(grid: Grid, limit = 2): number {
  // Pré-checagem: dados já contraditórios -> 0 soluções (sem explodir a busca)
  if (givensConflict(grid)) return 0;
  const g = [...grid];
  const { rows, cols, boxes } = masksOf(g);
  let count = 0;

  const best = (): number => {
    let bestI = -1;
    let bestOpts: number[] | null = null;
    for (let i = 0; i < 81; i++) {
      if (g[i]) continue;
      const r = Math.floor(i / 9);
      const c = i % 9;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      const used = rows[r] | cols[c] | boxes[b];
      const opts: number[] = [];
      for (let d = 1; d <= 9; d++) if (!(used & (1 << d))) opts.push(d);
      if (opts.length === 0) return -2; // beco sem saída
      if (!bestOpts || opts.length < bestOpts.length) {
        bestOpts = opts;
        bestI = i;
        if (opts.length === 1) break;
      }
    }
    if (bestOpts === null) return -1; // completa
    (best as { opts?: number[] }).opts = bestOpts;
    return bestI;
  };

  const solve = (): void => {
    if (count >= limit) return;
    const i = best();
    const opts = (best as { opts?: number[] }).opts;
    if (i === -1) {
      count++;
      return;
    }
    if (i === -2 || !opts) return;
    const r = Math.floor(i / 9);
    const c = i % 9;
    const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    for (const d of opts) {
      g[i] = d;
      rows[r] |= 1 << d;
      cols[c] |= 1 << d;
      boxes[b] |= 1 << d;
      solve();
      g[i] = 0;
      rows[r] &= ~(1 << d);
      cols[c] &= ~(1 << d);
      boxes[b] &= ~(1 << d);
      if (count >= limit) return;
    }
  };
  solve();
  return count;
}

/** Valida uma grade completa (todas as unidades com 1–9). */
export function isValidComplete(grid: Grid): boolean {
  const { rows, cols, boxes } = masksOf(grid);
  const FULL = 0b1111111110;
  for (let k = 0; k < 9; k++) {
    if (rows[k] !== FULL || cols[k] !== FULL || boxes[k] !== FULL) return false;
  }
  return true;
}

/**
 * Gera puzzle com SOLUÇÃO ÚNICA: remove células da grade completa enquanto
 * a unicidade se mantiver, até a meta de dicas da dificuldade.
 */
export function generatePuzzle(
  difficulty: Difficulty,
  rng: () => number = Math.random
): { puzzle: Grid; solution: Grid } {
  const solution = generateSolved(rng);
  const puzzle = [...solution];
  const target = DIFFICULTIES[difficulty].targetClues;
  const order = shuffle(
    [...Array(81).keys()].map((n) => n),
    rng
  );
  let clues = 81;
  for (const pos of order) {
    if (clues <= target) break;
    const backup = puzzle[pos];
    puzzle[pos] = 0;
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[pos] = backup; // remoção quebraria a unicidade
    } else {
      clues--;
    }
  }
  return { puzzle, solution };
}

/** Células em conflito (duplicidade em linha/coluna/caixa). */
export function findConflicts(grid: Grid): boolean[] {
  const conflict = new Array(81).fill(false);
  for (const cells of allUnits()) {
    const seen = new Map<number, number[]>();
    for (const i of cells) {
      const v = grid[i];
      if (!v) continue;
      if (!seen.has(v)) seen.set(v, []);
      seen.get(v)!.push(i);
    }
    for (const list of seen.values()) {
      if (list.length > 1) list.forEach((i) => (conflict[i] = true));
    }
  }
  return conflict;
}

/** Concluído corretamente? */
export function isSolved(board: Grid, solution: Grid): boolean {
  for (let i = 0; i < 81; i++) if (board[i] !== solution[i]) return false;
  return true;
}

/** Pares (linha, coluna) de uma célula — para limpar anotações ao colocar dígito. */
export function peersOf(i: number): number[] {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  const out = new Set<number>();
  for (let k = 0; k < 9; k++) {
    out.add(r * 9 + k);
    out.add(k * 9 + c);
    out.add((br + Math.floor(k / 3)) * 9 + bc + (k % 3));
  }
  out.delete(i);
  return [...out];
}
