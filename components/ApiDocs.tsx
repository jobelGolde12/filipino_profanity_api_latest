"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "./ui/SectionHeader";
import { CodeBlock } from "./ui/CodeBlock";
import { Badge } from "./ui/Badge";

export function ApiDocs() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const origin = baseUrl || "http://localhost:3000";

  return (
    <section id="docs" className="py-16">
      <SectionHeader
        title="API Documentation"
        description="Integrate profanity detection into your application."
      />

      <div className="space-y-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="info">GET</Badge>
            <code className="text-sm font-mono text-[var(--text-primary)]">/api/profanity</code>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Fetch profanity words with optional filtering by language and search.
          </p>

          <div className="mb-4">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Parameters
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-4">
                <code className="font-mono text-[var(--accent)] shrink-0">type</code>
                <span className="text-[var(--text-tertiary)]">
                  Filter by language — <code>filipino</code>, <code>regional</code>, or <code>all</code> (default)
                </span>
              </div>
              <div className="flex gap-4">
                <code className="font-mono text-[var(--accent)] shrink-0">word</code>
                <span className="text-[var(--text-tertiary)]">Search for a specific word (optional)</span>
              </div>
            </div>
          </div>

          <CodeBlock language="JavaScript">{`const response = await fetch('${origin}/api/profanity?type=all');
const data = await response.json();`}</CodeBlock>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="warning">POST</Badge>
            <code className="text-sm font-mono text-[var(--text-primary)]">/api/check</code>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Check any text for profanity and receive matched words with details.
          </p>

          <div className="mb-4">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Request Body
            </h4>
            <div className="text-sm text-[var(--text-tertiary)]">
              <code className="font-mono text-[var(--accent)]">{"{ \"text\": \"your text here\" }"}</code>
            </div>
          </div>

          <CodeBlock language="JavaScript">{`const response = await fetch('${origin}/api/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'your text here' }),
});
const data = await response.json();`}</CodeBlock>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Python Example</h3>
          <CodeBlock language="Python">{`import requests

response = requests.get('${origin}/api/profanity?type=all')
data = response.json()`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
