"use client";

import dynamic from "next/dynamic";
import { SectionHeader } from "./ui/SectionHeader";

const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });

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
  { key: "total" as const, label: "Total Words", color: "var(--accent)" },
  { key: "filipino" as const, label: "Filipino", color: "var(--info)" },
  { key: "regional" as const, label: "Regional", color: "var(--warning)" },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section id="dashboard" className="py-16">
      <SectionHeader
        title="Dashboard"
        description="Overview of the profanity word database."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statConfig.map((stat) => (
          <div
            key={stat.key}
            className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)]"
          >
            <p className="text-sm text-[var(--text-tertiary)] mb-1">{stat.label}</p>
            <p className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">
              {stats[stat.key].toLocaleString()}
            </p>
            <div className="mt-3 h-1 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.total > 0 ? (stats[stat.key] / stats.total) * 100 : 0}%`,
                  backgroundColor: stat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6">
        <h3 className="text-sm font-medium text-[var(--text-tertiary)] mb-4">Severity Distribution</h3>
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
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                }}
                cursor={{ fill: "var(--bg-elevated)", opacity: 0.5 }}
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
