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

        // Group items by Y position to form rows, using PDF X position to detect columns
        const textItems = textContent.items as any[];
        const rowsMap = new Map<number, { str: string; x: number; w: number }[]>();

        for (const item of textItems) {
          const y = Math.round(item.transform[5] / 5) * 5; // Group within 5 units of Y
          if (!rowsMap.has(y)) rowsMap.set(y, []);
          const fontScale = item.transform[0];
          rowsMap.get(y)!.push({ str: item.str, x: item.transform[4], w: fontScale * item.str.length });
        }

        // Collect gaps across all rows to find a consistent column threshold
        const allRowGaps: number[] = [];
        for (const [, rowItems] of rowsMap) {
          rowItems.sort((a, b) => a.x - b.x);
          for (let k = 1; k < rowItems.length; k++) {
            const gap = rowItems[k].x - (rowItems[k - 1].x + rowItems[k - 1].w);
            if (gap > 0) allRowGaps.push(gap);
          }
        }

        // Find the most common positive gap — that's our column separator threshold
        let colGapThreshold = 10; // default
        if (allRowGaps.length > 0) {
          const sorted = [...allRowGaps].sort((a, b) => a - b);
          const median = sorted[Math.floor(sorted.length / 2)];
          colGapThreshold = median * 1.5 + 5;
        }

        const sortedY = Array.from(rowsMap.keys()).sort((a, b) => b - a); // Top to bottom
        const sheetData: any[][] = [];

        for (const y of sortedY) {
          let rowItems = rowsMap.get(y)!;
          rowItems.sort((a, b) => a.x - b.x);

          // Build columns by merging items whose X-gap is below the threshold
          const columns: { str: string; hasPadding: boolean }[] = [];
          for (const item of rowItems) {
            const itemEnd = item.x + item.w;
            if (columns.length === 0) {
              columns.push({ str: item.str, hasPadding: false });
            } else {
              const lastCol = columns[columns.length - 1];
              // Approximate last column end using text length × font scale
              const lastColEnd = lastCol.str.length * (item.w / item.str.length) * 0.8;
              // We'll just rely on explicit gap from raw data — recalculate using rowItems position
              // Find the gap between this item and the previous item in raw order
              const prevItem = rowItems[rowItems.indexOf(item) - 1];
              if (prevItem) {
                const realGap = item.x - (prevItem.x + prevItem.w);
                if (realGap > colGapThreshold) {
                  columns.push({ str: item.str, hasPadding: true });
                } else {
                  columns[columns.length - 1].str += item.str;
                }
              }
            }
          }

          const rowText = columns.map(c => c.str.trim()).filter(t => t.length > 0);
          if (rowText.length > 0) {
            sheetData.push(rowText);
          }
        }

        if (sheetData.length > 0) {
          const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
          // Set consistent column widths to preserve PDF proportional spacing
          const colWidths: number[] = [];
          for (let c = 0; c < sheetData[0].length; c++) {
            let maxLen = 0;
            for (const row of sheetData) {
              if (row[c]) maxLen = Math.max(maxLen, String(row[c]).length);
            }
            colWidths.push(maxLen + 4); // pad by 4 for visibility
          }
          worksheet['!cols'] = colWidths.map(w => ({ wch: w }));

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
