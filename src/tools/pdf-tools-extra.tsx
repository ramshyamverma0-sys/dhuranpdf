import { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { toast } from "sonner";
import { Btn, Field, Input, Textarea } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

function busyHook() {
  const [busy, setBusy] = useState(false);
  return [busy, setBusy] as const;
}

export function CompressPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer());
      const bytes = await doc.save({ useObjectStreams: true });
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "compressed.pdf");
      const before = files[0].size, after = bytes.byteLength;
      toast.success(`${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} /><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Compress</Btn></div>;
}

export function AddPageNumbers() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = busyHook();
  const [pos, setPos] = useState("br");
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      doc.getPages().forEach((p, i) => {
        const { width, height } = p.getSize();
        const text = `${i + 1} / ${doc.getPageCount()}`;
        const x = pos.endsWith("r") ? width - 60 : pos.endsWith("l") ? 40 : width / 2 - 15;
        const y = pos.startsWith("t") ? height - 30 : 20;
        p.drawText(text, { x, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
      });
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "numbered.pdf");
      toast.success("Page numbers added");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <Field label="Position"><select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={pos} onChange={(e) => setPos(e.target.value)}>
        <option value="br">Bottom Right</option><option value="bl">Bottom Left</option><option value="bc">Bottom Center</option>
        <option value="tr">Top Right</option><option value="tl">Top Left</option><option value="tc">Top Center</option>
      </select></Field>
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Add page numbers</Btn>
    </div>
  );
}

export function WatermarkPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      doc.getPages().forEach((p) => {
        const { width, height } = p.getSize();
        p.drawText(text, { x: width / 2 - text.length * 12, y: height / 2, size: 60, font, color: rgb(0.85, 0.85, 0.85), rotate: degrees(-45), opacity: 0.4 });
      });
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "watermarked.pdf");
      toast.success("Watermarked");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <Field label="Watermark text"><Input value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Add watermark</Btn>
    </div>
  );
}

export function ExtractPages() {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-3");
  const [busy, setBusy] = busyHook();
  const parseRange = (s: string, max: number) => {
    const out = new Set<number>();
    s.split(",").forEach((p) => {
      const m = p.trim().match(/^(\d+)(?:-(\d+))?$/);
      if (!m) return;
      const a = +m[1], b = +(m[2] || m[1]);
      for (let i = a; i <= b; i++) if (i >= 1 && i <= max) out.add(i - 1);
    });
    return [...out].sort((a, b) => a - b);
  };
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const pages = parseRange(range, src.getPageCount());
      if (!pages.length) throw new Error("Invalid range");
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "extracted.pdf");
      toast.success(`Extracted ${pages.length} pages`);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <Field label="Page range" hint="e.g. 1-3, 5, 8-10"><Input value={range} onChange={(e) => setRange(e.target.value)} /></Field>
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Extract pages</Btn>
    </div>
  );
}

export function DeletePages() {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const total = src.getPageCount();
      const remove = new Set<number>();
      range.split(",").forEach((p) => {
        const m = p.trim().match(/^(\d+)(?:-(\d+))?$/);
        if (!m) return;
        const a = +m[1], b = +(m[2] || m[1]);
        for (let i = a; i <= b; i++) remove.add(i - 1);
      });
      const keep = [...Array(total).keys()].filter((i) => !remove.has(i));
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, keep);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "deleted.pdf");
      toast.success(`Removed ${remove.size} pages`);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <Field label="Pages to delete"><Input value={range} onChange={(e) => setRange(e.target.value)} /></Field>
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Delete pages</Btn>
    </div>
  );
}

export function PdfToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const buf = new Uint8Array(await files[0].arrayBuffer());
      // crude text extraction: find (text) Tj patterns
      const raw = new TextDecoder("latin1").decode(buf);
      const matches = raw.match(/\(([^)]+)\)\s*Tj/g) || [];
      const out = matches.map((m) => m.replace(/^\(/, "").replace(/\)\s*Tj$/, "")).join(" ").replace(/\\(\d{3})/g, (_, n) => String.fromCharCode(parseInt(n, 8)));
      setText(out || "No extractable text found (this may be a scanned PDF).");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Extract text</Btn>
      {text && <><Textarea rows={12} readOnly value={text} /><Btn variant="secondary" onClick={() => download(new Blob([text], { type: "text/plain" }), "extracted.txt")}>Download .txt</Btn></>}
    </div>
  );
}

export function EditPdfMetadata() {
  const [files, setFiles] = useState<File[]>([]);
  const [meta, setMeta] = useState({ title: "", author: "", subject: "", keywords: "" });
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer());
      doc.setTitle(meta.title);
      doc.setAuthor(meta.author);
      doc.setSubject(meta.subject);
      doc.setKeywords(meta.keywords.split(",").map(s => s.trim()).filter(Boolean));
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "metadata-updated.pdf");
      toast.success("Metadata updated");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <div className="grid gap-2 sm:grid-cols-2">{Object.keys(meta).map(k => <Field key={k} label={k}><Input value={(meta as any)[k]} onChange={(e) => setMeta({ ...meta, [k]: e.target.value })} /></Field>)}</div>
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Save metadata</Btn>
    </div>
  );
}

export function CropPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [m, setM] = useState({ top: 36, right: 36, bottom: 36, left: 36 });
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer());
      doc.getPages().forEach((p) => {
        const { width, height } = p.getSize();
        p.setCropBox(m.left, m.bottom, width - m.left - m.right, height - m.top - m.bottom);
      });
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "cropped.pdf");
      toast.success("Cropped");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <div className="grid grid-cols-4 gap-2">{(["top","right","bottom","left"] as const).map(k => <Field key={k} label={k + " (pt)"}><Input type="number" value={(m as any)[k]} onChange={(e) => setM({ ...m, [k]: +e.target.value })} /></Field>)}</div>
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Crop PDF</Btn>
    </div>
  );
}

export function ResizePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState("A4");
  const sizes: Record<string, [number, number]> = { A4: [595, 842], A3: [842, 1191], A5: [420, 595], Letter: [612, 792], Legal: [612, 1008] };
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const out = await PDFDocument.create();
      const [W, H] = sizes[size];
      const pages = await out.embedPages(src.getPages());
      for (const ep of pages) {
        const page = out.addPage([W, H]);
        const { width, height } = ep.size();
        const s = Math.min(W / width, H / height);
        page.drawPage(ep, { x: (W - width*s)/2, y: (H - height*s)/2, xScale: s, yScale: s });
      }
      const bytes = await out.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "resized.pdf");
      toast.success("Resized");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <Field label="Page size"><select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={size} onChange={(e) => setSize(e.target.value)}>{Object.keys(sizes).map(k => <option key={k}>{k}</option>)}</select></Field>
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Resize</Btn>
    </div>
  );
}

export function HtmlToPdf() {
  const [html, setHtml] = useState("<h1>Hello</h1><p>This is HTML rendered to PDF (text only).</p>");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    setBusy(true);
    try {
      const text = html.replace(/<[^>]+>/g, "\n").replace(/\n+/g, "\n").trim();
      const doc = await PDFDocument.create();
      const page = doc.addPage([595, 842]);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      let y = 800;
      text.split("\n").forEach((line) => {
        if (y < 40) return;
        page.drawText(line.slice(0, 90), { x: 40, y, size: 11, font });
        y -= 16;
      });
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "html.pdf");
      toast.success("PDF created");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <Textarea rows={10} value={html} onChange={(e) => setHtml(e.target.value)} />
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Convert to PDF</Btn>
    </div>
  );
}

export function ProtectPdf() {
  return <div className="text-sm text-muted-foreground bg-surface border border-border rounded p-4">Password protection requires a server-side encryptor. This client-side tool currently can't add passwords; coming soon with our backend service.</div>;
}
export function UnlockPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "unlocked.pdf");
      toast.success("Saved without password");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Works only on PDFs with weak/owner-only protection" /><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Unlock</Btn></div>;
}
