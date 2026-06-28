import { useState } from "react";
import { toast } from "sonner";
import { Btn } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";
import { getTool } from "@/lib/tools";

export default function PngJpgConvert({ slug }: { slug: string }) {
  const targetIsJpg = slug === "png-to-jpg";
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!files.length) return toast.error("Add images first");
    setBusy(true);
    try {
      for (const f of files) {
        const img = await createImageBitmap(f);
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext("2d")!;
        if (targetIsJpg) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0);
        const type = targetIsJpg ? "image/jpeg" : "image/png";
        const ext = targetIsJpg ? "jpg" : "png";
        const blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), type, 0.92));
        download(blob, f.name.replace(/\.[^.]+$/, "") + "." + ext);
      }
      toast.success("Converted");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  const tool = getTool(slug);
  return (
    <div className="space-y-5">
      <FileDropzone accept={targetIsJpg ? "image/png" : "image/jpeg"} multiple files={files} onFiles={setFiles} hint={tool?.description} />
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Convert {files.length || ""}
      </Btn>
    </div>
  );
}
