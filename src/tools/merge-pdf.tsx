import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { Btn } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (files.length < 2) return toast.error("Add at least 2 PDFs to merge");
    setBusy(true);
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer());
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      download(new Blob([bytes], { type: "application/pdf" }), "merged.pdf");
      toast.success("PDF merged successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to merge PDFs");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="application/pdf" multiple files={files} onFiles={setFiles} hint="Add 2 or more PDF files (drag to reorder coming soon)" />
      <Btn onClick={run} disabled={busy || files.length < 2}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Merge {files.length > 0 ? `${files.length} PDFs` : "PDFs"}
      </Btn>
    </div>
  );
}
