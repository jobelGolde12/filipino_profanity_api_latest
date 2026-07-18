import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-2.5">
            <Image
              src="/profanity_api_logo.png"
              alt="Filipino Profanity API"
              width={40}
              height={40}
              className="rounded-[var(--radius-sm)]"
            />
            <span>Built with Next.js, Turso, and Tailwind CSS</span>
          </div>
          <a
            href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-secondary)] transition-colors duration-200"
          >
            View Source
          </a>
        </div>
      </div>
    </footer>
  );
}
