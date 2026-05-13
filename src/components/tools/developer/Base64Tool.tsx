'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, FileText, Code } from 'lucide-react';

export function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { copied, copyToClipboard } = useClipboard();

  // UTF-8 safe base64 encoding/decoding
  const encodeBase64 = (str: string) => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  };

  const decodeBase64 = (str: string) => {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  };

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
      setError(null);
    } catch (err: any) {
      setOutput('');
      setError(mode === 'encode' ? 'Failed to encode text.' : 'Invalid Base64 string. Cannot decode.');
    }
  };

  // Auto process when input or mode changes
  React.useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }
    handleProcess();
  }, [input, mode]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center mb-2">
        <Tabs 
          activeTab={mode} 
          onChange={(v) => {
            setMode(v as any);
            setInput(output); // Swap input/output for convenience
          }} 
          tabs={[
            { label: 'Encode to Base64', value: 'encode' },
            { label: 'Decode from Base64', value: 'decode' },
          ]}
          className="w-full max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface">
            <h3 className="text-sm font-medium flex items-center gap-2 text-text">
              {mode === 'encode' ? <FileText className="h-4 w-4 text-accent" /> : <Code className="h-4 w-4 text-accent" />}
              {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setInput('')}>Clear</Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? "Type or paste text to encode..." : "Paste base64 string to decode..."}
            className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-sm focus-visible:ring-0 p-4"
          />
        </Card>

        {/* Output */}
        <Card className="flex flex-col h-[500px] bg-surface-2 border-border-soft">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface">
            <h3 className="text-sm font-medium text-text">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </h3>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => copyToClipboard(output)} 
              disabled={!output}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          
          {error ? (
            <div className="p-4 text-sm text-danger font-mono bg-danger/10 m-4 rounded">
              {error}
            </div>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-sm focus-visible:ring-0 p-4 text-text"
            />
          )}
        </Card>
      </div>
    </div>
  );
}
