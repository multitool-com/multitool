import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SqlFormatterClient from "./SqlFormatterClient";

export const metadata: Metadata = {
  title: "SQL Formatter - Beautify SQL Queries Online | MultiTool",
  description:
    "Format SQL queries online with proper indentation and keyword casing. Supports MySQL, PostgreSQL, SQLite, T-SQL and more. Free, private, no upload.",
  keywords: [
    "sql formatter",
    "format sql online",
    "sql beautifier",
    "sql pretty print",
    "mysql formatter",
    "postgres formatter",
    "sql indent",
  ],
  alternates: {
    canonical:
      "https://www.multitoolbox.online/tools/developer-tools/sql-formatter",
  },
  openGraph: {
    title: "SQL Formatter - Beautify SQL Queries Online | MultiTool",
    description: "Format SQL for MySQL, PostgreSQL, SQLite and more. Private and free.",
    url: "https://www.multitoolbox.online/tools/developer-tools/sql-formatter",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Formatter",
    description: "Beautify SQL queries online — supports all major dialects.",
  },
};

export default function SqlFormatterPage() {
  return (
    <ToolLayout
      title="SQL Formatter"
      description="Turn long one-line queries into readable, properly indented SQL. Choose your dialect, keyword casing and indentation."
      categoryName="Developer Tools"
      categorySlug="developer-tools"
      toolSlug="sql-formatter"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How the SQL formatter works
          </h2>
          <p className="mb-4">
            The formatter tokenizes your query and re-prints it following
            SQL style conventions: each clause (SELECT, FROM, WHERE, JOIN,
            GROUP BY…) starts a new block, columns and conditions get one
            per line, and subqueries are indented inside their parentheses.
          </p>
          <p className="mb-4">
            Dialect matters for correct tokenization of things like
            <code> ::</code> casts (PostgreSQL), <code>#temp</code> tables
            (T-SQL) or backtick identifiers (MySQL) — pick yours from the
            list. Keyword casing (UPPERCASE, lowercase, preserved) is
            applied consistently.
          </p>
          <p className="mb-4">
            Use cases: reading queries extracted from logs or ORMs,
            cleaning up generated SQL before a code review, and making
            production queries debuggable. The formatter does not execute
            anything — it only re-prints text.
          </p>
          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            Formatting happens locally in your browser. Your queries are{" "}
            <strong>never sent to any server</strong> — safe even for
            schemas with sensitive names.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I format a SQL query online?",
          answer:
            "Paste the query, pick your database dialect and click Format. Long single-line queries become indented, clause-by-clause SQL you can actually read. Copy with one click.",
        },
        {
          question: "Which SQL dialects are supported?",
          answer:
            "Standard SQL, PostgreSQL, MySQL, MariaDB, SQLite, T-SQL (SQL Server), BigQuery, PL/SQL and more. The dialect mainly affects tokenizer details like casts, identifiers and temp tables.",
        },
        {
          question: "Should SQL keywords be uppercase?",
          answer:
            "It's style, not semantics — but UPPERCASE keywords is the most common convention because they visually separate from table/column names. Use the keyword case selector; mixed input is normalized.",
        },
        {
          question: "Does the formatter validate my SQL?",
          answer:
            "It re-prints queries token-by-token but does not check them against a database, so syntax errors in values or identifiers won't be flagged. It will not execute anything.",
        },
        {
          question: "Can it handle big queries with subqueries and CTEs?",
          answer:
            "Yes — WITH clauses, JOINs, subqueries and window functions are all indented hierarchically, which is exactly when formatting helps most.",
        },
        {
          question: "Is my query private?",
          answer:
            "Yes. Formatting is 100% client-side. Queries with internal table names or customer data never leave your browser.",
        },
      ]}
      relatedTools={[
        { name: "JSON Formatter", href: "/tools/developer-tools/json-formatter" },
        { name: "XML Formatter", href: "/tools/developer-tools/xml-formatter" },
        { name: "YAML Formatter", href: "/tools/developer-tools/yaml-formatter" },
        { name: "Regex Tester", href: "/tools/developer-tools/regex-tester" },
      ]}
    >
      <SqlFormatterClient />
    </ToolLayout>
  );
}
