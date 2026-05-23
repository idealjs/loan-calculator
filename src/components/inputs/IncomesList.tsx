import { useId } from "react";
import type { IncomeEntry } from "../../utils";

interface IIncomesListProps {
  incomes: IncomeEntry[];
  monthOptions: number[];
  updateIncome: (idx: number, next: Partial<IncomeEntry>) => void;
  removeIncome: (idx: number) => void;
  addIncome: () => void;
}

export default function IncomesList(props: IIncomesListProps) {
  const { incomes, monthOptions, updateIncome, removeIncome, addIncome } =
    props;
  const id = useId();
  const itemClass =
      "grid gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 sm:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end";
  const buttonClass =
      "loan-button";

  return (
      <section className="loan-card rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
            <h3 className="loan-title text-sm font-semibold">个人收入</h3>
            <p className="loan-muted mt-1 text-xs">按月份区间累加到当前存款</p>
        </div>
        <button type="button" onClick={addIncome} className={buttonClass}>
          添加条目
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {incomes.map((inc, idx) => {
          const base = `${id}-income-${inc.id}`;
          return (
            <div key={inc.id} className={itemClass}>
              <input
                id={`${base}-monthly`}
                type="number"
                value={inc.monthly}
                onChange={(e) =>
                  updateIncome(idx, { monthly: Number(e.target.value) || 0 })
                }
                className="loan-field"
              />

              <select
                id={`${base}-start`}
                value={inc.startMonth}
                onChange={(e) =>
                  updateIncome(idx, { startMonth: Number(e.target.value) })
                }
                className="loan-field"
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m} 月
                  </option>
                ))}
              </select>

              <select
                id={`${base}-end`}
                value={inc.endMonth}
                onChange={(e) =>
                  updateIncome(idx, { endMonth: Number(e.target.value) })
                }
                className="loan-field"
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m} 月
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => removeIncome(idx)}
                aria-label={`remove-income-${inc.id}`}
                className="loan-button-danger"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
