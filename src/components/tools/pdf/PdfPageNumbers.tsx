'use client';

import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs } from '@/components/ui/Tabs';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, ListOrdered } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function PdfPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right'>('bottom-center');
  const [startNum, setStartNum] = useState(1);
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, pos: string, start: number }, Blob>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
  };

  const handleAddNumbers = async () => {
    if (!file) return;

    process({ file, pos: position, start: startNum }, async (params) => {
      const arrayBuffer = await params.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const text = `${params.start + idx}`;
        const fontSize = 12;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x = width / 2 - textWidth / 2; // bottom-center
        if (params.pos === 'bottom-right') {
          x = width - 40 - textWidth; // bottom-right with 40px padding
        }
        
        const y = 30; // 30px from bottom

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `numbered-${params.file.name}`);
      return blob;
    });
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <DropZone 
          onFileSelect={handleFileSelect} 
          accept="application/pdf" 
          maxSizeMB={100}
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

          <div className="mb-6 space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-text">Position</label>
              <Tabs 
                activeTab={position} 
                onChange={(v) => setPosition(v as any)} 
                tabs={[
                  { label: 'Bottom Center', value: 'bottom-center' },
                  { label: 'Bottom Right', value: 'bottom-right' },
                ]} 
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">Start Number</label>
              <Input 
                type="number"
                value={startNum}
                onChange={(e) => setStartNum(Number(e.target.value) || 1)}
                min={1}
                className="max-w-[200px]"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Adding page numbers..." />}
            
            <Button 
              onClick={handleAddNumbers} 
              disabled={isProcessing}
              className="w-full gap-2"
            >
              <ListOrdered className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Add Page Numbers'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
