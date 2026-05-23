import { useId } from "react";
import type { Prepayment } from "../../utils";

interface IPrepaymentsProps {
  prepayments: Prepayment[];
  updatePrepayment: (idx: number, next: Partial<Prepayment>) => void;
  removePrepayment: (idx: number) => void;
  addPrepayment: () => void;
  monthOptions: number[];
  principal: number;
}

export default function Prepayments(props: IPrepaymentsProps) {
  const {
    prepayments,
    updatePrepayment,
    removePrepayment,
    addPrepayment,
    monthOptions,
    principal,
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
          <h3 className="loan-title text-sm font-semibold">提前还款</h3>
          <p className="loan-muted mt-1 text-xs">在指定月份减少剩余本金</p>
        </div>
        <button type="button" onClick={addPrepayment} className={buttonClass}>
          添加条目
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {prepayments.map((prepayment, idx) => (
          <div key={prepayment.key} className={itemClass}>
            <input
              id={`${id}-pre-${idx}-input`}
              type="number"
              step="0.01"
              min={0}
              max={principal}
              value={prepayment.amount}
              onChange={(e) =>
                updatePrepayment(idx, { amount: Number(e.target.value) || 0 })
              }
              className="loan-field"
            />
            <select
              id={`${id}-pre-${idx}-month`}
              value={prepayment.month}
              onChange={(e) =>
                updatePrepayment(idx, { month: Number(e.target.value) })
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
              onClick={() => removePrepayment(idx)}
              aria-label="删除"
              className="loan-button-danger"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
