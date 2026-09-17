import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PetBusinessNameGeneratorClient from "./PetBusinessNameGeneratorClient";

export const metadata: Metadata = {
  title: "Pet & Business Name Generator - Creative Ideas | MultiTool",
  description: "Generate creative names for pets (dogs, cats, birds) by theme, and business names by style with your own keyword. One click to copy.",
  keywords: ["pet name generator", "business name generator", "dog name ideas", "company name generator", "brand name generator", "cat name ideas"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/generators/pet-business-name-generator",
  },
  openGraph: {
    title: "Pet & Business Name Generator - Creative Ideas | MultiTool",
    description: "Generate creative names for pets (dogs, cats, birds) by theme, and business names by style with your own keyword. One click to copy.",
    url: "https://www.multitoolbox.online/tools/generators/pet-business-name-generator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet & Business Name Generator - Creative Ideas | MultiTool",
    description: "Generate creative names for pets (dogs, cats, birds) by theme, and business names by style with your own keyword. One click to copy.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Pet & Business Name Generator - Creative Ideas | MultiTool"
      description="DESC"
      categoryName="generators_NAME"
      categorySlug="generators"
      toolSlug="pet-business-name-generator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            For pets: pick the type and a theme (Cute, Food, Nature, Funny or Famous) and get 10 name ideas with fun prefixes. For business: choose a style (Modern, Classic, Playful, Tech, Luxury), optionally add your keyword like pizza, and generate 10 ready-to-use company names.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Anatomy of a memorable brand name
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Two syllables, easy to say:</strong> the names people remember (Google, Nike, Pix) are effortless to pronounce and hard to misspell. If you must spell it on the phone, it is too complicated.</li>
            <li><strong>Evocative beats literal:</strong> “Duke &amp; Duchess Pet Spa” paints a picture; “Very Good Pet Grooming LLC Number 2” describes a filing. Suggest the feeling you sell.</li>
            <li><strong>Check the basics before falling in love:</strong> domain availability, Instagram handle, and a quick web search for existing businesses with the name in your region and niche.</li>
            <li><strong>Say it out loud in a sentence:</strong> “Book me an appointment at ___.” Your name will live inside sentences — some great names die in that test.</li>
            <li><strong>Use the generator as a divergence tool:</strong> generate twenty options; the winner usually appears when you try to argue against the ones you dislike. Naming is taste discovering itself.</li>
          </ul>
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
        { question: "Are the names unique?", answer: "Each generation pulls from a curated list of hundreds of combinations without repeating, and you can generate as many batches as you want." },
        { question: "Can I use a keyword for my business?", answer: "Yes — type any keyword (pizza, studio, pet, tech and more) and the generator builds names around it in the chosen style." },
        { question: "Can I use these names for my real pet?", answer: "Of course — themes cover cute, food, nature, funny and famous names for dogs, cats, birds and small pets." },
        { question: "Are the business names trademark-safe?", answer: "The generator helps you brainstorm, but always search your local trademark registry and domain availability before registering." },
        { question: "How do I copy a name?", answer: "Click or tap any name and it is copied to your clipboard instantly." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Username Generator", href: "/tools/generators/username-generator" },
        { name: "Random Word Generator", href: "/tools/generators/random-word-generator" },
        { name: "Love Calculator", href: "/tools/generators/love-calculator" },
        { name: "Coin Flip", href: "/tools/generators/coin-flip" },
      ]}
    >
      <PetBusinessNameGeneratorClient />
    </ToolLayout>
  );
}
