import { useState, useMemo } from "react";
import { Field, Input, ResultBox } from "@/components/tool-page";

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const { future, invested, gain } = useMemo(() => {
    const p = +monthly, n = +years * 12, r = +rate / 12 / 100;
    if (!p || !n || !r) return { future: 0, invested: 0, gain: 0 };
    const fv = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const inv = p * n;
    return { future: fv, invested: inv, gain: fv - inv };
  }, [monthly, rate, years]);

  const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Monthly investment (₹)"><Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} /></Field>
        <Field label="Expected return (% p.a.)"><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} /></Field>
        <Field label="Duration (years)"><Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} /></Field>
      </div>
      <ResultBox>
        <div className="grid gap-4 sm:grid-cols-3 text-center">
          <div><div className="text-xs uppercase text-muted-foreground">Invested</div><div className="text-2xl font-bold mt-1">{fmt(invested)}</div></div>
          <div><div className="text-xs uppercase text-muted-foreground">Est. returns</div><div className="text-2xl font-bold mt-1 text-success">{fmt(gain)}</div></div>
          <div><div className="text-xs uppercase text-muted-foreground">Future value</div><div className="text-2xl font-bold mt-1 text-primary">{fmt(future)}</div></div>
        </div>
      </ResultBox>
    </div>
  );
}
