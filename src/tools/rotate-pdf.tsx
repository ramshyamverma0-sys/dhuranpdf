import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { toast } from "sonner";
import { Btn, Field, Select } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

export default function RotatePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState("90");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!files.length) return toast.error("Add a PDF first");
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await files[0].arrayBuffer());
      doc.getPages().forEach((p) => p.setRotation(degrees(parseInt(angle))));
      const bytes = await doc.save();
      download(new Blob([bytes], { type: "application/pdf" }), "rotated.pdf");
      toast.success("PDF rotated");
    } catch (e: any) {
      toast.error(e.message || "Failed to rotate");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone accept="application/pdf" files={files} onFiles={setFiles} hint="Rotates every page in the PDF" />
      <Field label="Rotation angle">
        <Select value={angle} onChange={(e) => setAngle(e.target.value)}>
          <option value="90">90° clockwise</option>
          <option value="180">180°</option>
          <option value="270">270° (90° counter-clockwise)</option>
        </Select>
      </Field>
      <Btn onClick={run} disabled={busy || !files.length}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Rotate PDF
      </Btn>
    </div>
  );
}
