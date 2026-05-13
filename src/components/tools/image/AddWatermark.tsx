'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Droplet } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function AddWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('© COPYRIGHT');
  const [opacity, setOpacity] = useState(50);
  const [angle, setAngle] = useState(45);
  const [fontSize, setFontSize] = useState(60);
  const [watermarkedBlob, setWatermarkedBlob] = useState<Blob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewImg, setPreviewImg] = useState<HTMLImageElement | null>(null);

  const { isProcessing, error, process, reset } = useFileProcessor<{ file: File, text: string, opacity: number, angle: number, size: number }, Blob>();

  const handleFileSelect = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setWatermarkedBlob(null);

    const img = new Image();
    img.onload = () => {
      setPreviewImg(img);
    };
    img.src = URL.createObjectURL(selected);
  };

  const drawWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.translate(width / 2, height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    
    // Add black stroke for visibility on light backgrounds
    ctx.strokeStyle = `rgba(0, 0, 0, ${(opacity / 100) * 0.5})`;
    ctx.lineWidth = Math.max(1, fontSize / 20);
    ctx.strokeText(watermarkText, 0, 0);
    ctx.fillText(watermarkText, 0, 0);
    
    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  // Live preview
  useEffect(() => {
    if (previewImg && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate preview scale to fit in UI
      const maxPreviewWidth = 600;
      let scale = 1;
      if (previewImg.width > maxPreviewWidth) {
        scale = maxPreviewWidth / previewImg.width;
      }

      canvas.width = previewImg.width * scale;
      canvas.height = previewImg.height * scale;

      ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
      
      // Draw watermark scaled for preview
      ctx.save();
      ctx.scale(scale, scale);
      drawWatermark(ctx, previewImg.width, previewImg.height);
      ctx.restore();
    }
  }, [previewImg, watermarkText, opacity, angle, fontSize]);

  const handleApply = async () => {
    if (!file || !previewImg) return;

    process({ file, text: watermarkText, opacity, angle, size: fontSize }, async (params) => {
      return new Promise<Blob>((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = previewImg.width;
        canvas.height = previewImg.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Canvas context error"));
          return;
        }

        ctx.drawImage(previewImg, 0, 0);
        drawWatermark(ctx, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            setWatermarkedBlob(blob);
            resolve(blob);
          } else {
            reject(new Error("Failed to generate image"));
          }
        }, params.file.type, 0.95);
      });
    });
  };

  const handleDownload = () => {
    if (watermarkedBlob && file) {
      downloadBlob(watermarkedBlob, `watermarked-${file.name}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewImg(null);
    setWatermarkedBlob(null);
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
                  <label className="mb-2 block text-sm font-medium text-text">Watermark Text</label>
                  <Input 
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="mb-2 flex items-center justify-between text-sm font-medium text-text">
                    <span>Opacity</span>
                    <span>{opacity}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center justify-between text-sm font-medium text-text">
                    <span>Angle</span>
                    <span>{angle}°</span>
                  </label>
                  <input 
                    type="range" 
                    min="-180" 
                    max="180" 
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center justify-between text-sm font-medium text-text">
                    <span>Font Size</span>
                    <span>{fontSize}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="300" 
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {isProcessing && <ProgressBar progress={50} label="Applying watermark..." />}
                
                {!watermarkedBlob ? (
                  <Button 
                    onClick={handleApply} 
                    disabled={isProcessing}
                    className="w-full gap-2"
                  >
                    <Droplet className="h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Apply Watermark'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDownload} 
                    className="w-full gap-2 bg-success text-black hover:bg-success/90"
                  >
                    Download Watermarked Image
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-8">
            <Card className="flex flex-col h-full min-h-[500px] overflow-hidden bg-[url('/checkerboard.png')] bg-repeat relative p-4 items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#808080_25%,transparent_25%,transparent_75%,#808080_75%,#808080),linear-gradient(45deg,#808080_25%,transparent_25%,transparent_75%,#808080_75%,#808080)]" style={{ backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
              <canvas 
                ref={canvasRef} 
                className="max-h-[600px] max-w-full object-contain relative z-10 shadow-xl border border-border" 
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
