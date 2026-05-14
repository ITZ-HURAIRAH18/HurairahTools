'use client';

import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, RotateCw, RotateCcw } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { Tabs } from '@/components/ui/Tabs';

export function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<'90' | '180' | '270'>('90');
  const [target, setTarget] = useState<'all' | 'odd' | 'even'>('all');
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, angle: number, target: string }, Blob>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
  };

  const handleRotate = async () => {
    if (!file) return;

    process({ file, angle: Number(angle), target }, async (params) => {
      const arrayBuffer = await params.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const pageNum = index + 1;
        const isOdd = pageNum % 2 !== 0;
        const isEven = pageNum % 2 === 0;

        if (
          params.target === 'all' ||
          (params.target === 'odd' && isOdd) ||
          (params.target === 'even' && isEven)
        ) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + params.angle));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadBlob(blob, `rotated-${params.file.name}`);
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
              <label className="mb-3 block text-sm font-medium text-text">Rotation Angle</label>
              <Tabs 
                activeTab={angle} 
                onChange={(v) => setAngle(v as any)} 
                tabs={[
                  { label: '90° Right', value: '90' },
                  { label: '180° Upside Down', value: '180' },
                  { label: '90° Left (270°)', value: '270' },
                ]} 
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-text">Pages to Rotate</label>
              <Tabs 
                activeTab={target} 
                onChange={(v) => setTarget(v as any)} 
                tabs={[
                  { label: 'All Pages', value: 'all' },
                  { label: 'Odd Pages (1, 3, 5...)', value: 'odd' },
                  { label: 'Even Pages (2, 4, 6...)', value: 'even' },
                ]} 
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Rotating pages locally..." />}
            
            <Button 
              onClick={handleRotate} 
              disabled={isProcessing}
              className="w-full gap-2"
            >
              <RotateCw className="h-4 w-4" />
              {isProcessing ? 'Rotating...' : 'Rotate PDF'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
