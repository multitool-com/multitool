"use client";

import { useState } from "react";

type DocType = "website" | "article" | "product";

export function buildMetaHtml(
  title: string,
  description: string,
  url: string,
  image: string,
  type: DocType,
  siteName: string,
  card: string
): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
  ];
  if (url.trim()) lines.push(`<link rel="canonical" href="${esc(url.trim())}" />`);
  lines.push(
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`
  );
  if (url.trim()) lines.push(`<meta property="og:url" content="${esc(url.trim())}" />`);
  if (image.trim()) lines.push(`<meta property="og:image" content="${esc(image.trim())}" />`);
  if (siteName.trim()) lines.push(`<meta property="og:site_name" content="${esc(siteName.trim())}" />`);
  lines.push(
    `<meta name="twitter:card" content="${card}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`
  );
  if (image.trim()) lines.push(`<meta name="twitter:image" content="${esc(image.trim())}" />`);
  return lines.join("\n");
}

export default function MetaTagGeneratorClient() {
  const [title, setTitle] = useState("MultiTool — Free Online Tools, Calculators & Generators");
  const [description, setDescription] = useState(
    "Free online tools: calculators, converters, generators, PDF tools and games. No sign-up, no install — everything runs in your browser."
  );
  const [url, setUrl] = useState("https://multitoolbox.online");
  const [image, setImage] = useState("");
  const [type, setType] = useState<DocType>("website");
  const [siteName, setSiteName] = useState("MultiTool");
  const [card, setCard] = useState("summary_large_image");
  const [copied, setCopied] = useState(false);

  const html = buildMetaHtml(title, description, url, image, type, siteName, card);
  const titleOk = title.length <= 60;
  const descOk = description.length <= 160;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  const inputCls =
    "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Google preview */}
      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">GOOGLE PREVIEW</div>
        <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3">
          <div className="text-xs text-ink/50 truncate">
            {url.replace(/^https?:\/\//, "").split("/")[0] || "yoursite.com"}
          </div>
          <div className="text-lg text-[#1a0dab] leading-snug hover:underline truncate">
            {title || "Your title here"}
          </div>
          <div className="text-sm text-ink/70 line-clamp-2">
            {description || "Your meta description appears here."}
          </div>
        </div>
      </div>

      {/* Social preview */}
      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">SOCIAL SHARE PREVIEW</div>
        <div className="bg-paper border border-ink/10 rounded-lg overflow-hidden">
          {image.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full h-36 object-cover" />
          ) : (
            <div className="w-full h-36 bg-gradient-to-r from-accent/40 to-accent/10 flex items-center justify-center font-mono text-xs text-ink/40">
              NO IMAGE SET
            </div>
          )}
          <div className="px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-ink/50 truncate">
              {siteName || "yoursite.com"}
            </div>
            <div className="text-sm font-semibold text-ink leading-snug truncate">{title}</div>
            <div className="text-xs text-ink/60 line-clamp-2">{description}</div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="mt-title" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            TITLE{" "}
            <span className={titleOk ? "text-ink/40" : "text-red-500"}>
              ({title.length}/60 {titleOk ? "✓" : "too long!"})
            </span>
          </label>
          <input id="mt-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mt-desc" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            DESCRIPTION{" "}
            <span className={descOk ? "text-ink/40" : "text-red-500"}>
              ({description.length}/160 {descOk ? "✓" : "too long!"})
            </span>
          </label>
          <textarea id="mt-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mt-url" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            PAGE URL
          </label>
          <input id="mt-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mt-img" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            IMAGE URL (FOR SHARING)
          </label>
          <input id="mt-img" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…/cover.jpg" className={inputCls} />
        </div>
        <div>
          <label htmlFor="mt-type" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            PAGE TYPE
          </label>
          <select id="mt-type" value={type} onChange={(e) => setType(e.target.value as DocType)} className={inputCls + " bg-white"}>
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
          </select>
        </div>
        <div>
          <label htmlFor="mt-site" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
            SITE NAME
          </label>
          <input id="mt-site" type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <div className="font-mono text-xs tracking-widest text-ink/60 block mb-2">META TAGS HTML</div>
        <div className="relative">
          <textarea readOnly value={html} rows={10} className="w-full border border-ink/15 rounded-lg px-3 py-3 font-mono text-xs text-ink/80 bg-paper focus:outline-none resize-y" />
          <button
            type="button"
            onClick={copy}
            className="absolute top-2 right-2 bg-deep text-paper font-mono text-xs tracking-widest px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            {copied ? "✓ COPIED" : "📋 COPY"}
          </button>
        </div>
      </div>
    </div>
  );
}
