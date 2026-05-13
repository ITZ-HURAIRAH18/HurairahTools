'use client';

import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, Table } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export function PdfToExcel() {
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
      
      const workbook = XLSX.utils.book_new();

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Simple heuristic: group by Y position to form rows
        const textItems = textContent.items as any[];
        const rowsMap = new Map<number, { text: string, x: number }[]>();
        
        for (const item of textItems) {
          const y = Math.round(item.transform[5] / 5) * 5; // Group items within 5 units of Y
          if (!rowsMap.has(y)) rowsMap.set(y, []);
          rowsMap.get(y)!.push({ text: item.str, x: item.transform[4] });
        }

        const sortedY = Array.from(rowsMap.keys()).sort((a, b) => b - a); // Top to bottom
        const sheetData: any[][] = [];

        for (const y of sortedY) {
          const rowItems = rowsMap.get(y)!.sort((a, b) => a.x - b.x); // Left to right
          const rowText = rowItems.map(item => item.text).filter(t => t.trim().length > 0);
          if (rowText.length > 0) {
            sheetData.push(rowText);
          }
        }

        if (sheetData.length > 0) {
          const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
          XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
        }

        setProgress(Math.round((i / totalPages) * 100));
      }

      if (workbook.SheetNames.length === 0) {
        throw new Error("No tabular data could be extracted from this PDF.");
      }

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      downloadBlob(blob, `${file.name.replace('.pdf', '')}.xlsx`);
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
            {isProcessing && <ProgressBar progress={progress} label="Extracting tabular data..." />}
            
            <Button 
              onClick={handleConvert} 
              disabled={isProcessing}
              className="w-full gap-2"
            >
              <Table className="h-4 w-4" />
              {isProcessing ? 'Converting...' : 'Convert to Excel (.xlsx)'}
            </Button>
            <p className="text-center text-xs text-text-muted">
              Note: This tool attempts to detect table structures based on text position. Complex tables may not map perfectly.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
