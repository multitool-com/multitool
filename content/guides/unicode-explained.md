---
title: "Unicode and UTF-8: Why ❤ and é Work Everywhere Now"
slug: "unicode-explained"
description: "The invisible system that lets every language, emoji and symbol coexist on the web — how Unicode and UTF-8 work, and why they occasionally break."
date: "2026-09-17"
updated: "2026-09-17"
tools: ["base64-encoder", "url-encoder", "fancy-text-generator", "number-base-converter"]
---

Before the 90s, computers spoke dozens of incompatible "alphabets" — the same byte could be é on one system and » on another. Unicode ended the chaos, and understanding it explains half the weird text bugs you will ever meet.

## One number per character

Unicode assigns every character of every writing system a **code point** — a number with a name. U+0041 is A, U+00E9 is é, U+1F495 is 💕. There are almost 150,000 of them: Latin, Greek, Cyrillic, Arabic, Hebrew, the CJK family, math symbols, historical scripts, and yes, emoji.

## UTF-8: the clever encoding

Code points are concepts; bytes are reality. **UTF-8** is the scheme that converts one into the other — and it won the web by being backward compatible:

- Common English characters = 1 byte (identical to the old ASCII)
- Accented Latin characters = 2 bytes (é = C3 A9)
- Most symbols and CJK = 3 bytes
- Emoji and rare characters = 4 bytes (🎉 = F0 9F 8E 89)

98%+ of the web speaks UTF-8. It is why a Brazilian can email 🎉 to Japan and it arrives intact.

## The bugs you now can diagnose

- **"Ã©" instead of "é"** — UTF-8 bytes interpreted as Latin-1. The file is fine; the reader (or a missing `<meta charset="utf-8">`) guessed wrong.
- **□ or ? boxes** — the character arrived perfectly, but the *font* has no glyph for it. Old systems meeting new emoji.
- **Percent soup (%C3%A9)** — that is UTF-8 bytes formatted for URLs; decode with the [URL Encoder](/tools/developer-tools/url-encoder).
- **Base64 gibberish ends in =** — text (or a file) encoded for safe transport; decode with the [Base64 tool](/tools/developer-tools/base64-encoder).

## Fun facts with practical teeth

- **String length lies:** JavaScript counts é as 1 character but 🎉 as 2 — emoji exceed the old 16-bit limit. Databases and forms that validate length by characters may reject valid input.
- **Look-alike characters exist:** a Cyrillic а and Latin a are different code points — the trick behind some phishing URLs. Browsers now show punycode (xn--) for look-alike domains.
- **The "fancy fonts" trick:** styled text like 𝕤𝕥𝕪𝕝𝕖 is real Unicode from the math alphabet — which is why [fancy text](/tools/text-tools/fancy-text-generator) works in plain-text bios but sounds strange to screen readers.
- **Collation matters:** databases sort strings by rules (does Á come before B?). UTF-8 stores the data; collation decides the order.

## Bottom line

Unicode is why your keyboard, your emoji and your client's kanji coexist peacefully. When text breaks, it is almost always one of three actors: the encoding (UTF-8 vs legacy), the font (no glyph), or the length counter (emoji count double). Now you know which.
