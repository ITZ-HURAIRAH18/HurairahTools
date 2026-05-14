'use client';

import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, Droplet } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, text: string }, Blob>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
  };

  const handleAddWatermark = async () => {
    if (!file || !watermarkText) return;

    process({ file, text: watermarkText }, async (params) => {
      const arrayBuffer = await params.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = 60;
        const textWidth = font.widthOfTextAtSize(params.text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(params.text, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - textHeight / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadBlob(blob, `watermarked-${params.file.name}`);
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

          <div className="mb-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Watermark Text</label>
              <Input 
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL"
              />
              <p className="mt-2 text-xs text-text-muted">
                Text will be placed diagonally in the center of every page.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Applying watermark..." />}
            
            <Button 
              onClick={handleAddWatermark} 
              disabled={isProcessing || !watermarkText}
              className="w-full gap-2"
            >
              <Droplet className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Add Watermark'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
