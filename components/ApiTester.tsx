"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { JsonViewer } from "./JsonViewer";
import { SectionHeader } from "./ui/SectionHeader";
import {
  Send,
  Copy,
  Check,
  Clock,
  ChevronDown,
  Trash2,
  RotateCcw,
  Terminal,
  X,
} from "lucide-react";

interface ApiTesterProps {
  baseUrl: string;
}

interface EndpointConfig {
  id: string;
  label: string;
  path: string;
  badge: string;
  badgeColor: string;
  params: { name: string; type: string; placeholder: string; required: boolean }[];
}

const endpoints: EndpointConfig[] = [
  {
    id: "profanity-all",
    label: "Fetch All Words",
    path: "/api/profanity",
    badge: "GET",
    badgeColor: "var(--accent)",
    params: [
      { name: "type", type: "select", placeholder: "", required: false },
    ],
  },
  {
    id: "profanity-search",
    label: "Search Words",
    path: "/api/profanity",
    badge: "GET",
    badgeColor: "var(--accent)",
    params: [
      { name: "type", type: "select", placeholder: "", required: false },
      { name: "word", type: "text", placeholder: "e.g., gago", required: false },
    ],
  },
  {
    id: "profanity-base",
    label: "Base Words (No Variants)",
    path: "/api/profanity/base",
    badge: "GET",
    badgeColor: "var(--accent)",
    params: [
      { name: "type", type: "select", placeholder: "", required: false },
    ],
  },
  {
    id: "check-text",
    label: "Check Text",
    path: "/api/check",
    badge: "GET",
    badgeColor: "var(--info)",
    params: [
      { name: "text", type: "textarea", placeholder: "Paste sentence and check if it contains profanity words...", required: true },
    ],
  },
];

interface HistoryEntry {
  id: string;
  endpoint: string;
  url: string;
  status: number;
  time: number;
  timestamp: number;
}

function buildUrl(baseUrl: string, path: string, params: Record<string, string>) {
  const base = baseUrl || "http://localhost:3000";
  const url = new URL(path, base);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

function getStatusColor(status: number) {
  if (status >= 200 && status < 300) return "var(--success)";
  if (status >= 400 && status < 500) return "var(--warning)";
  if (status >= 500) return "var(--error)";
  return "var(--text-muted)";
}

function formatTime(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function ApiTester({ baseUrl }: ApiTesterProps) {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [params, setParams] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("api-tester-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("api-tester-history", JSON.stringify(history.slice(0, 20)));
    } catch {}
  }, [history]);

  const endpoint = endpoints[activeEndpoint];

  const currentUrl = buildUrl(baseUrl, endpoint.path, params);

  const setParam = useCallback((key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const ep = endpoints[activeEndpoint];
    const defaultParams: Record<string, string> = {};
    ep.params.forEach((p) => {
      defaultParams[p.name] = p.name === "type" ? "all" : "";
    });
    setParams(defaultParams);
    setResult(null);
    setError(null);
    setStatus(null);
    setResponseTime(null);
  }, [activeEndpoint]);

  const runRequest = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setResult(null);
    setStatus(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const url = buildUrl(baseUrl, endpoint.path, params);
      const response = await fetch(url, { signal: controller.signal });
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      setStatus(response.status);
      setResponseTime(elapsed);

      const data = await response.json();
      setResult(data);

      setHistory((prev) => [
        {
          id: Date.now().toString(),
          endpoint: endpoint.label,
          url,
          status: response.status,
          time: elapsed,
          timestamp: Date.now(),
        },
        ...prev,
      ].slice(0, 20));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyCurl = async () => {
    const curl = `curl "${currentUrl}"`;
    await navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    const ep = endpoints.find((e) => e.label === entry.endpoint);
    if (ep) {
      const idx = endpoints.indexOf(ep);
      setActiveEndpoint(idx);
      try {
        const url = new URL(entry.url);
        const p: Record<string, string> = {};
        ep.params.forEach((param) => {
          p[param.name] = url.searchParams.get(param.name) || (param.name === "type" ? "all" : "");
        });
        setParams(p);
      } catch {}
    }
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("api-tester-history");
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runRequest();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <section id="api-tester" className="py-20 sm:py-28">
      <SectionHeader
        title="API Tester"
        description="Test the endpoints directly from your browser."
      />

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
        {/* Endpoint tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-[var(--border-subtle)] bg-[var(--bg-alt)] overflow-x-auto">
          {endpoints.map((ep, i) => (
            <button
              key={ep.id}
              onClick={() => setActiveEndpoint(i)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-[var(--radius-lg)] transition-all duration-150 whitespace-nowrap ${
                activeEndpoint === i
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]/50"
              }`}
            >
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${ep.badgeColor}15`,
                  color: ep.badgeColor,
                }}
              >
                {ep.badge}
              </span>
              {ep.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded-[var(--radius-lg)] transition-colors"
              title="Request history"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-alt)]">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Recent Requests
              </span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="px-4 pb-3 text-xs text-[var(--text-muted)]">No requests yet</p>
            ) : (
              <div className="max-h-48 overflow-y-auto px-2 pb-2">
                {history.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => loadFromHistory(entry)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-[var(--radius-md)] hover:bg-[var(--bg-surface)] transition-colors group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: getStatusColor(entry.status) }}
                    />
                    <span className="text-xs font-medium text-[var(--text-secondary)] truncate">
                      {entry.endpoint}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono ml-auto shrink-0">
                      {entry.status} · {formatTime(entry.time)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* URL bar */}
          <div className="flex items-stretch gap-2 mb-5">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                style={{
                  backgroundColor: `${endpoint.badgeColor}15`,
                  color: endpoint.badgeColor,
                }}
              >
                {endpoint.badge}
              </span>
              <span className="text-sm text-[var(--text-primary)] font-mono truncate">
                {currentUrl}
              </span>
            </div>
            <button
              onClick={copyUrl}
              className="px-3 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] transition-colors"
              title="Copy URL"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={copyCurl}
              className="px-3 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] transition-colors"
              title="Copy as cURL"
            >
              {copiedCurl ? (
                <Check className="w-4 h-4 text-[var(--success)]" />
              ) : (
                <Terminal className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Parameters */}
          <div className="space-y-4 mb-5">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Parameters
            </h4>
            {endpoint.params.map((param) => (
              <div key={param.name} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    {param.name}
                  </label>
                  {param.required && (
                    <span className="text-[10px] text-[var(--error)] font-medium">required</span>
                  )}
                </div>
                {param.type === "select" ? (
                  <div className="relative">
                    <select
                      value={params[param.name] || ""}
                      onChange={(e) => setParam(param.name, e.target.value)}
                      className="w-full h-10 px-3 pr-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="all">All</option>
                      <option value="filipino">Filipino</option>
                      <option value="regional">Regional</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                  </div>
                ) : param.type === "textarea" ? (
                  <textarea
                    value={params[param.name] || ""}
                    onChange={(e) => setParam(param.name, e.target.value)}
                    placeholder={param.placeholder}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm resize-none transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={params[param.name] || ""}
                    onChange={(e) => setParam(param.name, e.target.value)}
                    placeholder={param.placeholder}
                    className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm font-mono transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Send button */}
          <div className="flex items-center gap-3">
            <button
              onClick={runRequest}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[var(--radius-pill)] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{loading ? "Sending..." : "Send Request"}</span>
            </button>
            <span className="hidden sm:inline text-xs text-[var(--text-muted)]">
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded text-[10px] font-mono">
                Ctrl
              </kbd>
              {" + "}
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded text-[10px] font-mono">
                Enter
              </kbd>
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 p-4 bg-[var(--error-muted)] border border-[var(--error)]/10 rounded-[var(--radius-lg)] flex items-start gap-3">
              <X className="w-4 h-4 text-[var(--error)] mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--error)]">{error}</p>
            </div>
          )}

          {/* Response */}
          {(result || loading) && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Response
                </h3>
                {status !== null && (
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className="font-mono font-medium px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${getStatusColor(status)}15`,
                        color: getStatusColor(status),
                      }}
                    >
                      {status} {status === 200 ? "OK" : status === 400 ? "Bad Request" : status === 500 ? "Error" : ""}
                    </span>
                    {responseTime !== null && (
                      <span className="text-[var(--text-muted)] font-mono">
                        {formatTime(responseTime)}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-12 bg-[var(--bg-alt)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
                  <div className="w-6 h-6 border-2 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin" />
                </div>
              ) : (
                result && <JsonViewer data={result} title="Response Body" />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
