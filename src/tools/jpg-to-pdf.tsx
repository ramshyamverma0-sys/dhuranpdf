import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { Btn } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

export default function JpgToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!files.length) return toast.error("Add at least one image");
    setBusy(true);
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const img = f.type.includes("png") ? await out.embedPng(bytes) : await out.embedJpg(bytes);
        const { width, height } = img.scale(1);
        const page = out.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
      }
      const pdf = await out.save();
      download(new Blob([pdf], { type: "application/pdf" }), "images.pdf");
      toast.success("PDF created");
    } catch (e: any) {
      toast.error(e.message || "Failed to convert");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="image/jpeg,image/png" multiple files={files} onFiles={setFiles} hint="JPG or PNG — each image becomes one page" />
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Convert to PDF
      </Btn>
    </div>
  );
}
