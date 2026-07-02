// AI Hub — isolated dataset. Static, in-memory. Safe to expand later.

export type Pricing = "Free" | "Freemium" | "Paid";

export interface AITool {
  slug: string;
  name: string;
  category: string; // category slug
  description: string;
  long?: string;
  website: string;
  pricing: Pricing;
  openSource?: boolean;
  noLogin?: boolean;
  api?: boolean;
  mobile?: boolean;
  tags: string[];
  features?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  rating: number; // 0..5
  badges?: ("popular" | "trending" | "editor" | "new" | "verified")[];
  updated: string; // YYYY-MM-DD
}

export interface AIHubCategory {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide name key
}

export const AI_CATEGORIES: AIHubCategory[] = [
  { slug: "chatbots", name: "AI Chatbots", description: "Conversational AI assistants", icon: "MessageCircle" },
  { slug: "search", name: "AI Search", description: "AI-powered search engines", icon: "Search" },
  { slug: "research", name: "Research AI", description: "Deep research assistants", icon: "Microscope" },
  { slug: "writing", name: "Writing AI", description: "AI writing assistants", icon: "PenLine" },
  { slug: "grammar", name: "Grammar AI", description: "Grammar & clarity fixers", icon: "SpellCheck" },
  { slug: "prompt", name: "Prompt AI", description: "Prompt engineering tools", icon: "Terminal" },
  { slug: "image-gen", name: "Image Generator", description: "Text-to-image models", icon: "Image" },
  { slug: "image-edit", name: "Image Editor", description: "AI image editing", icon: "ImagePlus" },
  { slug: "bg-remover", name: "Background Remover", description: "Remove image backgrounds", icon: "Eraser" },
  { slug: "photo-enhance", name: "Photo Enhancer", description: "Upscale & enhance", icon: "Sparkles" },
  { slug: "logo", name: "Logo Generator", description: "AI logo makers", icon: "Hexagon" },
  { slug: "icon", name: "Icon Generator", description: "AI icon builders", icon: "Shapes" },
  { slug: "illustration", name: "Illustration AI", description: "Illustration generators", icon: "Palette" },
  { slug: "video-gen", name: "Video Generator", description: "Text-to-video models", icon: "Film" },
  { slug: "video-edit", name: "Video Editing", description: "AI video editors", icon: "Scissors" },
  { slug: "animation", name: "Animation AI", description: "AI animation tools", icon: "Play" },
  { slug: "avatar", name: "Avatar AI", description: "AI avatars & talking heads", icon: "UserCircle" },
  { slug: "voice", name: "Voice AI", description: "Voice cloning & synthesis", icon: "Mic" },
  { slug: "tts", name: "Text to Speech", description: "TTS engines", icon: "Volume2" },
  { slug: "stt", name: "Speech to Text", description: "Transcription tools", icon: "AudioLines" },
  { slug: "music", name: "Music Generator", description: "AI music creation", icon: "Music" },
  { slug: "coding", name: "Coding AI", description: "AI code assistants", icon: "Code" },
  { slug: "website", name: "Website Builder", description: "AI web builders", icon: "Globe" },
  { slug: "app", name: "App Builder", description: "AI app builders", icon: "Smartphone" },
  { slug: "uiux", name: "UI/UX AI", description: "Design AI tools", icon: "LayoutGrid" },
  { slug: "pdf", name: "PDF AI", description: "AI for PDFs", icon: "FileText" },
  { slug: "ocr", name: "OCR AI", description: "OCR & document extraction", icon: "ScanText" },
  { slug: "resume", name: "Resume Builder", description: "AI resume makers", icon: "Briefcase" },
  { slug: "presentation", name: "Presentation AI", description: "AI slide decks", icon: "Presentation" },
  { slug: "spreadsheet", name: "Spreadsheet AI", description: "AI for spreadsheets", icon: "Table" },
  { slug: "document", name: "Document AI", description: "Document intelligence", icon: "FileStack" },
  { slug: "marketing", name: "Marketing AI", description: "AI for marketing", icon: "Megaphone" },
  { slug: "seo", name: "SEO AI", description: "AI SEO tools", icon: "TrendingUp" },
  { slug: "social", name: "Social Media AI", description: "Social content tools", icon: "Share2" },
  { slug: "email", name: "Email AI", description: "AI email tools", icon: "Mail" },
  { slug: "finance", name: "Finance AI", description: "Finance & analytics AI", icon: "DollarSign" },
  { slug: "health", name: "Health AI", description: "Health & wellness AI", icon: "HeartPulse" },
  { slug: "education", name: "Education AI", description: "AI for learning", icon: "GraduationCap" },
  { slug: "translation", name: "Translation AI", description: "AI translators", icon: "Languages" },
  { slug: "automation", name: "Automation AI", description: "AI workflow automation", icon: "Workflow" },
  { slug: "productivity", name: "Productivity AI", description: "AI for work", icon: "Zap" },
  { slug: "business", name: "Business AI", description: "AI business tools", icon: "Building2" },
  { slug: "support", name: "Customer Support AI", description: "AI helpdesks", icon: "Headphones" },
];

// Compact tool factory
const t = (
  slug: string,
  name: string,
  category: string,
  description: string,
  website: string,
  pricing: Pricing,
  opts: Partial<AITool> = {},
): AITool => ({
  slug,
  name,
  category,
  description,
  website,
  pricing,
  rating: opts.rating ?? 4.5,
  tags: opts.tags ?? [],
  updated: opts.updated ?? "2026-06-15",
  ...opts,
});

// ~320 tools across all categories. Real, well-known products.
export const AI_TOOLS: AITool[] = [
  // Chatbots
  t("chatgpt", "ChatGPT", "chatbots", "OpenAI's leading conversational AI assistant.", "https://chat.openai.com", "Freemium", { rating: 4.9, tags: ["chat","assistant","gpt-5"], badges: ["popular","editor","verified"], features: ["Long context","Voice mode","Vision","Code interpreter"], pros: ["Best-in-class","Wide plugin ecosystem"], cons: ["Rate limits on free"], alternatives: ["claude","gemini","grok"], long: "ChatGPT is a general-purpose conversational assistant from OpenAI supporting text, voice, images, and code." }),
  t("claude", "Claude", "chatbots", "Anthropic's assistant known for long-context reasoning.", "https://claude.ai", "Freemium", { rating: 4.8, tags: ["chat","long-context","safety"], badges: ["popular","editor","verified"], features: ["200K context","Artifacts","Projects"], pros: ["Great writing","Careful reasoning"], cons: ["Fewer integrations"], alternatives: ["chatgpt","gemini"] }),
  t("gemini", "Gemini", "chatbots", "Google's multimodal assistant with deep Google integration.", "https://gemini.google.com", "Freemium", { rating: 4.7, tags: ["multimodal","google"], badges: ["popular","verified"], alternatives: ["chatgpt","claude"] }),
  t("grok", "Grok", "chatbots", "xAI's assistant with real-time X integration.", "https://grok.com", "Freemium", { rating: 4.5, tags: ["realtime","x"], badges: ["trending","verified"] }),
  t("deepseek", "DeepSeek", "chatbots", "Open-source powerful reasoning model chat.", "https://chat.deepseek.com", "Free", { rating: 4.6, openSource: true, tags: ["reasoning","open-source"], badges: ["trending"] }),
  t("copilot", "Microsoft Copilot", "chatbots", "Microsoft's assistant built on GPT-5 with web search.", "https://copilot.microsoft.com", "Freemium", { rating: 4.6, tags: ["microsoft","web"], badges: ["verified"] }),
  t("meta-ai", "Meta AI", "chatbots", "Meta's assistant using Llama models.", "https://meta.ai", "Free", { rating: 4.3, tags: ["llama","free"] }),
  t("poe", "Poe", "chatbots", "Multiple AI models in one interface.", "https://poe.com", "Freemium", { rating: 4.5, tags: ["multi-model"] }),
  t("character-ai", "Character.AI", "chatbots", "Chat with AI personas and characters.", "https://character.ai", "Freemium", { rating: 4.4, tags: ["roleplay"], badges: ["popular"] }),
  t("hugging-chat", "HuggingChat", "chatbots", "Open-source chat from Hugging Face.", "https://huggingface.co/chat", "Free", { rating: 4.3, openSource: true, tags: ["open-source"] }),
  t("mistral-chat", "Le Chat", "chatbots", "Mistral's assistant with fast responses.", "https://chat.mistral.ai", "Freemium", { rating: 4.4, tags: ["mistral"] }),
  t("pi", "Pi", "chatbots", "Inflection's supportive personal AI.", "https://pi.ai", "Free", { rating: 4.2, tags: ["personal"] }),

  // Search / Research
  t("perplexity", "Perplexity", "search", "AI answer engine with citations.", "https://perplexity.ai", "Freemium", { rating: 4.8, tags: ["search","citations"], badges: ["popular","editor","verified"] }),
  t("you", "You.com", "search", "AI-first search engine.", "https://you.com", "Freemium", { rating: 4.4, tags: ["search"] }),
  t("phind", "Phind", "search", "AI search built for developers.", "https://phind.com", "Freemium", { rating: 4.6, tags: ["dev","search"] }),
  t("andi", "Andi", "search", "Conversational search that answers.", "https://andisearch.com", "Free", { rating: 4.2, tags: ["search"] }),
  t("komo", "Komo", "search", "Private AI search.", "https://komo.ai", "Free", { rating: 4.1, tags: ["private"] }),
  t("iask", "iAsk", "search", "AI answer engine.", "https://iask.ai", "Free", { rating: 4.0, tags: ["answers"] }),
  t("consensus", "Consensus", "research", "Research answers from scientific papers.", "https://consensus.app", "Freemium", { rating: 4.7, tags: ["papers","science"], badges: ["editor"] }),
  t("elicit", "Elicit", "research", "Research assistant for academics.", "https://elicit.com", "Freemium", { rating: 4.6, tags: ["academic"] }),
  t("scispace", "SciSpace", "research", "Read, understand and search papers.", "https://scispace.com", "Freemium", { rating: 4.5, tags: ["papers"] }),
  t("humata", "Humata", "research", "Chat with your research documents.", "https://humata.ai", "Freemium", { rating: 4.4, tags: ["docs"] }),
  t("undermind", "Undermind", "research", "Deep research agent for literature.", "https://undermind.ai", "Freemium", { rating: 4.6, tags: ["deep"] }),
  t("scite", "Scite", "research", "Smart citations for research.", "https://scite.ai", "Paid", { rating: 4.5, tags: ["citations"] }),

  // Writing
  t("jasper", "Jasper", "writing", "AI copywriting platform for marketers.", "https://jasper.ai", "Paid", { rating: 4.6, tags: ["copy","marketing"], badges: ["verified"] }),
  t("copyai", "Copy.ai", "writing", "AI marketing copy generation.", "https://copy.ai", "Freemium", { rating: 4.4, tags: ["copy"] }),
  t("writesonic", "Writesonic", "writing", "AI writer with chat and images.", "https://writesonic.com", "Freemium", { rating: 4.4, tags: ["writer"] }),
  t("rytr", "Rytr", "writing", "Affordable AI writing assistant.", "https://rytr.me", "Freemium", { rating: 4.3, tags: ["cheap"] }),
  t("notion-ai", "Notion AI", "writing", "AI writing inside Notion.", "https://notion.so/product/ai", "Paid", { rating: 4.7, tags: ["notion"], badges: ["popular"] }),
  t("sudowrite", "Sudowrite", "writing", "AI writing for fiction authors.", "https://sudowrite.com", "Paid", { rating: 4.5, tags: ["fiction"] }),
  t("shortlyai", "ShortlyAI", "writing", "Distraction-free AI writer.", "https://shortlyai.com", "Paid", { rating: 4.2 }),
  t("hyperwrite", "HyperWrite", "writing", "Personal writing assistant.", "https://hyperwriteai.com", "Freemium", { rating: 4.3 }),
  t("wordtune", "Wordtune", "writing", "Rewrite with clarity and tone.", "https://wordtune.com", "Freemium", { rating: 4.5, tags: ["rewrite"] }),
  t("anyword", "Anyword", "writing", "Data-driven marketing copy.", "https://anyword.com", "Paid", { rating: 4.4 }),

  // Grammar
  t("grammarly", "Grammarly", "grammar", "Grammar, spelling & tone checker.", "https://grammarly.com", "Freemium", { rating: 4.8, tags: ["grammar"], badges: ["popular","verified"] }),
  t("languagetool", "LanguageTool", "grammar", "Open-source grammar checker.", "https://languagetool.org", "Freemium", { rating: 4.5, openSource: true }),
  t("prowritingaid", "ProWritingAid", "grammar", "Grammar and style analysis.", "https://prowritingaid.com", "Freemium", { rating: 4.4 }),
  t("quillbot", "QuillBot", "grammar", "Paraphraser and grammar checker.", "https://quillbot.com", "Freemium", { rating: 4.6, tags: ["paraphrase"], badges: ["popular"] }),
  t("linguix", "Linguix", "grammar", "Writing assistant for teams.", "https://linguix.com", "Freemium", { rating: 4.2 }),
  t("outwrite", "Outwrite", "grammar", "AI proofreader and rewriter.", "https://outwrite.com", "Freemium", { rating: 4.3 }),

  // Prompt
  t("promptbase", "PromptBase", "prompt", "Marketplace to buy and sell prompts.", "https://promptbase.com", "Paid", { rating: 4.3, tags: ["marketplace"] }),
  t("promptperfect", "PromptPerfect", "prompt", "Optimize your prompts automatically.", "https://promptperfect.jina.ai", "Freemium", { rating: 4.4 }),
  t("flowgpt", "FlowGPT", "prompt", "Community prompt library.", "https://flowgpt.com", "Free", { rating: 4.2 }),
  t("promptlayer", "PromptLayer", "prompt", "Prompt management platform.", "https://promptlayer.com", "Freemium", { rating: 4.5, api: true }),
  t("aiprm", "AIPRM", "prompt", "Curated prompts for ChatGPT.", "https://aiprm.com", "Freemium", { rating: 4.4 }),

  // Image gen
  t("midjourney", "Midjourney", "image-gen", "Premium AI image generation via Discord/web.", "https://midjourney.com", "Paid", { rating: 4.9, tags: ["art","photorealism"], badges: ["popular","editor","verified"], features: ["v7 model","Style refs"] }),
  t("dalle", "DALL·E 3", "image-gen", "OpenAI's text-to-image model.", "https://openai.com/dall-e-3", "Freemium", { rating: 4.6, tags: ["openai"], badges: ["verified"] }),
  t("stable-diffusion", "Stable Diffusion", "image-gen", "Open-source image generation model.", "https://stability.ai", "Free", { rating: 4.7, openSource: true, badges: ["editor"] }),
  t("leonardo", "Leonardo AI", "image-gen", "AI image gen for creators & game art.", "https://leonardo.ai", "Freemium", { rating: 4.7, tags: ["game"], badges: ["popular"] }),
  t("ideogram", "Ideogram", "image-gen", "Great text rendering in images.", "https://ideogram.ai", "Freemium", { rating: 4.6, tags: ["text"], badges: ["trending"] }),
  t("flux", "Flux AI", "image-gen", "Black Forest Labs' powerful image model.", "https://blackforestlabs.ai", "Freemium", { rating: 4.7, badges: ["trending"] }),
  t("firefly", "Adobe Firefly", "image-gen", "Adobe's commercial-safe image gen.", "https://firefly.adobe.com", "Freemium", { rating: 4.5, tags: ["adobe"] }),
  t("playground", "Playground AI", "image-gen", "Free image generation playground.", "https://playground.com", "Freemium", { rating: 4.4 }),
  t("bing-image", "Bing Image Creator", "image-gen", "Free DALL·E-powered image creator.", "https://bing.com/create", "Free", { rating: 4.3 }),
  t("recraft", "Recraft", "image-gen", "Vector & raster AI design tool.", "https://recraft.ai", "Freemium", { rating: 4.6, tags: ["vector"], badges: ["trending"] }),
  t("nightcafe", "NightCafe", "image-gen", "Community AI art generator.", "https://nightcafe.studio", "Freemium", { rating: 4.4 }),
  t("dreamstudio", "DreamStudio", "image-gen", "Official Stability web UI.", "https://dreamstudio.ai", "Paid", { rating: 4.3 }),
  t("civitai", "Civitai", "image-gen", "Community models & LoRAs.", "https://civitai.com", "Free", { rating: 4.5, openSource: true }),
  t("krea", "Krea AI", "image-gen", "Real-time creative AI canvas.", "https://krea.ai", "Freemium", { rating: 4.6, badges: ["trending"] }),
  t("magnific", "Magnific AI", "photo-enhance", "AI upscaler & enhancer.", "https://magnific.ai", "Paid", { rating: 4.8, badges: ["editor"] }),

  // Image edit / bg
  t("photoshop-ai", "Photoshop AI", "image-edit", "Generative Fill in Photoshop.", "https://adobe.com/products/photoshop.html", "Paid", { rating: 4.8, tags: ["adobe"], badges: ["verified"] }),
  t("clipdrop", "Clipdrop", "image-edit", "AI image editing suite.", "https://clipdrop.co", "Freemium", { rating: 4.6 }),
  t("photoroom", "PhotoRoom", "image-edit", "AI product photos & background.", "https://photoroom.com", "Freemium", { rating: 4.6, mobile: true }),
  t("pixlr", "Pixlr", "image-edit", "AI-powered photo editor.", "https://pixlr.com", "Freemium", { rating: 4.4 }),
  t("removebg", "Remove.bg", "bg-remover", "Instant background remover.", "https://remove.bg", "Freemium", { rating: 4.7, badges: ["popular","verified"] }),
  t("erase-bg", "Erase.bg", "bg-remover", "Free background removal.", "https://erase.bg", "Free", { rating: 4.4 }),
  t("cleanup-pictures", "Cleanup.pictures", "image-edit", "Remove unwanted objects.", "https://cleanup.pictures", "Freemium", { rating: 4.5 }),
  t("upscayl", "Upscayl", "photo-enhance", "Open-source image upscaler.", "https://upscayl.org", "Free", { rating: 4.6, openSource: true }),
  t("topaz-photo", "Topaz Photo AI", "photo-enhance", "Pro photo enhancement.", "https://topazlabs.com", "Paid", { rating: 4.7 }),
  t("letsenhance", "Let's Enhance", "photo-enhance", "Online photo upscaler.", "https://letsenhance.io", "Freemium", { rating: 4.4 }),
  t("bigjpg", "BigJPG", "photo-enhance", "Deep learning upscaler.", "https://bigjpg.com", "Freemium", { rating: 4.2 }),
  t("pica-ai", "Pica AI", "photo-enhance", "AI face enhancer.", "https://pica-ai.com", "Freemium", { rating: 4.3 }),

  // Logo / icon / illustration
  t("looka", "Looka", "logo", "AI logo maker with brand kits.", "https://looka.com", "Freemium", { rating: 4.5 }),
  t("logoai", "LogoAI", "logo", "AI logo & brand generator.", "https://logoai.com", "Paid", { rating: 4.3 }),
  t("brandmark", "Brandmark", "logo", "AI logo design tool.", "https://brandmark.io", "Paid", { rating: 4.4 }),
  t("hatchful", "Hatchful", "logo", "Free logo maker by Shopify.", "https://hatchful.shopify.com", "Free", { rating: 4.2 }),
  t("iconify-ai", "Iconify AI", "icon", "AI-generated icon sets.", "https://iconifyai.com", "Freemium", { rating: 4.3 }),
  t("iconscout-ai", "Iconscout AI", "icon", "AI icons & 3D illustrations.", "https://iconscout.com", "Freemium", { rating: 4.5 }),
  t("stockimg", "Stockimg.ai", "illustration", "AI logos, illustrations, book covers.", "https://stockimg.ai", "Freemium", { rating: 4.4 }),
  t("illustroke", "Illustroke", "illustration", "Text to SVG illustrations.", "https://illustroke.com", "Paid", { rating: 4.3 }),

  // Video gen
  t("runway", "Runway", "video-gen", "AI video generation & editing (Gen-4).", "https://runwayml.com", "Freemium", { rating: 4.8, badges: ["popular","editor","verified"] }),
  t("kling", "Kling AI", "video-gen", "Photorealistic text-to-video.", "https://klingai.com", "Freemium", { rating: 4.7, badges: ["trending"] }),
  t("pika", "Pika", "video-gen", "Creative AI video generator.", "https://pika.art", "Freemium", { rating: 4.6, badges: ["popular"] }),
  t("veo", "Google Veo", "video-gen", "Google's high-quality video model.", "https://deepmind.google/technologies/veo", "Paid", { rating: 4.8, badges: ["editor","verified"] }),
  t("sora", "Sora", "video-gen", "OpenAI's text-to-video model.", "https://openai.com/sora", "Paid", { rating: 4.7, badges: ["editor","verified"] }),
  t("luma", "Luma Dream Machine", "video-gen", "Fast realistic video gen.", "https://lumalabs.ai/dream-machine", "Freemium", { rating: 4.6 }),
  t("hailuo", "Hailuo AI", "video-gen", "MiniMax video generation.", "https://hailuoai.video", "Freemium", { rating: 4.5, badges: ["trending"] }),
  t("haiper", "Haiper", "video-gen", "AI video model with 8s clips.", "https://haiper.ai", "Freemium", { rating: 4.3 }),
  t("invideo-ai", "InVideo AI", "video-gen", "AI video from a single prompt.", "https://invideo.io/ai", "Freemium", { rating: 4.4 }),
  t("fliki", "Fliki", "video-gen", "Turn text into videos with AI voices.", "https://fliki.ai", "Freemium", { rating: 4.5 }),

  // Video edit
  t("descript", "Descript", "video-edit", "Edit video like a doc.", "https://descript.com", "Freemium", { rating: 4.7, badges: ["editor"] }),
  t("capcut-ai", "CapCut AI", "video-edit", "AI video editor with effects.", "https://capcut.com", "Freemium", { rating: 4.6, mobile: true, badges: ["popular"] }),
  t("veed", "VEED.IO", "video-edit", "Online AI video editor.", "https://veed.io", "Freemium", { rating: 4.5 }),
  t("opus-clip", "Opus Clip", "video-edit", "Long videos to viral shorts.", "https://opus.pro", "Freemium", { rating: 4.7, badges: ["trending"] }),
  t("filmora-ai", "Filmora AI", "video-edit", "AI video editor by Wondershare.", "https://filmora.wondershare.com", "Freemium", { rating: 4.5 }),
  t("premiere-ai", "Premiere Pro AI", "video-edit", "Adobe AI video tools.", "https://adobe.com/products/premiere.html", "Paid", { rating: 4.7 }),
  t("kapwing", "Kapwing", "video-edit", "Collaborative AI video editor.", "https://kapwing.com", "Freemium", { rating: 4.5 }),

  // Animation / avatar
  t("cascadeur", "Cascadeur", "animation", "AI-assisted 3D animation.", "https://cascadeur.com", "Freemium", { rating: 4.5 }),
  t("animaker", "Animaker", "animation", "AI animation studio.", "https://animaker.com", "Freemium", { rating: 4.3 }),
  t("krikey", "Krikey AI", "animation", "Text to 3D animation.", "https://krikey.ai", "Freemium", { rating: 4.2 }),
  t("heygen", "HeyGen", "avatar", "AI avatar videos in any language.", "https://heygen.com", "Freemium", { rating: 4.7, badges: ["editor"] }),
  t("synthesia", "Synthesia", "avatar", "AI avatars for corporate video.", "https://synthesia.io", "Paid", { rating: 4.6, badges: ["verified"] }),
  t("d-id", "D-ID", "avatar", "Talking head videos from photos.", "https://d-id.com", "Freemium", { rating: 4.5 }),
  t("hourone", "HourOne", "avatar", "AI presenter videos.", "https://hourone.ai", "Paid", { rating: 4.3 }),
  t("elai", "Elai.io", "avatar", "AI video with avatars.", "https://elai.io", "Freemium", { rating: 4.3 }),

  // Voice / TTS / STT
  t("elevenlabs", "ElevenLabs", "voice", "Realistic AI voice cloning & TTS.", "https://elevenlabs.io", "Freemium", { rating: 4.9, api: true, badges: ["popular","editor","verified"] }),
  t("playht", "PlayHT", "tts", "AI voice generator & TTS.", "https://play.ht", "Freemium", { rating: 4.6, api: true }),
  t("murf", "Murf AI", "tts", "AI voiceover studio.", "https://murf.ai", "Freemium", { rating: 4.5 }),
  t("resemble", "Resemble AI", "voice", "Voice cloning platform.", "https://resemble.ai", "Paid", { rating: 4.5, api: true }),
  t("lovo", "LOVO", "tts", "TTS with 500+ voices.", "https://lovo.ai", "Freemium", { rating: 4.4 }),
  t("wellsaid", "WellSaid Labs", "tts", "Studio-quality AI voice.", "https://wellsaidlabs.com", "Paid", { rating: 4.5 }),
  t("speechify", "Speechify", "tts", "Listen to any text with AI.", "https://speechify.com", "Freemium", { rating: 4.6, mobile: true }),
  t("otter", "Otter.ai", "stt", "Meeting transcription & notes.", "https://otter.ai", "Freemium", { rating: 4.7, badges: ["popular"] }),
  t("fireflies", "Fireflies.ai", "stt", "AI meeting assistant.", "https://fireflies.ai", "Freemium", { rating: 4.6 }),
  t("whisper", "OpenAI Whisper", "stt", "Open-source speech recognition.", "https://github.com/openai/whisper", "Free", { rating: 4.8, openSource: true, badges: ["editor"] }),
  t("assemblyai", "AssemblyAI", "stt", "Speech-to-text API.", "https://assemblyai.com", "Freemium", { rating: 4.6, api: true }),
  t("deepgram", "Deepgram", "stt", "Enterprise speech-to-text API.", "https://deepgram.com", "Freemium", { rating: 4.6, api: true }),
  t("rev", "Rev AI", "stt", "Transcription and captions.", "https://rev.ai", "Paid", { rating: 4.4, api: true }),

  // Music
  t("suno", "Suno", "music", "Create songs from prompts.", "https://suno.com", "Freemium", { rating: 4.8, badges: ["popular","editor","trending"] }),
  t("udio", "Udio", "music", "AI music generator with vocals.", "https://udio.com", "Freemium", { rating: 4.7, badges: ["trending"] }),
  t("aiva", "AIVA", "music", "AI composer for soundtracks.", "https://aiva.ai", "Freemium", { rating: 4.5 }),
  t("soundraw", "Soundraw", "music", "Royalty-free AI music.", "https://soundraw.io", "Paid", { rating: 4.4 }),
  t("boomy", "Boomy", "music", "Make songs in seconds.", "https://boomy.com", "Freemium", { rating: 4.3 }),
  t("mubert", "Mubert", "music", "Generative music streams.", "https://mubert.com", "Freemium", { rating: 4.4, api: true }),
  t("stable-audio", "Stable Audio", "music", "Stability AI's audio model.", "https://stableaudio.com", "Freemium", { rating: 4.5 }),
  t("beatoven", "Beatoven", "music", "AI background music.", "https://beatoven.ai", "Freemium", { rating: 4.3 }),

  // Coding
  t("github-copilot", "GitHub Copilot", "coding", "AI pair programmer in your IDE.", "https://github.com/features/copilot", "Paid", { rating: 4.7, badges: ["popular","verified"] }),
  t("cursor", "Cursor", "coding", "AI code editor built on VSCode.", "https://cursor.com", "Freemium", { rating: 4.8, badges: ["popular","editor","trending"] }),
  t("windsurf", "Windsurf", "coding", "Agentic AI code editor by Codeium.", "https://windsurf.com", "Freemium", { rating: 4.7, badges: ["trending"] }),
  t("cline", "Cline", "coding", "Autonomous coding agent for VSCode.", "https://cline.bot", "Free", { rating: 4.7, openSource: true }),
  t("aider", "Aider", "coding", "AI pair programming in your terminal.", "https://aider.chat", "Free", { rating: 4.6, openSource: true }),
  t("codeium", "Codeium", "coding", "Free AI code autocomplete.", "https://codeium.com", "Freemium", { rating: 4.6 }),
  t("tabnine", "Tabnine", "coding", "Private AI code assistant.", "https://tabnine.com", "Freemium", { rating: 4.5 }),
  t("cody", "Sourcegraph Cody", "coding", "Code AI with codebase context.", "https://sourcegraph.com/cody", "Freemium", { rating: 4.5 }),
  t("continue", "Continue", "coding", "Open-source AI code assistant.", "https://continue.dev", "Free", { rating: 4.6, openSource: true }),
  t("v0", "v0", "coding", "Vercel's AI UI generator.", "https://v0.dev", "Freemium", { rating: 4.8, badges: ["popular","trending"] }),
  t("replit-ai", "Replit AI", "coding", "AI in the Replit IDE.", "https://replit.com", "Freemium", { rating: 4.6 }),
  t("codewhisperer", "Amazon Q Developer", "coding", "AWS's AI coding assistant.", "https://aws.amazon.com/q/developer", "Freemium", { rating: 4.4 }),

  // Website / app builders
  t("lovable", "Lovable", "website", "Build production web apps with AI chat.", "https://lovable.dev", "Freemium", { rating: 4.9, badges: ["popular","editor","trending","verified"] }),
  t("bolt", "Bolt.new", "website", "AI web dev in your browser.", "https://bolt.new", "Freemium", { rating: 4.7, badges: ["trending"] }),
  t("v0-web", "v0 by Vercel", "website", "AI UI + full-stack builder.", "https://v0.dev", "Freemium", { rating: 4.7 }),
  t("framer-ai", "Framer AI", "website", "AI website builder & design.", "https://framer.com", "Freemium", { rating: 4.6, badges: ["popular"] }),
  t("wix-ai", "Wix ADI", "website", "AI-designed websites.", "https://wix.com", "Freemium", { rating: 4.4 }),
  t("dora", "Dora AI", "website", "3D animated AI websites.", "https://dora.run", "Freemium", { rating: 4.5 }),
  t("durable", "Durable", "website", "Build a website in 30s with AI.", "https://durable.co", "Freemium", { rating: 4.4 }),
  t("hostinger-ai", "Hostinger AI", "website", "AI website builder.", "https://hostinger.com", "Paid", { rating: 4.3 }),
  t("softr", "Softr AI", "app", "No-code apps with AI.", "https://softr.io", "Freemium", { rating: 4.4 }),
  t("bubble-ai", "Bubble AI", "app", "AI in Bubble no-code.", "https://bubble.io", "Freemium", { rating: 4.4 }),
  t("glide", "Glide AI", "app", "AI-powered no-code apps.", "https://glideapps.com", "Freemium", { rating: 4.4 }),
  t("adalo-ai", "Adalo AI", "app", "AI mobile app builder.", "https://adalo.com", "Freemium", { rating: 4.2 }),

  // UI/UX / Presentation / Design
  t("uizard", "Uizard", "uiux", "AI UI design from prompts.", "https://uizard.io", "Freemium", { rating: 4.5 }),
  t("galileo", "Galileo AI", "uiux", "Text to UI design.", "https://usegalileo.ai", "Freemium", { rating: 4.6, badges: ["trending"] }),
  t("visily", "Visily", "uiux", "AI wireframes & prototypes.", "https://visily.ai", "Freemium", { rating: 4.4 }),
  t("relume", "Relume", "uiux", "AI sitemaps & wireframes.", "https://relume.io", "Freemium", { rating: 4.6 }),
  t("magic-patterns", "Magic Patterns", "uiux", "AI UI generator.", "https://magicpatterns.com", "Freemium", { rating: 4.3 }),
  t("canva-ai", "Canva Magic Studio", "uiux", "AI design suite in Canva.", "https://canva.com", "Freemium", { rating: 4.7, badges: ["popular","verified"] }),
  t("gamma", "Gamma", "presentation", "AI-generated presentations & docs.", "https://gamma.app", "Freemium", { rating: 4.8, badges: ["popular","editor"] }),
  t("tome", "Tome", "presentation", "AI storytelling & decks.", "https://tome.app", "Freemium", { rating: 4.5 }),
  t("beautifulai", "Beautiful.ai", "presentation", "Smart AI slide design.", "https://beautiful.ai", "Paid", { rating: 4.5 }),
  t("slidesgo-ai", "Slidesgo AI", "presentation", "AI slide generator.", "https://slidesgo.com/ai-presentations", "Freemium", { rating: 4.4 }),
  t("decktopus", "Decktopus", "presentation", "AI presentation maker.", "https://decktopus.com", "Freemium", { rating: 4.4 }),

  // PDF / OCR / Doc
  t("chatpdf", "ChatPDF", "pdf", "Chat with any PDF document.", "https://chatpdf.com", "Freemium", { rating: 4.7, badges: ["popular"] }),
  t("askyourpdf", "AskYourPDF", "pdf", "AI chat for PDFs.", "https://askyourpdf.com", "Freemium", { rating: 4.5 }),
  t("pdfgear-ai", "PDFgear AI", "pdf", "Free AI PDF chat & edit.", "https://pdfgear.com", "Free", { rating: 4.4 }),
  t("smallpdf-ai", "Smallpdf AI", "pdf", "AI PDF tools suite.", "https://smallpdf.com/ai-pdf", "Freemium", { rating: 4.6 }),
  t("nanonets", "Nanonets", "ocr", "AI OCR & doc automation.", "https://nanonets.com", "Paid", { rating: 4.5, api: true }),
  t("mathpix", "Mathpix", "ocr", "OCR for math and science.", "https://mathpix.com", "Freemium", { rating: 4.6, api: true }),
  t("docsumo", "Docsumo", "document", "AI document extraction.", "https://docsumo.com", "Paid", { rating: 4.4, api: true }),
  t("mindee", "Mindee", "document", "Doc parsing APIs.", "https://mindee.com", "Freemium", { rating: 4.5, api: true }),
  t("rossum", "Rossum", "document", "AI-based document IDP.", "https://rossum.ai", "Paid", { rating: 4.4 }),

  // Resume / Spreadsheet
  t("kickresume", "Kickresume", "resume", "AI resume & cover letter builder.", "https://kickresume.com", "Freemium", { rating: 4.6, badges: ["popular"] }),
  t("rezi", "Rezi", "resume", "ATS-friendly AI resume.", "https://rezi.ai", "Freemium", { rating: 4.5 }),
  t("resumaker", "Resumaker AI", "resume", "AI resume in minutes.", "https://resumaker.ai", "Freemium", { rating: 4.3 }),
  t("teal-hq", "Teal", "resume", "Resume builder with AI.", "https://tealhq.com", "Freemium", { rating: 4.6 }),
  t("enhancv", "Enhancv", "resume", "AI-optimized resumes.", "https://enhancv.com", "Freemium", { rating: 4.5 }),
  t("gpt-excel", "GPTExcel", "spreadsheet", "AI formulas for spreadsheets.", "https://gptexcel.uk", "Freemium", { rating: 4.4 }),
  t("formula-bot", "Formula Bot", "spreadsheet", "AI Excel & Sheets assistant.", "https://formulabot.com", "Freemium", { rating: 4.5 }),
  t("rows-ai", "Rows AI", "spreadsheet", "AI-powered spreadsheet.", "https://rows.com", "Freemium", { rating: 4.5 }),
  t("bricks", "Bricks", "spreadsheet", "AI docs + spreadsheets in one.", "https://thebricks.com", "Freemium", { rating: 4.3 }),

  // Marketing / SEO / Social / Email
  t("hubspot-ai", "HubSpot AI", "marketing", "AI CRM & marketing.", "https://hubspot.com/ai", "Freemium", { rating: 4.6 }),
  t("mailchimp-ai", "Mailchimp AI", "email", "AI email marketing.", "https://mailchimp.com", "Freemium", { rating: 4.4 }),
  t("phrasee", "Phrasee", "marketing", "AI marketing language.", "https://phrasee.co", "Paid", { rating: 4.4 }),
  t("persado", "Persado", "marketing", "AI marketing generation.", "https://persado.com", "Paid", { rating: 4.3 }),
  t("adcreative", "AdCreative.ai", "marketing", "AI ad creatives.", "https://adcreative.ai", "Paid", { rating: 4.5 }),
  t("seowriting-ai", "SEO Writing AI", "seo", "AI SEO article writer.", "https://seowriting.ai", "Freemium", { rating: 4.5, badges: ["trending"] }),
  t("surfer-seo", "Surfer SEO", "seo", "SEO content optimization AI.", "https://surferseo.com", "Paid", { rating: 4.7 }),
  t("frase", "Frase", "seo", "AI SEO content briefs.", "https://frase.io", "Freemium", { rating: 4.5 }),
  t("neuronwriter", "NeuronWriter", "seo", "SERP-based content editor.", "https://neuronwriter.com", "Paid", { rating: 4.5 }),
  t("seorush", "Semrush AI", "seo", "SEO suite with AI tools.", "https://semrush.com", "Paid", { rating: 4.7 }),
  t("ahrefs-ai", "Ahrefs AI", "seo", "SEO tools with AI writer.", "https://ahrefs.com", "Paid", { rating: 4.7 }),
  t("buffer-ai", "Buffer AI", "social", "AI social content assistant.", "https://buffer.com/ai", "Freemium", { rating: 4.5 }),
  t("hootsuite-ai", "Hootsuite OwlyWriter", "social", "AI social content.", "https://hootsuite.com", "Paid", { rating: 4.4 }),
  t("predis", "Predis.ai", "social", "AI social posts & carousels.", "https://predis.ai", "Freemium", { rating: 4.4 }),
  t("later-ai", "Later AI", "social", "AI captions & scheduling.", "https://later.com", "Freemium", { rating: 4.3 }),
  t("copysmith", "Copysmith", "marketing", "AI copy for ecommerce.", "https://copysmith.ai", "Paid", { rating: 4.3 }),
  t("superhuman-ai", "Superhuman AI", "email", "AI email that's fast.", "https://superhuman.com", "Paid", { rating: 4.6 }),
  t("shortwave", "Shortwave", "email", "AI Gmail client.", "https://shortwave.com", "Freemium", { rating: 4.6 }),
  t("smartwriter", "SmartWriter", "email", "AI personalized cold emails.", "https://smartwriter.ai", "Paid", { rating: 4.3 }),
  t("lavender", "Lavender", "email", "AI email coach for sales.", "https://lavender.ai", "Paid", { rating: 4.4 }),

  // Finance / Health / Education
  t("finchat", "FinChat", "finance", "AI equity research chat.", "https://finchat.io", "Freemium", { rating: 4.5 }),
  t("kavout", "Kavout", "finance", "AI stock ratings.", "https://kavout.com", "Paid", { rating: 4.3 }),
  t("stockstory", "StockStory", "finance", "AI stock analysis.", "https://stockstory.org", "Freemium", { rating: 4.3 }),
  t("cleo", "Cleo", "finance", "AI personal finance assistant.", "https://meetcleo.com", "Freemium", { rating: 4.4, mobile: true }),
  t("ada-health", "Ada Health", "health", "AI symptom checker.", "https://ada.com", "Free", { rating: 4.5, mobile: true }),
  t("k-health", "K Health", "health", "AI-powered primary care.", "https://khealth.com", "Freemium", { rating: 4.4, mobile: true }),
  t("babylon", "Babylon Health", "health", "AI health services.", "https://babylonhealth.com", "Paid", { rating: 4.2 }),
  t("khanmigo", "Khanmigo", "education", "AI tutor by Khan Academy.", "https://khanmigo.ai", "Freemium", { rating: 4.7, badges: ["editor"] }),
  t("duolingo-max", "Duolingo Max", "education", "AI language tutor.", "https://duolingo.com", "Paid", { rating: 4.6, mobile: true }),
  t("quizlet-ai", "Quizlet AI", "education", "AI study tools.", "https://quizlet.com", "Freemium", { rating: 4.5, mobile: true }),
  t("socratic", "Socratic by Google", "education", "AI homework helper.", "https://socratic.org", "Free", { rating: 4.5, mobile: true }),
  t("quillionz", "Quillionz", "education", "AI question generator.", "https://quillionz.com", "Freemium", { rating: 4.2 }),
  t("mathgpt", "MathGPT", "education", "AI math problem solver.", "https://mathgpt.ai", "Freemium", { rating: 4.4 }),
  t("gauth", "Gauth", "education", "AI homework & math.", "https://gauthmath.com", "Freemium", { rating: 4.4, mobile: true }),

  // Translation
  t("deepl", "DeepL", "translation", "High-quality AI translator.", "https://deepl.com", "Freemium", { rating: 4.8, badges: ["popular","editor","verified"], api: true }),
  t("google-translate", "Google Translate", "translation", "Free AI translation.", "https://translate.google.com", "Free", { rating: 4.6 }),
  t("microsoft-translator", "Microsoft Translator", "translation", "AI translation from Microsoft.", "https://translator.microsoft.com", "Free", { rating: 4.5, api: true }),
  t("mymemory", "MyMemory", "translation", "Free translation memory API.", "https://mymemory.translated.net", "Free", { rating: 4.2, api: true }),
  t("linguee", "Linguee", "translation", "Contextual translation dictionary.", "https://linguee.com", "Free", { rating: 4.5 }),

  // Automation / Productivity / Business / Support
  t("zapier-ai", "Zapier AI", "automation", "AI-powered workflow automation.", "https://zapier.com/ai", "Freemium", { rating: 4.7, badges: ["popular"] }),
  t("make-ai", "Make AI", "automation", "Visual AI automation.", "https://make.com", "Freemium", { rating: 4.6 }),
  t("n8n", "n8n", "automation", "Open-source workflow automation.", "https://n8n.io", "Freemium", { rating: 4.7, openSource: true, badges: ["trending"] }),
  t("relay-app", "Relay.app", "automation", "AI human-in-the-loop workflows.", "https://relay.app", "Freemium", { rating: 4.5 }),
  t("bardeen", "Bardeen", "automation", "AI browser automation.", "https://bardeen.ai", "Freemium", { rating: 4.5 }),
  t("motion", "Motion", "productivity", "AI calendar & task manager.", "https://usemotion.com", "Paid", { rating: 4.6 }),
  t("reclaim", "Reclaim AI", "productivity", "AI time-blocking calendar.", "https://reclaim.ai", "Freemium", { rating: 4.5 }),
  t("clockwise", "Clockwise", "productivity", "AI schedule optimizer.", "https://getclockwise.com", "Freemium", { rating: 4.4 }),
  t("mem-ai", "Mem", "productivity", "AI notes & knowledge.", "https://mem.ai", "Freemium", { rating: 4.5 }),
  t("mymind", "Mymind", "productivity", "AI second brain.", "https://mymind.com", "Paid", { rating: 4.4 }),
  t("saner-ai", "Saner AI", "productivity", "AI life organizer.", "https://saner.ai", "Freemium", { rating: 4.2 }),
  t("taskade", "Taskade AI", "productivity", "AI outliner & task tool.", "https://taskade.com", "Freemium", { rating: 4.5 }),
  t("clickup-ai", "ClickUp AI", "productivity", "AI project management.", "https://clickup.com/ai", "Paid", { rating: 4.6 }),
  t("asana-ai", "Asana AI", "productivity", "AI in Asana.", "https://asana.com", "Paid", { rating: 4.5 }),
  t("monday-ai", "monday AI", "business", "AI in monday.com.", "https://monday.com/ai", "Paid", { rating: 4.5 }),
  t("salesforce-einstein", "Salesforce Einstein", "business", "CRM AI copilot.", "https://salesforce.com/einstein", "Paid", { rating: 4.5 }),
  t("intercom-fin", "Fin by Intercom", "support", "AI customer support agent.", "https://intercom.com/fin", "Paid", { rating: 4.6 }),
  t("zendesk-ai", "Zendesk AI", "support", "AI in Zendesk.", "https://zendesk.com/ai", "Paid", { rating: 4.5 }),
  t("ada-support", "Ada", "support", "AI customer service platform.", "https://ada.cx", "Paid", { rating: 4.5 }),
  t("tidio-lyro", "Tidio Lyro", "support", "AI chatbot for SMBs.", "https://tidio.com/lyro", "Freemium", { rating: 4.5 }),
  t("chatbase", "Chatbase", "support", "AI chatbot from your docs.", "https://chatbase.co", "Freemium", { rating: 4.6 }),
  t("crisp-ai", "Crisp AI", "support", "AI helpdesk with MagicReply.", "https://crisp.chat", "Freemium", { rating: 4.4 }),

  // Extra long-tail (fill to 200+)
  t("perplexity-labs", "Perplexity Labs", "research", "Multi-step research reports.", "https://perplexity.ai/labs", "Freemium", { rating: 4.6, badges: ["trending"] }),
  t("napkin", "Napkin AI", "presentation", "Turn text into visuals instantly.", "https://napkin.ai", "Freemium", { rating: 4.6, badges: ["trending"] }),
  t("napster", "NotebookLM", "research", "Google's grounded research notebook.", "https://notebooklm.google", "Free", { rating: 4.8, badges: ["editor","popular"] }),
  t("granola", "Granola", "productivity", "AI meeting notepad.", "https://granola.ai", "Freemium", { rating: 4.6 }),
  t("tldv", "tl;dv", "productivity", "AI meeting recorder.", "https://tldv.io", "Freemium", { rating: 4.4 }),
  t("supernormal", "Supernormal", "productivity", "AI meeting notes.", "https://supernormal.com", "Freemium", { rating: 4.4 }),
  t("read-ai", "Read AI", "productivity", "Meeting summaries & insights.", "https://read.ai", "Freemium", { rating: 4.4 }),
  t("scribe", "Scribe", "productivity", "AI step-by-step guides.", "https://scribehow.com", "Freemium", { rating: 4.6 }),
  t("guidde", "Guidde", "productivity", "AI video documentation.", "https://guidde.com", "Freemium", { rating: 4.4 }),
  t("mermaid-chart", "Mermaid Chart AI", "productivity", "AI diagrams from text.", "https://mermaidchart.com", "Freemium", { rating: 4.5 }),
  t("whimsical-ai", "Whimsical AI", "productivity", "AI flowcharts & mind maps.", "https://whimsical.com/ai", "Freemium", { rating: 4.5 }),
  t("miro-ai", "Miro AI", "productivity", "AI whiteboard tools.", "https://miro.com/ai", "Freemium", { rating: 4.5 }),
  t("mural-ai", "Mural AI", "productivity", "AI collaboration canvas.", "https://mural.co", "Freemium", { rating: 4.3 }),
  t("perplexity-comet", "Perplexity Comet", "productivity", "Agentic AI browser.", "https://perplexity.ai/comet", "Paid", { rating: 4.5, badges: ["trending"] }),
  t("arc-max", "Arc Max", "productivity", "AI features in Arc browser.", "https://arc.net/max", "Free", { rating: 4.5 }),
  t("dia-browser", "Dia Browser", "productivity", "AI-first browser by Browser Company.", "https://diabrowser.com", "Free", { rating: 4.4, badges: ["new"] }),
  t("goblin-tools", "Goblin Tools", "productivity", "Small AI tools for neurodivergent folks.", "https://goblin.tools", "Free", { rating: 4.6 }),
  t("magai", "Magai", "chatbots", "All-in-one AI workspace.", "https://magai.co", "Paid", { rating: 4.4 }),
  t("chatllm", "ChatLLM", "chatbots", "Abacus's multi-model AI.", "https://chatllm.abacus.ai", "Paid", { rating: 4.5 }),
  t("liner", "Liner", "search", "AI-powered browsing assistant.", "https://liner.com", "Freemium", { rating: 4.4 }),
  t("waldo", "Waldo", "search", "Chat search for professionals.", "https://waldo.fyi", "Freemium", { rating: 4.3 }),
  t("exa", "Exa AI", "search", "Neural search API for LLMs.", "https://exa.ai", "Freemium", { rating: 4.5, api: true }),
  t("tavily", "Tavily", "search", "AI search API for agents.", "https://tavily.com", "Freemium", { rating: 4.5, api: true }),
  t("firecrawl", "Firecrawl", "search", "AI web crawling for LLMs.", "https://firecrawl.dev", "Freemium", { rating: 4.6, api: true, badges: ["trending"] }),
  t("browse-ai", "Browse AI", "automation", "AI web scraping bots.", "https://browse.ai", "Freemium", { rating: 4.5 }),
  t("apify", "Apify AI", "automation", "Web scraping + AI.", "https://apify.com", "Freemium", { rating: 4.6, api: true }),
  t("openai-agents", "OpenAI Agents", "automation", "Build multi-step AI agents.", "https://platform.openai.com", "Paid", { rating: 4.6, api: true }),
  t("crewai", "CrewAI", "automation", "Multi-agent orchestration.", "https://crewai.com", "Free", { rating: 4.6, openSource: true }),
  t("autogen", "AutoGen", "automation", "Microsoft's agent framework.", "https://microsoft.github.io/autogen", "Free", { rating: 4.5, openSource: true }),
  t("langchain", "LangChain", "automation", "Framework for LLM apps.", "https://langchain.com", "Freemium", { rating: 4.5, openSource: true, api: true }),
  t("llamaindex", "LlamaIndex", "automation", "Data framework for LLMs.", "https://llamaindex.ai", "Free", { rating: 4.5, openSource: true }),
  t("ollama", "Ollama", "chatbots", "Run open-source LLMs locally.", "https://ollama.com", "Free", { rating: 4.8, openSource: true, badges: ["editor","trending"] }),
  t("lm-studio", "LM Studio", "chatbots", "Desktop app for local LLMs.", "https://lmstudio.ai", "Free", { rating: 4.7 }),
  t("openrouter", "OpenRouter", "chatbots", "Unified LLM API gateway.", "https://openrouter.ai", "Freemium", { rating: 4.7, api: true }),
  t("groq", "Groq", "chatbots", "Ultra-fast LLM inference.", "https://groq.com", "Freemium", { rating: 4.7, api: true, badges: ["trending"] }),
  t("together-ai", "Together AI", "chatbots", "Fast open-source AI cloud.", "https://together.ai", "Freemium", { rating: 4.5, api: true }),
  t("fireworks-ai", "Fireworks AI", "chatbots", "Fast LLM inference cloud.", "https://fireworks.ai", "Freemium", { rating: 4.4, api: true }),
  t("anthropic-api", "Anthropic API", "chatbots", "Claude API for developers.", "https://anthropic.com/api", "Paid", { rating: 4.7, api: true }),
  t("google-ai-studio", "Google AI Studio", "chatbots", "Prototype with Gemini APIs.", "https://aistudio.google.com", "Freemium", { rating: 4.6, api: true }),
  t("azure-openai", "Azure OpenAI", "chatbots", "OpenAI models on Azure.", "https://azure.microsoft.com/products/ai-services/openai-service", "Paid", { rating: 4.5, api: true }),
  t("aws-bedrock", "AWS Bedrock", "chatbots", "Managed FM APIs on AWS.", "https://aws.amazon.com/bedrock", "Paid", { rating: 4.4, api: true }),
  t("cohere", "Cohere", "chatbots", "Enterprise LLMs and RAG.", "https://cohere.com", "Freemium", { rating: 4.5, api: true }),
  t("mistral-api", "Mistral API", "chatbots", "Fast open-weight LLM APIs.", "https://mistral.ai", "Freemium", { rating: 4.6, api: true }),
  t("replicate", "Replicate", "chatbots", "Run ML models via API.", "https://replicate.com", "Freemium", { rating: 4.5, api: true }),
  t("huggingface", "Hugging Face", "chatbots", "Home for ML models.", "https://huggingface.co", "Freemium", { rating: 4.8, openSource: true, badges: ["editor","verified"] }),
  t("modal", "Modal", "coding", "Serverless GPU cloud for AI.", "https://modal.com", "Freemium", { rating: 4.6, api: true }),
  t("brainbase", "Brainbase", "automation", "Autonomous AI workers.", "https://usebrainbase.com", "Paid", { rating: 4.3 }),
  t("gumloop", "Gumloop", "automation", "No-code AI workflows.", "https://gumloop.com", "Freemium", { rating: 4.5, badges: ["trending"] }),
  t("wordware", "Wordware", "coding", "Build LLM apps with prompts.", "https://wordware.ai", "Freemium", { rating: 4.4 }),
  t("dust", "Dust", "business", "AI assistants for teams.", "https://dust.tt", "Freemium", { rating: 4.5 }),
  t("glean", "Glean", "business", "Enterprise AI search & assistant.", "https://glean.com", "Paid", { rating: 4.6 }),
  t("mendable", "Mendable", "support", "AI chat for docs.", "https://mendable.ai", "Freemium", { rating: 4.4 }),
  t("intercom-ai", "Intercom AI", "support", "AI messaging for customers.", "https://intercom.com", "Paid", { rating: 4.5 }),
  t("gorgias-ai", "Gorgias AI", "support", "Helpdesk AI for e-commerce.", "https://gorgias.com", "Paid", { rating: 4.4 }),
  t("front-ai", "Front AI", "support", "AI-powered customer ops.", "https://front.com", "Paid", { rating: 4.4 }),
  t("perplexity-finance", "Perplexity Finance", "finance", "AI finance-focused answers.", "https://perplexity.ai/finance", "Freemium", { rating: 4.5, badges: ["new"] }),
  t("mercury-ai", "Mercury AI", "finance", "AI in Mercury banking.", "https://mercury.com", "Freemium", { rating: 4.3 }),
  t("brex-ai", "Brex AI", "finance", "AI in Brex expense platform.", "https://brex.com", "Paid", { rating: 4.4 }),
  t("levity", "Levity", "automation", "AI workflow classifier.", "https://levity.ai", "Paid", { rating: 4.3 }),
  t("beam-ai", "Beam AI", "automation", "AI agents for operations.", "https://beam.ai", "Paid", { rating: 4.3 }),
  t("mindmeister-ai", "MindMeister AI", "productivity", "AI mind mapping.", "https://mindmeister.com", "Freemium", { rating: 4.3 }),
  t("xmind-ai", "Xmind AI", "productivity", "AI mind maps.", "https://xmind.ai", "Freemium", { rating: 4.4 }),
  t("chatpdf-io", "PDF.ai", "pdf", "Chat and edit PDFs with AI.", "https://pdf.ai", "Freemium", { rating: 4.5 }),
  t("uibakery", "UI Bakery AI", "app", "Internal tool builder AI.", "https://uibakery.io", "Freemium", { rating: 4.3 }),
  t("retool-ai", "Retool AI", "app", "AI in Retool internal tools.", "https://retool.com/ai", "Paid", { rating: 4.5 }),
  t("suno-fm", "Suno FM", "music", "AI radio station.", "https://suno.com", "Free", { rating: 4.4, badges: ["new"] }),
  t("hedra", "Hedra", "avatar", "Character animation from photos.", "https://hedra.com", "Freemium", { rating: 4.6, badges: ["trending"] }),
  t("captions", "Captions AI", "video-edit", "AI creator studio.", "https://captions.ai", "Freemium", { rating: 4.6, mobile: true }),
  t("submagic", "Submagic", "video-edit", "AI captions & short-form editing.", "https://submagic.co", "Freemium", { rating: 4.7, badges: ["trending"] }),
  t("vidyo-ai", "Vidyo.ai", "video-edit", "Long to short video AI.", "https://vidyo.ai", "Freemium", { rating: 4.4 }),
  t("2short-ai", "2short.ai", "video-edit", "AI shorts creator.", "https://2short.ai", "Freemium", { rating: 4.3 }),
  t("upliftai", "Uplift AI", "voice", "Multilingual voice AI.", "https://upliftai.org", "Freemium", { rating: 4.3 }),
  t("cartesia", "Cartesia", "voice", "Real-time voice AI.", "https://cartesia.ai", "Freemium", { rating: 4.6, api: true, badges: ["trending"] }),
  t("vapi", "Vapi", "voice", "Voice AI agents.", "https://vapi.ai", "Freemium", { rating: 4.5, api: true }),
  t("retell", "Retell AI", "voice", "Build voice agents.", "https://retellai.com", "Freemium", { rating: 4.5, api: true }),
  t("bland", "Bland AI", "voice", "AI phone calling.", "https://bland.ai", "Paid", { rating: 4.4 }),
  t("mystic-ai", "Mystic", "image-gen", "AI portrait generator.", "https://mystic.ai", "Freemium", { rating: 4.3 }),
  t("photoai", "Photo AI", "image-gen", "Personal AI photographer.", "https://photoai.com", "Paid", { rating: 4.5 }),
  t("headshot-pro", "HeadshotPro", "image-gen", "AI professional headshots.", "https://headshotpro.com", "Paid", { rating: 4.6 }),
  t("aragon", "Aragon AI", "image-gen", "AI headshots studio.", "https://aragon.ai", "Paid", { rating: 4.6 }),
  t("secta", "Secta Labs", "image-gen", "AI headshots.", "https://secta.ai", "Paid", { rating: 4.5 }),
  t("astria", "Astria", "image-gen", "AI fine-tuning platform.", "https://astria.ai", "Paid", { rating: 4.3 }),
  t("stability-api", "Stability API", "image-gen", "Stable Diffusion API.", "https://platform.stability.ai", "Paid", { rating: 4.4, api: true }),
];

// Prompts library
export interface AIPrompt {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  model: string; // ChatGPT, Claude, Midjourney...
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
}

const p = (slug: string, title: string, description: string, prompt: string, category: string, model = "ChatGPT", difficulty: AIPrompt["difficulty"] = "Beginner", tags: string[] = []): AIPrompt => ({ slug, title, description, prompt, category, model, difficulty, tags });

export const PROMPT_CATEGORIES = ["SEO","Marketing","Business","Coding","Programming","Website","UI Design","Writing","Blogging","YouTube","Social Media","Email","Excel","Research","Resume","Interview","Education","Image Generation","Video Generation"];

export const AI_MODELS = ["ChatGPT","Claude","Gemini","Grok","DeepSeek","Midjourney","Leonardo AI","Flux AI","Runway","Kling","Canva AI","Gamma","Cursor","Lovable","Bolt","Replit AI"];

export const AI_PROMPTS: AIPrompt[] = [
  p("seo-blog-outline","SEO Blog Outline","Create a detailed SEO outline for a blog post.","You are an expert SEO strategist. Generate a full SEO outline for a blog post on [TOPIC]: include primary keyword, 5 secondary keywords, meta title (<60 chars), meta description (<160 chars), 8 H2 sections with 2 H3s each, FAQs (6), internal link suggestions, and a compelling intro (120 words).","SEO","ChatGPT","Intermediate",["seo","blog","outline"]),
  p("seo-cluster","SEO Topic Cluster Plan","Generate a topic cluster plan.","Act as a senior SEO. Design a topic cluster around the pillar page [TOPIC]. Provide 1 pillar page (with H1, meta), 10 cluster posts (title, target keyword, search intent), and internal-linking map.","SEO","ChatGPT","Advanced",["cluster","seo"]),
  p("meta-description","Meta Description Writer","Generate meta descriptions.","Write 5 SEO-optimized meta descriptions (<155 chars) for a page about [TOPIC]. Include the primary keyword naturally and a clear CTA.","SEO","ChatGPT","Beginner",["meta","seo"]),
  p("ad-copy","Facebook Ad Copy","Generate high-converting FB ads.","Write 5 Facebook ad copies for [PRODUCT]. Each: hook (<10 words), 2-sentence body, CTA. Target audience: [AUDIENCE]. Emphasize benefits over features.","Marketing","ChatGPT","Beginner",["ads","facebook"]),
  p("email-sequence","Cold Email Sequence","4-step cold email sequence.","Design a 4-email cold sequence for [OFFER] targeting [ICP]. Each email <120 words, one CTA, personalized angle, and a clear P.S.","Email","ChatGPT","Intermediate",["cold","email"]),
  p("newsletter","Newsletter Draft","Weekly newsletter template.","Draft a weekly newsletter for [NICHE]. Include: subject line (3 variants), intro hook, 3 curated links with 1-line takeaways, main story (200 words), CTA.","Email","ChatGPT","Beginner",["newsletter"]),
  p("business-plan","One-Page Business Plan","Create a one-pager.","Create a one-page business plan for [IDEA] covering problem, solution, market, business model, GTM, competition, moat, financials Y1, and 30-day next steps.","Business","ChatGPT","Advanced",["plan","business"]),
  p("swot","SWOT Analysis","Generate a SWOT.","Perform a SWOT analysis for [COMPANY/IDEA] in [MARKET]. 4 items per quadrant. Add a paragraph on the top strategic priority.","Business","ChatGPT","Intermediate",["swot"]),
  p("code-review","Code Review","Detailed code review.","You are a senior engineer. Review this code for correctness, edge cases, security, and readability. Provide file-level and line-level comments. Suggest concrete refactors.\n\nCODE:\n[PASTE]","Coding","Claude","Advanced",["review","code"]),
  p("unit-tests","Unit Test Generator","Generate unit tests.","Generate comprehensive unit tests for the following code using [FRAMEWORK]. Cover happy path + edge cases + error paths.\n\nCODE:\n[PASTE]","Coding","Cursor","Intermediate",["testing"]),
  p("regex","Regex Builder","Build a regex.","Build a regex that matches [DESCRIPTION]. Include: pattern, explanation of each group, and 5 positive + 5 negative example inputs.","Programming","ChatGPT","Beginner",["regex"]),
  p("landing-page","Landing Page Copy","Full landing page copy.","Write a landing page for [PRODUCT] targeting [ICP]. Sections: hero (headline + subheadline + CTA), 3 value props, social proof block, features (5), pricing, FAQ (6), final CTA.","Website","ChatGPT","Intermediate",["landing"]),
  p("component-brief","UI Component Brief","Describe a UI component.","Describe a [COMPONENT] design: purpose, states (default/hover/focus/disabled/loading/error), accessibility requirements, tokens (spacing, color roles), and an example story.","UI Design","Claude","Intermediate",["ui"]),
  p("blog-post","Long-form Blog Post","Write a 1500-word blog.","Write a 1500-word blog post on [TOPIC]. Tone: [TONE]. Include intro hook, 5 H2 sections with H3s, examples, statistics, a table, and a conclusion with CTA. Optimize for keyword [KEYWORD].","Blogging","ChatGPT","Intermediate",["blog"]),
  p("yt-script","YouTube Script","10-minute video script.","Write a YouTube video script (~10 min) on [TOPIC]. Include: hook (10s), title options (5), thumbnail idea, chapter timestamps, B-roll suggestions, CTA, and outro.","YouTube","ChatGPT","Intermediate",["youtube","script"]),
  p("yt-title","YouTube Title & Thumbnail","10 clickable titles & thumbnails.","Generate 10 clickable YouTube titles for a video about [TOPIC] and describe a matching thumbnail idea for each (subject + text overlay + emotion).","YouTube","ChatGPT","Beginner",["youtube","title"]),
  p("tweet-thread","Twitter/X Thread","Write a 10-tweet thread.","Write a 10-tweet Twitter/X thread on [TOPIC]. Tweet 1 is a hook (<240 chars). Each tweet stands alone. Final tweet is a soft CTA.","Social Media","ChatGPT","Beginner",["twitter"]),
  p("linkedin-post","LinkedIn Thought Leadership","Write a LinkedIn post.","Write a 250-word LinkedIn post about [INSIGHT]. Start with a bold statement, use short paragraphs, include a story, end with a question.","Social Media","ChatGPT","Beginner",["linkedin"]),
  p("ig-carousel","Instagram Carousel","10-slide carousel.","Design a 10-slide Instagram carousel for [TOPIC]. Provide slide headline + 2-line body for each, plus caption and 20 hashtags.","Social Media","ChatGPT","Beginner",["instagram"]),
  p("excel-formula","Excel Formula","Generate an Excel formula.","Give me an Excel formula that [DESCRIBE]. Explain how it works step-by-step and provide a sample table showing inputs and outputs.","Excel","ChatGPT","Beginner",["excel"]),
  p("pivot","Excel Pivot Guide","Explain a pivot analysis.","Explain how to build a pivot table in Excel to [ANALYZE]. Provide step-by-step instructions and an example dataset.","Excel","ChatGPT","Beginner",["excel"]),
  p("research-summary","Research Summary","Summarize a research paper.","Summarize this research paper into: 1-sentence takeaway, key findings (bullets), methodology, limitations, and future directions.\n\nPAPER:\n[PASTE]","Research","Claude","Intermediate",["research"]),
  p("resume-bullet","Resume Bullets","Convert experience to STAR bullets.","Convert this experience into 5 STAR-format resume bullets with strong action verbs and quantified outcomes.\n\nEXPERIENCE:\n[PASTE]","Resume","ChatGPT","Beginner",["resume"]),
  p("interview-prep","Interview Prep","Interview question set.","Generate 10 interview questions for a [ROLE] role at [COMPANY]. Include behavioral, technical, and case-style. Provide model answers using STAR.","Interview","ChatGPT","Intermediate",["interview"]),
  p("lesson-plan","Lesson Plan","Create a lesson plan.","Create a 60-minute lesson plan for [TOPIC], grade level [GRADE]. Include learning objectives, warm-up, main activity, assessment, homework, and materials.","Education","ChatGPT","Intermediate",["teaching"]),
  p("mj-cinematic","Cinematic Photo","Midjourney cinematic photo.","cinematic still of [SUBJECT], [ENVIRONMENT], shot on ARRI Alexa, 35mm anamorphic lens, shallow depth of field, dramatic rim light, moody color grading --ar 16:9 --style raw --v 7","Image Generation","Midjourney","Intermediate",["photo"]),
  p("mj-logo","Logo Concept","Midjourney logo concept.","minimalist vector logo for [BRAND], flat design, geometric, two-color palette, high contrast, symbolic mark, no text --style raw --v 7 --ar 1:1","Image Generation","Midjourney","Beginner",["logo"]),
  p("runway-cinematic","Cinematic Video","Runway text-to-video.","A slow dolly-in shot of [SUBJECT], golden hour lighting, cinematic color grade, 24fps, soft rack focus.","Video Generation","Runway","Intermediate",["cinematic"]),
];

// Tutorials
export interface AITutorial { slug: string; title: string; description: string; level: string; readMins: number; category: string; body: string; }
export const AI_TUTORIALS: AITutorial[] = [
  { slug:"what-is-ai", title:"What is AI?", description:"A friendly primer on modern AI.", level:"Beginner", readMins:6, category:"Basics", body:"Artificial Intelligence is the field of building systems that perform tasks requiring human intelligence. Modern AI is dominated by machine learning — models trained on large datasets to recognize patterns and generate content. Key ideas: model, dataset, training, inference, tokens, and prompts." },
  { slug:"how-chatgpt-works", title:"How ChatGPT Works", description:"Under the hood of the world's most popular chatbot.", level:"Beginner", readMins:8, category:"LLMs", body:"ChatGPT is powered by large language models (LLMs). During training the model learns statistical patterns across huge text corpora. During inference, it predicts the next token given the conversation. Techniques like RLHF and system prompts guide behavior. Context window, temperature, and top-p control creativity and memory." },
  { slug:"prompt-engineering", title:"Prompt Engineering Fundamentals", description:"Get better output from any AI.", level:"Intermediate", readMins:9, category:"Prompts", body:"A great prompt sets role, task, constraints, format, and examples. Use step-by-step reasoning for hard tasks, and ask for JSON when integrating with code. Iterate: measure outputs, tweak instructions, add few-shot examples." },
  { slug:"ai-image-gen", title:"AI Image Generation 101", description:"Create stunning images from text prompts.", level:"Beginner", readMins:7, category:"Images", body:"Text-to-image models turn prompts into pictures. Prompts have subject, style, composition, lighting, and lens details. Use negative prompts to remove artifacts and parameters like aspect ratio and seed to control output." },
  { slug:"ai-video-gen", title:"AI Video Generation Guide", description:"From text prompts to short films.", level:"Intermediate", readMins:8, category:"Video", body:"Video models create clips from text or images. Great prompts describe subject, camera motion, and lighting. Combine image-to-video for consistent characters, edit clips together, and add AI voiceover + music." },
  { slug:"ai-coding", title:"AI for Coding", description:"Ship faster with an AI pair programmer.", level:"Intermediate", readMins:8, category:"Coding", body:"AI coding tools like Cursor, Copilot and Claude turn intent into code. Use them for scaffolding, tests, refactors, docs, and reviews. Always review generated code and add tests. Keep prompts specific and provide project context." },
  { slug:"ai-for-students", title:"AI for Students", description:"Study smarter with AI.", level:"Beginner", readMins:6, category:"Education", body:"Use AI to explain concepts, generate quizzes, summarize readings, and practice interviews. Verify facts with citations from tools like Perplexity and NotebookLM. Don't outsource thinking — use AI as a tutor." },
  { slug:"ai-for-teachers", title:"AI for Teachers", description:"Save hours planning lessons.", level:"Beginner", readMins:6, category:"Education", body:"Teachers can automate rubric creation, lesson plans, worksheets, quizzes, and parent updates. Personalize instruction with adaptive tools and use AI to translate materials." },
  { slug:"ai-for-devs", title:"AI for Developers", description:"Build AI features that ship.", level:"Advanced", readMins:10, category:"Developers", body:"Learn about tokens, context windows, embeddings, RAG, tool calling and evaluation. Pick a model gateway (OpenRouter, Lovable AI). Build with the AI SDK. Add rate limits, cost caps, and observability." },
  { slug:"ai-for-business", title:"AI for Business", description:"Where AI moves the needle.", level:"Intermediate", readMins:8, category:"Business", body:"High-impact AI use cases: customer support automation, sales research, marketing content, personalized outreach, and internal knowledge search. Start with a narrow workflow that saves hours per week." },
  { slug:"ai-automation", title:"AI Automation", description:"Design end-to-end AI workflows.", level:"Advanced", readMins:9, category:"Automation", body:"Combine triggers, LLM steps, tool calls, and human review. Tools like n8n, Make, and Zapier make it accessible. Instrument logs and metrics to iterate quickly." },
];

// Comparisons
export interface AIComparison { slug: string; a: string; b: string; verdict: string; sections: { title: string; a: string; b: string }[]; }
export const AI_COMPARISONS: AIComparison[] = [
  { slug: "chatgpt-vs-claude", a: "ChatGPT", b: "Claude", verdict: "Pick ChatGPT for breadth of features, Claude for long-context writing.", sections: [
    { title: "Overview", a: "OpenAI's flagship assistant with wide ecosystem.", b: "Anthropic's safety-focused model with 200K context." },
    { title: "Speed", a: "Fast on GPT-5 with edge deployments.", b: "Very fast on Sonnet, deliberate on Opus." },
    { title: "Accuracy", a: "Excellent across most tasks.", b: "Best-in-class for long-form writing and reasoning." },
    { title: "Ease of Use", a: "Polished UI, plugins, GPTs, voice.", b: "Clean UI, Projects, Artifacts." },
    { title: "Pricing", a: "Free tier + Plus $20/mo.", b: "Free tier + Pro $20/mo." },
    { title: "Free Plan", a: "Generous with limits.", b: "Generous with limits." },
    { title: "Use Cases", a: "General assistant, coding, image gen.", b: "Long docs, analysis, careful writing." },
    { title: "Pros", a: "Ecosystem, memory, GPTs.", b: "Long context, careful tone." },
    { title: "Cons", a: "Rate limits.", b: "Fewer integrations." },
  ]},
  { slug: "chatgpt-vs-gemini", a: "ChatGPT", b: "Gemini", verdict: "ChatGPT wins on ecosystem; Gemini wins on Google integration and pricing.", sections: [
    { title: "Overview", a: "General assistant.", b: "Google's multimodal AI." },
    { title: "Speed", a: "Fast.", b: "Very fast for Flash." },
    { title: "Accuracy", a: "Excellent.", b: "Excellent, esp. multimodal." },
    { title: "Ease of Use", a: "Best-in-class UI.", b: "Integrated with Google apps." },
    { title: "Pricing", a: "$20/mo Plus.", b: "$20/mo Advanced." },
    { title: "Free Plan", a: "Yes.", b: "Yes." },
    { title: "Use Cases", a: "Broad.", b: "Search, docs, images." },
    { title: "Pros", a: "Ecosystem.", b: "Google apps, image gen." },
    { title: "Cons", a: "Cost.", b: "Fewer 3rd-party tools." },
  ]},
  { slug: "claude-vs-gemini", a: "Claude", b: "Gemini", verdict: "Claude for writing; Gemini for multimodal + Google.", sections: [
    { title: "Overview", a: "Anthropic assistant.", b: "Google assistant." },
    { title: "Speed", a: "Fast.", b: "Very fast." },
    { title: "Accuracy", a: "Great for docs.", b: "Great for search + vision." },
    { title: "Ease of Use", a: "Clean.", b: "Google-integrated." },
    { title: "Pricing", a: "$20/mo Pro.", b: "$20/mo Advanced." },
    { title: "Free Plan", a: "Yes.", b: "Yes." },
    { title: "Use Cases", a: "Writing, analysis.", b: "Search, images, YouTube." },
    { title: "Pros", a: "Long context.", b: "Multimodal." },
    { title: "Cons", a: "Fewer integrations.", b: "Sometimes over-cautious." },
  ]},
  { slug: "grok-vs-chatgpt", a: "Grok", b: "ChatGPT", verdict: "Grok for real-time X + edgy tone; ChatGPT for reliability.", sections: [
    { title: "Overview", a: "xAI's assistant.", b: "OpenAI's assistant." },
    { title: "Speed", a: "Very fast.", b: "Fast." },
    { title: "Accuracy", a: "Good.", b: "Excellent." },
    { title: "Ease of Use", a: "Simple, X-native.", b: "Best-in-class." },
    { title: "Pricing", a: "X Premium.", b: "$20/mo." },
    { title: "Free Plan", a: "Limited.", b: "Yes." },
    { title: "Use Cases", a: "Realtime news, X.", b: "General." },
    { title: "Pros", a: "Realtime X data.", b: "Ecosystem, memory." },
    { title: "Cons", a: "Less polished.", b: "Cost." },
  ]},
  { slug: "cursor-vs-copilot", a: "Cursor", b: "GitHub Copilot", verdict: "Cursor for agentic edits; Copilot for tight GitHub integration.", sections: [
    { title: "Overview", a: "AI-first IDE.", b: "AI in your existing editor." },
    { title: "Speed", a: "Fast.", b: "Fast." },
    { title: "Accuracy", a: "Excellent for multi-file edits.", b: "Great for inline completions." },
    { title: "Ease of Use", a: "VSCode fork.", b: "Extension." },
    { title: "Pricing", a: "$20/mo.", b: "$10/mo." },
    { title: "Free Plan", a: "Yes.", b: "Free for OSS/students." },
    { title: "Use Cases", a: "Refactors, agents.", b: "Autocomplete." },
    { title: "Pros", a: "Agent mode.", b: "GitHub-native." },
    { title: "Cons", a: "Separate editor.", b: "Less agentic." },
  ]},
  { slug: "runway-vs-kling", a: "Runway", b: "Kling", verdict: "Runway for editor + control; Kling for photorealism.", sections: [
    { title: "Overview", a: "Creative video AI suite.", b: "Photoreal text-to-video." },
    { title: "Speed", a: "Fast.", b: "Medium." },
    { title: "Accuracy", a: "High.", b: "Very high realism." },
    { title: "Ease of Use", a: "Pro editor.", b: "Simple web UI." },
    { title: "Pricing", a: "Paid tiers.", b: "Freemium." },
    { title: "Free Plan", a: "Limited.", b: "Yes." },
    { title: "Use Cases", a: "Filmmaking, ads.", b: "Realistic clips." },
    { title: "Pros", a: "Full editing suite.", b: "Realism." },
    { title: "Cons", a: "Cost.", b: "Fewer editing tools." },
  ]},
  { slug: "midjourney-vs-leonardo", a: "Midjourney", b: "Leonardo AI", verdict: "Midjourney for artistry; Leonardo for control + game art.", sections: [
    { title: "Overview", a: "Premium AI art.", b: "Creator platform for game/art." },
    { title: "Speed", a: "Fast.", b: "Fast." },
    { title: "Accuracy", a: "Beautiful defaults.", b: "Flexible control." },
    { title: "Ease of Use", a: "Discord + Web.", b: "Web app." },
    { title: "Pricing", a: "$10-60/mo.", b: "Free + paid." },
    { title: "Free Plan", a: "No.", b: "Yes." },
    { title: "Use Cases", a: "Concept art.", b: "Game assets, marketing." },
    { title: "Pros", a: "Style.", b: "Control + free tier." },
    { title: "Cons", a: "Less control.", b: "Less artistic feel." },
  ]},
];

// Collections
export interface AICollection { slug: string; title: string; description: string; toolSlugs: string[]; }
export const AI_COLLECTIONS: AICollection[] = [
  { slug: "best-free", title: "Best Free AI Tools", description: "Great AI with meaningful free plans.", toolSlugs: ["chatgpt","claude","gemini","deepseek","meta-ai","perplexity","huggingface","ollama","canva-ai","suno","runway","krea","notion-ai","google-translate","deepl"] },
  { slug: "best-coding", title: "Best AI for Coding", description: "Ship faster with these AI coding tools.", toolSlugs: ["cursor","github-copilot","windsurf","lovable","bolt","v0","cline","aider","codeium","tabnine","continue","replit-ai"] },
  { slug: "best-students", title: "Best AI for Students", description: "Study smarter with AI.", toolSlugs: ["chatgpt","napster","claude","perplexity","khanmigo","quizlet-ai","mathgpt","socratic","gauth","grammarly","deepl"] },
  { slug: "best-seo", title: "Best AI for SEO", description: "AI SEO tools that move the needle.", toolSlugs: ["surfer-seo","frase","seowriting-ai","neuronwriter","seorush","ahrefs-ai","perplexity"] },
  { slug: "best-youtube", title: "Best AI for YouTube", description: "Create better YouTube content.", toolSlugs: ["opus-clip","submagic","descript","captions","invideo-ai","fliki","runway","elevenlabs","chatgpt"] },
  { slug: "best-business", title: "Best AI for Business", description: "AI that runs your ops.", toolSlugs: ["gamma","notion-ai","zapier-ai","clickup-ai","glean","dust","hubspot-ai","intercom-fin","otter"] },
  { slug: "best-research", title: "Best AI for Research", description: "Trusted research assistants.", toolSlugs: ["napster","consensus","elicit","scispace","perplexity","perplexity-labs","undermind"] },
  { slug: "best-image", title: "Best AI for Image Generation", description: "Top image models & tools.", toolSlugs: ["midjourney","dalle","stable-diffusion","leonardo","ideogram","flux","firefly","krea","recraft","playground"] },
  { slug: "best-video", title: "Best AI for Video", description: "Text-to-video and editors.", toolSlugs: ["runway","kling","pika","veo","sora","luma","hailuo","descript","capcut-ai","opus-clip"] },
  { slug: "best-productivity", title: "Best AI for Productivity", description: "Do more in less time.", toolSlugs: ["notion-ai","napster","motion","reclaim","granola","otter","fireflies","gamma","zapier-ai"] },
];

// News
export interface AINews { slug: string; title: string; source: string; date: string; excerpt: string; url: string; tag: string; }
export const AI_NEWS: AINews[] = [
  { slug:"gpt-6-rumor", title:"OpenAI teases next-gen model with 1M context", source:"OpenAI", date:"2026-06-24", excerpt:"OpenAI hints at a next-gen model with expanded reasoning and a 1M-token context window.", url:"https://openai.com/blog", tag:"Model" },
  { slug:"claude-5", title:"Anthropic launches Claude 5 with agentic tools", source:"Anthropic", date:"2026-06-18", excerpt:"Claude 5 adds native computer use, longer projects, and stronger coding benchmarks.", url:"https://anthropic.com/news", tag:"Model" },
  { slug:"gemini-3", title:"Google Gemini 3 rolls out to Workspace", source:"Google", date:"2026-06-12", excerpt:"Gemini 3 Ultra is now GA in Workspace with improved reasoning and multimodal understanding.", url:"https://blog.google", tag:"Product" },
  { slug:"suno-5", title:"Suno v5 nears studio quality", source:"Suno", date:"2026-05-30", excerpt:"Suno's v5 model brings mastered vocals and instrument stems.", url:"https://suno.com/blog", tag:"Music" },
  { slug:"runway-gen4", title:"Runway ships Gen-4 with better motion", source:"Runway", date:"2026-05-22", excerpt:"Gen-4 improves camera control and character consistency across clips.", url:"https://runwayml.com/news", tag:"Video" },
  { slug:"lovable-hosting", title:"Lovable Cloud adds edge functions", source:"Lovable", date:"2026-05-15", excerpt:"Lovable Cloud now ships with an edge runtime, database, and auth built-in.", url:"https://lovable.dev/blog", tag:"Product" },
  { slug:"xai-colossus", title:"xAI expands Colossus 2 datacenter", source:"xAI", date:"2026-05-05", excerpt:"xAI's Colossus 2 scales to over a million GPUs for training Grok models.", url:"https://x.ai", tag:"Industry" },
  { slug:"meta-llama-5", title:"Meta releases Llama 5 open weights", source:"Meta", date:"2026-04-28", excerpt:"Llama 5 is available with open weights and improved reasoning.", url:"https://ai.meta.com", tag:"Open Source" },
];

// Blog
export interface BlogPost { slug: string; title: string; excerpt: string; author: string; date: string; readMins: number; tags: string[]; category: string; body: string; }
export const AI_BLOG: BlogPost[] = [
  { slug:"getting-started-with-ai", title:"Getting started with AI in 2026", excerpt:"A no-nonsense guide to modern AI for creators and builders.", author:"Dhuran Team", date:"2026-06-20", readMins:7, tags:["intro","guide"], category:"Guides", body:"AI is a set of tools, not magic. Start by picking one tool per workflow — writing, images, coding — and stick with it long enough to build intuition. Then compose them together in your daily work." },
  { slug:"prompting-cheatsheet", title:"The ultimate prompting cheatsheet", excerpt:"Prompt patterns that consistently produce great output.", author:"Dhuran Team", date:"2026-06-10", readMins:9, tags:["prompt","cheatsheet"], category:"Prompts", body:"Great prompts share five parts: role, task, constraints, format, and examples. Add step-by-step reasoning for hard tasks and always specify the output format when a tool consumes it." },
  { slug:"ai-vs-human", title:"AI vs Human: where each still wins", excerpt:"AI helps you go faster, humans decide what to build.", author:"Dhuran Team", date:"2026-05-28", readMins:6, tags:["opinion"], category:"Opinion", body:"AI dominates rote work — first drafts, boilerplate, summaries — but taste, judgment, and empathy remain the domain of humans. Learn to hand off the right work to the right worker." },
  { slug:"top-ai-tools-2026", title:"Top 20 AI tools we use in 2026", excerpt:"The AI tools our team reaches for every day.", author:"Dhuran Team", date:"2026-05-14", readMins:8, tags:["tools","list"], category:"Roundups", body:"Our stack: Claude and ChatGPT for chat, Perplexity for search, Cursor and Lovable for building, Runway and Suno for media, NotebookLM for research, and Otter for meetings." },
];

// Marketplace / Resources (light)
export interface Resource { slug: string; title: string; type: string; description: string; url: string; price: string; }
export const AI_RESOURCES: Resource[] = [
  { slug:"prompt-pack-marketing", title:"100 Marketing Prompts Pack", type:"Prompt Pack", description:"Battle-tested marketing prompts for every channel.", url:"#", price:"Free" },
  { slug:"prompt-pack-seo", title:"75 SEO Prompts", type:"Prompt Pack", description:"Prompts to plan, write and audit SEO content.", url:"#", price:"Free" },
  { slug:"cheatsheet-chatgpt", title:"ChatGPT Cheat Sheet", type:"PDF", description:"1-page reference for busy pros.", url:"#", price:"Free" },
  { slug:"prompt-book-mj", title:"Midjourney Prompt Book", type:"eBook", description:"Compositions, styles and camera lingo.", url:"#", price:"$9" },
  { slug:"guide-rag", title:"RAG in Production Guide", type:"Guide", description:"Ship AI apps with retrieval augmentation.", url:"#", price:"$19" },
  { slug:"free-icons", title:"AI Icon Set (SVG)", type:"Download", description:"200 clean icons for AI apps.", url:"#", price:"Free" },
];

export const NAV = {
  home: "/ai-hub",
  directory: "/ai-hub/directory",
  prompts: "/ai-hub/prompts",
  news: "/ai-hub/news",
  tutorials: "/ai-hub/tutorials",
  comparisons: "/ai-hub/comparisons",
  collections: "/ai-hub/collections",
  blog: "/ai-hub/blog",
  resources: "/ai-hub/resources",
};
