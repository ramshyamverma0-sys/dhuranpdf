import { useState } from "react";
import { PDFDocument } from "pdf-lib";
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
      for (let i = 0; i < pageCount; i++) {
        const out = await PDFDocument.create();
        const [p] = await out.copyPages(src, [i]);
        out.addPage(p);
        const bytes = await out.save();
        download(new Blob([bytes], { type: "application/pdf" }), `page-${i + 1}.pdf`);
      }
      toast.success(`Split into ${pageCount} files`);
    } catch (e: any) {
      toast.error(e.message || "Failed to split PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="One PDF file — each page will download separately" />
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Split into pages
      </Btn>
    </div>
  );
}
