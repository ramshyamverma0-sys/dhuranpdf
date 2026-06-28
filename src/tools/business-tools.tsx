import { useState } from "react";
import { jsPDFLikeInvoice } from "./_pdf-doc";
import { Btn, Field, Input, Textarea } from "@/components/tool-page";
import { toast } from "sonner";

export function InvoiceGenerator() {
  const [data, setData] = useState({ from: "Your Company\nAddress\nemail@you.com", to: "Client Name\nClient Address", invoiceNo: "INV-001", date: new Date().toISOString().slice(0,10), currency: "₹" });
  const [items, setItems] = useState([{ desc: "Service A", qty: 1, rate: 1000 }]);
  const total = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const make = async () => {
    try {
      await jsPDFLikeInvoice({ ...data, items, total, title: "INVOICE" });
      toast.success("Invoice PDF created");
    } catch (e: any) { toast.error(e.message); }
  };
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="From"><Textarea rows={3} value={data.from} onChange={(e) => setData({ ...data, from: e.target.value })} /></Field>
        <Field label="To"><Textarea rows={3} value={data.to} onChange={(e) => setData({ ...data, to: e.target.value })} /></Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Invoice #"><Input value={data.invoiceNo} onChange={(e) => setData({ ...data, invoiceNo: e.target.value })} /></Field>
        <Field label="Date"><Input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} /></Field>
        <Field label="Currency"><Input value={data.currency} onChange={(e) => setData({ ...data, currency: e.target.value })} /></Field>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-semibold">Line items</div>
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_100px_auto] gap-2">
            <Input value={it.desc} onChange={(e) => { const c = [...items]; c[i].desc = e.target.value; setItems(c); }} />
            <Input type="number" value={it.qty} onChange={(e) => { const c = [...items]; c[i].qty = +e.target.value; setItems(c); }} />
            <Input type="number" value={it.rate} onChange={(e) => { const c = [...items]; c[i].rate = +e.target.value; setItems(c); }} />
            <button className="h-10 px-3 rounded border border-border" onClick={() => setItems(items.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <Btn variant="secondary" onClick={() => setItems([...items, { desc: "", qty: 1, rate: 0 }])}>+ Add item</Btn>
      </div>
      <div className="text-right text-xl font-bold">Total: {data.currency}{total.toLocaleString()}</div>
      <Btn onClick={make}>Generate PDF</Btn>
    </div>
  );
}

export function ReceiptGenerator() {
  const [data, setData] = useState({ from: "Your Company", to: "Customer", invoiceNo: "RC-001", date: new Date().toISOString().slice(0,10), currency: "₹", amount: 1000, note: "Received with thanks" });
  const make = async () => {
    try {
      await jsPDFLikeInvoice({ from: data.from, to: data.to, invoiceNo: data.invoiceNo, date: data.date, currency: data.currency, items: [{ desc: data.note, qty: 1, rate: data.amount }], total: data.amount, title: "RECEIPT" });
      toast.success("Receipt PDF created");
    } catch (e: any) { toast.error(e.message); }
  };
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="From"><Input value={data.from} onChange={(e) => setData({ ...data, from: e.target.value })} /></Field>
        <Field label="To"><Input value={data.to} onChange={(e) => setData({ ...data, to: e.target.value })} /></Field>
        <Field label="Receipt #"><Input value={data.invoiceNo} onChange={(e) => setData({ ...data, invoiceNo: e.target.value })} /></Field>
        <Field label="Date"><Input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} /></Field>
        <Field label="Currency"><Input value={data.currency} onChange={(e) => setData({ ...data, currency: e.target.value })} /></Field>
        <Field label="Amount"><Input type="number" value={data.amount} onChange={(e) => setData({ ...data, amount: +e.target.value })} /></Field>
      </div>
      <Field label="Note / For"><Input value={data.note} onChange={(e) => setData({ ...data, note: e.target.value })} /></Field>
      <Btn onClick={make}>Generate PDF</Btn>
    </div>
  );
}

const PREFIX = ["Nova","Bright","Apex","Pixel","Cloud","Lumen","Vista","Echo","Stellar","Vivid","Zen","Quantum","Pulse","Smart","Prime","Vertex","Loop","Spark","Forge","Wave"];
const SUFFIX = ["Labs","Works","Hub","Studio","Forge","Tech","Ventures","Stack","Sphere","Cloud","Pulse","Group","Soft","Bay","Edge","Forge","Bridge","Co"];
export function BusinessNameGenerator() {
  const [seed, setSeed] = useState("");
  const [list, setList] = useState<string[]>([]);
  const make = () => {
    const out = new Set<string>();
    while (out.size < 12) {
      const a = PREFIX[Math.floor(Math.random()*PREFIX.length)];
      const b = SUFFIX[Math.floor(Math.random()*SUFFIX.length)];
      out.add(seed ? `${seed} ${b}` : `${a}${b}`);
    }
    setList([...out]);
  };
  return (
    <div className="space-y-3">
      <Field label="Optional seed word"><Input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="e.g. Coffee" /></Field>
      <Btn onClick={make}>Generate names</Btn>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{list.map((n) => <div key={n} className="rounded border border-border bg-surface p-3 text-center font-semibold">{n}</div>)}</div>
    </div>
  );
}

export function EmailSignatureGenerator() {
  const [d, setD] = useState({ name: "Jane Doe", title: "Product Manager", company: "Dhuran PDF", email: "jane@dhuran.com", phone: "+1 555 0123", website: "dhuranpdf.com" });
  const html = `<table style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a">
<tr><td style="padding-right:16px;border-right:3px solid #3b82f6"><strong style="font-size:16px">${d.name}</strong><br><span style="color:#64748b">${d.title}</span></td>
<td style="padding-left:16px"><strong>${d.company}</strong><br>📧 <a href="mailto:${d.email}">${d.email}</a><br>📞 ${d.phone}<br>🌐 <a href="https://${d.website}">${d.website}</a></td></tr></table>`;
  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">{Object.keys(d).map((k) => <Field key={k} label={k}><Input value={(d as any)[k]} onChange={(e) => setD({ ...d, [k]: e.target.value })} /></Field>)}</div>
      <div className="border border-border rounded-lg p-4 bg-white" dangerouslySetInnerHTML={{ __html: html }} />
      <Textarea rows={6} readOnly value={html} />
      <Btn onClick={async () => { await navigator.clipboard.writeText(html); toast.success("HTML copied"); }}>Copy HTML</Btn>
    </div>
  );
}
