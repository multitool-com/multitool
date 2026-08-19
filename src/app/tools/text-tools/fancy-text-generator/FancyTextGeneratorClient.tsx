"use client";

import { useState } from "react";

interface Style {
  id: string;
  label: string;
  convert: (s: string) => string;
}

const STYLES: Style[] = [
  {
    id: "bold",
    label: "𝗕𝗼𝗹𝗱",
    convert: (s) =>
      s.replace(/[a-zA-Z0-9]/g, (c) => {
        const map: Record<string, string> = {
          a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
          j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
          s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
          A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
          J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
          S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
          "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰", "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵",
        };
        return map[c] ?? c;
      }),
  },
  {
    id: "italic",
    label: "𝘐𝘵𝘢𝘭𝘪𝘤",
    convert: (s) =>
      s.replace(/[a-zA-Z]/g, (c) => {
        const map: Record<string, string> = {
          a: "𝘢", b: "𝘣", c: "𝘤", d: "𝘥", e: "𝘦", f: "𝘧", g: "𝘨", h: "𝘩", i: "𝘪",
          j: "𝘫", k: "𝘬", l: "𝘭", m: "𝘮", n: "𝘯", o: "𝘰", p: "𝘱", q: "𝘲", r: "𝘳",
          s: "𝘴", t: "𝘵", u: "𝘶", v: "𝘷", w: "𝘸", x: "𝘹", y: "𝘺", z: "𝘻",
          A: "𝘈", B: "𝘉", C: "𝘊", D: "𝘋", E: "𝘌", F: "𝘍", G: "𝘎", H: "𝘏", I: "𝘐",
          J: "𝘑", K: "𝘒", L: "𝘓", M: "𝘔", N: "𝘕", O: "𝘖", P: "𝘗", Q: "𝘘", R: "𝘙",
          S: "𝘚", T: "𝘛", U: "𝘜", V: "𝘝", W: "𝘞", X: "𝘟", Y: "𝘠", Z: "𝘡",
        };
        return map[c] ?? c;
      }),
  },
  {
    id: "cursive",
    label: "𝓒𝓾𝓻𝓼𝓲𝓿𝓮",
    convert: (s) =>
      s.replace(/[a-zA-Z]/g, (c) => {
        const map: Record<string, string> = {
          a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱", i: "𝓲",
          j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹", q: "𝓺", r: "𝓻",
          s: "𝓼", t: "𝓽", u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁", y: "𝔂", z: "𝔃",
          A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗", I: "𝓘",
          J: "𝓙", K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟", Q: "𝓠", R: "𝓡",
          S: "𝓢", T: "𝓣", U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧", Y: "𝓨", Z: "𝓩",
        };
        return map[c] ?? c;
      }),
  },
  {
    id: "mono",
    label: "𝚖𝚘𝚗𝚘",
    convert: (s) =>
      s.replace(/[a-zA-Z0-9]/g, (c) => {
        const map: Record<string, string> = {
          a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒",
          j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖", n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛",
          s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
          A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸",
          J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼", N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁",
          S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉",
          "0": "𝟶", "1": "𝟷", "2": "𝟸", "3": "𝟹", "4": "𝟺", "5": "𝟻", "6": "𝟼", "7": "𝟽", "8": "𝟾", "9": "𝟿",
        };
        return map[c] ?? c;
      }),
  },
  {
    id: "upside",
    label: "ʇxǝʇ (upside down)",
    convert: (s) =>
      s
        .split("")
        .reverse()
        .map((c) => {
          const map: Record<string, string> = {
            a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ",
            j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
            s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
            A: "∀", B: "𐐒", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H", I: "I",
            J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ᴚ",
            S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X", Y: "ʎ", Z: "Z",
            "?": "¿", "!": "¡", ".": "˙", ",": "'", "(": ")", ")": "(",
          };
          return map[c] ?? c;
        })
        .join(""),
  },
  {
    id: "smallcaps",
    label: "ꜱᴍᴀʟʟ ᴄᴀᴘꜱ",
    convert: (s) =>
      s.replace(/[a-z]/g, (c) => {
        const map: Record<string, string> = {
          a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ",
          j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "Q", r: "ʀ",
          s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
        };
        return map[c] ?? c;
      }),
  },
];

export default function FancyTextGeneratorClient() {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch { /* ignore */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="fancy-input" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          YOUR TEXT
        </label>
        <textarea
          id="fancy-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="Type something to style…"
          className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
        />
      </div>

      {input.trim() && (
        <div className="flex flex-col gap-3">
          {STYLES.map((style) => {
            const out = style.convert(input);
            return (
              <div key={style.id} className="bg-paper border border-ink/10 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1">
                    {style.label}
                  </span>
                  <span className="text-lg break-all">{out || " "}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copy(style.id, out)}
                  disabled={!out}
                  className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full bg-white border border-ink/10 text-ink/60 hover:border-accent hover:text-accent transition-colors shrink-0 disabled:opacity-40"
                >
                  {copiedId === style.id ? "✓" : "COPY"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Note:</strong> fancy unicode styles may
        not render on every platform or app — some fonts don't include these
        characters. Works great on social media bios and messages.
      </div>
    </div>
  );
}
