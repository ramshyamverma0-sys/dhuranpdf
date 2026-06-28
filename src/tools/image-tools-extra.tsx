import { useState, useRef } from "react";
import { Btn, Field, Input, ResultBox } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { toast } from "sonner";

export function ImageCropper() {
  const [files, setFiles] = useState<File[]>([]);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 400, h: 300 });
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files.length) return toast.error("Add an image");
    setBusy(true);
    try {
      const img = await createImageBitmap(files[0]);
      const c = document.createElement("canvas");
      c.width = crop.w; c.height = crop.h;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      const blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/png"));
      download(blob, "cropped.png");
      toast.success("Cropped");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="image/*" files={files} onFiles={setFiles} />
      <div className="grid grid-cols-4 gap-2">
        <Field label="X"><Input type="number" value={crop.x} onChange={(e) => setCrop({ ...crop, x: +e.target.value })} /></Field>
        <Field label="Y"><Input type="number" value={crop.y} onChange={(e) => setCrop({ ...crop, y: +e.target.value })} /></Field>
        <Field label="Width"><Input type="number" value={crop.w} onChange={(e) => setCrop({ ...crop, w: +e.target.value })} /></Field>
        <Field label="Height"><Input type="number" value={crop.h} onChange={(e) => setCrop({ ...crop, h: +e.target.value })} /></Field>
      </div>
      <Btn onClick={run} disabled={busy}>Crop image</Btn>
    </div>
  );
}

export function ImageColorPicker() {
  const [src, setSrc] = useState("");
  const [color, setColor] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const onFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => setSrc(r.result as string);
    r.readAsDataURL(f);
  };
  const onLoad = () => {
    const img = imgRef.current!, c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext("2d")!.drawImage(img, 0, 0);
  };
  const onClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current!, c = canvasRef.current!;
    const r = img.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) * (img.naturalWidth / r.width));
    const y = Math.floor((e.clientY - r.top) * (img.naturalHeight / r.height));
    const d = c.getContext("2d")!.getImageData(x, y, 1, 1).data;
    const hex = "#" + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, "0")).join("");
    setColor(hex);
  };
  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="text-sm" />
      {src && <div><img ref={imgRef} src={src} onLoad={onLoad} onClick={onClick} className="max-h-96 mx-auto cursor-crosshair border border-border rounded" alt="" /><canvas ref={canvasRef} className="hidden" /></div>}
      {color && <ResultBox><div className="flex items-center gap-3 justify-center"><div className="w-16 h-16 rounded-lg border-2 border-border" style={{ background: color }} /><div className="text-2xl font-mono font-bold">{color.toUpperCase()}</div></div></ResultBox>}
    </div>
  );
}

export function WebpConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [target, setTarget] = useState<"webp" | "png" | "jpg">("webp");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files.length) return toast.error("Add images");
    setBusy(true);
    try {
      for (const f of files) {
        const img = await createImageBitmap(f);
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext("2d")!;
        if (target === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0,0,c.width,c.height); }
        ctx.drawImage(img, 0, 0);
        const mime = target === "webp" ? "image/webp" : target === "png" ? "image/png" : "image/jpeg";
        const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), mime, 0.92));
        download(blob, f.name.replace(/\.[^.]+$/, "") + "." + target);
      }
      toast.success("Converted");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-3">
      <FileDropzone accept="image/*" multiple files={files} onFiles={setFiles} />
      <Field label="Convert to"><select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={target} onChange={(e) => setTarget(e.target.value as any)}><option value="webp">WebP</option><option value="png">PNG</option><option value="jpg">JPG</option></select></Field>
      <Btn onClick={run} disabled={busy}>Convert</Btn>
    </div>
  );
}
