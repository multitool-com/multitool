/**
 * Lightweight GA4 event helper for tool usage tracking.
 * Safe on the server (no-ops when window/gtag is unavailable).
 */
type TrackParams = Record<string, string | number | boolean>;

export function track(
  action: string,
  toolSlug: string,
  category?: string,
  params?: TrackParams
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", action, {
    tool_slug: toolSlug,
    tool_category: category ?? "",
    ...params,
  });
}

/** Convenience for the most common event: a tool was actually used. */
export function trackToolUsed(toolSlug: string, category?: string): void {
  track("tool_used", toolSlug, category);
}

/** Convenience for downloads / generated files. */
export function trackDownload(toolSlug: string, category?: string): void {
  track("tool_download", toolSlug, category);
}

/** Convenience for copy-to-clipboard actions. */
export function trackCopy(toolSlug: string, category?: string): void {
  track("tool_copy", toolSlug, category);
}
