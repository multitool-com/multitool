---
title: "What Is HEIC? The iPhone Photo Format Explained"
slug: "what-is-heic"
description: "Why iPhones shoot HEIC photos, how HEIC compares to JPG in size and quality, which devices open it — and how to convert safely."
date: "2026-08-20"
updated: "2026-08-20"
tools: ["heic-to-jpg", "exif-viewer", "image-resizer", "image-compressor"]
---

If you ever moved photos from an iPhone to a Windows PC or an older app and saw "format not supported", you have met **HEIC**. Here is what it is, why Apple uses it, and what to do about it.

## What is HEIC?

HEIC (High Efficiency Image Container) is an image format based on the **HEIF** standard (High Efficiency Image File). Since **iOS 11 (2017)**, iPhones save photos as HEIC by default instead of JPG. Android makers increasingly use it too (often named `.heif`).

The reason is simple: **HEIC stores the same photo in roughly half the space** of JPG. On a 64 GB phone, that difference is hundreds — sometimes thousands — of extra photos.

## HEIC vs JPG at a glance

| Feature | HEIC | JPG |
|---|---|---|
| File size (same quality) | ~50% smaller | Baseline |
| Quality at same size | Better (newer codec) | Good |
| Compatibility | Apple ecosystem, modern apps | Universal |
| Transparency | ✅ Yes | ❌ No |
| Multiple photos in one file | ✅ Yes (bursts, Live Photos) | ❌ No |
| Metadata (EXIF) | ✅ Yes | ✅ Yes |

## Why HEIC causes problems

Compatibility is the catch. Even today, some situations still expect JPG:

- **Older Windows** versions and some email/CRM uploads
- Many **CMS and website builders** that only accept JPG/PNG
- Older **photo editing software**
- Some printers and lab services

Ironically, Apple usually converts silently: if you send a photo via Mail or certain apps, iOS may export JPG automatically — which is why the problem appears "sometimes".

## Should you switch your iPhone to JPG permanently?

**Settings → Camera → Formats → Most Compatible** makes new photos JPG. Trade-off: your storage fills ~2× faster. A better strategy for most people:

1. Keep shooting HEIC (storage win).
2. Convert to JPG **when needed** — sharing, uploading, or handing files to Windows users.

## How to convert HEIC to JPG (without uploading your photos)

The safest converters run **locally in your browser** — your family photos never touch a server:

- Our [HEIC to JPG Converter](/tools/images/heic-to-jpg) decodes the file on your device, lets you choose quality (90% is visually identical), and downloads the result instantly.
- Need a different size after converting? Follow up with the [Image Resizer](/tools/images/image-resizer).
- Want less metadata in the file you will share? Check it first with the [EXIF Viewer & Remover](/tools/images/exif-viewer) — HEIC files can embed GPS location.

## Does converting HEIC → JPG lose quality?

Both formats are lossy, so technically yes — practically, at **90% quality** the result is indistinguishable on screen and in prints. Two rules of thumb:

1. Always convert **from the original HEIC**, never re-convert a JPG again and again.
2. Use quality 90+ for photos you might print or crop later.

## Privacy note specific to HEIC

HEIC files carry the same EXIF metadata as JPG — camera model, date, and often **GPS coordinates**. Before sharing converted photos publicly, strip the metadata with the [EXIF Viewer & Remover](/tools/images/exif-viewer).

## Bottom line

HEIC is a better format that occasionally lives in a JPG world. Keep it on the phone, convert on demand — free, local, and instant.
