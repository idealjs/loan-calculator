import type React from "react";
import type { ScheduleRow } from "../utils";

interface IPaymentsChartProps {
  svgW: number;
  svgH: number;
  innerH: number;
  left: number;
  top: number;
  paymentsScale: { max: number; min: number };
  schedule: ScheduleRow[];
  payments: number[];
  xLabels: React.ReactNode;
  gridLines: React.ReactNode;
  zeroLine?: React.ReactNode | null;
}

export default function PaymentsChart(props: IPaymentsChartProps) {
  const {
    svgW,
    svgH,
    innerH,
    left,
    top,
    paymentsScale,
    schedule,
    payments,
    xLabels,
    gridLines,
    zeroLine,
  } = props;
  const w = svgW - 60;
  const points = payments
    .map((v, idx) => {
      const x = left + (idx / (payments.length - 1)) * w;
      const y =
        top +
        (1 -
          (v - paymentsScale.min) /
            (paymentsScale.max - paymentsScale.min || 1)) *
          innerH;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <section className="loan-card min-w-0 rounded-2xl p-4">
      <div>
        <h3 className="loan-title text-sm font-semibold">每月还款</h3>
        <p className="loan-muted mt-1 text-xs">观察每期应还金额的变化</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg
          width={svgW}
          height={svgH}
          role="img"
          aria-label="每月还款"
          className="loan-chart block"
        >
          <title>每月还款</title>
          {gridLines}
          {zeroLine}
          <polyline
            points={points}
            fill="none"
            stroke="#1f78ff"
            strokeWidth={2}
          />
          {schedule.map((row, idx) => {
            const v = payments[idx];
            const x = left + (idx / (payments.length - 1)) * w;
            const y =
              top +
              (1 -
                (v - paymentsScale.min) /
                  (paymentsScale.max - paymentsScale.min || 1)) *
                innerH;
            return (
              <circle
                key={`p-${row.month}`}
                cx={x}
                cy={y}
                r={1.8}
                fill="#1f78ff"
              />
            );
          })}
          {xLabels}
        </svg>
      </div>
    </section>
  );
}
