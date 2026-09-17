import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TimezoneConverterClient from "./TimezoneConverterClient";

export const metadata: Metadata = {
  title: "Time Zone Converter - World Clock | MultiTool",
  description: "Convert times between 17 world time zones with automatic daylight saving handling. Perfect for meetings across countries.",
  keywords: ["time zone converter", "world clock", "time converter", "meeting time", "utc to local", "fuso horario"],
  alternates: {
    canonical: "https://www.multitoolbox.online/tools/converters/timezone-converter",
  },
  openGraph: {
    title: "Time Zone Converter - World Clock | MultiTool",
    description: "Convert times between 17 world time zones with automatic daylight saving handling. Perfect for meetings across countries.",
    url: "https://www.multitoolbox.online/tools/converters/timezone-converter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Zone Converter - World Clock | MultiTool",
    description: "Convert times between 17 world time zones with automatic daylight saving handling. Perfect for meetings across countries.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="H1_Time Zone Converter - World Clock | MultiTool"
      description="Convert times between 17 world time zones with automatic daylight saving handling. Perfect for meetings across countries."
      categoryName="converters_NAME"
      categorySlug="converters"
      toolSlug="timezone-converter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How it works
          </h2>
          <p className="mb-4">
            Pick the date and time, choose the source and target zones from 17 major cities (New York, London, Sao Paulo, Tokyo and more), and see both times instantly. Daylight saving is handled automatically by the browser.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Time zones: the rules nobody memorizes
          </h2>
          <ul className="mb-4 list-disc pl-5 space-y-1.5">
            <li><strong>Offsets are not fixed:</strong> most zones shift with daylight saving time, so “New York = UTC−5” is only true half the year (−4 in summer). A converter that knows the date — like this one — spares you the classic scheduling mistake.</li>
            <li><strong>Meeting math:</strong> the safe window for global calls is roughly 13:00–17:00 UTC (morning in the Americas, late afternoon in Europe, evening in Asia). Outside that, someone is asleep.</li>
            <li><strong>The confusing pairs:</strong> India is UTC+5:30 (half-hour offset), Nepal +5:45, Australia has zones with :30 and :45 — the world is not neatly hourly.</li>
            <li><strong>UTC vs GMT:</strong> practically the same clock; UTC is the modern standard (no timezone, no daylight saving). Servers, logs and aviation run on it.</li>
            <li><strong>Golden rule for events:</strong> always announce the time zone explicitly (“15:00 BRT / 18:00 UTC”) — and remember Brazil abolished daylight saving in 2019, while Europe and the US still observe it.</li>
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
        { question: "How does DST work here?", answer: "The tool uses the browser's built-in time zone database, so daylight saving offsets are applied automatically and correctly." },
        { question: "Which zones are included?", answer: "17 zones: UTC, US (PT, MT, CT, ET), Sao Paulo, London, Lisbon, Paris, Moscow, Dubai, Mumbai, Beijing, Tokyo, Seoul, Sydney and Auckland." },
        { question: "Why do I get a time difference I didn't expect?", answer: "Because of DST, offsets change twice a year in many zones. The tool shows the current UTC offset for each zone." },
        { question: "Can I convert any date, not just today?", answer: "Yes — pick any date and time with the date picker." },
        { question: "Is this accurate?", answer: "Yes — it uses the same time zone data as your operating system." },
        { question: "Is it free?", answer: "Yes, completely free with no account." },
      ]}
      relatedTools={[
        { name: "Unit Converter", href: "/tools/converters/unit-converter" },
        { name: "Temperature Converter", href: "/tools/converters/temperature-converter" },
        { name: "Currency Converter", href: "/tools/converters/currency-converter" },
        { name: "Roman Numeral Converter", href: "/tools/converters/roman-numeral-converter" },
      ]}
    >
      <TimezoneConverterClient />
    </ToolLayout>
  );
}
