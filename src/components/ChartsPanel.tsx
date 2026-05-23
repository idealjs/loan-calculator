import { formatMoney, type ScheduleRow } from "../utils";
import DepositsChart from "./DepositsChart";
import PaymentsChart from "./PaymentsChart";
import RemainingChart from "./RemainingChart";

interface IChartData {
  payments: number[];
  deposits: number[];
  remaining: number[];
  max: number;
  min: number;
  length: number;
}

interface IXLabelsProps {
  chartLength: number;
  svgW: number;
  schedule: ScheduleRow[];
  left?: number;
}

function XLabels(props: IXLabelsProps) {
  const { chartLength, svgW, schedule, left = 40 } = props;
  const step = Math.ceil(chartLength / 6);
  return Array.from({ length: Math.min(6, chartLength) }).map((_, i) => {
    const idx = i * step;
    if (idx >= chartLength) return null;
    const x = left + (idx / (chartLength - 1)) * (svgW - 60);
    return (
      <text
        key={`x-${schedule[idx].month}`}
        x={x}
        y={220}
        fontSize={12}
        fill="var(--chart-text)"
      >
        {schedule[idx].month}月
      </text>
    );
  });
}

interface IGridLinesProps {
  s: { max: number; min: number };
  left: number;
  top: number;
  innerH: number;
  svgW: number;
}

function GridLines(props: IGridLinesProps) {
  const { s, left, top, innerH, svgW } = props;
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => {
        const y = top + i * (innerH / 3);
        const value = Math.round(s.max - (i * (s.max - s.min)) / 3);
        return (
          <g key={`g-${value}`}>
            <line x1={left} y1={y} x2={svgW - 10} y2={y} stroke="var(--chart-grid)" />
            <text x={6} y={y + 4} fontSize={12} fill="var(--chart-text)">
              {formatMoney(value)}
            </text>
          </g>
        );
      })}
    </>
  );
}

interface IZeroLineProps {
  s: { max: number; min: number };
  left: number;
  top: number;
  innerH: number;
  svgW: number;
}

function ZeroLine(props: IZeroLineProps) {
  const { s, left, top, innerH, svgW } = props;
  if (!(s.min <= 0 && s.max >= 0)) return null;
  const y = top + (1 - (0 - s.min) / (s.max - s.min || 1)) * innerH;
  return (
    <g>
      <line
        x1={left}
        y1={y}
        x2={svgW - 10}
        y2={y}
        stroke="var(--chart-zero)"
        strokeWidth={2}
      />
    </g>
  );
}

interface IChartsPanelProps {
  chart: IChartData;
  schedule: ScheduleRow[];
}

export default function ChartsPanel(props: IChartsPanelProps) {
  const { chart, schedule } = props;
  if (!chart || chart.length === 0) return null;

  const svgW = Math.max(300, Math.floor(Math.max(600, chart.length * 6) / 3));
  const svgH = 240;
  const innerH = 180;
  const left = 40;
  const top = 20;

  const scale = (vals: number[]) => {
    let max = Math.max(...vals, 1);
    let min = Math.min(...vals, 0);
    if (max === min) {
      max = max + 1;
      min = Math.max(0, min - 1);
    } else {
      const pad = (max - min) * 0.08;
      max += pad;
      min = Math.max(0, min - pad);
    }
    return { max, min };
  };

  const paymentsScale = scale(chart.payments);
  const depositsScale = scale(chart.deposits);
  const remScale = scale(chart.remaining);

  const w = svgW - 60; // inner width

  const pointsFor = (vals: number[], s: { max: number; min: number }) =>
    vals
      .map((v, idx) => {
        const x = left + (idx / (chart.length - 1)) * w;
        const y = top + (1 - (v - s.min) / (s.max - s.min || 1)) * innerH;
        return `${x},${y}`;
      })
      .join(" ");

  const depositPoints = pointsFor(chart.deposits, depositsScale);
  const remainingPoints = pointsFor(chart.remaining, remScale);

  const xLabels = XLabels({ chartLength: chart.length, svgW, schedule, left });

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <PaymentsChart
        svgW={svgW}
        svgH={svgH}
        innerH={innerH}
        left={left}
        top={top}
        paymentsScale={paymentsScale}
        schedule={schedule}
        payments={chart.payments}
        xLabels={xLabels}
        gridLines={
          <GridLines
            s={paymentsScale}
            left={left}
            top={top}
            innerH={innerH}
            svgW={svgW}
          />
        }
        zeroLine={
          <ZeroLine
            s={paymentsScale}
            left={left}
            top={top}
            innerH={innerH}
            svgW={svgW}
          />
        }
      />

      <DepositsChart
        svgW={svgW}
        svgH={svgH}
        innerH={innerH}
        left={left}
        top={top}
        depositPoints={depositPoints}
        depositsScale={depositsScale}
        schedule={schedule}
        deposits={chart.deposits}
        xLabels={xLabels}
        gridLines={
          <GridLines
            s={depositsScale}
            left={left}
            top={top}
            innerH={innerH}
            svgW={svgW}
          />
        }
        zeroLine={
          <ZeroLine
            s={depositsScale}
            left={left}
            top={top}
            innerH={innerH}
            svgW={svgW}
          />
        }
      />

      <RemainingChart
        svgW={svgW}
        svgH={svgH}
        innerH={innerH}
        left={left}
        top={top}
        remainingPoints={remainingPoints}
        remScale={remScale}
        schedule={schedule}
        remaining={chart.remaining}
        xLabels={xLabels}
        gridLines={
          <GridLines
            s={remScale}
            left={left}
            top={top}
            innerH={innerH}
            svgW={svgW}
          />
        }
      />
    </div>
  );
}
