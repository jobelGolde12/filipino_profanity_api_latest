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
    <section id="api-tester" className="py-16">
      <SectionHeader
        title="API Tester"
        description="Test the API endpoints directly from your browser."
      />

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6">
        <div className="flex gap-1 mb-6 p-1 bg-[var(--bg-elevated)] rounded-[var(--radius-md)] w-fit">
          <button
            onClick={() => setActiveTab("fetch")}
            className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors ${
              activeTab === "fetch"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Fetch Words
          </button>
          <button
            onClick={() => setActiveTab("check")}
            className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors ${
              activeTab === "check"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Check Text
          </button>
        </div>

        {activeTab === "fetch" && (
          <div className="space-y-4">
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
            <Button onClick={runApiTest} disabled={loading} className="w-full">
              {loading ? "Loading..." : "Run API Test"}
            </Button>
          </div>
        )}

        {activeTab === "check" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Text to Check
              </label>
              <textarea
                value={checkText}
                onChange={(e) => setCheckText(e.target.value)}
                placeholder="Enter text to check for profanity..."
                rows={4}
                className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm resize-none transition-colors duration-150 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <Button onClick={runCheckTest} disabled={loading} className="w-full">
              {loading ? "Checking..." : "Check Text for Profanity"}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-[var(--danger-muted)] border border-[var(--danger)]/15 rounded-[var(--radius-md)]">
            <p className="text-sm text-[var(--danger)]">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="w-5 h-5 border-2 border-[var(--border-default)] border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        )}

        {result && !loading && (
          <div className="mt-4">
            <JsonViewer data={result} title="Response" />
          </div>
        )}
      </div>
    </section>
  );
}
