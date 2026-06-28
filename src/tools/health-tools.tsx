import { useState, useMemo } from "react";
import { Field, Input, Select, ResultBox } from "@/components/tool-page";

export function BmrCalculator() {
  const [w, setW] = useState(70); const [h, setH] = useState(170); const [a, setA] = useState(30); const [g, setG] = useState("male");
  const bmr = g === "male" ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Weight (kg)"><Input type="number" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
        <Field label="Height (cm)"><Input type="number" value={h} onChange={(e) => setH(+e.target.value)} /></Field>
        <Field label="Age"><Input type="number" value={a} onChange={(e) => setA(+e.target.value)} /></Field>
        <Field label="Gender"><Select value={g} onChange={(e) => setG(e.target.value)}><option>male</option><option>female</option></Select></Field>
      </div>
      <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Basal Metabolic Rate</div><div className="text-5xl font-bold text-primary mt-2">{Math.round(bmr)}</div><div className="text-sm text-muted-foreground mt-1">calories / day at rest</div></div></ResultBox>
    </div>
  );
}

export function CalorieCalculator() {
  const [w, setW] = useState(70); const [h, setH] = useState(170); const [a, setA] = useState(30); const [g, setG] = useState("male"); const [act, setAct] = useState(1.55);
  const bmr = g === "male" ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161;
  const cals = bmr * act;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="Weight (kg)"><Input type="number" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
        <Field label="Height (cm)"><Input type="number" value={h} onChange={(e) => setH(+e.target.value)} /></Field>
        <Field label="Age"><Input type="number" value={a} onChange={(e) => setA(+e.target.value)} /></Field>
        <Field label="Gender"><Select value={g} onChange={(e) => setG(e.target.value)}><option>male</option><option>female</option></Select></Field>
      </div>
      <Field label="Activity level"><Select value={act} onChange={(e) => setAct(+e.target.value)}>
        <option value={1.2}>Sedentary</option><option value={1.375}>Lightly active</option><option value={1.55}>Moderately active</option><option value={1.725}>Very active</option><option value={1.9}>Athlete</option>
      </Select></Field>
      <ResultBox><div className="grid grid-cols-3 gap-3 text-center"><div><div className="text-xs text-muted-foreground">Lose weight</div><div className="text-xl font-bold">{Math.round(cals - 500)}</div></div><div><div className="text-xs text-muted-foreground">Maintain</div><div className="text-2xl font-bold text-primary">{Math.round(cals)}</div></div><div><div className="text-xs text-muted-foreground">Gain</div><div className="text-xl font-bold">{Math.round(cals + 500)}</div></div></div></ResultBox>
    </div>
  );
}

export function BodyFatCalculator() {
  const [waist, setWaist] = useState(80); const [neck, setNeck] = useState(40); const [hip, setHip] = useState(95); const [h, setH] = useState(170); const [g, setG] = useState("male");
  const bf = useMemo(() => {
    if (g === "male") return 495 / (1.0324 - 0.19077*Math.log10(waist - neck) + 0.15456*Math.log10(h)) - 450;
    return 495 / (1.29579 - 0.35004*Math.log10(waist + hip - neck) + 0.22100*Math.log10(h)) - 450;
  }, [waist, neck, hip, h, g]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Gender"><Select value={g} onChange={(e) => setG(e.target.value)}><option>male</option><option>female</option></Select></Field>
        <Field label="Height (cm)"><Input type="number" value={h} onChange={(e) => setH(+e.target.value)} /></Field>
        <Field label="Waist (cm)"><Input type="number" value={waist} onChange={(e) => setWaist(+e.target.value)} /></Field>
        <Field label="Neck (cm)"><Input type="number" value={neck} onChange={(e) => setNeck(+e.target.value)} /></Field>
        {g === "female" && <Field label="Hip (cm)"><Input type="number" value={hip} onChange={(e) => setHip(+e.target.value)} /></Field>}
      </div>
      <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Body fat</div><div className="text-5xl font-bold text-primary mt-2">{bf.toFixed(1)}%</div></div></ResultBox>
    </div>
  );
}

export function WaterIntake() {
  const [w, setW] = useState(70);
  const ml = w * 35;
  return (
    <div className="space-y-4">
      <Field label="Weight (kg)"><Input type="number" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
      <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Recommended daily water</div><div className="text-5xl font-bold text-primary mt-2">{(ml / 1000).toFixed(1)} L</div><div className="text-sm text-muted-foreground mt-1">≈ {Math.round(ml / 250)} cups of 250ml</div></div></ResultBox>
    </div>
  );
}

export function IdealWeight() {
  const [h, setH] = useState(170); const [g, setG] = useState("male");
  const inches = h / 2.54;
  const over5 = Math.max(0, inches - 60);
  const base = g === "male" ? 50 : 45.5;
  const iw = base + 2.3 * over5;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Height (cm)"><Input type="number" value={h} onChange={(e) => setH(+e.target.value)} /></Field>
        <Field label="Gender"><Select value={g} onChange={(e) => setG(e.target.value)}><option>male</option><option>female</option></Select></Field>
      </div>
      <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Ideal weight (Devine)</div><div className="text-5xl font-bold text-primary mt-2">{iw.toFixed(1)} kg</div><div className="text-sm text-muted-foreground mt-1">Range: {(iw * 0.9).toFixed(1)} – {(iw * 1.1).toFixed(1)} kg</div></div></ResultBox>
    </div>
  );
}
