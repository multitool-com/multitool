import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ImageToBase64Client from "./ImageToBase64Client";

export const metadata: Metadata = {
  title: "Image to Base64 - Convert Image to Data URI Online | MultiTool",
  description:
    "Free image to Base64 converter. Convert any image to a Base64 data URI for embedding in HTML, CSS or JSON. Choose output quality and format. 100% in your browser.",
  keywords: [
    "image to base64",
    "base64 image",
    "image to base64 converter",
    "data uri",
    "base64 encode image",
    "image encoder",
    "img to base64",
    "base64 data uri",
    "embed image in html",
    "css background base64",
    "base64 image converter",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/images/image-to-base64",
  },
  openGraph: {
    title: "Image to Base64 - Data URI Converter | MultiTool",
    description:
      "Convert any image to a Base64 data URI for HTML, CSS or JSON. Free and private.",
    url: "https://multitoolbox.online/tools/images/image-to-base64",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Base64 - Free & Instant",
    description: "Encode images to Base64 in your browser. No upload.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Image to Base64"
      description="Convert any image into a Base64 data URI you can paste into HTML (img src), CSS (background) or JSON. Optional resize to keep the string small."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="image-to-base64"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a Base64 data URI?
          </h2>
          <p className="mb-4">
            A <strong>data URI</strong> embeds an image directly in text
            instead of a file: it starts with{" "}
            <code className="bg-paper px-1 rounded">
              data:image/png;base64,…
            </code>{" "}
            and contains the whole image encoded. You can put it in an{" "}
            <code className="bg-paper px-1 rounded">{"<img src>"}</code>, a
            CSS <code className="bg-paper px-1 rounded">background-image</code>{" "}
            or a JSON field — no separate file to host.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use this tool
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Drop an image or click “Choose an image”.</li>
            <li>Pick the output format and quality (JPEG/WebP only).</li>
            <li>Optionally set a max width to shrink the string.</li>
            <li>Copy the data URI or download the preview.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Is the data URI the same size as the file?
          </h2>
          <p className="mb-4">
            Base64 adds about <strong>33%</strong> on top of the image bytes.
            A 100&nbsp;KB file becomes roughly a 133&nbsp;KB string. That is
            why this tool lets you <strong>resize</strong> and pick{" "}
            <strong>WebP</strong> — keeping the image small keeps the string
            manageable.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            When should I use it?
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Small icons and logos (under ~10&nbsp;KB) — saves an HTTP
              request.
            </li>
            <li>
              Emails and single-file HTML pages that must work standalone.
            </li>
            <li>
              Sending an image through JSON where a URL is not available.
            </li>
          </ul>
          <p className="mb-4">
            For large photos, a normal file is better — the browser caches
            it, while a huge data URI slows every page load.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The encoding runs entirely in your browser. Your image is{" "}
            <strong>never sent to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is a Base64 data URI?",
          answer:
            "It is a text string that contains the entire image, starting with data:image/png;base64,. Browsers can render it directly in <img src>, CSS background-image and JSON fields, without hosting a file.",
        },
        {
          question: "Is the data URI bigger than the original file?",
          answer:
            "Yes, about 33% bigger: Base64 encodes every 3 bytes as 4 characters. A 100 KB image becomes roughly 133 KB of text, which is why resizing to a smaller width is recommended.",
        },
        {
          question: "Why does the text show only the first characters?",
          answer:
            "Large data URIs are thousands of characters long. The preview shows the beginning so the page stays fast — the full string is copied to your clipboard when you press COPY.",
        },
        {
          question: "When should I NOT use a data URI?",
          answer:
            "For large photos. Files are cached by the browser and load once; a big data URI is parsed on every page load and bloats HTML or CSS. Keep data URIs for small icons and logos.",
        },
        {
          question: "Can I reduce the size of the Base64 string?",
          answer:
            "Yes: resize the image to a smaller max width, choose WebP (usually the smallest format), and lower the quality slider for JPEG/WebP. PNG stays lossless, so it is usually the biggest.",
        },
        {
          question: "Is my image uploaded anywhere?",
          answer:
            "No. Everything runs locally in your browser — the image and the generated Base64 never leave your device.",
        },
      ]}
      relatedTools={[
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "JPG / PNG / WebP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "Color Palette", href: "/tools/generators/color-palette" },
        { name: "QR Code Generator", href: "/tools/generators/qr-code-generator" },
      ]}
    >
      <ImageToBase64Client />
    </ToolLayout>
  );
}
