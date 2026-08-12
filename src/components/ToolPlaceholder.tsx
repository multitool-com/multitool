import Link from "next/link";
import ToolLayout from "./ToolLayout";

interface Props {
  title: string;
  description: string;
  categoryName: string;
  categorySlug: string;
  toolSlug: string;
}

export default function ToolPlaceholder({
  title,
  description,
  categoryName,
  categorySlug,
  toolSlug,
}: Props) {
  return (
    <ToolLayout
      title={title}
      description={description}
      categoryName={categoryName}
      categorySlug={categorySlug}
      toolSlug={toolSlug}
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-2">
            About this tool
          </h2>
          <p className="mb-4">
            The <strong>{title}</strong> is part of our growing collection of
            free, easy-to-use online utilities. We&apos;re currently putting the
            finishing touches on this tool to make sure it&apos;s fast, accurate
            and works flawlessly across all devices.
          </p>
          <p className="mb-4">
            In the meantime, feel free to explore our other{" "}
            <Link
              href={`/tools/${categorySlug}`}
              className="text-accent hover:underline"
            >
              {categoryName.toLowerCase()} tools
            </Link>{" "}
            that are already available. New tools are added every week — bookmark
            this page and check back soon!
          </p>
        </>
      }
    >
      {/* UI do placeholder */}
      <div className="bg-white border border-ink/10 rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="bg-deep rounded-lg px-6 py-4 mb-6">
          <span className="font-mono text-xs text-paper/50 tracking-widest block mb-1">
            STATUS
          </span>
          <span className="font-mono text-2xl font-semibold text-accent">
            COMING SOON
          </span>
        </div>

        <p className="text-ink/70 mb-2 text-lg">
          🚧 This tool is on its way!
        </p>
        <p className="text-ink/50 text-sm mb-6 max-w-md">
          We&apos;re working hard to bring you the best {title.toLowerCase()}.
          Check back soon or explore other tools below.
        </p>

        <Link
          href={`/tools/${categorySlug}`}
          className="font-mono text-xs tracking-widest bg-deep text-paper hover:bg-accent transition-colors rounded-full px-6 py-3"
        >
          ← BACK TO {categoryName.toUpperCase()}
        </Link>
      </div>
    </ToolLayout>
  );
}