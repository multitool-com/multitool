"use client";

import { useState } from "react";

type Mode = "pet" | "business";

const PET_THEMES: Record<string, string[]> = {
  Cute: ["Biscuit", "Mochi", "Nala", "Peanut", "Coco", "Pumpkin", "Mochi", "Winnie", "Boba", "Maple", "Olive", "Daisy", "Milo", "Mimi", "Lulu", "Teddy", "Churro", "Pip", "Bunny", "Marshmallow", "Tofu", "Nugget", "Peaches", "Cupcake"],
  Food: ["Oreo", "Muffin", "Waffles", "Pickle", "Sushi", "Taco", "Nacho", "Pretzel", "Bagel", "Sesame", "Brie", "Fig", "Kiwi", "Mango", "Pepper", "Cheddar", "Popcorn", "Meatball", "Pancake", "Cookie", "Ravioli", "Sprout", "Ginger", "Bacon"],
  Nature: ["Willow", "River", "Aspen", "Clover", "Fern", "Meadow", "Juniper", "Cedar", "Brook", "Storm", "Ember", "Pebble", "Sable", "Iris", "Lily", "Hazel", "Autumn", "Breeze", "Canyon", "Prairie", "Onyx", "Misty", "Thistle", "Rowan"],
  Funny: ["Sir Barksalot", "Captain Wiggle", "Nacho", "Floof", "Noodle", "Waffles", "Goose", "Pickles", "Beans", "Doodle", "Chonk", "Biscuit", "Zigzag", "Turbo", "Slinky", "Dumpling", "Spork", "Wombat", "Gizmo", "Rocket", "Mango", "Biscotti", "Nugget", "Pants"],
  Famous: ["Apollo", "Luna", "Zeus", "Athena", "Thor", "Nova", "Cleo", "Simba", "Arya", "Gandalf", "Yoda", "Einstein", "Freya", "Odin", "Hera", "Leia", "Milo", "Sherlock", "Bowie", "Jagger", "Marilyn", "Elvis", "Django", "Amadeus"],
};

const PET_PREFIXES = ["Sir", "Lady", "Captain", "Professor", "Doctor", "Miss", "Mister", "Duke", "Baron", "Princess"];

const BIZ_STYLES: Record<string, { prefixes: string[]; suffixes: string[] }> = {
  Modern: {
    prefixes: ["Nova", "Bright", "Peak", "Urban", "Vertex", "Pulse", "Zen", "Prism", "Flux", "Apex", "Orbit", "Vivid"],
    suffixes: ["Labs", "Studio", "Digital", "Works", "Systems", "HQ", "Media", "Collective", "Co", "Group"],
  },
  Classic: {
    prefixes: ["Sterling", "Golden", "Heritage", "Crown", "King", "Grand", "Royal", "Old Mill", "Atlas", "Meridian"],
    suffixes: ["& Sons", "& Co", "Brothers", "Estates", "House", "Traders", "Goods", "Supplies", "Partners", "Associates"],
  },
  Playful: {
    prefixes: ["Zippy", "Bouncy", "Wiggly", "Silly", "Happy", "Chirpy", "Cosmic", "Groovy", "Tiny", "Mighty"],
    suffixes: ["Buddies", "Pop", "Kittens", "Club", "World", "Shop", "Friends", "Corner", "Sprout", "Crew"],
  },
  Tech: {
    prefixes: ["Data", "Cyber", "Byte", "Logic", "Quantum", "Neural", "Cloud", "Pixel", "Circuit", "Hyper", "Meta", "Vector"],
    suffixes: ["Soft", "Tech", "Net", "Byte", "Code", "Works", "AI", "Stack", "Labs", "Systems"],
  },
  Luxury: {
    prefixes: ["Maison", "Velvet", "Aurelia", "Elite", "Prestige", "Sovereign", "Opulent", "Regal", "Sapphire", "Platinum"],
    suffixes: ["Collection", "Atelier", "Maison", "Signature", "Royale", "Boutique", "Exclusive", "Couture", "Fine", "Estate"],
  },
};

function pickUnique(list: string[], n: number): string[] {
  const pool = [...list];
  const out: string[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

export function generatePetNames(theme: string, type: string, count = 10): string[] {
  const base = PET_THEMES[theme] ?? PET_THEMES.Cute;
  const names = pickUnique(base, count);
  return names.map((n) => {
    const r = Math.random();
    if (r < 0.3) {
      const prefix = PET_PREFIXES[Math.floor(Math.random() * PET_PREFIXES.length)];
      return `${prefix} ${n}`;
    }
    if (r < 0.45) return `${n} ${type}`;
    return n;
  });
}

export function generateBusinessNames(style: string, keyword: string, count = 10): string[] {
  const s = BIZ_STYLES[style] ?? BIZ_STYLES.Modern;
  const kw = keyword.trim();
  const out: string[] = [];
  const used = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < 200) {
    guard++;
    const usePrefix = Math.random() < 0.6;
    const a = usePrefix
      ? s.prefixes[Math.floor(Math.random() * s.prefixes.length)]
      : s.suffixes[Math.floor(Math.random() * s.suffixes.length)];
    const b = usePrefix
      ? s.suffixes[Math.floor(Math.random() * s.suffixes.length)]
      : s.prefixes[Math.floor(Math.random() * s.prefixes.length)];
    let name: string;
    if (kw) {
      // keyword can be first or last
      name = Math.random() < 0.5 ? `${kw} ${a}` : `${a} ${kw}`;
    } else {
      name = `${a} ${b}`;
    }
    if (used.has(name)) continue;
    used.add(name);
    out.push(name);
  }
  return out;
}

export default function PetBusinessNameGeneratorClient() {
  const [mode, setMode] = useState<Mode>("pet");
  const [theme, setTheme] = useState("Cute");
  const [petType, setPetType] = useState("Dog");
  const [style, setStyle] = useState("Modern");
  const [keyword, setKeyword] = useState("");
  const [names, setNames] = useState<string[]>(() => generatePetNames("Cute", "Dog", 10));
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const regenerate = () => {
    if (mode === "pet") setNames(generatePetNames(theme, petType, 10));
    else setNames(generateBusinessNames(style, keyword, 10));
    setCopiedIdx(null);
  };

  const copy = async (name: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {
      // clipboard unavailable
    }
  };

  const pill = (active: boolean) =>
    `font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
      active ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
    }`;

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button type="button" onClick={() => { setMode("pet"); setNames(generatePetNames(theme, petType, 10)); }} className={pill(mode === "pet")}>
          🐾 PET NAMES
        </button>
        <button type="button" onClick={() => { setMode("business"); setNames(generateBusinessNames(style, keyword, 10)); }} className={pill(mode === "business")}>
          💼 BUSINESS NAMES
        </button>
      </div>

      {mode === "pet" ? (
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">PET TYPE</div>
            <div className="flex gap-2 flex-wrap">
              {["Dog", "Cat", "Bird", "Small Pet"].map((t) => (
                <button key={t} type="button" onClick={() => setPetType(t)} className={pill(petType === t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">THEME</div>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(PET_THEMES).map((t) => (
                <button key={t} type="button" onClick={() => setTheme(t)} className={pill(theme === t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">STYLE</div>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(BIZ_STYLES).map((s) => (
                <button key={s} type="button" onClick={() => setStyle(s)} className={pill(style === s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="biz-kw" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
              KEYWORD (OPTIONAL)
            </label>
            <input
              id="biz-kw"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. pizza, studio, pet"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={regenerate}
        className="self-center bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
      >
        🎲 GENERATE NAMES
      </button>

      <div className="grid sm:grid-cols-2 gap-2">
        {names.map((name, i) => (
          <button
            key={`${name}-${i}`}
            type="button"
            onClick={() => copy(name, i)}
            className="group flex items-center justify-between gap-2 bg-paper border border-ink/10 rounded-lg px-4 py-3 text-left hover:border-accent hover:text-accent transition-colors"
          >
            <span className="font-display text-base font-semibold text-deep group-hover:text-accent truncate">
              {name}
            </span>
            <span className="font-mono text-[10px] tracking-widest text-ink/40 shrink-0">
              {copiedIdx === i ? "✓" : "COPY"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
