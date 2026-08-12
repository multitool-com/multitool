import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import QRCodeGeneratorClient from "./QRCodeGeneratorClient";

export const metadata: Metadata = {
  title: "QR Code Generator - Free Online QR Maker | MultiTool",
  description:
    "Create QR codes for URLs, text, phone numbers, Wi-Fi and more. Free online QR code generator with custom colors and instant PNG download.",
  keywords: [
    "qr code generator",
    "qr code maker",
    "free qr code",
    "custom qr code",
    "wifi qr code",
    "url qr code",
    "qr generator online",
    "download qr code",
  ],
  alternates: {
    canonical: "https://multitool.online/tools/generators/qr-code-generator",
  },
  openGraph: {
    title: "QR Code Generator - Free Online QR Maker | MultiTool",
    description:
      "Create QR codes for URLs, text, Wi-Fi and more. Custom colors, instant PNG download, 100% free.",
    url: "https://multitool.online/tools/generators/qr-code-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator - Free Online QR Maker",
    description:
      "Create QR codes for URLs, text, Wi-Fi and more. Custom colors, instant PNG download.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create QR codes for URLs, text, phone numbers, emails, Wi-Fi credentials and more. Customize colors and download as PNG — 100% free."
      categoryName="Generators & Fun"
      categorySlug="generators"
      toolSlug="qr-code-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            What is a QR code?
          </h2>
          <p className="mb-4">
            A <strong>QR code</strong> (Quick Response code) is a two-dimensional
            barcode that can store various types of information — a URL, plain
            text, contact info, Wi-Fi credentials, phone numbers, and more.
            Users scan them with a smartphone camera to instantly access the
            encoded content, without typing anything.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How does a QR code work?
          </h2>
          <p className="mb-4">
            QR codes encode data as a grid of black and white squares. The
            three large squares in the corners help the scanner detect the
            code&apos;s position and orientation. The rest of the pattern
            contains the actual data, plus <strong>error-correction bits</strong>{" "}
            that allow the code to be read even if part of it is damaged or
            obscured (up to 30% depending on the correction level).
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Common use cases
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>URLs / Website links</strong> — the most common use;
              great for menus, business cards, ads
            </li>
            <li>
              <strong>Wi-Fi credentials</strong> — let guests connect
              instantly without typing your password
            </li>
            <li>
              <strong>Contact info (vCard)</strong> — share phone, email and
              address in one scan
            </li>
            <li>
              <strong>Payment info</strong> — used by digital wallets and
              banking apps
            </li>
            <li>
              <strong>Event tickets</strong> — quick check-in at conferences
              and concerts
            </li>
            <li>
              <strong>Product info</strong> — link to manuals, videos or
              support pages
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Error correction levels
          </h2>
          <p className="mb-3">
            QR codes have 4 error correction levels. Higher levels mean the
            code can be scanned even if partially damaged, but make the code
            denser (more squares in the same size):
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Low (L)</strong> — ~7% recovery. Best for clean digital
              use, smallest code.
            </li>
            <li>
              <strong>Medium (M)</strong> — ~15% recovery. Good general-purpose
              default.
            </li>
            <li>
              <strong>Quartile (Q)</strong> — ~25% recovery. Good for printed
              codes.
            </li>
            <li>
              <strong>High (H)</strong> — ~30% recovery. Best for outdoor use
              or codes that might get dirty/damaged.
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Tips for scannable QR codes
          </h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              Keep good <strong>contrast</strong> — dark code on a light
              background works best
            </li>
            <li>
              Don&apos;t invert colors (light code on dark background often
              fails to scan)
            </li>
            <li>
              Print at least <strong>2×2 cm</strong> for close scanning, larger
              for distance
            </li>
            <li>
              Leave <strong>quiet zone</strong> (blank border) around the code
              — do not crop it
            </li>
            <li>
              Test the code with multiple devices before printing at scale
            </li>
          </ul>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            <strong>All QR codes are generated locally in your browser.</strong>{" "}
            Your text, URL or Wi-Fi password is never sent to any server. This
            tool works completely offline once loaded.
          </p>
        </>
      }
      faqs={[
        {
          question: "Are the QR codes I create free to use?",
          answer:
            "Yes, 100% free. There are no watermarks, no tracking pixels, no expiration dates. You own the QR code you generate and can use it commercially without any restrictions.",
        },
        {
          question: "Is my data sent to any server?",
          answer:
            "No. All QR codes are generated entirely in your browser using JavaScript. Your text, URL or Wi-Fi password is never uploaded or stored anywhere. You can verify this by using the tool offline — it will still work.",
        },
        {
          question: "What size should I download the QR code in?",
          answer:
            "For digital use (websites, emails, apps), 256-512 pixels is enough. For printing, use 1024+ pixels to ensure it stays sharp when scaled. For large posters or banners, use the maximum size (1024) and scale as needed.",
        },
        {
          question: "Can I customize the QR code colors?",
          answer:
            "Yes. You can change both the foreground (dark squares) and background colors. Just remember to keep good contrast — dark on light works best. Avoid inverting colors, as many scanners struggle with light codes on dark backgrounds.",
        },
        {
          question: "Do QR codes expire?",
          answer:
            "Static QR codes (like the ones this tool generates) never expire — they contain the data directly in the pattern. They will work as long as QR code scanners exist. Dynamic QR codes from some services can expire, but ours are permanent.",
        },
        {
          question: "How do I create a Wi-Fi QR code?",
          answer:
            "Select 'Wi-Fi' from the type selector, then enter your network name (SSID), password and security type. When someone scans the code, their phone will offer to connect to the network automatically — no typing required.",
        },
      ]}
      relatedTools={[
        { name: "Password Generator", href: "/tools/generators/password-generator" },
        { name: "Random Number Generator", href: "/tools/generators/random-number-generator" },
        { name: "URL Encoder", href: "/tools/developer-tools/url-encoder" },
        { name: "Color Palette", href: "/tools/generators/color-palette" },
      ]}
    >
      <QRCodeGeneratorClient />
    </ToolLayout>
  );
}