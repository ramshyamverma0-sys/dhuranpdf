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
  t("compress-pdf", "Compress PDF", "pdf", "Reduce PDF file size.", ImageDown, "compress-pdf"),
  t("add-pdf-page-numbers", "Add PDF Page Numbers", "pdf", "Insert page numbers in your PDF.", Hash, "add-pdf-page-numbers"),
  t("protect-pdf", "Protect PDF", "pdf", "Password protect your PDF.", Lock, "protect-pdf"),
  t("unlock-pdf", "Unlock PDF", "pdf", "Remove password from PDF.", Unlock, "unlock-pdf"),
  t("crop-pdf", "Crop PDF", "pdf", "Crop margins of PDF pages.", Crop, "crop-pdf"),
  t("resize-pdf", "Resize PDF", "pdf", "Resize PDF pages.", Maximize, "resize-pdf"),
  t("watermark-pdf", "Watermark PDF", "pdf", "Add watermarks to PDF.", Stamp, "watermark-pdf"),
  t("pdf-to-text", "PDF to Text", "pdf", "Extract plain text from PDF.", Type, "pdf-to-text"),
  t("extract-pdf-pages", "Extract PDF Pages", "pdf", "Pick specific pages from a PDF.", FileText, "extract-pdf-pages"),
  t("delete-pdf-pages", "Delete PDF Pages", "pdf", "Remove unwanted pages.", Scissors, "delete-pdf-pages"),
  t("edit-pdf-metadata", "Edit PDF Metadata", "pdf", "Update author, title and metadata.", FileText, "edit-pdf-metadata"),
  t("html-to-pdf", "HTML to PDF", "pdf", "Convert HTML pages to PDF.", FileCode, "html-to-pdf"),

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
  t("basic-calculator", "Basic Calculator", "calculator", "Standard calculator with full keypad.", Calculator, "basic-calculator"),
  t("percentage-calculator", "Percentage Calculator", "calculator", "Find percentages, increase and decrease.", Percent, "percentage-calculator"),
  t("age-calculator", "Age Calculator", "calculator", "Calculate exact age in years, months, days.", Cake, "age-calculator"),
  t("date-calculator", "Date Calculator", "calculator", "Add or subtract days from a date.", CalendarDays, "date-calculator"),
  t("emi-calculator", "EMI Calculator", "calculator", "Calculate loan EMI with breakdown.", Banknote, "emi-calculator"),

  // ============ Finance ============
  t("loan-calculator", "Loan Calculator", "finance", "Calculate any loan EMI.", Banknote, "emi-calculator"),
  t("home-loan-calculator", "Home Loan Calculator", "finance", "EMI for home loans.", Building2, "emi-calculator"),
  t("personal-loan-calculator", "Personal Loan Calculator", "finance", "EMI for personal loans.", Wallet, "emi-calculator"),
  t("car-loan-calculator", "Car Loan Calculator", "finance", "EMI for car loans.", Wallet, "emi-calculator"),
  t("sip-calculator", "SIP Calculator", "finance", "Future value of monthly SIP investments.", TrendingUp, "sip-calculator"),
  t("compound-interest-calculator", "Compound Interest Calculator", "finance", "Calculate compound interest.", PiggyBank, "compound-interest"),
  t("simple-interest-calculator", "Simple Interest Calculator", "finance", "Calculate simple interest.", PiggyBank, "simple-interest"),
  t("gst-calculator", "GST Calculator", "finance", "Add or remove GST from amount.", Percent, "gst-calculator"),
  t("discount-calculator", "Discount Calculator", "finance", "Calculate discounts and final price.", Percent, "discount-calculator"),
  t("currency-converter", "Currency Converter", "finance", "Convert between world currencies.", Coins, "currency-converter"),

  // ============ Health ============
  t("bmi-calculator", "BMI Calculator", "health", "Body Mass Index with category.", Activity, "bmi-calculator"),
  t("bmr-calculator", "BMR Calculator", "health", "Daily basal metabolic rate.", FlaskConical, "bmr-calculator"),
  t("calorie-calculator", "Calorie Calculator", "health", "Daily calorie needs.", FlaskConical, "calorie-calculator"),
  t("body-fat-calculator", "Body Fat Calculator", "health", "Estimate body fat percentage.", Activity, "body-fat-calculator"),
  t("water-intake-calculator", "Water Intake Calculator", "health", "Recommended daily water.", Droplet, "water-intake"),
  t("ideal-weight-calculator", "Ideal Weight Calculator", "health", "Find your ideal weight range.", Activity, "ideal-weight"),

  // ============ Land ============
  t("land-area-calculator", "Land Area Calculator", "land", "Calculate land area in any unit.", MapPin, "plot-area-calculator"),
  t("bigha-calculator", "Bigha Calculator", "land", "Convert Bigha to Acre, Hectare, Sq Ft.", MapPin, "land-unit-converter"),
  t("acre-calculator", "Acre Calculator", "land", "Convert Acre to other units.", MapPin, "land-unit-converter"),
  t("hectare-calculator", "Hectare Calculator", "land", "Convert Hectare to other units.", MapPin, "land-unit-converter"),
  t("land-unit-converter", "Land Unit Converter", "land", "Convert between all land units.", MapPin, "land-unit-converter"),
  t("plot-area-calculator", "Plot Area Calculator", "land", "Calculate plot area from dimensions.", MapPin, "plot-area-calculator"),
  t("stamp-duty-calculator", "Stamp Duty Calculator", "land", "Estimate stamp duty.", FileText, "stamp-duty-calculator"),

  // ============ Converters ============
  t("length-converter", "Length Converter", "converter", "Convert meters, feet, inches and more.", Ruler, "length-converter"),
  t("temperature-converter", "Temperature Converter", "converter", "C, F, K conversions.", Thermometer, "temperature-converter"),
  t("weight-converter", "Weight Converter", "converter", "Kg, lb, oz, g conversions.", Ruler, "weight-converter"),
  t("area-converter", "Area Converter", "converter", "Square meter, foot, acre.", Ruler, "area-converter"),
  t("volume-converter", "Volume Converter", "converter", "Liter, gallon, cup.", Ruler, "volume-converter"),
  t("speed-converter", "Speed Converter", "converter", "km/h, mph, m/s.", Ruler, "speed-converter"),
  t("time-converter", "Time Converter", "converter", "Seconds, minutes, hours, days.", Clock, "time-converter"),
  t("data-storage-converter", "Data Storage Converter", "converter", "Bytes to KB, MB, GB, TB.", Binary, "data-storage-converter"),

  // ============ Date & Time ============
  t("stopwatch", "Stopwatch", "datetime", "Precision stopwatch with laps.", Timer, "stopwatch"),
  t("timer", "Timer", "datetime", "Countdown timer with alert.", Timer, "timer"),
  t("date-difference-calculator", "Date Difference Calculator", "datetime", "Days between two dates.", CalendarDays, "date-difference"),
  t("leap-year-checker", "Leap Year Checker", "datetime", "Check if a year is leap.", CalendarDays, "leap-year"),
  t("day-finder", "Day Finder", "datetime", "Find what day of week a date falls.", CalendarDays, "day-finder"),

  // ============ CSV ============
  t("csv-to-excel", "CSV to Excel", "csv", "Convert CSV files to XLSX.", FileSpreadsheet, "csv-to-excel"),
  t("excel-to-csv", "Excel to CSV", "csv", "Convert Excel to CSV.", FileSpreadsheet, "excel-to-csv"),
  t("csv-cleaner", "CSV Cleaner", "csv", "Clean and dedupe CSV rows.", FileSpreadsheet, "csv-cleaner"),
  t("csv-validator", "CSV Validator", "csv", "Validate CSV structure.", ListChecks, "csv-validator"),
  t("csv-splitter", "CSV Splitter", "csv", "Split large CSV files.", Scissors, "csv-splitter"),
  t("csv-merge-tool", "CSV Merge Tool", "csv", "Merge multiple CSV files.", Combine, "csv-merger"),

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
  t("uuid-generator", "UUID Generator", "utility", "Generate UUID v4 identifiers.", Hash, "uuid-generator"),
  t("lorem-ipsum-generator", "Lorem Ipsum Generator", "utility", "Generate placeholder text.", Type, "lorem-generator"),
  t("random-number-generator", "Random Number Generator", "utility", "Generate random numbers in a range.", Hash, "random-number-generator"),

  // ============ YouTube ============
  t("yt-thumbnail-downloader", "Thumbnail Downloader", "youtube", "Download YouTube video thumbnails.", Youtube, "yt-thumbnail-downloader"),
  t("yt-channel-id-finder", "Channel ID Finder", "youtube", "Find a YouTube channel ID.", Youtube, "yt-channel-id-finder"),
  t("yt-video-id-finder", "Video ID Finder", "youtube", "Get the video ID from a URL.", Youtube, "yt-video-id-finder"),
  t("yt-embed-generator", "Embed Generator", "youtube", "Generate YouTube embed code.", Youtube, "yt-embed-generator"),
  t("yt-tags-extractor", "YouTube Tags Extractor", "youtube", "Pull tags from any video.", Youtube, "yt-tags-extractor"),

  // ============ AI ============
  t("ai-text-summarizer", "AI Text Summarizer", "ai", "Summarize any text with AI.", Sparkles, "ai-text-summarizer"),
  t("ai-pdf-summarizer", "AI PDF Summarizer", "ai", "Summarize PDF documents.", FileSearch2, "ai-pdf-summarizer"),
  t("ai-grammar-checker", "AI Grammar Checker", "ai", "Fix grammar and spelling.", PenTool, "ai-grammar-checker"),
  t("ai-paraphraser", "AI Paraphraser", "ai", "Rewrite text in different tones.", Wand2, "ai-paraphraser"),
  t("ai-translator", "AI Translator", "ai", "Translate text between languages.", Languages, "ai-translator"),
  t("ai-resume-builder", "AI Resume Builder", "ai", "Build a professional resume.", FileText, "ai-resume-builder"),
  t("ai-cover-letter-generator", "AI Cover Letter Generator", "ai", "Generate tailored cover letters.", Mail, "ai-cover-letter-generator"),
  t("ai-blog-generator", "AI Blog Generator", "ai", "Write blog posts with AI.", PenTool, "ai-blog-generator"),
  t("ai-email-writer", "AI Email Writer", "ai", "Draft emails in seconds.", Mail, "ai-email-writer"),
  t("ai-chat", "AI Chat", "ai", "Chat with a smart assistant.", Bot, "ai-chat"),
  t("ai-question-generator", "AI Question Generator", "ai", "Generate quiz questions.", FileQuestion, "ai-question-generator"),

  // ============ Image ============
  t("image-compressor", "Image Compressor", "image", "Compress JPG and PNG images.", ImageDown, "image-compressor"),
  t("image-resizer", "Image Resizer", "image", "Resize images to any dimensions.", Maximize, "image-resizer"),
  t("png-to-jpg", "PNG to JPG", "image", "Convert PNG to JPG.", FileImage, "png-to-jpg"),
  t("jpg-to-png", "JPG to PNG", "image", "Convert JPG to PNG.", FileImage, "png-to-jpg"),
  t("image-cropper", "Image Cropper", "image", "Crop images to custom size.", Crop, "image-cropper"),
  t("image-color-picker", "Image Color Picker", "image", "Pick colors from any image.", Palette, "image-color-picker"),
  t("webp-converter", "WebP Converter", "image", "Convert to and from WebP.", ImageIcon, "webp-converter"),

  // ============ Security ============
  t("zip-creator", "ZIP Creator", "security", "Create ZIP archives.", Archive, "zip-creator"),
  t("zip-extractor", "ZIP Extractor", "security", "Extract ZIP files.", Archive, "zip-extractor"),
  t("md5-generator", "MD5 Generator", "security", "Generate MD5 hashes.", Hash, "md5-generator"),
  t("sha-generator", "SHA Generator", "security", "Generate SHA-256 hashes.", Hash, "sha-generator"),
  t("text-encryptor", "Text Encryptor", "security", "Encrypt text with a key.", Lock, "text-encryptor"),

  // ============ Developer ============
  t("html-formatter", "HTML Formatter", "developer", "Format and beautify HTML.", FileCode, "html-formatter"),
  t("css-formatter", "CSS Formatter", "developer", "Format and beautify CSS.", FileCode, "css-formatter"),
  t("js-formatter", "JavaScript Formatter", "developer", "Format JS code.", FileCode, "js-formatter"),
  t("sql-formatter", "SQL Formatter", "developer", "Format SQL queries.", FileCode, "sql-formatter"),
  t("regex-tester", "Regex Tester", "developer", "Test regular expressions.", Code2, "regex-tester"),
  t("color-converter", "Color Converter", "developer", "HEX, RGB, HSL conversions.", Palette, "color-converter"),
  t("meta-tag-generator", "Meta Tag Generator", "developer", "Generate SEO meta tags.", Globe, "meta-tag-generator"),
  t("robots-txt-generator", "Robots.txt Generator", "developer", "Generate robots.txt files.", Globe, "robots-txt-generator"),

  // ============ Education ============
  t("scientific-calculator", "Scientific Calculator", "education", "Advanced scientific calculator.", Calculator, "scientific-calculator"),
  t("gpa-calculator", "GPA Calculator", "education", "Calculate your GPA.", GraduationCap, "gpa-calculator"),
  t("pomodoro-timer", "Pomodoro Timer", "education", "Focus with the Pomodoro technique.", Timer, "pomodoro-timer"),
  t("fraction-calculator", "Fraction Calculator", "education", "Add, subtract, multiply fractions.", Calculator, "fraction-calculator"),

  // ============ Business ============
  t("invoice-generator", "Invoice Generator", "business", "Create professional invoices.", FileText, "invoice-generator"),
  t("receipt-generator", "Receipt Generator", "business", "Generate receipts instantly.", FileText, "receipt-generator"),
  t("business-name-generator", "Business Name Generator", "business", "Find a name for your business.", Briefcase, "business-name-generator"),
  t("email-signature-generator", "Email Signature Generator", "business", "Create email signatures.", Mail, "email-signature-generator"),

  // ============ Media (Video & Audio) ============
  t("video-thumbnail-extractor", "Video Thumbnail Extractor", "media", "Capture a frame from any video as a PNG.", ImageIcon, "video-thumbnail-extractor"),
  t("video-metadata-viewer", "Video Metadata Viewer", "media", "View resolution, duration and size of a video.", Film, "video-metadata-viewer"),
  t("audio-metadata-viewer", "Audio Metadata Viewer", "media", "View duration, size and type of an audio file.", Music, "audio-metadata-viewer"),
  t("voice-recorder", "Voice Recorder", "media", "Record voice from your microphone and download.", Mic, "voice-recorder"),
  t("audio-player", "Audio Player", "media", "Play any local audio file safely in browser.", Music, "audio-player"),
  t("video-player", "Video Player", "media", "Play any local video file safely in browser.", Film, "video-player"),
  t("video-trimmer", "Video Trimmer", "media", "Trim a short clip from any video and download (WebM).", Scissors, "video-trimmer"),
  t("youtube-player", "YouTube Player", "media", "Preview any YouTube video by URL.", Youtube, "youtube-player"),
];

export const TOTAL_TOOLS = TOOLS.length;

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const getToolsByCategory = (slug: string) => TOOLS.filter((t) => t.category === slug);
export const getImplementedTools = () => TOOLS.filter((t) => t.componentKey);
