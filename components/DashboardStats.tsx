"use client";

import dynamic from "next/dynamic";
import { SectionHeader } from "./ui/SectionHeader";

const LineChart = dynamic(
  () => import("./LineChart").then((m) => m.LineChart),
  { ssr: false }
);

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

interface DashboardStatsProps {
  stats: Stats;
}

const statConfig = [
  { key: "total" as const, label: "Total Words" },
  { key: "filipino" as const, label: "Filipino" },
  { key: "regional" as const, label: "Regional" },
  { key: "variants" as const, label: "Leetspeak Variants" },
];

const lineColors = ["#6B7A3D", "#3B7A8A", "#D4A843"];
const lineLabels = ["Filipino", "Regional", "Variants"];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section id="dashboard" className="py-20 sm:py-28">
      <SectionHeader
        title="Dashboard"
        description="Overview of the profanity word database."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statConfig.map((stat) => (
          <div
            key={stat.key}
            className="p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] transition-colors duration-200 hover:border-[var(--border-default)]"
          >
            <p className="text-sm text-[var(--text-muted)] mb-2">{stat.label}</p>
            <p
              className="text-4xl sm:text-5xl font-semibold text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stats[stat.key].toLocaleString()}<span className="text-2xl text-[var(--text-muted)] font-normal">+</span>
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-[var(--text-muted)]">
            Words &amp; Variants by Severity
          </h3>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            {lineLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: lineColors[i] }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
        <LineChart
          data={stats.chartData}
          lineColors={lineColors}
          lineLabels={lineLabels}
          height={320}
        />
      </div>
    </section>
  );
}
