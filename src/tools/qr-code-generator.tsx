import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Field, Textarea, Btn } from "@/components/tool-page";
import { Download } from "lucide-react";

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://dhuranpdf.com");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!text) return setDataUrl("");
    QRCode.toDataURL(text, { width: 512, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } }).then(setDataUrl);
  }, [text]);

  const dl = () => {
    const a = document.createElement("a");
    a.href = dataUrl; a.download = "qr-code.png"; a.click();
  };

  return (
    <div className="space-y-5">
      <Field label="Text or URL"><Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      {dataUrl && (
        <div className="flex flex-col items-center gap-4">
          <img src={dataUrl} alt="QR Code" className="w-64 h-64 rounded-xl border border-border bg-white p-3" />
          <Btn onClick={dl}><Download className="h-4 w-4" /> Download PNG</Btn>
        </div>
      )}
    </div>
  );
}
