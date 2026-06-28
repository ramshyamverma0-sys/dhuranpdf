import { useState, useMemo } from "react";
import { Field, Input, ResultBox } from "@/components/tool-page";

export default function EMICalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, total, interest } = useMemo(() => {
    const p = +amount, r = +rate / 12 / 100, n = +years * 12;
    if (!p || !r || !n) return { emi: 0, total: 0, interest: 0 };
    const e = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { emi: e, total: e * n, interest: e * n - p };
  }, [amount, rate, years]);

  const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Loan amount (₹)"><Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} /></Field>
        <Field label="Interest rate (% p.a.)"><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} /></Field>
        <Field label="Tenure (years)"><Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} /></Field>
      </div>
      <ResultBox>
        <div className="grid gap-4 sm:grid-cols-3 text-center">
          <Stat label="Monthly EMI" value={fmt(emi)} highlight />
          <Stat label="Total interest" value={fmt(interest)} />
          <Stat label="Total payable" value={fmt(total)} />
        </div>
      </ResultBox>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
