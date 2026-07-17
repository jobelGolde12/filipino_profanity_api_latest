import { Code, Database, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Turso Database",
    description: "Powered by libSQL for fast, distributed SQLite at the edge.",
  },
  {
    icon: Code,
    title: "REST API",
    description: "Clean REST endpoints with type filtering and word search.",
  },
  {
    icon: Zap,
    title: "Real-time Detection",
    description: "Check any text for profanity with instant response.",
  },
  {
    icon: Shield,
    title: "JSON Fallback",
    description: "Works even without a database connection via bundled data.",
  },
  {
    icon: Globe,
    title: "Regional Support",
    description: "Filipino and Visayan regional dialect profanity coverage.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Features</h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          Everything you need for Filipino profanity detection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] transition-colors duration-150 hover:border-[var(--border-default)]"
            >
              <div className="w-9 h-9 flex items-center justify-center bg-[var(--accent-muted)] rounded-[var(--radius-md)] mb-3">
                <Icon className="w-4.5 h-4.5 text-[var(--accent)]" />
              </div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1 text-sm">{feature.title}</h3>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
