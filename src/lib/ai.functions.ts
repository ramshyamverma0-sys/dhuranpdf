import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  text: z.string().min(10).max(20000),
  style: z.enum(["short", "medium", "bullet"]).default("medium"),
});

export const summarizeText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    const instr =
      data.style === "short"
        ? "Summarize the following text in 2-3 concise sentences."
        : data.style === "bullet"
        ? "Summarize the following text as 5-8 clear bullet points starting with '- '."
        : "Summarize the following text in one tight paragraph (~120 words).";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a precise summarization assistant." },
          { role: "user", content: `${instr}\n\nTEXT:\n${data.text}` },
        ],
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error(msg || `AI error ${res.status}`);
    }
    const json = await res.json();
    return { summary: json.choices?.[0]?.message?.content ?? "" };
  });
