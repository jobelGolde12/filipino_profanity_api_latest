"use client";

import { ResponsiveBar } from "@nivo/bar";

interface SeverityChartProps {
  data: { name: string; count: number; color: string }[];
}

export function SeverityChart({ data }: SeverityChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 8, right: 8, bottom: 32, left: 8 }}
        padding={0.35}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={(bar) => {
          const item = data.find((d) => d.name === bar.indexValue);
          return item?.color || "#6B7A3D";
        }}
        borderRadius={6}
        borderWidth={0}
        enableGridY={false}
        enableGridX={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
          format: (name) => String(name),
        }}
        axisLeft={null}
        enableLabel={true}
        label={(d) => (d.value != null ? d.value.toLocaleString() : "")}
        labelTextColor="#4B4B4B"
        labelSkipWidth={0}
        labelSkipHeight={0}
        labelFormat=""
        theme={{
          text: {
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            fill: "var(--text-secondary)",
          },
          axis: {
            domain: { line: { stroke: "transparent" } },
          },
          grid: { line: { stroke: "transparent" } },
        }}
        animate={true}
        motionConfig="gentle"
        onMouseEnter={(_data, event) => {
          const target = event.target as HTMLElement;
          target.style.cursor = "pointer";
        }}
        onMouseLeave={(_data, event) => {
          const target = event.target as HTMLElement;
          target.style.cursor = "default";
        }}
        tooltip={({ value, indexValue, color }) => (
          <div
            className="px-3 py-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] shadow-[var(--shadow-md)] text-sm"
            style={{
              background: "var(--bg-surface)",
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium text-[var(--text-primary)]">{indexValue}</span>
            </div>
            <span className="text-[var(--text-muted)]">
              {Number(value).toLocaleString()} words
            </span>
          </div>
        )}
        role="application"
        ariaLabel="Severity distribution bar chart"
      />
    </div>
  );
}
