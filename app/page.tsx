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
import { AddProfanityWordForm } from "@/components/AddProfanityWordForm";
import { Footer } from "@/components/Footer";

interface ChartDataPoint {
  label: string;
  values: number[];
}

interface Stats {
  total: number;
  filipino: number;
  regional: number;
  variants: number;
  chartData: ChartDataPoint[];
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    filipino: 0,
    regional: 0,
    variants: 0,
    chartData: [],
  });
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [profanityRes, statsRes, variantsRes] = await Promise.all([
        fetch("/api/profanity?type=all&limit=1000"),
        fetch("/api/stats"),
        fetch("/api/variants?limit=200"),
      ]);

      const data = await profanityRes.json();
      const statsData = await statsRes.json();
      const variantsData = await variantsRes.json();

      if (data.success) {
        const words: { language: string; severity: string }[] = data.data;
        const filipinoWords = words.filter((w) => w.language === "filipino");
        const regionalWords = words.filter((w) => w.language === "regional");

        const totalVariants = statsData?.variants?.totalVariants ?? 0;

        const severities = ["low", "medium", "high"];
        const chartData = severities.map((sev) => {
          const filipinoCount = filipinoWords.filter((w) => w.severity === sev).length;
          const regionalCount = regionalWords.filter((w) => w.severity === sev).length;
          const severityTotal = filipinoCount + regionalCount;
          const severityVariants = severityTotal > 0
            ? Math.round((severityTotal / words.length) * totalVariants)
            : 0;

          return {
            label: sev.charAt(0).toUpperCase() + sev.slice(1),
            values: [filipinoCount, regionalCount, severityVariants],
          };
        });

        setStats({
          total: filipinoWords.length + regionalWords.length + totalVariants,
          filipino: filipinoWords.length,
          regional: regionalWords.length,
          variants: totalVariants,
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <AddProfanityWordForm />
          <BugReportForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
