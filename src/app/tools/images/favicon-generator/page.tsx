import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FaviconGeneratorClient from "./FaviconGeneratorClient";

export const metadata: Metadata = {
  title: "Favicon Generator - Text, Emoji or Image | MultiTool",
  description: "Create a favicon from text, an emoji or your own image, and download every size you need: 16, 32, 48, 180, 192 and 512 px.",
  keywords: ["favicon generator", "favicon maker", "icon generator", "favicon from text", "site icon generator", "favicon emoji"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/images/favicon-generator",
  },
  openGraph: {
    title: "Favicon Generator - Text, Emoji or Image | MultiTool",
    description: "Create a favicon from text, an emoji or your own image, and download every size you need: 16, 32, 48, 180, 192 and 512 px.",
    url: "https://multitoolbox.online/tools/images/favicon-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Favicon Generator - Text, Emoji or Image | MultiTool",
    description: "Create a favicon from text, an emoji or your own image, and download every size you need: 16, 32, 48, 180, 192 and 512 px.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Favicon Generator - Text, Emoji or Image | MultiTool"
      description="DESC"
      categoryName="images_NAME"
      categorySlug="images"
      toolSlug="favicon-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type a letter or emoji (or upload an image), pick background and text colors and the shape — square, rounded or circle. The tool renders your icon at every standard size and lets you download each one as a PNG.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Everything runs entirely in your browser. Nothing you type is
            ever sent to any server or stored.
          </p>
        </>
      }
      faqs={[
        { question: "What is a favicon?", answer: "The small icon shown in browser tabs, bookmarks and mobile home screens. It is usually a 16x16 or 32x32 PNG file." },
        { question: "Which sizes do I need?", answer: "At least 32x32 for browser tabs and 180x180 for Apple touch icons. Downloading all six sizes covers every device." },
        { question: "How do I install it on my site?", answer: "Place the PNG files in your public folder and add a link rel icon pointing to the 32x32 file in your page head. Next.js sites can also use the app favicon convention." },
        { question: "Can I use an emoji?", answer: "Yes — emojis render beautifully as favicons since they are drawn with the system emoji font." },
        { question: "Can I upload my logo?", answer: "Yes — switch to Image mode and upload a square logo. It is centered and cropped automatically." },
        { question: "Is it free?", answer: "Yes, completely free, and images never leave your browser." },
      ]}
      relatedTools={[
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
        { name: "JPG PNG WEBP Converter", href: "/tools/images/jpg-png-webp-converter" },
        { name: "Image to Base64", href: "/tools/images/image-to-base64" },
        { name: "QR Code Generator", href: "/tools/generators/qr-code-generator" },
      ]}
    >
      <FaviconGeneratorClient />
    </ToolLayout>
  );
}
