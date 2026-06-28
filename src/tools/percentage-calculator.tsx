import { useState } from "react";
import { Field, Input, ResultBox } from "@/components/tool-page";

export default function PercentageCalculator() {
  const [x, setX] = useState(15);
  const [of, setOf] = useState(200);
  const [a, setA] = useState(50);
  const [b, setB] = useState(80);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold mb-3">What is X% of Y?</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Percent (X)"><Input type="number" value={x} onChange={(e) => setX(+e.target.value)} /></Field>
          <Field label="Value (Y)"><Input type="number" value={of} onChange={(e) => setOf(+e.target.value)} /></Field>
        </div>
        <ResultBox><div className="text-lg"><span className="text-muted-foreground">{x}% of {of} =</span> <span className="text-primary font-bold text-2xl ml-2">{((x * of) / 100).toLocaleString()}</span></div></ResultBox>
      </section>
      <section>
        <h3 className="font-semibold mb-3">A is what % of B?</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="A"><Input type="number" value={a} onChange={(e) => setA(+e.target.value)} /></Field>
          <Field label="B"><Input type="number" value={b} onChange={(e) => setB(+e.target.value)} /></Field>
        </div>
        <ResultBox><div className="text-lg"><span className="text-muted-foreground">{a} is</span> <span className="text-primary font-bold text-2xl mx-2">{b ? ((a / b) * 100).toFixed(2) : 0}%</span> <span className="text-muted-foreground">of {b}</span></div></ResultBox>
      </section>
    </div>
  );
}
