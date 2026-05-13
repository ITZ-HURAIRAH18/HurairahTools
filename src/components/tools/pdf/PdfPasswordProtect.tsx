'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { File, Lock } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function PdfPasswordProtect() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, pass: string }, Blob>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
  };

  const handleProtect = async () => {
    if (!file || !password) return;

    process({ file, pass: password }, async (params) => {
      try {
        const arrayBuffer = await params.file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);
        
        // Create a fresh PDF and copy pages (more compatible encryption)
        const pdfDoc = await PDFDocument.create();
        const copiedPages = await pdfDoc.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));

        // Set metadata from source
        const srcMeta = srcPdf.getTitle() || srcPdf.getSubject();
        if (srcMeta) pdfDoc.setTitle(srcPdf.getTitle() || '');
        if (srcPdf.getAuthor()) pdfDoc.setAuthor(srcPdf.getAuthor() || '');
        if (srcPdf.getSubject()) pdfDoc.setSubject(srcPdf.getSubject() || '');

        // Encrypt with AES-256
        pdfDoc.encrypt({
          userPassword: params.pass,
          ownerPassword: params.pass,
          permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: false,
            documentAssembly: false,
            contentAccessibility: true,
          },
        });

        const pdfBytes = await pdfDoc.save({
          useObjectStreams: false, // Better compatibility
        });

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        downloadBlob(blob, `protected-${params.file.name}`);
        return blob;
      } catch (err: any) {
        throw new Error(err.message || 'Failed to encrypt PDF. The file may be corrupted or password too weak.');
      }
    });
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
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
              <label className="mb-2 block text-sm font-medium text-text">Set Open Password</label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
              />
              <p className="mt-2 text-xs text-text-muted">
                This password will be required to open the document. Encrypted locally with AES-256.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Encrypting PDF..." />}
            
            <Button 
              onClick={handleProtect} 
              disabled={isProcessing || !password}
              className="w-full gap-2"
            >
              <Lock className="h-4 w-4" />
              {isProcessing ? 'Encrypting...' : 'Protect Document'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
