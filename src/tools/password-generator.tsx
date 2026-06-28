import { useState, useEffect } from "react";
import { Field, Input, Btn } from "@/components/tool-page";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  num: "0123456789",
  sym: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

export default function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const [pwd, setPwd] = useState("");

  const gen = () => {
    let pool = "";
    if (upper) pool += SETS.upper;
    if (lower) pool += SETS.lower;
    if (num) pool += SETS.num;
    if (sym) pool += SETS.sym;
    if (!pool) return setPwd("");
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    setPwd(Array.from(arr, (v) => pool[v % pool.length]).join(""));
  };

  useEffect(() => { gen(); /* eslint-disable-next-line */ }, [len, upper, lower, num, sym]);

  const copy = async () => { await navigator.clipboard.writeText(pwd); toast.success("Copied"); };

  return (
    <div className="space-y-5">
      <div className="relative">
        <Input readOnly value={pwd} className="font-mono text-lg pr-24" />
        <div className="absolute right-1 top-1 flex gap-1">
          <button onClick={gen} className="grid h-8 w-8 place-items-center rounded hover:bg-accent"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={copy} className="grid h-8 w-8 place-items-center rounded hover:bg-accent"><Copy className="h-4 w-4" /></button>
        </div>
      </div>
      <Field label={`Length: ${len}`}>
        <input type="range" min={4} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full accent-primary" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        {[["Uppercase", upper, setUpper], ["Lowercase", lower, setLower], ["Numbers", num, setNum], ["Symbols", sym, setSym]].map(([l, v, s]: any) => (
          <label key={l} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm cursor-pointer hover:bg-accent">
            <input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} /> {l}
          </label>
        ))}
      </div>
      <Btn onClick={gen}>Generate new password</Btn>
    </div>
  );
}
