"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export function BugReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const browser = navigator.userAgent;
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          browser,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setTitle("");
        setDescription("");
      } else {
        setError(data.error || "Failed to submit report");
      }
    } catch {
      setError("Failed to submit report");
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
            Report Submitted
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Thank you for your report. We&apos;ll look into it.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Submit another report
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
            Report a Bug
          </h2>
          <p className="text-[var(--text-secondary)]">
            Found something wrong? Let us know. No account needed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8 space-y-5"
        >
          <div className="space-y-1.5">
            <label htmlFor="report-title" className="block text-sm font-medium text-[var(--text-secondary)]">
              Title <span className="text-[var(--error)]">*</span>
            </label>
            <input
              id="report-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the bug"
              className="w-full h-10 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="report-desc" className="block text-sm font-medium text-[var(--text-secondary)]">
              Description <span className="text-[var(--error)]">*</span>
            </label>
            <textarea
              id="report-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened? What did you expect?"
              rows={5}
              className="w-full px-3 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm resize-none transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
            />
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
              <Send className="w-4 h-4" />
            )}
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </section>
  );
}
