"use client";

import { motion } from "framer-motion";
import { JsonViewer } from "./JsonViewer";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-4xl mx-auto p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800"
    >
      <h2 className="text-2xl font-bold text-white mb-6">API Tester</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("fetch")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "fetch"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          Fetch Words
        </button>
        <button
          onClick={() => setActiveTab("check")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "check"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          Check Text
        </button>
      </div>

      {activeTab === "fetch" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as TestType)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="filipino">Filipino</option>
                <option value="regional">Regional</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Search Word (optional)</label>
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="e.g., gago"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={runApiTest}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Loading..." : "Run API Test"}
          </button>
        </div>
      )}

      {activeTab === "check" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Text to Check</label>
            <textarea
              value={checkText}
              onChange={(e) => setCheckText(e.target.value)}
              placeholder="Enter text to check for profanity..."
              rows={4}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button
            onClick={runCheckTest}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Text for Profanity"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <JsonViewer data={result} title="Response" />
        </div>
      )}

      {loading && (
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
