'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, FileOutput } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState('');
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, ranges: string }, Blob>();

  const handleFileSelect = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    // Quick load to get total pages
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
    } catch (err) {
      console.error("Failed to load PDF for page count", err);
    }
  };

  const parseRanges = (rangesStr: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = rangesStr.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= max) {
          for (let i = start; i <= end; i++) pages.add(i - 1); // 0-indexed for pdf-lib
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num >= 1 && num <= max) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !totalPages || !pageRanges) return;
    
    const targetPages = parseRanges(pageRanges, totalPages);
    if (targetPages.length === 0) {
      alert("Invalid page ranges. Please check and try again.");
      return;
    }

    process({ file, ranges: pageRanges }, async ({ file }) => {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(originalPdf, targetPages);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `split-${file.name}`);
      return blob;
    });
  };

  const handleReset = () => {
    setFile(null);
    setPageRanges('');
    setTotalPages(null);
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
                <p className="text-sm text-text-muted">
                  {formatBytes(file.size)} • {totalPages ? `${totalPages} Pages` : 'Loading...'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>Change File</Button>
          </div>

          <div className="mb-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Pages to Extract
              </label>
              <Input 
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
              />
              <p className="mt-2 text-xs text-text-muted">
                Enter page numbers and/or page ranges separated by commas.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Splitting PDF locally..." />}
            
            <Button 
              onClick={handleSplit} 
              disabled={isProcessing || !pageRanges || !totalPages}
              className="w-full gap-2"
            >
              <FileOutput className="h-4 w-4" />
              {isProcessing ? 'Extracting...' : 'Extract Pages'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
