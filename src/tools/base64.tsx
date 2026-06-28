import { useState } from "react";
import { Textarea, Btn } from "@/components/tool-page";
import { toast } from "sonner";

export default function Base64Tool() {
  const [a, setA] = useState("Hello, Dhuran PDF!");
  const [b, setB] = useState("");
  const [err, setErr] = useState("");

  const enc = () => { try { setB(btoa(unescape(encodeURIComponent(a)))); setErr(""); } catch (e: any) { setErr(e.message); } };
  const dec = () => { try { setA(decodeURIComponent(escape(atob(b)))); setErr(""); } catch (e: any) { setErr("Invalid Base64"); } };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium mb-1.5">Plain text</label>
        <Textarea rows={8} value={a} onChange={(e) => setA(e.target.value)} />
        <Btn className="mt-2" onClick={enc}>Encode →</Btn>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Base64</label>
        <Textarea rows={8} value={b} onChange={(e) => setB(e.target.value)} />
        <Btn className="mt-2" variant="secondary" onClick={dec}>← Decode</Btn>
      </div>
      {err && <div className="sm:col-span-2 text-sm text-destructive">{err}</div>}
      <div className="sm:col-span-2"><Btn variant="ghost" onClick={async () => { await navigator.clipboard.writeText(b || a); toast.success("Copied"); }}>Copy result</Btn></div>
    </div>
  );
}
