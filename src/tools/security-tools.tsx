import { useState } from "react";
import JSZip from "jszip";
import { toast } from "sonner";
import { Btn, Field, Input, Textarea, ResultBox } from "@/components/tool-page";
import { FileDropzone, download } from "@/components/file-dropzone";
import { Loader2 } from "lucide-react";

// Tiny MD5 — Joseph Myers (public domain) compact
function md5(s: string): string {
  function L(k: number, d: number) { return (k << d) | (k >>> (32 - d)); }
  function K(G: number, k: number) { let I, d, F, H; F = G & 2147483648; H = k & 2147483648; I = G & 1073741824; d = k & 1073741824; const Y = (G & 1073741823) + (k & 1073741823); if (I & d) return Y ^ 2147483648 ^ F ^ H; if (I | d) return (Y & 1073741824) ? Y ^ 3221225472 ^ F ^ H : Y ^ 1073741824 ^ F ^ H; return Y ^ F ^ H; }
  function r(d: number, F: number, k: number) { return (d & F) | (~d & k); }
  function q(d: number, F: number, k: number) { return (d & k) | (F & ~k); }
  function p(d: number, F: number, k: number) { return d ^ F ^ k; }
  function n(d: number, F: number, k: number) { return F ^ (d | ~k); }
  function u(G: number, F: number, aa: number, Z: number, k: number, Y: number, X: number) { G = K(G, K(K(r(F, aa, Z), k), X)); return K(L(G, Y), F); }
  function f(G: number, F: number, aa: number, Z: number, k: number, Y: number, X: number) { G = K(G, K(K(q(F, aa, Z), k), X)); return K(L(G, Y), F); }
  function D(G: number, F: number, aa: number, Z: number, k: number, Y: number, X: number) { G = K(G, K(K(p(F, aa, Z), k), X)); return K(L(G, Y), F); }
  function t(G: number, F: number, aa: number, Z: number, k: number, Y: number, X: number) { G = K(G, K(K(n(F, aa, Z), k), X)); return K(L(G, Y), F); }
  function e(G: string) { let Z; const F = G.length; const x = F + 8; const k = (((x - (x % 64)) / 64) + 1) * 16; const aa = Array(k - 1); let d = 0; let H = 0; while (H < F) { Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = (aa[Z] || 0) | (G.charCodeAt(H) << d); H++; } Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = (aa[Z] || 0) | (128 << d); aa[k - 2] = F << 3; aa[k - 1] = F >>> 29; return aa; }
  function B(x: number) { let k = "", F = "", G, d; for (d = 0; d <= 3; d++) { G = (x >>> (d * 8)) & 255; F = "0" + G.toString(16); k = k + F.substr(F.length - 2, 2); } return k; }
  function J(k: string) { k = k.replace(/\r\n/g, "\n"); let d = ""; for (let F = 0; F < k.length; F++) { const x = k.charCodeAt(F); if (x < 128) d += String.fromCharCode(x); else if (x > 127 && x < 2048) { d += String.fromCharCode((x >> 6) | 192); d += String.fromCharCode((x & 63) | 128); } else { d += String.fromCharCode((x >> 12) | 224); d += String.fromCharCode(((x >> 6) & 63) | 128); d += String.fromCharCode((x & 63) | 128); } } return d; }
  const C = [], P = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]; const x = e(J(s)); let h = 1732584193, E = 4023233417, v = 2562383102, g = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const a = h, b = E, c = v, dd = g;
    h = u(h, E, v, g, x[i + 0], P[0], 3614090360); g = u(g, h, E, v, x[i + 1], P[1], 3905402710); v = u(v, g, h, E, x[i + 2], P[2], 606105819); E = u(E, v, g, h, x[i + 3], P[3], 3250441966);
    h = u(h, E, v, g, x[i + 4], P[0], 4118548399); g = u(g, h, E, v, x[i + 5], P[1], 1200080426); v = u(v, g, h, E, x[i + 6], P[2], 2821735955); E = u(E, v, g, h, x[i + 7], P[3], 4249261313);
    h = u(h, E, v, g, x[i + 8], P[0], 1770035416); g = u(g, h, E, v, x[i + 9], P[1], 2336552879); v = u(v, g, h, E, x[i + 10], P[2], 4294925233); E = u(E, v, g, h, x[i + 11], P[3], 2304563134);
    h = u(h, E, v, g, x[i + 12], P[0], 1804603682); g = u(g, h, E, v, x[i + 13], P[1], 4254626195); v = u(v, g, h, E, x[i + 14], P[2], 2792965006); E = u(E, v, g, h, x[i + 15], P[3], 1236535329);
    h = f(h, E, v, g, x[i + 1], P[4], 4129170786); g = f(g, h, E, v, x[i + 6], P[5], 3225465664); v = f(v, g, h, E, x[i + 11], P[6], 643717713); E = f(E, v, g, h, x[i + 0], P[7], 3921069994);
    h = f(h, E, v, g, x[i + 5], P[4], 3593408605); g = f(g, h, E, v, x[i + 10], P[5], 38016083); v = f(v, g, h, E, x[i + 15], P[6], 3634488961); E = f(E, v, g, h, x[i + 4], P[7], 3889429448);
    h = f(h, E, v, g, x[i + 9], P[4], 568446438); g = f(g, h, E, v, x[i + 14], P[5], 3275163606); v = f(v, g, h, E, x[i + 3], P[6], 4107603335); E = f(E, v, g, h, x[i + 8], P[7], 1163531501);
    h = f(h, E, v, g, x[i + 13], P[4], 2850285829); g = f(g, h, E, v, x[i + 2], P[5], 4243563512); v = f(v, g, h, E, x[i + 7], P[6], 1735328473); E = f(E, v, g, h, x[i + 12], P[7], 2368359562);
    h = D(h, E, v, g, x[i + 5], P[8], 4294588738); g = D(g, h, E, v, x[i + 8], P[9], 2272392833); v = D(v, g, h, E, x[i + 11], P[10], 1839030562); E = D(E, v, g, h, x[i + 14], P[11], 4259657740);
    h = D(h, E, v, g, x[i + 1], P[8], 2763975236); g = D(g, h, E, v, x[i + 4], P[9], 1272893353); v = D(v, g, h, E, x[i + 7], P[10], 4139469664); E = D(E, v, g, h, x[i + 10], P[11], 3200236656);
    h = D(h, E, v, g, x[i + 13], P[8], 681279174); g = D(g, h, E, v, x[i + 0], P[9], 3936430074); v = D(v, g, h, E, x[i + 3], P[10], 3572445317); E = D(E, v, g, h, x[i + 6], P[11], 76029189);
    h = D(h, E, v, g, x[i + 9], P[8], 3654602809); g = D(g, h, E, v, x[i + 12], P[9], 3873151461); v = D(v, g, h, E, x[i + 15], P[10], 530742520); E = D(E, v, g, h, x[i + 2], P[11], 3299628645);
    h = t(h, E, v, g, x[i + 0], P[12], 4096336452); g = t(g, h, E, v, x[i + 7], P[13], 1126891415); v = t(v, g, h, E, x[i + 14], P[14], 2878612391); E = t(E, v, g, h, x[i + 5], P[15], 4237533241);
    h = t(h, E, v, g, x[i + 12], P[12], 1700485571); g = t(g, h, E, v, x[i + 3], P[13], 2399980690); v = t(v, g, h, E, x[i + 10], P[14], 4293915773); E = t(E, v, g, h, x[i + 1], P[15], 2240044497);
    h = t(h, E, v, g, x[i + 8], P[12], 1873313359); g = t(g, h, E, v, x[i + 15], P[13], 4264355552); v = t(v, g, h, E, x[i + 6], P[14], 2734768916); E = t(E, v, g, h, x[i + 13], P[15], 1309151649);
    h = t(h, E, v, g, x[i + 4], P[12], 4149444226); g = t(g, h, E, v, x[i + 11], P[13], 3174756917); v = t(v, g, h, E, x[i + 2], P[14], 718787259); E = t(E, v, g, h, x[i + 9], P[15], 3951481745);
    h = K(h, a); E = K(E, b); v = K(v, c); g = K(g, dd);
  }
  return (B(h) + B(E) + B(v) + B(g)).toLowerCase();
}

export function Md5Generator() {
  const [t, setT] = useState("Hello, Dhuran!");
  return <div className="space-y-3"><Textarea rows={4} value={t} onChange={(e) => setT(e.target.value)} /><ResultBox><div className="font-mono text-center break-all text-lg text-primary">{md5(t)}</div></ResultBox></div>;
}

export function ShaGenerator() {
  const [t, setT] = useState("Hello, Dhuran!");
  const [out, setOut] = useState({ "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" });
  const run = async () => {
    const enc = new TextEncoder().encode(t);
    const r: any = {};
    for (const algo of ["SHA-1","SHA-256","SHA-384","SHA-512"]) {
      const buf = await crypto.subtle.digest(algo, enc);
      r[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    setOut(r);
  };
  return <div className="space-y-3"><Textarea rows={4} value={t} onChange={(e) => setT(e.target.value)} /><Btn onClick={run}>Generate hashes</Btn>{Object.entries(out).map(([k, v]) => v && <div key={k}><div className="text-xs font-semibold mb-1">{k}</div><div className="font-mono text-xs break-all bg-surface border border-border rounded p-2">{v}</div></div>)}</div>;
}

export function TextEncryptor() {
  const [text, setText] = useState("Secret message");
  const [key, setKey] = useState("password");
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [out, setOut] = useState("");
  const xor = (s: string, k: string) => Array.from(s).map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(i % k.length))).join("");
  const run = () => {
    try {
      if (mode === "enc") setOut(btoa(unescape(encodeURIComponent(xor(text, key)))));
      else setOut(xor(decodeURIComponent(escape(atob(text))), key));
    } catch (e: any) { toast.error("Invalid input"); }
  };
  return (
    <div className="space-y-3">
      <Field label={mode === "enc" ? "Plain text" : "Encrypted (base64)"}><Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Key"><Input value={key} onChange={(e) => setKey(e.target.value)} /></Field>
        <Field label="Mode"><select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={mode} onChange={(e) => setMode(e.target.value as any)}><option value="enc">Encrypt</option><option value="dec">Decrypt</option></select></Field>
      </div>
      <Btn onClick={run}>Run</Btn>
      {out && <Textarea rows={4} readOnly value={out} />}
    </div>
  );
}

export function ZipCreator() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!files.length) return toast.error("Add files");
    setBusy(true);
    try {
      const zip = new JSZip();
      for (const f of files) zip.file(f.name, await f.arrayBuffer());
      download(await zip.generateAsync({ type: "blob" }), "archive.zip");
      toast.success("ZIP created");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><FileDropzone multiple files={files} onFiles={setFiles} /><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Create ZIP</Btn></div>;
}

export function ZipExtractor() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<{ name: string; size: number }[]>([]);
  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    try {
      const zip = await JSZip.loadAsync(await files[0].arrayBuffer());
      const items: { name: string; size: number }[] = [];
      const ops: Promise<void>[] = [];
      zip.forEach((path, entry) => {
        if (entry.dir) return;
        items.push({ name: path, size: (entry as any)._data?.uncompressedSize || 0 });
        ops.push(entry.async("blob").then((b) => { download(b, path.split("/").pop() || path); }));
      });
      await Promise.all(ops);
      setList(items);
      toast.success(`Extracted ${items.length} files`);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><FileDropzone accept=".zip" files={files} onFiles={setFiles} /><Btn onClick={run} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Extract</Btn>{list.length > 0 && <div className="text-sm">{list.length} files extracted</div>}</div>;
}
