import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

// --- Preset system prompts (server-controlled allowlist) ---
// Client cannot supply an arbitrary system prompt; it references a preset key.
const PRESET_SYSTEM_PROMPTS = {
  grammar: "You are a meticulous grammar editor. Fix grammar, spelling, punctuation and clarity. Return only the corrected text.",
  paraphrase: "You are an expert paraphraser. Rewrite the text preserving meaning. Return only the rewritten text.",
  translate: "You are a precise translator. Translate the text to the requested language. Return only the translation.",
  "cover-letter": "You are an expert career writer. Generate a tailored, concise cover letter (~250 words) based on the user's notes.",
  blog: "You are a skilled blog writer. Write engaging, SEO-friendly blog posts with headings, intro and conclusion.",
  email: "You are a professional email writer. Compose clear, polite emails with subject line.",
  resume: "You are an expert resume writer. Build a clean, ATS-friendly resume in markdown with sections: Summary, Experience, Education, Skills.",
  questions: "You are a quiz creator. Generate clear multiple-choice questions with 4 options each and mark the correct one.",
  notes: "You are an expert study-notes creator. Convert the content into organized notes with headings, bullets, key terms, and action items.",
  "pdf-summary": "You are a concise document summarizer. Provide an executive summary, key points, action items, and important numbers.",
  "pdf-qa": "Answer questions using only the supplied PDF content. If the answer is not present, say so clearly.",
} as const;

type PresetKey = keyof typeof PRESET_SYSTEM_PROMPTS;
const PRESET_KEYS = Object.keys(PRESET_SYSTEM_PROMPTS) as [PresetKey, ...PresetKey[]];

// --- Basic anti-abuse: allowed origin check + per-IP token bucket ---
// Best-effort in-memory limiter (per Worker isolate). Not a substitute for
// end-user auth, but blocks trivial credit-exhaustion scripts.
const RATE_LIMIT_MAX = 20;         // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute
const buckets = new Map<string, { count: number; reset: number }>();

function checkAbuse() {
  const origin = getRequestHeader("origin") || getRequestHeader("referer") || "";
  const host = getRequestHeader("host") || "";
  // Allow same-origin (or empty during SSR) requests only.
  if (origin) {
    try {
      const u = new URL(origin);
      const allowed =
        u.host === host ||
        u.host.endsWith(".lovable.app") ||
        u.host.endsWith(".lovableproject.com") ||
        u.hostname === "localhost";
      if (!allowed) throw new Error("Forbidden origin");
    } catch {
      throw new Error("Forbidden origin");
    }
  }

  const ip =
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
  } else {
    b.count += 1;
    if (b.count > RATE_LIMIT_MAX) {
      throw new Error("Rate limit exceeded. Please slow down and try again shortly.");
    }
  }
}

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

const SummarizeInput = z.object({
  text: z.string().min(10).max(20000),
  style: z.enum(["short", "medium", "bullet"]).default("medium"),
});

export const summarizeText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummarizeInput.parse(input))
  .handler(async ({ data }) => {
    checkAbuse();
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
  preset: z.enum(PRESET_KEYS),
  user: z.string().min(1).max(20000),
});

export const aiPrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PromptInput.parse(input))
  .handler(async ({ data }) => {
    checkAbuse();
    const system = PRESET_SYSTEM_PROMPTS[data.preset];
    const text = await callAI([
      { role: "system", content: system },
      { role: "user", content: data.user },
    ]);
    return { text };
  });

// Only user/assistant messages accepted from clients — no client-supplied system role.
const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(20000),
      }),
    )
    .min(1)
    .max(40),
});

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    checkAbuse();
    // Defensive: strip any accidental system-role messages.
    const safeMessages = data.messages.filter((m) => m.role === "user" || m.role === "assistant");
    const text = await callAI([
      { role: "system", content: "You are Dhuran AI — a friendly, accurate assistant. Keep responses clear and concise." },
      ...safeMessages,
    ]);
    return { text };
  });
