// ============================================================================
// REGISTRO CENTRAL DE FERRAMENTAS
// ============================================================================

export type ToolStatus = "ready" | "coming-soon";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  status: ToolStatus;
  /** Optional cover image path (used by the Games category). */
  image?: string;
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
  url: "https://www.multitoolbox.online",
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
      "Free online finance calculators: loan payments, discounts, tips, compound interest, VAT/sales tax and salary conversions.",
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
        status: "ready",
      },
      {
        slug: "compound-interest",
        name: "Compound Interest Calculator",
        description:
          "Calculate future value and interest earned with compound growth and optional monthly deposits.",
        keywords: [
          "compound interest calculator",
          "compound interest",
          "investment calculator",
          "savings calculator",
        ],
        status: "ready",
      },
      {
        slug: "vat-calculator",
        name: "VAT / Sales Tax Calculator",
        description:
          "Add or remove VAT, GST or sales tax from a price. Net, tax and gross in one step.",
        keywords: [
          "vat calculator",
          "sales tax calculator",
          "gst calculator",
          "tax calculator",
        ],
        status: "ready",
      },
      {
        slug: "mortgage-calculator",
        name: "Mortgage Calculator",
        description: "Estimate your monthly payment, total interest and total cost for any home price, down payment, rate and term.",
        keywords: ["mortgage calculator", "home loan calculator", "monthly payment calculator", "house payment calculator"],
        status: "ready",
      },
      {
        slug: "fuel-economy-calculator",
        name: "Fuel Economy Calculator",
        description: "Calculate fuel consumption (km/L or MPG), trip cost and fuel needed for any journey, in metric or imperial units.",
        keywords: ["fuel economy calculator", "fuel cost calculator", "mpg calculator", "gas mileage calculator", "trip fuel cost"],
        status: "ready",
      },
    ],
  },
  {
    slug: "health",
    name: "Health & Fitness",
    shortName: "Health",
    description: "BMI, calories, ideal weight and age.",
    seoDescription:
      "Free health & fitness calculators: BMI, calorie needs, ideal weight, pregnancy due date and age calculator.",
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
        status: "ready",
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
        status: "ready",
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
        status: "ready",
      },
    ],
  },
  {
    slug: "math",
    name: "Math & Education",
    shortName: "Math",
    description: "Fractions, GPA, ratios and geometry.",
    seoDescription:
      "Free math calculators: fractions, GPA, percentage change, ratios and geometry.",
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
        status: "ready",
      },
      {
        slug: "gpa-calculator",
        name: "GPA Calculator",
        description:
          "Calculate your Grade Point Average (GPA) from grades and credit hours.",
        keywords: ["gpa calculator", "grade point average", "college gpa"],
        status: "ready",
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
        status: "ready",
      },
      {
        slug: "ratio-calculator",
        name: "Ratio Calculator",
        description:
          "Simplify ratios, compare and solve proportions instantly.",
        keywords: ["ratio calculator", "proportion", "simplify ratio"],
        status: "ready",
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
        status: "ready",
      },
      {
        slug: "scientific-calculator",
        name: "Scientific Calculator",
        description:
          "Full scientific calculator: trigonometry, logarithms, powers, roots, π and e. Keyboard support and history.",
        keywords: [
          "scientific calculator",
          "online calculator",
          "calculator online free",
          "trigonometry calculator",
          "log calculator",
          "math calculator",
        ],
        status: "ready",
      },
      {
        slug: "statistics-calculator",
        name: "Statistics Calculator",
        description: "Compute mean, median, mode, range, variance and standard deviation from any list of numbers.",
        keywords: ["statistics calculator", "mean median mode calculator", "standard deviation calculator", "variance calculator"],
        status: "ready",
      },
      {
        slug: "aspect-ratio-calculator",
        name: "Aspect Ratio Calculator",
        description: "Simplify any width and height to its aspect ratio (16:9, 4:3, 1:1) and find the missing dimension for a target ratio.",
        keywords: ["aspect ratio calculator", "16:9 calculator", "resolution ratio", "ratio simplifier", "aspect ratio converter"],
        status: "ready",
      },
    ],
  },
  {
    slug: "converters",
    name: "Converters",
    shortName: "Converters",
    description: "Units, temperature, currency, time zones and bases.",
    seoDescription:
      "Free online converters: units, temperature, currency, time zones, number bases and Roman numerals.",
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
        status: "ready",
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
        status: "ready",
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
        status: "ready",
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
        status: "ready",
      },
      {
        slug: "currency-converter",
        name: "Currency Converter",
        description:
          "Convert between USD, EUR, GBP, BRL, INR and other major currencies with live reference rates.",
        keywords: [
          "currency converter",
          "exchange rate",
          "usd to eur",
          "usd to brl",
          "money converter",
        ],
        status: "ready",
      },
      {
        slug: "shoe-size-converter",
        name: "Shoe Size Converter",
        description: "Convert shoe sizes between US, UK, EU and centimeters for men and women.",
        keywords: ["shoe size converter", "shoe size chart", "us to eu size", "foot length cm", "shoe size calculator"],
        status: "ready",
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
        status: "ready",
      },
      {
        slug: "countdown-timer",
        name: "Countdown Timer",
        description:
          "Create a live countdown to any date or event of your choice.",
        keywords: ["countdown timer", "countdown to date", "event countdown"],
        status: "ready",
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
        status: "ready",
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
        status: "ready",
      },
      {
        slug: "days-until-date",
        name: "Days Until Date",
        description:
          "Count how many days remain until a specific future date.",
        keywords: ["days until", "countdown days", "days remaining"],
        status: "ready",
      },
      {
        slug: "stopwatch",
        name: "Stopwatch, Timer & Pomodoro",
        description: "Precise online stopwatch with laps, countdown timer and Pomodoro timer with sound alerts.",
        keywords: ["stopwatch", "online timer", "countdown timer", "pomodoro timer", "stopwatch online"],
        status: "ready",
      },
    ],
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    shortName: "Text",
    description: "Word counts, case converters and diffs.",
    seoDescription:
      "Free text tools: word counter, readability checker, case converter, Lorem Ipsum generator, text diff checker and URL slug generator.",
    tools: [
      {
        slug: "word-counter",
        name: "Word & Character Counter",
        description:
          "Count words, characters, sentences and paragraphs in your text.",
        keywords: ["word counter", "character counter", "text counter"],
        status: "ready",
      },
      {
        slug: "text-case-converter",
        name: "Text Case Converter",
        description:
          "Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.",
        keywords: ["case converter", "uppercase", "lowercase", "title case"],
        status: "ready",
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
        status: "ready",
      },
      {
        slug: "text-diff",
        name: "Text Diff Checker",
        description:
          "Compare two texts side by side and highlight the differences.",
        keywords: ["text diff", "compare text", "diff checker"],
        status: "ready",
      },
      {
        slug: "slug-generator",
        name: "Slug Generator",
        description:
          "Generate clean, URL-friendly slugs from any text or title.",
        keywords: ["slug generator", "url slug", "seo slug"],
        status: "ready",
      },
      {
        slug: "readability-checker",
        name: "Readability Checker",
        description:
          "Measure the Flesch Reading Ease score and Flesch-Kincaid grade level of any text, with word, sentence and syllable counts.",
        keywords: [
          "readability checker",
          "flesch reading ease",
          "flesch kincaid",
          "readability score",
          "reading level test",
        ],
        status: "ready",
      },
      {
        slug: "keyword-density",
        name: "Keyword Density Checker",
        description:
          "Check how often a keyword appears in your text as a percentage of all words.",
        keywords: [
          "keyword density",
          "keyword density checker",
          "seo keyword",
          "keyword frequency",
        ],
        status: "ready",
      },
      {
        slug: "fancy-text-generator",
        name: "Fancy Text Generator",
        description: "Convert your text into fancy unicode styles: bold, italic, cursive, monospace and upside down.",
        keywords: ["fancy text generator", "fancy fonts", "cool text generator", "cursive text", "unicode text"],
        status: "ready",
      },
      {
        slug: "emoji-copy-paste",
        name: "Emoji Copy-Paste",
        description: "Find and copy emojis instantly: smileys, hearts, animals, food and symbols. Search and one-click copy.",
        keywords: ["emoji copy paste", "emoji keyboard", "copy emojis", "emojis for instagram"],
        status: "ready",
      },
      {
        slug: "hashtag-generator",
        name: "Hashtag Generator",
        description: "Generate 3-30 relevant hashtags from any topic: phrase tags, word tags and trending variants for social media.",
        keywords: ["hashtag generator", "hashtags for instagram", "hashtag ideas", "social media hashtags", "gerador de hashtags"],
        status: "ready",
      },
      {
        slug: "morse-code",
        name: "Morse Code Translator",
        description: "Translate text to Morse code and back, with sound playback of the classic alphabet.",
        keywords: ["morse code", "morse code translator", "text to morse", "morse decoder"],
        status: "ready",
      },
      {
        slug: "text-encryptor",
        name: "Text Encryptor",
        description: "Encrypt any text with AES-256-GCM using a passphrase, and decrypt it back. 100% in your browser.",
        keywords: ["text encryptor", "encrypt text", "aes encryption", "decrypt text", "criptografar texto"],
        status: "ready",
      },
      {
        slug: "number-to-words",
        name: "Number to Words Converter",
        description: "Convert any number to English or Portuguese words instantly — perfect for checks, invoices and contracts.",
        keywords: ["number to words", "numbers to words converter", "write numbers in words", "check amount in words", "numero por extenso"],
        status: "ready",
      },
      {
        slug: "text-to-speech",
        name: "Text to Speech",
        description: "Turn any text into spoken audio right in your browser: choose a voice, speed and pitch. Works offline, no sign-up.",
        keywords: ["text to speech", "tts", "read aloud", "text reader", "texto em voz"],
        status: "ready",
      },
      {
        slug: "typing-test",
        name: "Typing Test (WPM)",
        description: "Measure your typing speed in WPM and accuracy with 15, 30 or 60 second tests and live feedback.",
        keywords: ["typing test", "wpm test", "typing speed test", "words per minute", "teste de digitacao"],
        status: "ready",
      },
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    shortName: "Developer",
    description: "JSON, Base64, URL encoding and UUIDs.",
    seoDescription:
      "Free developer tools: JSON formatter, regex tester, JWT decoder, CSV to JSON converter, URL shortener, Base64, URL encoder, UUID and hash generators.",
    tools: [
      {
        slug: "json-formatter",
        name: "JSON Formatter",
        description:
          "Format, validate and beautify JSON data with syntax highlighting.",
        keywords: ["json formatter", "json validator", "json beautifier"],
        status: "ready",
      },
      {
        slug: "base64-encoder",
        name: "Base64 Encoder / Decoder",
        description:
          "Encode text to Base64 or decode Base64 back to plain text.",
        keywords: ["base64 encoder", "base64 decoder", "base64 converter"],
        status: "ready",
      },
      {
        slug: "url-encoder",
        name: "URL Encoder / Decoder",
        description:
          "Encode or decode URLs and query strings (percent-encoding).",
        keywords: ["url encoder", "url decoder", "percent encoding"],
        status: "ready",
      },
      {
        slug: "uuid-generator",
        name: "UUID Generator",
        description:
          "Generate random UUIDs (v4) — one or bulk. Copy with one click.",
        keywords: ["uuid generator", "guid generator", "uuid v4"],
        status: "ready",
      },
      {
        slug: "hash-generator",
        name: "Hash Generator",
        description:
          "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.",
        keywords: ["hash generator", "md5", "sha256", "hash converter"],
        status: "ready",
      },
      {
        slug: "password-strength",
        name: "Password Strength Checker",
        description: "Check how strong your password is: score from very weak to strong, entropy estimate and 6 security checks, 100% local.",
        keywords: ["password strength", "password checker", "password test", "strong password", "verificador de senha"],
        status: "ready",
      },
      {
        slug: "regex-tester",
        name: "Regex Tester",
        description:
          "Test JavaScript regular expressions with live matches, capture groups and flags.",
        keywords: [
          "regex tester",
          "regular expression tester",
          "regexp tester",
          "test regex online",
        ],
        status: "ready",
      },
      {
        slug: "jwt-decoder",
        name: "JWT Decoder",
        description:
          "Decode JSON Web Tokens (JWT) instantly: read header, payload and claims as readable JSON. Runs in your browser.",
        keywords: [
          "jwt decoder",
          "jwt decode",
          "json web token decoder",
          "decode jwt online",
          "jwt parser",
          "jwt inspector",
        ],
        status: "ready",
      },
      {
        slug: "csv-json-converter",
        name: "CSV ⇄ JSON Converter",
        description:
          "Convert CSV to JSON and JSON to CSV instantly. Custom delimiters, header-row detection, copy or download.",
        keywords: [
          "csv to json",
          "json to csv",
          "csv converter",
          "csv to json converter",
          "json to csv converter",
          "csv parser",
        ],
        status: "ready",
      },
      {
        slug: "fake-data-generator",
        name: "Fake Data Generator",
        description: "Generate realistic fake data: names, emails, phones, addresses, companies, dates, UUIDs and SSNs. Export as CSV.",
        keywords: ["fake data generator", "test data generator", "mock data", "dummy data", "fake name generator"],
        status: "ready",
      },
      {
        slug: "url-shortener",
        name: "URL Shortener",
        description:
          "Turn any long link into a short, shareable URL in seconds. Copy with one click and session history.",
        keywords: [
          "url shortener",
          "shorten link",
          "short url",
          "link shortener",
          "shorten url online",
          "encurtador de link",
        ],
        status: "ready",
      },
      {
        slug: "cron-generator",
        name: "Cron Generator",
        description: "Build 5-field cron expressions visually with presets and a human-readable description. Compatible with Linux, AWS and GitHub Actions.",
        keywords: ["cron generator", "cron expression", "cron job", "scheduler", "crontab generator"],
        status: "ready",
      },
      {
        slug: "markdown-to-html",
        name: "Markdown to HTML",
        description: "Convert Markdown to clean HTML instantly with a live preview. Headings, lists, links, code blocks and more.",
        keywords: ["markdown to html", "md to html", "markdown converter", "markdown editor", "html generator"],
        status: "ready",
      },
      {
        slug: "css-gradient-generator",
        name: "CSS Gradient Generator",
        description: "Create beautiful CSS gradients visually: pick colors, angle and type, then copy the ready-to-use code.",
        keywords: ["css gradient generator", "gradient maker", "css background gradient", "linear gradient", "color gradient generator"],
        status: "ready",
      },
      {
        slug: "px-to-rem",
        name: "PX to REM Converter",
        description: "Convert pixels to rem and rem to pixels with any root font size, plus a quick reference table for common sizes.",
        keywords: ["px to rem", "rem to px", "px rem converter", "css rem", "font size converter"],
        status: "ready",
      },
      {
        slug: "meta-tag-generator",
        name: "Meta Tag Generator",
        description: "Generate SEO meta tags (title, description, Open Graph, Twitter) with a live Google search preview.",
        keywords: ["meta tag generator", "seo meta tags", "meta description generator", "og tags generator", "title tag generator"],
        status: "ready",
      },
    ],
  },
  {
    slug: "generators",
    name: "Generators & Fun",
    shortName: "Generators",
    description: "Passwords, QR codes and color palettes.",
    seoDescription:
      "Free generators: password generator, QR codes, giveaway picker / sorteador, color palettes and dice roller.",
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
        keywords: ["random number generator", "rng", "random integer"],
        status: "ready",
      },
      {
        slug: "qr-code-generator",
        name: "QR Code Generator",
        description:
          "Create QR codes for any text, URL, phone or Wi-Fi credentials.",
        keywords: ["qr code generator", "qr code maker", "free qr code"],
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
        status: "ready",
      },
      {
        slug: "dice-roller",
        name: "Dice Roller",
        description:
          "Roll virtual dice of any size — D4, D6, D8, D10, D12, D20 and more.",
        keywords: ["dice roller", "virtual dice", "d20 roller"],
        status: "ready",
      },
      {
        slug: "wheel-spinner",
        name: "Wheel Spinner",
        description: "Spin the wheel to pick a random winner from your list. Add options, spin with animation, get a fair result.",
        keywords: ["wheel spinner", "random picker", "spin the wheel", "name picker", "roleta online"],
        status: "ready",
      },
      {
        slug: "giveaway-picker",
        name: "Giveaway Picker / Sorteador",
        description:
          "Draw random winners from a pasted or uploaded list. Built for Instagram giveaways and raffles.",
        keywords: [
          "giveaway picker",
          "sorteador instagram",
          "sorteio aleatório",
          "random winner",
        ],
        status: "ready",
      },
      {
        slug: "love-calculator",
        name: "Love Calculator",
        description: "Discover your love compatibility percentage with a fun, viral name-based calculation.",
        keywords: ["love calculator", "love test", "compatibility test", "love percentage", "calculator de amor"],
        status: "ready",
      },
      {
        slug: "coin-flip",
        name: "Coin Flip & Magic 8-Ball",
        description: "Flip a virtual coin, get a Yes/No answer or ask the Magic 8-Ball. Instant decisions with sounds.",
        keywords: ["coin flip", "flip a coin", "yes or no", "magic 8 ball", "decision maker", "cara ou coroa"],
        status: "ready",
      },
      {
        slug: "username-generator",
        name: "Username Generator",
        description: "Generate cool, unique usernames for games, social media and more, with style and leet options.",
        keywords: ["username generator", "cool usernames", "gamertag generator", "name ideas"],
        status: "ready",
      },
      {
        slug: "random-word-generator",
        name: "Random Word Generator",
        description: "Generate random words instantly for writing prompts, games, passwords and inspiration.",
        keywords: ["random word generator", "random words", "writing prompt generator"],
        status: "ready",
      },
      {
        slug: "pet-business-name-generator",
        name: "Pet & Business Name Generator",
        description: "Generate creative names for pets (dogs, cats, birds) and businesses by style and keyword. One click to copy.",
        keywords: ["pet name generator", "business name generator", "dog name ideas", "company name generator", "brand name generator"],
        status: "ready",
      },
    ],
  },
  {
    slug: "images",
    name: "Image Tools",
    shortName: "Images",
    description: "Compress, resize and convert images.",
    seoDescription:
      "Free image tools: compress and resize JPEG, PNG and WebP images, convert between formats and more — all in your browser.",
    tools: [
      {
        slug: "image-compressor",
        name: "Image Compressor / Resizer",
        description:
          "Reduce the file size of JPEG, PNG and WebP images with quality control and resize. Runs entirely in your browser.",
        keywords: [
          "image compressor",
          "compress image online",
          "resize image",
          "reduce image size",
          "photo compressor",
          "jpg compressor",
        ],
        status: "ready",
      },
      {
        slug: "jpg-png-webp-converter",
        name: "JPG / PNG / WebP Converter",
        description:
          "Convert images between JPG, PNG and WebP formats instantly in your browser.",
        keywords: [
          "jpg to png",
          "png to jpg",
          "jpg to webp",
          "webp to jpg",
          "png to webp",
          "webp to png",
          "image format converter",
          "image converter online",
        ],
        status: "ready",
      },
      {
        slug: "image-to-base64",
        name: "Image to Base64",
        description:
          "Convert any image to a Base64 data URI for embedding in HTML, CSS or JSON.",
        keywords: [
          "image to base64",
          "base64 image",
          "image to base64 converter",
          "data uri",
          "base64 encode image",
          "image encoder",
          "img to base64",
        ],
        status: "ready",
      },
      {
        slug: "favicon-generator",
        name: "Favicon Generator",
        description: "Create a favicon from text, an emoji or your own image, and download every size you need: 16, 32, 48, 180 and 512 px.",
        keywords: ["favicon generator", "favicon maker", "icon generator", "favicon from text", "site icon generator"],
        status: "ready",
      },
      {
        slug: "image-cropper",
        name: "Image Cropper",
        description: "Crop any image online with free, 1:1, 4:3, 16:9 and other preset ratios. Drag, zoom and download as PNG.",
        keywords: ["image cropper", "crop photo online", "crop image", "square crop", "crop tool"],
        status: "ready",
      },
    ],
  },
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    shortName: "PDF",
    description: "Merge, split, convert and protect PDFs.",
    seoDescription:
      "Free PDF tools: merge, split, compress, unlock, convert images to PDF, protect with password, rotate and sign — all in your browser, no upload.",
    tools: [
      {
        slug: "pdf-merge",
        name: "PDF Merge",
        description:
          "Combine multiple PDF files into one, keeping the page order you choose. Free, private, in your browser.",
        keywords: [
          "merge pdf",
          "combine pdf",
          "join pdf",
          "pdf merger",
          "merge pdf online",
          "combine pdf files",
        ],
        status: "ready",
      },
      {
        slug: "pdf-split",
        name: "PDF Split / Extract Pages",
        description:
          "Extract specific pages or ranges from a PDF, split into single pages or chunks of N — as PDF or ZIP.",
        keywords: [
          "split pdf",
          "extract pages from pdf",
          "pdf page extractor",
          "split pdf online",
          "pdf splitter",
          "remove pages from pdf",
        ],
        status: "ready",
      },
      {
        slug: "images-to-pdf",
        name: "Images to PDF",
        description:
          "Turn JPG, PNG and WebP images into a single PDF document — reorder, fit and download.",
        keywords: [
          "images to pdf",
          "jpg to pdf",
          "png to pdf",
          "webp to pdf",
          "image to pdf converter",
          "convert image to pdf",
        ],
        status: "ready",
      },
      {
        slug: "pdf-protect",
        name: "PDF Protect (Password)",
        description:
          "Encrypt a PDF with a password (AES-256) and optionally restrict printing and copying.",
        keywords: [
          "protect pdf",
          "password protect pdf",
          "pdf password",
          "encrypt pdf",
          "lock pdf",
          "secure pdf",
        ],
        status: "ready",
      },
      {
        slug: "pdf-rotate",
        name: "PDF Rotate",
        description:
          "Rotate PDF pages 90, 180 or 270 degrees — all pages or only selected ones.",
        keywords: [
          "rotate pdf",
          "rotate pdf pages",
          "pdf rotate online",
          "rotate pdf 90 degrees",
          "fix upside down pdf",
        ],
        status: "ready",
      },
      {
        slug: "pdf-sign",
        name: "PDF Sign",
        description:
          "Draw your signature with the mouse or finger and place it on any page of a PDF.",
        keywords: [
          "sign pdf",
          "pdf signature",
          "sign pdf online",
          "digital signature pdf",
          "sign a pdf document",
          "electronic signature",
        ],
        status: "ready",
      },
      {
        slug: "pdf-unlock",
        name: "PDF Unlock",
        description:
          "Remove the password from a PDF you own. Type the password once and download the unlocked file.",
        keywords: [
          "unlock pdf",
          "remove password from pdf",
          "pdf unlock",
          "remove pdf password",
          "decrypt pdf",
          "unlock pdf online",
        ],
        status: "ready",
      },
      {
        slug: "pdf-compress",
        name: "PDF Compress",
        description:
          "Reduce the file size of a PDF by re-encoding pages as optimized images. Quality and resolution controls.",
        keywords: [
          "compress pdf",
          "reduce pdf size",
          "pdf compressor",
          "shrink pdf",
          "smaller pdf",
          "compress pdf online",
          "pdf size reducer",
        ],
        status: "ready",
      },
      {
        slug: "pdf-watermark",
        name: "PDF Watermark",
        description:
          "Add a text or image watermark to every page of a PDF, with position, rotation and opacity controls.",
        keywords: [
          "pdf watermark",
          "add watermark to pdf",
          "watermark pdf",
          "pdf watermark online",
          "add text to pdf",
          "stamp pdf",
        ],
        status: "ready",
      },
      {
        slug: "pdf-reorder",
        name: "PDF Reorder / Remove Pages",
        description:
          "Reorder pages with arrows and remove pages you don't need, then download the organized PDF.",
        keywords: [
          "reorder pdf pages",
          "pdf page organizer",
          "remove pages from pdf",
          "delete pdf pages",
          "reorder pdf",
          "organize pdf pages",
        ],
        status: "ready",
      },
      {
        slug: "pdf-number-pages",
        name: "Add Page Numbers to PDF",
        description:
          "Add page numbers to a PDF with position, starting number, size and prefix options.",
        keywords: [
          "add page numbers to pdf",
          "number pdf pages",
          "pdf page numbers",
          "add page numbers pdf",
          "insert page numbers pdf",
        ],
        status: "ready",
      },
      {
        slug: "pdf-metadata",
        name: "PDF Metadata Editor",
        description:
          "View and edit PDF metadata: title, author, subject and keywords.",
        keywords: [
          "pdf metadata",
          "edit pdf title",
          "pdf properties",
          "pdf metadata editor",
          "change pdf title",
          "pdf keywords",
        ],
        status: "ready",
      },
      {
        slug: "pdf-to-images",
        name: "PDF to Images",
        description:
          "Convert every page of a PDF to JPG or PNG images, downloaded as a ZIP.",
        keywords: [
          "pdf to image",
          "pdf to jpg",
          "pdf to png",
          "convert pdf to image",
          "pdf pages to jpg",
        ],
        status: "ready",
      },
      {
        slug: "pdf-repair",
        name: "PDF Repair",
        description:
          "Try to recover and repair damaged or unreadable PDF files.",
        keywords: [
          "pdf repair",
          "repair pdf",
          "fix pdf",
          "recover pdf",
          "corrupted pdf",
        ],
        status: "ready",
      },
    ],
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    shortName: "AI Tools",
    description: "Prompts, token counters, AI directories and cost calculators.",
    seoDescription:
      "Free AI tools and utilities: prompt generator, system prompt builder, token counter, LLM model comparison, curated directory of free AI tools and cost calculators for AI APIs.",
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
      {
        slug: "llm-model-comparison",
        name: "LLM Model Comparison",
        description:
          "Compare the top LLMs side by side: GPT, Claude, Gemini, Llama, DeepSeek — context windows, output limits and reference API prices.",
        keywords: [
          "llm comparison",
          "llm model comparison",
          "gpt vs claude",
          "claude vs gemini",
          "ai model comparison",
          "compare llm models",
          "llm pricing",
        ],
        status: "ready",
      },
      {
        slug: "system-prompt-builder",
        name: "System Prompt Builder",
        description:
          "Assemble professional system prompts from roles, tones, constraints and output formats. Copy with one click.",
        keywords: [
          "system prompt builder",
          "system prompt generator",
          "system prompt template",
          "prompt builder",
          "chatgpt system prompt",
          "claude system prompt",
          "prompt engineer",
        ],
        status: "ready",
      },
    ],
  },
  {
    slug: "games",
    name: "Games",
    shortName: "Games",
    description: "Classic arcade games, free in your browser.",
    seoDescription:
      "Free browser games: Snake, 2048, memory match, block stacking, word guess and more classic arcade games — no download, no sign-up, all in your browser.",
    tools: [
      {
        slug: "snake",
        name: "Snake",
        description:
          "The classic snake game with neon visuals. Eat, grow and avoid the walls.",
        keywords: ["snake game", "play snake", "snake online", "classic snake game"],
        status: "ready",
        image: "/games/snake.jpg",
      },
      {
        slug: "2048",
        name: "2048",
        description:
          "Merge tiles to reach 2048 in the addictive number puzzle game.",
        keywords: ["2048", "2048 game", "play 2048 online", "number puzzle game"],
        status: "ready",
        image: "/games/2048.jpg",
      },
      {
        slug: "memory-match",
        name: "Memory Match",
        description:
          "Flip cards and find all the matching pairs in this classic memory game.",
        keywords: ["memory game", "memory match", "card matching game", "concentration game"],
        status: "ready",
        image: "/games/memory-match.jpg",
      },
      {
        slug: "snake-puzzle",
        name: "Snake Puzzle",
        description:
          "Untangle the snakes: click a snake to slide it forward and clear the board. Level-based logic puzzle.",
        keywords: ["snake puzzle", "unpuzzle", "snake logic puzzle", "untangle snakes game"],
        status: "ready",
        image: "/games/snake-puzzle.jpg",
      },
      {
        slug: "noughts-crosses",
        name: "Noughts & Crosses",
        description:
          "Play tic-tac-toe against the computer or a friend. Three in a row wins.",
        keywords: ["tic tac toe", "noughts and crosses", "play tic tac toe", "x o game"],
        status: "ready",
        image: "/games/noughts-crosses.jpg",
      },
      {
        slug: "sequence-memory",
        name: "Sequence Memory",
        description:
          "Watch the glowing sequence and repeat it. How long a chain can you remember?",
        keywords: ["memory game", "simon game", "sequence memory", "brain game"],
        status: "ready",
        image: "/games/sequence-memory.jpg",
      },
      {
        slug: "minesweeper",
        name: "Minesweeper",
        description:
          "Clear the grid without hitting a mine. The classic logic puzzle, refreshed.",
        keywords: ["minesweeper", "play minesweeper", "minefield game", "logic puzzle game"],
        status: "ready",
        image: "/games/minesweeper.jpg",
      },
      {
        slug: "block-stacker",
        name: "Block Stacker",
        description:
          "A falling-blocks puzzle in the tradition of the 80s classic. Stack lines and clear them.",
        keywords: ["falling blocks game", "block puzzle", "stack blocks game", "tetris style game"],
        status: "ready",
        image: "/games/block-stacker.jpg",
      },
      {
        slug: "dino-run",
        name: "Dino Run",
        description:
          "Jump over obstacles and run as far as you can in this endless desert dash.",
        keywords: ["dino game", "endless runner", "dino run", "jump game online"],
        status: "ready",
        image: "/games/dino-run.jpg",
      },
      {
        slug: "word-guess",
        name: "Word Guess",
        description:
          "Guess the hidden word in six tries. A daily brain teaser for word lovers.",
        keywords: ["word game", "guess the word", "word puzzle", "daily word game"],
        status: "ready",
        image: "/games/word-guess.jpg",
      },
      {
        slug: "pixel-pong",
        name: "Pixel Pong",
        description:
          "The arcade paddle classic, pixel-styled. Beat the computer in retro rally.",
        keywords: ["pong game", "pixel pong", "arcade pong", "retro pong game"],
        status: "ready",
        image: "/games/pixel-pong.jpg",
      },
      {
        slug: "brick-breaker",
        name: "Brick Breaker",
        description:
          "Bounce the ball and smash every brick. The breakout-style arcade favorite.",
        keywords: ["brick breaker", "breakout game", "ball brick game", "arcade brick game"],
        status: "ready",
        image: "/games/brick-breaker.jpg",
      },
      {
        slug: "four-in-a-row",
        name: "Four in a Row",
        description:
          "Drop discs and connect four in a row. Play against the computer.",
        keywords: ["connect four", "four in a row", "connect 4 game", "drop disc game"],
        status: "ready",
        image: "/games/four-in-a-row.jpg",
      },
    ],
  },
];

export function getAllTools(): Array<
  Tool & { categorySlug: string; categoryName: string }
> {
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