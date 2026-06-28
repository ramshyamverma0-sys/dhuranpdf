import { useState } from "react";
import { Textarea, Btn } from "@/components/tool-page";
import { toast } from "sonner";

export default function UrlEncoder() {
  const [a, setA] = useState("https://dhuranpdf.com/search?q=PDF tools & AI");
  const [b, setB] = useState("");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium mb-1.5">Plain</label>
        <Textarea rows={8} value={a} onChange={(e) => setA(e.target.value)} />
        <Btn className="mt-2" onClick={() => setB(encodeURIComponent(a))}>Encode →</Btn>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Encoded</label>
        <Textarea rows={8} value={b} onChange={(e) => setB(e.target.value)} />
        <Btn className="mt-2" variant="secondary" onClick={() => { try { setA(decodeURIComponent(b)); } catch { toast.error("Invalid encoding"); } }}>← Decode</Btn>
      </div>
    </div>
  );
}
