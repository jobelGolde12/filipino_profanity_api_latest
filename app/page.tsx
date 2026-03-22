"use client";

import { motion } from "framer-motion";
import { ApiTester } from "@/components/ApiTester";
import { DashboardStats } from "@/components/DashboardStats";
import { GithubRepoCard } from "@/components/GithubRepoCard";
import { useEffect, useState } from "react";
import { Code, Database, Zap, Shield, Globe } from "lucide-react";

interface Stats {
  total: number;
  filipino: number;
  regional: number;
  severityDistribution: { name: string; count: number; color: string }[];
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    filipino: 0,
    regional: 0,
    severityDistribution: [],
  });
  const [baseUrl, setBaseUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "";
  });

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/profanity?type=all");
      const data = await response.json();

      if (data.success) {
        const filipinoWords = data.data.filter((w: { language: string }) => w.language === "filipino");
        const regionalWords = data.data.filter((w: { language: string }) => w.language === "regional");

        setStats({
          total: data.count,
          filipino: filipinoWords.length,
          regional: regionalWords.length,
          severityDistribution: [
            { name: "Low", count: Math.floor(data.count * 0.2), color: "#22c55e" },
            { name: "Medium", count: Math.floor(data.count * 0.5), color: "#eab308" },
            { name: "High", count: Math.floor(data.count * 0.3), color: "#ef4444" },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin);
    fetchStats();
  }, []);

  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Turso Database",
      description: "Powered by libSQL for fast, distributed SQLite",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "REST API",
      description: "Clean REST endpoints with filtering support",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Detection",
      description: "Check any text for profanity instantly",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "JSON Fallback",
      description: "Works even without database connection",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Regional Support",
      description: "Filipino and regional dialect profanity",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur rounded-full border border-zinc-800 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-400">API Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Filipino Profanity API
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            A comprehensive collection of Filipino and regional profanity words with real-time detection
            capabilities.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#docs"
              className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
            >
              View Documentation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-full hover:bg-zinc-700 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="p-4 bg-zinc-900/50 backdrop-blur rounded-xl border border-zinc-800 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-lg mb-3 text-blue-400">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-zinc-500">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>

        <section className="space-y-12 mb-16">
          <DashboardStats stats={stats} />
          <ApiTester baseUrl={baseUrl} />
        </section>

        <section id="docs" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800"
          >
            <h2 className="text-2xl font-bold text-white mb-6">API Documentation</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Fetch Profanity Words</h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-zinc-500">GET</p>
                  <p className="text-green-400">/api/profanity?type=all</p>
                </div>
                <div className="mt-4 space-y-2 text-sm text-zinc-400">
                  <p><span className="text-blue-400">type</span> - Filter by language (filipino, regional, all)</p>
                  <p><span className="text-blue-400">word</span> - Search for specific word</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Check Text for Profanity</h3>
                <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-zinc-500">POST</p>
                  <p className="text-green-400">/api/check</p>
                  <p className="text-yellow-400 mt-2">{"Body: { \"text\": \"your text here\" }"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Example Usage</h3>
                <div className="space-y-4">
                  <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm">
                    <p className="text-zinc-500">{"// JavaScript (Fetch)"}</p>
                    <p className="text-green-400 mt-2">
                      {`const response = await fetch('${baseUrl || "/api/profanity"}?type=all');`}
                    </p>
                    <p className="text-white mt-1">const data = await response.json();</p>
                  </div>

                  <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm">
                    <p className="text-zinc-500">{"// Python"}</p>
                    <p className="text-green-400 mt-2">import requests</p>
                    <p className="text-white mt-1">response = requests.get(&apos;{baseUrl || "/api/profanity"}?type=all&apos;)</p>
                    <p className="text-white mt-1">data = response.json()</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <GithubRepoCard
          repoUrl="https://github.com"
          repoName="filipino-profanity-api"
          description="Free API for Filipino and regional profanity words with real-time detection"
          stars={0}
          forks={0}
        />

        <footer className="text-center py-8 text-zinc-500 text-sm">
          <p>Built with Next.js, Turso, and TailwindCSS</p>
        </footer>
      </main>
    </div>
  );
}
