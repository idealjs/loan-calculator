export type Method = "annuity" | "equal_principal";

export type Prepayment = { key: string; month: number; amount: number };

// Add optional id to PersonalDeposit for stable keys in lists
export type PersonalDeposit = { id?: string; month: number; amount: number };

export type ScheduleRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
  personalDeposit: number;
};

export type IncomeEntry = {
  id: string;
  monthly: number;
  startMonth: number;
  endMonth: number;
};

export function formatMoney(v: number) {
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 2,
  });
}

export function generateSchedule(
  principal: number,
  months: number,
  annualRate: number,
  method: Method,
  prepayments: Prepayment[],
  personalDeposits: PersonalDeposit[] = [],
  incomes: IncomeEntry[] = [],
): ScheduleRow[] {
  const r = annualRate / 12 / 100;
  const sortedPre = [...prepayments]
    .filter((p) => p.amount > 0 && p.month >= 1 && p.month <= months)
    .sort((a, b) => a.month - b.month);

  const personalMap = new Map<number, number>(
    personalDeposits
      .filter((p) => p.amount > 0 && p.month >= 1 && p.month <= months)
      .map((p) => [p.month, p.amount]),
  );

  // build per-month income sums for quick lookup
  const incomeMonthly: number[] = new Array(months + 1).fill(0);
  for (const inc of incomes || []) {
    const start = Math.max(1, Math.min(months, inc.startMonth));
    const end = Math.max(1, Math.min(months, inc.endMonth));
    if (end < start) continue;
    for (let m = start; m <= end; m++) {
      incomeMonthly[m] += inc.monthly || 0;
    }
  }

  let remaining = principal;
  const rows: ScheduleRow[] = [];

  // helper to compute monthly payment for annuity
  const annuityPayment = (P: number, n: number) => {
    if (n <= 0) return 0;
    if (r === 0) return P / n;
    const x = (1 + r) ** n;
    return (P * r * x) / (x - 1);
  };

  // helper to compute equal principal monthly principal
  const equalPrincipal = (P: number, n: number) => (n <= 0 ? 0 : P / n);

  let currentMonth = 1;
  // initial payment values
  let remainingMonths = months;
  let monthlyPayment =
    method === "annuity"
      ? annuityPayment(remaining, remainingMonths)
      : equalPrincipal(remaining, remainingMonths) + remaining * r;

  let depositBalance = 0; // running balance of "当前存款"

  while (currentMonth <= months && remaining > 0.000001) {
    // add incomes and personal deposits for this month to deposit balance
    const personalDepositThis = personalMap.get(currentMonth) || 0;
    const incomeThis = incomeMonthly[currentMonth] || 0;
    depositBalance += personalDepositThis + incomeThis;

    // compute scheduled payment for this month
    const interest = remaining * r;
    let principalPayment = 0;
    if (method === "annuity") {
      principalPayment = monthlyPayment - interest;
      // guard for last payment overpay
      if (principalPayment > remaining) {
        principalPayment = remaining;
        monthlyPayment = principalPayment + interest;
      }
    } else {
      // equal principal
      const monthlyPrincipal = remaining / remainingMonths;
      principalPayment = monthlyPrincipal;
      monthlyPayment = principalPayment + interest;
      if (principalPayment > remaining) {
        principalPayment = remaining;
        monthlyPayment = principalPayment + interest;
      }
    }

    remaining = Math.max(0, remaining - principalPayment);

    // deduct scheduled payment from deposit balance (当前存款用来支付当期应还)
    depositBalance -= monthlyPayment;

    // record row for this month; personalDeposit field now holds running balance after payment
    rows.push({
      month: currentMonth,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      remaining,
      personalDeposit: depositBalance,
    });

    // apply prepayment if any for this month (assume after scheduled payment)
    const pre = sortedPre.find((p) => p.month === currentMonth);
    if (pre && pre.amount > 0) {
      // reduce remaining principal
      remaining = Math.max(0, remaining - pre.amount);
      // deduct prepayment from current deposit balance
      depositBalance -= pre.amount;
    }

    remainingMonths = months - currentMonth;
    currentMonth++;

    // recompute monthly payment for remaining months if remaining > 0
    if (remaining > 0.000001 && remainingMonths > 0) {
      if (method === "annuity") {
        monthlyPayment = annuityPayment(remaining, remainingMonths);
      } else {
        const monthlyPrincipal = remaining / remainingMonths;
        // monthlyPayment will be recalculated each loop for equal principal
        monthlyPayment = monthlyPrincipal + remaining * r;
      }
    }
  }

  // if loan finished early, adjust final remaining to 0 and optionally trim rows
  if (rows.length < months) {
    for (let m = rows.length + 1; m <= months; m++) {
      // advance deposit balance by incomes/personal deposits for the remaining months
      const personalDepositThis = personalMap.get(m) || 0;
      const incomeThis = incomeMonthly[m] || 0;
      depositBalance += personalDepositThis + incomeThis;

      rows.push({
        month: m,
        payment: 0,
        principal: 0,
        interest: 0,
        remaining: 0,
        personalDeposit: depositBalance,
      });
    }
  }

  return rows;
}
