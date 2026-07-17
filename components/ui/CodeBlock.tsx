"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  language?: string;
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] border-b-0 rounded-t-[var(--radius-md)]">
        {language && (
          <span className="text-xs font-mono text-[var(--text-muted)]">{language}</span>
        )}
        <button
          onClick={copyToClipboard}
          className="ml-auto p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors rounded-[var(--radius-sm)]"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] border-t-0 rounded-b-[var(--radius-md)] overflow-x-auto">
        <code className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed">
          {children}
        </code>
      </pre>
    </div>
  );
}
