"use client";

import { useState, useMemo } from "react";

type Category = "marketing" | "coding" | "writing" | "design" | "education" | "business";

interface Variable {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  type?: "text" | "textarea";
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: Category;
  variables: Variable[];
  template: string;
}

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "marketing", label: "MARKETING", emoji: "📢" },
  { id: "coding", label: "CODING", emoji: "💻" },
  { id: "writing", label: "WRITING", emoji: "✍️" },
  { id: "design", label: "DESIGN", emoji: "🎨" },
  { id: "education", label: "EDUCATION", emoji: "🎓" },
  { id: "business", label: "BUSINESS", emoji: "💼" },
];

const TEMPLATES: Template[] = [
  // MARKETING
  {
    id: "linkedin-post",
    title: "LinkedIn Post",
    description: "Write an engaging LinkedIn post about any topic.",
    category: "marketing",
    variables: [
      { name: "topic", label: "Topic", placeholder: "e.g. remote work productivity", defaultValue: "remote work productivity" },
      { name: "tone", label: "Tone", placeholder: "e.g. professional, inspirational", defaultValue: "professional and inspirational" },
      { name: "audience", label: "Target audience", placeholder: "e.g. tech professionals", defaultValue: "tech professionals and managers" },
    ],
    template: `Act as a senior LinkedIn content strategist. Write a professional LinkedIn post about "{topic}".

Requirements:
- Tone: {tone}
- Target audience: {audience}
- Length: 150-200 words
- Start with a strong hook (question, bold statement or surprising fact)
- Include 2-3 concrete insights or actionable tips
- End with a question that invites engagement
- Add 3-5 relevant hashtags at the end
- Use short paragraphs (1-2 lines max) for readability
- Avoid corporate jargon and clichés

Format the post ready to copy and paste.`,
  },
  {
    id: "instagram-caption",
    title: "Instagram Caption",
    description: "Create an engaging Instagram caption with hashtags.",
    category: "marketing",
    variables: [
      { name: "topic", label: "Post topic", placeholder: "e.g. morning coffee routine", defaultValue: "morning coffee routine" },
      { name: "style", label: "Style", placeholder: "e.g. casual, aesthetic, motivational", defaultValue: "casual and aesthetic" },
    ],
    template: `Write an engaging Instagram caption about "{topic}".

Style: {style}

Requirements:
- Start with an eye-catching first line
- Keep it under 150 characters (Instagram sweet spot)
- Add 1-2 emojis (tasteful, not excessive)
- Include 15-20 relevant hashtags at the end (mix of popular and niche)
- End with a subtle call-to-action or question

Give me 3 different caption options I can choose from.`,
  },
  {
    id: "email-marketing",
    title: "Marketing Email",
    description: "Write a persuasive marketing email.",
    category: "marketing",
    variables: [
      { name: "product", label: "Product/Service", placeholder: "e.g. online course on SEO", defaultValue: "online course on SEO" },
      { name: "audience", label: "Target audience", placeholder: "e.g. small business owners", defaultValue: "small business owners" },
      { name: "goal", label: "Goal", placeholder: "e.g. drive sign-ups", defaultValue: "drive sign-ups for early bird discount" },
    ],
    template: `Act as an expert email copywriter. Write a persuasive marketing email for the following:

Product/Service: {product}
Target audience: {audience}
Goal: {goal}

Requirements:
- Subject line: attention-grabbing, under 50 characters (give me 3 options)
- Preheader: complement subject, under 90 characters
- Opening: hook the reader in the first line
- Body: 3 short paragraphs highlighting benefits (not just features)
- Include social proof or a statistic if relevant
- Clear, single call-to-action button text
- P.S. that adds urgency or reinforces the offer
- Total length: 150-200 words

Format ready to paste in an email tool.`,
  },
  // CODING
  {
    id: "code-review",
    title: "Code Review",
    description: "Get a detailed code review with suggestions.",
    category: "coding",
    variables: [
      { name: "language", label: "Programming language", placeholder: "e.g. Python, JavaScript, TypeScript", defaultValue: "TypeScript" },
      { name: "code", label: "Code to review", placeholder: "Paste your code here...", defaultValue: "", type: "textarea" },
    ],
    template: `Act as a senior {language} engineer with 10+ years of experience. Review the following code and provide detailed feedback.

Code:
\`\`\`{language}
{code}
\`\`\`

Please analyze:
1. **Correctness** — Are there any bugs or logic errors?
2. **Performance** — Are there inefficiencies or bottlenecks?
3. **Readability** — Is the code clear and maintainable?
4. **Best practices** — Does it follow {language} idioms and conventions?
5. **Security** — Any vulnerabilities or unsafe patterns?
6. **Testing** — Suggest test cases I should add.

For each issue found:
- Explain WHY it's a problem
- Show the improved code
- Rate severity: Critical / High / Medium / Low

End with a summary and an overall code quality score (1-10).`,
  },
  {
    id: "debug-error",
    title: "Debug Error",
    description: "Debug an error message step by step.",
    category: "coding",
    variables: [
      { name: "language", label: "Language/Framework", placeholder: "e.g. React, Node.js, Python", defaultValue: "React" },
      { name: "error", label: "Error message", placeholder: "Paste the full error here...", defaultValue: "", type: "textarea" },
      { name: "context", label: "What were you trying to do?", placeholder: "Brief description", defaultValue: "" },
    ],
    template: `Act as an expert {language} debugger. Help me solve this error step by step.

Error message:
\`\`\`
{error}
\`\`\`

What I was trying to do: {context}

Please:
1. **Explain the error in plain English** — what does it actually mean?
2. **Identify the most likely causes** (list 3-5 possibilities from most to least likely)
3. **Provide a step-by-step debugging plan** to isolate the issue
4. **Show the fix** with example code
5. **Explain how to prevent this** in the future

Be concise but thorough. Assume I have intermediate {language} knowledge.`,
  },
  {
    id: "explain-code",
    title: "Explain Code",
    description: "Get a clear explanation of any code snippet.",
    category: "coding",
    variables: [
      { name: "language", label: "Language", placeholder: "e.g. Python, Rust, Go", defaultValue: "Python" },
      { name: "code", label: "Code to explain", placeholder: "Paste your code here...", defaultValue: "", type: "textarea" },
      { name: "level", label: "Your experience level", placeholder: "beginner / intermediate / advanced", defaultValue: "intermediate" },
    ],
    template: `Explain the following {language} code in a way that's clear for a {level} developer:

\`\`\`{language}
{code}
\`\`\`

Please cover:
1. **High-level purpose** — what does this code do in one sentence?
2. **Step-by-step breakdown** — walk through it section by section
3. **Key concepts** — highlight any important patterns, algorithms or language features
4. **Edge cases** — what inputs might break this?
5. **Real-world use case** — where would you use this in practice?

Use analogies where helpful. Avoid unnecessary jargon.`,
  },
  // WRITING
  {
    id: "blog-post-outline",
    title: "Blog Post Outline",
    description: "Create a detailed SEO-friendly blog post outline.",
    category: "writing",
    variables: [
      { name: "topic", label: "Blog post topic", placeholder: "e.g. best productivity apps 2026", defaultValue: "best productivity apps 2026" },
      { name: "keyword", label: "Primary SEO keyword", placeholder: "e.g. productivity apps", defaultValue: "productivity apps" },
      { name: "audience", label: "Target audience", placeholder: "e.g. remote workers", defaultValue: "remote workers and freelancers" },
    ],
    template: `Act as an SEO content strategist. Create a detailed blog post outline about "{topic}".

SEO details:
- Primary keyword: {keyword}
- Target audience: {audience}
- Article length: 1500-2000 words
- Goal: rank #1 on Google

Please provide:
1. **5 SEO-optimized title options** (with keyword, under 60 characters)
2. **Meta description** (under 155 characters, includes keyword)
3. **Full outline** with:
   - H2 sections (5-7 sections)
   - H3 subsections under each H2
   - Bullet points for what to cover in each section
4. **Suggested internal linking opportunities**
5. **FAQ section** — 5 questions people search for related to this topic
6. **Call-to-action** ideas for the conclusion

Include LSI keywords and semantic variations throughout.`,
  },
  {
    id: "story-writer",
    title: "Short Story",
    description: "Write a creative short story with any premise.",
    category: "writing",
    variables: [
      { name: "genre", label: "Genre", placeholder: "e.g. sci-fi, romance, thriller", defaultValue: "sci-fi thriller" },
      { name: "premise", label: "Premise/Plot idea", placeholder: "Describe the story idea...", defaultValue: "A time traveler discovers they cannot change the past", type: "textarea" },
      { name: "length", label: "Length", placeholder: "short / medium / long", defaultValue: "medium (1000 words)" },
    ],
    template: `Act as a talented fiction writer. Write a {genre} short story based on this premise:

"{premise}"

Requirements:
- Length: {length}
- Show, don't tell — use vivid sensory details
- Strong opening that hooks the reader immediately
- Well-developed main character with a clear internal conflict
- Rising tension throughout
- Satisfying twist or emotional payoff at the end
- Dialogue that feels natural
- Avoid clichés

Write the complete story, ready to publish.`,
  },
  // DESIGN
  {
    id: "midjourney-prompt",
    title: "Midjourney/DALL-E Prompt",
    description: "Generate detailed prompts for AI image generators.",
    category: "design",
    variables: [
      { name: "subject", label: "Main subject", placeholder: "e.g. a cyberpunk cat", defaultValue: "a cyberpunk cat" },
      { name: "style", label: "Art style", placeholder: "e.g. photorealistic, anime, oil painting", defaultValue: "photorealistic" },
      { name: "mood", label: "Mood/Atmosphere", placeholder: "e.g. mysterious, cheerful, dark", defaultValue: "mysterious and moody" },
    ],
    template: `Create 3 highly detailed image generation prompts for Midjourney, DALL-E 3 or Stable Diffusion, featuring:

Main subject: {subject}
Style: {style}
Mood: {mood}

For each of the 3 prompts include:
- Subject description with specific details (colors, textures, expressions)
- Environment/setting with atmosphere
- Lighting (golden hour, neon, dramatic shadows, etc.)
- Camera specs (angle, lens, depth of field)
- Art style references (artist names, movements, or media)
- Composition (rule of thirds, centered, close-up, etc.)
- Color palette
- Technical parameters (--ar 16:9, --v 6, --quality 2, etc.)

Format each prompt as a single line ready to paste, with a short label above.`,
  },
  {
    id: "logo-brief",
    title: "Logo Design Brief",
    description: "Create a professional logo design brief.",
    category: "design",
    variables: [
      { name: "company", label: "Company name", placeholder: "e.g. Acme Coffee", defaultValue: "Acme Coffee" },
      { name: "industry", label: "Industry", placeholder: "e.g. specialty coffee shop", defaultValue: "specialty coffee shop" },
      { name: "personality", label: "Brand personality", placeholder: "e.g. warm, artisan, modern", defaultValue: "warm, artisan, modern" },
    ],
    template: `Create a comprehensive logo design brief for the following:

Company: {company}
Industry: {industry}
Brand personality: {personality}

Please provide:
1. **Brand analysis** — what values and emotions should the logo convey?
2. **Style direction** — minimalist / illustrative / typographic / abstract (with reasoning)
3. **Color palette** — suggest 3 palettes (primary + accents) with hex codes and reasoning
4. **Typography recommendations** — 3 font suggestions (serif / sans-serif / display) with rationale
5. **Symbolic elements** — imagery, icons or metaphors that would work well
6. **Composition ideas** — 3 different layout concepts (icon + text, monogram, wordmark, etc.)
7. **What to avoid** — clichés, overused elements, or things that don't fit the brand
8. **Reference brands** — 3-5 existing logos that inspire the direction

Deliver as a clean, professional brief a designer can immediately act on.`,
  },
  // EDUCATION
  {
    id: "explain-concept",
    title: "Explain Any Concept",
    description: "Get a clear explanation of any topic, at any level.",
    category: "education",
    variables: [
      { name: "concept", label: "Concept to explain", placeholder: "e.g. quantum entanglement", defaultValue: "quantum entanglement" },
      { name: "level", label: "Explain like I'm...", placeholder: "e.g. 5 years old, college student, expert", defaultValue: "a curious college student" },
      { name: "context", label: "Why do I want to learn this?", placeholder: "Optional context", defaultValue: "" },
    ],
    template: `Explain "{concept}" as if I were {level}.

{context}

Please structure your explanation as:
1. **One-sentence summary** — the simplest possible answer
2. **Analogy** — compare it to something familiar from everyday life
3. **The core idea** — break it down step by step
4. **Real-world examples** — 2-3 concrete examples
5. **Common misconceptions** — what people usually get wrong
6. **Why it matters** — practical importance or interesting implications
7. **What to learn next** — 3 related concepts to explore

Make it engaging, not dry. Use vivid language and clear structure.`,
  },
  {
    id: "study-plan",
    title: "Personalized Study Plan",
    description: "Create a customized study plan for any subject.",
    category: "education",
    variables: [
      { name: "subject", label: "What do you want to learn?", placeholder: "e.g. Spanish, web development, guitar", defaultValue: "web development" },
      { name: "timeline", label: "Timeline", placeholder: "e.g. 3 months, 6 months, 1 year", defaultValue: "3 months" },
      { name: "hours", label: "Hours per week", placeholder: "e.g. 10 hours", defaultValue: "10 hours" },
      { name: "current", label: "Current level", placeholder: "e.g. complete beginner, intermediate", defaultValue: "complete beginner" },
    ],
    template: `Act as an experienced tutor. Create a personalized study plan for me to learn "{subject}".

My situation:
- Timeline: {timeline}
- Available time: {hours} per week
- Current level: {current}

Please provide:
1. **Learning objectives** — 5 specific, measurable goals by the end of {timeline}
2. **Week-by-week roadmap** — what to focus on each week
3. **Recommended resources** — free and paid (books, courses, YouTube channels, apps)
4. **Practice projects** — 3-5 hands-on projects with increasing difficulty
5. **Milestones** — checkpoints to measure progress
6. **Common pitfalls** — mistakes beginners make and how to avoid them
7. **Community suggestions** — where to ask questions and get feedback

Be realistic about what can be achieved in {hours}/week over {timeline}.`,
  },
  // BUSINESS
  {
    id: "business-plan",
    title: "Business Plan Draft",
    description: "Create a lean business plan for any idea.",
    category: "business",
    variables: [
      { name: "idea", label: "Business idea", placeholder: "Describe your business idea...", defaultValue: "A subscription box for eco-friendly home products", type: "textarea" },
      { name: "market", label: "Target market", placeholder: "e.g. millennials in urban areas", defaultValue: "millennials and Gen Z in urban areas" },
    ],
    template: `Act as an experienced startup advisor. Create a lean one-page business plan for this idea:

Business idea: {idea}
Target market: {market}

Please include:
1. **Value proposition** — what problem does it solve? Why is it 10x better than alternatives?
2. **Target customer** — detailed persona (demographics, psychographics, pain points)
3. **Revenue model** — how does it make money? (subscription, one-time, freemium, etc.)
4. **Pricing strategy** — with concrete price points and reasoning
5. **Marketing channels** — top 3 channels with tactics
6. **Key metrics** — 3-5 KPIs to track success
7. **Competition analysis** — main competitors and your differentiator
8. **Costs & break-even** — main cost buckets and estimated monthly costs
9. **Risks & mitigation** — top 3 risks and how to address them
10. **Next 90 days** — concrete action steps to validate the idea

Be honest and specific — no fluff.`,
  },
  {
    id: "swot-analysis",
    title: "SWOT Analysis",
    description: "Get a detailed SWOT analysis of any business/idea.",
    category: "business",
    variables: [
      { name: "subject", label: "Subject of analysis", placeholder: "e.g. our new mobile app", defaultValue: "our new mobile app" },
      { name: "context", label: "Context/background", placeholder: "Describe the situation...", defaultValue: "", type: "textarea" },
    ],
    template: `Perform a detailed SWOT analysis for: {subject}

Context: {context}

Please provide:

**STRENGTHS** (internal, positive)
- 5-7 specific strengths with reasoning

**WEAKNESSES** (internal, negative)
- 5-7 honest weaknesses with reasoning

**OPPORTUNITIES** (external, positive)
- 5-7 market opportunities with reasoning

**THREATS** (external, negative)
- 5-7 credible threats with reasoning

After the SWOT, provide:
1. **Strategic recommendations** — 3-5 actions based on SWOT insights (S-O, W-O, S-T, W-T strategies)
2. **Top 3 priorities** — what to focus on in the next 90 days
3. **Key risks to monitor** — early warning signs to watch

Be brutally honest. A useful SWOT doesn't shy from weaknesses.`,
  },
];

export default function PromptGeneratorClient() {
  const [category, setCategory] = useState<Category>("marketing");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const templatesInCategory = useMemo(
    () => TEMPLATES.filter((t) => t.category === category),
    [category]
  );

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === selectedTemplateId) || templatesInCategory[0],
    [selectedTemplateId, templatesInCategory]
  );

  // Reseta seleção quando muda categoria
  const handleCategoryChange = (newCat: Category) => {
    setCategory(newCat);
    const firstTemplate = TEMPLATES.find((t) => t.category === newCat);
    if (firstTemplate) {
      setSelectedTemplateId(firstTemplate.id);
      setValues({});
    }
  };

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    setValues({});
  };

  const getValue = (variableName: string) => {
    if (values[variableName] !== undefined) return values[variableName];
    const variable = selectedTemplate.variables.find((v) => v.name === variableName);
    return variable?.defaultValue || "";
  };

  const generatedPrompt = useMemo(() => {
    let result = selectedTemplate.template;
    selectedTemplate.variables.forEach((v) => {
      const value = getValue(v.name);
      result = result.replaceAll(`{${v.name}}`, value || `[${v.label}]`);
    });
    return result;
  }, [selectedTemplate, values]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Category selector */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          CATEGORY
        </span>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategoryChange(c.id)}
              className={`font-mono text-xs tracking-widest px-3 py-2 rounded-full transition-colors ${
                category === c.id
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template selector */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          TEMPLATE ({templatesInCategory.length} available)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {templatesInCategory.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplateChange(t.id)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                selectedTemplateId === t.id
                  ? "bg-accent/10 border-accent"
                  : "bg-paper border-ink/10 hover:border-accent"
              }`}
            >
              <div className={`font-display font-semibold text-sm mb-1 ${
                selectedTemplateId === t.id ? "text-accent" : "text-ink"
              }`}>
                {t.title}
              </div>
              <div className="text-xs text-ink/60">{t.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Variables */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          CUSTOMIZE VARIABLES
        </span>
        <div className="flex flex-col gap-3">
          {selectedTemplate.variables.map((v) => (
            <div key={v.name}>
              <label
                htmlFor={`var-${v.name}`}
                className="font-mono text-[10px] tracking-widest text-ink/50 block mb-1"
              >
                {v.label.toUpperCase()}
              </label>
              {v.type === "textarea" ? (
                <textarea
                  id={`var-${v.name}`}
                  value={getValue(v.name)}
                  onChange={(e) => setValues({ ...values, [v.name]: e.target.value })}
                  placeholder={v.placeholder}
                  rows={4}
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
              ) : (
                <input
                  id={`var-${v.name}`}
                  type="text"
                  value={getValue(v.name)}
                  onChange={(e) => setValues({ ...values, [v.name]: e.target.value })}
                  placeholder={v.placeholder}
                  className="w-full border border-ink/15 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="bg-deep rounded-lg px-5 py-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-xs text-paper/50 tracking-widest">
            ✨ GENERATED PROMPT
          </span>
          <button
            type="button"
            onClick={copyPrompt}
            className="font-mono text-[10px] tracking-widest text-paper/70 hover:text-accent transition-colors"
          >
            {copied ? "✓ COPIED" : "COPY"}
          </button>
        </div>
        <pre className="font-mono text-xs text-accent overflow-x-auto whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
          {generatedPrompt}
        </pre>
      </div>

      {/* Tip */}
      <div className="bg-paper border border-ink/10 rounded-lg px-4 py-3 text-sm text-ink/70">
        <strong className="text-ink">💡 Tip:</strong> Copy the prompt above and
        paste it into <strong>ChatGPT</strong>, <strong>Claude</strong>,{" "}
        <strong>Gemini</strong> or any other AI model. All templates are
        model-agnostic and follow prompt engineering best practices.
      </div>
    </div>
  );
}