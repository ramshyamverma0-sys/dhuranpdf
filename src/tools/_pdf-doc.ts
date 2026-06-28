import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { download } from "@/components/file-dropzone";

export async function jsPDFLikeInvoice(opts: {
  title: string;
  from: string; to: string; invoiceNo: string; date: string; currency: string;
  items: { desc: string; qty: number; rate: number }[];
  total: number;
}) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const blue = rgb(0.23, 0.51, 0.96);
  let y = 800;
  page.drawText(opts.title, { x: 40, y, size: 24, font: bold, color: blue });
  page.drawText(`#${opts.invoiceNo}`, { x: 460, y, size: 12, font });
  page.drawText(opts.date, { x: 460, y: y - 16, size: 10, font });
  y -= 60;
  opts.from.split("\n").forEach((l) => { page.drawText(l, { x: 40, y, size: 10, font }); y -= 14; });
  y -= 10;
  page.drawText("Bill To:", { x: 40, y, size: 10, font: bold }); y -= 14;
  opts.to.split("\n").forEach((l) => { page.drawText(l, { x: 40, y, size: 10, font }); y -= 14; });
  y -= 20;
  page.drawRectangle({ x: 40, y, width: 515, height: 22, color: rgb(0.95, 0.97, 1) });
  page.drawText("Description", { x: 50, y: y + 7, size: 10, font: bold });
  page.drawText("Qty", { x: 350, y: y + 7, size: 10, font: bold });
  page.drawText("Rate", { x: 410, y: y + 7, size: 10, font: bold });
  page.drawText("Amount", { x: 490, y: y + 7, size: 10, font: bold });
  y -= 20;
  for (const it of opts.items) {
    page.drawText(it.desc, { x: 50, y, size: 10, font });
    page.drawText(String(it.qty), { x: 350, y, size: 10, font });
    page.drawText(`${opts.currency}${it.rate}`, { x: 410, y, size: 10, font });
    page.drawText(`${opts.currency}${(it.qty*it.rate).toFixed(2)}`, { x: 490, y, size: 10, font });
    y -= 18;
  }
  y -= 20;
  page.drawLine({ start: { x: 350, y }, end: { x: 555, y }, color: blue, thickness: 1 });
  y -= 18;
  page.drawText("Total", { x: 360, y, size: 12, font: bold });
  page.drawText(`${opts.currency}${opts.total.toFixed(2)}`, { x: 480, y, size: 12, font: bold, color: blue });
  const bytes = await doc.save();
  download(new Blob([bytes as BlobPart], { type: "application/pdf" }), `${opts.title.toLowerCase()}-${opts.invoiceNo}.pdf`);
}
