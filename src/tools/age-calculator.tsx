import { useState, useMemo } from "react";
import { Field, Input, ResultBox } from "@/components/tool-page";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const result = useMemo(() => {
    if (!dob) return null;
    const b = new Date(dob);
    const n = new Date();
    if (isNaN(b.getTime()) || b > n) return null;
    let years = n.getFullYear() - b.getFullYear();
    let months = n.getMonth() - b.getMonth();
    let days = n.getDate() - b.getDate();
    if (days < 0) { months--; days += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((n.getTime() - b.getTime()) / 86400000);
    return { years, months, days, totalDays, weeks: Math.floor(totalDays / 7), hours: totalDays * 24 };
  }, [dob]);

  return (
    <div className="space-y-5">
      <Field label="Date of birth"><Input type="date" max={today} value={dob} onChange={(e) => setDob(e.target.value)} /></Field>
      {result && (
        <ResultBox>
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-primary">{result.years}</span><span className="text-muted-foreground"> years </span>
            <span className="text-4xl font-bold text-primary">{result.months}</span><span className="text-muted-foreground"> months </span>
            <span className="text-4xl font-bold text-primary">{result.days}</span><span className="text-muted-foreground"> days</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg bg-background p-3"><div className="font-semibold">{result.totalDays.toLocaleString()}</div><div className="text-xs text-muted-foreground">days</div></div>
            <div className="rounded-lg bg-background p-3"><div className="font-semibold">{result.weeks.toLocaleString()}</div><div className="text-xs text-muted-foreground">weeks</div></div>
            <div className="rounded-lg bg-background p-3"><div className="font-semibold">{result.hours.toLocaleString()}</div><div className="text-xs text-muted-foreground">hours</div></div>
          </div>
        </ResultBox>
      )}
    </div>
  );
}
