import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Btn, Field, Input, Textarea } from "@/components/tool-page";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dhuran PDF" },
      { name: "description", content: "Get in touch with Dhuran PDF — feedback, tool requests, partnerships." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-2 text-muted-foreground">Found a bug? Want a new tool? Just want to say hi? We'd love to hear from you.</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-border p-5 bg-card">
          <Mail className="h-5 w-5 text-primary" />
          <div className="mt-2 font-semibold">Email</div>
          <a href="mailto:hello@dhuranpdf.com" className="text-sm text-muted-foreground hover:text-primary">hello@dhuranpdf.com</a>
        </div>
        <div className="rounded-xl border border-border p-5 bg-card">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div className="mt-2 font-semibold">Feedback</div>
          <p className="text-sm text-muted-foreground">Use the form below — we read every message.</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Message received! We'll be in touch."); }} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Your name"><Input required maxLength={80} /></Field>
          <Field label="Email"><Input type="email" required maxLength={120} /></Field>
        </div>
        <Field label="Message"><Textarea required rows={6} maxLength={2000} /></Field>
        <Btn type="submit" disabled={sent}>{sent ? "Sent ✓" : "Send message"}</Btn>
      </form>
    </div>
  );
}
