import { useState, useCallback } from "react";
import { Badge } from "./ui/Badge";

type ApiEndpoint = {
  method: "GET" | "POST";
  path: string;
  description: string;
};

const BASE_URL = "https://filipino-profanity-api-latest.vercel.app";

const endpoints: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/health",
    description: "Check API health status and database connectivity.",
  },
  {
    method: "GET",
    path: "/api/profanity",
    description: "Fetch all profanity words.",
  },
  {
    method: "POST",
    path: "/api/check",
    description: "Check if a text contains profanity and return matched words.",
  },
  {
    method: "POST",
    path: "/api/check/batch",
    description: "Check multiple texts for profanity in a single request.",
  },
  {
    method: "POST",
    path: "/api/mask",
    description: "Mask profanity words in a text (partial or full masking).",
  },
  {
    method: "GET",
    path: "/api/stats",
    description: "Get statistics about the profanity word database.",
  },
  {
    method: "GET",
    path: "/api/variants",
    description: "Fetch leetspeak variants for profanity words.",
  },
  {
    method: "GET",
    path: "/api/variants/lookup",
    description: "Check if text contains known leetspeak variants.",
  },
  {
    method: "POST",
    path: "/api/variants/lookup",
    description: "POST version of leetspeak lookup (JSON body with `text`).",
  },
];

// Copy Icon SVG Component
const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// Check Icon SVG Component (for success state)
const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function MethodBadge({ method }: { method: ApiEndpoint["method"] }) {
  const variant = method === "GET" ? "accent" : "info";
  return (
    <Badge 
      variant={variant} 
      className="shrink-0 font-semibold text-xs tracking-wide"
    >
      {method}
    </Badge>
  );
}

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
}

function CopyButton({ textToCopy, label = "Copy endpoint" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      
      // Reset after 2 seconds
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand("copy");
        setCopied(true);
        const timeout = setTimeout(() => {
          setCopied(false);
        }, 2000);
        return () => clearTimeout(timeout);
      } catch (err) {
        console.error("Failed to copy:", err);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      aria-label={label}
      title={copied ? "Copied!" : "Copy to clipboard"}
      className={`
        group flex items-center justify-center
        w-8 h-8 rounded-lg
        transition-all duration-200 ease-in-out
        ${copied 
          ? "bg-[var(--success-bg)] text-[var(--success-text)]" 
          : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        }
        focus:outline-none focus:ring-2 focus:ring-[var(--ring-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)]
      `}
    >
      <span className="sr-only">
        {copied ? "Copied to clipboard" : "Copy endpoint URL"}
      </span>
      {copied ? (
        <CheckIcon className="w-4 h-4" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </button>
  );
}

export function EndpointsSection() {
  return (
    <section id="endpoints" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 space-y-4">
          <h2
            className="text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            API Endpoints
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl">
            Explore our comprehensive REST API endpoints. Click the copy button to quickly grab any endpoint URL.
          </p>
          
          {/* Base URL Card */}
          <div className="mt-6 p-4 sm:p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-sm font-medium text-[var(--text-tertiary)] shrink-0">
                Base URL:
              </span>
              <code className="flex-1 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-sm font-mono text-[var(--text-primary)] break-all">
                {BASE_URL}
              </code>
              <CopyButton 
                textToCopy={BASE_URL} 
                label="Copy base URL"
              />
            </div>
          </div>
        </div>

        {/* Endpoints Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {endpoints.map((ep, index) => {
            const fullPath = `${BASE_URL}${ep.path}`;
            
            return (
              <article
                key={`${ep.method}-${ep.path}`}
                className="group relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 sm:p-6 transition-all duration-200 hover:border-[var(--border-default)] hover:shadow-lg"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Method and Path Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <MethodBadge method={ep.method} />
                    <code className="text-sm font-mono text-[var(--text-primary)] break-all truncate">
                      {ep.path}
                    </code>
                  </div>
                  <CopyButton 
                    textToCopy={fullPath}
                    label={`Copy ${ep.method} ${ep.path}`}
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {ep.description}
                </p>

                {/* Full URL Preview (shown on hover for desktop) */}
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <code className="text-xs font-mono text-[var(--text-tertiary)] break-all">
                    {fullPath}
                  </code>
                </div>

                {/* Decorative gradient border on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
              </article>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-center text-sm text-[var(--text-tertiary)]">
          <p>All endpoints return JSON responses. See documentation for request/response schemas.</p>
        </div>
      </div>
    </section>
  );
}