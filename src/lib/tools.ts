import type { LucideIcon } from "lucide-react";
import {
  FileText, Combine, Scissors, RotateCw, Image as ImageIcon, FileImage,
  Calculator, Percent, Cake, Ruler, Thermometer, Banknote, TrendingUp,
  HeartPulse, Type, KeyRound, QrCode, Braces, Binary, Link as LinkIcon,
  Sparkles, FileSearch, Languages, Stamp, Lock, Unlock, Crop, Maximize,
  ImageDown, FileType, Hash, ListChecks, Timer, Clock, CalendarDays,
  Globe, Code2, FileSpreadsheet, Youtube, ShieldCheck, Wand2, Mic,
  Volume2, PenTool, Mail, FileBarChart, Briefcase, GraduationCap,
  Building2, MapPin, Coins, Wallet, PiggyBank, Activity, Droplet,
  FlaskConical, Palette, Film, Music, Archive, FileCode, FileSearch2,
  Bot, FileQuestion,
} from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string; // tailwind class for accent tint
};

export type Tool = {
  slug: string;
  name: string;
  category: string; // category slug
  description: string;
  icon: LucideIcon;
  componentKey?: string; // if set, tool is implemented
  keywords?: string[];
};

export const CATEGORIES: Category[] = [
  { slug: "pdf", name: "PDF Tools", description: "Merge, split, compress, convert and edit PDF files.", icon: FileText, color: "from-blue-500/15 to-indigo-500/15" },
  { slug: "image-pdf", name: "Image & PDF", description: "Convert images to PDF and back, with full control.", icon: FileImage, color: "from-sky-500/15 to-blue-500/15" },
  { slug: "calculator", name: "Calculators", description: "Quick everyday calculators.", icon: Calculator, color: "from-emerald-500/15 to-teal-500/15" },
  { slug: "finance", name: "Finance", description: "EMI, SIP, loans, interest, GST and more.", icon: Banknote, color: "from-green-500/15 to-emerald-500/15" },
  { slug: "health", name: "Health", description: "BMI, BMR, calorie, water intake calculators.", icon: HeartPulse, color: "from-rose-500/15 to-pink-500/15" },
  { slug: "land", name: "Land & Property", description: "Bigha, acre, hectare and land unit converters.", icon: MapPin, color: "from-amber-500/15 to-orange-500/15" },
  { slug: "converter", name: "Unit Converters", description: "Length, area, weight, temperature, time and more.", icon: Ruler, color: "from-cyan-500/15 to-blue-500/15" },
  { slug: "datetime", name: "Date & Time", description: "Stopwatch, timer, day finder, duration calculators.", icon: Clock, color: "from-violet-500/15 to-purple-500/15" },
  { slug: "csv", name: "CSV & Ecommerce", description: "Generate, clean and convert CSV files.", icon: FileSpreadsheet, color: "from-lime-500/15 to-green-500/15" },
  { slug: "utility", name: "Utility Tools", description: "Word counter, password, QR, JSON, base64.", icon: Wand2, color: "from-indigo-500/15 to-blue-500/15" },
  { slug: "youtube", name: "YouTube Tools", description: "Thumbnails, tags, hashtag and embed helpers.", icon: Youtube, color: "from-red-500/15 to-rose-500/15" },
  { slug: "ai", name: "AI Smart Tools", description: "AI summarizer, writer, translator, image tools.", icon: Sparkles, color: "from-fuchsia-500/15 to-violet-500/15" },
  { slug: "image", name: "Image & Design", description: "Resize, crop, convert, color picker and more.", icon: ImageIcon, color: "from-pink-500/15 to-rose-500/15" },
  { slug: "media", name: "Video & Audio", description: "Compress, convert, trim, cut video and audio.", icon: Film, color: "from-purple-500/15 to-fuchsia-500/15" },
  { slug: "security", name: "File & Security", description: "ZIP, hash, encrypt, duplicate finder.", icon: ShieldCheck, color: "from-slate-500/15 to-gray-500/15" },
  { slug: "developer", name: "Developer", description: "Formatters, regex, color, meta and sitemap.", icon: Code2, color: "from-teal-500/15 to-cyan-500/15" },
  { slug: "education", name: "Education", description: "Scientific, matrix, GPA, Pomodoro.", icon: GraduationCap, color: "from-yellow-500/15 to-amber-500/15" },
  { slug: "business", name: "Business", description: "Invoices, receipts, business name generator.", icon: Briefcase, color: "from-blue-500/15 to-sky-500/15" },
];

const t = (
  slug: string,
  name: string,
  category: string,
  description: string,
  icon: LucideIcon,
  componentKey?: string,
): Tool => ({ slug, name, category, description, icon, componentKey });

export const TOOLS: Tool[] = [
  // ============ PDF ============
  t("merge-pdf", "Merge PDF", "pdf", "Combine multiple PDFs into one document.", Combine, "merge-pdf"),
  t("split-pdf", "Split PDF", "pdf", "Split a PDF into individual pages.", Scissors, "split-pdf"),
  t("rotate-pdf", "Rotate PDF", "pdf", "Rotate pages of your PDF.", RotateCw, "rotate-pdf"),
  t("compress-pdf", "Compress PDF", "pdf", "Reduce PDF file size.", ImageDown),
  t("pdf-editor", "PDF Editor", "pdf", "Edit PDF text and elements.", PenTool),
  t("add-pdf-page-numbers", "Add PDF Page Numbers", "pdf", "Insert page numbers in your PDF.", Hash),
  t("protect-pdf", "Protect PDF", "pdf", "Password protect your PDF.", Lock),
  t("unlock-pdf", "Unlock PDF", "pdf", "Remove password from PDF.", Unlock),
  t("repair-pdf", "Repair PDF", "pdf", "Fix corrupted PDF files.", FileText),
  t("crop-pdf", "Crop PDF", "pdf", "Crop margins of PDF pages.", Crop),
  t("resize-pdf", "Resize PDF", "pdf", "Resize PDF pages.", Maximize),
  t("watermark-pdf", "Watermark PDF", "pdf", "Add watermarks to PDF.", Stamp),
  t("ocr-pdf", "OCR PDF", "pdf", "Extract text from scanned PDFs.", FileSearch),
  t("pdf-to-word", "PDF to Word", "pdf", "Convert PDF to editable Word doc.", FileType),
  t("pdf-to-excel", "PDF to Excel", "pdf", "Extract tables from PDF to Excel.", FileSpreadsheet),
  t("pdf-to-jpg", "PDF to JPG", "pdf", "Convert PDF pages to images.", ImageIcon),
  t("pdf-to-text", "PDF to Text", "pdf", "Extract plain text from PDF.", Type),
  t("pdf-to-powerpoint", "PDF to PowerPoint", "pdf", "Convert PDF to slides.", FileBarChart),
  t("extract-pdf-pages", "Extract PDF Pages", "pdf", "Pick specific pages from a PDF.", FileText),
  t("extract-images-from-pdf", "Extract Images from PDF", "pdf", "Pull out all images from a PDF.", ImageIcon),
  t("delete-pdf-pages", "Delete PDF Pages", "pdf", "Remove unwanted pages.", Scissors),
  t("edit-pdf-metadata", "Edit PDF Metadata", "pdf", "Update author, title and metadata.", FileText),
  t("html-to-pdf", "HTML to PDF", "pdf", "Convert HTML pages to PDF.", FileCode),
  t("word-to-pdf", "Word to PDF", "pdf", "Convert Word documents to PDF.", FileType),

  // ============ Image PDF ============
  t("jpg-to-pdf", "JPG to PDF", "image-pdf", "Convert JPG images into a single PDF.", FileImage, "jpg-to-pdf"),
  t("png-to-pdf", "PNG to PDF", "image-pdf", "Convert PNG images into a PDF.", FileImage, "jpg-to-pdf"),
  t("image-to-pdf", "Image to PDF Converter", "image-pdf", "Combine any images into one PDF.", FileImage, "jpg-to-pdf"),
  t("multiple-images-to-pdf", "Multiple Images to PDF", "image-pdf", "Bulk convert images to PDF.", FileImage, "jpg-to-pdf"),
  t("pdf-to-png", "PDF to PNG", "image-pdf", "Convert PDF pages to PNG images.", ImageIcon),
  t("compress-image-pdf", "Compress Image PDF", "image-pdf", "Shrink image-based PDFs.", ImageDown),
  t("heic-to-pdf", "HEIC to PDF", "image-pdf", "Convert iPhone HEIC to PDF.", FileImage),
  t("webp-to-pdf", "WEBP to PDF", "image-pdf", "Convert WEBP images to PDF.", FileImage),

  // ============ Calculator ============
  t("basic-calculator", "Basic Calculator", "calculator", "Standard calculator with full keypad.", Calculator),
  t("percentage-calculator", "Percentage Calculator", "calculator", "Find percentages, increase and decrease.", Percent, "percentage-calculator"),
  t("age-calculator", "Age Calculator", "calculator", "Calculate exact age in years, months, days.", Cake, "age-calculator"),
  t("date-calculator", "Date Calculator", "calculator", "Add or subtract days from a date.", CalendarDays),
  t("emi-calculator", "EMI Calculator", "calculator", "Calculate loan EMI with breakdown.", Banknote, "emi-calculator"),

  // ============ Finance ============
  t("loan-calculator", "Loan Calculator", "finance", "Calculate any loan EMI.", Banknote, "emi-calculator"),
  t("home-loan-calculator", "Home Loan Calculator", "finance", "EMI for home loans.", Building2, "emi-calculator"),
  t("personal-loan-calculator", "Personal Loan Calculator", "finance", "EMI for personal loans.", Wallet, "emi-calculator"),
  t("car-loan-calculator", "Car Loan Calculator", "finance", "EMI for car loans.", Wallet, "emi-calculator"),
  t("sip-calculator", "SIP Calculator", "finance", "Future value of monthly SIP investments.", TrendingUp, "sip-calculator"),
  t("compound-interest-calculator", "Compound Interest Calculator", "finance", "Calculate compound interest.", PiggyBank),
  t("simple-interest-calculator", "Simple Interest Calculator", "finance", "Calculate simple interest.", PiggyBank),
  t("gst-calculator", "GST Calculator", "finance", "Add or remove GST from amount.", Percent),
  t("discount-calculator", "Discount Calculator", "finance", "Calculate discounts and final price.", Percent),
  t("currency-converter", "Currency Converter", "finance", "Convert between world currencies.", Coins),

  // ============ Health ============
  t("bmi-calculator", "BMI Calculator", "health", "Body Mass Index with category.", Activity, "bmi-calculator"),
  t("bmr-calculator", "BMR Calculator", "health", "Daily basal metabolic rate.", FlaskConical),
  t("calorie-calculator", "Calorie Calculator", "health", "Daily calorie needs.", FlaskConical),
  t("body-fat-calculator", "Body Fat Calculator", "health", "Estimate body fat percentage.", Activity),
  t("water-intake-calculator", "Water Intake Calculator", "health", "Recommended daily water.", Droplet),
  t("ideal-weight-calculator", "Ideal Weight Calculator", "health", "Find your ideal weight range.", Activity),

  // ============ Land ============
  t("land-area-calculator", "Land Area Calculator", "land", "Calculate land area in any unit.", MapPin),
  t("bigha-calculator", "Bigha Calculator", "land", "Convert Bigha to Acre, Hectare, Sq Ft.", MapPin),
  t("acre-calculator", "Acre Calculator", "land", "Convert Acre to other units.", MapPin),
  t("hectare-calculator", "Hectare Calculator", "land", "Convert Hectare to other units.", MapPin),
  t("land-unit-converter", "Land Unit Converter", "land", "Convert between all land units.", MapPin),
  t("plot-area-calculator", "Plot Area Calculator", "land", "Calculate plot area from dimensions.", MapPin),
  t("stamp-duty-calculator", "Stamp Duty Calculator", "land", "Estimate stamp duty.", FileText),

  // ============ Converters ============
  t("length-converter", "Length Converter", "converter", "Convert meters, feet, inches and more.", Ruler, "length-converter"),
  t("temperature-converter", "Temperature Converter", "converter", "C, F, K conversions.", Thermometer, "temperature-converter"),
  t("weight-converter", "Weight Converter", "converter", "Kg, lb, oz, g conversions.", Ruler),
  t("area-converter", "Area Converter", "converter", "Square meter, foot, acre.", Ruler),
  t("volume-converter", "Volume Converter", "converter", "Liter, gallon, cup.", Ruler),
  t("speed-converter", "Speed Converter", "converter", "km/h, mph, m/s.", Ruler),
  t("time-converter", "Time Converter", "converter", "Seconds, minutes, hours, days.", Clock),
  t("data-storage-converter", "Data Storage Converter", "converter", "Bytes to KB, MB, GB, TB.", Binary),

  // ============ Date & Time ============
  t("stopwatch", "Stopwatch", "datetime", "Precision stopwatch with laps.", Timer),
  t("timer", "Timer", "datetime", "Countdown timer with alert.", Timer),
  t("date-difference-calculator", "Date Difference Calculator", "datetime", "Days between two dates.", CalendarDays),
  t("leap-year-checker", "Leap Year Checker", "datetime", "Check if a year is leap.", CalendarDays),
  t("day-finder", "Day Finder", "datetime", "Find what day of week a date falls.", CalendarDays),

  // ============ CSV ============
  t("csv-to-excel", "CSV to Excel", "csv", "Convert CSV files to XLSX.", FileSpreadsheet),
  t("excel-to-csv", "Excel to CSV", "csv", "Convert Excel to CSV.", FileSpreadsheet),
  t("csv-cleaner", "CSV Cleaner", "csv", "Clean and dedupe CSV rows.", FileSpreadsheet),
  t("csv-validator", "CSV Validator", "csv", "Validate CSV structure.", ListChecks),
  t("csv-splitter", "CSV Splitter", "csv", "Split large CSV files.", Scissors),
  t("csv-merge-tool", "CSV Merge Tool", "csv", "Merge multiple CSV files.", Combine),

  // ============ Utility ============
  t("word-counter", "Word Counter", "utility", "Count words, characters, sentences.", Type, "word-counter"),
  t("character-counter", "Character Counter", "utility", "Count characters with/without spaces.", Type, "word-counter"),
  t("password-generator", "Password Generator", "utility", "Generate strong random passwords.", KeyRound, "password-generator"),
  t("qr-code-generator", "QR Code Generator", "utility", "Generate QR codes for any text or URL.", QrCode, "qr-code-generator"),
  t("json-formatter", "JSON Formatter", "utility", "Format, validate and minify JSON.", Braces, "json-formatter"),
  t("json-validator", "JSON Validator", "utility", "Validate JSON syntax.", Braces, "json-formatter"),
  t("base64-encoder", "Base64 Encoder", "utility", "Encode text to Base64.", Binary, "base64"),
  t("base64-decoder", "Base64 Decoder", "utility", "Decode Base64 to text.", Binary, "base64"),
  t("url-encoder", "URL Encoder", "utility", "Encode strings for URLs.", LinkIcon, "url-encoder"),
  t("url-decoder", "URL Decoder", "utility", "Decode URL-encoded strings.", LinkIcon, "url-encoder"),
  t("uuid-generator", "UUID Generator", "utility", "Generate UUID v4 identifiers.", Hash),
  t("lorem-ipsum-generator", "Lorem Ipsum Generator", "utility", "Generate placeholder text.", Type),
  t("random-number-generator", "Random Number Generator", "utility", "Generate random numbers in a range.", Hash),

  // ============ YouTube ============
  t("yt-thumbnail-downloader", "Thumbnail Downloader", "youtube", "Download YouTube video thumbnails.", Youtube),
  t("yt-channel-id-finder", "Channel ID Finder", "youtube", "Find a YouTube channel ID.", Youtube),
  t("yt-video-id-finder", "Video ID Finder", "youtube", "Get the video ID from a URL.", Youtube),
  t("yt-embed-generator", "Embed Generator", "youtube", "Generate YouTube embed code.", Youtube),
  t("yt-tags-extractor", "YouTube Tags Extractor", "youtube", "Pull tags from any video.", Youtube),

  // ============ AI ============
  t("ai-text-summarizer", "AI Text Summarizer", "ai", "Summarize any text with AI.", Sparkles, "ai-text-summarizer"),
  t("ai-pdf-summarizer", "AI PDF Summarizer", "ai", "Summarize PDF documents.", FileSearch2),
  t("ai-grammar-checker", "AI Grammar Checker", "ai", "Fix grammar and spelling.", PenTool),
  t("ai-paraphraser", "AI Paraphraser", "ai", "Rewrite text in different tones.", Wand2),
  t("ai-translator", "AI Translator", "ai", "Translate text between languages.", Languages),
  t("ai-resume-builder", "AI Resume Builder", "ai", "Build a professional resume.", FileText),
  t("ai-cover-letter-generator", "AI Cover Letter Generator", "ai", "Generate tailored cover letters.", Mail),
  t("ai-blog-generator", "AI Blog Generator", "ai", "Write blog posts with AI.", PenTool),
  t("ai-email-writer", "AI Email Writer", "ai", "Draft emails in seconds.", Mail),
  t("ai-image-generator", "AI Image Generator", "ai", "Create images from prompts.", Wand2),
  t("ai-logo-generator", "AI Logo Generator", "ai", "Generate logo concepts.", Palette),
  t("ai-text-to-speech", "AI Text To Speech", "ai", "Convert text to natural speech.", Volume2),
  t("ai-voice-to-text", "AI Voice To Text", "ai", "Transcribe voice to text.", Mic),
  t("ai-chat", "AI Chat", "ai", "Chat with a smart assistant.", Bot),
  t("ai-question-generator", "AI Question Generator", "ai", "Generate quiz questions.", FileQuestion),

  // ============ Image ============
  t("image-compressor", "Image Compressor", "image", "Compress JPG and PNG images.", ImageDown, "image-compressor"),
  t("image-resizer", "Image Resizer", "image", "Resize images to any dimensions.", Maximize, "image-resizer"),
  t("png-to-jpg", "PNG to JPG", "image", "Convert PNG to JPG.", FileImage, "png-to-jpg"),
  t("jpg-to-png", "JPG to PNG", "image", "Convert JPG to PNG.", FileImage, "png-to-jpg"),
  t("image-cropper", "Image Cropper", "image", "Crop images to custom size.", Crop),
  t("image-color-picker", "Image Color Picker", "image", "Pick colors from any image.", Palette),
  t("webp-converter", "WebP Converter", "image", "Convert to and from WebP.", ImageIcon),

  // ============ Media ============
  t("video-compressor", "Video Compressor", "media", "Compress video files.", Film),
  t("video-trimmer", "Video Trimmer", "media", "Trim videos to any length.", Scissors),
  t("audio-converter", "Audio Converter", "media", "Convert between audio formats.", Music),
  t("audio-cutter", "Audio Cutter", "media", "Cut audio clips.", Scissors),
  t("video-to-mp3", "Video to MP3", "media", "Extract MP3 audio from video.", Music),

  // ============ Security ============
  t("zip-creator", "ZIP Creator", "security", "Create ZIP archives.", Archive),
  t("zip-extractor", "ZIP Extractor", "security", "Extract ZIP files.", Archive),
  t("md5-generator", "MD5 Generator", "security", "Generate MD5 hashes.", Hash),
  t("sha-generator", "SHA Generator", "security", "Generate SHA-256 hashes.", Hash),
  t("text-encryptor", "Text Encryptor", "security", "Encrypt text with a key.", Lock),

  // ============ Developer ============
  t("html-formatter", "HTML Formatter", "developer", "Format and beautify HTML.", FileCode),
  t("css-formatter", "CSS Formatter", "developer", "Format and beautify CSS.", FileCode),
  t("js-formatter", "JavaScript Formatter", "developer", "Format JS code.", FileCode),
  t("sql-formatter", "SQL Formatter", "developer", "Format SQL queries.", FileCode),
  t("regex-tester", "Regex Tester", "developer", "Test regular expressions.", Code2),
  t("color-converter", "Color Converter", "developer", "HEX, RGB, HSL conversions.", Palette),
  t("meta-tag-generator", "Meta Tag Generator", "developer", "Generate SEO meta tags.", Globe),
  t("robots-txt-generator", "Robots.txt Generator", "developer", "Generate robots.txt files.", Globe),

  // ============ Education ============
  t("scientific-calculator", "Scientific Calculator", "education", "Advanced scientific calculator.", Calculator),
  t("gpa-calculator", "GPA Calculator", "education", "Calculate your GPA.", GraduationCap),
  t("pomodoro-timer", "Pomodoro Timer", "education", "Focus with the Pomodoro technique.", Timer),
  t("fraction-calculator", "Fraction Calculator", "education", "Add, subtract, multiply fractions.", Calculator),

  // ============ Business ============
  t("invoice-generator", "Invoice Generator", "business", "Create professional invoices.", FileText),
  t("receipt-generator", "Receipt Generator", "business", "Generate receipts instantly.", FileText),
  t("business-name-generator", "Business Name Generator", "business", "Find a name for your business.", Briefcase),
  t("email-signature-generator", "Email Signature Generator", "business", "Create email signatures.", Mail),
];

export const TOTAL_TOOLS = TOOLS.length;

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const getToolsByCategory = (slug: string) => TOOLS.filter((t) => t.category === slug);
export const getImplementedTools = () => TOOLS.filter((t) => t.componentKey);
