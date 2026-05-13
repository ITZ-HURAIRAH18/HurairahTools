'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, Minimize2 } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const { isProcessing, error, process, reset } = useFileProcessor<File, Blob>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
    setOriginalSize(files[0].size);
    setCompressedSize(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    process(file, async (inputFile) => {
      // Basic compression by rebuilding the PDF without unused objects
      // Note: True image downsampling in browser requires complex extraction.
      // This approach relies on pdf-lib's internal optimization on save.
      const arrayBuffer = await inputFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Creating a new document and copying pages can also remove cruft
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => newPdf.addPage(page));

      // Save with object streams to compress structural data
      const pdfBytes = await newPdf.save({ useObjectStreams: true });
      
      setCompressedSize(pdfBytes.byteLength);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `compressed-${file.name}`);
      return blob;
    });
  };

  const handleReset = () => {
    setFile(null);
    setOriginalSize(0);
    setCompressedSize(null);
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
                <div className="flex gap-2 text-sm text-text-muted">
                  <span>Original: {formatBytes(originalSize)}</span>
                  {compressedSize && (
                    <>
                      <span>→</span>
                      <span className="text-success font-medium">New: {formatBytes(compressedSize)}</span>
                    </>
                  )}
                </div>
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
            {isProcessing && <ProgressBar progress={50} label="Compressing PDF locally..." />}
            
            <Button 
              onClick={handleCompress} 
              disabled={isProcessing || compressedSize !== null}
              className="w-full gap-2"
            >
              <Minimize2 className="h-4 w-4" />
              {isProcessing ? 'Compressing...' : compressedSize !== null ? 'Done' : 'Compress PDF'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
