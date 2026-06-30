import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export type PdfPageImage = {
  page: number;
  blob: Blob;
  width: number;
  height: number;
};

async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
  return pdfjs;
}

export async function renderPdfPages(
  file: File,
  opts: { format?: "png" | "jpg"; scale?: number; quality?: number; maxPages?: number } = {},
) {
  const pdfjs = await getPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const count = Math.min(pdf.numPages, opts.maxPages ?? pdf.numPages);
  const format = opts.format ?? "png";
  const images: PdfPageImage[] = [];

  for (let pageNo = 1; pageNo <= count; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: opts.scale ?? 1.5 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, canvasContext: ctx as any, viewport }).promise;
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to render PDF page"))), mime, opts.quality ?? 0.86),
    );
    images.push({ page: pageNo, blob, width: canvas.width, height: canvas.height });
  }
  return images;
}

export async function zipBlobs(items: { name: string; blob: Blob | Uint8Array }[], zipName = "files.zip") {
  const zip = new JSZip();
  for (const item of items) zip.file(item.name, item.blob);
  return { name: zipName, blob: await zip.generateAsync({ type: "blob" }) };
}

export async function extractPdfText(file: File) {
  const pdfjs = await getPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).filter(Boolean).join(" ");
    pages.push(`Page ${pageNo}\n${text}`.trim());
  }
  return pages.join("\n\n").trim();
}

export async function pdfImagesToPdf(images: PdfPageImage[], quality = 0.86) {
  const doc = await PDFDocument.create();
  for (const img of images) {
    const bytes = await img.blob.arrayBuffer();
    const embedded = img.blob.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const page = doc.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }
  return doc.save({ useObjectStreams: true });
}

export async function rasterCompressPdf(
  file: File,
  targetBytes: number,
  onProgress?: (message: string) => void,
) {
  const attempts = [
    { scale: 1.6, quality: 0.82 },
    { scale: 1.35, quality: 0.72 },
    { scale: 1.1, quality: 0.62 },
    { scale: 0.9, quality: 0.52 },
    { scale: 0.72, quality: 0.42 },
  ];
  let best: Uint8Array | null = null;
  for (const attempt of attempts) {
    onProgress?.(`Optimizing pages at ${(attempt.quality * 100).toFixed(0)}% quality…`);
    const images = await renderPdfPages(file, { format: "jpg", scale: attempt.scale, quality: attempt.quality });
    const bytes = await pdfImagesToPdf(images, attempt.quality);
    if (!best || bytes.byteLength < best.byteLength) best = bytes;
    if (bytes.byteLength <= targetBytes) return bytes;
  }
  return best ?? new Uint8Array(await file.arrayBuffer());
}

export async function ocrPdf(file: File, onProgress?: (message: string) => void) {
  const { createWorker } = await import("tesseract.js");
  const pages = await renderPdfPages(file, { format: "png", scale: 2 });
  const worker = await createWorker("eng", 1, {
    logger: (m: any) => {
      if (m.status) onProgress?.(`${m.status}${m.progress ? ` ${(m.progress * 100).toFixed(0)}%` : ""}`);
    },
  });
  try {
    const output: string[] = [];
    for (const page of pages) {
      onProgress?.(`Reading page ${page.page}…`);
      const url = URL.createObjectURL(page.blob);
      const result = await worker.recognize(url);
      URL.revokeObjectURL(url);
      output.push(`Page ${page.page}\n${result.data.text.trim()}`.trim());
    }
    return output.join("\n\n").trim();
  } finally {
    await worker.terminate();
  }
}
