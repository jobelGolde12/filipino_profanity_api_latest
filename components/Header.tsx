"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "API Tester", href: "#api-tester" },
  { label: "Docs", href: "#docs" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[var(--bg-base)]/90 backdrop-blur-sm border-b border-[var(--border-subtle)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-sm tracking-tight">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
            Filipino Profanity API
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-[var(--radius-sm)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-[var(--radius-sm)]"
            >
              GitHub
            </a>
          </nav>

          <button
            className="md:hidden p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-[var(--border-subtle)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
