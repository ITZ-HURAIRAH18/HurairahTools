'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, FileMinus2 } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function PdfDeletePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState('');
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, ranges: string }, Blob>();

  const handleFileSelect = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
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
          for (let i = start; i <= end; i++) pages.add(i - 1); 
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num >= 1 && num <= max) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => b - a); // Sort descending to safely remove
  };

  const handleDelete = async () => {
    if (!file || !totalPages || !pageRanges) return;
    
    const targetPages = parseRanges(pageRanges, totalPages);
    if (targetPages.length === 0) {
      alert("Invalid page ranges. Please check and try again.");
      return;
    }

    if (targetPages.length === totalPages) {
      alert("You cannot delete all pages in the document.");
      return;
    }

    process({ file, ranges: pageRanges }, async ({ file }) => {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Remove pages in descending order so indices don't shift for upcoming removals
      for (const pageIndex of targetPages) {
        pdfDoc.removePage(pageIndex);
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `edited-${file.name}`);
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
            <Button variant="ghost" size="sm" onClick={handleReset}>Change</Button>
          </div>

          <div className="mb-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Pages to Delete
              </label>
              <Input 
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder="e.g. 1-3, 5, 7"
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
            {isProcessing && <ProgressBar progress={50} label="Deleting pages locally..." />}
            
            <Button 
              onClick={handleDelete} 
              variant="danger"
              disabled={isProcessing || !pageRanges || !totalPages}
              className="w-full gap-2"
            >
              <FileMinus2 className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Delete Selected Pages'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
