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

  const highlightJson = (obj: unknown): React.ReactNode => {
    if (obj === null) return <span className="text-orange-400">null</span>;
    if (typeof obj === "boolean") return <span className="text-orange-400">{String(obj)}</span>;
    if (typeof obj === "number") return <span className="text-orange-400">{obj}</span>;
    if (typeof obj === "string") return <span className="text-green-400">&quot;{obj}&quot;</span>;

    if (Array.isArray(obj)) {
      return (
        <>
          [<span className="text-zinc-500 mx-1"> </span>
          {obj.map((item, index) => (
            <React.Fragment key={index}>
              {highlightJson(item)}
              {index < obj.length - 1 && <span className="text-zinc-500">,</span>}
            </React.Fragment>
          ))}
          <span className="text-zinc-500 mx-1"> </span>]
        </>
      );
    }

    if (typeof obj === "object") {
      const entries = Object.entries(obj);
      return (
        <>
          {"{"}<span className="text-zinc-500 mx-1"> </span>
          {entries.map(([key, value], index) => (
            <React.Fragment key={key}>
              <span className="text-blue-400">&quot;{key}&quot;</span>
              <span className="text-zinc-400">: </span>
              {highlightJson(value)}
              {index < entries.length - 1 && <span className="text-zinc-500">,</span>}
            </React.Fragment>
          ))}
          <span className="text-zinc-500 mx-1"> </span>{"}"}
        </>
      );
    }

    return <span className="text-yellow-400">{String(obj)}</span>;
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
      <pre className="p-4 bg-[#1e1e1e] rounded-lg overflow-auto text-sm font-mono max-h-96">
        <code>{highlightJson(data)}</code>
      </pre>
    </div>
  );
}
