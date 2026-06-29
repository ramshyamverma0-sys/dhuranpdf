import { useState } from "react";
import { toast } from "sonner";
import JSZip from "jszip";
import { Btn, Field } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

async function compress(file: File, quality: number): Promise<Blob> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", quality));
}

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!files.length) return toast.error("Add images first");
    setBusy(true);
    try {
      let total = 0, orig = 0;
      if (files.length === 1) {
        const f = files[0];
        const b = await compress(f, quality);
        orig = f.size; total = b.size;
        download(b, f.name.replace(/\.[^.]+$/, "") + "-compressed.jpg");
      } else {
        const zip = new JSZip();
        for (const f of files) {
          const b = await compress(f, quality);
          orig += f.size; total += b.size;
          zip.file(f.name.replace(/\.[^.]+$/, "") + "-compressed.jpg", b);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        download(blob, "compressed-images.zip");
      }
      toast.success(`Saved ${Math.round((1 - total / orig) * 100)}% (${(orig / 1024).toFixed(0)}→${(total / 1024).toFixed(0)} KB)`);
    } catch (e: any) {
      toast.error(e.message || "Compression failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="image/*" multiple files={files} onFiles={setFiles} hint="JPG, PNG, WEBP — outputs JPG (multiple = ZIP)" />
      <Field label={`Quality: ${Math.round(quality * 100)}%`} hint="Lower = smaller file, lower quality">
        <input type="range" min={10} max={100} value={quality * 100} onChange={(e) => setQuality(+e.target.value / 100)} className="w-full accent-primary" />
      </Field>
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Compress {files.length || ""} image{files.length === 1 ? "" : "s"}
      </Btn>
    </div>
  );
}
