'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, Link as LinkIcon } from 'lucide-react';

export function UrlEncoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { copied, copyToClipboard } = useClipboard();

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
      setError(null);
    } catch (err: any) {
      setOutput('');
      setError('Invalid URL encoding format.');
    }
  };

  React.useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }
    handleProcess();
  }, [input, mode]);

  // Try to parse query params if mode is decode and we have a valid URL or query string
  const getQueryParams = () => {
    if (mode !== 'decode' || !output) return null;
    try {
      let searchStr = output;
      if (output.includes('?')) {
        searchStr = output.split('?')[1];
      }
      if (!searchStr) return null;

      const params = new URLSearchParams(searchStr);
      const entries = Array.from(params.entries());
      if (entries.length === 0) return null;
      return entries;
    } catch {
      return null;
    }
  };

  const queryParams = getQueryParams();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center mb-2">
        <Tabs 
          activeTab={mode} 
          onChange={(v) => {
            setMode(v as any);
            setInput(output);
          }} 
          tabs={[
            { label: 'Encode URL', value: 'encode' },
            { label: 'Decode URL', value: 'decode' },
          ]}
          className="w-full max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[400px]">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface">
            <h3 className="text-sm font-medium flex items-center gap-2 text-text">
              <LinkIcon className="h-4 w-4 text-accent" />
              {mode === 'encode' ? 'Raw URL / String' : 'Encoded URL'}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setInput('')}>Clear</Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? "https://example.com/?q=hello world" : "https%3A%2F%2Fexample.com%2F%3Fq%3Dhello%20world"}
            className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-sm focus-visible:ring-0 p-4"
          />
        </Card>

        <Card className="flex flex-col h-[400px] bg-surface-2 border-border-soft">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface">
            <h3 className="text-sm font-medium text-text">
              {mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}
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

      {queryParams && (
        <Card className="overflow-hidden">
          <div className="border-b border-border-soft bg-surface px-6 py-4">
            <h3 className="text-sm font-medium text-text">Parsed Query Parameters</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text">
              <thead className="bg-surface-2 text-text-muted border-b border-border-soft">
                <tr>
                  <th className="px-6 py-3 font-medium w-1/3">Key</th>
                  <th className="px-6 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {queryParams.map(([key, value], i) => (
                  <tr key={i} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-accent">{key}</td>
                    <td className="px-6 py-3 font-mono text-xs break-all">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
