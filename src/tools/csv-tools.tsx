import { useState } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { toast } from "sonner";
import { Btn, Field, Input, Textarea } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

export function CsvToExcel() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files.length) return toast.error("Add a CSV");
    setBusy(true);
    try {
      const txt = await files[0].text();
      const wb = XLSX.read(txt, { type: "string" });
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      download(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), files[0].name.replace(/\.csv$/i, ".xlsx"));
      toast.success("Converted");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept=".csv,text/csv" files={files} onFiles={setFiles} /><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Convert to Excel</Btn></div>;
}

export function ExcelToCsv() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files.length) return toast.error("Add an Excel file");
    setBusy(true);
    try {
      const buf = await files[0].arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
      download(new Blob([csv], { type: "text/csv" }), files[0].name.replace(/\.(xlsx?|xls)$/i, ".csv"));
      toast.success("Converted");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-4"><FileDropzone accept=".xlsx,.xls" files={files} onFiles={setFiles} /><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Convert to CSV</Btn></div>;
}

export function CsvCleaner() {
  const [text, setText] = useState("name,email\nJohn,john@x.com\nJohn,john@x.com\n,\nJane,jane@x.com");
  const clean = () => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && l.split(",").some(c => c.trim()));
    const seen = new Set<string>();
    const out = lines.filter((l) => { if (seen.has(l)) return false; seen.add(l); return true; });
    setText(out.join("\n"));
    toast.success(`Cleaned — ${lines.length - out.length} duplicates removed`);
  };
  return <div className="space-y-3"><Textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} /><div className="flex gap-2"><Btn onClick={clean}>Clean & Dedupe</Btn><Btn variant="secondary" onClick={() => download(new Blob([text], { type: "text/csv" }), "cleaned.csv")}>Download</Btn></div></div>;
}

export function CsvValidator() {
  const [text, setText] = useState("");
  const [r, setR] = useState<string>("");
  const check = () => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return setR("Empty");
    const cols = lines[0].split(",").length;
    const bad: number[] = [];
    lines.forEach((l, i) => { if (l.split(",").length !== cols) bad.push(i + 1); });
    setR(bad.length ? `❌ Inconsistent columns on lines: ${bad.join(", ")}` : `✓ Valid — ${lines.length} rows, ${cols} columns`);
  };
  return <div className="space-y-3"><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste CSV..." /><Btn onClick={check}>Validate</Btn>{r && <div className="rounded-md border border-border bg-surface p-3 text-sm font-mono">{r}</div>}</div>;
}

export function CsvSplitter() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState(1000);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files.length) return toast.error("Add a CSV");
    setBusy(true);
    try {
      const txt = await files[0].text();
      const lines = txt.split(/\r?\n/);
      const header = lines[0];
      const rows = lines.slice(1).filter(Boolean);
      const zip = new JSZip();
      let i = 0;
      for (let k = 0; k < rows.length; k += size) {
        zip.file(`part-${++i}.csv`, [header, ...rows.slice(k, k + size)].join("\n"));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      download(blob, "split-csv.zip");
      toast.success(`Split into ${i} files`);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><FileDropzone accept=".csv" files={files} onFiles={setFiles} /><Field label="Rows per file"><Input type="number" value={size} onChange={(e) => setSize(+e.target.value)} /></Field><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Split CSV</Btn></div>;
}

export function CsvMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (files.length < 2) return toast.error("Add 2+ CSVs");
    setBusy(true);
    try {
      let header = "";
      const allRows: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const lines = (await files[i].text()).split(/\r?\n/).filter(Boolean);
        if (i === 0) header = lines[0];
        allRows.push(...lines.slice(1));
      }
      const out = [header, ...allRows].join("\n");
      download(new Blob([out], { type: "text/csv" }), "merged.csv");
      toast.success("Merged");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><FileDropzone accept=".csv" multiple files={files} onFiles={setFiles} /><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Merge CSV files</Btn></div>;
}
