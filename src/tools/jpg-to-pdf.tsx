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
        let imageBlob: Blob = f;
        if (f.type.includes("heic") || /\.hei[cf]$/i.test(f.name)) {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({ blob: f, toType: "image/jpeg", quality: 0.92 });
          imageBlob = Array.isArray(converted) ? converted[0] : converted;
        } else if (f.type.includes("webp") || /\.webp$/i.test(f.name)) {
          const bitmap = await createImageBitmap(f);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
          imageBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
        }
        const bytes = await imageBlob.arrayBuffer();
        const img = imageBlob.type.includes("png") ? await out.embedPng(bytes) : await out.embedJpg(bytes);
        const { width, height } = img.scale(1);
        const page = out.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
      }
      const pdf = await out.save();
      download(new Blob([pdf as BlobPart], { type: "application/pdf" }), "images.pdf");
      toast.success("PDF created");
    } catch (e: any) {
      toast.error(e.message || "Failed to convert");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" multiple files={files} onFiles={setFiles} hint="JPG, PNG, WEBP or HEIC — each image becomes one page" />
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Convert to PDF
      </Btn>
    </div>
  );
}
