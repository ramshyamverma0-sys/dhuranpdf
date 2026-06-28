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

// Maps componentKey -> React component. Some tools share the same key
// (e.g. jpg-to-pdf is reused for png-to-pdf, image-to-pdf, etc.).
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
};
