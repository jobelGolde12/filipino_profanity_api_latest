export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <p>Built with Next.js, Turso, and Tailwind CSS</p>
          <a
            href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-secondary)] transition-colors"
          >
            View Source
          </a>
        </div>
      </div>
    </footer>
  );
}
