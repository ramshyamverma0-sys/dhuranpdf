import { useState } from "react";
import { Btn, Field, Input, Textarea, Select, ResultBox } from "@/components/tool-page";
import { toast } from "sonner";

function indent(code: string, langOpen = /[{<(]/, langClose = /[}>)]/) {
  let depth = 0, out = "";
  const tab = "  ";
  for (const ch of code) {
    if (langClose.test(ch)) depth = Math.max(0, depth - 1);
    out += ch;
    if (ch === "\n") out += tab.repeat(depth);
    if (langOpen.test(ch)) depth++;
  }
  return out;
}

function formatHtml(s: string) {
  const t = s.replace(/>\s*</g, ">\n<").trim();
  let depth = 0;
  return t.split("\n").map((line) => {
    if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
    const out = "  ".repeat(depth) + line;
    if (/^<[^!\/?]/.test(line) && !/\/>$/.test(line) && !/<\/.+>/.test(line)) depth++;
    return out;
  }).join("\n");
}

const Formatter = (kind: "html" | "css" | "js" | "sql") => function FormatterTool() {
  const [text, setText] = useState("");
  const fmt = () => {
    if (kind === "html") setText(formatHtml(text));
    else if (kind === "sql") setText(text.replace(/\s+/g, " ").replace(/\b(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT INTO|UPDATE|DELETE FROM|SET|VALUES)\b/gi, "\n$1").trim());
    else setText(indent(text.replace(/\s*([{};])\s*/g, "$1\n").replace(/\n+/g, "\n")));
  };
  return <div className="space-y-3"><Textarea rows={14} value={text} onChange={(e) => setText(e.target.value)} placeholder={`Paste ${kind.toUpperCase()} code...`} /><Btn onClick={fmt}>Format</Btn></div>;
};

export const HtmlFormatter = Formatter("html");
export const CssFormatter = Formatter("css");
export const JsFormatter = Formatter("js");
export const SqlFormatter = Formatter("sql");

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Email me at hello@dhuranpdf.com or support@dhuranpdf.com");
  let matches: string[] = [], err = "";
  try { matches = text.match(new RegExp(pattern, flags)) || []; } catch (e: any) { err = e.message; }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_100px] gap-2">
        <Field label="Pattern"><Input value={pattern} onChange={(e) => setPattern(e.target.value)} /></Field>
        <Field label="Flags"><Input value={flags} onChange={(e) => setFlags(e.target.value)} /></Field>
      </div>
      <Field label="Test text"><Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      {err ? <div className="text-destructive text-sm">{err}</div>
        : <div className="bg-surface border border-border rounded-md p-3"><div className="text-xs font-semibold mb-2">{matches.length} matches</div>{matches.map((m, i) => <div key={i} className="font-mono text-sm">{m}</div>)}</div>}
    </div>
  );
}

export function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) {
    if (max === r / 255) h = ((g / 255 - b / 255) / d) % 6;
    else if (max === g / 255) h = (b / 255 - r / 255) / d + 2;
    else h = (r / 255 - g / 255) / d + 4;
    h = Math.round(h * 60); if (h < 0) h += 360;
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <Field label="HEX"><Input value={hex} onChange={(e) => setHex(e.target.value)} /></Field>
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-10 w-16 rounded border border-input cursor-pointer" />
      </div>
      <div className="h-24 rounded-lg border border-border" style={{ background: hex }} />
      <div className="grid grid-cols-3 gap-3 text-center">
        <ResultBox><div className="text-xs text-muted-foreground">RGB</div><div className="font-mono font-bold mt-1">{r}, {g}, {b}</div></ResultBox>
        <ResultBox><div className="text-xs text-muted-foreground">HSL</div><div className="font-mono font-bold mt-1">{h}°, {Math.round(s*100)}%, {Math.round(l*100)}%</div></ResultBox>
        <ResultBox><div className="text-xs text-muted-foreground">HEX</div><div className="font-mono font-bold mt-1">{hex.toUpperCase()}</div></ResultBox>
      </div>
    </div>
  );
}

export function MetaTagGenerator() {
  const [t, setT] = useState({ title: "My Page", desc: "Page description", url: "https://example.com", image: "https://example.com/og.png", author: "Dhuran" });
  const code = `<title>${t.title}</title>
<meta name="description" content="${t.desc}">
<meta name="author" content="${t.author}">
<link rel="canonical" href="${t.url}">
<meta property="og:title" content="${t.title}">
<meta property="og:description" content="${t.desc}">
<meta property="og:url" content="${t.url}">
<meta property="og:image" content="${t.image}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t.title}">
<meta name="twitter:description" content="${t.desc}">
<meta name="twitter:image" content="${t.image}">`;
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.keys(t).map((k) => (
          <Field key={k} label={k}><Input value={(t as any)[k]} onChange={(e) => setT({ ...t, [k]: e.target.value })} /></Field>
        ))}
      </div>
      <Textarea rows={12} readOnly value={code} />
      <Btn onClick={async () => { await navigator.clipboard.writeText(code); toast.success("Copied"); }}>Copy</Btn>
    </div>
  );
}

export function RobotsTxtGenerator() {
  const [agent, setAgent] = useState("*");
  const [allow, setAllow] = useState("/");
  const [disallow, setDisallow] = useState("/admin\n/private");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const out = `User-agent: ${agent}\nAllow: ${allow}\n${disallow.split("\n").filter(Boolean).map(d => "Disallow: " + d).join("\n")}\n\nSitemap: ${sitemap}`;
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="User-agent"><Input value={agent} onChange={(e) => setAgent(e.target.value)} /></Field>
        <Field label="Allow"><Input value={allow} onChange={(e) => setAllow(e.target.value)} /></Field>
      </div>
      <Field label="Disallow paths (one per line)"><Textarea rows={4} value={disallow} onChange={(e) => setDisallow(e.target.value)} /></Field>
      <Field label="Sitemap URL"><Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></Field>
      <Textarea rows={8} readOnly value={out} />
      <Btn onClick={async () => { await navigator.clipboard.writeText(out); toast.success("Copied"); }}>Copy</Btn>
    </div>
  );
}
