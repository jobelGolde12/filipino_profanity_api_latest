import { Badge } from "./ui/Badge";

type ApiEndpoint = {
  method: "GET" | "POST";
  path: string;
  description: string;
};

const endpoints: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/health",
    description: "Check API health status and database connectivity.",
  },
  {
    method: "GET",
    path: "/api/profanity",
    description: "Fetch profanity words with optional language filtering and pagination.",
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

function MethodBadge({ method }: { method: ApiEndpoint["method"] }) {
  const variant = method === "GET" ? "accent" : "info";
  return <Badge variant={variant}>{method}</Badge>;
}

export function EndpointsSection() {
  return (
    <section id="endpoints" className="py-20 sm:py-28">
      <div className="mb-8">
        <h2
          className="text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Endpoints
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
        {endpoints.map((ep) => (
          <div key={`${ep.method} ${ep.path}`} className="p-8 bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3 mb-3">
              <MethodBadge method={ep.method} />
              <code className="text-sm font-mono text-[var(--text-primary)]">{ep.path}</code>
            </div>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{ep.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

