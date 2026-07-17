"use client";

import { JsonViewer } from "./JsonViewer";
import { SectionHeader } from "./ui/SectionHeader";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { useState } from "react";

interface ApiTesterProps {
  baseUrl: string;
}

type TestType = "filipino" | "regional" | "all";

export function ApiTester({ baseUrl }: ApiTesterProps) {
  const [selectedType, setSelectedType] = useState<TestType>("all");
  const [searchWord, setSearchWord] = useState("");
  const [checkText, setCheckText] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"fetch" | "check">("fetch");

  const runApiTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let url = `${baseUrl}/api/profanity?type=${selectedType}`;
      if (searchWord) {
        url += `&word=${encodeURIComponent(searchWord)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const runCheckTest = async () => {
    if (!checkText.trim()) {
      setError("Please enter text to check");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${baseUrl}/api/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: checkText }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="api-tester" className="py-20 sm:py-28">
      <SectionHeader
        title="API Tester"
        description="Test the endpoints directly from your browser."
      />

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
        <div className="flex gap-1 mb-8 p-1 bg-[var(--bg-alt)] rounded-[var(--radius-pill)] w-fit border border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab("fetch")}
            className={`px-5 py-2 text-sm font-medium rounded-[var(--radius-pill)] transition-all duration-200 ${
              activeTab === "fetch"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Fetch Words
          </button>
          <button
            onClick={() => setActiveTab("check")}
            className={`px-5 py-2 text-sm font-medium rounded-[var(--radius-pill)] transition-all duration-200 ${
              activeTab === "check"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Check Text
          </button>
        </div>

        {activeTab === "fetch" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as TestType)}
              >
                <option value="all">All</option>
                <option value="filipino">Filipino</option>
                <option value="regional">Regional</option>
              </Select>
              <Input
                label="Search Word"
                placeholder="e.g., gago"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
            </div>
            <Button onClick={runApiTest} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Loading..." : "Run API Test"}
            </Button>
          </div>
        )}

        {activeTab === "check" && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Text to Check
              </label>
              <textarea
                value={checkText}
                onChange={(e) => setCheckText(e.target.value)}
                placeholder="Enter text to check for profanity..."
                rows={4}
                className="w-full px-3 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm resize-none transition-colors duration-200 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <Button onClick={runCheckTest} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Checking..." : "Check Text"}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-[var(--error-muted)] border border-[var(--error)]/10 rounded-[var(--radius-lg)]">
            <p className="text-sm text-[var(--error)]">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-6 flex justify-center">
            <div className="w-5 h-5 border-2 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        )}

        {result && !loading && (
          <div className="mt-6">
            <JsonViewer data={result} title="Response" />
          </div>
        )}
      </div>
    </section>
  );
}
