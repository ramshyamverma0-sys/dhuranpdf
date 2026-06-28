import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Btn, Field, Input } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

export default function ImageResizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [origRatio, setOrigRatio] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!files[0]) return;
    createImageBitmap(files[0]).then((img) => {
      setOrigRatio(img.width / img.height);
      setW(img.width);
      setH(img.height);
    });
  }, [files]);

  const setWidth = (v: number) => {
    setW(v);
    if (keepRatio && origRatio) setH(Math.round(v / origRatio));
  };
  const setHeight = (v: number) => {
    setH(v);
    if (keepRatio && origRatio) setW(Math.round(v * origRatio));
  };

  const run = async () => {
    if (!files.length) return toast.error("Add an image");
    setBusy(true);
    try {
      const img = await createImageBitmap(files[0]);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      const blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/png"));
      download(blob, files[0].name.replace(/\.[^.]+$/, "") + `-${w}x${h}.png`);
      toast.success("Image resized");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="image/*" files={files} onFiles={setFiles} hint="Single image — outputs PNG" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Width (px)"><Input type="number" value={w} onChange={(e) => setWidth(+e.target.value)} /></Field>
        <Field label="Height (px)"><Input type="number" value={h} onChange={(e) => setHeight(+e.target.value)} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} /> Maintain aspect ratio</label>
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Resize image
      </Btn>
    </div>
  );
}
