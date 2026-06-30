import { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { toast } from "sonner";
import { Btn, Field, Input, Textarea, ResultBox, Select } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2, Copy, Download } from "lucide-react";
import { extractPdfText, ocrPdf, rasterCompressPdf, renderPdfPages, zipBlobs } from "@/tools/pdf-client";

function busyHook() {
  const [busy, setBusy] = useState(false);
  return [busy, setBusy] as const;
}

export function CompressPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [target, setTarget] = useState("500");
  const [custom, setCustom] = useState(750);
  const [unit, setUnit] = useState("KB");
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);
  const [busy, setBusy] = busyHook();
  const targetBytes = target === "custom" ? custom * (unit === "MB" ? 1024 * 1024 : 1024) : Number(target) * 1024;
  const reset = () => { setFiles([]); setTarget("500"); setCustom(750); setUnit("KB"); setStats(null); setStatus(""); };
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    if (targetBytes < 25 * 1024) return toast.error("Target size is too small");
    setBusy(true);
    setStats(null);
    setStatus("Reading PDF…");
    try {
      const firstPass = await PDFDocument.load(await files[0].arrayBuffer());
      let bytes = await firstPass.save({ useObjectStreams: true, objectsPerTick: 50 });
      if (bytes.byteLength > targetBytes) {
        bytes = await rasterCompressPdf(files[0], targetBytes, setStatus);
      }
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "compressed.pdf");
      const before = files[0].size, after = bytes.byteLength;
      setStats({ before, after });
      toast.success(`Compressed: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); setStatus(""); }
  };
  return (
    <div className="space-y-4">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Advanced compression with target size selection" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Target size"><Select value={target} onChange={(e) => setTarget(e.target.value)}><option value="100">100 KB</option><option value="500">500 KB</option><option value="1024">1 MB</option><option value="2048">2 MB</option><option value="5120">5 MB</option><option value="custom">Custom</option></Select></Field>
        {target === "custom" && <Field label="Custom size"><Input type="number" min="25" value={custom} onChange={(e) => setCustom(+e.target.value)} /></Field>}
        {target === "custom" && <Field label="Unit"><Select value={unit} onChange={(e) => setUnit(e.target.value)}><option>KB</option><option>MB</option></Select></Field>}
      </div>
      <div className="flex flex-wrap gap-2"><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Compress PDF</Btn><Btn type="button" variant="secondary" onClick={reset}>Reset</Btn></div>
      {status && <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{status}</div>}
      {stats && <ResultBox><div className="grid gap-3 sm:grid-cols-3 text-center"><div><div className="text-xs text-muted-foreground">Original Size</div><div className="text-2xl font-bold">{(stats.before/1024).toFixed(1)} KB</div></div><div><div className="text-xs text-muted-foreground">Compressed Size</div><div className="text-2xl font-bold text-primary">{(stats.after/1024).toFixed(1)} KB</div></div><div><div className="text-xs text-muted-foreground">Compression</div><div className="text-2xl font-bold text-success">{Math.max(0, (100 - stats.after / stats.before * 100)).toFixed(1)}%</div></div></div></ResultBox>}
    </div>
  );
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
    if (!files.length) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const out = await extractPdfText(files[0]);
      setText(out || "No embedded text found. Use AI OCR Scanner for scanned PDFs.");
      toast.success("Text extracted");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} />
      <Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Extract text</Btn>
      {text && <><Textarea rows={12} readOnly value={text} /><div className="flex flex-wrap gap-2"><Btn variant="secondary" onClick={async () => { await navigator.clipboard.writeText(text); toast.success("Copied"); }}><Copy className="h-4 w-4" />Copy</Btn><Btn variant="secondary" onClick={() => download(new Blob([text], { type: "text/plain" }), "extracted.txt")}><Download className="h-4 w-4" />Download .txt</Btn></div></>}
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

async function qpdfProcess(file: File, args: string[], outName: string) {
  const createModule = (await import("@neslinesli93/qpdf-wasm")).default;
  const qpdf = await createModule({ locateFile: () => "/qpdf.wasm" });
  const FS: any = qpdf.FS;
  FS.writeFile("/input.pdf", new Uint8Array(await file.arrayBuffer()));
  const code = qpdf.callMain(args);
  if (code !== 0) throw new Error("PDF password operation failed");
  const out = FS.readFile("/output.pdf");
  return new Blob([out], { type: "application/pdf" });
}

export function ProtectPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    if (password.length < 4) return toast.error("Enter at least 4 characters");
    setBusy(true);
    try {
      const blob = await qpdfProcess(files[0], ["/input.pdf", "--encrypt", password, password, "256", "--", "/output.pdf"], "protected.pdf");
      download(blob, "protected.pdf");
      toast.success("PDF protected");
    } catch (e: any) { toast.error(e.message || "Failed to protect PDF"); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} /><Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Protect PDF</Btn></div>;
}
export function UnlockPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    setBusy(true);
    try {
      let blob: Blob;
      try {
        blob = await qpdfProcess(files[0], [password ? `--password=${password}` : "--password=", "--decrypt", "/input.pdf", "/output.pdf"], "unlocked.pdf");
      } catch {
        const doc = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
        const bytes = await doc.save();
        blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      }
      download(blob, "unlocked.pdf");
      toast.success("Saved without password");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Enter the open password if the PDF requires one" /><Field label="Password (optional)"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Unlock</Btn></div>;
}

export function PdfToImage({ slug }: { slug?: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState(slug === "pdf-to-jpg" ? "jpg" : "png");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const pages = await renderPdfPages(files[0], { format: format as "png" | "jpg", scale: 2 });
      if (pages.length === 1) download(pages[0].blob, `page-1.${format}`);
      else {
        const zip = await zipBlobs(pages.map((p) => ({ name: `page-${p.page}.${format}`, blob: p.blob })), `pdf-pages-${format}.zip`);
        download(zip.blob, zip.name);
      }
      toast.success(`Converted ${pages.length} pages`);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} /><Field label="Output format"><Select value={format} onChange={(e) => setFormat(e.target.value)}><option value="png">PNG</option><option value="jpg">JPG</option></Select></Field><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Convert PDF pages</Btn></div>;
}

export function PdfToWord() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const text = await extractPdfText(files[0]);
      const html = `<html><head><meta charset="utf-8"></head><body>${text.split("\n").map((p) => `<p>${p.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string))}</p>`).join("")}</body></html>`;
      download(new Blob([html], { type: "application/msword" }), files[0].name.replace(/\.pdf$/i, ".doc"));
      toast.success("Word document created");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Extracts embedded text into an editable Word-compatible .doc file" /><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Convert to Word</Btn></div>;
}

export function PdfToExcel() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    setBusy(true);
    try {
      const text = await extractPdfText(files[0]);
      const rows = text.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => line.split(/\s{2,}|\t|,/).map((c) => c.trim()));
      const csv = rows.map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
      download(new Blob([csv], { type: "text/csv" }), files[0].name.replace(/\.pdf$/i, ".csv"));
      toast.success("Spreadsheet CSV created");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Extracts text/table-like rows into CSV for Excel" /><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Convert to Excel CSV</Btn></div>;
}

export function PdfEditor() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("APPROVED");
  const [x, setX] = useState(72);
  const [y, setY] = useState(720);
  const [size, setSize] = useState(24);
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a PDF");
    if (!text.trim()) return toast.error("Enter text to add");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      doc.getPages()[0].drawText(text, { x, y, size, font, color: rgb(0.05, 0.31, 0.78) });
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "edited.pdf");
      toast.success("PDF edited");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} /><Field label="Text"><Input value={text} onChange={(e) => setText(e.target.value)} /></Field><div className="grid grid-cols-3 gap-3"><Field label="X"><Input type="number" value={x} onChange={(e) => setX(+e.target.value)} /></Field><Field label="Y"><Input type="number" value={y} onChange={(e) => setY(+e.target.value)} /></Field><Field label="Font size"><Input type="number" value={size} onChange={(e) => setSize(+e.target.value)} /></Field></div><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Apply edit</Btn></div>;
}

export function OcrPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = busyHook();
  const run = async () => {
    if (!files.length) return toast.error("Add a scanned PDF");
    setBusy(true);
    setText("");
    try {
      const out = await ocrPdf(files[0], setStatus);
      setText(out || "No text recognized.");
      toast.success("OCR complete");
    } catch (e: any) { toast.error(e.message || "OCR failed"); } finally { setBusy(false); setStatus(""); }
  };
  return <div className="space-y-4"><FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Runs OCR in your browser; best for scanned English PDFs" /><Btn onClick={run} disabled={busy || !files.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Run OCR</Btn>{status && <div className="text-sm text-muted-foreground">{status}</div>}{text && <><Textarea rows={12} readOnly value={text} /><div className="flex flex-wrap gap-2"><Btn variant="secondary" onClick={async () => { await navigator.clipboard.writeText(text); toast.success("Copied"); }}><Copy className="h-4 w-4" />Copy</Btn><Btn variant="secondary" onClick={() => download(new Blob([text], { type: "text/plain" }), "ocr-text.txt")}>Download TXT</Btn></div></>}</div>;
}

export function PdfConverter({ slug }: { slug?: string }) {
  if (slug === "pdf-to-word") return <PdfToWord />;
  if (slug === "pdf-to-excel") return <PdfToExcel />;
  if (slug === "pdf-to-jpg" || slug === "pdf-to-png") return <PdfToImage slug={slug} />;
  return <div className="space-y-4"><PdfToImage slug="pdf-to-jpg" /><div className="border-t border-border pt-4"><PdfToWord /></div></div>;
}
