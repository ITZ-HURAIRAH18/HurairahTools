'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { FileImage, X, GripVertical } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const { isProcessing, error, process, reset } = useFileProcessor<File[], Blob>();

  const handleFileSelect = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      setFiles((prev) => {
        const copy = [...prev];
        [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
        return copy;
      });
    } else if (direction === 'down' && index < files.length - 1) {
      setFiles((prev) => {
        const copy = [...prev];
        [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
        return copy;
      });
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    process(files, async (inputFiles) => {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of inputFiles) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          throw new Error(`Unsupported image type: ${file.type}. Please use JPG or PNG.`);
        }
        
        const { width, height } = image.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadBlob(blob, 'images.pdf');
      return blob;
    });
  };

  const handleReset = () => {
    setFiles([]);
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      <DropZone 
        onFileSelect={handleFileSelect} 
        accept="image/jpeg, image/png" 
        multiple 
        maxSizeMB={20}
      />

      {files.length > 0 && (
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-text">Images ({files.length})</h3>
            <span className="text-xs text-text-muted">Drag order to arrange</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-border-soft bg-surface-2 p-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveFile(i, 'up')} disabled={i === 0} className="text-text-muted hover:text-text disabled:opacity-30">
                    <GripVertical className="h-4 w-4 rotate-90" />
                  </button>
                  <button onClick={() => moveFile(i, 'down')} disabled={i === files.length - 1} className="text-text-muted hover:text-text disabled:opacity-30">
                    <GripVertical className="h-4 w-4 rotate-90" />
                  </button>
                </div>
                <FileImage className="h-5 w-5 text-accent" />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-text">{file.name}</p>
                  <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
                </div>
                <button onClick={() => removeFile(i)} className="rounded-md p-1 text-text-muted hover:bg-surface hover:text-danger">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Converting to PDF locally..." />}
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleConvert} 
                disabled={files.length === 0 || isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Converting...' : 'Convert to PDF'}
              </Button>
              <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
