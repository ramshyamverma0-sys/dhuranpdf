import { useState, useMemo } from "react";
import { Field, Input, Select, ResultBox } from "@/components/tool-page";

const fmt = (n: number, c = "₹") => c + Math.round(n).toLocaleString("en-IN");

export function CompoundInterest() {
  const [p, setP] = useState(100000);
  const [r, setR] = useState(8);
  const [t, setT] = useState(5);
  const [n, setN] = useState(1);
  const A = useMemo(() => p * Math.pow(1 + r / (100 * n), n * t), [p, r, t, n]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Principal"><Input type="number" value={p} onChange={(e) => setP(+e.target.value)} /></Field>
        <Field label="Rate %"><Input type="number" step="0.1" value={r} onChange={(e) => setR(+e.target.value)} /></Field>
        <Field label="Years"><Input type="number" value={t} onChange={(e) => setT(+e.target.value)} /></Field>
        <Field label="Compounds/yr"><Input type="number" value={n} onChange={(e) => setN(+e.target.value)} /></Field>
      </div>
      <ResultBox><div className="grid sm:grid-cols-2 gap-4 text-center"><div><div className="text-xs uppercase text-muted-foreground">Interest</div><div className="text-2xl font-bold">{fmt(A - p)}</div></div><div><div className="text-xs uppercase text-muted-foreground">Final amount</div><div className="text-2xl font-bold text-primary">{fmt(A)}</div></div></div></ResultBox>
    </div>
  );
}

export function SimpleInterest() {
  const [p, setP] = useState(100000);
  const [r, setR] = useState(8);
  const [t, setT] = useState(5);
  const si = (p * r * t) / 100;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Principal"><Input type="number" value={p} onChange={(e) => setP(+e.target.value)} /></Field>
        <Field label="Rate %"><Input type="number" step="0.1" value={r} onChange={(e) => setR(+e.target.value)} /></Field>
        <Field label="Years"><Input type="number" value={t} onChange={(e) => setT(+e.target.value)} /></Field>
      </div>
      <ResultBox><div className="grid sm:grid-cols-2 gap-4 text-center"><div><div className="text-xs uppercase text-muted-foreground">Interest</div><div className="text-2xl font-bold">{fmt(si)}</div></div><div><div className="text-xs uppercase text-muted-foreground">Total</div><div className="text-2xl font-bold text-primary">{fmt(p + si)}</div></div></div></ResultBox>
    </div>
  );
}

export function GstCalculator() {
  const [amt, setAmt] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("add");
  const result = useMemo(() => {
    if (mode === "add") { const g = (amt * rate) / 100; return { base: amt, gst: g, total: amt + g }; }
    const base = amt / (1 + rate / 100); return { base, gst: amt - base, total: amt };
  }, [amt, rate, mode]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Amount"><Input type="number" value={amt} onChange={(e) => setAmt(+e.target.value)} /></Field>
        <Field label="GST %"><Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} /></Field>
        <Field label="Mode"><Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="add">Add GST</option><option value="remove">Remove GST</option></Select></Field>
      </div>
      <ResultBox><div className="grid grid-cols-3 gap-3 text-center"><div><div className="text-xs text-muted-foreground">Base</div><div className="text-xl font-bold">{fmt(result.base)}</div></div><div><div className="text-xs text-muted-foreground">GST</div><div className="text-xl font-bold">{fmt(result.gst)}</div></div><div><div className="text-xs text-muted-foreground">Total</div><div className="text-xl font-bold text-primary">{fmt(result.total)}</div></div></div></ResultBox>
    </div>
  );
}

export function DiscountCalculator() {
  const [price, setPrice] = useState(1000);
  const [disc, setDisc] = useState(20);
  const save = (price * disc) / 100;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Original price"><Input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} /></Field>
        <Field label="Discount %"><Input type="number" value={disc} onChange={(e) => setDisc(+e.target.value)} /></Field>
      </div>
      <ResultBox><div className="grid grid-cols-2 gap-4 text-center"><div><div className="text-xs text-muted-foreground">You save</div><div className="text-2xl font-bold text-success">{fmt(save)}</div></div><div><div className="text-xs text-muted-foreground">Final price</div><div className="text-2xl font-bold text-primary">{fmt(price - save)}</div></div></div></ResultBox>
    </div>
  );
}

const RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.3, JPY: 156, CNY: 7.25, AUD: 1.52, CAD: 1.37, CHF: 0.88, NPR: 133.4, BDT: 117, PKR: 278, AED: 3.67, SGD: 1.34 };
export function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amt, setAmt] = useState(100);
  const out = (amt / RATES[from]) * RATES[to];
  return (
    <div className="space-y-4">
      <Field label="Amount"><Input type="number" value={amt} onChange={(e) => setAmt(+e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From"><Select value={from} onChange={(e) => setFrom(e.target.value)}>{Object.keys(RATES).map(k => <option key={k}>{k}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={(e) => setTo(e.target.value)}>{Object.keys(RATES).map(k => <option key={k}>{k}</option>)}</Select></Field>
      </div>
      <ResultBox><div className="text-center text-3xl font-bold text-primary">{out.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}</div><div className="text-center text-xs text-muted-foreground mt-2">Indicative rates — for reference only</div></ResultBox>
    </div>
  );
}
