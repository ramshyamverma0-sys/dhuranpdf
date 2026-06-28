import { useState, useMemo } from "react";
import { Field, Input, Select, ResultBox } from "@/components/tool-page";

const toC: Record<string, (v: number) => number> = {
  Celsius: (v) => v, Fahrenheit: (v) => (v - 32) * 5 / 9, Kelvin: (v) => v - 273.15,
};
const fromC: Record<string, (v: number) => number> = {
  Celsius: (v) => v, Fahrenheit: (v) => v * 9 / 5 + 32, Kelvin: (v) => v + 273.15,
};

export default function TemperatureConverter() {
  const [from, setFrom] = useState("Celsius");
  const [to, setTo] = useState("Fahrenheit");
  const [val, setVal] = useState(0);
  const result = useMemo(() => fromC[to](toC[from](val)), [from, to, val]);
  const units = Object.keys(toC);

  return (
    <div className="space-y-5">
      <Field label="Value"><Input type="number" value={val} onChange={(e) => setVal(+e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="From"><Select value={from} onChange={(e) => setFrom(e.target.value)}>{units.map((u) => <option key={u}>{u}</option>)}</Select></Field>
        <Field label="To"><Select value={to} onChange={(e) => setTo(e.target.value)}>{units.map((u) => <option key={u}>{u}</option>)}</Select></Field>
      </div>
      <ResultBox>
        <div className="text-center text-lg">
          <span className="text-muted-foreground">{val}° {from} =</span>
          <span className="text-primary text-3xl font-bold ml-3">{result.toFixed(2)}°</span>
          <span className="text-muted-foreground ml-1">{to}</span>
        </div>
      </ResultBox>
    </div>
  );
}
