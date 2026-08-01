'use client';

import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, FileText } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const { isProcessing, error, process, reset } = useFileProcessor<File, Blob>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (!file) return;

    process(file, async (inputFile) => {
      const arrayBuffer = await inputFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const docChildren: Paragraph[] = [];

      // Helper function to clean up and map PDF fonts to standard Word fonts and detect bold/italic
      const parsePdfFont = (fontName: string, style: any) => {
        let family = style?.fontFamily || 'Arial';
        let bold = false;
        let italic = false;

        const lowerFamily = family.toLowerCase();
        const lowerName = fontName ? fontName.toLowerCase() : '';

        // Detect bold from font family name or font name
        if (
          lowerFamily.includes('bold') || 
          lowerFamily.includes('-bd') || 
          lowerName.includes('bold') || 
          lowerName.includes('-bd') ||
          lowerName.includes('black') ||
          lowerName.includes('heavy') ||
          lowerName.includes('w7')
        ) {
          bold = true;
        }

        // Detect italic
        if (
          lowerFamily.includes('italic') || 
          lowerFamily.includes('oblique') || 
          lowerName.includes('italic') || 
          lowerName.includes('oblique') ||
          lowerName.includes('-it')
        ) {
          italic = true;
        }

        let cleanFamily = family;
        // Clean prefix (some subset fonts like ABCDEF+FontName)
        cleanFamily = cleanFamily.replace(/^[A-Z]{6}\+/g, '');
        // Clean common suffix properties in PDF font names
        cleanFamily = cleanFamily.replace(/(PS)?-(Bold|Italic|BoldItalic|Oblique|MT|PSMT|BMT|IMT|BoldMT|ItalicMT).*$/gi, '');
        cleanFamily = cleanFamily.replace(/,.*$/g, ''); // Remove fallback lists

        const lowerClean = cleanFamily.toLowerCase();
        if (lowerClean === 'serif' || lowerClean.includes('times')) {
          cleanFamily = 'Times New Roman';
        } else if (lowerClean === 'sans-serif' || lowerClean.includes('helvetica') || lowerClean.includes('arial')) {
          cleanFamily = 'Arial';
        } else if (lowerClean === 'monospace' || lowerClean.includes('courier')) {
          cleanFamily = 'Courier New';
        } else if (lowerClean.includes('calibri')) {
          cleanFamily = 'Calibri';
        } else if (lowerClean.includes('georgia')) {
          cleanFamily = 'Georgia';
        } else if (lowerClean.includes('verdana')) {
          cleanFamily = 'Verdana';
        } else if (lowerClean.includes('cambria')) {
          cleanFamily = 'Cambria';
        } else if (lowerClean.includes('garamond')) {
          cleanFamily = 'Garamond';
        }

        if (!cleanFamily || cleanFamily.trim() === '') {
          cleanFamily = 'Arial';
        }

        return { family: cleanFamily, bold, italic };
      };

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const styles = textContent.styles || {};

        const textItems = textContent.items as any[];
        let lastY: number | null = null;
        
        // Track baseline coordinates and font size of the previous line flushed to compute vertical spacing
        let previousFlushedLineY: number | null = null;
        let previousFlushedLineFontSize = 11;

        let currentLineItems: { str: string; x: number; fontScale: number; fontName: string }[] = [];
        let currentLineStartX: number | null = null;

        const flushLine = (
          items: { str: string; x: number; fontScale: number; fontName: string }[],
          align: 'left' | 'center' | 'right',
          spacingBefore: number
        ) => {
          if (items.length === 0) return;

          const runs: TextRun[] = [];
          
          for (let k = 0; k < items.length; k++) {
            const curr = items[k];
            let runText = curr.str;
            
            if (k > 0) {
              const prev = items[k - 1];
              // Calculate gap and append non-breaking spaces if there's a significant gap
              const gap = curr.x - (prev.x + prev.str.length * prev.fontScale);
              if (gap > prev.fontScale * 0.5) {
                const extraSpaces = Math.max(1, Math.round(gap / prev.fontScale));
                runText = '\u00A0'.repeat(extraSpaces) + runText;
              }
            }

            const styleObj = styles[curr.fontName];
            const fontInfo = parsePdfFont(curr.fontName, styleObj);
            // Docx size is in half-points. E.g. fontScale of 12 points = size 24.
            const fontSize = Math.max(8, Math.round(curr.fontScale * 2));

            runs.push(new TextRun({
              text: runText,
              font: fontInfo.family,
              size: fontSize,
              bold: fontInfo.bold,
              italics: fontInfo.italic,
            }));
          }

          docChildren.push(new Paragraph({
            alignment: align,
            spacing: { 
              before: spacingBefore, 
              after: 0,
              line: 240, // 240 twentieths of a point = 12pt line spacing (1.0)
              lineRule: 'auto'
            },
            children: runs,
          }));
        };

        for (const item of textItems) {
          if (item.str.trim() === '') continue;

          const y = item.transform[5];
          const x = item.transform[4];
          const fontScale = Math.abs(item.transform[0]);
          const fontName = item.fontName;

          // New line detection: Y changed significantly
          if (lastY !== null && Math.abs(y - lastY) > 5) {
            // Determine alignment from the line's starting X position relative to page center
            const pageWidth = page.view[2];
            const center = pageWidth / 2;
            let align: 'left' | 'center' | 'right' = 'left';
            if (currentLineStartX !== null) {
              const lineEndX = currentLineItems.length > 0
                ? currentLineItems[currentLineItems.length - 1].x + currentLineItems[currentLineItems.length - 1].str.length * currentLineItems[currentLineItems.length - 1].fontScale
                : currentLineStartX;
              const lineMid = (currentLineStartX + lineEndX) / 2;
              const distFromCenter = Math.abs(lineMid - center);
              if (distFromCenter < pageWidth * 0.08) {
                align = 'center';
              } else if (currentLineStartX > pageWidth * 0.5) {
                align = 'right';
              }
            }

            // Calculate spacingBefore
            let spacingBefore = 40; // 2pt gap default fallback
            if (previousFlushedLineY === null) {
              const pageHeight = page.view[3] - page.view[1];
              // First line of the page: offset from the top margins
              const topOffset = pageHeight - lastY;
              spacingBefore = Math.max(0, Math.round((topOffset - 72) * 20));
            } else {
              const baselineGap = previousFlushedLineY - lastY;
              const expectedLineHeight = previousFlushedLineFontSize * 1.15;
              const extraSpace = baselineGap - expectedLineHeight;
              spacingBefore = extraSpace > 2 ? Math.round(extraSpace * 20) : 40;
            }

            flushLine(currentLineItems, align, spacingBefore);
            
            // Set stats for the next line's spacing calculation
            previousFlushedLineY = lastY;
            previousFlushedLineFontSize = Math.max(...currentLineItems.map(it => it.fontScale));

            currentLineItems = [];
            currentLineStartX = null;
          }

          if (currentLineStartX === null) currentLineStartX = x;
          currentLineItems.push({ str: item.str, x, fontScale, fontName });
          lastY = y;
        }

        // Flush remaining items on the page
        if (currentLineItems.length > 0) {
          const pageWidth = page.view[2];
          const center = pageWidth / 2;
          let align: 'left' | 'center' | 'right' = 'left';
          if (currentLineStartX !== null) {
            const lineEndX = currentLineItems[currentLineItems.length - 1].x + currentLineItems[currentLineItems.length - 1].str.length * currentLineItems[currentLineItems.length - 1].fontScale;
            const lineMid = (currentLineStartX + lineEndX) / 2;
            const distFromCenter = Math.abs(lineMid - center);
            if (distFromCenter < pageWidth * 0.08) {
              align = 'center';
            } else if (currentLineStartX > pageWidth * 0.5) {
              align = 'right';
            }
          }

          let spacingBefore = 40;
          if (previousFlushedLineY === null) {
            const pageHeight = page.view[3] - page.view[1];
            const topOffset = pageHeight - lastY!;
            spacingBefore = Math.max(0, Math.round((topOffset - 72) * 20));
          } else {
            const baselineGap = previousFlushedLineY - lastY!;
            const expectedLineHeight = previousFlushedLineFontSize * 1.15;
            const extraSpace = baselineGap - expectedLineHeight;
            spacingBefore = extraSpace > 2 ? Math.round(extraSpace * 20) : 40;
          }

          flushLine(currentLineItems, align, spacingBefore);
        }

        docChildren.push(new Paragraph({ children: [] })); // Spacing between pages

        setProgress(Math.round((i / totalPages) * 100));
      }

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, `${file.name.replace('.pdf', '')}.docx`);
      return blob;
    });
  };

  const handleReset = () => {
    setFile(null);
    setProgress(0);
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <DropZone 
          onFileSelect={handleFileSelect} 
          accept="application/pdf" 
          maxSizeMB={50}
        />
      ) : (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between rounded-lg border border-border-soft bg-surface-2 p-4">
            <div className="flex items-center gap-4">
              <File className="h-8 w-8 text-accent" />
              <div>
                <p className="font-medium text-text">{file.name}</p>
                <p className="text-sm text-text-muted">{formatBytes(file.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>Change</Button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={progress} label="Extracting text to Word..." />}
            
            <Button 
              onClick={handleConvert} 
              disabled={isProcessing}
              className="w-full gap-2"
            >
              <FileText className="h-4 w-4" />
              {isProcessing ? 'Converting...' : 'Convert to Word (.docx)'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
