'use client';

import React, { useState } from 'react';
import { minify } from 'html-minifier-terser';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useClipboard } from '@/hooks/useClipboard';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Code, Copy, Download, Zap } from 'lucide-react';

export function HtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { copiedText, copyWithFeedback } = useClipboard();

  const handleMinify = async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Use html-minifier-terser
      // Note: in a true browser environment, html-minifier-terser might require a specific browser build
      // If it fails, we fall back to a basic regex minifier.
      let minified = '';
      try {
        minified = await minify(input, {
          collapseWhitespace: true,
          removeComments: true,
          removeAttributeQuotes: true,
          minifyJS: true,
          minifyCSS: true,
          removeOptionalTags: true,
        });
      } catch (terserErr) {
        // Basic fallback regex minifier if the library throws in the browser context
        console.warn("html-minifier-terser failed, falling back to regex minify", terserErr);
        minified = input
          .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
          .replace(/>\s+</g, '><') // Remove space between tags
          .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
          .trim();
      }

      setOutput(minified);
    } catch (err: any) {
      setError(err.message || "Failed to minify HTML.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, 'minified.html');
  };

  const originalSize = new Blob([input]).size;
  const newSize = new Blob([output]).size;
  const savedBytes = originalSize - newSize;
  const savedPercent = originalSize > 0 ? ((savedBytes / originalSize) * 100).toFixed(1) : '0';

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Input */}
        <Card className="flex flex-col h-full border-border-soft">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface rounded-t-xl">
            <h3 className="text-sm font-medium flex items-center gap-2 text-text">
              <Code className="h-4 w-4 text-accent" />
              Raw HTML
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); setError(null); }}>
                Clear
              </Button>
              <Button size="sm" onClick={handleMinify} disabled={!input || isProcessing} className="gap-2 bg-accent text-white hover:bg-accent-soft">
                <Zap className="h-3 w-3 fill-current" />
                {isProcessing ? 'Minifying...' : 'Minify'}
              </Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML code here..."
            className="flex-1 resize-none border-0 rounded-none bg-surface-2 font-mono text-sm leading-relaxed focus-visible:ring-0 p-4 text-text"
            spellCheck={false}
          />
          <div className="border-t border-border-soft bg-surface-2 p-3 text-xs text-text-muted flex justify-between items-center">
            {error ? <span className="text-danger">{error}</span> : <span />}
            <span>Size: {formatBytes(originalSize)}</span>
          </div>
        </Card>

        {/* Output */}
        <Card className="flex flex-col h-full border-border-soft bg-surface-2 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface rounded-t-xl z-10">
            <h3 className="text-sm font-medium text-text">
              Minified Output
            </h3>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyWithFeedback(output)} 
                disabled={!output}
                className="gap-2 bg-surface"
              >
                <Copy className="h-4 w-4" />
                {copiedText === output ? 'Copied' : 'Copy'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleDownload} 
                disabled={!output}
                className="gap-2 bg-surface text-accent border-accent/20 hover:bg-accent/10"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative bg-[#0d0d12] flex flex-col z-10">
            {output ? (
              <Textarea
                value={output}
                readOnly
                className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-xs leading-relaxed focus-visible:ring-0 p-4 text-accent break-all"
                spellCheck={false}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-text-muted">
                Minified HTML will appear here...
              </div>
            )}
          </div>
          
          {output && (
            <div className="border-t border-border-soft bg-success/10 p-3 text-xs text-success flex justify-between items-center z-10 font-medium">
              <span>New Size: {formatBytes(newSize)}</span>
              <span>Reduced by {savedPercent}% ({formatBytes(savedBytes)} saved)</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
