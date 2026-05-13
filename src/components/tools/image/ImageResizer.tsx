'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Scaling, Link as LinkIcon, Unlink } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, w: number, h: number }, Blob>();

  const handleFileSelect = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setResizedBlob(null);

    // Get initial dimensions
    const img = new Image();
    img.onload = () => {
      setWidth(img.width.toString());
      setHeight(img.height.toString());
      setAspectRatio(img.width / img.height);
    };
    img.src = URL.createObjectURL(selected);
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const num = parseInt(val, 10);
    if (maintainRatio && !isNaN(num) && num > 0) {
      setHeight(Math.round(num / aspectRatio).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const num = parseInt(val, 10);
    if (maintainRatio && !isNaN(num) && num > 0) {
      setWidth(Math.round(num * aspectRatio).toString());
    }
  };

  const handleResize = async () => {
    if (!file) return;
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      alert("Please enter valid positive dimensions.");
      return;
    }

    process({ file, w, h }, async (params) => {
      return new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = params.w;
          canvas.height = params.h;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0, params.w, params.h);
          
          canvas.toBlob((blob) => {
            if (blob) {
              setResizedBlob(blob);
              resolve(blob);
            } else {
              reject(new Error("Failed to create image blob"));
            }
          }, params.file.type, 0.95); // Maintain high quality
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(params.file);
      });
    });
  };

  const handleDownload = () => {
    if (resizedBlob && file) {
      downloadBlob(resizedBlob, `resized-${file.name}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setWidth('');
    setHeight('');
    setResizedBlob(null);
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
                <p className="text-sm text-text-muted">{formatBytes(file.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>Change</Button>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-text">New Dimensions (Pixels)</label>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-text-muted">Width</label>
                <Input 
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  min="1"
                />
              </div>
              
              <button 
                onClick={() => setMaintainRatio(!maintainRatio)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${maintainRatio ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-text-muted'}`}
                title={maintainRatio ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
              >
                {maintainRatio ? <LinkIcon className="h-4 w-4" /> : <Unlink className="h-4 w-4" />}
              </button>

              <div className="flex-1">
                <label className="mb-1 block text-xs text-text-muted">Height</label>
                <Input 
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  min="1"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Resizing image locally..." />}
            
            {!resizedBlob ? (
              <Button 
                onClick={handleResize} 
                disabled={isProcessing}
                className="w-full gap-2"
              >
                <Scaling className="h-4 w-4" />
                {isProcessing ? 'Resizing...' : 'Resize Image'}
              </Button>
            ) : (
              <Button 
                onClick={handleDownload} 
                className="w-full gap-2"
              >
                Download Resized Image
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
