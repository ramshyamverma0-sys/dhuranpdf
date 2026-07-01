import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { toast } from "sonner";
import { Btn, Field, Input, Select } from "@/components/tool-page";
import { download } from "@/components/file-dropzone";
import { renderPdfPages, zipBlobs } from "@/tools/pdf-client";
import {
  Bold, Italic, Underline as UnderlineIcon, Copy, Trash2, RotateCw, Type as TypeIcon, Image as ImageIcon,
  Upload, Loader2, Save, FolderOpen, LayoutGrid, RefreshCw, Plus, ChevronLeft, ChevronRight,
} from "lucide-react";

type FontFamily = "Helvetica" | "Times" | "Courier";

type Layer = {
  id: string;
  kind: "text" | "image";
  cx: number; // 0..1 center x
  cy: number; // 0..1 center y
  widthFrac: number; // fraction of page width (image only, drives display size)
  rotation: number; // degrees
  opacity: number; // 0..1
  tile: boolean;
  tileGapFrac: number; // spacing between tiles as fraction of page width
  // text
  text?: string;
  fontFamily?: FontFamily;
  fontSizePt?: number;
  bold?: boolean; italic?: boolean; underline?: boolean;
  color?: string; // hex
  letterSpacing?: number; // px per char in preview, pt in pdf
  // image
  imgSrc?: string; // dataURL
  imgW?: number; imgH?: number;
  aspectLock?: boolean;
};

type FileBg = {
  file: File;
  isPdf: boolean;
  pageIndex: number;
  pages: { dataUrl: string; w: number; h: number }[]; // rendered preview pages (PDF) or single image
  pageWpt: number; pageHpt: number; // real page dims (PDF pts) or image px
};

const uid = () => Math.random().toString(36).slice(2, 10);

const PRESETS = [
  { key: "tl", label: "Top Left", cx: 0.12, cy: 0.1 },
  { key: "tc", label: "Top Center", cx: 0.5, cy: 0.1 },
  { key: "tr", label: "Top Right", cx: 0.88, cy: 0.1 },
  { key: "cl", label: "Middle Left", cx: 0.12, cy: 0.5 },
  { key: "cc", label: "Center", cx: 0.5, cy: 0.5 },
  { key: "cr", label: "Middle Right", cx: 0.88, cy: 0.5 },
  { key: "bl", label: "Bottom Left", cx: 0.12, cy: 0.9 },
  { key: "bc", label: "Bottom Center", cx: 0.5, cy: 0.9 },
  { key: "br", label: "Bottom Right", cx: 0.88, cy: 0.9 },
] as const;

const hexToRgb = (h: string) => {
  const s = h.replace("#", "");
  const v = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return { r: parseInt(v.slice(0, 2), 16) / 255, g: parseInt(v.slice(2, 4), 16) / 255, b: parseInt(v.slice(4, 6), 16) / 255 };
};

const pdfFontKey = (fam: FontFamily, b?: boolean, i?: boolean) => {
  if (fam === "Times") return b && i ? StandardFonts.TimesRomanBoldItalic : b ? StandardFonts.TimesRomanBold : i ? StandardFonts.TimesRomanItalic : StandardFonts.TimesRoman;
  if (fam === "Courier") return b && i ? StandardFonts.CourierBoldOblique : b ? StandardFonts.CourierBold : i ? StandardFonts.CourierOblique : StandardFonts.Courier;
  return b && i ? StandardFonts.HelveticaBoldOblique : b ? StandardFonts.HelveticaBold : i ? StandardFonts.HelveticaOblique : StandardFonts.Helvetica;
};

const cssFont = (fam: FontFamily) => (fam === "Times" ? "'Times New Roman', Times, serif" : fam === "Courier" ? "'Courier New', Courier, monospace" : "Helvetica, Arial, sans-serif");

async function readAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("Failed to load image"));
    im.src = src;
  });
}

async function loadFile(file: File): Promise<FileBg> {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (isPdf) {
    const imgs = await renderPdfPages(file, { format: "png", scale: 1.2, maxPages: 50 });
    const pages = imgs.map((im) => ({ dataUrl: URL.createObjectURL(im.blob), w: im.width, h: im.height }));
    // real page size in pts
    const doc = await PDFDocument.load(await file.arrayBuffer());
    const first = doc.getPage(0).getSize();
    return { file, isPdf: true, pageIndex: 0, pages, pageWpt: first.width, pageHpt: first.height };
  }
  const dataUrl = await readAsDataUrl(file);
  const im = await loadImage(dataUrl);
  return { file, isPdf: false, pageIndex: 0, pages: [{ dataUrl, w: im.naturalWidth, h: im.naturalHeight }], pageWpt: im.naturalWidth, pageHpt: im.naturalHeight };
}

function newTextLayer(text = "CONFIDENTIAL"): Layer {
  return {
    id: uid(), kind: "text", cx: 0.5, cy: 0.5, widthFrac: 0.5, rotation: -30, opacity: 0.35,
    tile: false, tileGapFrac: 0.3,
    text, fontFamily: "Helvetica", fontSizePt: 72, bold: true, italic: false, underline: false,
    color: "#888888", letterSpacing: 0,
  };
}

function newImageLayer(imgSrc: string, imgW: number, imgH: number): Layer {
  return {
    id: uid(), kind: "image", cx: 0.5, cy: 0.5, widthFrac: 0.25, rotation: 0, opacity: 0.6,
    tile: false, tileGapFrac: 0.3, imgSrc, imgW, imgH, aspectLock: true,
  };
}

export function WatermarkStudio({ mode = "pdf" }: { mode?: "pdf" | "image" }) {
  const [files, setFiles] = useState<File[]>([]);
  const [bgs, setBgs] = useState<Record<string, FileBg>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"text" | "image">("text");
  const [outFormat, setOutFormat] = useState<"pdf" | "png" | "jpg">(mode === "pdf" ? "pdf" : "png");
  const [applyAllPages, setApplyAllPages] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const wmImgRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLInputElement>(null);
  const mainFileRef = useRef<HTMLInputElement>(null);

  const currentFile = files[currentIdx];
  const bg = currentFile ? bgs[currentFile.name + currentFile.size] : undefined;
  const page = bg?.pages[bg.pageIndex];
  const aspect = page ? page.h / page.w : 1.414;
  const stageH = stageW * aspect;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    setStageW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Load files when added
  useEffect(() => {
    (async () => {
      for (const f of files) {
        const key = f.name + f.size;
        if (bgs[key]) continue;
        try {
          const b = await loadFile(f);
          setBgs((prev) => ({ ...prev, [key]: b }));
        } catch (e: any) {
          toast.error(`${f.name}: ${e.message}`);
        }
      }
    })();
  }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = layers.find((l) => l.id === selectedId) || null;
  const updateLayer = (id: string, patch: Partial<Layer>) => setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const removeLayer = (id: string) => setLayers((ls) => ls.filter((l) => l.id !== id));

  const addText = () => {
    const l = newTextLayer();
    setLayers((ls) => [...ls, l]);
    setSelectedId(l.id);
    setTab("text");
  };

  const addImageFromFile = async (file: File) => {
    try {
      const dataUrl = await readAsDataUrl(file);
      const im = await loadImage(dataUrl);
      const l = newImageLayer(dataUrl, im.naturalWidth, im.naturalHeight);
      setLayers((ls) => [...ls, l]);
      setSelectedId(l.id);
      setTab("image");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onPickMainFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).filter((f) => {
      if (mode === "pdf") return f.type === "application/pdf" || /\.(pdf|png|jpe?g|webp)$/i.test(f.name);
      return f.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(f.name);
    });
    setFiles((prev) => [...prev, ...arr]);
    if (files.length === 0 && layers.length === 0) addText();
  };

  // Pointer drag / resize / rotate
  const dragRef = useRef<{ mode: "move" | "resize" | "rotate"; id: string; startX: number; startY: number; startCx: number; startCy: number; startWidthFrac: number; startFontPt: number; startRot: number; anchorX: number; anchorY: number } | null>(null);

  const onLayerPointerDown = (e: React.PointerEvent, id: string, m: "move" | "resize" | "rotate") => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    const l = layers.find((x) => x.id === id);
    if (!l || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setSelectedId(id);
    dragRef.current = {
      mode: m, id, startX: e.clientX, startY: e.clientY, startCx: l.cx, startCy: l.cy,
      startWidthFrac: l.widthFrac, startFontPt: l.fontSizePt ?? 72, startRot: l.rotation,
      anchorX: rect.left + l.cx * rect.width, anchorY: rect.top + l.cy * rect.height,
    };
  };

  const onStagePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (d.mode === "move") {
      const dx = (e.clientX - d.startX) / rect.width;
      const dy = (e.clientY - d.startY) / rect.height;
      updateLayer(d.id, { cx: Math.max(0, Math.min(1, d.startCx + dx)), cy: Math.max(0, Math.min(1, d.startCy + dy)) });
    } else if (d.mode === "resize") {
      const dist0 = Math.hypot(d.startX - d.anchorX, d.startY - d.anchorY) || 1;
      const dist1 = Math.hypot(e.clientX - d.anchorX, e.clientY - d.anchorY);
      const ratio = dist1 / dist0;
      const l = layers.find((x) => x.id === d.id);
      if (!l) return;
      if (l.kind === "text") updateLayer(d.id, { fontSizePt: Math.max(6, Math.min(600, d.startFontPt * ratio)) });
      else updateLayer(d.id, { widthFrac: Math.max(0.02, Math.min(2, d.startWidthFrac * ratio)) });
    } else if (d.mode === "rotate") {
      const a0 = Math.atan2(d.startY - d.anchorY, d.startX - d.anchorX);
      const a1 = Math.atan2(e.clientY - d.anchorY, e.clientX - d.anchorX);
      let deg = d.startRot + ((a1 - a0) * 180) / Math.PI;
      deg = ((deg % 360) + 360) % 360;
      if (deg > 180) deg -= 360;
      updateLayer(d.id, { rotation: Math.round(deg) });
    }
  };

  const onStagePointerUp = () => { dragRef.current = null; };

  // Preview layer rendering
  const renderLayerPreview = (l: Layer) => {
    if (!page) return null;
    const px = l.cx * stageW;
    const py = l.cy * stageH;
    const common = {
      position: "absolute" as const,
      left: px, top: py,
      transform: `translate(-50%,-50%) rotate(${l.rotation}deg)`,
      opacity: l.opacity,
      cursor: dragRef.current?.mode === "move" ? "grabbing" : "grab",
      touchAction: "none" as const,
    };
    const scale = stageH / bg!.pageHpt; // preview px per pt/px of page
    if (l.kind === "text") {
      const sizePx = (l.fontSizePt ?? 72) * scale;
      const content = (
        <span
          style={{
            fontFamily: cssFont(l.fontFamily ?? "Helvetica"),
            fontWeight: l.bold ? 700 : 400,
            fontStyle: l.italic ? "italic" : "normal",
            textDecoration: l.underline ? "underline" : "none",
            color: l.color ?? "#888",
            fontSize: sizePx,
            letterSpacing: (l.letterSpacing ?? 0) * scale,
            whiteSpace: "nowrap",
            userSelect: "none",
            lineHeight: 1,
          }}
        >{l.text}</span>
      );
      return renderInteractive(l, common, content);
    }
    // image
    const w = l.widthFrac * stageW;
    const h = l.imgH && l.imgW ? (w * l.imgH) / l.imgW : w;
    const content = <img src={l.imgSrc} draggable={false} style={{ width: w, height: h, display: "block", pointerEvents: "none" }} alt="watermark" />;
    return renderInteractive(l, common, content);
  };

  const renderInteractive = (l: Layer, common: React.CSSProperties, content: React.ReactNode) => {
    const isSel = l.id === selectedId;
    return (
      <div key={l.id} style={common} onPointerDown={(e) => onLayerPointerDown(e, l.id, "move")}>
        <div style={{ position: "relative", outline: isSel ? "2px dashed hsl(var(--primary))" : "none", padding: 2 }}>
          {content}
          {isSel && (
            <>
              <div
                onPointerDown={(e) => onLayerPointerDown(e, l.id, "resize")}
                style={{ position: "absolute", right: -8, bottom: -8, width: 16, height: 16, background: "hsl(var(--primary))", borderRadius: 9999, cursor: "nwse-resize", border: "2px solid white" }}
                title="Resize"
              />
              <div
                onPointerDown={(e) => onLayerPointerDown(e, l.id, "rotate")}
                style={{ position: "absolute", left: "50%", top: -28, transform: "translateX(-50%)", width: 16, height: 16, background: "hsl(var(--primary))", borderRadius: 9999, cursor: "grab", border: "2px solid white" }}
                title="Rotate"
              />
              <div style={{ position: "absolute", left: "50%", top: -18, width: 1, height: 12, background: "hsl(var(--primary))", transform: "translateX(-50%)" }} />
            </>
          )}
        </div>
      </div>
    );
  };

  // Tile positions (returns array of {cx, cy}) - simple pattern across page
  const tilePositions = (l: Layer) => {
    if (!l.tile) return [{ cx: l.cx, cy: l.cy }];
    const gap = Math.max(0.05, l.tileGapFrac);
    const out: { cx: number; cy: number }[] = [];
    for (let y = 0.05; y <= 1; y += gap) for (let x = 0.05; x <= 1; x += gap) out.push({ cx: x, cy: y });
    return out;
  };

  // EXPORT
  const applyToImage = async (file: File, bg: FileBg): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    canvas.width = bg.pageWpt; canvas.height = bg.pageHpt;
    const ctx = canvas.getContext("2d")!;
    const img = await loadImage(bg.pages[0].dataUrl);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    for (const l of layers) {
      const positions = tilePositions(l);
      for (const p of positions) {
        ctx.save();
        ctx.globalAlpha = l.opacity;
        ctx.translate(p.cx * canvas.width, p.cy * canvas.height);
        ctx.rotate((l.rotation * Math.PI) / 180);
        if (l.kind === "text") {
          const size = (l.fontSizePt ?? 72) * (canvas.height / bg.pageHpt);
          ctx.font = `${l.italic ? "italic " : ""}${l.bold ? "700 " : ""}${size}px ${cssFont(l.fontFamily ?? "Helvetica")}`;
          ctx.fillStyle = l.color ?? "#888";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          (ctx as any).letterSpacing = `${(l.letterSpacing ?? 0) * (canvas.height / bg.pageHpt)}px`;
          ctx.fillText(l.text ?? "", 0, 0);
          if (l.underline) {
            const w = ctx.measureText(l.text ?? "").width;
            ctx.fillRect(-w / 2, size * 0.5, w, Math.max(1, size / 18));
          }
        } else if (l.imgSrc) {
          const wi = l.widthFrac * canvas.width;
          const hi = l.imgH && l.imgW ? (wi * l.imgH) / l.imgW : wi;
          const im = await loadImage(l.imgSrc);
          ctx.drawImage(im, -wi / 2, -hi / 2, wi, hi);
        }
        ctx.restore();
      }
    }
    const type = outFormat === "jpg" ? "image/jpeg" : "image/png";
    return await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), type, 0.92));
  };

  const applyToPdf = async (file: File): Promise<Uint8Array> => {
    const doc = await PDFDocument.load(await file.arrayBuffer());
    const pages = doc.getPages();
    // Cache fonts and images
    const fontCache = new Map<string, PDFFont>();
    const getFont = async (fam: FontFamily, b?: boolean, i?: boolean) => {
      const key = `${fam}-${!!b}-${!!i}`;
      if (fontCache.has(key)) return fontCache.get(key)!;
      const f = await doc.embedFont(pdfFontKey(fam, b, i));
      fontCache.set(key, f); return f;
    };
    const imgCache = new Map<string, PDFImage>();
    const getImg = async (src: string) => {
      if (imgCache.has(src)) return imgCache.get(src)!;
      const res = await fetch(src);
      const buf = await res.arrayBuffer();
      const isPng = src.startsWith("data:image/png") || src.endsWith(".png");
      const img = isPng ? await doc.embedPng(buf) : await doc.embedJpg(buf);
      imgCache.set(src, img); return img;
    };
    const targets: PDFPage[] = applyAllPages ? pages : [pages[bg?.pageIndex ?? 0]];
    for (const p of targets) {
      const { width: W, height: H } = p.getSize();
      for (const l of layers) {
        const positions = tilePositions(l);
        for (const pos of positions) {
          const x = pos.cx * W;
          const y = H - pos.cy * H; // pdf origin bottom-left
          if (l.kind === "text") {
            const font = await getFont(l.fontFamily ?? "Helvetica", l.bold, l.italic);
            const size = l.fontSizePt ?? 72;
            const c = hexToRgb(l.color ?? "#888888");
            const tw = font.widthOfTextAtSize(l.text ?? "", size) + (l.letterSpacing ?? 0) * Math.max(0, (l.text ?? "").length - 1);
            const th = font.heightAtSize(size);
            const rot = (l.rotation * Math.PI) / 180;
            // rotate around center (x,y): offset text baseline to keep center at (x,y)
            const dx = -tw / 2, dy = -th / 2;
            const rx = x + dx * Math.cos(rot) - dy * Math.sin(rot);
            const ry = y + dx * Math.sin(rot) + dy * Math.cos(rot);
            p.drawText(l.text ?? "", {
              x: rx, y: ry, size, font, color: rgb(c.r, c.g, c.b),
              rotate: degrees(l.rotation), opacity: l.opacity,
              characterSpacing: l.letterSpacing ?? 0,
            });
            if (l.underline) {
              // underline as line: draw a thin rect via drawLine
              const ux1 = x + (-tw / 2) * Math.cos(rot) - (-th * 0.6) * Math.sin(rot);
              const uy1 = y + (-tw / 2) * Math.sin(rot) + (-th * 0.6) * Math.cos(rot);
              const ux2 = x + (tw / 2) * Math.cos(rot) - (-th * 0.6) * Math.sin(rot);
              const uy2 = y + (tw / 2) * Math.sin(rot) + (-th * 0.6) * Math.cos(rot);
              p.drawLine({ start: { x: ux1, y: uy1 }, end: { x: ux2, y: uy2 }, thickness: Math.max(1, size / 18), color: rgb(c.r, c.g, c.b), opacity: l.opacity });
            }
          } else if (l.imgSrc) {
            const img = await getImg(l.imgSrc);
            const wi = l.widthFrac * W;
            const hi = l.imgH && l.imgW ? (wi * l.imgH) / l.imgW : wi;
            const rot = (l.rotation * Math.PI) / 180;
            const dx = -wi / 2, dy = -hi / 2;
            const rx = x + dx * Math.cos(rot) - dy * Math.sin(rot);
            const ry = y + dx * Math.sin(rot) + dy * Math.cos(rot);
            p.drawImage(img, { x: rx, y: ry, width: wi, height: hi, rotate: degrees(l.rotation), opacity: l.opacity });
          }
        }
      }
    }
    return await doc.save();
  };

  const process = async () => {
    if (!files.length) return toast.error("Upload at least one file");
    if (!layers.length) return toast.error("Add a watermark first");
    setBusy(true); setStatus("Processing…");
    try {
      const outputs: { name: string; blob: Blob }[] = [];
      for (let i = 0; i < files.length; i++) {
        setStatus(`Processing ${i + 1}/${files.length}`);
        const f = files[i];
        const key = f.name + f.size;
        const bgi = bgs[key];
        if (!bgi) continue;
        const base = f.name.replace(/\.[^.]+$/, "");
        if (bgi.isPdf) {
          const bytes = await applyToPdf(f);
          outputs.push({ name: `${base}-watermarked.pdf`, blob: new Blob([bytes as BlobPart], { type: "application/pdf" }) });
        } else {
          const blob = await applyToImage(f, bgi);
          const ext = outFormat === "jpg" ? "jpg" : "png";
          outputs.push({ name: `${base}-watermarked.${ext}`, blob });
        }
      }
      if (outputs.length === 1) download(outputs[0].blob, outputs[0].name);
      else {
        const z = await zipBlobs(outputs, "watermarked.zip");
        download(z.blob, z.name);
      }
      toast.success("Watermark applied");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally { setBusy(false); setStatus(""); }
  };

  const saveSettings = () => {
    const data = JSON.stringify({ layers }, null, 2);
    download(new Blob([data], { type: "application/json" }), "watermark-settings.json");
  };
  const loadSettings = async (file: File) => {
    try {
      const j = JSON.parse(await file.text());
      if (Array.isArray(j.layers)) { setLayers(j.layers); setSelectedId(j.layers[0]?.id ?? null); toast.success("Settings loaded"); }
    } catch { toast.error("Invalid settings file"); }
  };

  const accept = mode === "pdf" ? "application/pdf,image/*" : "image/*";

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
      {/* LEFT PANEL */}
      <aside className="space-y-4">
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="text-sm font-semibold">1. Upload file{mode === "pdf" ? "s (PDF or Image)" : "s (Image)"}</div>
          <button onClick={() => mainFileRef.current?.click()} className="w-full rounded-md border-2 border-dashed p-4 text-sm hover:border-primary/60 hover:bg-accent/40 flex flex-col items-center gap-1">
            <Upload className="h-5 w-5 text-primary" />
            Click or drop files
          </button>
          <input ref={mainFileRef} type="file" accept={accept} multiple className="hidden" onChange={(e) => { onPickMainFiles(e.target.files); e.target.value = ""; }} />
          {files.length > 0 && (
            <ul className="space-y-1 max-h-40 overflow-auto text-xs">
              {files.map((f, i) => (
                <li key={i} className={`flex items-center gap-2 px-2 py-1 rounded ${i === currentIdx ? "bg-primary/10" : "bg-secondary"}`}>
                  <button className="flex-1 text-left truncate" onClick={() => setCurrentIdx(i)}>{f.name}</button>
                  <button className="text-muted-foreground hover:text-destructive" onClick={() => { setFiles((p) => p.filter((_, j) => j !== i)); if (currentIdx >= i && currentIdx > 0) setCurrentIdx(currentIdx - 1); }}>×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="text-sm font-semibold">2. Add watermark</div>
          <div className="grid grid-cols-2 gap-2">
            <Btn type="button" variant={tab === "text" ? "primary" : "secondary"} onClick={() => setTab("text")}><TypeIcon className="h-4 w-4" /> Text</Btn>
            <Btn type="button" variant={tab === "image" ? "primary" : "secondary"} onClick={() => setTab("image")}><ImageIcon className="h-4 w-4" /> Image</Btn>
          </div>
          {tab === "text" ? (
            <Btn type="button" onClick={addText}><Plus className="h-4 w-4" /> Add text watermark</Btn>
          ) : (
            <>
              <Btn type="button" onClick={() => wmImgRef.current?.click()}><Plus className="h-4 w-4" /> Add image / logo</Btn>
              <input ref={wmImgRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addImageFromFile(f); e.target.value = ""; }} />
            </>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="text-sm font-semibold">3. Position preset</div>
          <div className="grid grid-cols-3 gap-1">
            {PRESETS.map((p) => (
              <button key={p.key} disabled={!selected} onClick={() => selected && updateLayer(selected.id, { cx: p.cx, cy: p.cy })} className="rounded border h-9 text-[10px] hover:bg-accent disabled:opacity-40" title={p.label}>{p.label.split(" ").map((w) => w[0]).join("")}</button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="text-sm font-semibold">Settings</div>
          <div className="flex gap-2">
            <Btn variant="secondary" type="button" onClick={saveSettings}><Save className="h-4 w-4" /> Save</Btn>
            <Btn variant="secondary" type="button" onClick={() => settingsRef.current?.click()}><FolderOpen className="h-4 w-4" /> Load</Btn>
            <input ref={settingsRef} type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadSettings(f); e.target.value = ""; }} />
          </div>
        </div>
      </aside>

      {/* CENTER STAGE */}
      <section className="space-y-3">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div
            ref={stageRef}
            onPointerMove={onStagePointerMove}
            onPointerUp={onStagePointerUp}
            onPointerLeave={onStagePointerUp}
            onClick={() => setSelectedId(null)}
            className="relative mx-auto bg-white shadow-sm rounded overflow-hidden select-none"
            style={{ width: "100%", maxWidth: 780, aspectRatio: page ? `${page.w} / ${page.h}` : "1 / 1.414" }}
          >
            {page ? (
              <img src={page.dataUrl} alt="preview" className="absolute inset-0 w-full h-full object-contain pointer-events-none" draggable={false} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">Upload a file to start</div>
            )}
            {layers.map(renderLayerPreview)}
          </div>
          {bg?.isPdf && bg.pages.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <Btn variant="secondary" type="button" onClick={() => setBgs((p) => ({ ...p, [currentFile!.name + currentFile!.size]: { ...bg, pageIndex: Math.max(0, bg.pageIndex - 1) } }))}><ChevronLeft className="h-4 w-4" /></Btn>
              <span>Page {bg.pageIndex + 1} / {bg.pages.length}</span>
              <Btn variant="secondary" type="button" onClick={() => setBgs((p) => ({ ...p, [currentFile!.name + currentFile!.size]: { ...bg, pageIndex: Math.min(bg.pages.length - 1, bg.pageIndex + 1) } }))}><ChevronRight className="h-4 w-4" /></Btn>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            {(bg?.isPdf) && (
              <Field label="Apply to">
                <Select value={applyAllPages ? "all" : "current"} onChange={(e) => setApplyAllPages(e.target.value === "all")}>
                  <option value="all">All pages</option>
                  <option value="current">Current page only</option>
                </Select>
              </Field>
            )}
            {!bg?.isPdf && (
              <Field label="Output format">
                <Select value={outFormat} onChange={(e) => setOutFormat(e.target.value as any)}>
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </Select>
              </Field>
            )}
            <Btn onClick={process} disabled={busy || !files.length || !layers.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Apply & Download</Btn>
            {status && <span className="text-xs text-muted-foreground">{status}</span>}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <aside className="space-y-4">
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <div className="text-sm font-semibold flex items-center justify-between">Layers <span className="text-xs text-muted-foreground">{layers.length}</span></div>
          <ul className="space-y-1 max-h-40 overflow-auto">
            {layers.map((l) => (
              <li key={l.id} className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${l.id === selectedId ? "bg-primary/10" : "bg-secondary"}`}>
                {l.kind === "text" ? <TypeIcon className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                <button className="flex-1 text-left truncate" onClick={() => setSelectedId(l.id)}>{l.kind === "text" ? l.text : "Image"}</button>
                <button title="Duplicate" onClick={() => { const c = { ...l, id: uid(), cx: Math.min(1, l.cx + 0.05), cy: Math.min(1, l.cy + 0.05) }; setLayers((ls) => [...ls, c]); setSelectedId(c.id); }}><Copy className="h-3 w-3" /></button>
                <button title="Delete" className="text-destructive" onClick={() => { removeLayer(l.id); if (selectedId === l.id) setSelectedId(null); }}><Trash2 className="h-3 w-3" /></button>
              </li>
            ))}
            {!layers.length && <li className="text-xs text-muted-foreground">No layers yet</li>}
          </ul>
        </div>

        {selected && (
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="text-sm font-semibold">Adjust</div>

            {selected.kind === "text" && (
              <>
                <Field label="Text"><Input value={selected.text ?? ""} onChange={(e) => updateLayer(selected.id, { text: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Font">
                    <Select value={selected.fontFamily} onChange={(e) => updateLayer(selected.id, { fontFamily: e.target.value as FontFamily })}>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times">Times</option>
                      <option value="Courier">Courier</option>
                    </Select>
                  </Field>
                  <Field label="Color"><input type="color" className="w-full h-10 rounded border" value={selected.color ?? "#888888"} onChange={(e) => updateLayer(selected.id, { color: e.target.value })} /></Field>
                </div>
                <Field label={`Size (${Math.round(selected.fontSizePt ?? 72)}pt)`}>
                  <input type="range" min={8} max={300} value={selected.fontSizePt ?? 72} onChange={(e) => updateLayer(selected.id, { fontSizePt: +e.target.value })} className="w-full" />
                </Field>
                <Field label={`Letter spacing (${(selected.letterSpacing ?? 0).toFixed(0)})`}>
                  <input type="range" min={-5} max={40} value={selected.letterSpacing ?? 0} onChange={(e) => updateLayer(selected.id, { letterSpacing: +e.target.value })} className="w-full" />
                </Field>
                <div className="flex gap-1">
                  <Btn type="button" variant={selected.bold ? "primary" : "secondary"} onClick={() => updateLayer(selected.id, { bold: !selected.bold })}><Bold className="h-4 w-4" /></Btn>
                  <Btn type="button" variant={selected.italic ? "primary" : "secondary"} onClick={() => updateLayer(selected.id, { italic: !selected.italic })}><Italic className="h-4 w-4" /></Btn>
                  <Btn type="button" variant={selected.underline ? "primary" : "secondary"} onClick={() => updateLayer(selected.id, { underline: !selected.underline })}><UnderlineIcon className="h-4 w-4" /></Btn>
                </div>
              </>
            )}

            {selected.kind === "image" && (
              <Field label={`Size (${Math.round(selected.widthFrac * 100)}% of page)`}>
                <input type="range" min={2} max={200} value={Math.round(selected.widthFrac * 100)} onChange={(e) => updateLayer(selected.id, { widthFrac: +e.target.value / 100 })} className="w-full" />
              </Field>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Field label={`X (${(selected.cx * 100).toFixed(0)}%)`}>
                <input type="range" min={0} max={100} value={selected.cx * 100} onChange={(e) => updateLayer(selected.id, { cx: +e.target.value / 100 })} className="w-full" />
              </Field>
              <Field label={`Y (${(selected.cy * 100).toFixed(0)}%)`}>
                <input type="range" min={0} max={100} value={selected.cy * 100} onChange={(e) => updateLayer(selected.id, { cy: +e.target.value / 100 })} className="w-full" />
              </Field>
            </div>
            <Field label={`Rotation (${selected.rotation}°)`}>
              <input type="range" min={-180} max={180} value={selected.rotation} onChange={(e) => updateLayer(selected.id, { rotation: +e.target.value })} className="w-full" />
            </Field>
            <Field label={`Opacity (${Math.round(selected.opacity * 100)}%)`}>
              <input type="range" min={5} max={100} value={selected.opacity * 100} onChange={(e) => updateLayer(selected.id, { opacity: +e.target.value / 100 })} className="w-full" />
            </Field>

            <div className="flex flex-wrap gap-1">
              <Btn type="button" variant="secondary" onClick={() => updateLayer(selected.id, { cx: 0.5, cy: 0.5, rotation: 0 })}><RefreshCw className="h-4 w-4" /> Reset</Btn>
              <Btn type="button" variant={selected.tile ? "primary" : "secondary"} onClick={() => updateLayer(selected.id, { tile: !selected.tile })}><LayoutGrid className="h-4 w-4" /> Tile</Btn>
              <Btn type="button" variant="secondary" onClick={() => updateLayer(selected.id, { rotation: -45, tile: false, cx: 0.5, cy: 0.5 })}><RotateCw className="h-4 w-4" /> Diagonal</Btn>
            </div>
            {selected.tile && (
              <Field label={`Tile gap (${Math.round(selected.tileGapFrac * 100)}%)`}>
                <input type="range" min={10} max={60} value={Math.round(selected.tileGapFrac * 100)} onChange={(e) => updateLayer(selected.id, { tileGapFrac: +e.target.value / 100 })} className="w-full" />
              </Field>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

export function WatermarkPdfStudio() { return <WatermarkStudio mode="pdf" />; }
export function WatermarkImageStudio() { return <WatermarkStudio mode="image" />; }
