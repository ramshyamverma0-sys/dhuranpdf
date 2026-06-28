import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SummarizeInput = z.object({
  text: z.string().min(10).max(20000),
  style: z.enum(["short", "medium", "bullet"]).default("medium"),
});

async function callAI(messages: { role: string; content: string }[]) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
    body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages }),
  });
  if (!res.ok) {
    const msg = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    throw new Error(msg || `AI error ${res.status}`);
  }
  const json = await res.json();
  return (json.choices?.[0]?.message?.content ?? "") as string;
}

export const summarizeText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummarizeInput.parse(input))
  .handler(async ({ data }) => {
    const instr =
      data.style === "short"
        ? "Summarize the following text in 2-3 concise sentences."
        : data.style === "bullet"
        ? "Summarize the following text as 5-8 clear bullet points starting with '- '."
        : "Summarize the following text in one tight paragraph (~120 words).";
    const summary = await callAI([
      { role: "system", content: "You are a precise summarization assistant." },
      { role: "user", content: `${instr}\n\nTEXT:\n${data.text}` },
    ]);
    return { summary };
  });

const PromptInput = z.object({
  system: z.string().max(2000),
  user: z.string().min(1).max(20000),
});

export const aiPrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PromptInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callAI([
      { role: "system", content: data.system },
      { role: "user", content: data.user },
    ]);
    return { text };
  });

const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string().max(20000) })).min(1).max(40),
});

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callAI([
      { role: "system", content: "You are Dhuran AI — a friendly, accurate assistant. Keep responses clear and concise." },
      ...data.messages,
    ]);
    return { text };
  });
