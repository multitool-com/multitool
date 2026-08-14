import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "PDF Protect (Password) - Free Online Tool | MultiTool",
  description: "Encrypt a PDF with a password so only people with the password can open it.",
  keywords: ['protect pdf', 'password protect pdf', 'pdf password', 'encrypt pdf'],
  alternates: {
    canonical: "https://multitoolbox.online/tools/pdf-tools/pdf-protect",
  },
  openGraph: {
    title: "PDF Protect (Password) | MultiTool",
    description: "Encrypt a PDF with a password so only people with the password can open it.",
    url: "https://multitoolbox.online/tools/pdf-tools/pdf-protect",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Protect (Password) | MultiTool",
    description: "Encrypt a PDF with a password so only people with the password can open it.",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="PDF Protect (Password)"
      description="Encrypt a PDF with a password so only people with the password can open it."
      categoryName="PDF Tools"
      categorySlug="pdf-tools"
      toolSlug="pdf-protect"
    />
  );
}
