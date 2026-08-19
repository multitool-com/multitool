import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PregnancyDueDateClient from "./PregnancyDueDateClient";

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator - from LMP | MultiTool",
  description: "Estimate your due date, current pregnancy week and trimester from the first day of your last period. Free, private, no sign-up.",
  keywords: ["pregnancy due date calculator", "due date from lmp", "pregnancy week calculator", "edd calculator", "data provavel do parto"],
  alternates: {
    canonical: "https://multitoolbox.online/tools/health/pregnancy-due-date",
  },
  openGraph: {
    title: "Pregnancy Due Date Calculator - from LMP | MultiTool",
    description: "Estimate your due date, current pregnancy week and trimester from the first day of your last period. Free, private, no sign-up.",
    url: "https://multitoolbox.online/tools/health/pregnancy-due-date",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pregnancy Due Date Calculator - from LMP | MultiTool",
    description: "Estimate your due date, current pregnancy week and trimester from the first day of your last period. Free, private, no sign-up.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Pregnancy Due Date Calculator - from LMP | MultiTool"
      description="Estimate your due date, current pregnancy week and trimester from the first day of your last period. Free, private, no sign-up."
      categoryName="health_NAME"
      categorySlug="health"
      toolSlug="pregnancy-due-date"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Enter the first day of your last menstrual period (LMP). The tool applies Naegele's rule — LMP plus 280 days — to estimate the due date, then shows your current week, trimester and conception window.
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
        { question: "How is the due date calculated?", answer: "With Naegele's rule: add 280 days (40 weeks) to the first day of your last menstrual period. It is the standard clinical estimate." },
        { question: "How accurate is it?", answer: "Only about 5% of babies arrive exactly on the due date — most are born within two weeks of it. Treat it as a guide." },
        { question: "When is the conception date?", answer: "Conception typically happens around 14 days after the LMP, which the tool shows as a reference." },
        { question: "How is the current week calculated?", answer: "The tool counts full weeks since the LMP. Pregnancy is measured this way even before conception." },
        { question: "What are the trimesters?", answer: "First trimester: weeks 1-13. Second: weeks 14-26. Third: weeks 27-40." },
        { question: "Is it free?", answer: "Yes, completely free, and the calculation happens on your device." },
      ]}
      relatedTools={[
        { name: "BMI Calculator", href: "/tools/health/bmi-calculator" },
        { name: "Age Calculator", href: "/tools/health/age-calculator" },
        { name: "Calorie / BMR Calculator", href: "/tools/health/calorie-calculator" },
        { name: "Ideal Weight Calculator", href: "/tools/health/ideal-weight" },
      ]}
    >
      <PregnancyDueDateClient />
    </ToolLayout>
  );
}
