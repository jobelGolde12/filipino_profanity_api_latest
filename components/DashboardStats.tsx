"use client";

import dynamic from "next/dynamic";
import { SectionHeader } from "./ui/SectionHeader";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });

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
            className="p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]"
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
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-6">Severity Distribution</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.severityDistribution} barSize={40}>
              <XAxis
                dataKey="name"
                stroke="var(--border-default)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--border-default)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                }}
                cursor={{ fill: "var(--accent-muted)" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats.severityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
