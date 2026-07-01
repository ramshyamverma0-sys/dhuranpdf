import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiPrompt, aiChat } from "@/lib/ai.functions";
import { Btn, Field, Textarea, Select, ResultBox, Input } from "@/components/tool-page";
import { toast } from "sonner";
import { Loader2, Send, Copy, Sparkles } from "lucide-react";
import { FileDropzone, download } from "@/components/file-dropzone";
import { extractPdfText, ocrPdf } from "@/tools/pdf-client";

type PresetKey = "grammar" | "paraphrase" | "translate" | "cover-letter" | "blog" | "email" | "resume" | "questions" | "notes" | "pdf-summary" | "pdf-qa";

function makePromptTool(opts: { preset: PresetKey; placeholder: string; controls?: (s: any, set: (v: any) => void) => React.ReactNode; buildUser: (text: string, state: any) => string; defaultState?: any }) {
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
        const r = await fn({ data: { preset: opts.preset, user: opts.buildUser(text, state) } });
        setOut(r.text);
      } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
    };
    return (
      <div className="space-y-3">
        <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder={opts.placeholder} />
        {opts.controls?.(state, setState)}
        <div className="flex flex-wrap gap-2">
          <Btn onClick={run} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate</Btn>
          <Btn variant="secondary" onClick={() => { setText(""); setOut(""); toast.success("Reset complete"); }}>Reset</Btn>
        </div>
        {out && <ResultBox>
          <div className="flex justify-between mb-2"><div className="text-xs font-semibold uppercase text-muted-foreground">Result</div>
          <div className="flex gap-3"><button onClick={async () => { await navigator.clipboard.writeText(out); toast.success("Copied"); }} className="text-xs inline-flex items-center gap-1 hover:text-primary"><Copy className="h-3 w-3" /> Copy</button><button onClick={() => { download(new Blob([out], { type: "text/plain" }), "ai-result.txt"); toast.success("Downloaded"); }} className="text-xs inline-flex items-center gap-1 hover:text-primary">Download</button></div></div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{out}</div>
        </ResultBox>}
      </div>
    );
  };
}


export const AIGrammarChecker = makePromptTool({
  preset: "grammar",
  placeholder: "Paste text to check grammar...",
  buildUser: (t) => `Correct this text:\n\n${t}`,
});

export const AIParaphraser = makePromptTool({
  preset: "paraphrase",
  placeholder: "Paste text to paraphrase...",
  defaultState: { tone: "neutral" },
  controls: (s, set) => <Field label="Tone"><Select value={s.tone} onChange={(e) => set({ ...s, tone: e.target.value })}><option>neutral</option><option>formal</option><option>casual</option><option>professional</option><option>friendly</option></Select></Field>,
  buildUser: (t, s) => `Rewrite this in a ${s.tone} tone:\n\n${t}`,
});

export const AITranslator = makePromptTool({
  preset: "translate",
  placeholder: "Paste text to translate...",
  defaultState: { lang: "Spanish" },
  controls: (s, set) => <Field label="Target language"><Select value={s.lang} onChange={(e) => set({ ...s, lang: e.target.value })}>{["Spanish","French","German","Italian","Portuguese","Hindi","Nepali","Bengali","Arabic","Chinese","Japanese","Korean","Russian","English"].map(l => <option key={l}>{l}</option>)}</Select></Field>,
  buildUser: (t, s) => `Translate to ${s.lang}:\n\n${t}`,
});

export const AICoverLetter = makePromptTool({
  preset: "cover-letter",
  placeholder: "Describe your role, target job, and key strengths...",
  buildUser: (t) => `Write a professional cover letter based on:\n\n${t}`,
});

export const AIBlogGenerator = makePromptTool({
  preset: "blog",
  placeholder: "Topic, audience, key points...",
  defaultState: { len: "medium" },
  controls: (s, set) => <Field label="Length"><Select value={s.len} onChange={(e) => set({ ...s, len: e.target.value })}><option>short</option><option>medium</option><option>long</option></Select></Field>,
  buildUser: (t, s) => `Write a ${s.len} blog post about:\n\n${t}`,
});

export const AIEmailWriter = makePromptTool({
  preset: "email",
  placeholder: "What's the email about? Who is it to?",
  defaultState: { tone: "professional" },
  controls: (s, set) => <Field label="Tone"><Select value={s.tone} onChange={(e) => set({ ...s, tone: e.target.value })}><option>professional</option><option>friendly</option><option>formal</option><option>persuasive</option><option>apologetic</option></Select></Field>,
  buildUser: (t, s) => `Write a ${s.tone} email with a subject line for:\n\n${t}`,
});

export const AIResumeBuilder = makePromptTool({
  preset: "resume",
  placeholder: "Name, role, experience, education, skills...",
  buildUser: (t) => `Build a professional resume in markdown from:\n\n${t}`,
});

export const AIQuestionGenerator = makePromptTool({
  preset: "questions",
  placeholder: "Topic or text to base questions on...",
  defaultState: { n: "5" },
  controls: (s, set) => <Field label="Number of questions"><Input type="number" value={s.n} onChange={(e) => set({ ...s, n: e.target.value })} /></Field>,
  buildUser: (t, s) => `Create ${s.n} multiple-choice questions about:\n\n${t}`,
});

export const AINotesGenerator = makePromptTool({
  preset: "notes",
  placeholder: "Paste lecture, meeting, article, or PDF text...",
  defaultState: { style: "study" },
  controls: (s, set) => <Field label="Notes style"><Select value={s.style} onChange={(e) => set({ ...s, style: e.target.value })}><option>study</option><option>meeting</option><option>outline</option><option>revision</option></Select></Field>,
  buildUser: (t, s) => `Create ${s.style} notes from:\n\n${t}`,
});


export function AIPdfSummarizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const fn = useServerFn(aiPrompt);
  const run = async () => {
    setBusy(true);
    try {
      const source = files.length ? await extractPdfText(files[0]) : text;
      if (source.trim().length < 20) return toast.error("Upload a text PDF or paste PDF text");
      const r = await fn({ data: { preset: "pdf-summary", user: `Summarize this PDF content:\n\n${source.slice(0, 20000)}` } });
      setOut(r.text); toast.success("PDF summary generated");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Upload a text PDF, or paste extracted text below" /><Field label="Optional PDF text"><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} /></Field><div className="flex flex-wrap gap-2"><Btn onClick={run} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}Summarize PDF</Btn><Btn variant="secondary" onClick={() => { setFiles([]); setText(""); setOut(""); toast.success("Reset complete"); }}>Reset</Btn></div>{out && <ResultBox><div className="flex justify-between mb-2"><div className="text-xs font-semibold uppercase text-muted-foreground">PDF Summary</div><button onClick={async () => { await navigator.clipboard.writeText(out); toast.success("Copied"); }} className="text-xs inline-flex items-center gap-1 hover:text-primary"><Copy className="h-3 w-3" /> Copy</button></div><div className="whitespace-pre-wrap text-sm leading-relaxed">{out}</div><Btn className="mt-4" variant="secondary" onClick={() => download(new Blob([out], { type: "text/plain" }), "pdf-summary.txt")}>Download summary</Btn></ResultBox>}</div>;
}

export function AIPdfChat() {
  const [files, setFiles] = useState<File[]>([]);
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("What are the key points?");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const fn = useServerFn(aiPrompt);
  const loadPdf = async () => {
    if (!files.length) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const text = await extractPdfText(files[0]);
      setContext(text.slice(0, 18000));
      toast.success("PDF text loaded");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  const ask = async () => {
    if (!context.trim()) return toast.error("Load PDF text first");
    if (!question.trim()) return toast.error("Enter a question");
    setBusy(true);
    try {
      const r = await fn({ data: { system: "Answer questions using only the supplied PDF content. If the answer is not present, say so clearly.", user: `PDF content:\n${context}\n\nQuestion: ${question}` } });
      setAnswer(r.text);
      toast.success("Answer generated");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} /><Btn onClick={loadPdf} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Load PDF</Btn>{context && <div className="text-xs text-success">Loaded {context.length.toLocaleString()} characters</div>}<Field label="Ask about this PDF"><Input value={question} onChange={(e) => setQuestion(e.target.value)} /></Field><Btn onClick={ask} disabled={busy || !context}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}Ask AI</Btn>{answer && <ResultBox><div className="flex justify-between mb-2"><div className="text-xs font-semibold uppercase text-muted-foreground">Answer</div><button onClick={async () => { await navigator.clipboard.writeText(answer); toast.success("Copied"); }} className="text-xs inline-flex items-center gap-1 hover:text-primary"><Copy className="h-3 w-3" /> Copy</button></div><div className="whitespace-pre-wrap text-sm leading-relaxed">{answer}</div></ResultBox>}</div>;
}

export function AIOcrScanner() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files.length) return toast.error("Add a scanned PDF");
    setBusy(true); setText("");
    try {
      const out = await ocrPdf(files[0], setStatus);
      setText(out || "No text recognized.");
      toast.success("OCR complete");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); setStatus(""); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="OCR runs locally in your browser" /><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Scan text with AI OCR</Btn>{status && <div className="text-sm text-muted-foreground">{status}</div>}{text && <><Textarea rows={12} readOnly value={text} /><div className="flex gap-2 flex-wrap"><Btn variant="secondary" onClick={async () => { await navigator.clipboard.writeText(text); toast.success("Copied"); }}>Copy</Btn><Btn variant="secondary" onClick={() => download(new Blob([text], { type: "text/plain" }), "ocr-scan.txt")}>Download</Btn></div></>}</div>;
}

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
