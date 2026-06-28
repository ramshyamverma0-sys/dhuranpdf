import { useState, useMemo } from "react";
import { Textarea } from "@/components/tool-page";

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const t = text;
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    const chars = t.length;
    const charsNoSpace = t.replace(/\s/g, "").length;
    const sentences = (t.match(/[.!?]+/g) || []).length;
    const paragraphs = t.split(/\n+/).filter((p) => p.trim()).length;
    return { words, chars, charsNoSpace, sentences, paragraphs, readMin: Math.max(1, Math.ceil(words / 200)) };
  }, [text]);

  return (
    <div className="space-y-5">
      <Textarea rows={10} placeholder="Paste or type your text here..." value={text} onChange={(e) => setText(e.target.value)} />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
        {[
          ["Words", stats.words], ["Characters", stats.chars], ["No spaces", stats.charsNoSpace],
          ["Sentences", stats.sentences], ["Paragraphs", stats.paragraphs], ["Read time", stats.readMin + " min"],
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-lg bg-surface border border-border p-3">
            <div className="text-xl font-bold text-primary">{v}</div>
            <div className="text-xs text-muted-foreground mt-1">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
