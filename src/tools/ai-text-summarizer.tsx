import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Textarea, Field, Select, Btn, ResultBox } from "@/components/tool-page";
import { summarizeText } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Loader2, Copy, Sparkles } from "lucide-react";

export default function AITextSummarizer() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState<"short" | "medium" | "bullet">("medium");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const fn = useServerFn(summarizeText);

  const run = async () => {
    if (text.trim().length < 30) return toast.error("Paste at least 30 characters");
    setBusy(true);
    try {
      const r = await fn({ data: { text, style } });
      setResult(r.summary);
    } catch (e: any) {
      toast.error(e.message || "AI request failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <Field label="Text to summarize">
        <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste an article, document or long text..." />
      </Field>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Field label="Style">
          <Select value={style} onChange={(e) => setStyle(e.target.value as any)}>
            <option value="short">Short (2-3 sentences)</option>
            <option value="medium">Medium paragraph</option>
            <option value="bullet">Bullet points</option>
          </Select>
        </Field>
        <div className="flex items-end"><Btn onClick={run} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Summarize</Btn></div>
      </div>
      {result && (
        <ResultBox>
          <div className="flex justify-between items-start gap-3 mb-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</div>
            <button onClick={async () => { await navigator.clipboard.writeText(result); toast.success("Copied"); }} className="text-xs inline-flex items-center gap-1 hover:text-primary"><Copy className="h-3 w-3" /> Copy</button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
        </ResultBox>
      )}
    </div>
  );
}
