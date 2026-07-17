"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { DashboardStats } from "@/components/DashboardStats";
import { ApiTester } from "@/components/ApiTester";
import { ApiDocs } from "@/components/ApiDocs";
import { GithubRepoCard } from "@/components/GithubRepoCard";
import { Footer } from "@/components/Footer";

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
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchStats();
  }, []);

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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />
        <FeatureGrid />
        <DashboardStats stats={stats} />
        <ApiTester baseUrl={baseUrl} />
        <ApiDocs />

        <section className="py-16">
          <GithubRepoCard
            repoUrl="https://github.com/jobelGolde12/filipino_profanity_api_latest"
            repoName="filipino-profanity-api"
            description="Free API for Filipino and regional profanity words with real-time detection"
            stars={0}
            forks={0}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
