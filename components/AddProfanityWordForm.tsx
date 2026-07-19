"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Plus } from "lucide-react";

export function AddProfanityWordForm() {
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState<"filipino" | "regional">("filipino");
  const [region, setRegion] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) {
      setError("Word is required");
      return;
    }

    if (language === "regional" && !region.trim()) {
      setError("Region is required for regional words");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const browser = navigator.userAgent;
      const response = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: word.trim(),
          language,
          region: language === "regional" ? region.trim() : null,
          email: email.trim() || null,
          browser,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setWord("");
        setLanguage("filipino");
        setRegion("");
        setEmail("");
      } else {
        setError(data.error || "Failed to submit word");
      }
    } catch {
      setError("Failed to submit word");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-20 sm:py-28">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--success-muted)] mb-5">
            <CheckCircle className="w-7 h-7 text-[var(--success)]" />
          </div>
          <h2
            className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Word Submitted
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Thank you for your contribution! Your word will be reviewed before being added.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Submit another word
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Add Profanity Word
          </h2>
          <p className="text-[var(--text-secondary)]">
            Know a word we&apos;re missing? Submit it here. No account needed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8 space-y-5"
        >
          <div className="space-y-1.5">
            <label htmlFor="word-input" className="block text-sm font-medium text-[var(--text-secondary)]">
              Word <span className="text-[var(--error)]">*</span>
            </label>
            <input
              id="word-input"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter the profanity word"
              className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="language-select" className="block text-sm font-medium text-[var(--text-secondary)]">
              Language <span className="text-[var(--error)]">*</span>
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value as "filipino" | "regional");
                if (e.target.value === "filipino") setRegion("");
              }}
              className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="filipino">Filipino</option>
              <option value="regional">Regional</option>
            </select>
          </div>

          {language === "regional" && (
            <div className="space-y-1.5">
              <label htmlFor="region-input" className="block text-sm font-medium text-[var(--text-secondary)]">
                Region <span className="text-[var(--error)]">*</span>
              </label>
              <input
                id="region-input"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., Visayan, Ilokano, Bicolano"
                className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email-input" className="block text-sm font-medium text-[var(--text-secondary)]">
              Email <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
            <p className="text-xs text-[var(--text-muted)]">Only if you want to be notified when your word is added.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-[var(--error-muted)] border border-[var(--error)]/10 rounded-[var(--radius-lg)]">
              <AlertCircle className="w-4 h-4 text-[var(--error)] shrink-0" />
              <p className="text-sm text-[var(--error)]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full h-10 px-6 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-[var(--radius-pill)] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {loading ? "Submitting..." : "Submit Word"}
          </button>
        </form>
      </div>
    </section>
  );
}
