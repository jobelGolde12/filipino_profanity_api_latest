import { Code, Database, Zap, Shield, Globe, Binary } from "lucide-react";
import { Marquee } from "./ui/Marquee";

const features = [
  {
    icon: Database,
    title: "Turso Database",
    description: "Distributed SQLite at the edge via libSQL.",
  },
  {
    icon: Code,
    title: "REST API",
    description: "Clean endpoints with type filtering and word search.",
  },
  {
    icon: Zap,
    title: "Real-time Detection",
    description: "Check any text for profanity with instant response.",
  },
  {
    icon: Binary,
    title: "Leetspeak Variants",
    description: "8,000+ leetspeak variants to detect obfuscated profanity.",
  },
  {
    icon: Shield,
    title: "JSON Fallback",
    description: "Works without a database connection via bundled data.",
  },
  {
    icon: Globe,
    title: "Regional Support",
    description: "Filipino and Visayan dialect coverage.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mb-12">
        <h2
          className="text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What you get
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="p-8 bg-[var(--bg-surface)]"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-[var(--accent-muted)] rounded-[var(--radius-md)] mb-4">
                <Icon className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1.5 text-[15px]">{feature.title}</h3>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <Marquee />
    </section>
  );
}
