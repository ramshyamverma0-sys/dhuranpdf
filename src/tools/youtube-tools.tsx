import { useState } from "react";
import { Btn, Field, Input, Textarea, ResultBox } from "@/components/tool-page";
import { toast } from "sonner";

function parseVideoId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m?.[1] || (url.length === 11 ? url : "");
}

export function ThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const id = parseVideoId(url);
  const qualities = ["maxresdefault", "hqdefault", "mqdefault", "sddefault"];
  return (
    <div className="space-y-4">
      <Field label="YouTube URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." /></Field>
      {id && <div className="grid grid-cols-2 gap-3">
        {qualities.map((q) => (
          <a key={q} href={`https://i.ytimg.com/vi/${id}/${q}.jpg`} target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden border border-border hover:border-primary transition">
            <img src={`https://i.ytimg.com/vi/${id}/${q}.jpg`} alt={q} className="w-full" />
            <div className="p-2 text-xs text-center font-medium">{q}</div>
          </a>
        ))}
      </div>}
    </div>
  );
}

export function VideoIdFinder() {
  const [url, setUrl] = useState("");
  const id = parseVideoId(url);
  return (
    <div className="space-y-4">
      <Field label="YouTube URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      {id && <ResultBox><div className="text-center"><div className="text-xs uppercase text-muted-foreground">Video ID</div><div className="text-3xl font-bold text-primary font-mono mt-2">{id}</div><Btn variant="ghost" className="mt-3" onClick={async () => { await navigator.clipboard.writeText(id); toast.success("Copied"); }}>Copy</Btn></div></ResultBox>}
    </div>
  );
}

export function ChannelIdFinder() {
  const [url, setUrl] = useState("");
  const m = url.match(/channel\/([A-Za-z0-9_-]+)/);
  return (
    <div className="space-y-4">
      <Field label="YouTube channel URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/channel/UC..." /></Field>
      {m ? <ResultBox><div className="text-center text-xl font-bold text-primary font-mono">{m[1]}</div></ResultBox>
        : url && <div className="text-sm text-muted-foreground">For @handle URLs, open the channel and click "Share channel" → "Copy channel ID".</div>}
    </div>
  );
}

export function EmbedGenerator() {
  const [url, setUrl] = useState(""); const [w, setW] = useState(560); const [h, setH] = useState(315);
  const id = parseVideoId(url);
  const code = id ? `<iframe width="${w}" height="${h}" src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : "";
  return (
    <div className="space-y-4">
      <Field label="YouTube URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Width"><Input type="number" value={w} onChange={(e) => setW(+e.target.value)} /></Field>
        <Field label="Height"><Input type="number" value={h} onChange={(e) => setH(+e.target.value)} /></Field>
      </div>
      {code && <><Textarea rows={4} readOnly value={code} /><Btn onClick={async () => { await navigator.clipboard.writeText(code); toast.success("Copied"); }}>Copy embed code</Btn></>}
    </div>
  );
}

export function TagsExtractor() {
  const [html, setHtml] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const run = () => {
    const ms = html.match(/<meta name="keywords" content="([^"]+)"/);
    if (ms) return setTags(ms[1].split(",").map((s) => s.trim()).filter(Boolean));
    setTags([]);
    toast.error("No tags meta found. Paste the page source HTML.");
  };
  return (
    <div className="space-y-3">
      <Field label="Paste YouTube page HTML (View Source)"><Textarea rows={6} value={html} onChange={(e) => setHtml(e.target.value)} /></Field>
      <Btn onClick={run}>Extract tags</Btn>
      {tags.length > 0 && <div className="flex flex-wrap gap-2">{tags.map((t) => <span key={t} className="px-2 py-1 rounded bg-primary/10 text-primary text-sm">{t}</span>)}</div>}
    </div>
  );
}
