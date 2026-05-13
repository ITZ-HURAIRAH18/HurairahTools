'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, X, GripVertical } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function PdfMerge() {
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

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    process(files, async (inputFiles) => {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of inputFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'merged-document.pdf');
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
        accept="application/pdf" 
        multiple 
        maxSizeMB={100}
      />

      {files.length > 0 && (
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-text">Files to Merge ({files.length})</h3>
            <span className="text-xs text-text-muted">Drag order to arrange</span>
          </div>

          <div className="flex flex-col gap-2">
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
                <File className="h-5 w-5 text-accent" />
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
            {isProcessing && <ProgressBar progress={50} label="Merging PDFs locally..." />}
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleMerge} 
                disabled={files.length < 2 || isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Merging...' : 'Merge PDFs'}
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
