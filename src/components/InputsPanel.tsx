import { nanoid } from "nanoid";
import type {
  IncomeEntry,
  Method,
  PersonalDeposit,
  Prepayment,
} from "../utils";
import BasicInputs from "./inputs/BasicInputs";
import DepositsList from "./inputs/DepositsList";
import IncomesList from "./inputs/IncomesList";
import Prepayments from "./inputs/Prepayments";

interface IInputsPanelProps {
  principal: number;
  setPrincipal: (v: number) => void;
  months: number;
  setMonths: (v: number) => void;
  annualRate: number;
  setAnnualRate: (v: number) => void;
  method: Method;
  setMethod: (m: Method) => void;
  prepayments: Prepayment[];
  setPrepayments: (p: Prepayment[]) => void;
  monthOptions: number[];
  personalDeposits: PersonalDeposit[];
  setPersonalDeposits: (d: PersonalDeposit[]) => void;
  incomes: IncomeEntry[];
  setIncomes: (i: IncomeEntry[]) => void;
}

export default function InputsPanel(props: IInputsPanelProps) {
  const {
    principal,
    setPrincipal,
    months,
    setMonths,
    annualRate,
    setAnnualRate,
    method,
    setMethod,
    prepayments,
    setPrepayments,
    monthOptions,
    personalDeposits,
    setPersonalDeposits,
    incomes,
    setIncomes,
  } = props;
  const addDeposit = () => {
    setPersonalDeposits([
      ...personalDeposits,
      { month: Math.min(1, months), amount: 0 },
    ]);
  };

  const updateDeposit = (idx: number, next: Partial<PersonalDeposit>) => {
    const copy = personalDeposits.slice();
    copy[idx] = { ...copy[idx], ...next };
    setPersonalDeposits(copy);
  };

  const removeDeposit = (idx: number) => {
    const copy = personalDeposits.slice();
    copy.splice(idx, 1);
    setPersonalDeposits(copy);
  };

  const addIncome = () => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2);
    setIncomes([
      ...incomes,
      { id, monthly: 0, startMonth: 1, endMonth: Math.min(months, 1) },
    ]);
  };

  const updateIncome = (idx: number, next: Partial<IncomeEntry>) => {
    const copy = incomes.slice();
    copy[idx] = { ...copy[idx], ...next };
    setIncomes(copy);
  };

  const removeIncome = (idx: number) => {
    const copy = incomes.slice();
    copy.splice(idx, 1);
    setIncomes(copy);
  };

  const addPrepayment = () => {
    setPrepayments([
      ...prepayments,
      { key: nanoid(), month: Math.min(1, months), amount: 0 },
    ]);
  };

  const updatePrepayment = (idx: number, next: Partial<Prepayment>) => {
    const copy = prepayments.slice();
    copy[idx] = { ...copy[idx], ...next };
    setPrepayments(copy);
  };

  const removePrepayment = (idx: number) => {
    const copy = prepayments.slice();
    copy.splice(idx, 1);
    setPrepayments(copy);
  };

  return (
    <aside className="loan-shell min-w-0 space-y-4 rounded-3xl p-4 sm:p-6 lg:sticky lg:top-4 lg:self-start">
      <div>
        <p className="loan-kicker text-xs font-semibold uppercase tracking-[0.3em]">
          输入面板
        </p>
        <h2 className="loan-title mt-2 text-xl font-semibold">贷款输入</h2>
        <p className="loan-muted mt-2 text-sm leading-6">
          先调整基础参数，再配置提前还款、一次性存款和收入区间。
        </p>
      </div>

      <BasicInputs
        principal={principal}
        setPrincipal={setPrincipal}
        months={months}
        setMonths={setMonths}
        annualRate={annualRate}
        setAnnualRate={setAnnualRate}
        method={method}
        setMethod={setMethod}
      />

      <Prepayments
        prepayments={prepayments}
        updatePrepayment={updatePrepayment}
        removePrepayment={removePrepayment}
        addPrepayment={addPrepayment}
        monthOptions={monthOptions}
        principal={principal}
      />

      <DepositsList
        personalDeposits={personalDeposits}
        monthOptions={monthOptions}
        updateDeposit={updateDeposit}
        removeDeposit={removeDeposit}
        addDeposit={addDeposit}
      />

      <IncomesList
        incomes={incomes}
        monthOptions={monthOptions}
        updateIncome={updateIncome}
        removeIncome={removeIncome}
        addIncome={addIncome}
      />
    </aside>
  );
}
