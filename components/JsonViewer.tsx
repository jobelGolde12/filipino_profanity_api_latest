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
      return <span className="text-orange-400">null</span>;
    }
    if (typeof value === "boolean") {
      return <span className="text-orange-400">{String(value)}</span>;
    }
    if (typeof value === "number") {
      return <span className="text-orange-400">{String(value)}</span>;
    }
    if (typeof value === "string") {
      return <span className="text-green-400">&quot;{value}&quot;</span>;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-zinc-400">[]</span>;
      }
      return (
        <>
          <span className="text-zinc-400">[</span>
          <div className="ml-4">
            {value.map((item, index) => (
              <div key={index}>
                {renderValue(item)}
                {index < value.length - 1 && <span className="text-zinc-400">,</span>}
              </div>
            ))}
          </div>
          <span className="text-zinc-400">]</span>
        </>
      );
    }
    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <span className="text-zinc-400">{"{}"}</span>;
      }
      return (
        <>
          <span className="text-zinc-400">{"{"}</span>
          <div className="ml-4">
            {entries.map(([key, val], index) => (
              <div key={key}>
                <span className="text-blue-400">&quot;{key}&quot;</span>
                <span className="text-zinc-400">: </span>
                {renderValue(val)}
                {index < entries.length - 1 && <span className="text-zinc-400">,</span>}
              </div>
            ))}
          </div>
          <span className="text-zinc-400">{"}"}</span>
        </>
      );
    }
    return <span className="text-yellow-400">{String(value)}</span>;
  };

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
        </div>
      )}
      <pre className="p-4 bg-[#1e1e1e] rounded-lg overflow-auto text-sm font-mono max-h-96 whitespace-pre-wrap">
        <code className="text-zinc-300">{renderValue(data)}</code>
      </pre>
    </div>
  );
}
