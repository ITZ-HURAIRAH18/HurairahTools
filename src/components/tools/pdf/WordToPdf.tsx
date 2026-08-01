'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, FileText } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function WordToPdf() {
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
      
      // Create a temporary off-screen container to render the Word document
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '816px'; // standard A4 width in pixels
      container.style.background = '#ffffff';
      document.body.appendChild(container);

      try {
        // Load docx-preview dynamically to avoid SSR issues
        const docx = await import('docx-preview');
        await docx.renderAsync(arrayBuffer, container, undefined, {
          className: 'docx-preview',
          inWrapper: true
        });

        // Give any image resources inside the docx a brief moment to render
        await new Promise((resolve) => setTimeout(resolve, 800));

        // docx-preview renders each page in a section.docx element when inWrapper is true
        let pageElements = Array.from(container.querySelectorAll('section.docx')) as HTMLElement[];
        if (pageElements.length === 0) {
          pageElements = [container];
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < pageElements.length; i++) {
          const pageEl = pageElements[i];

          // Set intermediate progress
          setProgress(Math.round(((i + 0.3) / pageElements.length) * 100));

          const canvas = await html2canvas(pageEl, {
            scale: 2, // higher scale for text crispness
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);

          setProgress(Math.round(((i + 0.8) / pageElements.length) * 100));

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          setProgress(Math.round(((i + 1) / pageElements.length) * 100));
        }

        const pdfBlob = pdf.output('blob');
        downloadBlob(pdfBlob, `${file.name.replace('.docx', '')}.pdf`);
        return pdfBlob;
      } finally {
        // Always clean up the temporary DOM element
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }
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
          accept=".docx" 
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
            {isProcessing && <ProgressBar progress={progress} label="Converting Word to PDF..." />}
            
            <Button 
              onClick={handleConvert} 
              disabled={isProcessing}
              className="w-full gap-2"
            >
              <FileText className="h-4 w-4" />
              {isProcessing ? 'Converting...' : 'Convert to PDF'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
