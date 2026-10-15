"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { trackCopy, trackDownload, trackToolUsed } from "@/lib/analytics";
import { extractPdfForCheck } from "@/lib/pdfPagesToText";
import { convertPdfTextToMarkdown } from "@/lib/pdfToMarkdown";
import {
  buildReportMarkdown,
  checkIntegrity,
  type IntegrityReport,
  type IntegritySegment,
} from "@/lib/markdownIntegrity";

interface BaselineState {
  kind: "pdf" | "text";
  name: string;
  text: string;
  segments?: IntegritySegment[];
  images?: number;
  imagePages?: number[];
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isTextFile(file: File): boolean {
  return (
    file.type.startsWith("text/") ||
    /\.(md|markdown|txt)$/i.test(file.name)
  );
}

const VERDICT_STYLE: Record<
  IntegrityReport["verdict"],
  { label: string; message: string; className: string }
> = {
  intact: {
    label: "INTACT",
    message:
      "Every text unit, number, heading and figure reference of the original was found in the edited file.",
    className: "bg-deep text-paper",
  },
  review: {
    label: "REVIEW",
    message:
      "No content is missing, but some sentences were reworded. Check the list below to be sure the meaning survived.",
    className: "bg-accent text-ink",
  },
  loss: {
    label: "LOSS DETECTED",
    message:
      "Items from the original are not in the edited file. The lists below show exactly what to restore.",
    className: "bg-red-600 text-white",
  },
};

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper border border-ink/10 rounded-lg px-3 py-2">
      <div className="font-mono text-[10px] tracking-widest text-ink/60">
        {label}
      </div>
      <div className="font-mono text-sm text-ink">{value}</div>
    </div>
  );
}

function DropZone({
  id,
  title,
  hint,
  accept,
  fileName,
  size,
  onFiles,
}: {
  id: string;
  title: string;
  hint: string;
  accept: string;
  fileName?: string;
  size?: number;
  onFiles: (file: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFiles(e.dataTransfer.files?.[0] ?? null);
      }}
      className={`border-2 border-dashed rounded-xl px-4 py-6 text-center transition-colors ${
        dragging ? "border-accent bg-accent/5" : "border-ink/15 bg-paper"
      }`}
    >
      <p className="font-mono text-[10px] tracking-widest text-ink/60 mb-2">
        {title}
      </p>
      <input
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      <label
        htmlFor={id}
        className="cursor-pointer inline-block font-mono text-xs tracking-widest bg-deep text-paper px-5 py-2.5 rounded-lg hover:bg-accent transition-colors"
      >
        {fileName ? "CHOOSE ANOTHER" : "CHOOSE FILE"}
      </label>
      {fileName ? (
        <p className="mt-2 font-mono text-xs text-ink/80 truncate">
          {fileName} {size ? `· ${formatBytes(size)}` : ""}
        </p>
      ) : (
        <p className="mt-2 font-mono text-[11px] text-ink/60">{hint}</p>
      )}
    </div>
  );
}

export default function MarkdownIntegrityClient() {
  const [baselineFile, setBaselineFile] = useState<File | null>(null);
  const [candidateFile, setCandidateFile] = useState<File | null>(null);
  const [baseline, setBaseline] = useState<BaselineState | null>(null);
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const setBaselinePdf = async (file: File | null) => {
    setBaselineFile(file);
    setReport(null);
    setError("");
    if (!file) {
      setBaseline(null);
      return;
    }
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      setError("The baseline should be the original PDF (or an earlier .md file).");
      return;
    }
    setBusy(true);
    setProgress(`READING BASELINE · ${file.name}`);
    try {
      const extraction = await extractPdfForCheck(file, (page, total) =>
        setProgress(`READING BASELINE · PAGE ${page}/${total}`)
      );
      // The baseline is exactly what the PDF-to-Markdown converter would emit,
      // page by page, so the verification compares like with like.
      const segments: IntegritySegment[] = extraction.pages.map((page, index) => ({
        page: index + 1,
        text: convertPdfTextToMarkdown([page], {}, { fileName: file.name }).markdown,
      }));
      setBaseline({
        kind: "pdf",
        name: file.name,
        text: segments.map((s) => s.text).join("\n\n"),
        segments,
        images: extraction.imageCount,
        imagePages: extraction.imagePages,
      });
    } catch {
      setError(
        "Could not read this PDF. If it is password-protected, unlock it first with our PDF Unlock tool."
      );
      setBaseline(null);
    } finally {
      setBusy(false);
      setProgress("");
    }
  };

  const setBaselineText = async (file: File | null) => {
    setBaselineFile(file);
    setReport(null);
    setError("");
    if (!file) {
      setBaseline(null);
      return;
    }
    if (!isTextFile(file)) {
      setError("Choose the original PDF or a .md/.txt file as the baseline.");
      return;
    }
    const text = await file.text();
    setBaseline({ kind: "text", name: file.name, text });
  };

  const setCandidate = async (file: File | null) => {
    setCandidateFile(file);
    setReport(null);
    setError("");
    if (!file) return;
    if (!isTextFile(file)) {
      setError("The edited file should be Markdown (.md) or plain text (.txt).");
    }
  };

  const run = async () => {
    if (!baseline || !candidateFile || busy) return;
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      const candidateMarkdown = await candidateFile.text();
      trackToolUsed("markdown-integrity-check", "pdf-tools");
      const result = checkIntegrity({
        baselineText: baseline.text,
        candidateMarkdown,
        baselineKind: baseline.kind,
        segments: baseline.segments,
        baselineImages: baseline.images,
        baselineImagePages: baseline.imagePages,
        baselineName: baseline.name,
        candidateName: candidateFile.name,
      });
      setReport(result);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80
      );
    } catch {
      setError("Something went wrong while comparing the files. Try the check again.");
    } finally {
      setBusy(false);
    }
  };

  const reportMarkdown = report
    ? buildReportMarkdown(report, {
        baselineName: baseline?.name,
        candidateName: candidateFile?.name,
        date: new Date().toISOString().slice(0, 10),
      })
    : "";

  const downloadReport = () => {
    if (!reportMarkdown) return;
    const blob = new Blob([reportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "integrity-report.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    trackDownload("markdown-integrity-check", "pdf-tools");
  };

  const copyReport = async () => {
    if (!reportMarkdown) return;
    try {
      await navigator.clipboard.writeText(reportMarkdown);
      setCopied(true);
      trackCopy("markdown-integrity-check", "pdf-tools");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Your browser blocked clipboard access — use the download button instead.");
    }
  };

  const verdict = report ? VERDICT_STYLE[report.verdict] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <DropZone
            id="integrity-baseline-pdf"
            title="1 · BASELINE — ORIGINAL PDF"
            hint="pdf, page by page"
            accept="application/pdf,.pdf"
            fileName={baselineFile?.name}
            size={baselineFile?.size}
            onFiles={setBaselinePdf}
          />
          <DropZone
            id="integrity-candidate"
            title="2 · EDITED FILE"
            hint="md or txt"
            accept=".md,.markdown,.txt,text/markdown,text/plain"
            fileName={candidateFile?.name}
            size={candidateFile?.size}
            onFiles={setCandidate}
          />
        </div>

        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
          <p className="mb-1">
            <strong className="text-ink">Skip the PDF?</strong> You can also use an
            earlier <code className="font-mono text-xs">.md</code> as the baseline:
            choose it in the second box, then swap the roles in the first one — or use
            the buttons below.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <label className="font-mono text-[10px] tracking-widest bg-white border border-ink/15 rounded-full px-3 py-2 hover:border-accent hover:text-accent-deep transition-colors cursor-pointer">
              USE A .MD/.TXT AS BASELINE
              <input
                type="file"
                accept=".md,.markdown,.txt,text/markdown,text/plain"
                className="hidden"
                onChange={(e) => {
                  setBaselineText(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={run}
            disabled={!baseline || !candidateFile || busy}
            className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? "WORKING…" : "CHECK INTEGRITY"}
          </button>
          {progress && (
            <span className="font-mono text-[10px] tracking-widest text-ink/70">
              {progress}
            </span>
          )}
          {baseline && (
            <span className="font-mono text-[10px] tracking-widest text-ink/60">
              BASELINE READY ·{" "}
              {baseline.kind === "pdf"
                ? `${baseline.segments?.length ?? 0} PAGES · ${baseline.images ?? 0} FIGURES`
                : "TEXT FILE"}
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-mono text-xs break-words">
            {error}
          </div>
        )}
      </div>

      {report && verdict && (
        <div
          ref={resultRef}
          className="bg-white border border-ink/10 rounded-xl p-6 shadow-sm flex flex-col gap-5"
        >
          <div className={`${verdict.className} rounded-xl px-5 py-4`}>
            <p className="font-mono text-xs tracking-widest mb-1">{verdict.label}</p>
            <p className="font-display text-2xl font-bold mb-1">
              {report.score.toFixed(1)}% of the original text recovered
            </p>
            <p className="text-sm opacity-90">{verdict.message}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <Chip label="WORDS" value={`${report.wordCoverage.toFixed(1)}%`} />
            <Chip label="UNITS LOST" value={String(report.counts.unitsMissing)} />
            <Chip label="REWORDED" value={String(report.counts.unitsPartial)} />
            <Chip
              label="NUMBERS"
              value={
                report.counts.numbersMissing
                  ? `${report.counts.numbersMissing}/${report.counts.numbers}`
                  : `0/${report.counts.numbers}`
              }
            />
            <Chip label="HEADINGS" value={`${report.counts.headingsMissing}/${report.counts.headings}`} />
            <Chip
              label="FIGURES"
              value={`${report.counts.candidateImages}/${report.counts.baselineImages}`}
            />
            <Chip label="ADDED WORDS" value={String(report.counts.wordsAdded)} />
          </div>

          {report.notes.map((note) => (
            <div
              key={note}
              className="bg-accent/10 border border-accent/30 text-ink/80 rounded-lg px-4 py-3 text-sm"
            >
              {note}
            </div>
          ))}

          {report.missingUnits.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-bold mb-2">
                Missing text ({report.missingUnits.length})
              </h3>
              <ul className="flex flex-col gap-2">
                {report.missingUnits.map((unit, i) => (
                  <li key={i} className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-ink/90">{unit.text}</p>
                    <p className="font-mono text-[10px] tracking-widest text-red-700 mt-2">
                      {unit.page ? `PAGE ${unit.page} · ` : ""}
                      {unit.missingWords.length
                        ? `NOT FOUND: ${unit.missingWords.join(", ").toUpperCase()}`
                        : "NOT FOUND"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {report.partialUnits.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-bold mb-2">
                Reworded ({report.partialUnits.length})
              </h3>
              <ul className="flex flex-col gap-2">
                {report.partialUnits.map((unit, i) => (
                  <li key={i} className="bg-paper border border-ink/10 rounded-lg px-4 py-3">
                    <p className="text-sm text-ink/90">{unit.text}</p>
                    <p className="font-mono text-[10px] tracking-widest text-ink/60 mt-2">
                      {unit.page ? `PAGE ${unit.page} · ` : ""}
                      {(unit.coverage * 100).toFixed(0)}% RECOVERED
                      {unit.missingWords.length
                        ? ` · NOT FOUND: ${unit.missingWords.join(", ").toUpperCase()}`
                        : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {report.numberIssues.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-bold mb-2">
                Numbers missing or changed ({report.numberIssues.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.numberIssues.map((issue, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs bg-red-50 border border-red-200 text-red-700 rounded-full px-3 py-1.5"
                  >
                    {issue.value}
                  </span>
                ))}
              </div>
            </section>
          )}

          {report.headingIssues.length > 0 && (
            <section>
              <h3 className="font-display text-lg font-bold mb-2">
                Headings missing or renamed ({report.headingIssues.length})
              </h3>
              <ul className="flex flex-col gap-2">
                {report.headingIssues.map((issue, i) => (
                  <li
                    key={i}
                    className="bg-paper border border-ink/10 rounded-lg px-4 py-2 text-sm text-ink/90"
                  >
                    {issue.value}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {report.counts.baselineImages > 0 && (
            <section>
              <h3 className="font-display text-lg font-bold mb-2">Figures</h3>
              <p className="text-sm text-ink/80">
                The original PDF contains{" "}
                <strong>{report.counts.baselineImages}</strong> embedded figure(s)
                {report.imagePages.length
                  ? ` on page(s) ${report.imagePages.join(", ")}`
                  : ""}
                ; the edited file references{" "}
                <strong>{report.counts.candidateImages}</strong> image(s).
                {report.imageGap > 0 && (
                  <>
                    {" "}
                    <span className="text-red-700 font-semibold">
                      {report.imageGap} still to be inserted.
                    </span>
                  </>
                )}
              </p>
              {report.imageGap > 0 && (
                <p className="text-sm text-ink/70 mt-2">
                  Text extraction never carries images. Export the pages as PNG with{" "}
                  <Link
                    href="/tools/pdf-tools/pdf-to-images"
                    className="text-accent-deep underline underline-offset-2"
                  >
                    PDF to Images
                  </Link>
                  , save the files next to your Markdown, reference them with{" "}
                  <code className="font-mono text-xs">![caption](figura-1.png)</code>{" "}
                  and run this check again — it will confirm the count.
                </p>
              )}
            </section>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={downloadReport}
              className="bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              DOWNLOAD REPORT (.MD)
            </button>
            <button
              type="button"
              onClick={copyReport}
              className="bg-paper text-ink/70 border border-ink/15 hover:border-accent hover:text-accent-deep font-mono text-xs tracking-widest px-4 py-2.5 rounded-lg transition-colors"
            >
              {copied ? "COPIED ✓" : "COPY REPORT"}
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-ink/50 font-mono text-center">
        Everything runs in your browser — neither file leaves your device.
      </p>
    </div>
  );
}
