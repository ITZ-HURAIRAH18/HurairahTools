'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Pipette, Copy } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';

export function ColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hoverColor, setHoverColor] = useState<{ r: number, g: number, b: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ r: number, g: number, b: number } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { copied, copyToClipboard } = useClipboard();

  const handleFileSelect = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setSelectedColor(null);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Calculate display size (max 800px width)
      const maxWidth = 800;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    const url = URL.createObjectURL(selected);
    setImgSrc(url);
    img.src = url;
  };

  const getColorAtPixel = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return { r: pixel[0], g: pixel[1], b: pixel[2] };
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const color = getColorAtPixel(e);
    if (color) setHoverColor(color);
  };

  const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const color = getColorAtPixel(e);
    if (color) setSelectedColor(color);
  };

  const handleReset = () => {
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    setFile(null);
    setImgSrc('');
    setSelectedColor(null);
    setHoverColor(null);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const activeColor = selectedColor || hoverColor;
  const hexValue = activeColor ? rgbToHex(activeColor.r, activeColor.g, activeColor.b) : '#000000';
  const rgbValue = activeColor ? `rgb(${activeColor.r}, ${activeColor.g}, ${activeColor.b})` : 'rgb(0, 0, 0)';
  const hslValue = activeColor ? rgbToHsl(activeColor.r, activeColor.g, activeColor.b) : 'hsl(0, 0%, 0%)';

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

              <div className="mb-6 text-center">
                <div className="mb-4 text-sm text-text-muted flex items-center justify-center gap-2">
                  <Pipette className="h-4 w-4" />
                  Hover to inspect, click to select
                </div>
                
                <div 
                  className="mx-auto h-32 w-full rounded-xl border border-border-soft shadow-inner transition-colors duration-75"
                  style={{ backgroundColor: activeColor ? rgbValue : 'transparent' }}
                />
              </div>

              <div className="space-y-3">
                {[
                  { label: 'HEX', value: hexValue },
                  { label: 'RGB', value: rgbValue },
                  { label: 'HSL', value: hslValue },
                ].map((colorObj) => (
                  <div key={colorObj.label} className="flex items-center justify-between rounded-lg bg-surface-2 p-3">
                    <div>
                      <span className="block text-xs font-medium text-text-muted">{colorObj.label}</span>
                      <span className="font-mono text-sm text-text">{activeColor ? colorObj.value : '--'}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(colorObj.value)}
                      disabled={!activeColor}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {copied && (
                <div className="mt-4 text-center text-sm text-success">
                  Copied to clipboard!
                </div>
              )}
            </Card>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-8">
            <Card className="flex flex-col h-full min-h-[500px] overflow-hidden bg-[url('/checkerboard.png')] bg-repeat relative p-4 items-center justify-center cursor-crosshair">
              <canvas 
                ref={canvasRef} 
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onMouseLeave={() => setHoverColor(null)}
                className="max-h-[600px] max-w-full object-contain relative z-10 shadow-xl border border-border" 
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
