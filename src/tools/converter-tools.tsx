import { useState, useMemo } from "react";
import { Field, Input, Select, ResultBox } from "@/components/tool-page";

function makeConverter(units: Record<string, number>, defaultFrom: string, defaultTo: string, suffix = "") {
  return function Converter() {
    const keys = Object.keys(units);
    const [from, setFrom] = useState(defaultFrom);
    const [to, setTo] = useState(defaultTo);
    const [val, setVal] = useState(1);
    const r = useMemo(() => (val * units[from]) / units[to], [val, from, to]);
    return (
      <div className="space-y-4">
        <Field label="Value"><Input type="number" value={val} onChange={(e) => setVal(+e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="From"><Select value={from} onChange={(e) => setFrom(e.target.value)}>{keys.map((k) => <option key={k}>{k}</option>)}</Select></Field>
          <Field label="To"><Select value={to} onChange={(e) => setTo(e.target.value)}>{keys.map((k) => <option key={k}>{k}</option>)}</Select></Field>
        </div>
        <ResultBox><div className="text-center text-lg"><span className="text-muted-foreground">{val} {from}{suffix} =</span><span className="text-primary text-3xl font-bold ml-3">{r.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span><span className="ml-2 text-muted-foreground">{to}{suffix}</span></div></ResultBox>
      </div>
    );
  };
}

export const WeightConverter = makeConverter({ Milligram: 0.001, Gram: 1, Kilogram: 1000, Tonne: 1e6, Ounce: 28.3495, Pound: 453.592, Stone: 6350.29 }, "Kilogram", "Pound");
export const AreaConverter = makeConverter({ "Sq Meter": 1, "Sq Kilometer": 1e6, "Sq Foot": 0.092903, "Sq Yard": 0.836127, Acre: 4046.86, Hectare: 10000, "Sq Mile": 2.59e6 }, "Sq Meter", "Sq Foot");
export const VolumeConverter = makeConverter({ Milliliter: 1, Liter: 1000, "Cubic Meter": 1e6, "US Gallon": 3785.41, "UK Gallon": 4546.09, Cup: 240, Pint: 473.176, Quart: 946.353 }, "Liter", "US Gallon");
export const SpeedConverter = makeConverter({ "m/s": 1, "km/h": 0.277778, "mph": 0.44704, "knot": 0.514444, "ft/s": 0.3048 }, "km/h", "mph");
export const TimeConverter = makeConverter({ Second: 1, Minute: 60, Hour: 3600, Day: 86400, Week: 604800, Month: 2629800, Year: 31557600 }, "Hour", "Minute");
export const DataStorageConverter = makeConverter({ Byte: 1, Kilobyte: 1024, Megabyte: 1024**2, Gigabyte: 1024**3, Terabyte: 1024**4, Petabyte: 1024**5 }, "Megabyte", "Gigabyte");

// Land units — meters squared base
const LAND: Record<string, number> = {
  "Sq Foot": 0.092903, "Sq Yard": 0.836127, "Sq Meter": 1, Are: 100, Hectare: 10000,
  Acre: 4046.86, "Bigha (Nepal)": 6772.63, "Bigha (UP)": 2529.29, Katha: 126.44, Dhur: 6.32, Ropani: 508.74, Aana: 31.79, Dam: 1.99, Kanal: 505.857, Marla: 25.293,
};
export const LandUnitConverter = makeConverter(LAND, "Sq Meter", "Bigha (Nepal)");

export function PlotAreaCalculator() {
  const [l, setL] = useState(40); const [w, setW] = useState(60); const [unit, setUnit] = useState("Sq Foot");
  const area = l * w;
  const m2 = area * LAND[unit];
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Length"><Input type="number" value={l} onChange={(e) => setL(+e.target.value)} /></Field>
        <Field label="Width"><Input type="number" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
        <Field label="Unit"><Select value={unit} onChange={(e) => setUnit(e.target.value)}>{Object.keys(LAND).map(k => <option key={k}>{k}</option>)}</Select></Field>
      </div>
      <ResultBox>
        <div className="text-center mb-3"><div className="text-xs uppercase text-muted-foreground">Total area</div><div className="text-3xl font-bold text-primary">{area.toLocaleString()} {unit}</div></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center pt-3 border-t border-border">
          {["Acre","Hectare","Sq Meter","Sq Yard"].map(u => <div key={u}><div className="font-semibold">{(m2 / LAND[u]).toFixed(3)}</div><div className="text-xs text-muted-foreground">{u}</div></div>)}
        </div>
      </ResultBox>
    </div>
  );
}

export function StampDutyCalculator() {
  const [val, setVal] = useState(5000000);
  const [rate, setRate] = useState(5);
  const duty = (val * rate) / 100;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Property value (₹)"><Input type="number" value={val} onChange={(e) => setVal(+e.target.value)} /></Field>
        <Field label="Stamp duty rate (%)"><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} /></Field>
      </div>
      <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Estimated stamp duty</div><div className="text-4xl font-bold text-primary mt-2">₹{Math.round(duty).toLocaleString("en-IN")}</div></div></ResultBox>
    </div>
  );
}
