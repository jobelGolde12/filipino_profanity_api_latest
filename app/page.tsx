"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { DashboardStats } from "@/components/DashboardStats";
import { DetectBanner } from "@/components/DetectBanner";
import { ApiTester } from "@/components/ApiTester";
import { GithubRepoCard } from "@/components/GithubRepoCard";
import { BugReportForm } from "@/components/BugReportForm";
import { Footer } from "@/components/Footer";

interface ChartDataPoint {
  label: string;
  values: number[];
}

interface Stats {
  total: number;
  filipino: number;
  regional: number;
  chartData: ChartDataPoint[];
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    filipino: 0,
    regional: 0,
    chartData: [],
  });
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/profanity?type=all&limit=1000");
      const data = await response.json();

      if (data.success) {
        const words: { language: string; severity: string }[] = data.data;
        const filipinoWords = words.filter((w) => w.language === "filipino");
        const regionalWords = words.filter((w) => w.language === "regional");

        const severities = ["low", "medium", "high"];
        const chartData = severities.map((sev) => ({
          label: sev.charAt(0).toUpperCase() + sev.slice(1),
          values: [
            filipinoWords.filter((w) => w.severity === sev).length,
            regionalWords.filter((w) => w.severity === sev).length,
          ],
        }));

        setStats({
          total: data.pagination.total,
          filipino: filipinoWords.length,
          regional: regionalWords.length,
          chartData,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] overflow-x-hidden">
      <Header />

      <main className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <Hero />
        <FeatureGrid />
        <DashboardStats stats={stats} />
        {/* <DetectBanner /> */}
        <ApiTester baseUrl={baseUrl} />

        <section className="py-20 sm:py-28">
          <GithubRepoCard
            repoUrl="https://github.com/jobelGolde12/filipino_profanity_api_latest"
            repoName="filipino-profanity-api"
            description="Free API for Filipino and regional profanity words with real-time detection"
          />
        </section>

        <BugReportForm />
      </main>

      <Footer />
    </div>
  );
}
