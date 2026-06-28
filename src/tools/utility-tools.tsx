import { useState } from "react";
import { Btn, Field, Input, Textarea } from "@/components/tool-page";
import { toast } from "sonner";

export function UuidGenerator() {
  const [list, setList] = useState<string[]>([crypto.randomUUID()]);
  const [count, setCount] = useState(5);
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <Field label="Count"><Input type="number" value={count} onChange={(e) => setCount(+e.target.value)} /></Field>
        <Btn onClick={() => setList(Array.from({ length: count }, () => crypto.randomUUID()))}>Generate</Btn>
        <Btn variant="secondary" onClick={async () => { await navigator.clipboard.writeText(list.join("\n")); toast.success("Copied"); }}>Copy all</Btn>
      </div>
      <div className="font-mono text-sm bg-surface rounded-md border border-border p-3 space-y-1 max-h-96 overflow-auto">{list.map((u) => <div key={u}>{u}</div>)}</div>
    </div>
  );
}

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
export function LoremGenerator() {
  const [n, setN] = useState(3);
  const [out, setOut] = useState("");
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <Field label="Paragraphs"><Input type="number" value={n} onChange={(e) => setN(+e.target.value)} /></Field>
        <Btn onClick={() => setOut(Array.from({ length: n }).map(() => LOREM).join("\n\n"))}>Generate</Btn>
      </div>
      {out && <Textarea rows={10} readOnly value={out} />}
    </div>
  );
}

export function RandomNumberGenerator() {
  const [min, setMin] = useState(1); const [max, setMax] = useState(100); const [n, setN] = useState(1);
  const [list, setList] = useState<number[]>([]);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Field label="Min"><Input type="number" value={min} onChange={(e) => setMin(+e.target.value)} /></Field>
        <Field label="Max"><Input type="number" value={max} onChange={(e) => setMax(+e.target.value)} /></Field>
        <Field label="Count"><Input type="number" value={n} onChange={(e) => setN(+e.target.value)} /></Field>
      </div>
      <Btn onClick={() => setList(Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min))}>Generate</Btn>
      {list.length > 0 && <div className="bg-surface border border-border rounded-md p-4 text-center text-2xl font-mono">{list.join(", ")}</div>}
    </div>
  );
}
