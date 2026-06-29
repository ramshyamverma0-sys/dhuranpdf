import type { ComponentType } from "react";
import MergePDF from "@/tools/merge-pdf";
import SplitPDF from "@/tools/split-pdf";
import RotatePDF from "@/tools/rotate-pdf";
import JpgToPDF from "@/tools/jpg-to-pdf";
import ImageCompressor from "@/tools/image-compressor";
import ImageResizer from "@/tools/image-resizer";
import PngJpgConvert from "@/tools/png-to-jpg";
import EMICalculator from "@/tools/emi-calculator";
import SIPCalculator from "@/tools/sip-calculator";
import PercentageCalculator from "@/tools/percentage-calculator";
import BMICalculator from "@/tools/bmi-calculator";
import AgeCalculator from "@/tools/age-calculator";
import LengthConverter from "@/tools/length-converter";
import TemperatureConverter from "@/tools/temperature-converter";
import WordCounter from "@/tools/word-counter";
import PasswordGenerator from "@/tools/password-generator";
import QRCodeGenerator from "@/tools/qr-code-generator";
import JsonFormatter from "@/tools/json-formatter";
import Base64Tool from "@/tools/base64";
import UrlEncoder from "@/tools/url-encoder";
import AITextSummarizer from "@/tools/ai-text-summarizer";

import { BasicCalculator, ScientificCalculator, FractionCalculator, GpaCalculator, DateCalculator } from "@/tools/calculators";
import { Stopwatch, Timer, DateDifference, LeapYear, DayFinder, PomodoroTimer } from "@/tools/datetime-tools";
import { CompoundInterest, SimpleInterest, GstCalculator, DiscountCalculator, CurrencyConverter } from "@/tools/finance-tools";
import { BmrCalculator, CalorieCalculator, BodyFatCalculator, WaterIntake, IdealWeight } from "@/tools/health-tools";
import { WeightConverter, AreaConverter, VolumeConverter, SpeedConverter, TimeConverter, DataStorageConverter, LandUnitConverter, PlotAreaCalculator, StampDutyCalculator } from "@/tools/converter-tools";
import { CsvToExcel, ExcelToCsv, CsvCleaner, CsvValidator, CsvSplitter, CsvMerger } from "@/tools/csv-tools";
import { UuidGenerator, LoremGenerator, RandomNumberGenerator } from "@/tools/utility-tools";
import { ThumbnailDownloader, VideoIdFinder, ChannelIdFinder, EmbedGenerator, TagsExtractor } from "@/tools/youtube-tools";
import { Md5Generator, ShaGenerator, TextEncryptor, ZipCreator, ZipExtractor } from "@/tools/security-tools";
import { HtmlFormatter, CssFormatter, JsFormatter, SqlFormatter, RegexTester, ColorConverter, MetaTagGenerator, RobotsTxtGenerator } from "@/tools/developer-tools";
import { InvoiceGenerator, ReceiptGenerator, BusinessNameGenerator, EmailSignatureGenerator } from "@/tools/business-tools";
import { ImageCropper, ImageColorPicker, WebpConverter } from "@/tools/image-tools-extra";
import { CompressPdf, AddPageNumbers, WatermarkPdf, ExtractPages, DeletePages, PdfToText, EditPdfMetadata, CropPdf, ResizePdf, HtmlToPdf, ProtectPdf, UnlockPdf } from "@/tools/pdf-tools-extra";
import { AIGrammarChecker, AIParaphraser, AITranslator, AICoverLetter, AIBlogGenerator, AIEmailWriter, AIResumeBuilder, AIQuestionGenerator, AIPdfSummarizer, AIChat } from "@/tools/ai-tools";
import { VideoThumbnail, VideoMetadata, AudioMetadata, VoiceRecorder, MediaPlayer, VideoTrimmer, YouTubePlayer } from "@/tools/media-tools";

export const TOOL_COMPONENTS: Record<string, ComponentType<{ slug: string }>> = {
  "merge-pdf": MergePDF,
  "split-pdf": SplitPDF,
  "rotate-pdf": RotatePDF,
  "jpg-to-pdf": JpgToPDF,
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "png-to-jpg": PngJpgConvert,
  "emi-calculator": EMICalculator,
  "sip-calculator": SIPCalculator,
  "percentage-calculator": PercentageCalculator,
  "bmi-calculator": BMICalculator,
  "age-calculator": AgeCalculator,
  "length-converter": LengthConverter,
  "temperature-converter": TemperatureConverter,
  "word-counter": WordCounter,
  "password-generator": PasswordGenerator,
  "qr-code-generator": QRCodeGenerator,
  "json-formatter": JsonFormatter,
  "base64": Base64Tool,
  "url-encoder": UrlEncoder,
  "ai-text-summarizer": AITextSummarizer,

  // Calculators
  "basic-calculator": BasicCalculator,
  "scientific-calculator": ScientificCalculator,
  "fraction-calculator": FractionCalculator,
  "gpa-calculator": GpaCalculator,
  "date-calculator": DateCalculator,

  // Date & Time
  "stopwatch": Stopwatch,
  "timer": Timer,
  "date-difference": DateDifference,
  "leap-year": LeapYear,
  "day-finder": DayFinder,
  "pomodoro-timer": PomodoroTimer,

  // Finance
  "compound-interest": CompoundInterest,
  "simple-interest": SimpleInterest,
  "gst-calculator": GstCalculator,
  "discount-calculator": DiscountCalculator,
  "currency-converter": CurrencyConverter,

  // Health
  "bmr-calculator": BmrCalculator,
  "calorie-calculator": CalorieCalculator,
  "body-fat-calculator": BodyFatCalculator,
  "water-intake": WaterIntake,
  "ideal-weight": IdealWeight,

  // Converters
  "weight-converter": WeightConverter,
  "area-converter": AreaConverter,
  "volume-converter": VolumeConverter,
  "speed-converter": SpeedConverter,
  "time-converter": TimeConverter,
  "data-storage-converter": DataStorageConverter,
  "land-unit-converter": LandUnitConverter,
  "plot-area-calculator": PlotAreaCalculator,
  "stamp-duty-calculator": StampDutyCalculator,

  // CSV
  "csv-to-excel": CsvToExcel,
  "excel-to-csv": ExcelToCsv,
  "csv-cleaner": CsvCleaner,
  "csv-validator": CsvValidator,
  "csv-splitter": CsvSplitter,
  "csv-merger": CsvMerger,

  // Utility
  "uuid-generator": UuidGenerator,
  "lorem-generator": LoremGenerator,
  "random-number-generator": RandomNumberGenerator,

  // YouTube
  "yt-thumbnail-downloader": ThumbnailDownloader,
  "yt-video-id-finder": VideoIdFinder,
  "yt-channel-id-finder": ChannelIdFinder,
  "yt-embed-generator": EmbedGenerator,
  "yt-tags-extractor": TagsExtractor,

  // Security
  "md5-generator": Md5Generator,
  "sha-generator": ShaGenerator,
  "text-encryptor": TextEncryptor,
  "zip-creator": ZipCreator,
  "zip-extractor": ZipExtractor,

  // Developer
  "html-formatter": HtmlFormatter,
  "css-formatter": CssFormatter,
  "js-formatter": JsFormatter,
  "sql-formatter": SqlFormatter,
  "regex-tester": RegexTester,
  "color-converter": ColorConverter,
  "meta-tag-generator": MetaTagGenerator,
  "robots-txt-generator": RobotsTxtGenerator,

  // Business
  "invoice-generator": InvoiceGenerator,
  "receipt-generator": ReceiptGenerator,
  "business-name-generator": BusinessNameGenerator,
  "email-signature-generator": EmailSignatureGenerator,

  // Image extras
  "image-cropper": ImageCropper,
  "image-color-picker": ImageColorPicker,
  "webp-converter": WebpConverter,

  // PDF extras
  "compress-pdf": CompressPdf,
  "add-pdf-page-numbers": AddPageNumbers,
  "watermark-pdf": WatermarkPdf,
  "extract-pdf-pages": ExtractPages,
  "delete-pdf-pages": DeletePages,
  "pdf-to-text": PdfToText,
  "edit-pdf-metadata": EditPdfMetadata,
  "crop-pdf": CropPdf,
  "resize-pdf": ResizePdf,
  "html-to-pdf": HtmlToPdf,
  "protect-pdf": ProtectPdf,
  "unlock-pdf": UnlockPdf,

  // AI
  "ai-grammar-checker": AIGrammarChecker,
  "ai-paraphraser": AIParaphraser,
  "ai-translator": AITranslator,
  "ai-cover-letter-generator": AICoverLetter,
  "ai-blog-generator": AIBlogGenerator,
  "ai-email-writer": AIEmailWriter,
  "ai-resume-builder": AIResumeBuilder,
  "ai-question-generator": AIQuestionGenerator,
  "ai-pdf-summarizer": AIPdfSummarizer,
  "ai-chat": AIChat,

  // Media
  "video-thumbnail-extractor": VideoThumbnail,
  "video-metadata-viewer": VideoMetadata,
  "audio-metadata-viewer": AudioMetadata,
  "voice-recorder": VoiceRecorder,
  "audio-player": MediaPlayer,
  "video-player": MediaPlayer,
  "video-trimmer": VideoTrimmer,
  "youtube-player": YouTubePlayer,
};
