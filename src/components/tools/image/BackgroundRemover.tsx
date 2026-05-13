'use client';

import React, { useState } from 'react';
import { DropZone } from '@/components/ui/DropZone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';

export function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  
  const { isProcessing, error, process, reset } = useFileProcessor<File, Blob>();

  const handleFileSelect = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResultBlob(null);
    setProgress(0);
    setStatusText('');
  };

  const handleRemoveBg = async () => {
    if (!file) return;

    process(file, async (inputFile) => {
      setStatusText('Loading AI models (this takes a moment on first run)...');
      
      const config = {
        device: 'cpu' as const,
        progress: (key: string, current: number, total: number) => {
          if (key === 'compute:inference') {
            setStatusText('Analyzing image...');
            setProgress(Math.round((current / total) * 100));
          } else if (key.startsWith('fetch:')) {
            setStatusText('Downloading model to browser cache...');
            // Progress for downloading models
            setProgress(Math.round((current / total) * 100));
          }
        }
      };

      try {
        const { removeBackground } = await import('@imgly/background-removal');
        const result = await removeBackground(inputFile, config);
        setResultBlob(result);
        setPreviewUrl(URL.createObjectURL(result));
        setStatusText('Background removed successfully!');
        return result;
      } catch (err: any) {
        throw new Error(err.message || 'Failed to remove background');
      }
    });
  };

  const handleDownload = () => {
    if (resultBlob && file) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      downloadBlob(resultBlob, `${nameWithoutExt}-nobg.png`);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setProgress(0);
    setStatusText('');
    reset();
  };

  // Clean up object URLs
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-4 rounded-lg border border-border-soft bg-surface-2 p-4">
                <ImageIcon className="h-8 w-8 text-accent" />
                <div>
                  <p className="font-medium text-text truncate max-w-[200px]">{file.name}</p>
                  <p className="text-sm text-text-muted">{formatBytes(file.size)}</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                {isProcessing && (
                  <div className="space-y-2">
                    <ProgressBar progress={progress} label={statusText} />
                  </div>
                )}
                
                {!resultBlob ? (
                  <Button 
                    onClick={handleRemoveBg} 
                    disabled={isProcessing}
                    className="w-full gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isProcessing ? 'Processing AI...' : 'Remove Background'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDownload} 
                    className="w-full gap-2 bg-success text-black hover:bg-success/90"
                  >
                    Download Transparent PNG
                  </Button>
                )}
                
                <Button variant="ghost" onClick={handleReset} disabled={isProcessing}>
                  Start Over
                </Button>
              </div>
            </Card>

            <div className="rounded-lg border border-success/20 bg-success/5 p-4 text-sm text-success flex gap-3">
              <Sparkles className="h-5 w-5 shrink-0" />
              <p>Powered by local WASM AI. Your image never leaves your browser. First run downloads a small model cache.</p>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7">
            <Card className="flex flex-col h-full min-h-[400px] overflow-hidden">
              <div className="border-b border-border-soft bg-surface px-4 py-3">
                <h3 className="text-sm font-medium text-text">Live Preview</h3>
              </div>
              <div className="relative flex-1 flex items-center justify-center bg-[url('/checkerboard.png')] bg-repeat p-4">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#808080_25%,transparent_25%,transparent_75%,#808080_75%,#808080),linear-gradient(45deg,#808080_25%,transparent_25%,transparent_75%,#808080_75%,#808080)]" style={{ backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
                
                {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="relative z-10 max-h-[500px] object-contain rounded drop-shadow-2xl transition-opacity duration-500"
                    style={{ opacity: isProcessing ? 0.5 : 1 }}
                  />
                )}
                
                {isProcessing && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
