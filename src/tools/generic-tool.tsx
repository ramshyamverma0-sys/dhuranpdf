import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Btn, Field, Input, ResultBox, Textarea } from "@/components/tool-page";
import { download } from "@/components/file-dropzone";
import { Copy, Download, RotateCcw } from "lucide-react";

export default function GenericWorkingTool({ slug }: { slug: string }) {
  const [value, setValue] = useState("100");
  const [rate, setRate] = useState("10");
  const [text, setText] = useState("Paste text or data here");
  const result = useMemo(() => {
    const n = Number(value) || 0;
    const r = Number(rate) || 0;
    if (slug.includes("percentage")) return `${r}% of ${n} = ${(n * r) / 100}`;
    if (slug.includes("calculator") || slug.includes("finance")) return `Result: ${(n + (n * r) / 100).toLocaleString()}`;
    if (slug.includes("converter")) return `${n} converted at factor ${r} = ${(n * r).toLocaleString()}`;
    return text.trim().toUpperCase();
  }, [rate, slug, text, value]);

  const reset = () => { setValue("100"); setRate("10"); setText("Paste text or data here"); toast.success("Reset complete"); };
  const copy = async () => { await navigator.clipboard.writeText(result); toast.success("Copied"); };
  const dl = () => { download(new Blob([result], { type: "text/plain" }), `${slug}-result.txt`); toast.success("Downloaded"); };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Value"><Input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></Field>
        <Field label="Rate / factor"><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
      </div>
      <Field label="Text / data"><Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <ResultBox><div className="whitespace-pre-wrap text-sm font-medium">{result}</div></ResultBox>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={copy}><Copy className="h-4 w-4" />Copy result</Btn>
        <Btn variant="secondary" onClick={dl}><Download className="h-4 w-4" />Download</Btn>
        <Btn variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" />Reset</Btn>
      </div>
    </div>
  );
}
