"use client";

import { useMemo, useState } from "react";

const EMOJIS: { group: string; items: string[] }[] = [
  { group: "Smileys", items: ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","😉","😍","😘","😜","🤪","😎","🤩","🥳","😢","😭","😡","🤯","😴","🤗","🤔","🙄","😬","😱","🥺","😈","👻","💀","🤖","🎃","😺","🙈","💩"] },
  { group: "Gestures", items: ["👍","👎","👌","✌️","🤞","🤟","🤘","👊","✊","🤝","🙏","💪","👏","🙌","🤲","🫶","👆","👇","👉","👈","🖐️","✋","🤚","🫵"] },
  { group: "Hearts", items: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","💕","💞","💓","💗","💖","💘","💝","💟","♥️"] },
  { group: "Animals", items: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦉","🦄","🐝","🦋","🐢","🐍","🦖","🐳","🐬","🦈","🐙","🦀"] },
  { group: "Food", items: ["🍎","🍌","🍇","🍓","🍉","🍊","🍋","🍒","🍑","🥭","🍍","🥥","🥑","🍔","🍟","🍕","🌭","🍿","🥓","🧀","🥨","🥐","🍞","🥞","🍩","🍪","🎂","🍰","🧁","🍫","🍬","🍭","🍦","🍺","🍷","☕","🧃"] },
  { group: "Activity", items: ["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🎱","🏓","🏸","🥊","🥋","⛳","🏹","🎣","🥇","🥈","🥉","🏆","🎮","🕹️","🎲","🎯","🎳","🎨","🎬","🎤","🎧","🎹","🎸","🥁","🎺"] },
  { group: "Travel", items: ["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚜","🛴","🚲","🛵","✈️","🚀","🛸","🚁","⛵","🚢","🚂","🏠","🏡","🏢","🏖️","🏝️","🌋","🗽","🗼","🎡","🎢","⛺","🌃","🌅","🌈"] },
  { group: "Symbols", items: ["❤","⭐","🌟","✨","⚡","🔥","💧","💥","💫","❄️","☀️","🌙","☁️","⛅","🌧️","🌈","🎉","🎊","🎁","🎈","🎀","🔔","💎","🔑","🔒","🔓","📌","📍","📎","✂️","📷","📱","💻","⌨️","🖱️","🖨️","💾","📁","📂","🗂️"] },
];

export default function EmojiCopyPasteClient() {
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return EMOJIS;
    return EMOJIS.filter((g) =>
      g.group.toLowerCase().includes(q) ||
      g.items.some((e) => e.toLowerCase().includes(q))
    );
  }, [search]);

  const copy = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(null), 1000);
      setRecent((r) => [emoji, ...r.filter((e) => e !== emoji)].slice(0, 12));
    } catch { /* ignore */ }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div>
        <label htmlFor="emoji-search" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          SEARCH
        </label>
        <input
          id="emoji-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. heart, food, cat…"
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {recent.length > 0 && (
        <div>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">RECENT</span>
          <div className="flex flex-wrap gap-1.5">
            {recent.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => copy(e)}
                className="text-2xl p-1.5 rounded-lg hover:bg-paper hover:border hover:border-accent transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.map((group) => (
        <div key={group.group}>
          <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            {group.group.toUpperCase()}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => copy(e)}
                className="text-2xl p-1.5 rounded-lg hover:bg-paper hover:border hover:border-accent transition-colors"
                title={e}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ))}

      {copied && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-2 font-mono text-xs text-accent text-center">
          Copied {copied}!
        </div>
      )}

      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">Tip:</strong> click any emoji to copy
        it to your clipboard. Recent emojis are kept for the session.
      </div>
    </div>
  );
}
