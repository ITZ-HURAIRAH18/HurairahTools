'use client';

import React, { useState } from 'react';
import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';
import * as parserPostcss from 'prettier/plugins/postcss';
import * as parserHtml from 'prettier/plugins/html';

import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useClipboard } from '@/hooks/useClipboard';
import { downloadBlob } from '@/lib/utils';
import { Code, Download, Copy, Play } from 'lucide-react';

type LangType = 'javascript' | 'typescript' | 'css' | 'html' | 'json';

export function CodeFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<LangType>('javascript');
  const [error, setError] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  const { copiedText, copyWithFeedback } = useClipboard();

  const handleFormat = async () => {
    if (!input.trim()) return;
    
    setIsFormatting(true);
    setError(null);
    
    try {
      let formatted = '';
      
      const commonOptions = {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5' as const,
      };

      if (language === 'javascript' || language === 'typescript') {
        formatted = await prettier.format(input, {
          ...commonOptions,
          parser: 'babel',
          plugins: [parserBabel, parserEstree],
        });
      } else if (language === 'css') {
        formatted = await prettier.format(input, {
          ...commonOptions,
          parser: 'css',
          plugins: [parserPostcss],
        });
      } else if (language === 'html') {
        formatted = await prettier.format(input, {
          ...commonOptions,
          parser: 'html',
          plugins: [parserHtml],
        });
      } else if (language === 'json') {
        formatted = await prettier.format(input, {
          ...commonOptions,
          parser: 'json',
          plugins: [parserBabel, parserEstree], // Babel plugin contains the json parser in standalone
        });
      }

      setOutput(formatted);
    } catch (err: any) {
      setError(err.message || "Syntax error. Could not format code.");
      setOutput('');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    
    const extMap: Record<LangType, string> = {
      javascript: 'js',
      typescript: 'ts',
      css: 'css',
      html: 'html',
      json: 'json'
    };
    
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `formatted.${extMap[language]}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center mb-2">
        <Tabs 
          activeTab={language} 
          onChange={(v) => {
            setLanguage(v as LangType);
            setError(null);
          }} 
          tabs={[
            { label: 'JS', value: 'javascript' },
            { label: 'TS', value: 'typescript' },
            { label: 'HTML', value: 'html' },
            { label: 'CSS', value: 'css' },
            { label: 'JSON', value: 'json' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Input */}
        <Card className="flex flex-col h-full border-border-soft">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface rounded-t-xl">
            <h3 className="text-sm font-medium flex items-center gap-2 text-text">
              <Code className="h-4 w-4 text-accent" />
              Raw {language.toUpperCase()}
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); setError(null); }}>
                Clear
              </Button>
              <Button size="sm" onClick={handleFormat} disabled={!input || isFormatting} className="gap-2">
                <Play className="h-3 w-3 fill-current" />
                Format
              </Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
            className="flex-1 resize-none border-0 rounded-none bg-surface-2 font-mono text-sm leading-relaxed focus-visible:ring-0 p-4 text-text"
            spellCheck={false}
          />
        </Card>

        {/* Output */}
        <Card className="flex flex-col h-full border-border-soft bg-surface-2">
          <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface rounded-t-xl">
            <h3 className="text-sm font-medium text-text">
              Formatted Output
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
          
          <div className="flex-1 relative bg-[#0d0d12] rounded-b-xl overflow-hidden flex flex-col">
            {error ? (
              <div className="absolute inset-x-4 top-4 bg-danger/10 p-4 text-sm text-danger font-mono border border-danger/20 rounded-lg whitespace-pre-wrap overflow-auto max-h-[80%]">
                {error}
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder="Prettier output will appear here..."
                className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-sm leading-relaxed focus-visible:ring-0 p-4 text-accent"
                spellCheck={false}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
