import { Badge } from "./ui/Badge";

export function Hero() {
  return (
    <section className="pt-24 pb-20 sm:pt-32 sm:pb-28">
      <div className="text-center">
        <Badge variant="accent" dot className="mb-8">
          API Live
        </Badge>

        <h1
          className="text-6xl sm:text-7xl lg:text-8xl font-semibold text-[var(--text-primary)] tracking-tight leading-[0.95] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Filipino
          <br />
          Profanity API
        </h1>

        <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-10 leading-relaxed">
          310 words across Filipino and regional dialects.
          Real-time detection via a free REST API.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#docs"
            className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[var(--radius-pill)] transition-all duration-200 active:scale-[0.98]"
          >
            View Documentation
          </a>
          <a
            href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] rounded-[var(--radius-pill)] transition-all duration-200"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
