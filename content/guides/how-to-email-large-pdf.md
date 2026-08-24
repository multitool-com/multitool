---
title: "How to Email a Large PDF (Gmail, Outlook and the 25 MB Wall)"
slug: "how-to-email-large-pdf"
description: "Attachment limits per provider, what to do when your PDF does not fit, and the compression-first workflow that solves 90% of cases."
date: "2026-08-24"
updated: "2026-08-24"
tools: ["pdf-compress", "pdf-split", "pdf-merge", "pdf-remove-pages"]
---

You finished the document, hit Attach, and the provider refused it. Here is why — and the exact order of moves that solves it.

## The actual limits (2026)

| Provider | Attachment limit |
|---|---|
| Gmail | 25 MB (received: 50 MB) |
| Outlook.com | 20 MB |
| Yahoo Mail | 25 MB |
| Corporate Exchange | often 10–20 MB (admin-defined) |

The limit counts the **whole email with encoding overhead** — a 24 MB PDF plus message text can already tip Gmail over the edge, because attachments grow ~30% during transport encoding. Practical rule: treat **~18 MB as the real ceiling** for a PDF.

## Step 1 — always compress first

Most oversized PDFs are scans or photo-heavy exports, and those compress dramatically (60–85% smaller is typical). A 40 MB scan routinely drops under the limit without visible loss.

- Use the [PDF Compressor](/tools/pdf-tools/pdf-compress) — it runs entirely in your browser, so confidential documents never touch a server.
- Sweet spot: quality 70–80%. Below 60%, scanned text starts to look soft.

## Step 2 — remove what the recipient does not need

Drafts, blank pages, appendixes, the 30-page price list only you care about: cut them. Use [Remove Pages from PDF](/tools/pdf-tools/pdf-remove-pages) — including its "keep only these pages" mode when you want pages 1–3 and nothing else.

## Step 3 — split when one file must stay big

If the content genuinely cannot shrink (high-res portfolio, legal scans):

1. [Split the PDF](/tools/pdf-tools/pdf-split) into 2–3 parts under the limit;
2. send them as separate messages with clear subjects ("Contract — part 1 of 2");
3. the recipient can [merge them back](/tools/pdf-tools/pdf-merge) in seconds if needed.

## When even that is not enough

- **Cloud link** — Drive/Dropbox/WeTransfer handles gigabytes; share the link instead of the file. Check viewing permissions before sending.
- **Ask the recipient** — many companies have an upload portal or a larger corporate limit for exactly this reason.

## The privacy angle

Server-based compressors upload your document to unknown infrastructure. For contracts, medical records, financial statements or anything with personal data, browser-side processing is the only sensible default — which is how every PDF tool on this site works: files never leave your device.

## Quick decision flow

1. Over 18 MB? → **Compress** (70–80% quality)
2. Still over? → **Remove pages** you do not need
3. Still over? → **Split** into parts
4. Genuinely huge? → **Cloud link**

Nine times out of ten, step 1 is the whole story.
