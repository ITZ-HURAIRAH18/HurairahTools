'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

const componentMap: Record<string, any> = {
  'pdf-merge': dynamic(() => import('@/components/tools/pdf/PdfMerge').then(mod => mod.PdfMerge), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-split': dynamic(() => import('@/components/tools/pdf/PdfSplit').then(mod => mod.PdfSplit), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-compress': dynamic(() => import('@/components/tools/pdf/PdfCompress').then(mod => mod.PdfCompress), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-to-jpg': dynamic(() => import('@/components/tools/pdf/PdfToJpg').then(mod => mod.PdfToJpg), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'jpg-to-pdf': dynamic(() => import('@/components/tools/pdf/JpgToPdf').then(mod => mod.JpgToPdf), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-to-word': dynamic(() => import('@/components/tools/pdf/PdfToWord').then(mod => mod.PdfToWord), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-to-excel': dynamic(() => import('@/components/tools/pdf/PdfToExcel').then(mod => mod.PdfToExcel), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-rotate': dynamic(() => import('@/components/tools/pdf/PdfRotate').then(mod => mod.PdfRotate), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-delete-pages': dynamic(() => import('@/components/tools/pdf/PdfDeletePages').then(mod => mod.PdfDeletePages), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-page-numbers': dynamic(() => import('@/components/tools/pdf/PdfPageNumbers').then(mod => mod.PdfPageNumbers), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-watermark': dynamic(() => import('@/components/tools/pdf/PdfWatermark').then(mod => mod.PdfWatermark), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pdf-password': dynamic(() => import('@/components/tools/pdf/PdfPasswordProtect').then(mod => mod.PdfPasswordProtect), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  
  // Image Tools
  'image-compressor': dynamic(() => import('@/components/tools/image/ImageCompressor').then(mod => mod.ImageCompressor), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'image-resizer': dynamic(() => import('@/components/tools/image/ImageResizer').then(mod => mod.ImageResizer), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'image-converter': dynamic(() => import('@/components/tools/image/ImageConverter').then(mod => mod.ImageConverter), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'background-remover': dynamic(() => import('@/components/tools/image/BackgroundRemover').then(mod => mod.BackgroundRemover), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'image-cropper': dynamic(() => import('@/components/tools/image/ImageCropper').then(mod => mod.ImageCropper), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'bulk-image-resizer': dynamic(() => import('@/components/tools/image/BulkImageResizer').then(mod => mod.BulkImageResizer), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'image-to-base64': dynamic(() => import('@/components/tools/image/ImageToBase64').then(mod => mod.ImageToBase64), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'add-watermark': dynamic(() => import('@/components/tools/image/AddWatermark').then(mod => mod.AddWatermark), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'color-picker': dynamic(() => import('@/components/tools/image/ColorPicker').then(mod => mod.ColorPicker), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'metadata-viewer': dynamic(() => import('@/components/tools/image/MetadataViewer').then(mod => mod.MetadataViewer), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  
  // Developer Tools
  'json-formatter': dynamic(() => import('@/components/tools/developer/JsonFormatter').then(mod => mod.JsonFormatter), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'jwt-decoder': dynamic(() => import('@/components/tools/developer/JwtDecoder').then(mod => mod.JwtDecoder), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'base64-tool': dynamic(() => import('@/components/tools/developer/Base64Tool').then(mod => mod.Base64Tool), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'url-encoder': dynamic(() => import('@/components/tools/developer/UrlEncoder').then(mod => mod.UrlEncoder), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'regex-tester': dynamic(() => import('@/components/tools/developer/RegexTester').then(mod => mod.RegexTester), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'hash-generator': dynamic(() => import('@/components/tools/developer/HashGenerator').then(mod => mod.HashGenerator), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'uuid-generator': dynamic(() => import('@/components/tools/developer/UuidGenerator').then(mod => mod.UuidGenerator), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'lorem-ipsum': dynamic(() => import('@/components/tools/developer/LoremIpsum').then(mod => mod.LoremIpsum), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'color-converter': dynamic(() => import('@/components/tools/developer/ColorConverter').then(mod => mod.ColorConverter), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'markdown-editor': dynamic(() => import('@/components/tools/developer/MarkdownEditor').then(mod => mod.MarkdownEditor), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'diff-checker': dynamic(() => import('@/components/tools/developer/DiffChecker').then(mod => mod.DiffChecker), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'cron-parser': dynamic(() => import('@/components/tools/developer/CronParser').then(mod => mod.CronParser), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'code-formatter': dynamic(() => import('@/components/tools/developer/CodeFormatter').then(mod => mod.CodeFormatter), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'css-minifier': dynamic(() => import('@/components/tools/developer/CssMinifier').then(mod => mod.CssMinifier), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'html-minifier': dynamic(() => import('@/components/tools/developer/HtmlMinifier').then(mod => mod.HtmlMinifier), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
 
  // University Tools
  'gpa-calculator': dynamic(() => import('@/components/tools/university/GpaCalculator'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'deadline-tracker': dynamic(() => import('@/components/tools/university/DeadlineTracker'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'citation-generator': dynamic(() => import('@/components/tools/university/CitationGenerator'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'plagiarism-checker': dynamic(() => import('@/components/tools/university/PlagiarismChecker'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'word-counter': dynamic(() => import('@/components/tools/university/WordCounter'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'pomodoro-timer': dynamic(() => import('@/components/tools/university/PomodoroTimer'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'unit-converter': dynamic(() => import('@/components/tools/university/UnitConverter'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'equation-evaluator': dynamic(() => import('@/components/tools/university/EquationEvaluator'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'resume-builder': dynamic(() => import('@/components/tools/university/ResumeBuilder'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
  'timetable-builder': dynamic(() => import('@/components/tools/university/TimetableBuilder'), { ssr: false, loading: () => <Skeleton height="h-64" /> }),
};

export function ToolRenderer({ slug }: { slug: string }) {
  const ToolComponent = componentMap[slug];
  if (!ToolComponent) return null;
  return <ToolComponent />;
}
