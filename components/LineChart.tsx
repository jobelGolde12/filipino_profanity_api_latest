"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface DataPoint {
  label: string;
  values: number[];
}

interface LineChartProps {
  data: DataPoint[];
  lineColors: string[];
  lineLabels: string[];
  height?: number;
  animated?: boolean;
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

export function LineChart({
  data,
  lineColors,
  lineLabels,
  height = 300,
  animated = true,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const [progress, setProgress] = useState(animated ? 0 : 1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!animated) {
      setProgress(1);
      return;
    }
    let start: number | null = null;
    const duration = 1200;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(ease(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [animated]);

  const lineCount = lineLabels.length;
  const allValues = data.flatMap((d) => d.values);
  const maxVal = Math.max(...allValues, 1);
  const niceMax = Math.ceil(maxVal / 10) * 10;

  const padding = { top: 24, right: 24, bottom: 40, left: 48 };
  const chartW = Math.max(containerWidth - padding.left - padding.right, 0);
  const chartH = height - padding.top - padding.bottom;

  const xScale = (i: number) => (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
  const yScale = (v: number) => chartH - (v / niceMax) * chartH;

  const paths = useMemo(() => {
    return Array.from({ length: lineCount }, (_, lineIndex) => {
      const points = data.map((d, i) => ({
        x: xScale(i),
        y: yScale(d.values[lineIndex] ?? 0),
      }));

      if (points.length < 2) return "";

      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
        const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
        d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
      }
      return d;
    });
  }, [data, lineCount, chartW, chartH, niceMax]);

  const areas = useMemo(() => {
    return Array.from({ length: lineCount }, (_, lineIndex) => {
      const points = data.map((d, i) => ({
        x: xScale(i),
        y: yScale(d.values[lineIndex] ?? 0),
      }));

      if (points.length < 2) return "";

      let curve = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
        const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
        curve += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
      }

      const lastX = points[points.length - 1].x;
      const firstX = points[0].x;
      return `${curve} L ${lastX} ${chartH} L ${firstX} ${chartH} Z`;
    });
  }, [data, lineCount, chartW, chartH, niceMax]);

  const gridLines = useMemo(() => {
    const lines: number[] = [];
    const step = niceMax / 4;
    for (let i = 0; i <= 4; i++) {
      lines.push(Math.round(step * i));
    }
    return lines;
  }, [niceMax]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padding.left;
    const idx = Math.round((mouseX / chartW) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    setHoveredIndex(clamped);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPos(null);
  };

  if (containerWidth === 0) {
    return <div ref={containerRef} className="w-full" style={{ height }} />;
  }

  return (
    <div ref={containerRef} className="w-full relative" style={{ height }}>
      <svg
        width={containerWidth}
        height={height}
        viewBox={`0 0 ${containerWidth} ${height}`}
        className="select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {lineColors.map((color, i) => (
            <linearGradient key={i} id={`lineGrad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>

        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {gridLines.map((val, i) => (
            <g key={i}>
              <line
                x1={0}
                y1={yScale(val)}
                x2={chartW}
                y2={yScale(val)}
                stroke="var(--border-subtle)"
                strokeDasharray={i === 0 ? "none" : "4 4"}
                strokeOpacity={i === 0 ? 1 : 0.5}
              />
              <text
                x={-8}
                y={yScale(val)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="var(--text-muted)"
                fontSize={11}
                fontFamily="var(--font-sans)"
              >
                {val}
              </text>
            </g>
          ))}

          {data.map((d, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={chartH + 24}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={11}
              fontFamily="var(--font-sans)"
            >
              {d.label}
            </text>
          ))}

          {areas.map((areaPath, i) => (
            <path
              key={`area-${i}`}
              d={areaPath}
              fill={`url(#lineGrad${i})`}
              opacity={progress}
            />
          ))}

          {paths.map((path, i) => {
            const pathEl = document.getElementById(`linePath${i}`) as SVGPathElement | null;
            let pathLength = 1000;
            if (pathEl && typeof pathEl.getTotalLength === "function") {
              try {
                pathLength = pathEl.getTotalLength();
              } catch {
                // fallback
              }
            }
            return (
              <path
                key={`line-${i}`}
                id={`linePath${i}`}
                d={path}
                fill="none"
                stroke={lineColors[i]}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - progress)}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
            );
          })}

          {hoveredIndex !== null && (
            <>
              <line
                x1={xScale(hoveredIndex)}
                y1={0}
                x2={xScale(hoveredIndex)}
                y2={chartH}
                stroke="var(--border-default)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              {data[hoveredIndex]?.values.map((val, lineIndex) => (
                <g key={lineIndex}>
                  <circle
                    cx={xScale(hoveredIndex)}
                    cy={yScale(val)}
                    r={5}
                    fill="var(--bg-surface)"
                    stroke={lineColors[lineIndex]}
                    strokeWidth={2.5}
                  />
                </g>
              ))}
            </>
          )}
        </g>
      </svg>

      {hoveredIndex !== null && tooltipPos && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-2.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] shadow-[var(--shadow-md)]"
          style={{
            background: "var(--bg-surface)",
            left: Math.min(tooltipPos.x + 12, containerWidth - 180),
            top: tooltipPos.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <p className="text-xs font-medium text-[var(--text-muted)] mb-1.5">
            {data[hoveredIndex].label}
          </p>
          <div className="space-y-1">
            {data[hoveredIndex].values.map((val, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: lineColors[i] }}
                />
                <span className="text-[var(--text-secondary)]">{lineLabels[i]}</span>
                <span className="ml-auto font-medium text-[var(--text-primary)] tabular-nums">
                  {val.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
