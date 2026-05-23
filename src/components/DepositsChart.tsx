import type React from "react";
import type { ScheduleRow } from "../utils";

interface IDepositsChartProps {
  svgW: number;
  svgH: number;
  innerH: number;
  left: number;
  top: number;
  depositPoints: string;
  depositsScale: { max: number; min: number };
  schedule: ScheduleRow[];
  deposits: number[];
  xLabels: React.ReactNode;
  gridLines: React.ReactNode;
  zeroLine?: React.ReactNode | null;
}

export default function DepositsChart(props: IDepositsChartProps) {
  const {
    svgW,
    svgH,
    innerH,
    top,
    depositPoints,
    depositsScale,
    schedule,
    deposits,
    xLabels,
    gridLines,
    zeroLine,
  } = props;
  return (
    <section className="loan-card min-w-0 rounded-2xl p-4">
      <div>
        <h3 className="loan-title text-sm font-semibold">当前存款</h3>
        <p className="loan-muted mt-1 text-xs">展示可用于支付的余额变化</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg
          width={svgW}
          height={svgH}
          role="img"
          aria-label="当前存款"
          className="loan-chart block"
        >
          <title>当前存款</title>
          {gridLines}
          {zeroLine}
          <polyline
            points={depositPoints}
            fill="none"
            stroke="#ff7f0e"
            strokeWidth={2}
          />
          {schedule.map((row, idx) => {
            const v = deposits[idx];
            const x = 40 + (idx / (deposits.length - 1)) * (svgW - 60);
            const y =
              top +
              (1 -
                (v - depositsScale.min) /
                  (depositsScale.max - depositsScale.min || 1)) *
                innerH;
            return (
              <circle
                key={`d-${row.month}`}
                cx={x}
                cy={y}
                r={1.8}
                fill="#ff7f0e"
              />
            );
          })}
          {xLabels}
        </svg>
      </div>
    </section>
  );
}
