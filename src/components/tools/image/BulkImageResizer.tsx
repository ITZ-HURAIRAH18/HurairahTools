'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Scaling, X } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { Tabs } from '@/components/ui/Tabs';

export function BulkImageResizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'percentage' | 'dimensions'>('percentage');
  const [scale, setScale] = useState(50);
  const [width, setWidth] = useState<string>('800');
  
  const { isProcessing, error, process, reset } = useFileProcessor<{ files: File[], mode: string, scale: number, w: number }, Blob>();
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResize = async () => {
    if (files.length === 0) return;
    const w = parseInt(width, 10);

    if (mode === 'dimensions' && (isNaN(w) || w <= 0)) {
      alert("Please enter a valid width.");
      return;
    }

    process({ files, mode, scale, w }, async (params) => {
      const zip = new JSZip();
      let completed = 0;

      for (let i = 0; i < params.files.length; i++) {
        const file = params.files[i];
        
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            
            let targetW = img.width;
            let targetH = img.height;

            if (params.mode === 'percentage') {
              targetW = Math.max(1, Math.round(img.width * (params.scale / 100)));
              targetH = Math.max(1, Math.round(img.height * (params.scale / 100)));
            } else {
              targetW = params.w;
              const ratio = img.width / img.height;
              targetH = Math.max(1, Math.round(params.w / ratio)); // auto maintain ratio based on width
            }

            canvas.width = targetW;
            canvas.height = targetH;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, targetW, targetH);
              canvas.toBlob((blob) => {
                if (blob) {
                  const ext = file.name.substring(file.name.lastIndexOf('.'));
                  const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
                  zip.file(`${nameWithoutExt}-resized${ext}`, blob);
                }
                resolve();
              }, file.type, 0.9);
            } else {
              resolve();
            }
          };
          img.onerror = () => resolve(); // Skip failed images
          img.src = URL.createObjectURL(file);
        });

        completed++;
        setProgress(Math.round((completed / params.files.length) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, 'resized-images.zip');
      return zipBlob;
    });
  };

  const handleReset = () => {
    setFiles([]);
    setProgress(0);
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      <DropZone 
        onFileSelect={handleFileSelect} 
        accept="image/*" 
        multiple
        maxSizeMB={50}
      />

      {files.length > 0 && (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-medium text-text">Images ({files.length})</h3>
            <Button variant="ghost" size="sm" onClick={handleReset}>Clear All</Button>
          </div>

          <div className="mb-6 flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-border-soft bg-surface-2 p-2">
                <ImageIcon className="h-4 w-4 text-accent shrink-0" />
                <div className="flex-1 overflow-hidden flex justify-between items-center">
                  <p className="truncate text-sm text-text">{file.name}</p>
                  <p className="text-xs text-text-muted shrink-0 ml-2">{formatBytes(file.size)}</p>
                </div>
                <button onClick={() => removeFile(i)} className="rounded-md p-1 text-text-muted hover:text-danger shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6 space-y-6 border-t border-border-soft pt-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-text">Resize Method</label>
              <Tabs 
                activeTab={mode} 
                onChange={(v) => setMode(v as any)} 
                tabs={[
                  { label: 'By Percentage', value: 'percentage' },
                  { label: 'By Target Width', value: 'dimensions' },
                ]} 
              />
            </div>

            {mode === 'percentage' ? (
              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-medium text-text">
                  <span>Scale Percentage</span>
                  <span>{scale}%</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="200" 
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <p className="mt-2 text-xs text-text-muted">
                  Images will be scaled proportionally. 100% = original size.
                </p>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-text">Target Width (px)</label>
                <Input 
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  min="1"
                />
                <p className="mt-2 text-xs text-text-muted">
                  Height will be automatically calculated to maintain aspect ratio.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={progress} label="Resizing images and creating ZIP..." />}
            
            <Button 
              onClick={handleResize} 
              disabled={isProcessing || files.length === 0}
              className="w-full gap-2"
            >
              <Scaling className="h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Resize & Download ZIP'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
