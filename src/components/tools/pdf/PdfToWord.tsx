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

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const textItems = textContent.items as any[];
        let lastY: number | null = null;
        let currentLineItems: { str: string; x: number; fontScale: number }[] = [];
        let currentLineStartX: number | null = null;

        const flushLine = (items: { str: string; x: number; fontScale: number }[], align: 'left' | 'center' | 'right') => {
          if (items.length === 0) return;

          // Build the text run preserving per-character PDF spacing via non-breaking spaces
          let fullText = items[0].str;
          for (let k = 1; k < items.length; k++) {
            const prev = items[k - 1];
            const curr = items[k];
            const gap = curr.x - (prev.x + prev.str.length * prev.fontScale);
            if (gap > prev.fontScale * 0.5) {
              const extraSpaces = Math.max(1, Math.round(gap / prev.fontScale));
              fullText += '\u00A0'.repeat(extraSpaces);
            }
            fullText += curr.str;
          }

          // Determine a representative font size from the line's items
          const sizes = items.map(it => it.fontScale);
          const avgFontSize = Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length);

          docChildren.push(new Paragraph({
            alignment: align,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: fullText,
                font: 'Courier New',
                size: avgFontSize * 2,
              }),
            ],
          }));
        };

        for (const item of textItems) {
          if (item.str.trim() === '') continue;

          const y = item.transform[5];
          const x = item.transform[4];
          const fontScale = item.transform[0];

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
            flushLine(currentLineItems, align);
            currentLineItems = [];
            currentLineStartX = null;
          }

          if (currentLineStartX === null) currentLineStartX = x;
          currentLineItems.push({ str: item.str, x, fontScale });
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
          flushLine(currentLineItems, align);
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
