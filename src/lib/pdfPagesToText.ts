import type { PdfPageText } from "./pdfToMarkdown";

/** Result of reading a PDF for verification purposes. */
export interface PdfExtraction {
  /** Positioned text items per page, ready for the extraction engine. */
  pages: PdfPageText[];
  /** Raster figures detected in the whole document. */
  imageCount: number;
  /** 1-based pages that contain at least one raster figure. */
  imagePages: number[];
}

// pdf.js is browser-only (DOMMatrix, canvas), so it is loaded on demand.
async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }
  return pdfjsLib;
}

/**
 * Reads every page of a PDF: text items with their coordinates, plus the count
 * of embedded raster figures per page.
 *
 * The figure count is what makes a "did anything get lost?" check meaningful
 * for illustrated material: text extraction can never carry images, so the only
 * automatic guarantee possible is knowing how many the original had and how
 * many the Markdown references.
 *
 * Only raster images are counted (photos, exported charts, screenshots).
 * Vector drawings cannot be told apart from table borders, so they are left to
 * the visual review — the tool says so instead of guessing.
 */
export async function extractPdfForCheck(
  file: File,
  onProgress?: (page: number, total: number) => void
): Promise<PdfExtraction> {
  const pdfjsLib = await getPdfJs();
  const bytes = await file.arrayBuffer();
  const task = pdfjsLib.getDocument({ data: new Uint8Array(bytes) });
  const doc = await task.promise;

  const pages: PdfPageText[] = [];
  const imagePages: number[] = [];
  let imageCount = 0;

  try {
    const OPS = pdfjsLib.OPS;
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const items: PdfPageText["items"] = [];

      for (const item of content.items) {
        if (!("str" in item)) continue;
        const style = content.styles[item.fontName];
        items.push({
          str: item.str,
          x: item.transform[4],
          y: viewport.height - item.transform[5],
          width: item.width,
          height: Math.abs(item.height) || 10,
          fontName: `${style?.fontFamily ?? ""} ${item.fontName}`.trim(),
        });
      }

      pages.push({ items, width: viewport.width, height: viewport.height });

      // ---- figures: unique image objects painted on this page ----
      let pageImages = 0;
      try {
        const ops = await page.getOperatorList();
        const names = new Set<string>();
        let inline = 0;
        for (let i = 0; i < ops.fnArray.length; i++) {
          const fn = ops.fnArray[i];
          if (fn === OPS.paintImageXObject) {
            const name = ops.argsArray[i]?.[0];
            if (typeof name === "string") names.add(name);
            else inline += 1;
          } else if (fn === OPS.paintInlineImageXObject) {
            inline += 1;
          }
        }
        pageImages = names.size + inline;
      } catch {
        // Operator list unavailable: the text check still runs.
        pageImages = 0;
      }

      if (pageImages > 0) {
        imagePages.push(n);
        imageCount += pageImages;
      }

      onProgress?.(n, doc.numPages);
    }
  } finally {
    await task.destroy();
  }

  return { pages, imageCount, imagePages };
}
