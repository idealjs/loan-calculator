import { formatMoney, type ScheduleRow } from "../utils";

interface IScheduleTableProps {
  schedule: ScheduleRow[];
}

export default function ScheduleTable(props: IScheduleTableProps) {
  const { schedule } = props;
  return (
    <section className="loan-card rounded-2xl p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="loan-kicker text-xs font-semibold uppercase tracking-[0.24em]">
            明细表
          </p>
          <h2 className="loan-title mt-1 text-lg font-semibold">每月还款明细</h2>
        </div>
        <p className="loan-muted text-sm">共 {schedule.length} 期</p>
      </div>
      <div className="loan-table-scroll mt-4">
        <table className="min-w-full border-separate border-spacing-0 text-sm text-[color:var(--text)]">
          <thead>
            <tr className="text-[color:var(--muted)]">
              <th className="sticky top-0 border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-left font-medium">
                期次
              </th>
              <th className="sticky top-0 border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-right font-medium">
                当期应还
              </th>
              <th className="sticky top-0 border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-right font-medium">
                本金
              </th>
              <th className="sticky top-0 border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-right font-medium">
                利息
              </th>
              <th className="sticky top-0 border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-right font-medium">
                当前存款
              </th>
              <th className="sticky top-0 border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-right font-medium">
                剩余本金
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, idx) => (
              <tr
                key={row.month}
                className={idx % 2 === 0 ? "bg-black/[0.03] dark:bg-white/[0.02]" : "bg-transparent"}
              >
                <td className="border-b border-[color:var(--border)] px-3 py-3 font-medium text-[color:var(--text)]">
                  {row.month}
                </td>
                <td className="border-b border-[color:var(--border)] px-3 py-3 text-right text-[color:var(--text)]">
                  {formatMoney(row.payment)}
                </td>
                <td className="border-b border-[color:var(--border)] px-3 py-3 text-right text-[color:var(--text)]">
                  {formatMoney(row.principal)}
                </td>
                <td className="border-b border-[color:var(--border)] px-3 py-3 text-right text-[color:var(--text)]">
                  {formatMoney(row.interest)}
                </td>
                <td className="border-b border-[color:var(--border)] px-3 py-3 text-right text-[color:var(--text)]">
                  {formatMoney(row.personalDeposit ?? 0)}
                </td>
                <td className="border-b border-[color:var(--border)] px-3 py-3 text-right text-[color:var(--text)]">
                  {formatMoney(row.remaining)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
