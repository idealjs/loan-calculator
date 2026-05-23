import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import ChartsPanel from "./components/ChartsPanel";
import InputsPanel from "./components/InputsPanel";
import ScheduleTable from "./components/ScheduleTable";
import {
  generateSchedule,
  type IncomeEntry,
  type Method,
  type PersonalDeposit,
  type Prepayment,
} from "./utils";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("loan-calculator-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });

  const [principal, setPrincipal] = useState<number>(1000000);
  const [months, setMonths] = useState<number>(360);
  const [annualRate, setAnnualRate] = useState<number>(3.3);
  const [method, setMethod] = useState<Method>("annuity");

  const [prepayments, setPrepayments] = useState<Prepayment[]>([
    { key: nanoid(), month: 12, amount: 100000 },
    { key: nanoid(), month: 24, amount: 100000 },
    { key: nanoid(), month: 36, amount: 100000 },
  ]);

  const [personalDeposits, setPersonalDeposits] = useState<PersonalDeposit[]>([
    {
      id: "1",
      month: 1,
      amount: 100000,
    },
  ]);

  const [incomes, setIncomes] = useState<IncomeEntry[]>([
    {
      id: "1",
      monthly: 10000,
      startMonth: 1,
      endMonth: 60,
    },
  ]);

  const schedule = useMemo(
    () =>
      generateSchedule(
        principal,
        months,
        annualRate,
        method,
        prepayments,
        personalDeposits,
        incomes,
      ),
    [
      principal,
      months,
      annualRate,
      method,
      prepayments,
      personalDeposits,
      incomes,
    ],
  );

  const monthOptions = useMemo(
    () => Array.from({ length: months }, (_, i) => i + 1),
    [months],
  );

  useEffect(() => {
    setPrepayments((list) =>
      list.map((p) => ({
        ...p,
        month: Math.min(Math.max(1, p.month), months),
      })),
    );

    setPersonalDeposits((list) =>
      list.map((d) => ({
        ...d,
        month: Math.min(Math.max(1, d.month), months),
      })),
    );

    setIncomes((list) =>
      list.map((it) => ({
        ...it,
        startMonth: Math.min(Math.max(1, it.startMonth), months),
        endMonth: Math.min(Math.max(1, it.endMonth), months),
      })),
    );
  }, [months]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("loan-calculator-theme", theme);
  }, [theme]);

  const chart = useMemo(() => {
    const payments = schedule.map((s) => s.payment);
    const deposits = schedule.map((s) => s.personalDeposit ?? 0);
    const remainingVals = schedule.map((s) => s.remaining ?? 0);
    const visible = [...payments, ...deposits];
    let max = Math.max(...visible, 1);
    let min = Math.min(...visible, 0);

    if (max === min) {
      max = max + 1;
      min = Math.max(0, min - 1);
    } else {
      const pad = (max - min) * 0.08;
      max += pad;
      min = Math.max(0, min - pad);
    }

    return {
      payments,
      deposits,
      remaining: remainingVals,
      max,
      min,
      length: payments.length,
    };
  }, [schedule]);

  return (
    <div className="loan-page px-4 py-4 sm:px-6 lg:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-4">
        <header className="loan-shell rounded-3xl px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="loan-kicker text-xs font-semibold uppercase tracking-[0.3em]">
                Loan dashboard
              </p>
              <h1 className="loan-title mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                贷款计算器
              </h1>
              <p className="loan-muted mt-2 max-w-3xl text-sm leading-6">
                移动端优先的贷款分析界面。输入区和结果区分栏展示，表格与图表在小屏上自动收纳到卡片和横向滚动容器中。
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              className="loan-button w-full sm:w-auto"
            >
              切换到{theme === "dark" ? "亮色" : "暗色"}
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[24rem_minmax(0,1fr)] xl:grid-cols-[26rem_minmax(0,1fr)]">
          <InputsPanel
            principal={principal}
            setPrincipal={setPrincipal}
            months={months}
            setMonths={setMonths}
            annualRate={annualRate}
            setAnnualRate={setAnnualRate}
            method={method}
            setMethod={setMethod}
            prepayments={prepayments}
            setPrepayments={setPrepayments}
            monthOptions={monthOptions}
            personalDeposits={personalDeposits}
            setPersonalDeposits={setPersonalDeposits}
            incomes={incomes}
            setIncomes={setIncomes}
          />

          <section className="loan-shell min-w-0 space-y-4 rounded-3xl p-4 sm:p-6">
            <ScheduleTable schedule={schedule} />
            <ChartsPanel chart={chart} schedule={schedule} />
          </section>
        </div>
      </main>
    </div>
  );
}
