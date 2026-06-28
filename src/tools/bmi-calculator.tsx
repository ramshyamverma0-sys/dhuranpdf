import { useState, useMemo } from "react";
import { Field, Input, ResultBox } from "@/components/tool-page";

export default function BMICalculator() {
  const [h, setH] = useState(170);
  const [w, setW] = useState(70);

  const { bmi, cat, color } = useMemo(() => {
    if (!h || !w) return { bmi: 0, cat: "—", color: "text-muted-foreground" };
    const m = h / 100;
    const v = w / (m * m);
    let c = "Normal", col = "text-success";
    if (v < 18.5) { c = "Underweight"; col = "text-blue-500"; }
    else if (v >= 25 && v < 30) { c = "Overweight"; col = "text-amber-500"; }
    else if (v >= 30) { c = "Obese"; col = "text-destructive"; }
    return { bmi: v, cat: c, color: col };
  }, [h, w]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Height (cm)"><Input type="number" value={h} onChange={(e) => setH(+e.target.value)} /></Field>
        <Field label="Weight (kg)"><Input type="number" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
      </div>
      <ResultBox>
        <div className="text-center">
          <div className="text-xs uppercase text-muted-foreground">Your BMI</div>
          <div className="text-5xl font-bold text-primary mt-2">{bmi.toFixed(1)}</div>
          <div className={`mt-2 font-semibold ${color}`}>{cat}</div>
          <div className="text-xs text-muted-foreground mt-3">Normal range: 18.5 – 24.9</div>
        </div>
      </ResultBox>
    </div>
  );
}
