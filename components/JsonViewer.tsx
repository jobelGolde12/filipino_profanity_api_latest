"use client";

import React from "react";

interface JsonViewerProps {
  data: unknown;
  title?: string;
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null) {
      return <span className="text-[var(--warning)]">null</span>;
    }
    if (typeof value === "boolean") {
      return <span className="text-[var(--warning)]">{String(value)}</span>;
    }
    if (typeof value === "number") {
      return <span className="text-[var(--info)]">{String(value)}</span>;
    }
    if (typeof value === "string") {
      return <span className="text-[var(--success)]">&quot;{value}&quot;</span>;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-[var(--text-muted)]">[]</span>;
      }
      return (
        <>
          <span className="text-[var(--text-muted)]">[</span>
          <div className="ml-4">
            {value.map((item, index) => (
              <div key={index}>
                {renderValue(item)}
                {index < value.length - 1 && <span className="text-[var(--text-muted)]">,</span>}
              </div>
            ))}
          </div>
          <span className="text-[var(--text-muted)]">]</span>
        </>
      );
    }
    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <span className="text-[var(--text-muted)]">{"{}"}</span>;
      }
      return (
        <>
          <span className="text-[var(--text-muted)]">{"{"}</span>
          <div className="ml-4">
            {entries.map(([key, val], index) => (
              <div key={key}>
                <span className="text-[var(--accent)]">&quot;{key}&quot;</span>
                <span className="text-[var(--text-muted)]">: </span>
                {renderValue(val)}
                {index < entries.length - 1 && <span className="text-[var(--text-muted)]">,</span>}
              </div>
            ))}
          </div>
          <span className="text-[var(--text-muted)]">{"}"}</span>
        </>
      );
    }
    return <span className="text-[var(--text-secondary)]">{String(value)}</span>;
  };

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-[var(--text-muted)]">{title}</h3>
          <button
            onClick={copyToClipboard}
            className="px-2.5 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[var(--radius-pill)] transition-colors duration-200"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre className="p-4 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-auto text-sm font-mono max-h-80">
        <code className="text-[var(--text-secondary)] leading-relaxed">{renderValue(data)}</code>
      </pre>
    </div>
  );
}
