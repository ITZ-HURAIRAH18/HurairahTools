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
        
        // Very basic text extraction, grouping by lines based on Y position
        const textItems = textContent.items as any[];
        let lastY: number | null = null;
        let currentLine = '';

        for (const item of textItems) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            if (currentLine.trim()) {
              docChildren.push(new Paragraph({
                children: [new TextRun(currentLine)],
              }));
            }
            currentLine = '';
          }
          currentLine += item.str;
          lastY = item.transform[5];
        }

        if (currentLine.trim()) {
          docChildren.push(new Paragraph({ children: [new TextRun(currentLine)] }));
        }

        // Add page break logic if needed, skipping for simple extraction
        docChildren.push(new Paragraph({ text: '' })); // Spacing between pages

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
