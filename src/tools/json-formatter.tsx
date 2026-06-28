import { useState } from "react";
import { Textarea, Btn } from "@/components/tool-page";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Dhuran","tools":200,"premium":true}');
  const [output, setOutput] = useState("");
  const [err, setErr] = useState("");

  const format = (indent: number | null) => {
    try {
      const obj = JSON.parse(input);
      setOutput(indent === null ? JSON.stringify(obj) : JSON.stringify(obj, null, indent));
      setErr("");
    } catch (e: any) { setErr(e.message); setOutput(""); }
  };

  const copy = async () => { await navigator.clipboard.writeText(output); toast.success("Copied"); };

  return (
    <div className="space-y-4">
      <Textarea rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON..." />
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => format(2)}>Format (2 spaces)</Btn>
        <Btn variant="secondary" onClick={() => format(4)}>Format (4)</Btn>
        <Btn variant="secondary" onClick={() => format(null)}>Minify</Btn>
        <Btn variant="secondary" onClick={() => { try { JSON.parse(input); toast.success("Valid JSON ✓"); setErr(""); } catch (e: any) { setErr(e.message); } }}>Validate</Btn>
      </div>
      {err && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{err}</div>}
      {output && (
        <div className="relative">
          <Textarea rows={10} readOnly value={output} />
          <button onClick={copy} className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded hover:bg-accent bg-background border border-border"><Copy className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
