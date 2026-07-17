"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "API Tester", href: "#api-tester" },
  { label: "Docs", href: "#docs" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2.5 text-[var(--text-primary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="font-medium text-sm tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
              Filipino Profanity API
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200 rounded-[var(--radius-sm)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              GitHub
            </a>
          </nav>

          <button
            className="md:hidden p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
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
                className="block px-3 py-3 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/jobelGolde12/filipino_profanity_api_latest"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
