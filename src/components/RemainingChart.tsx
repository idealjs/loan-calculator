import type React from "react";
import type { ScheduleRow } from "../utils";

interface IRemainingChartProps {
  svgW: number;
  svgH: number;
  innerH: number;
  left: number;
  top: number;
  remainingPoints: string;
  remScale: { max: number; min: number };
  schedule: ScheduleRow[];
  remaining: number[];
  xLabels: React.ReactNode;
  gridLines: React.ReactNode;
}

export default function RemainingChart(props: IRemainingChartProps) {
  const {
    svgW,
    svgH,
    innerH,
    top,
    remainingPoints,
    remScale,
    schedule,
    remaining,
    xLabels,
    gridLines,
  } = props;
  return (
    <section className="loan-card min-w-0 rounded-2xl p-4">
      <div>
        <h3 className="loan-title text-sm font-semibold">剩余本金</h3>
        <p className="loan-muted mt-1 text-xs">追踪本金随时间的回落</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg
          width={svgW}
          height={svgH}
          role="img"
          aria-label="剩余本金"
          className="loan-chart block"
        >
          <title>剩余本金</title>
          {gridLines}
          <polyline
            points={remainingPoints}
            fill="none"
            stroke="#2ca02c"
            strokeWidth={2}
          />
          {schedule.map((row, idx) => {
            const v = remaining[idx];
            const x = 40 + (idx / (remaining.length - 1)) * (svgW - 60);
            const y =
              top +
              (1 - (v - remScale.min) / (remScale.max - remScale.min || 1)) *
                innerH;
            return (
              <circle
                key={`r-${row.month}`}
                cx={x}
                cy={y}
                r={1.8}
                fill="#2ca02c"
              />
            );
          })}
          {xLabels}
        </svg>
      </div>
    </section>
  );
}
