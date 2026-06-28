import { useState, useMemo } from "react";
import { Field, Input, Select, ResultBox } from "@/components/tool-page";

const UNITS: Record<string, number> = {
  Millimeter: 0.001, Centimeter: 0.01, Meter: 1, Kilometer: 1000,
  Inch: 0.0254, Foot: 0.3048, Yard: 0.9144, Mile: 1609.344,
};

export default function LengthConverter() {
  const keys = Object.keys(UNITS);
  const [from, setFrom] = useState("Meter");
  const [to, setTo] = useState("Foot");
  const [val, setVal] = useState(1);

  const result = useMemo(() => (val * UNITS[from]) / UNITS[to], [val, from, to]);

  return (
    <div className="space-y-5">
      <Field label="Value"><Input type="number" value={val} onChange={(e) => setVal(+e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="From"><Select value={from} onChange={(e) => setFrom(e.target.value)}>{keys.map((k) => <option key={k}>{k}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={(e) => setTo(e.target.value)}>{keys.map((k) => <option key={k}>{k}</option>)}</Select></Field>
      </div>
      <ResultBox>
        <div className="text-center text-lg">
          <span className="text-muted-foreground">{val} {from} =</span>
          <span className="text-primary text-3xl font-bold ml-3">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
          <span className="ml-2 text-muted-foreground">{to}</span>
        </div>
      </ResultBox>
    </div>
  );
}
