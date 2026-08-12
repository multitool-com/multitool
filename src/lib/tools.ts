// ============================================================================
// REGISTRO CENTRAL DE FERRAMENTAS
// ============================================================================
// Este é o único lugar onde você adiciona/edita ferramentas.
// A home, menu, sitemap, páginas de categoria — tudo lê daqui.
// Para adicionar uma nova ferramenta: adicione um objeto no array `tools`
// da categoria correspondente e defina `status: "ready"` quando estiver pronta.
// ============================================================================

export type ToolStatus = "ready" | "coming-soon";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  status: ToolStatus;
}

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  seoDescription: string;
  tools: Tool[];
}

export const SITE_CONFIG = {
  name: "MultiTool",
  domain: "multitoolbox.online",
  url: "https://multitoolbox.online",
  description:
    "Free online tools: calculators, converters, generators and utilities for everyday use. Fast, simple, no sign-up required.",
  email: "multitool.com@gmail.com",
  author: "MultiTool",
  locale: "en_US",
  twitterHandle: "@multitool",
};

export const categories: Category[] = [
  {
    slug: "finance",
    name: "Finance",
    shortName: "Finance",
    description: "Loans, interest, discounts, tips and taxes.",
    seoDescription:
      "Free online finance calculators: loan payments, discounts, tips, salary conversions and more. Instant, accurate financial calculations.",
    tools: [
      {
        slug: "percentage-calculator",
        name: "Percentage Calculator",
        description:
          "Quickly calculate what percentage of a number is. Free, instant results.",
        keywords: [
          "percentage calculator",
          "percent of",
          "calculate percentage",
        ],
        status: "ready",
      },
      {
        slug: "loan-calculator",
        name: "Loan / EMI Calculator",
        description:
          "Calculate monthly loan payments (EMI), total interest and amortization schedule.",
        keywords: [
          "loan calculator",
          "emi calculator",
          "mortgage calculator",
          "monthly payment",
        ],
        status: "ready",
      },
      {
        slug: "discount-calculator",
        name: "Discount Calculator",
        description:
          "Calculate final sale price and total savings from any discount percentage.",
        keywords: [
          "discount calculator",
          "sale price",
          "percentage off",
          "savings",
        ],
        status: "ready",
      },
      {
        slug: "tip-calculator",
        name: "Tip Calculator",
        description:
          "Calculate tip amount, total bill and split evenly between people.",
        keywords: ["tip calculator", "gratuity", "split bill", "restaurant tip"],
        status: "ready",
      },
      {
        slug: "salary-calculator",
        name: "Salary / Hourly Wage Calculator",
        description:
          "Convert between hourly, weekly, monthly and annual salary quickly.",
        keywords: [
          "salary calculator",
          "hourly wage",
          "annual salary",
          "pay converter",
        ],
        status: "coming-soon",
      },
    ],
  },
  {
    slug: "health",
    name: "Health & Fitness",
    shortName: "Health",
    description: "BMI, calories, ideal weight and age.",
    seoDescription:
      "Free health & fitness calculators: BMI, calorie needs, ideal weight, pregnancy due date and age calculator. Instant, science-based results.",
    tools: [
      {
        slug: "bmi-calculator",
        name: "BMI Calculator",
        description:
          "Calculate your Body Mass Index (BMI) instantly and see your weight category.",
        keywords: [
          "bmi calculator",
          "body mass index",
          "weight calculator",
          "healthy weight",
        ],
        status: "ready",
      },
      {
        slug: "age-calculator",
        name: "Age Calculator",
        description:
          "Calculate your exact age in years, months, days, hours and minutes.",
        keywords: ["age calculator", "how old am i", "date of birth"],
        status: "ready",
      },
      {
        slug: "pregnancy-due-date",
        name: "Pregnancy Due Date Calculator",
        description:
          "Estimate your baby's due date based on your last menstrual period.",
        keywords: [
          "pregnancy calculator",
          "due date",
          "baby due date",
          "gestational age",
        ],
        status: "coming-soon",
      },
      {
        slug: "calorie-calculator",
        name: "Calorie / BMR Calculator",
        description:
          "Calculate your daily calorie needs (TDEE) and basal metabolic rate (BMR).",
        keywords: [
          "calorie calculator",
          "bmr calculator",
          "tdee",
          "daily calories",
        ],
        status: "coming-soon",
      },
      {
        slug: "ideal-weight",
        name: "Ideal Weight Calculator",
        description:
          "Find your ideal body weight range based on height, age and gender.",
        keywords: [
          "ideal weight",
          "healthy weight calculator",
          "target weight",
        ],
        status: "coming-soon",
      },
    ],
  },
  {
    slug: "math",
    name: "Math & Education",
    shortName: "Math",
    description: "Fractions, GPA, ratios and geometry.",
    seoDescription:
      "Free math calculators: fractions, GPA, percentage change, ratios and geometry. Step-by-step, easy to use tools for students.",
    tools: [
      {
        slug: "fraction-calculator",
        name: "Fraction Calculator",
        description:
          "Add, subtract, multiply and divide fractions with step-by-step results.",
        keywords: [
          "fraction calculator",
          "add fractions",
          "simplify fraction",
        ],
        status: "coming-soon",
      },
      {
        slug: "gpa-calculator",
        name: "GPA Calculator",
        description:
          "Calculate your Grade Point Average (GPA) from grades and credit hours.",
        keywords: ["gpa calculator", "grade point average", "college gpa"],
        status: "coming-soon",
      },
      {
        slug: "percentage-change",
        name: "Percentage Increase / Decrease",
        description:
          "Calculate the percentage change between two numbers (increase or decrease).",
        keywords: [
          "percentage change",
          "percent increase",
          "percent decrease",
        ],
        status: "coming-soon",
      },
      {
        slug: "ratio-calculator",
        name: "Ratio Calculator",
        description:
          "Simplify ratios, compare and solve proportions instantly.",
        keywords: ["ratio calculator", "proportion", "simplify ratio"],
        status: "coming-soon",
      },
      {
        slug: "geometry-calculator",
        name: "Geometry Calculator",
        description:
          "Calculate area, perimeter and volume for common geometric shapes.",
        keywords: [
          "geometry calculator",
          "area calculator",
          "perimeter",
          "volume",
        ],
        status: "coming-soon",
      },
    ],
  },
  {
    slug: "converters",
    name: "Converters",
    shortName: "Converters",
    description: "Units, temperature, time zones and bases.",
    seoDescription:
      "Free online converters: units (length, weight, volume), temperature, time zones, number bases and Roman numerals.",
    tools: [
      {
        slug: "unit-converter",
        name: "Unit Converter",
        description:
          "Convert between length, weight, volume and other common units.",
        keywords: [
          "unit converter",
          "metric converter",
          "imperial converter",
        ],
        status: "coming-soon",
      },
      {
        slug: "temperature-converter",
        name: "Temperature Converter",
        description:
          "Convert temperatures between Celsius, Fahrenheit and Kelvin.",
        keywords: [
          "temperature converter",
          "celsius to fahrenheit",
          "kelvin",
        ],
        status: "ready",
      },
      {
        slug: "timezone-converter",
        name: "Time Zone Converter",
        description:
          "Convert times between different time zones around the world.",
        keywords: [
          "time zone converter",
          "world clock",
          "utc converter",
        ],
        status: "coming-soon",
      },
      {
        slug: "number-base-converter",
        name: "Number Base Converter",
        description:
          "Convert numbers between binary, decimal, hexadecimal and octal.",
        keywords: [
          "binary converter",
          "hex converter",
          "decimal to binary",
        ],
        status: "coming-soon",
      },
      {
        slug: "roman-numeral-converter",
        name: "Roman Numeral Converter",
        description:
          "Convert Roman numerals to numbers and numbers to Roman numerals.",
        keywords: [
          "roman numeral converter",
          "roman numerals",
          "roman to number",
        ],
        status: "coming-soon",
      },
    ],
  },
  {
    slug: "date-time",
    name: "Date & Time",
    shortName: "Date & Time",
    description: "Date differences, countdowns and work days.",
    seoDescription:
      "Free date and time tools: date calculator, countdown timer, work days calculator, Unix timestamp converter and days until date.",
    tools: [
      {
        slug: "date-calculator",
        name: "Date Calculator",
        description:
          "Add or subtract days, weeks, months or years from any date.",
        keywords: [
          "date calculator",
          "date difference",
          "add days to date",
        ],
        status: "coming-soon",
      },
      {
        slug: "countdown-timer",
        name: "Countdown Timer",
        description:
          "Create a live countdown to any date or event of your choice.",
        keywords: ["countdown timer", "countdown to date", "event countdown"],
        status: "coming-soon",
      },
      {
        slug: "work-days-calculator",
        name: "Work Days Calculator",
        description:
          "Calculate the number of business days between two dates.",
        keywords: [
          "work days calculator",
          "business days",
          "working days between dates",
        ],
        status: "coming-soon",
      },
      {
        slug: "unix-timestamp",
        name: "Unix Timestamp Converter",
        description:
          "Convert Unix timestamps to human-readable dates and vice versa.",
        keywords: [
          "unix timestamp",
          "epoch converter",
          "timestamp to date",
        ],
        status: "coming-soon",
      },
      {
        slug: "days-until-date",
        name: "Days Until Date",
        description:
          "Count how many days remain until a specific future date.",
        keywords: [
          "days until",
          "countdown days",
          "days remaining",
        ],
        status: "coming-soon",
      },
    ],
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    shortName: "Text",
    description: "Word counts, case converters and diffs.",
    seoDescription:
      "Free text tools: word counter, case converter, Lorem Ipsum generator, text diff checker and URL slug generator.",
    tools: [
      {
        slug: "word-counter",
        name: "Word & Character Counter",
        description:
          "Count words, characters, sentences and paragraphs in your text.",
        keywords: [
          "word counter",
          "character counter",
          "text counter",
        ],
        status: "ready",
      },
      {
        slug: "text-case-converter",
        name: "Text Case Converter",
        description:
          "Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.",
        keywords: [
          "case converter",
          "uppercase",
          "lowercase",
          "title case",
        ],
        status: "coming-soon",
      },
      {
        slug: "lorem-ipsum-generator",
        name: "Lorem Ipsum Generator",
        description:
          "Generate Lorem Ipsum placeholder text — words, sentences or paragraphs.",
        keywords: [
          "lorem ipsum",
          "placeholder text",
          "dummy text generator",
        ],
        status: "coming-soon",
      },
      {
        slug: "text-diff",
        name: "Text Diff Checker",
        description:
          "Compare two texts side by side and highlight the differences.",
        keywords: ["text diff", "compare text", "diff checker"],
        status: "coming-soon",
      },
      {
        slug: "slug-generator",
        name: "Slug Generator",
        description:
          "Generate clean, URL-friendly slugs from any text or title.",
        keywords: ["slug generator", "url slug", "seo slug"],
        status: "coming-soon",
      },
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    shortName: "Developer",
    description: "JSON, Base64, URL encoding and UUIDs.",
    seoDescription:
      "Free developer tools: JSON formatter, Base64 encoder/decoder, URL encoder, UUID generator and hash generator (MD5, SHA).",
    tools: [
      {
        slug: "json-formatter",
        name: "JSON Formatter",
        description:
          "Format, validate and beautify JSON data with syntax highlighting.",
        keywords: [
          "json formatter",
          "json validator",
          "json beautifier",
        ],
        status: "ready",
      },
      {
        slug: "base64-encoder",
        name: "Base64 Encoder / Decoder",
        description:
          "Encode text to Base64 or decode Base64 back to plain text.",
        keywords: [
          "base64 encoder",
          "base64 decoder",
          "base64 converter",
        ],
        status: "coming-soon",
      },
      {
        slug: "url-encoder",
        name: "URL Encoder / Decoder",
        description:
          "Encode or decode URLs and query strings (percent-encoding).",
        keywords: [
          "url encoder",
          "url decoder",
          "percent encoding",
        ],
        status: "coming-soon",
      },
      {
        slug: "uuid-generator",
        name: "UUID Generator",
        description:
          "Generate random UUIDs (v4) — one or bulk. Copy with one click.",
        keywords: ["uuid generator", "guid generator", "uuid v4"],
        status: "coming-soon",
      },
      {
        slug: "hash-generator",
        name: "Hash Generator",
        description:
          "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.",
        keywords: [
          "hash generator",
          "md5",
          "sha256",
          "hash converter",
        ],
        status: "coming-soon",
      },
    ],
  },
  {
    slug: "generators",
    name: "Generators & Fun",
    shortName: "Generators",
    description: "Passwords, QR codes and color palettes.",
    seoDescription:
      "Free generators: strong password generator, random numbers, QR codes, color palettes and dice roller.",
    tools: [
      {
        slug: "password-generator",
        name: "Password Generator",
        description:
          "Generate strong, secure random passwords with customizable options.",
        keywords: [
          "password generator",
          "strong password",
          "secure password",
        ],
        status: "ready",
      },
      {
        slug: "random-number-generator",
        name: "Random Number Generator",
        description:
          "Generate random numbers within any range you specify.",
        keywords: [
          "random number generator",
          "rng",
          "random integer",
        ],
        status: "coming-soon",
      },
      {
        slug: "qr-code-generator",
        name: "QR Code Generator",
        description:
          "Create QR codes for any text, URL, phone or Wi-Fi credentials.",
        keywords: [
          "qr code generator",
          "qr code maker",
          "free qr code",
        ],
        status: "ready",
      },
      {
        slug: "color-palette",
        name: "Color Palette / HEX-RGB",
        description:
          "Convert colors between HEX, RGB, HSL and generate palettes.",
        keywords: [
          "color converter",
          "hex to rgb",
          "color palette generator",
        ],
        status: "coming-soon",
      },
      {
        slug: "dice-roller",
        name: "Dice Roller",
        description:
          "Roll virtual dice of any size — D4, D6, D8, D10, D12, D20 and more.",
        keywords: ["dice roller", "virtual dice", "d20 roller"],
        status: "coming-soon",
      },
    ],
  },
{
    slug: "ai-tools",
    name: "AI Tools",
    shortName: "AI Tools",
    description: "Prompts, token counters, AI directories and cost calculators.",
    seoDescription:
      "Free AI tools and utilities: prompt generator, token counter for GPT/Claude/Gemini, curated directory of free AI tools and cost calculators for AI APIs.",
    tools: [
      {
        slug: "prompt-generator",
        name: "AI Prompt Generator",
        description:
          "Generate professional AI prompts for marketing, coding, writing, design and education. Ready-to-use templates with customizable variables.",
        keywords: [
          "prompt generator",
          "ai prompt",
          "chatgpt prompt",
          "prompt templates",
          "ai prompt generator",
        ],
        status: "ready",
      },
      {
        slug: "token-counter",
        name: "AI Token Counter",
        description:
          "Count tokens for GPT-4, Claude, Gemini and other AI models. Estimate API costs before sending your prompt.",
        keywords: [
          "token counter",
          "gpt token counter",
          "claude token counter",
          "openai tokenizer",
          "ai tokens",
        ],
        status: "ready",
      },
      {
        slug: "ai-cost-calculator",
        name: "AI API Cost Calculator",
        description:
          "Calculate monthly cost of using AI APIs like GPT-4, Claude and Gemini based on your usage volume.",
        keywords: [
          "ai cost calculator",
          "openai pricing",
          "claude pricing",
          "gpt cost",
          "ai api cost",
        ],
        status: "ready",
      },
      {
        slug: "ai-coding-tools",
        name: "AI Coding Tools Comparison",
        description:
          "Compare the best AI coding assistants: GitHub Copilot, Cursor, Codeium, Windsurf and more. Features, pricing and free plans.",
        keywords: [
          "ai coding tools",
          "github copilot alternative",
          "cursor vs copilot",
          "best ai for coding",
          "ai code assistant",
        ],
        status: "ready",
      },
      {
        slug: "free-ai-directory",
        name: "Free AI Tools Directory",
        description:
          "Curated directory of the best free AI tools. Filter by category, no sign-up required tools, open source options.",
        keywords: [
          "free ai tools",
          "ai directory",
          "best ai tools",
          "free chatgpt alternatives",
          "ai tools list",
        ],
        status: "ready",
      },
    ],
  },
];
// ============================================================================
// HELPERS — funções auxiliares para acessar dados de forma prática
// ============================================================================

export function getAllTools(): Array<Tool & { categorySlug: string; categoryName: string }> {
  return categories.flatMap((cat) =>
    cat.tools.map((tool) => ({
      ...tool,
      categorySlug: cat.slug,
      categoryName: cat.name,
    }))
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getToolBySlug(
  categorySlug: string,
  toolSlug: string
): Tool | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.tools.find((tool) => tool.slug === toolSlug);
}

export function getReadyTools() {
  return getAllTools().filter((tool) => tool.status === "ready");
}