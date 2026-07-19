"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/Badge";
import {
  Copy,
  Check,
  BookOpen,
  Code2,
  Terminal,
  Database,
  Layers,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

interface DocSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const sections: DocSection[] = [
  { id: "quick-start", label: "Quick Start", icon: <Code2 className="w-4 h-4" /> },
  { id: "api-reference", label: "API Reference", icon: <BookOpen className="w-4 h-4" /> },
  { id: "rate-limiting", label: "Rate Limiting", icon: <Terminal className="w-4 h-4" /> },
  { id: "setup", label: "Setup Guide", icon: <Terminal className="w-4 h-4" /> },
  { id: "database", label: "Database", icon: <Database className="w-4 h-4" /> },
  { id: "features", label: "Features", icon: <Layers className="w-4 h-4" /> },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-alt)] transition-all opacity-0 group-hover:opacity-100"
      aria-label="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="relative group rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)]">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-alt)] border-b border-[var(--border-subtle)]">
          <span className="text-xs font-mono text-[var(--text-muted)]">{language}</span>
        </div>
      )}
      <div className="relative">
        <CopyButton text={children} />
        <pre className="p-4 bg-[#0d1117] overflow-x-auto">
          <code className="text-sm font-mono leading-[1.75] text-[#c9d1d9]">{children}</code>
        </pre>
      </div>
    </div>
  );
}

function SyntaxCode({ children, language }: { children: React.ReactNode; language?: string }) {
  return (
    <div className="relative group rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)]">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-alt)] border-b border-[var(--border-subtle)]">
          <span className="text-xs font-mono text-[var(--text-muted)]">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 bg-[#0d1117] overflow-x-auto">
          <code className="text-sm font-mono leading-[1.75]">{children}</code>
        </pre>
      </div>
    </div>
  );
}

const K = ({ children }: { children: React.ReactNode }) => <span className="text-[#ff7b72]">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="text-[#a5d6ff]">{children}</span>;
const N = ({ children }: { children: React.ReactNode }) => <span className="text-[#79c0ff]">{children}</span>;
const F = ({ children }: { children: React.ReactNode }) => <span className="text-[#d2a8ff]">{children}</span>;
const C = ({ children }: { children: React.ReactNode }) => <span className="text-[#8b949e] italic">{children}</span>;
const O = ({ children }: { children: React.ReactNode }) => <span className="text-[#c9d1d9]">{children}</span>;
const V = ({ children }: { children: React.ReactNode }) => <span className="text-[#ffa657]">{children}</span>;
const KY = ({ children }: { children: React.ReactNode }) => <span className="text-[#7ee787]">{children}</span>;

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-[#0d1117] text-[#c9d1d9] font-mono text-[0.8em]">
      {children}
    </code>
  );
}

function Param({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-1.5 py-0.5 rounded bg-[var(--accent-muted)] text-[var(--accent)] font-mono text-xs">
      {children}
    </span>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3 bg-[var(--bg-alt)] border-b border-[var(--border-subtle)]">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-sm text-[var(--text-secondary)] border-b border-[var(--border-subtle)]">
      {children}
    </td>
  );
}

function QuickStart({ origin }: { origin: string }) {
  return (
    <section id="quick-start" className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Quick Start
      </h2>
      <p className="text-[var(--text-secondary)] mb-8">Integrate profanity detection in two lines of code.</p>
      <div className="space-y-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="accent">GET</Badge>
            <code className="text-sm font-mono text-[var(--text-primary)]">/api/profanity</code>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Fetch profanity words with optional filtering by language and search.</p>
          <div className="mb-4">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Parameters</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-4">
                <Param>type</Param>
                <span className="text-[var(--text-tertiary)]">Filter by language: <InlineCode>filipino</InlineCode>, <InlineCode>regional</InlineCode>, or <InlineCode>all</InlineCode></span>
              </div>
              <div className="flex gap-4">
                <Param>word</Param>
                <span className="text-[var(--text-tertiary)]">Search for a specific word (optional)</span>
              </div>
              <div className="flex gap-4">
                <Param>page</Param>
                <span className="text-[var(--text-tertiary)]">Page number (default: 1)</span>
              </div>
              <div className="flex gap-4">
                <Param>limit</Param>
                <span className="text-[var(--text-tertiary)]">Items per page (default: 50, max: 200)</span>
              </div>
            </div>
          </div>
          <SyntaxCode language="JavaScript">
            <K>const</K> <V>response</V> <O>=</O> <K>await</K> <F>fetch</F>(<S>{`'${origin}/api/profanity?type=all&page=1&limit=50'`}</S>);
            {"\n"}<K>const</K> <V>data</V> <O>=</O> <K>await</K> <V>response</V>.<F>json</F>();
          </SyntaxCode>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="info">POST</Badge>
            <code className="text-sm font-mono text-[var(--text-primary)]">/api/check</code>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Check any text for profanity and receive matched words with details.</p>
          <div className="mb-4">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Request Body</h4>
            <div className="text-sm text-[var(--text-tertiary)]">
              <InlineCode>{"{ \"text\": \"your text here\" }"}</InlineCode>
            </div>
          </div>
          <SyntaxCode language="JavaScript">
            <K>const</K> <V>response</V> <O>=</O> <K>await</K> <F>fetch</F>(<S>{`'${origin}/api/check'`}</S>, {"{"}{"\n"}
            {"  "}<V>method</V>: <S>&apos;POST&apos;</S>,{"\n"}
            {"  "}<V>headers</V>: {"{ "}<V>Content-Type</V>: <S>&apos;application/json&apos;</S>{" }"},{"\n"}
            {"  "}<V>body</V>: <V>JSON</V>.<F>stringify</F>({"{ "}<V>text</V>: <S>&apos;your text here&apos;</S>{" }"}),{"\n"}
            {"}"});
            {"\n"}<K>const</K> <V>data</V> <O>=</O> <K>await</K> <V>response</V>.<F>json</F>();
          </SyntaxCode>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="info">POST</Badge>
            <code className="text-sm font-mono text-[var(--text-primary)]">/api/mask</code>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Mask profanity words in text with asterisks or custom characters.</p>
          <div className="mb-4">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Request Body</h4>
            <div className="text-sm text-[var(--text-tertiary)]">
              <InlineCode>{"{ \"text\": \"your text here\", \"maskChar\": \"*\", \"partial\": true }"}</InlineCode>
            </div>
          </div>
          <SyntaxCode language="JavaScript">
            <K>const</K> <V>response</V> <O>=</O> <K>await</K> <F>fetch</F>(<S>{`'${origin}/api/mask'`}</S>, {"{"}{"\n"}
            {"  "}<V>method</V>: <S>&apos;POST&apos;</S>,{"\n"}
            {"  "}<V>headers</V>: {"{ "}<V>Content-Type</V>: <S>&apos;application/json&apos;</S>{" }"},{"\n"}
            {"  "}<V>body</V>: <V>JSON</V>.<F>stringify</F>({"{"}{"\n"}
            {"    "}<V>text</V>: <S>&apos;You are a gago&apos;</S>,{"\n"}
            {"    "}<V>maskChar</V>: <S>&apos;*&apos;</S>,{"\n"}
            {"    "}<V>partial</V>: <KY>true</KY>{"\n"}
            {"  }"}),{"\n"}
            {"}"});
            {"\n"}<K>const</K> <V>data</V> <O>=</O> <K>await</K> <V>response</V>.<F>json</F>();
          </SyntaxCode>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="info">POST</Badge>
            <code className="text-sm font-mono text-[var(--text-primary)]">/api/contribute</code>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Submit a new profanity word for review.</p>
          <div className="mb-4">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Request Body</h4>
            <div className="text-sm text-[var(--text-tertiary)]">
              <InlineCode>{"{ \"word\": \"new-word\", \"language\": \"filipino\" }"}</InlineCode>
            </div>
          </div>
          <SyntaxCode language="JavaScript">
            <K>const</K> <V>response</V> <O>=</O> <K>await</K> <F>fetch</F>(<S>{`'${origin}/api/contribute'`}</S>, {"{"}{"\n"}
            {"  "}<V>method</V>: <S>&apos;POST&apos;</S>,{"\n"}
            {"  "}<V>headers</V>: {"{ "}<V>Content-Type</V>: <S>&apos;application/json&apos;</S>{" }"},{"\n"}
            {"  "}<V>body</V>: <V>JSON</V>.<F>stringify</F>({"{"}{"\n"}
            {"    "}<V>word</V>: <S>&apos;new-word&apos;</S>,{"\n"}
            {"    "}<V>language</V>: <S>&apos;filipino&apos;</S>,{"\n"}
            {"    "}<V>email</V>: <S>&apos;user@example.com&apos;</S> <C>{"// optional"}</C>{"\n"}
            {"  }"}),{"\n"}
            {"}"});
            {"\n"}<K>const</K> <V>data</V> <O>=</O> <K>await</K> <V>response</V>.<F>json</F>();
          </SyntaxCode>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-6">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Python</h3>
          <SyntaxCode language="Python">
            <K>import</K> <V>requests</V>
            {"\n\n"}<V>response</V> <O>=</O> <V>requests</V>.<F>get</F>(<S>{`'${origin}/api/profanity?type=all'`}</S>)
            {"\n"}<V>data</V> <O>=</O> <V>response</V>.<F>json</F>()
          </SyntaxCode>
        </div>
      </div>
    </section>
  );
}

function ApiReference({ origin }: { origin: string }) {
  return (
    <section id="api-reference" className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
        API Reference
      </h2>
      <div className="space-y-10">
        {/* Health Check */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">GET /api/health</h3>
            <Badge variant="success">Health</Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Check API health status and database connectivity.</p>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Example Request</h4>
          <CodeBlock language="bash">{`curl ${origin}/api/health`}</CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response (200 OK)</h4>
          <CodeBlock language="json">
{`{
  "status": "ok",
  "timestamp": "2025-01-19T12:00:00.000Z",
  "uptime": 3600.5,
  "database": {
    "connected": true,
    "wordCount": "310+"
  },
  "version": "1.0.0",
  "responseTime": "12ms"
}`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response (503 Degraded)</h4>
          <CodeBlock language="json">
{`{
  "status": "degraded",
  "database": {
    "connected": false,
    "wordCount": 0
  }
}`}
          </CodeBlock>
        </div>

        {/* Profanity List */}
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">GET /api/profanity</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Fetch profanity words with optional filtering and pagination.</p>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Query Parameters</h4>
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr>
                  <TableHeader>Parameter</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Required</TableHeader>
                  <TableHeader>Description</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell><InlineCode>type</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Filter by language: <InlineCode>filipino</InlineCode>, <InlineCode>regional</InlineCode>, <InlineCode>all</InlineCode></TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>word</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Search for a specific word</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>page</InlineCode></TableCell>
                  <TableCell>integer</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Page number (default: 1)</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>limit</InlineCode></TableCell>
                  <TableCell>integer</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Items per page (default: 50, max: 200)</TableCell>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Example Requests</h4>
          <CodeBlock language="bash">
{`# Fetch all profanity words (first page)
curl ${origin}/api/profanity

# Fetch with pagination
curl "${origin}/api/profanity?page=1&limit=25"

# Fetch only Filipino profanity
curl ${origin}/api/profanity?type=filipino

# Search for a specific word
curl "${origin}/api/profanity?word=gago"`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response</h4>
          <CodeBlock language="json">
{`{
  "success": true,
  "type": "all",
  "count": 50,
  "source": "database",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 310,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": false
  },
  "data": [
    {
      "word": "abnormal",
      "language": "filipino",
      "region": null,
      "severity": "medium"
    }
  ]
}`}
          </CodeBlock>
        </div>

        {/* Check Text */}
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">POST /api/check</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Check if a text contains profanity.</p>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Request Body</h4>
          <CodeBlock language="json">
{`{
  "text": "Sample text to check"
}`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Example Request</h4>
          <CodeBlock language="bash">
{`curl -X POST ${origin}/api/check \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This text contains gago"}'`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response</h4>
          <CodeBlock language="json">
{`{
  "success": true,
  "hasProfanity": true,
  "count": 1,
  "data": [
    {
      "word": "gago",
      "language": "filipino",
      "region": null,
      "severity": "medium"
    }
  ]
}`}
          </CodeBlock>
        </div>

        {/* Batch Check */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">POST /api/check/batch</h3>
            <Badge variant="accent">New</Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Check multiple texts for profanity in a single request.</p>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Request Body</h4>
          <CodeBlock language="json">
{`{
  "texts": [
    "First text to check",
    "Second text to check",
    "Third text to check"
  ]
}`}
          </CodeBlock>
          <div className="mt-4 p-4 rounded-[var(--radius-lg)] bg-[var(--info-muted)] border border-[var(--info)]/10">
            <p className="text-sm text-[var(--info)]">Maximum 10 texts per request. Each text must not exceed 5,000 characters.</p>
          </div>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Example Request</h4>
          <CodeBlock language="bash">
{`curl -X POST ${origin}/api/check/batch \\
  -H "Content-Type: application/json" \\
  -d '{"texts": ["Hello world", "You are gago"]}'`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response</h4>
          <CodeBlock language="json">
{`{
  "success": true,
  "totalTexts": 2,
  "textsWithProfanity": 1,
  "results": [
    {
      "text": "Hello world",
      "hasProfanity": false,
      "count": 0,
      "data": []
    },
    {
      "text": "You are gago",
      "hasProfanity": true,
      "count": 1,
      "data": [
        {
          "word": "gago",
          "language": "filipino",
          "region": null,
          "severity": "medium"
        }
      ]
    }
  ]
}`}
          </CodeBlock>
        </div>

        {/* Mask Text */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">POST /api/mask</h3>
            <Badge variant="accent">New</Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Mask profanity words in text with asterisks or custom characters.</p>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Request Body</h4>
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr>
                  <TableHeader>Parameter</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Default</TableHeader>
                  <TableHeader>Description</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell><InlineCode>text</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>required</TableCell>
                  <TableCell>Text to mask (max 10,000 characters)</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>maskChar</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>*</TableCell>
                  <TableCell>Single character to use for masking</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>partial</InlineCode></TableCell>
                  <TableCell>boolean</TableCell>
                  <TableCell>true</TableCell>
                  <TableCell>Keep first letter visible (e.g., g***)</TableCell>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Example Request</h4>
          <CodeBlock language="bash">
{`curl -X POST ${origin}/api/mask \\
  -H "Content-Type: application/json" \\
  -d '{"text": "You are a gago", "maskChar": "*", "partial": true}'`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response</h4>
          <CodeBlock language="json">
{`{
  "success": true,
  "original": "You are a gago",
  "masked": "You are a g***",
  "matchCount": 1,
  "matches": ["gago"],
  "details": [
    {
      "word": "gago",
      "start": 10,
      "end": 14,
      "original": "gago",
      "masked": "g***"
    }
  ]
}`}
          </CodeBlock>
        </div>

        {/* Statistics */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">GET /api/stats</h3>
            <Badge variant="accent">New</Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Get statistics about the profanity word database.</p>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Example Request</h4>
          <CodeBlock language="bash">{`curl ${origin}/api/stats`}</CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response</h4>
          <CodeBlock language="json">
{`{
  "success": true,
  "total": "310+",
  "byLanguage": {
    "filipino": {
      "count": "110+",
      "percentage": 35
    },
    "regional": {
      "count": "200+",
      "percentage": 65
    }
  },
  "bySeverity": {
    "low": 0,
    "medium": "310+",
    "high": 0
  },
  "byRegion": {
    "none": "110+",
    "visayan": "200+"
  },
  "source": "database"
}`}
          </CodeBlock>
        </div>

        {/* Contribute Word */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">POST /api/contribute</h3>
            <Badge variant="accent">New</Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Submit a new profanity word for review. Submitted words are reviewed by admins before being added to the database.</p>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Request Body</h4>
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr>
                  <TableHeader>Parameter</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Required</TableHeader>
                  <TableHeader>Description</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell><InlineCode>word</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>The profanity word to submit (min 2 characters)</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>language</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Language category: <InlineCode>filipino</InlineCode> or <InlineCode>regional</InlineCode></TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>region</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>If regional</TableCell>
                  <TableCell>Regional dialect (e.g., Visayan, Ilokano, Bicolano)</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>email</InlineCode></TableCell>
                  <TableCell>string</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Email to notify when word is added</TableCell>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Example Request</h4>
          <CodeBlock language="bash">
{`curl -X POST ${origin}/api/contribute \\
  -H "Content-Type: application/json" \\
  -d '{
    "word": "new-word",
    "language": "filipino",
    "email": "user@example.com"
  }'`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Response (201 Created)</h4>
          <CodeBlock language="json">
{`{
  "success": true,
  "message": "Word submitted for review"
}`}
          </CodeBlock>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Error Response (400 Bad Request)</h4>
          <CodeBlock language="json">
{`{
  "success": false,
  "error": "Word and language are required"
}`}
          </CodeBlock>
        </div>

        {/* Error Responses */}
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Error Responses</h3>
          <CodeBlock language="json">
{`{
  "success": false,
  "error": "Invalid type parameter. Use: filipino, regional, or all"
}`}
          </CodeBlock>
        </div>

        {/* Code Examples */}
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Code Examples</h3>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">JavaScript (Fetch)</h4>
          <SyntaxCode language="JavaScript">
            <K>async function</K> <F>getData</F>() {"{"}{"\n"}
            {"  "}<K>try</K> {"{"}{"\n"}
            {"    "}<K>const</K> <V>response</V> <O>=</O> <K>await</K> <F>fetch</F>(<S>{`"${origin}/api/profanity?type=all"`}</S>);{"\n"}
            {"    "}<K>if</K> (!<V>response</V>.<V>ok</V>) {"{"}{"\n"}
            {"      "}<K>throw new</K> <F>Error</F>(<S>&quot;HTTP error! Status: &quot;</S> <O>+</O> <V>response</V>.<V>status</V>);{"\n"}
            {"    }"}{"\n"}
            {"    "}<K>const</K> <V>data</V> <O>=</O> <K>await</K> <V>response</V>.<F>json</F>();{"\n"}
            {"    "}<V>console</V>.<F>log</F>(<V>data</V>);{"\n"}
            {"  }"} <K>catch</K> (<V>error</V>) {"{"}{"\n"}
            {"    "}<V>console</V>.<F>error</F>(<S>&quot;Error fetching data:&quot;</S>, <V>error</V>);{"\n"}
            {"  }"}{"\n"}{"}"}
            {"\n\n"}<F>getData</F>();
          </SyntaxCode>
          <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Python</h4>
          <SyntaxCode language="Python">
            <K>import</K> <V>requests</V>
            {"\n\n"}<K>try</K>:{"\n"}
            {"    "}<V>response</V> <O>=</O> <V>requests</V>.<F>get</F>(<S>{`"${origin}/api/profanity?type=all"`}</S>){"\n"}
            {"    "}<V>response</V>.<F>raise_for_status</F>(){"\n"}
            {"    "}<V>data</V> <O>=</O> <V>response</V>.<F>json</F>(){"\n"}
            {"    "}<F>print</F>(<V>data</V>){"\n"}
            <K>except</K> <V>requests</V>.<V>exceptions</V>.<V>RequestException</V> <K>as</K> <V>e</V>:{"\n"}
            {"    "}<F>print</F>(<S>&quot;Error fetching data:&quot;</S>, <V>e</V>)
          </SyntaxCode>
        </div>
      </div>
    </section>
  );
}

function RateLimitingSection({ origin }: { origin: string }) {
  return (
    <section id="rate-limiting" className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Rate Limiting
      </h2>
      <div className="space-y-6">
        <p className="text-[var(--text-secondary)]">
          All API endpoints are rate-limited to prevent abuse. Rate limits are applied per IP address.
        </p>
        <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <TableHeader>Endpoint</TableHeader>
                <TableHeader>Limit</TableHeader>
                <TableHeader>Window</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell><InlineCode>GET /api/profanity</InlineCode></TableCell>
                <TableCell>60 requests</TableCell>
                <TableCell>1 minute</TableCell>
              </tr>
              <tr>
                <TableCell><InlineCode>GET /api/stats</InlineCode></TableCell>
                <TableCell>60 requests</TableCell>
                <TableCell>1 minute</TableCell>
              </tr>
              <tr>
                <TableCell><InlineCode>GET /api/health</InlineCode></TableCell>
                <TableCell>No limit</TableCell>
                <TableCell>N/A</TableCell>
              </tr>
              <tr>
                <TableCell><InlineCode>POST /api/check</InlineCode></TableCell>
                <TableCell>30 requests</TableCell>
                <TableCell>1 minute</TableCell>
              </tr>
              <tr>
                <TableCell><InlineCode>POST /api/mask</InlineCode></TableCell>
                <TableCell>30 requests</TableCell>
                <TableCell>1 minute</TableCell>
              </tr>
              <tr>
                <TableCell><InlineCode>POST /api/check/batch</InlineCode></TableCell>
                <TableCell>20 requests</TableCell>
                <TableCell>1 minute</TableCell>
              </tr>
              <tr>
                <TableCell><InlineCode>POST /api/contribute</InlineCode></TableCell>
                <TableCell>10 requests</TableCell>
                <TableCell>1 minute</TableCell>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Response Headers</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Every rate-limited response includes these headers:
          </p>
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <TableHeader>Header</TableHeader>
                  <TableHeader>Description</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell><InlineCode>X-RateLimit-Limit</InlineCode></TableCell>
                  <TableCell>Maximum requests allowed per window</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>X-RateLimit-Remaining</InlineCode></TableCell>
                  <TableCell>Requests remaining in current window</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>X-RateLimit-Reset</InlineCode></TableCell>
                  <TableCell>Unix timestamp when the window resets</TableCell>
                </tr>
                <tr>
                  <TableCell><InlineCode>Retry-After</InlineCode></TableCell>
                  <TableCell>Seconds until you can retry (only on 429)</TableCell>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--warning-muted)] border border-[var(--warning)]/10">
          <h4 className="text-sm font-medium text-[var(--warning)] mb-1">Rate Limit Exceeded</h4>
          <p className="text-sm text-[var(--text-secondary)]">
            When you exceed the rate limit, you&apos;ll receive a 429 status code with a <InlineCode>Retry-After</InlineCode> header indicating how many seconds to wait.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Example</h3>
          <CodeBlock language="bash">
{`# Check rate limit headers
curl -I ${origin}/api/profanity

# Response headers:
# X-RateLimit-Limit: 60
# X-RateLimit-Remaining: 59
# X-RateLimit-Reset: 1705658460`}
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}

function SetupGuide() {
  return (
    <section id="setup" className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Setup Guide
      </h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Prerequisites</h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />Node.js 18+</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />npm or yarn</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />Turso account (optional for local development)</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Installation</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-2">1. Clone the repository</p>
              <CodeBlock language="bash">{"git clone <repository-url>\ncd filipino_profanity_api"}</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-2">2. Install dependencies</p>
              <CodeBlock language="bash">npm install</CodeBlock>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-2">3. Create environment file</p>
              <CodeBlock language="bash">cp .env.example .env</CodeBlock>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Environment Variables</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">Edit <InlineCode>.env</InlineCode> file with your Turso credentials:</p>
          <CodeBlock language="env">
{`TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here`}
          </CodeBlock>
          <div className="mt-4 p-4 rounded-[var(--radius-lg)] bg-[var(--info-muted)] border border-[var(--info)]/10">
            <p className="text-sm text-[var(--info)]">For local development without Turso, the API will automatically use JSON fallback.</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Running the Development Server</h3>
          <CodeBlock language="bash">npm run dev</CodeBlock>
          <p className="text-sm text-[var(--text-secondary)] mt-3">Open <a href="http://localhost:3000" className="text-[var(--accent)] hover:underline">http://localhost:3000</a> to view the application.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Building for Production</h3>
          <CodeBlock language="bash">{"npm run build\nnpm start"}</CodeBlock>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Database Setup (Optional)</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">To use Turso database instead of JSON fallback:</p>
          <div className="space-y-4 text-sm text-[var(--text-secondary)]">
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center text-xs font-medium">1</span>
              <span>Create a Turso account at <a href="https://turso.tech" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">turso.tech</a></span>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center text-xs font-medium">2</span>
              <span className="flex-1">Create a new database</span>
            </div>
            <div className="ml-9"><CodeBlock language="bash">turso db create filipino-profanity</CodeBlock></div>
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center text-xs font-medium">3</span>
              <span className="flex-1">Get the database URL and auth token</span>
            </div>
            <div className="ml-9">
              <CodeBlock language="bash">{"turso db show filipino-profanity --url\nturso auth token"}</CodeBlock>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center text-xs font-medium">4</span>
              <span>Update your <InlineCode>.env</InlineCode> file with these values</span>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center text-xs font-medium">5</span>
              <span className="flex-1">Seed the database</span>
            </div>
            <div className="ml-9"><CodeBlock language="bash">npx tsx scripts/seed.ts</CodeBlock></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DatabaseSection() {
  return (
    <section id="database" className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Database
      </h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Schema</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">The profanity table stores words with language and regional information.</p>
          <SyntaxCode language="sql">
            <K>CREATE TABLE</K> <V>profanity</V> (<K>id</K> <K>INTEGER PRIMARY KEY AUTOINCREMENT</K>, <K>word</K> <K>TEXT NOT NULL</K>, <K>language</K> <K>TEXT NOT NULL</K>, <K>region</K> <K>TEXT</K>, <K>severity</K> <K>TEXT</K>, <K>created_at</K> <K>DATETIME DEFAULT CURRENT_TIMESTAMP</K>);
          </SyntaxCode>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Fields</h3>
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <TableHeader>Field</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Description</TableHeader>
                </tr>
              </thead>
              <tbody>
                {[
                  ["id", "INTEGER", "Primary key, auto-incrementing"],
                  ["word", "TEXT", "The profanity word (required)"],
                  ["language", "TEXT", "Language category: filipino or regional"],
                  ["region", "TEXT", "Regional dialect (e.g., visayan)"],
                  ["severity", "TEXT", "Severity level: low, medium, high"],
                  ["created_at", "DATETIME", "Timestamp when word was added"],
                ].map(([field, type, desc]) => (
                  <tr key={field}>
                    <TableCell><InlineCode>{field}</InlineCode></TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>{desc}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Seeding Process</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">The seed script populates the database from JSON files:</p>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)] mb-4">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /><InlineCode>api/pure_filipino.json</InlineCode> &mdash; Filipino profanity words</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /><InlineCode>api/regional.json</InlineCode> &mdash; Regional dialect profanity words</li>
          </ul>
          <CodeBlock language="bash">npx tsx scripts/seed.ts</CodeBlock>
          <p className="text-sm text-[var(--text-secondary)] mt-3">The script creates the table, checks for existing data, and inserts all words.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Migration Guide</h3>
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">Adding New Words</h4>
          <p className="text-sm text-[var(--text-secondary)] mb-3">Add words to the appropriate JSON file, then re-run the seed script:</p>
          <CodeBlock language="bash">npx tsx scripts/seed.ts</CodeBlock>
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 mt-6">Manual Insert</h4>
          <CodeBlock language="sql">
{`INSERT INTO profanity (word, language, region, severity)
VALUES ('new-word', 'filipino', NULL, 'medium');`}
          </CodeBlock>
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 mt-6">Query Examples</h4>
          <CodeBlock language="sql">
{`-- Get all Filipino profanity
SELECT * FROM profanity WHERE language = 'filipino';

-- Get all regional profanity from Visayas
SELECT * FROM profanity WHERE language = 'regional' AND region = 'visayan';

-- Search for a specific word
SELECT * FROM profanity WHERE word LIKE '%gago%';`}
          </CodeBlock>
        </div>
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--warning-muted)] border border-[var(--warning)]/10">
          <h4 className="text-sm font-medium text-[var(--warning)] mb-1">Fallback Behavior</h4>
          <p className="text-sm text-[var(--text-secondary)]">If the database connection fails or the table doesn&apos;t exist, the API automatically falls back to serving data from the JSON files. This ensures the API remains functional even without database configuration.</p>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "Profanity Fetching", desc: "Filter by language type (Filipino, Regional, All) and search for specific words.", badge: "GET", variant: "accent" as const },
    { title: "Profanity Detection", desc: "Real-time text analysis that identifies profanity matches with metadata.", badge: "POST", variant: "info" as const },
    { title: "Text Masking", desc: "Mask profanity words with asterisks or custom characters. Partial masking keeps first letter visible.", badge: "POST", variant: "accent" as const },
    { title: "Batch Checking", desc: "Check multiple texts for profanity in a single request (up to 10 texts).", badge: "POST", variant: "info" as const },
    { title: "Word Contribution", desc: "Submit new profanity words for review. Community-driven word database expansion.", badge: "POST", variant: "accent" as const },
    { title: "Health Check", desc: "Monitor API health status and database connectivity.", badge: "GET", variant: "success" as const },
    { title: "Statistics", desc: "Get word counts by language, severity, and region.", badge: "GET", variant: "success" as const },
    { title: "Rate Limiting", desc: "Built-in rate limiting with clear headers and retry guidance.", badge: null, variant: "warning" as const },
    { title: "Pagination", desc: "Paginated responses for large datasets with metadata.", badge: null, variant: "warning" as const },
  ];
  return (
    <section id="features" className="mb-20 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Features
      </h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Core Features</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  {f.badge && <Badge variant={f.variant}>{f.badge}</Badge>}
                  <h4 className="text-sm font-medium text-[var(--text-primary)]">{f.title}</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Technology Stack</h3>
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <TableHeader>Component</TableHeader>
                  <TableHeader>Technology</TableHeader>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Framework", "Next.js 16+"],
                  ["Styling", "Tailwind CSS v4"],
                  ["Icons", "Lucide React"],
                  ["Database", "Turso (libSQL)"],
                  ["API", "Next.js Route Handlers"],
                  ["Language", "TypeScript"],
                ].map(([comp, tech]) => (
                  <tr key={comp}>
                    <TableCell>{comp}</TableCell>
                    <TableCell><InlineCode>{tech}</InlineCode></TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quick-start");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const origin = baseUrl || "http://localhost:3000";

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.offsetTop <= scrollY) {
        setActiveSection(sections[i].id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Header />
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="flex gap-12 py-10">
          <aside className="hidden lg:block fixed left-0 top-0 h-screen w-56 pt-24 pb-8 pl-6 sm:pl-8 bg-[var(--bg-base)] z-40 overflow-y-auto">
            <div>
              <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to home
              </a>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-[var(--radius-md)] transition-all duration-150 ${
                      activeSection === section.id
                        ? "bg-[var(--accent-muted)] text-[var(--accent)] font-medium"
                        : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-alt)]"
                    }`}
                  >
                    {section.icon}
                    {section.label}
                    {activeSection === section.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0 max-w-3xl lg:ml-56">
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--text-primary)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Documentation
              </h1>
              <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl">
                Everything you need to integrate Filipino profanity detection into your application.
              </p>
            </div>
            <QuickStart origin={origin} />
            <ApiReference origin={origin} />
            <RateLimitingSection origin={origin} />
            <SetupGuide />
            <DatabaseSection />
            <FeaturesSection />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
