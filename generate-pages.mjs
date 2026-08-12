// ============================================================================
// SCRIPT GERADOR DE PÁGINAS
// ============================================================================
// Este script gera:
// - Páginas de ferramentas (usando ToolPlaceholder para "coming-soon")
// - Páginas de categoria (agora com leitura dinâmica do src/lib/tools.ts)
//
// PROTEÇÕES:
// - Ferramentas com status "ready" NÃO são sobrescritas
// - Páginas de categoria SEMPRE são regeneradas (são dinâmicas)
//
// Como rodar: node generate-pages.mjs
// ============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, "src", "app", "tools");

const SITE_URL = "https://multitool.online";

// ============================================================================
// DADOS — copiados do src/lib/tools.ts (mantém sincronizado manualmente)
// ============================================================================
// IMPORTANTE: se adicionar uma ferramenta nova, adicione TANTO em
// src/lib/tools.ts quanto aqui, e rode: node generate-pages.mjs

const categories = [
  {
    slug: "finance",
    name: "Finance",
    seoDescription:
      "Free online finance calculators: loan payments, discounts, tips, salary conversions and more. Instant, accurate financial calculations.",
    tools: [
      { slug: "percentage-calculator", name: "Percentage Calculator", description: "Quickly calculate what percentage of a number is. Free, instant results.", keywords: ["percentage calculator", "percent of", "calculate percentage"], status: "ready" },
      { slug: "loan-calculator", name: "Loan / EMI Calculator", description: "Calculate monthly loan payments (EMI), total interest and amortization schedule.", keywords: ["loan calculator", "emi calculator", "mortgage calculator", "monthly payment"], status: "coming-soon" },
      { slug: "discount-calculator", name: "Discount Calculator", description: "Calculate final sale price and total savings from any discount percentage.", keywords: ["discount calculator", "sale price", "percentage off", "savings"], status: "coming-soon" },
      { slug: "tip-calculator", name: "Tip Calculator", description: "Calculate tip amount, total bill and split evenly between people.", keywords: ["tip calculator", "gratuity", "split bill", "restaurant tip"], status: "coming-soon" },
      { slug: "salary-calculator", name: "Salary / Hourly Wage Calculator", description: "Convert between hourly, weekly, monthly and annual salary quickly.", keywords: ["salary calculator", "hourly wage", "annual salary", "pay converter"], status: "coming-soon" },
    ],
  },
  {
    slug: "health",
    name: "Health & Fitness",
    seoDescription:
      "Free health & fitness calculators: BMI, calorie needs, ideal weight, pregnancy due date and age calculator. Instant, science-based results.",
    tools: [
      { slug: "bmi-calculator", name: "BMI Calculator", description: "Calculate your Body Mass Index (BMI) instantly and see your weight category.", keywords: ["bmi calculator", "body mass index", "weight calculator", "healthy weight"], status: "coming-soon" },
      { slug: "age-calculator", name: "Age Calculator", description: "Calculate your exact age in years, months, days, hours and minutes.", keywords: ["age calculator", "how old am i", "date of birth"], status: "ready" },
      { slug: "pregnancy-due-date", name: "Pregnancy Due Date Calculator", description: "Estimate your baby's due date based on your last menstrual period.", keywords: ["pregnancy calculator", "due date", "baby due date", "gestational age"], status: "coming-soon" },
      { slug: "calorie-calculator", name: "Calorie / BMR Calculator", description: "Calculate your daily calorie needs (TDEE) and basal metabolic rate (BMR).", keywords: ["calorie calculator", "bmr calculator", "tdee", "daily calories"], status: "coming-soon" },
      { slug: "ideal-weight", name: "Ideal Weight Calculator", description: "Find your ideal body weight range based on height, age and gender.", keywords: ["ideal weight", "healthy weight calculator", "target weight"], status: "coming-soon" },
    ],
  },
  {
    slug: "math",
    name: "Math & Education",
    seoDescription:
      "Free math calculators: fractions, GPA, percentage change, ratios and geometry. Step-by-step, easy to use tools for students.",
    tools: [
      { slug: "fraction-calculator", name: "Fraction Calculator", description: "Add, subtract, multiply and divide fractions with step-by-step results.", keywords: ["fraction calculator", "add fractions", "simplify fraction"], status: "coming-soon" },
      { slug: "gpa-calculator", name: "GPA Calculator", description: "Calculate your Grade Point Average (GPA) from grades and credit hours.", keywords: ["gpa calculator", "grade point average", "college gpa"], status: "coming-soon" },
      { slug: "percentage-change", name: "Percentage Increase / Decrease", description: "Calculate the percentage change between two numbers (increase or decrease).", keywords: ["percentage change", "percent increase", "percent decrease"], status: "coming-soon" },
      { slug: "ratio-calculator", name: "Ratio Calculator", description: "Simplify ratios, compare and solve proportions instantly.", keywords: ["ratio calculator", "proportion", "simplify ratio"], status: "coming-soon" },
      { slug: "geometry-calculator", name: "Geometry Calculator", description: "Calculate area, perimeter and volume for common geometric shapes.", keywords: ["geometry calculator", "area calculator", "perimeter", "volume"], status: "coming-soon" },
    ],
  },
  {
    slug: "converters",
    name: "Converters",
    seoDescription:
      "Free online converters: units (length, weight, volume), temperature, time zones, number bases and Roman numerals.",
    tools: [
      { slug: "unit-converter", name: "Unit Converter", description: "Convert between length, weight, volume and other common units.", keywords: ["unit converter", "metric converter", "imperial converter"], status: "coming-soon" },
      { slug: "temperature-converter", name: "Temperature Converter", description: "Convert temperatures between Celsius, Fahrenheit and Kelvin.", keywords: ["temperature converter", "celsius to fahrenheit", "kelvin"], status: "coming-soon" },
      { slug: "timezone-converter", name: "Time Zone Converter", description: "Convert times between different time zones around the world.", keywords: ["time zone converter", "world clock", "utc converter"], status: "coming-soon" },
      { slug: "number-base-converter", name: "Number Base Converter", description: "Convert numbers between binary, decimal, hexadecimal and octal.", keywords: ["binary converter", "hex converter", "decimal to binary"], status: "coming-soon" },
      { slug: "roman-numeral-converter", name: "Roman Numeral Converter", description: "Convert Roman numerals to numbers and numbers to Roman numerals.", keywords: ["roman numeral converter", "roman numerals", "roman to number"], status: "coming-soon" },
    ],
  },
  {
    slug: "date-time",
    name: "Date & Time",
    seoDescription:
      "Free date and time tools: date calculator, countdown timer, work days calculator, Unix timestamp converter and days until date.",
    tools: [
      { slug: "date-calculator", name: "Date Calculator", description: "Add or subtract days, weeks, months or years from any date.", keywords: ["date calculator", "date difference", "add days to date"], status: "coming-soon" },
      { slug: "countdown-timer", name: "Countdown Timer", description: "Create a live countdown to any date or event of your choice.", keywords: ["countdown timer", "countdown to date", "event countdown"], status: "coming-soon" },
      { slug: "work-days-calculator", name: "Work Days Calculator", description: "Calculate the number of business days between two dates.", keywords: ["work days calculator", "business days", "working days between dates"], status: "coming-soon" },
      { slug: "unix-timestamp", name: "Unix Timestamp Converter", description: "Convert Unix timestamps to human-readable dates and vice versa.", keywords: ["unix timestamp", "epoch converter", "timestamp to date"], status: "coming-soon" },
      { slug: "days-until-date", name: "Days Until Date", description: "Count how many days remain until a specific future date.", keywords: ["days until", "countdown days", "days remaining"], status: "coming-soon" },
    ],
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    seoDescription:
      "Free text tools: word counter, case converter, Lorem Ipsum generator, text diff checker and URL slug generator.",
    tools: [
      { slug: "word-counter", name: "Word & Character Counter", description: "Count words, characters, sentences and paragraphs in your text.", keywords: ["word counter", "character counter", "text counter"], status: "coming-soon" },
      { slug: "text-case-converter", name: "Text Case Converter", description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.", keywords: ["case converter", "uppercase", "lowercase", "title case"], status: "coming-soon" },
      { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Generate Lorem Ipsum placeholder text — words, sentences or paragraphs.", keywords: ["lorem ipsum", "placeholder text", "dummy text generator"], status: "coming-soon" },
      { slug: "text-diff", name: "Text Diff Checker", description: "Compare two texts side by side and highlight the differences.", keywords: ["text diff", "compare text", "diff checker"], status: "coming-soon" },
      { slug: "slug-generator", name: "Slug Generator", description: "Generate clean, URL-friendly slugs from any text or title.", keywords: ["slug generator", "url slug", "seo slug"], status: "coming-soon" },
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    seoDescription:
      "Free developer tools: JSON formatter, Base64 encoder/decoder, URL encoder, UUID generator and hash generator (MD5, SHA).",
    tools: [
      { slug: "json-formatter", name: "JSON Formatter", description: "Format, validate and beautify JSON data with syntax highlighting.", keywords: ["json formatter", "json validator", "json beautifier"], status: "coming-soon" },
      { slug: "base64-encoder", name: "Base64 Encoder / Decoder", description: "Encode text to Base64 or decode Base64 back to plain text.", keywords: ["base64 encoder", "base64 decoder", "base64 converter"], status: "coming-soon" },
      { slug: "url-encoder", name: "URL Encoder / Decoder", description: "Encode or decode URLs and query strings (percent-encoding).", keywords: ["url encoder", "url decoder", "percent encoding"], status: "coming-soon" },
      { slug: "uuid-generator", name: "UUID Generator", description: "Generate random UUIDs (v4) — one or bulk. Copy with one click.", keywords: ["uuid generator", "guid generator", "uuid v4"], status: "coming-soon" },
      { slug: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.", keywords: ["hash generator", "md5", "sha256", "hash converter"], status: "coming-soon" },
    ],
  },
  {
    slug: "generators",
    name: "Generators & Fun",
    seoDescription:
      "Free generators: strong password generator, random numbers, QR codes, color palettes and dice roller.",
    tools: [
      { slug: "password-generator", name: "Password Generator", description: "Generate strong, secure random passwords with customizable options.", keywords: ["password generator", "strong password", "secure password"], status: "coming-soon" },
      { slug: "random-number-generator", name: "Random Number Generator", description: "Generate random numbers within any range you specify.", keywords: ["random number generator", "rng", "random integer"], status: "coming-soon" },
      { slug: "qr-code-generator", name: "QR Code Generator", description: "Create QR codes for any text, URL, phone or Wi-Fi credentials.", keywords: ["qr code generator", "qr code maker", "free qr code"], status: "coming-soon" },
      { slug: "color-palette", name: "Color Palette / HEX-RGB", description: "Convert colors between HEX, RGB, HSL and generate palettes.", keywords: ["color converter", "hex to rgb", "color palette generator"], status: "coming-soon" },
      { slug: "dice-roller", name: "Dice Roller", description: "Roll virtual dice of any size — D4, D6, D8, D10, D12, D20 and more.", keywords: ["dice roller", "virtual dice", "d20 roller"], status: "coming-soon" },
    ],
  },
];

// ============================================================================
// TEMPLATES
// ============================================================================

function escapeString(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'");
}

function toolPageTemplate(tool, category) {
  const canonicalUrl = `${SITE_URL}/tools/${category.slug}/${tool.slug}`;
  const keywordsStr = tool.keywords.map((k) => `"${escapeString(k)}"`).join(", ");

  return `import type { Metadata } from "next";
import ToolPlaceholder from "@/components/ToolPlaceholder";

export const metadata: Metadata = {
  title: "${escapeString(tool.name)} - Free Online Tool | MultiTool",
  description: "${escapeString(tool.description)}",
  keywords: [${keywordsStr}],
  alternates: {
    canonical: "${canonicalUrl}",
  },
  openGraph: {
    title: "${escapeString(tool.name)} | MultiTool",
    description: "${escapeString(tool.description)}",
    url: "${canonicalUrl}",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "${escapeString(tool.name)} | MultiTool",
    description: "${escapeString(tool.description)}",
  },
};

export default function Page() {
  return (
    <ToolPlaceholder
      title="${escapeString(tool.name)}"
      description="${escapeString(tool.description)}"
      categoryName="${escapeString(category.name)}"
      categorySlug="${category.slug}"
      toolSlug="${tool.slug}"
    />
  );
}
`;
}

// NOVO: template dinâmico da página de categoria
// (lê os dados do src/lib/tools.ts em runtime, não hardcoded)
function categoryPageTemplate(categorySlug) {
  return `import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, SITE_CONFIG } from "@/lib/tools";
import { notFound } from "next/navigation";

const CATEGORY_SLUG = "${categorySlug}";

const category = getCategoryBySlug(CATEGORY_SLUG);

export const metadata: Metadata = category
  ? {
      title: \`\${category.name} Tools - Free Online Calculators | MultiTool\`,
      description: category.seoDescription,
      alternates: {
        canonical: \`\${SITE_CONFIG.url}/tools/\${category.slug}\`,
      },
      openGraph: {
        title: \`\${category.name} Tools | MultiTool\`,
        description: category.seoDescription,
        url: \`\${SITE_CONFIG.url}/tools/\${category.slug}\`,
        siteName: "MultiTool",
        type: "website",
        locale: "en_US",
      },
    }
  : {};

export default function CategoryPage() {
  if (!category) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs tracking-widest text-ink/50 mb-4"
      >
        <Link href="/" className="hover:text-accent transition-colors">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-accent">{category.name.toUpperCase()}</span>
      </nav>

      {/* Header */}
      <p className="font-mono text-xs tracking-widest text-accent mb-2">
        CATEGORY
      </p>
      <h1 className="font-display text-4xl font-bold mb-3">
        {category.name} Tools
      </h1>
      <p className="text-ink/60 mb-10 max-w-2xl text-lg">
        {category.seoDescription}
      </p>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.tools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={\`/tools/\${category.slug}/\${tool.slug}\`}
            className="group bg-white border border-ink/10 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all relative"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-xs text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              {tool.status === "coming-soon" && (
                <span className="font-mono text-[10px] tracking-widest bg-ink/5 text-ink/50 rounded-full px-2 py-1">
                  SOON
                </span>
              )}
              {tool.status === "ready" && (
                <span className="font-mono text-[10px] tracking-widest bg-accent/10 text-accent rounded-full px-2 py-1">
                  READY
                </span>
              )}
            </div>
            <h2 className="font-display font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
              {tool.name}
            </h2>
            <p className="text-sm text-ink/60">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
`;
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let stats = {
  toolsCreated: 0,
  toolsSkipped: 0,
  categoriesUpdated: 0,
};

console.log("\n🚀 Generating pages...\n");

categories.forEach((category) => {
  const catDir = path.join(TOOLS_DIR, category.slug);
  ensureDir(catDir);

  // Página da categoria — SEMPRE regenera (agora é dinâmica)
  const catPagePath = path.join(catDir, "page.tsx");
  fs.writeFileSync(catPagePath, categoryPageTemplate(category.slug));
  console.log(`📂 Category (dynamic): /tools/${category.slug}`);
  stats.categoriesUpdated++;

  // Páginas das ferramentas
  category.tools.forEach((tool) => {
    const toolDir = path.join(catDir, tool.slug);
    ensureDir(toolDir);
    const toolPagePath = path.join(toolDir, "page.tsx");

    // Protege ferramentas com status "ready" (não sobrescreve)
    if (tool.status === "ready" && fs.existsSync(toolPagePath)) {
      console.log(`   ⏭️  Skipped (ready): ${tool.slug}`);
      stats.toolsSkipped++;
      return;
    }

    fs.writeFileSync(toolPagePath, toolPageTemplate(tool, category));
    console.log(`   ✅ Tool: ${tool.slug}`);
    stats.toolsCreated++;
  });
});

console.log("\n" + "=".repeat(50));
console.log(`🎉 Done!`);
console.log(`   Categories updated (dynamic): ${stats.categoriesUpdated}`);
console.log(`   Tools created: ${stats.toolsCreated}`);
console.log(`   Tools skipped (already ready): ${stats.toolsSkipped}`);
console.log("=".repeat(50) + "\n");