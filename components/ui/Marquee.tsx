"use client";

import {
  Database,
  Code,
  Zap,
  Shield,
  Globe,
  Server,
  Cloud,
  BarChart3,
  Blocks,
  Terminal,
} from "lucide-react";

const marqueeItems = [
  { icon: Database, label: "Turso Edge DB" },
  { icon: Code, label: "REST API" },
  { icon: Zap, label: "Real-time" },
  { icon: Shield, label: "JSON Fallback" },
  { icon: Globe, label: "Filipino" },
  { icon: Globe, label: "Regional" },
  { icon: Server, label: "Edge Ready" },
  { icon: Cloud, label: "Completely Free" },
  { icon: BarChart3, label: "310 Words" },
  { icon: Blocks, label: "TypeScript" },
  { icon: Terminal, label: "cURL Ready" },
];

function Track() {
  return (
    <div
      className="flex gap-4"
      style={{
        width: "max-content",
        animation: "marquee 40s linear infinite",
      }}
    >
      {[...marqueeItems, ...marqueeItems].map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] whitespace-nowrap shrink-0"
          >
            <Icon className="w-5 h-5 text-[var(--accent)]" strokeWidth={1.5} />
            <span className="text-sm text-[var(--text-tertiary)] font-medium tracking-wide">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative mt-16">
      {/* Subtle separator */}
      <div className="w-full h-px bg-[var(--border-subtle)] mb-8" />

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        <Track />
      </div>
    </div>
  );
}
