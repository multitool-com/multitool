---
title: "QR Codes: How They Work and How to Make Yours Scan Perfectly"
slug: "qr-codes-guide"
description: "Anatomy of a QR code, error correction explained, size and contrast rules that guarantee scans — and the mistakes that make codes fail in the wild."
date: "2026-09-17"
updated: "2026-09-17"
tools: ["qr-code-generator", "password-generator", "image-compressor"]
---

QR codes went from boring logistics labels to the default bridge between physical and digital — menus, payments, business cards, Wi-Fi sharing. Thirty seconds of understanding makes yours work everywhere, every time.

## Anatomy in one paragraph

A QR code is your data (URL, text, Wi-Fi credentials) encoded as a pattern of black and white modules, framed by three big finder squares (the corners the camera locks onto), a timing pattern, and your payload in the middle. The version (1–40) defines how much data fits; error-correction level defines how much damage it survives.

## Error correction: the superpower

QR codes use Reed–Solomon error correction — up to **30% of the code can be damaged and still scan**. That is why a small logo in the center usually works, and why a slightly scuffed printed code keeps functioning.

| Level | Recoverable | Use for |
|---|---|---|
| L | ~7% | Maximum data, clean surfaces |
| M | ~15% | General default |
| Q | ~25% | Outdoor, wear expected |
| H | ~30% | Logos on top, rough handling |

## The rules that guarantee a scan

1. **Size = scan distance ÷ 10.** A code scanned from 1 meter needs at least 10 cm. Business cards are safe because they are scanned from 20–30 cm.
2. **Contrast, dark on light.** Inverted codes (light on dark) fail on many scanners. Dark modules on white or near-white background is the reliable choice.
3. **Quiet zone:** keep the white margin around the code — at least four modules wide. Designs that bleed into the margin break decoding.
4. **Flat and well-lit:** curved surfaces (bottles, fabric) and glare from lamination are the top real-world killers. Matte finishes beat glossy.
5. **Test with 2–3 phones** before printing a thousand copies — older cameras are the honest judges.

## Static vs dynamic

A **static** QR code (what our [QR Code Generator](/tools/generators/qr-code-generator) makes) stores the data itself — it works forever, offline, with no company in the middle. A **dynamic** code stores a redirect URL — you can change the destination later, but the service can shut down or start charging. For links meant to last (business cards, books, signage), static is the safer bet; for campaigns that need editing and click stats, dynamic services earn their fee.

## What to encode (and what not to)

- ✅ **URLs** (use short, lowercase links), **Wi-Fi** credentials, **plain contact info**, **payment links**
- ⚠️ **Long URLs** make dense codes — dense codes are harder to scan. Shorten first.
- ❌ **Passwords and secrets** — a QR code is readable by any camera; it is a convenience format, not a secure channel.

## Bottom line

Generate → test on two phones → print with contrast and margin. Follow that and your code will still be scanning when the printer's ink has faded.
