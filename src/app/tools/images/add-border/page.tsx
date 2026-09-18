import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AddBorderClient from "./AddBorderClient";

export const metadata: Metadata = {
  title: "Add Border to Image Online - Frames & Polaroid | MultiTool",
  description:
    "Add borders to photos: solid color frames, double frames or polaroid-style layouts with adjustable width and color. Free, private, runs in your browser.",
  keywords: [
    "add border to image",
    "photo border online",
    "image frame",
    "polaroid frame online",
    "add white border to photo",
    "picture frame maker",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/add-border",
  },
  openGraph: {
    title: "Add Border to Image Online | MultiTool",
    description: "Solid, double or polaroid frames — free, private, no upload.",
    url: "https://www.multitoolbox.online/tools/images/add-border",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Border to Image",
    description: "Solid, double or polaroid frames — in your browser.",
  },
};

export default function AddBorderPage() {
  return (
    <ToolLayout
      title="Add Image Border"
      description="Frame your photos with solid borders, elegant double frames or the classic polaroid look — custom width, color and live preview."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="add-border"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Frames that make photos look intentional
          </h2>
          <p className="mb-4">
            A border does two quiet jobs: it <strong>separates the photo from
            the background</strong> (essential on white pages and light
            feeds) and it <strong>signals care</strong> — the same image,
            framed, reads as prepared rather than pasted.
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Solid frame:</strong> the workhorse. White borders make photos pop on dark backgrounds; black adds gallery seriousness; brand colors tie product shots together.</li>
            <li><strong>Double frame:</strong> a thin inner line plus a wider outer band — the classic museum-mat look that flatters portraits and artwork.</li>
            <li><strong>Polaroid:</strong> equal borders on three sides, a thicker band at the bottom — instant nostalgia, and the bottom strip is writable space in any editor afterwards.</li>
            <li><strong>Width guide:</strong> 2–4% of the image width reads as tasteful; beyond 8% the frame competes with the photo. Polaroid mode handles its own proportions.</li>
            <li><strong>Print note:</strong> adding a border changes total dimensions — check the final pixel size if the destination has strict limits (our Image Resizer is next door).</li>
          </ul>
          <p className="mb-4">
            Common uses: Instagram white-frame aesthetic, product photos for
            marketplaces, framed certificates, consistent look across a
            portfolio grid, and printed photos with margins.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The frame is drawn locally with the browser canvas. Your image is{" "}
            <strong>never uploaded to any server</strong> and never stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I add a white border to a photo?",
          answer:
            "Select your image, choose 'Solid' style, set the color to white, adjust the width slider and download. White borders are the classic look for photos that will sit on colored or dark backgrounds.",
        },
        {
          question: "How do I make a polaroid frame online?",
          answer:
            "Choose the 'Polaroid' style — it automatically applies even borders on three sides and the signature thicker band at the bottom. Pick a warm white for the authentic look.",
        },
        {
          question: "What border width should I use?",
          answer:
            "As a rule of thumb, 2–4% of your image's width looks refined (a 1000px photo gets a 20–40px border). Use the live preview — when the frame starts competing with the photo, you have gone too far.",
        },
        {
          question: "Does adding a border change the file size?",
          answer:
            "Slightly — the canvas grows by the border, so there are more pixels to encode. It is rarely noticeable; if size matters, follow up with the Image Compressor.",
        },
        {
          question: "Can I add a border with transparency?",
          answer:
            "Yes — pick PNG export and the 'transparent' color option: the frame area becomes see-through, useful for overlaying photos on designed backgrounds.",
        },
        {
          question: "How do I make all photos in a grid look uniform?",
          answer:
            "Apply the same style, width and color to every image (same sliders per file). Identical frames make photos of different tones read as one deliberate set.",
        },
      ]}
      relatedTools={[
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
        { name: "Grayscale Image", href: "/tools/images/grayscale-image" },
        { name: "Rotate & Flip Image", href: "/tools/images/rotate-flip-image" },
        { name: "Image Compressor", href: "/tools/images/image-compressor" },
      ]}
    >
      <AddBorderClient />
    </ToolLayout>
  );
}
