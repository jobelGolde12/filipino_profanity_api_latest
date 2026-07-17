"use client";

import dynamic from "next/dynamic";
import { SectionHeader } from "./ui/SectionHeader";

const SeverityChart = dynamic(
  () => import("./SeverityChart").then((m) => m.SeverityChart),
  { ssr: false }
);

interface Stats {
  total: number;
  filipino: number;
  regional: number;
  severityDistribution: { name: string; count: number; color: string }[];
}

interface DashboardStatsProps {
  stats: Stats;
}

const statConfig = [
  { key: "total" as const, label: "Total Words" },
  { key: "filipino" as const, label: "Filipino" },
  { key: "regional" as const, label: "Regional" },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section id="dashboard" className="py-20 sm:py-28">
      <SectionHeader
        title="Dashboard"
        description="Overview of the profanity word database."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
              {stats[stat.key].toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-[var(--text-muted)]">Severity Distribution</h3>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            {stats.severityDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
        <SeverityChart data={stats.severityDistribution} />
      </div>
    </section>
  );
}
