import { useState, useMemo, useEffect, useRef } from "react";
import { Field, Input, Btn, ResultBox } from "@/components/tool-page";

export function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => setMs(baseRef.current + (Date.now() - startRef.current)), 33);
    return () => clearInterval(id);
  }, [running]);
  const fmt = (n: number) => {
    const m = Math.floor(n / 60000), s = Math.floor((n % 60000) / 1000), c = Math.floor((n % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
  };
  return (
    <div className="space-y-4">
      <div className="text-center text-6xl font-mono font-bold text-primary py-8">{fmt(ms)}</div>
      <div className="flex justify-center gap-2">
        {!running ? <Btn onClick={() => { baseRef.current = ms; setRunning(true); }}>Start</Btn>
          : <Btn variant="secondary" onClick={() => setRunning(false)}>Pause</Btn>}
        <Btn variant="secondary" onClick={() => setLaps([ms, ...laps])} disabled={!running}>Lap</Btn>
        <Btn variant="ghost" onClick={() => { setMs(0); setLaps([]); baseRef.current = 0; setRunning(false); }}>Reset</Btn>
      </div>
      {laps.length > 0 && <div className="border-t border-border pt-3 space-y-1 text-sm font-mono">{laps.map((l, i) => <div key={i} className="flex justify-between"><span>Lap {laps.length - i}</span><span>{fmt(l)}</span></div>)}</div>}
    </div>
  );
}

export function Timer() {
  const [minutes, setMinutes] = useState(5);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => {
      if (l <= 1) { setRunning(false); try { new Audio("data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAAAP//AAAA").play(); } catch {} return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = Math.floor(left / 60), s = left % 60;
  return (
    <div className="space-y-4">
      {!running && left === 0 ? (
        <Field label="Minutes"><Input type="number" value={minutes} onChange={(e) => setMinutes(+e.target.value)} /></Field>
      ) : (
        <div className="text-center text-6xl font-mono font-bold text-primary py-8">{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</div>
      )}
      <div className="flex justify-center gap-2">
        {!running ? <Btn onClick={() => { if (left === 0) setLeft(minutes * 60); setRunning(true); }}>Start</Btn>
          : <Btn variant="secondary" onClick={() => setRunning(false)}>Pause</Btn>}
        <Btn variant="ghost" onClick={() => { setRunning(false); setLeft(0); }}>Reset</Btn>
      </div>
    </div>
  );
}

export function DateDifference() {
  const [a, setA] = useState("2020-01-01");
  const [b, setB] = useState(new Date().toISOString().slice(0, 10));
  const diff = useMemo(() => {
    const d = Math.abs((+new Date(b) - +new Date(a)) / 86400000);
    return { days: Math.round(d), weeks: (d / 7).toFixed(1), months: (d / 30.44).toFixed(2), years: (d / 365.25).toFixed(2) };
  }, [a, b]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="From"><Input type="date" value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="To"><Input type="date" value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </div>
      <ResultBox>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {Object.entries(diff).map(([k, v]) => (
            <div key={k}><div className="text-2xl font-bold text-primary">{v}</div><div className="text-xs text-muted-foreground capitalize">{k}</div></div>
          ))}
        </div>
      </ResultBox>
    </div>
  );
}

export function LeapYear() {
  const [y, setY] = useState(new Date().getFullYear());
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  return (
    <div className="space-y-4">
      <Field label="Year"><Input type="number" value={y} onChange={(e) => setY(+e.target.value)} /></Field>
      <ResultBox><div className="text-center text-2xl font-bold"><span className={isLeap ? "text-success" : "text-destructive"}>{y} is {isLeap ? "" : "NOT "}a leap year</span></div></ResultBox>
    </div>
  );
}

export function DayFinder() {
  const [d, setD] = useState(new Date().toISOString().slice(0, 10));
  const day = new Date(d).toLocaleDateString(undefined, { weekday: "long" });
  return (
    <div className="space-y-4">
      <Field label="Date"><Input type="date" value={d} onChange={(e) => setD(e.target.value)} /></Field>
      <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Day of week</div><div className="text-5xl font-bold text-primary mt-2">{day}</div></div></ResultBox>
    </div>
  );
}

export function PomodoroTimer() {
  const phases = { work: 25 * 60, break: 5 * 60 };
  const [phase, setPhase] = useState<"work" | "break">("work");
  const [left, setLeft] = useState(phases.work);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => {
      if (l <= 1) { const next = phase === "work" ? "break" : "work"; setPhase(next); return phases[next]; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running, phase]);
  const m = Math.floor(left / 60), s = left % 60;
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${phase === "work" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>{phase}</div>
        <div className="text-7xl font-mono font-bold text-primary py-8">{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</div>
      </div>
      <div className="flex justify-center gap-2">
        <Btn onClick={() => setRunning(!running)}>{running ? "Pause" : "Start"}</Btn>
        <Btn variant="ghost" onClick={() => { setRunning(false); setPhase("work"); setLeft(phases.work); }}>Reset</Btn>
      </div>
    </div>
  );
}
