import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { toast } from "sonner";
import { Btn } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

export default function SplitPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length === 0) return toast.error("Add a PDF to split");
    setBusy(true);
    try {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const pageCount = src.getPageCount();
      if (pageCount === 1) {
        toast.error("PDF has only one page — nothing to split");
        return;
      }
      const zip = new JSZip();
      for (let i = 0; i < pageCount; i++) {
        const out = await PDFDocument.create();
        const [p] = await out.copyPages(src, [i]);
        out.addPage(p);
        const bytes = await out.save();
        zip.file(`page-${i + 1}.pdf`, bytes);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      download(blob, "split-pages.zip");
      toast.success(`Split into ${pageCount} files (zipped)`);
    } catch (e: any) {
      toast.error(e.message || "Failed to split PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="One PDF file — every page is exported into a single ZIP download" />
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Split into pages (ZIP)
      </Btn>
    </div>
  );
}
