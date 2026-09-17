import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GeometryCalculatorClient from "./GeometryCalculatorClient";

export const metadata: Metadata = {
  title: "Geometry Calculator - Area & Perimeter | MultiTool",
  description: "Calculate the area and perimeter of squares, rectangles, triangles, circles and trapezoids in seconds. Free and precise.",
  keywords: ["geometry calculator", "area calculator", "perimeter calculator", "circle area", "triangle area", "trapezoid area"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/math/geometry-calculator",
  },
  openGraph: {
    title: "Geometry Calculator - Area & Perimeter | MultiTool",
    description: "Calculate the area and perimeter of squares, rectangles, triangles, circles and trapezoids in seconds. Free and precise.",
    url: "https://www.multitoolbox.online/tools/math/geometry-calculator",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Calculator - Area & Perimeter | MultiTool",
    description: "Calculate the area and perimeter of squares, rectangles, triangles, circles and trapezoids in seconds. Free and precise.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Geometry Calculator - Area & Perimeter | MultiTool"
      description="Calculate the area and perimeter of squares, rectangles, triangles, circles and trapezoids in seconds. Free and precise."
      categoryName="math_NAME"
      categorySlug="math"
      toolSlug="geometry-calculator"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick a shape (square, rectangle, triangle, circle or trapezoid), enter its dimensions and get the area and perimeter instantly with correct units.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Formulas you will actually use
          </h2>
          <p className="mb-4">
            Geometry questions in real life are usually one of three:
            <strong> how much surface</strong> (area — paint, flooring,
            grass), <strong>how much border</strong> (perimeter — fences,
            trim, baseboards) or <strong>how much volume</strong> (boxes,
            tanks, concrete).
          </p>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>The classic trap — radius vs diameter:</strong> half of all geometry errors are using the diameter where the radius belongs. Double-check which one your tape measure gave you before trusting any circle formula.</li>
            <li><strong>Paint math:</strong> wall area minus doors/windows, divided by the coverage printed on the can (typically ~10 m² or ~350 ft² per liter/gallon per coat) — always budget two coats.</li>
            <li><strong>π is not 3.14 by accident:</strong> the calculator uses full floating-point precision; the rounding to 3.14 is only for humans.</li>
            <li><strong>Composite shapes:</strong> an L-shaped room is two rectangles; a round table with a rectangular leaf is a circle plus a rectangle. Split, compute, add — that is 90% of practical geometry.</li>
          </ul>
          <p className="mb-4">
            The tool covers the essentials — rectangles, circles, triangles
            and friends — with the formulas shown beside the results, so the
            calculator doubles as a reference.
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
        { question: "How is the area of a circle calculated?", answer: "Area = pi x radius squared (πr²). The tool uses pi to 15 decimal places for precision." },
        { question: "How is the area of a triangle calculated?", answer: "Area = (base x height) / 2. The triangle tab also accepts the three sides for perimeter." },
        { question: "What is a trapezoid?", answer: "A four-sided shape with one pair of parallel sides. Area = (base1 + base2) / 2 x height." },
        { question: "What units should I use?", answer: "Any consistent unit — cm, m, feet. The result is in square units for area and units for perimeter." },
        { question: "Can I calculate the perimeter of a circle?", answer: "Yes — the perimeter of a circle is its circumference: 2πr." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Scientific Calculator", href: "/tools/math/scientific-calculator" },
        { name: "Fraction Calculator", href: "/tools/math/fraction-calculator" },
        { name: "Ratio Calculator", href: "/tools/math/ratio-calculator" },
        { name: "Aspect Ratio Calculator", href: "/tools/math/aspect-ratio-calculator" },
      ]}
    >
      <GeometryCalculatorClient />
    </ToolLayout>
  );
}
