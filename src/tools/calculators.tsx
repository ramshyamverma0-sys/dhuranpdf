import { useState, useMemo } from "react";
import { Field, Input, Btn, ResultBox, Select } from "@/components/tool-page";

export function BasicCalculator() {
  const [d, setD] = useState("0");
  const press = (k: string) => {
    setD((prev) => {
      if (k === "C") return "0";
      if (k === "←") return prev.length > 1 ? prev.slice(0, -1) : "0";
      if (k === "=") {
        try {
          const safe = prev.replace(/[^0-9+\-*/.() %]/g, "");
          // eslint-disable-next-line no-new-func
          const v = Function(`"use strict";return (${safe.replace(/%/g, "/100")})`)();
          return String(v);
        } catch { return "Error"; }
      }
      return prev === "0" || prev === "Error" ? k : prev + k;
    });
  };
  const keys = ["C","←","%","/","7","8","9","*","4","5","6","-","1","2","3","+","0",".","="];
  return (
    <div className="max-w-xs mx-auto">
      <div className="rounded-lg border border-border bg-surface p-4 mb-3 text-right text-3xl font-mono break-all min-h-16">{d}</div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => (
          <button key={k} onClick={() => press(k)} className={`h-12 rounded-md border border-border font-semibold ${["C","←"].includes(k) ? "bg-destructive/10 text-destructive" : ["/","*","-","+","=","%"].includes(k) ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"} ${k==="0" ? "col-span-1" : ""}`}>{k}</button>
        ))}
      </div>
    </div>
  );
}

export function ScientificCalculator() {
  const [e, setE] = useState("");
  const [r, setR] = useState<string | null>(null);
  const calc = () => {
    try {
      const expr = e
        .replace(/π/g, "Math.PI").replace(/e(?![a-z])/gi, "Math.E")
        .replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(").replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log10(").replace(/ln\(/g, "Math.log(")
        .replace(/sqrt\(/g, "Math.sqrt(").replace(/\^/g, "**");
      // eslint-disable-next-line no-new-func
      setR(String(Function(`"use strict";return (${expr})`)()));
    } catch { setR("Error"); }
  };
  return (
    <div className="space-y-3">
      <Field label="Expression"><Input value={e} onChange={(ev) => setE(ev.target.value)} placeholder="e.g. sin(π/2) + sqrt(16) + 2^3" /></Field>
      <div className="flex flex-wrap gap-2 text-xs">
        {["sin(","cos(","tan(","log(","ln(","sqrt(","π","e","^","(",")"].map((s) => (
          <button key={s} onClick={() => setE((p) => p + s)} className="h-8 px-2 rounded border border-border hover:bg-accent">{s}</button>
        ))}
      </div>
      <Btn onClick={calc}>Calculate</Btn>
      {r !== null && <ResultBox><div className="text-3xl font-bold text-primary text-center">{r}</div></ResultBox>}
    </div>
  );
}

export function FractionCalculator() {
  const [a, setA] = useState("1/2");
  const [b, setB] = useState("3/4");
  const [op, setOp] = useState("+");
  const parse = (s: string): [number, number] => {
    if (s.includes("/")) { const [n, d] = s.split("/").map(Number); return [n, d || 1]; }
    return [Number(s), 1];
  };
  const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));
  const result = useMemo(() => {
    const [an, ad] = parse(a), [bn, bd] = parse(b);
    let n = 0, d = 1;
    if (op === "+") { n = an*bd + bn*ad; d = ad*bd; }
    if (op === "-") { n = an*bd - bn*ad; d = ad*bd; }
    if (op === "*") { n = an*bn; d = ad*bd; }
    if (op === "/") { n = an*bd; d = ad*bn; }
    const g = gcd(n, d) || 1;
    return `${n/g}/${d/g}` + (d !== 0 ? ` = ${(n/d).toFixed(4)}` : "");
  }, [a, b, op]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Fraction A"><Input value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="Op"><Select value={op} onChange={(e) => setOp(e.target.value)}><option>+</option><option>-</option><option>*</option><option>/</option></Select></Field>
        <Field label="Fraction B"><Input value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </div>
      <ResultBox><div className="text-2xl font-bold text-primary text-center">{result}</div></ResultBox>
    </div>
  );
}

export function GpaCalculator() {
  const [rows, setRows] = useState([{ name: "Course 1", grade: "A", credits: 3 }]);
  const map: Record<string, number> = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, D: 1.0, F: 0 };
  const gpa = useMemo(() => {
    const total = rows.reduce((s, r) => s + (map[r.grade] ?? 0) * r.credits, 0);
    const cr = rows.reduce((s, r) => s + r.credits, 0);
    return cr ? (total / cr).toFixed(2) : "0.00";
  }, [rows]);
  return (
    <div className="space-y-4">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_120px_100px_auto] gap-2">
          <Input value={r.name} onChange={(e) => { const c = [...rows]; c[i].name = e.target.value; setRows(c); }} />
          <Select value={r.grade} onChange={(e) => { const c = [...rows]; c[i].grade = e.target.value; setRows(c); }}>{Object.keys(map).map((g) => <option key={g}>{g}</option>)}</Select>
          <Input type="number" value={r.credits} onChange={(e) => { const c = [...rows]; c[i].credits = +e.target.value; setRows(c); }} />
          <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="h-10 px-3 rounded border border-border hover:bg-destructive/10">×</button>
        </div>
      ))}
      <Btn variant="secondary" onClick={() => setRows([...rows, { name: `Course ${rows.length + 1}`, grade: "A", credits: 3 }])}>+ Add Course</Btn>
      <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Your GPA</div><div className="text-5xl font-bold text-primary mt-2">{gpa}</div></div></ResultBox>
    </div>
  );
}

export function DateCalculator() {
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(30);
  const [op, setOp] = useState("+");
  const result = useMemo(() => {
    const d = new Date(start);
    d.setDate(d.getDate() + (op === "+" ? days : -days));
    return d.toDateString();
  }, [start, days, op]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Start date"><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="Operation"><Select value={op} onChange={(e) => setOp(e.target.value)}><option value="+">Add</option><option value="-">Subtract</option></Select></Field>
        <Field label="Days"><Input type="number" value={days} onChange={(e) => setDays(+e.target.value)} /></Field>
      </div>
      <ResultBox><div className="text-center text-2xl font-bold text-primary">{result}</div></ResultBox>
    </div>
  );
}
