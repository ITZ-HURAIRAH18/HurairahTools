'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob } from '@/lib/utils';
import { Crop as CropIcon, Image as ImageIcon } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [aspectLabel, setAspectLabel] = useState('Free');
  const imgRef = useRef<HTMLImageElement>(null);

  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, crop: PixelCrop }, Blob>();

  const handleFileSelect = (files: File[]) => {
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    setFile(files[0]);
    setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
    setCompletedCrop(null);
    setAspect(undefined);
    setAspectLabel('Free');

    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(files[0]);
  };

  const handleAspectChange = (label: string, value: number | undefined) => {
    setAspectLabel(label);
    setAspect(value);
    // Center crop with new aspect ratio
    if (value && imgRef.current) {
      const { width, height } = imgRef.current;
      const w = Math.min(width, height * value);
      const h = w / value;
      setCrop({
        unit: 'px',
        width: w,
        height: h,
        x: (width - w) / 2,
        y: (height - h) / 2,
      });
    }
  };

  const generateCrop = async () => {
    if (!completedCrop || !imgRef.current || !file) return;

    process({ file, crop: completedCrop }, async (params) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');

      const image = imgRef.current!;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = params.crop.width * scaleX;
      canvas.height = params.crop.height * scaleY;

      ctx.imageSmoothingQuality = 'high';

      const cropX = params.crop.x * scaleX;
      const cropY = params.crop.y * scaleY;
      const cropWidth = params.crop.width * scaleX;
      const cropHeight = params.crop.height * scaleY;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) reject(new Error('Canvas is empty'));
            else {
              downloadBlob(blob, `cropped-${params.file.name}`);
              resolve(blob);
            }
          },
          params.file.type,
          1
        );
      });
    });
  };

  const handleReset = () => {
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    setFile(null);
    setImgSrc('');
    setCompletedCrop(null);
    reset();
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <DropZone 
          onFileSelect={handleFileSelect} 
          accept="image/*" 
          maxSizeMB={20}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between rounded-lg border border-border-soft bg-surface-2 p-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-6 w-6 text-accent shrink-0" />
                  <p className="font-medium text-text truncate max-w-[120px] text-sm">{file.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>Change</Button>
              </div>

              <div className="mb-6 space-y-4">
                <div>
                  <label className="mb-3 block text-sm font-medium text-text">Aspect Ratio</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Free', val: undefined },
                      { label: '1:1', val: 1 },
                      { label: '16:9', val: 16 / 9 },
                      { label: '4:3', val: 4 / 3 },
                      { label: 'Stories (9:16)', val: 9 / 16 },
                    ].map((ar) => (
                      <button
                        key={ar.label}
                        onClick={() => handleAspectChange(ar.label, ar.val)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors border ${
                          aspectLabel === ar.label 
                            ? 'bg-accent/10 border-accent text-accent' 
                            : 'bg-surface border-border-soft text-text-muted hover:text-text'
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {isProcessing && <ProgressBar progress={50} label="Cropping image locally..." />}
                
                <Button 
                  onClick={generateCrop} 
                  disabled={isProcessing || !completedCrop?.width || !completedCrop?.height}
                  className="w-full gap-2"
                >
                  <CropIcon className="h-4 w-4" />
                  {isProcessing ? 'Processing...' : 'Download Cropped Image'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Editor Column */}
          <div className="lg:col-span-8">
            <Card className="flex flex-col h-full min-h-[500px] overflow-hidden bg-surface-2 p-4 items-center justify-center">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[600px] max-w-full"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    className="max-h-[600px] w-auto max-w-full object-contain"
                  />
                </ReactCrop>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
