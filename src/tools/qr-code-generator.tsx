import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Field, Textarea, Btn, Input, Select } from "@/components/tool-page";
import { toast } from "sonner";
import { Copy, Download, RotateCcw } from "lucide-react";

export default function QRCodeGenerator() {
  const [type, setType] = useState("url");
  const [size, setSize] = useState(512);
  const [fields, setFields] = useState({
    text: "Dhuran PDF",
    url: "https://dhuranpdf.com",
    phone: "+9779800000000",
    email: "hello@dhuranpdf.com",
    subject: "Hello",
    body: "Message from QR code",
    ssid: "WiFi Name",
    password: "password123",
    lat: "27.7172",
    lng: "85.3240",
    name: "Dhuran PDF",
    company: "Dhuran PDF",
  });
  const [dataUrl, setDataUrl] = useState("");
  const [svg, setSvg] = useState("");

  const text = (() => {
    if (type === "url") return fields.url;
    if (type === "phone") return `tel:${fields.phone}`;
    if (type === "email") return `mailto:${fields.email}?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(fields.body)}`;
    if (type === "wifi") return `WIFI:T:WPA;S:${fields.ssid};P:${fields.password};;`;
    if (type === "location") return `geo:${fields.lat},${fields.lng}`;
    if (type === "contact") return `BEGIN:VCARD\nVERSION:3.0\nFN:${fields.name}\nORG:${fields.company}\nTEL:${fields.phone}\nEMAIL:${fields.email}\nEND:VCARD`;
    return fields.text;
  })();

  useEffect(() => {
    if (!text) return setDataUrl("");
    QRCode.toDataURL(text, { width: size, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } }).then(setDataUrl).catch(() => toast.error("Failed to generate QR"));
    QRCode.toString(text, { type: "svg", width: size, margin: 2, color: { dark: "#0f172a", light: "#ffffff" } }).then(setSvg).catch(() => {});
  }, [text, size]);

  const set = (key: keyof typeof fields, value: string) => setFields((f) => ({ ...f, [key]: value }));
  const reset = () => { setType("url"); setSize(512); toast.success("Reset complete"); };

  const dl = (format: "png" | "jpg" | "svg") => {
    const a = document.createElement("a");
    if (format === "svg") {
      a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      a.download = "qr-code.svg";
    } else if (format === "jpg") {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0);
        a.href = c.toDataURL("image/jpeg", 0.92); a.download = "qr-code.jpg"; a.click();
      };
      img.src = dataUrl;
      toast.success("JPG ready");
      return;
    } else {
      a.href = dataUrl; a.download = "qr-code.png";
    }
    a.click();
    toast.success(`${format.toUpperCase()} downloaded`);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="QR type"><Select value={type} onChange={(e) => setType(e.target.value)}>{["text","url","phone","email","wifi","location","contact"].map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}</Select></Field>
        <Field label="Size (px)"><Input type="number" min="128" max="2048" value={size} onChange={(e) => setSize(+e.target.value)} /></Field>
      </div>
      {type === "text" && <Field label="Text"><Textarea rows={3} value={fields.text} onChange={(e) => set("text", e.target.value)} /></Field>}
      {type === "url" && <Field label="URL"><Input value={fields.url} onChange={(e) => set("url", e.target.value)} /></Field>}
      {type === "phone" && <Field label="Phone"><Input value={fields.phone} onChange={(e) => set("phone", e.target.value)} /></Field>}
      {type === "email" && <div className="grid gap-3 sm:grid-cols-2"><Field label="Email"><Input value={fields.email} onChange={(e) => set("email", e.target.value)} /></Field><Field label="Subject"><Input value={fields.subject} onChange={(e) => set("subject", e.target.value)} /></Field><Field label="Body"><Textarea rows={3} value={fields.body} onChange={(e) => set("body", e.target.value)} /></Field></div>}
      {type === "wifi" && <div className="grid gap-3 sm:grid-cols-2"><Field label="WiFi name"><Input value={fields.ssid} onChange={(e) => set("ssid", e.target.value)} /></Field><Field label="Password"><Input value={fields.password} onChange={(e) => set("password", e.target.value)} /></Field></div>}
      {type === "location" && <div className="grid gap-3 sm:grid-cols-2"><Field label="Latitude"><Input value={fields.lat} onChange={(e) => set("lat", e.target.value)} /></Field><Field label="Longitude"><Input value={fields.lng} onChange={(e) => set("lng", e.target.value)} /></Field></div>}
      {type === "contact" && <div className="grid gap-3 sm:grid-cols-2"><Field label="Name"><Input value={fields.name} onChange={(e) => set("name", e.target.value)} /></Field><Field label="Company"><Input value={fields.company} onChange={(e) => set("company", e.target.value)} /></Field><Field label="Phone"><Input value={fields.phone} onChange={(e) => set("phone", e.target.value)} /></Field><Field label="Email"><Input value={fields.email} onChange={(e) => set("email", e.target.value)} /></Field></div>}
      {dataUrl && (
        <div className="flex flex-col items-center gap-4">
          <img src={dataUrl} alt="QR Code" className="w-64 h-64 rounded-xl border border-border bg-white p-3" />
          <div className="flex flex-wrap justify-center gap-2">
            <Btn onClick={() => dl("png")}><Download className="h-4 w-4" /> PNG</Btn>
            <Btn variant="secondary" onClick={() => dl("jpg")}>JPG</Btn>
            <Btn variant="secondary" onClick={() => dl("svg")}>SVG</Btn>
            <Btn variant="secondary" onClick={async () => { await navigator.clipboard.writeText(text); toast.success("QR data copied"); }}><Copy className="h-4 w-4" /> Copy QR</Btn>
            <Btn variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
