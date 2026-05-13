import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronRight, Lock } from 'lucide-react';
import { tools } from '@/lib/tools-registry';
import { Icon } from '@/components/ui/Icon';
import { ToolSidebar } from '@/components/layout/ToolSidebar';
import { Badge } from '@/components/ui/Badge';

interface ToolPageProps {
  params: { slug: string };
}

// Map slugs to dynamic imports
const componentMap: Record<string, any> = {
  'pdf-merge': dynamic(() => import('@/components/tools/pdf/PdfMerge').then(mod => mod.PdfMerge)),
  'pdf-split': dynamic(() => import('@/components/tools/pdf/PdfSplit').then(mod => mod.PdfSplit)),
  'pdf-compress': dynamic(() => import('@/components/tools/pdf/PdfCompress').then(mod => mod.PdfCompress)),
  'pdf-to-jpg': dynamic(() => import('@/components/tools/pdf/PdfToJpg').then(mod => mod.PdfToJpg)),
  'jpg-to-pdf': dynamic(() => import('@/components/tools/pdf/JpgToPdf').then(mod => mod.JpgToPdf)),
  'pdf-to-word': dynamic(() => import('@/components/tools/pdf/PdfToWord').then(mod => mod.PdfToWord)),
  'pdf-to-excel': dynamic(() => import('@/components/tools/pdf/PdfToExcel').then(mod => mod.PdfToExcel)),
  'pdf-rotate': dynamic(() => import('@/components/tools/pdf/PdfRotate').then(mod => mod.PdfRotate)),
  'pdf-delete-pages': dynamic(() => import('@/components/tools/pdf/PdfDeletePages').then(mod => mod.PdfDeletePages)),
  'pdf-page-numbers': dynamic(() => import('@/components/tools/pdf/PdfPageNumbers').then(mod => mod.PdfPageNumbers)),
  'pdf-watermark': dynamic(() => import('@/components/tools/pdf/PdfWatermark').then(mod => mod.PdfWatermark)),
  'pdf-password-protect': dynamic(() => import('@/components/tools/pdf/PdfPasswordProtect').then(mod => mod.PdfPasswordProtect)),
  
  // Image Tools
  'image-compressor': dynamic(() => import('@/components/tools/image/ImageCompressor').then(mod => mod.ImageCompressor)),
  'image-resizer': dynamic(() => import('@/components/tools/image/ImageResizer').then(mod => mod.ImageResizer)),
  'image-converter': dynamic(() => import('@/components/tools/image/ImageConverter').then(mod => mod.ImageConverter)),
  'background-remover': dynamic(() => import('@/components/tools/image/BackgroundRemover').then(mod => mod.BackgroundRemover)),
  'image-cropper': dynamic(() => import('@/components/tools/image/ImageCropper').then(mod => mod.ImageCropper)),
  'bulk-image-resizer': dynamic(() => import('@/components/tools/image/BulkImageResizer').then(mod => mod.BulkImageResizer)),
  'image-to-base64': dynamic(() => import('@/components/tools/image/ImageToBase64').then(mod => mod.ImageToBase64)),
  'add-watermark': dynamic(() => import('@/components/tools/image/AddWatermark').then(mod => mod.AddWatermark)),
  'color-picker': dynamic(() => import('@/components/tools/image/ColorPicker').then(mod => mod.ColorPicker)),
  'metadata-viewer': dynamic(() => import('@/components/tools/image/MetadataViewer').then(mod => mod.MetadataViewer)),
  
  // Developer Tools
  'json-formatter': dynamic(() => import('@/components/tools/developer/JsonFormatter').then(mod => mod.JsonFormatter)),
  'jwt-decoder': dynamic(() => import('@/components/tools/developer/JwtDecoder').then(mod => mod.JwtDecoder)),
  'base64-tool': dynamic(() => import('@/components/tools/developer/Base64Tool').then(mod => mod.Base64Tool)),
  'url-encoder': dynamic(() => import('@/components/tools/developer/UrlEncoder').then(mod => mod.UrlEncoder)),
  'regex-tester': dynamic(() => import('@/components/tools/developer/RegexTester').then(mod => mod.RegexTester)),
  'hash-generator': dynamic(() => import('@/components/tools/developer/HashGenerator').then(mod => mod.HashGenerator)),
  'uuid-generator': dynamic(() => import('@/components/tools/developer/UuidGenerator').then(mod => mod.UuidGenerator)),
  'lorem-ipsum': dynamic(() => import('@/components/tools/developer/LoremIpsum').then(mod => mod.LoremIpsum)),
  'color-converter': dynamic(() => import('@/components/tools/developer/ColorConverter').then(mod => mod.ColorConverter)),
  'markdown-editor': dynamic(() => import('@/components/tools/developer/MarkdownEditor').then(mod => mod.MarkdownEditor)),
  'diff-checker': dynamic(() => import('@/components/tools/developer/DiffChecker').then(mod => mod.DiffChecker)),
  'cron-parser': dynamic(() => import('@/components/tools/developer/CronParser').then(mod => mod.CronParser)),
  'code-formatter': dynamic(() => import('@/components/tools/developer/CodeFormatter').then(mod => mod.CodeFormatter)),
  'css-minifier': dynamic(() => import('@/components/tools/developer/CssMinifier').then(mod => mod.CssMinifier)),
  'html-minifier': dynamic(() => import('@/components/tools/developer/HtmlMinifier').then(mod => mod.HtmlMinifier)),

  // University Tools
  'gpa-calculator': dynamic(() => import('@/components/tools/university/GpaCalculator')),
  'deadline-tracker': dynamic(() => import('@/components/tools/university/DeadlineTracker')),
  'citation-generator': dynamic(() => import('@/components/tools/university/CitationGenerator')),
  'plagiarism-checker': dynamic(() => import('@/components/tools/university/PlagiarismChecker')),
  'word-counter': dynamic(() => import('@/components/tools/university/WordCounter')),
  'pomodoro-timer': dynamic(() => import('@/components/tools/university/PomodoroTimer')),
  'unit-converter': dynamic(() => import('@/components/tools/university/UnitConverter')),
  'equation-evaluator': dynamic(() => import('@/components/tools/university/EquationEvaluator')),
  'resume-builder': dynamic(() => import('@/components/tools/university/ResumeBuilder')),
  'timetable-builder': dynamic(() => import('@/components/tools/university/TimetableBuilder')),
};

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  // Load the specific tool component, or a placeholder if not built yet
  const ToolComponent = componentMap[tool.slug] || (() => (
    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-text-muted">
      This tool is currently under development. Check back later!
    </div>
  ));

  const categoryNames = {
    pdf: 'PDF Tools',
    image: 'Image Tools',
    developer: 'Developer Tools',
    university: 'University Tools',
  };

  return (
    <div className="flex w-full flex-1 max-w-[1600px] mx-auto">
      <ToolSidebar activeSlug={tool.slug} activeCategory={tool.category} />
      
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize">{categoryNames[tool.category]}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-text">{tool.title}</span>
          </nav>

          {/* Tool Header */}
          <header className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--violet))] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Icon name={tool.icon} className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-text">{tool.title}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="indigo" className="uppercase">{tool.category}</Badge>
                    <Badge variant="green" className="gap-1 px-2">
                      <Lock className="h-3 w-3" /> Local
                    </Badge>
                    {tool.isNew && <Badge variant="amber">New</Badge>}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg text-text-muted max-w-2xl">{tool.description}</p>
          </header>

          {/* Tool Implementation Area */}
          <div className="w-full">
            <ToolComponent />
          </div>
        </div>
      </main>
    </div>
  );
}
