import { useId } from "react";
import type { PersonalDeposit } from "../../utils";

interface IDepositsListProps {
  personalDeposits: PersonalDeposit[];
  monthOptions: number[];
  updateDeposit: (idx: number, next: Partial<PersonalDeposit>) => void;
  removeDeposit: (idx: number) => void;
  addDeposit: () => void;
}

export default function DepositsList(props: IDepositsListProps) {
  const {
    personalDeposits,
    monthOptions,
    updateDeposit,
    removeDeposit,
    addDeposit,
  } = props;
  const id = useId();
  const itemClass =
    "grid gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end";
  const buttonClass =
    "loan-button";

  return (
    <section className="loan-card rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="loan-title text-sm font-semibold">一次性收入 / 存款</h3>
          <p className="loan-muted mt-1 text-xs">用于模拟某个月额外入账</p>
        </div>
        <button type="button" onClick={addDeposit} className={buttonClass}>
          添加条目
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {personalDeposits.map((d, idx) => {
          const key = d.id ?? `${id}-deposit-${idx}`;
          const base = `${key}`;
          return (
            <div key={key} className={itemClass}>
              <input
                id={`${base}-amount`}
                type="number"
                value={d.amount}
                onChange={(e) =>
                  updateDeposit(idx, { amount: Number(e.target.value) || 0 })
                }
                className="loan-field"
              />
              <select
                id={`${base}-month`}
                value={d.month}
                onChange={(e) =>
                  updateDeposit(idx, { month: Number(e.target.value) })
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
                onClick={() => removeDeposit(idx)}
                aria-label={`remove-deposit-${key}`}
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
