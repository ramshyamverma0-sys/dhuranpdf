import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiPrompt, aiChat } from "@/lib/ai.functions";
import { Btn, Field, Textarea, Select, ResultBox, Input } from "@/components/tool-page";
import { toast } from "sonner";
import { Loader2, Send, Copy, Sparkles } from "lucide-react";

function makePromptTool(opts: { system: string; placeholder: string; controls?: (s: any, set: (v: any) => void) => React.ReactNode; buildUser: (text: string, state: any) => string; defaultState?: any }) {
  return function PromptTool() {
    const [text, setText] = useState("");
    const [state, setState] = useState(opts.defaultState || {});
    const [out, setOut] = useState("");
    const [busy, setBusy] = useState(false);
    const fn = useServerFn(aiPrompt);
    const run = async () => {
      if (text.trim().length < 5) return toast.error("Enter some text");
      setBusy(true);
      try {
        const r = await fn({ data: { system: opts.system, user: opts.buildUser(text, state) } });
        setOut(r.text);
      } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
    };
    return (
      <div className="space-y-3">
        <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder={opts.placeholder} />
        {opts.controls?.(state, setState)}
        <Btn onClick={run} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate</Btn>
        {out && <ResultBox>
          <div className="flex justify-between mb-2"><div className="text-xs font-semibold uppercase text-muted-foreground">Result</div>
          <button onClick={async () => { await navigator.clipboard.writeText(out); toast.success("Copied"); }} className="text-xs inline-flex items-center gap-1 hover:text-primary"><Copy className="h-3 w-3" /> Copy</button></div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{out}</div>
        </ResultBox>}
      </div>
    );
  };
}

export const AIGrammarChecker = makePromptTool({
  system: "You are a meticulous grammar editor. Fix grammar, spelling, punctuation and clarity. Return only the corrected text.",
  placeholder: "Paste text to check grammar...",
  buildUser: (t) => `Correct this text:\n\n${t}`,
});

export const AIParaphraser = makePromptTool({
  system: "You are an expert paraphraser. Rewrite the text preserving meaning. Return only the rewritten text.",
  placeholder: "Paste text to paraphrase...",
  defaultState: { tone: "neutral" },
  controls: (s, set) => <Field label="Tone"><Select value={s.tone} onChange={(e) => set({ ...s, tone: e.target.value })}><option>neutral</option><option>formal</option><option>casual</option><option>professional</option><option>friendly</option></Select></Field>,
  buildUser: (t, s) => `Rewrite this in a ${s.tone} tone:\n\n${t}`,
});

export const AITranslator = makePromptTool({
  system: "You are a precise translator. Translate the text to the requested language. Return only the translation.",
  placeholder: "Paste text to translate...",
  defaultState: { lang: "Spanish" },
  controls: (s, set) => <Field label="Target language"><Select value={s.lang} onChange={(e) => set({ ...s, lang: e.target.value })}>{["Spanish","French","German","Italian","Portuguese","Hindi","Nepali","Bengali","Arabic","Chinese","Japanese","Korean","Russian","English"].map(l => <option key={l}>{l}</option>)}</Select></Field>,
  buildUser: (t, s) => `Translate to ${s.lang}:\n\n${t}`,
});

export const AICoverLetter = makePromptTool({
  system: "You are an expert career writer. Generate a tailored, concise cover letter (~250 words) based on the user's notes.",
  placeholder: "Describe your role, target job, and key strengths...",
  buildUser: (t) => `Write a professional cover letter based on:\n\n${t}`,
});

export const AIBlogGenerator = makePromptTool({
  system: "You are a skilled blog writer. Write engaging, SEO-friendly blog posts with headings, intro and conclusion.",
  placeholder: "Topic, audience, key points...",
  defaultState: { len: "medium" },
  controls: (s, set) => <Field label="Length"><Select value={s.len} onChange={(e) => set({ ...s, len: e.target.value })}><option>short</option><option>medium</option><option>long</option></Select></Field>,
  buildUser: (t, s) => `Write a ${s.len} blog post about:\n\n${t}`,
});

export const AIEmailWriter = makePromptTool({
  system: "You are a professional email writer. Compose clear, polite emails with subject line.",
  placeholder: "What's the email about? Who is it to?",
  defaultState: { tone: "professional" },
  controls: (s, set) => <Field label="Tone"><Select value={s.tone} onChange={(e) => set({ ...s, tone: e.target.value })}><option>professional</option><option>friendly</option><option>formal</option><option>persuasive</option><option>apologetic</option></Select></Field>,
  buildUser: (t, s) => `Write a ${s.tone} email with a subject line for:\n\n${t}`,
});

export const AIResumeBuilder = makePromptTool({
  system: "You are an expert resume writer. Build a clean, ATS-friendly resume in markdown with sections: Summary, Experience, Education, Skills.",
  placeholder: "Name, role, experience, education, skills...",
  buildUser: (t) => `Build a professional resume in markdown from:\n\n${t}`,
});

export const AIQuestionGenerator = makePromptTool({
  system: "You are a quiz creator. Generate clear multiple-choice questions with 4 options each and mark the correct one.",
  placeholder: "Topic or text to base questions on...",
  defaultState: { n: "5" },
  controls: (s, set) => <Field label="Number of questions"><Input type="number" value={s.n} onChange={(e) => set({ ...s, n: e.target.value })} /></Field>,
  buildUser: (t, s) => `Create ${s.n} multiple-choice questions about:\n\n${t}`,
});

export const AIPdfSummarizer = makePromptTool({
  system: "You are a concise document summarizer. Provide key points and a brief executive summary.",
  placeholder: "Paste PDF text content here (use 'PDF to Text' tool first)...",
  buildUser: (t) => `Summarize this document content with bullet points and a brief summary:\n\n${t}`,
});

export function AIChat() {
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const fn = useServerFn(aiChat);
  const send = async () => {
    if (!input.trim()) return;
    const next = [...msgs, { role: "user" as const, content: input }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const r = await fn({ data: { messages: next } });
      setMsgs([...next, { role: "assistant" as const, content: r.text }]);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <div className="h-96 overflow-y-auto bg-surface border border-border rounded-lg p-3 space-y-3">
        {msgs.length === 0 && <div className="text-center text-sm text-muted-foreground py-12">Ask anything...</div>}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{m.content}</div>
          </div>
        ))}
        {busy && <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your message..." />
        <Btn onClick={send} disabled={busy}><Send className="h-4 w-4" /> Send</Btn>
      </div>
    </div>
  );
}
