---
title: "PDF, PDF/A and the Formats Inside Your PDF"
slug: "pdf-formats-explained"
description: "What makes a PDF a PDF, why PDF/A exists for archives, what encryption and flattened mean — the vocabulary of documents explained simply."
date: "2026-09-17"
updated: "2026-09-17"
tools: ["pdf-protect", "pdf-unlock", "pdf-metadata", "pdf-compress"]
---

Everyone uses PDFs; almost nobody knows what the letters hide. Ten minutes of vocabulary makes you the person who understands what lawyers, printers and archivists are asking for.

## What a PDF actually is

A PDF is a **page description**: a set of instructions that says "put this text here, this image there, in exactly this typography." That is why it looks identical everywhere — unlike a Word file, it does not re-flow based on the reader's fonts and settings. Inside, a PDF can contain:

- **Text** as real characters (searchable, selectable, accessible) or as images from scanners (neither — until OCR runs)
- **Fonts** embedded or referenced (embedded is what makes portability real)
- **Interactive elements**: forms, links, annotations, signatures
- **Structure**: bookmarks, tags for accessibility, metadata (author, dates, title)

## PDF/A: the archivist's PDF

**PDF/A** is a strict subset designed to be readable in 50+ years: all fonts embedded, no external dependencies, no encryption, no JavaScript. Courts, governments and libraries demand it for permanent records. Converting to PDF/A is an export choice in most document tools — if a registry asks for it, they are thinking about the year 2076.

## Encrypted and password-protected

Two different locks can be applied:

1. **User password** — the file cannot even be opened without it
2. **Owner password** — opens freely, but restricts printing/copying

If you own the document, both are manageable with our [PDF Unlock](/tools/pdf-tools/pdf-unlock); if you need to add protection (with real AES encryption and permission control), [PDF Protect](/tools/pdf-tools/pdf-protect) does it locally. See our guide on [removing passwords honestly](/guides/how-to-unlock-pdf) for the limits.

## "Flattened" and other vocabulary

- **Flattened PDF** — interactive elements (forms, layers) merged into static content; required by many official submission systems so nobody can edit after signing
- **Tagged PDF** — contains accessibility structure that screen readers navigate; a legal requirement for public documents in many countries
- **Linearized ("Fast Web View")** — arranged so browsers can show page 1 before the whole file downloads
- **Portfolio** — a PDF acting as a folder for other files; supported by Adobe Reader, unreliable elsewhere (extract the files for compatibility)

## Which quality matters when

| Goal | What to care about |
|---|---|
| Sending a contract | Text PDF, not scans; encryption only if required |
| Archiving records | PDF/A, flatten forms first |
| Email with size limits | Compress (scans shrink 60–85% — [guide](/guides/compress-pdf-guide)) |
| Website download | Linearized + compressed |
| Printing | 300 DPI source, no aggressive compression |

## Bottom line

A PDF is a chameleon that adapts to the job — contracts, archives, forms, print. Know the four words (PDF/A, encrypted, flattened, tagged) and you already speak the language of the people who process your documents.
