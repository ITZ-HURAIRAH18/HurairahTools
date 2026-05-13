'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, Palette } from 'lucide-react';

export function ColorConverter() {
  const [hex, setHex] = useState('#6366F1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 82%, 67%)');
  const [cmyk, setCmyk] = useState('cmyk(59%, 58%, 0%, 5%)');
  const [error, setError] = useState<string | null>(null);

  const { copiedText, copyWithFeedback } = useClipboard();

  // Color conversion formulas
  const hexToRgb = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16);
      g = parseInt(h[2] + h[2], 16);
      b = parseInt(h[3] + h[3], 16);
    } else if (h.length === 7) {
      r = parseInt(h.substring(1, 3), 16);
      g = parseInt(h.substring(3, 5), 16);
      b = parseInt(h.substring(5, 7), 16);
    }
    return { r, g, b };
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
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    if (k === 1) {
      c = 0; m = 0; y = 0;
    } else {
      c = (c - k) / (1 - k);
      m = (m - k) / (1 - k);
      y = (y - k) / (1 - k);
    }
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    setError(null);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newHex)) {
      const { r, g, b } = hexToRgb(newHex);
      setRgb(`rgb(${r}, ${g}, ${b})`);
      
      const { h, s, l } = rgbToHsl(r, g, b);
      setHsl(`hsl(${h}, ${s}%, ${l}%)`);
      
      const { c, m, y, k } = rgbToCmyk(r, g, b);
      setCmyk(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`);
    } else if (newHex.length > 0 && newHex !== '#') {
      setError("Invalid HEX color format");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          
          {/* Swatch */}
          <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
            <div 
              className="w-40 h-40 rounded-full shadow-2xl border-4 border-surface-2 relative overflow-hidden"
              style={{ backgroundColor: error ? '#000000' : hex }}
            >
              {/* Add an actual native color picker overlay */}
              <input 
                type="color" 
                value={/^#([0-9A-F]{6})$/i.test(hex) ? hex : '#000000'}
                onChange={(e) => updateFromHex(e.target.value.toUpperCase())}
                className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0"
              />
            </div>
            <div className="text-sm font-medium text-text-muted flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Click swatch to pick
            </div>
          </div>

          {/* Inputs */}
          <div className="w-full md:w-2/3 space-y-4">
            {error && <div className="text-danger text-sm">{error}</div>}

            <div className="flex items-center gap-4">
              <label className="w-16 text-sm font-bold text-text uppercase tracking-wider">HEX</label>
              <Input 
                value={hex}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('#')) val = '#' + val;
                  updateFromHex(val);
                }}
                className="font-mono flex-1 uppercase"
              />
              <Button variant="ghost" size="sm" onClick={() => copyWithFeedback(hex)}>
                {copiedText === hex ? 'Copied' : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-16 text-sm font-bold text-accent uppercase tracking-wider">RGB</label>
              <Input 
                value={rgb}
                readOnly
                className="font-mono flex-1 bg-surface-2"
              />
              <Button variant="ghost" size="sm" onClick={() => copyWithFeedback(rgb)}>
                {copiedText === rgb ? 'Copied' : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-16 text-sm font-bold text-violet uppercase tracking-wider">HSL</label>
              <Input 
                value={hsl}
                readOnly
                className="font-mono flex-1 bg-surface-2"
              />
              <Button variant="ghost" size="sm" onClick={() => copyWithFeedback(hsl)}>
                {copiedText === hsl ? 'Copied' : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-16 text-sm font-bold text-amber uppercase tracking-wider">CMYK</label>
              <Input 
                value={cmyk}
                readOnly
                className="font-mono flex-1 bg-surface-2"
              />
              <Button variant="ghost" size="sm" onClick={() => copyWithFeedback(cmyk)}>
                {copiedText === cmyk ? 'Copied' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
