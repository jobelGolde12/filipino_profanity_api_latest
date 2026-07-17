import { Badge } from "./ui/Badge";

export function Hero() {
  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="text-center">
        <Badge variant="success" dot className="mb-6">
          API Live
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-tight mb-4">
          Filipino Profanity API
        </h1>

        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
          A comprehensive collection of Filipino and regional profanity words with real-time
          detection capabilities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#docs"
            className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.98]"
          >
            View Documentation
          </a>
          <a
            href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-12 px-6 text-base font-medium text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)] rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.98]"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
