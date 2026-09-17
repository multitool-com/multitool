import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import HashtagGeneratorClient from "./HashtagGeneratorClient";

export const metadata: Metadata = {
  title: "Hashtag Generator - Free Hashtags for Social Media | MultiTool",
  description: "Generate 3-30 relevant hashtags from any topic: phrase tags, per-word tags, bigrams and trending variants. One click to copy all.",
  keywords: ["hashtag generator", "hashtags for instagram", "hashtag ideas", "social media hashtags", "gerador de hashtags"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/text-tools/hashtag-generator",
  },
  openGraph: {
    title: "Hashtag Generator - Free Hashtags for Social Media | MultiTool",
    description: "Generate 3-30 relevant hashtags from any topic: phrase tags, per-word tags, bigrams and trending variants. One click to copy all.",
    url: "https://www.multitoolbox.online/tools/text-tools/hashtag-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hashtag Generator - Free Hashtags for Social Media | MultiTool",
    description: "Generate 3-30 relevant hashtags from any topic: phrase tags, per-word tags, bigrams and trending variants. One click to copy all.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Hashtag Generator - Free Hashtags for Social Media | MultiTool"
      description="Generate 3-30 relevant hashtags from any topic: phrase tags, per-word tags, bigrams and trending variants. One click to copy all."
      categoryName="text-tools_NAME"
      categorySlug="text-tools"
      toolSlug="hashtag-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Type a topic or phrase, choose how many hashtags (3-30) and generate. The tool builds phrase tags, individual word tags, bigrams and common suffixes, removing stop words automatically.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How hashtags actually work in 2026
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>They are search, not decoration:</strong> platforms index hashtags — a good tag puts your post in front of people searching that topic. A bad tag does nothing.</li>
            <li><strong>Fewer, bigger, relevant:</strong> the trend of the last years favors 3–5 targeted tags over 30 desperate ones. Reach comes from relevance, not volume.</li>
            <li><strong>Mix sizes:</strong> combine one broad tag (millions of posts) with niche ones (thousands). Broad gives you a chance at reach; niche is where you can actually rank in “Top”.</li>
            <li><strong>CamelCase for accessibility:</strong> #DigitalMarketing is read correctly by screen readers; #digitalmarketing comes out as gibberish. Same tag, better manners.</li>
            <li><strong>Never copy-paste the same block</strong> on every post — platforms downrank accounts whose tags never match their content.</li>
          </ul>
          <p className="mb-4">
            The generator builds tags from your topic with these rules
            baked in: lowercase slugs, no spaces or special characters,
            ready-to-paste blocks per platform.
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
        { question: "How does the generator pick hashtags?", answer: "It cleans your phrase (removes stop words and accents), then builds the phrase as one tag, each meaningful word as a tag, word pairs, and popular suffixes." },
        { question: "Which social networks do they work on?", answer: "Instagram, TikTok, X (Twitter), Facebook, LinkedIn and YouTube all support hashtags." },
        { question: "How many hashtags should I use?", answer: "Instagram supports up to 30; 5-15 relevant tags usually perform best. The tool lets you choose 3-30." },
        { question: "Why are stop words removed?", answer: "Words like 'the' and 'and' add no search value and make ugly tags." },
        { question: "Can I copy all at once?", answer: "Yes — Copy All puts every tag in your clipboard, space-separated." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Emoji Copy-Paste", href: "/tools/text-tools/emoji-copy-paste" },
        { name: "Fancy Text Generator", href: "/tools/text-tools/fancy-text-generator" },
        { name: "Text Case Converter", href: "/tools/text-tools/text-case-converter" },
        { name: "Keyword Density Checker", href: "/tools/text-tools/keyword-density" },
      ]}
    >
      <HashtagGeneratorClient />
    </ToolLayout>
  );
}
