'use client';

import React, { useState, useRef } from 'react';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';
import { formatBytes, downloadBlob } from '@/lib/utils';
import { Image as ImageIcon, Copy, Download, Code } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';

export function ImageToBase64() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  // Encode state
  const [file, setFile] = useState<File | null>(null);
  const [base64Output, setBase64Output] = useState('');
  const [includePrefix, setIncludePrefix] = useState(true);
  
  // Decode state
  const [base64Input, setBase64Input] = useState('');
  const [decodedImgSrc, setDecodedImgSrc] = useState('');

  const { copied, copyToClipboard } = useClipboard();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setBase64Output(reader.result);
      }
    };
    reader.readAsDataURL(selected);
  };

  const handleDecode = () => {
    let input = base64Input.trim();
    if (!input) return;

    // Check if it has data URI prefix
    if (!input.startsWith('data:image/')) {
      // Try to guess mime type from base64 signature
      // /9j/ = jpg, iVBORw0KGgo = png, UklGR = webp, R0lGODdh = gif
      let mime = 'image/jpeg';
      if (input.startsWith('iVBORw0KGgo')) mime = 'image/png';
      else if (input.startsWith('UklGR')) mime = 'image/webp';
      else if (input.startsWith('R0lGODdh') || input.startsWith('R0lGODlh')) mime = 'image/gif';
      
      input = `data:${mime};base64,${input}`;
    }

    setDecodedImgSrc(input);
  };

  const handleDownloadDecoded = async () => {
    if (!decodedImgSrc) return;
    
    try {
      const res = await fetch(decodedImgSrc);
      const blob = await res.blob();
      const ext = blob.type.split('/')[1] || 'png';
      downloadBlob(blob, `decoded-image.${ext}`);
    } catch (err) {
      alert("Failed to download image. Invalid base64 data.");
    }
  };

  const getFinalOutput = () => {
    if (!base64Output) return '';
    if (includePrefix) return base64Output;
    return base64Output.split(',')[1] || base64Output;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center mb-2">
        <Tabs 
          activeTab={mode} 
          onChange={(v) => setMode(v as any)} 
          tabs={[
            { label: 'Image to Base64', value: 'encode' },
            { label: 'Base64 to Image', value: 'decode' },
          ]}
          className="w-full max-w-sm"
        />
      </div>

      {mode === 'encode' && (
        <div className="flex flex-col gap-6">
          {!file ? (
            <DropZone 
              onFileSelect={handleFileSelect} 
              accept="image/*" 
              maxSizeMB={20}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <div className="mb-6 flex items-center justify-between rounded-lg border border-border-soft bg-surface-2 p-4">
                  <div className="flex items-center gap-4">
                    <ImageIcon className="h-8 w-8 text-accent shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-medium text-text truncate">{file.name}</p>
                      <p className="text-sm text-text-muted">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setBase64Output(''); }}>Change</Button>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includePrefix}
                      onChange={(e) => setIncludePrefix(e.target.checked)}
                      className="rounded border-border bg-surface accent-accent"
                    />
                    Include Data URI prefix (data:image/png;base64,...)
                  </label>
                </div>

                <div className="relative">
                  <Textarea 
                    value={getFinalOutput()} 
                    readOnly 
                    className="min-h-[250px] font-mono text-xs break-all resize-none bg-surface-2"
                  />
                  <div className="absolute top-2 right-2">
                    <Button 
                      size="sm" 
                      onClick={() => copyToClipboard(getFinalOutput())}
                      className="gap-2 shadow-md"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-right text-xs text-text-muted">
                  Length: {getFinalOutput().length.toLocaleString()} characters
                </div>
              </Card>

              <Card className="p-6 flex flex-col items-center justify-center bg-surface-2 min-h-[400px]">
                <h3 className="text-sm font-medium text-text mb-4 w-full border-b border-border-soft pb-2">Image Preview</h3>
                <img 
                  src={base64Output} 
                  alt="Preview" 
                  className="max-w-full max-h-[300px] object-contain rounded border border-border shadow-sm"
                />
              </Card>
            </div>
          )}
        </div>
      )}

      {mode === 'decode' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6 flex flex-col">
            <h3 className="text-sm font-medium text-text mb-4">Paste Base64 String</h3>
            <Textarea 
              ref={inputRef}
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Paste base64 string here (with or without data:image/... prefix)"
              className="flex-1 min-h-[300px] font-mono text-xs mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleDecode} className="flex-1 gap-2" disabled={!base64Input.trim()}>
                <Code className="h-4 w-4" />
                Decode Image
              </Button>
              <Button variant="outline" onClick={() => { setBase64Input(''); setDecodedImgSrc(''); }}>
                Clear
              </Button>
            </div>
          </Card>

          <Card className="p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between border-b border-border-soft pb-2 mb-4">
              <h3 className="text-sm font-medium text-text">Decoded Result</h3>
              {decodedImgSrc && (
                <Button size="sm" variant="ghost" onClick={handleDownloadDecoded} className="h-8 text-accent">
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-[url('/checkerboard.png')] bg-repeat rounded border border-border-soft overflow-hidden relative">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#808080_25%,transparent_25%,transparent_75%,#808080_75%,#808080),linear-gradient(45deg,#808080_25%,transparent_25%,transparent_75%,#808080_75%,#808080)]" style={{ backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
              
              {decodedImgSrc ? (
                <img 
                  src={decodedImgSrc} 
                  alt="Decoded" 
                  className="max-w-full max-h-[300px] object-contain relative z-10 drop-shadow-md"
                  onError={() => {
                    alert("Invalid image data. Could not decode.");
                    setDecodedImgSrc('');
                  }}
                />
              ) : (
                <div className="text-text-muted text-sm relative z-10 flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                  <p>Decoded image will appear here</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
