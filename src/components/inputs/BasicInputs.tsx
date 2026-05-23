import { useId } from "react";
import type { Method } from "../../utils";

interface IBasicInputsProps {
  principal: number;
  setPrincipal: (v: number) => void;
  months: number;
  setMonths: (v: number) => void;
  annualRate: number;
  setAnnualRate: (v: number) => void;
  method: Method;
  setMethod: (m: Method) => void;
}

export default function BasicInputs(props: IBasicInputsProps) {
  const {
    principal,
    setPrincipal,
    months,
    setMonths,
    annualRate,
    setAnnualRate,
    method,
    setMethod,
  } = props;
  const id = useId();

  return (
    <section className="loan-card rounded-2xl p-4">
      <h3 className="loan-title text-sm font-semibold">基础参数</h3>

      <label htmlFor={`${id}-principal`} className="mt-4 block text-sm font-medium text-[color:var(--muted)]">
        贷款金额（元）
      </label>
      <input
        id={`${id}-principal`}
        type="number"
        value={principal}
        onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
        className="loan-field mt-2"
      />

      <label htmlFor={`${id}-months`} className="mt-3 block text-sm font-medium text-[color:var(--muted)]">
        贷款期限（月）
      </label>
      <input
        id={`${id}-months`}
        type="number"
        value={months}
        onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
        className="loan-field mt-2"
      />

      <label htmlFor={`${id}-rate`} className="mt-3 block text-sm font-medium text-[color:var(--muted)]">
        年利率（%）
      </label>
      <input
        id={`${id}-rate`}
        type="number"
        step="0.01"
        value={annualRate}
        onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
        className="loan-field mt-2"
      />

      <label htmlFor={`${id}-method`} className="mt-3 block text-sm font-medium text-[color:var(--muted)]">
        还款方式
      </label>
      <select
        id={`${id}-method`}
        value={method}
        onChange={(e) => setMethod(e.target.value as Method)}
        className="loan-field mt-2"
      >
        <option value="annuity">等额本息</option>
        <option value="equal_principal">等额本金</option>
      </select>
    </section>
  );
}
