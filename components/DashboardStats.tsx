"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Stats {
  total: number;
  filipino: number;
  regional: number;
  severityDistribution: { name: string; count: number; color: string }[];
}

interface DashboardStatsProps {
  stats: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    { label: "Total Words", value: stats.total, color: "from-blue-500 to-cyan-500" },
    { label: "Filipino", value: stats.filipino, color: "from-purple-500 to-pink-500" },
    { label: "Regional", value: stats.regional, color: "from-orange-500 to-red-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 bg-gradient-to-br ${stat.color} rounded-xl`}
          >
            <p className="text-sm text-white/80 mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-white">{stat.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="h-64">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Severity Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.severityDistribution}>
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#27272a",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {stats.severityDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
