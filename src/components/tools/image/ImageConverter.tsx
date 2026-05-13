'use client';

import React, { useState } from 'react';
import heic2any from 'heic2any';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Image as ImageIcon, ArrowRightLeft } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { Tabs } from '@/components/ui/Tabs';

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  
  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, format: string }, Blob>();

  const handleFileSelect = (files: File[]) => {
    setFile(files[0]);
    setConvertedBlob(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    process({ file, format: targetFormat }, async (params) => {
      let imageBlob: Blob | File = params.file;

      // Handle HEIC/HEIF specially
      if (params.file.type === 'image/heic' || params.file.type === 'image/heif' || params.file.name.toLowerCase().endsWith('.heic')) {
        const converted = await heic2any({
          blob: params.file,
          toType: 'image/jpeg',
          quality: 0.9,
        });
        imageBlob = Array.isArray(converted) ? converted[0] : converted;
      }

      return new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          
          // Fill background for formats that might not support transparency
          if (params.format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              setConvertedBlob(blob);
              resolve(blob);
            } else {
              reject(new Error(`Failed to convert image to ${params.format}`));
            }
          }, params.format, 0.92);
        };
        img.onerror = () => reject(new Error("Failed to load image for conversion"));
        img.src = URL.createObjectURL(imageBlob);
      });
    });
  };

  const handleDownload = () => {
    if (convertedBlob && file) {
      const extMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      };
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      downloadBlob(convertedBlob, `${nameWithoutExt}-converted.${extMap[targetFormat]}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedBlob(null);
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <DropZone 
          onFileSelect={handleFileSelect} 
          accept="image/*,.heic,.heif" 
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
            <label className="mb-3 block text-sm font-medium text-text">Convert to Format</label>
            <Tabs 
              activeTab={targetFormat} 
              onChange={(v) => {
                setTargetFormat(v as any);
                setConvertedBlob(null);
              }} 
              tabs={[
                { label: 'JPG', value: 'image/jpeg' },
                { label: 'PNG', value: 'image/png' },
                { label: 'WebP', value: 'image/webp' },
              ]} 
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isProcessing && <ProgressBar progress={50} label="Converting image locally..." />}
            
            {!convertedBlob ? (
              <Button 
                onClick={handleConvert} 
                disabled={isProcessing}
                className="w-full gap-2"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {isProcessing ? 'Converting...' : 'Convert Image'}
              </Button>
            ) : (
              <Button 
                onClick={handleDownload} 
                className="w-full gap-2"
              >
                Download Converted Image
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
