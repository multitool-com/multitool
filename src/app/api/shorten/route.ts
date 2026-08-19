import { NextResponse } from "next/server";

/**
 * URL Shortener API endpoint.
 * The browser cannot call cleanuri.com directly (no CORS), so this
 * serverless function forwards the URL for us. No database needed —
 * cleanuri stores the short-code mapping and handles the redirect.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown };
    const raw = typeof body?.url === "string" ? body.url.trim() : "";

    if (!raw) {
      return NextResponse.json({ error: "URL is required." }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json(
        { error: "Only http:// and https:// URLs are supported." },
        { status: 400 }
      );
    }

    const res = await fetch("https://cleanuri.com/api/v1/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url: raw }),
    });

    const data = (await res.json()) as {
      result_url?: string;
      error?: string;
    };

    if (data.result_url) {
      return NextResponse.json({ result_url: data.result_url });
    }

    return NextResponse.json(
      { error: data.error || "Shortening failed. Try again." },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { error: "Shortening failed. Try again." },
      { status: 500 }
    );
  }
}
