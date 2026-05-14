'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, FileJson, CheckCircle2, XCircle } from 'lucide-react';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { hasCopied: copied, copyToClipboard } = useClipboard();

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const renderHighlightedJson = (jsonStr: string) => {
    if (!jsonStr) return null;
    
    // Simple custom tokenizer for syntax highlighting
    const html = jsonStr.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-amber'; // Number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-accent font-medium'; // Key
          } else {
            cls = 'text-success'; // String
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-violet font-medium'; // Boolean
        } else if (/null/.test(match)) {
          cls = 'text-text-faint font-medium'; // Null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );

    return <code dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[600px] bg-surface">
          <div className="flex items-center justify-between border-b border-border-soft p-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FileJson className="h-4 w-4 text-accent" />
              Input JSON
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleMinify} disabled={!input}>Minify</Button>
              <Button size="sm" onClick={handleFormat} disabled={!input}>Format</Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder='Paste your JSON here... e.g. {"hello": "world"}'
            className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-xs focus-visible:ring-0 p-4"
          />
          {error && (
            <div className="bg-danger/10 p-3 text-xs text-danger flex items-center gap-2 border-t border-danger/20">
              <XCircle className="h-4 w-4 shrink-0" />
              <span className="font-mono">{error}</span>
            </div>
          )}
          {!error && input && (
            <div className="bg-success/10 p-3 text-xs text-success flex items-center gap-2 border-t border-success/20">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Valid JSON</span>
            </div>
          )}
          <div className="border-t border-border-soft p-3 flex justify-end">
             <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
          </div>
        </Card>

        <Card className="flex flex-col h-[600px] bg-surface-2 border-border-soft">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface">
            <h3 className="text-sm font-medium">Output</h3>
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
          <div className="flex-1 overflow-auto p-4 bg-[#0d0d12]">
            {output ? (
              <pre className="font-mono text-xs leading-relaxed text-text">
                {renderHighlightedJson(output)}
              </pre>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-muted">
                Formatted output will appear here
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
