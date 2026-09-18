import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ProfilePicClient from "./ProfilePicClient";

export const metadata: Metadata = {
  title: "Profile Picture Maker - Circle Avatar Crop Online | MultiTool",
  description:
    "Create polished profile pictures: circular or square crops with zoom control, exported at the right size for every platform. Free, private, no upload.",
  keywords: [
    "profile picture maker",
    "circle crop photo online",
    "avatar maker",
    "round profile photo",
    "crop picture into circle",
    "pfp maker",
  ],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/images/profile-picture-maker",
  },
  openGraph: {
    title: "Profile Picture Maker - Circle Avatar Crop | MultiTool",
    description: "Circle or square avatars with zoom — free, private, no upload.",
    url: "https://www.multitoolbox.online/tools/images/profile-picture-maker",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile Picture Maker",
    description: "Circle or square avatar crops — in your browser.",
  },
};

export default function ProfilePicPage() {
  return (
    <ToolLayout
      title="Profile Picture Maker"
      description="Turn any photo into a polished profile picture — circular or square, with zoom and position control, exported at 512px: the size every platform accepts."
      categoryName="Image Tools"
      categorySlug="images"
      toolSlug="profile-picture-maker"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            Why avatars deserve their own tool
          </h2>
          <p className="mb-4">
            A profile picture is your face at <strong>40 pixels</strong> —
            displayed beside every comment you ever write. At that size,
            different rules apply:
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Fill the frame:</strong> head and shoulders, not the full body. Faces at less than half the circle become unreadable dots in comment threads.</li>
            <li><strong>Eyes slightly above center:</strong> the natural portrait framing that reads as confident; the zoom control makes the alignment surgical.</li>
            <li><strong>Square or circle:</strong> platforms mask squares into circles themselves — but exporting a real circle (with transparency) guarantees the exact crop you approved, with no surprises in apps that use squares.</li>
            <li><strong>512×512 is the universal size:</strong> large enough for retina displays and every platform's maximum, small enough to upload instantly everywhere.</li>
            <li><strong>Contrast with backgrounds:</strong> a face against a busy background disappears at thumbnail size — zoom in tighter and let the background blur do the separation.</li>
          </ul>
          <p className="mb-4">
            Use cases: professional LinkedIn headshots, consistent team
            avatars, gaming and community profiles, and the annual
            &quot;update my photo everywhere&quot; ritual — one crop, every
            platform.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The crop is rendered locally with the browser canvas. Your photo
            is <strong>never uploaded to any server</strong> and never
            stored.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I make my photo into a circle?",
          answer:
            "Select your photo, keep 'Circle' shape, zoom and position until the framing is right, and download. The PNG exports at 512×512 with transparent corners — the exact circle you approved.",
        },
        {
          question: "What size should a profile picture be?",
          answer:
            "512×512 pixels covers every major platform — larger than most display sizes (so it stays sharp on retina) and within every upload limit. This tool exports exactly that.",
        },
        {
          question: "Circle or square — which should I export?",
          answer:
            "Circle if the platform shows circles (WhatsApp, Instagram, Discord) or if you want the crop guaranteed exactly as you set it. Square if the platform crops its own way (LinkedIn, Facebook pages) — you keep full control of the framing.",
        },
        {
          question: "How do I look professional in a small avatar?",
          answer:
            "Zoom until head and shoulders fill the frame, keep eyes slightly above the middle, plain-ish background, and face the light. Details vanish at thumbnail size — framing and contrast are what survive.",
        },
        {
          question: "Can I make a logo avatar instead of a face?",
          answer:
            "Absolutely — the same framing logic applies to logos: zoom until the mark fills the circle, leaving small margins so it doesn't touch the edges.",
        },
        {
          question: "Does the circle export have transparency?",
          answer:
            "Yes — PNG with a transparent background outside the circle, so it sits cleanly on any app theme, light or dark.",
        },
      ]}
      relatedTools={[
        { name: "Image Cropper", href: "/tools/images/image-cropper" },
        { name: "Image Resizer", href: "/tools/images/image-resizer" },
        { name: "Grayscale Image", href: "/tools/images/grayscale-image" },
        { name: "Add Image Border", href: "/tools/images/add-border" },
      ]}
    >
      <ProfilePicClient />
    </ToolLayout>
  );
}
