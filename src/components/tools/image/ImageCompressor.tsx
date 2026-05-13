'use client';

import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Minimize } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80); // 1-100
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, quality: number }, File>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
    setCompressedFile(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    process({ file, quality }, async (params) => {
      const options = {
        maxSizeMB: params.file.size / 1024 / 1024, // allow same max size initially
        useWebWorker: true,
        initialQuality: params.quality / 100,
      };

      const compressedBlob = await imageCompression(params.file, options);
      const output = new File([compressedBlob], `compressed-${params.file.name}`, {
        type: params.file.type,
      });
      
      setCompressedFile(output);
      return output;
    });
  };

  const handleDownload = () => {
    if (compressedFile) {
      downloadBlob(compressedFile, compressedFile.name);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedFile(null);
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <DropZone 
          onFileSelect={handleFileSelect} 
          accept="image/*" 
          maxSizeMB={50}
        />
      ) : (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between rounded-lg border border-border-soft bg-surface-2 p-4">
            <div className="flex items-center gap-4">
              <ImageIcon className="h-8 w-8 text-accent" />
              <div>
                <p className="font-medium text-text">{file.name}</p>
                <div className="flex gap-2 text-sm text-text-muted">
                  <span>Original: {formatBytes(file.size)}</span>
                  {compressedFile && (
                    <>
                      <span>→</span>
                      <span className="text-success font-medium">New: {formatBytes(compressedFile.size)}</span>
                      <span>({Math.round((1 - compressedFile.size / file.size) * 100)}% smaller)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>Change</Button>
          </div>

          <div className="mb-6 space-y-4">
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-text">
                <span>Quality</span>
                <span>{quality}%</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={quality}
                onChange={(e) => {
                  setQuality(Number(e.target.value));
                  setCompressedFile(null); // invalidate current result
                }}
                className="w-full accent-accent"
              />
              <p className="mt-2 text-xs text-text-muted flex justify-between">
                <span>Lower quality (smaller file)</span>
                <span>Higher quality (larger file)</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Compressing image locally..." />}
            
            {!compressedFile ? (
              <Button 
                onClick={handleCompress} 
                disabled={isProcessing}
                className="w-full gap-2"
              >
                <Minimize className="h-4 w-4" />
                {isProcessing ? 'Compressing...' : 'Compress Image'}
              </Button>
            ) : (
              <Button 
                onClick={handleDownload} 
                className="w-full gap-2"
              >
                Download Compressed Image
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
