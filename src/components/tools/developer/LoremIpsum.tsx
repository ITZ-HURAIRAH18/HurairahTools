'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, RefreshCw, Type } from 'lucide-react';

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", 
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", 
  "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", 
  "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", 
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export function LoremIpsum() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words' | 'characters'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  
  const { copied, copyToClipboard } = useClipboard();

  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  
  const generateSentence = (wordCount = 10) => {
    let sentence = [];
    for (let i = 0; i < wordCount; i++) {
      sentence.push(getRandomWord());
    }
    // Capitalize first letter and add period
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    return sentence.join(' ') + '.';
  };

  const generateParagraph = (sentenceCount = 5) => {
    let sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      // Random length sentences between 6 and 15 words
      sentences.push(generateSentence(Math.floor(Math.random() * 10) + 6));
    }
    return sentences.join(' ');
  };

  const generateText = () => {
    let num = Math.max(1, count);
    if (type === 'characters') num = Math.max(10, num); // at least 10 chars
    
    let result = '';

    if (type === 'paragraphs') {
      const paras = [];
      for (let i = 0; i < num; i++) {
        let p = generateParagraph();
        if (i === 0 && startWithLorem) {
          p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + generateParagraph(4);
        }
        paras.push(p);
      }
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < num; i++) {
        let s = generateSentence(Math.floor(Math.random() * 10) + 6);
        if (i === 0 && startWithLorem) {
          s = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }
        sentences.push(s);
      }
      result = sentences.join(' ');
    } else if (type === 'words') {
      const words = [];
      if (startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      while (words.length < num) {
        words.push(getRandomWord());
      }
      // If we requested less than 5 words but had startWithLorem
      result = words.slice(0, num).join(' ');
      result = result.charAt(0).toUpperCase() + result.slice(1) + '.';
    } else if (type === 'characters') {
      let chars = '';
      if (startWithLorem) {
        chars = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
      }
      while (chars.length < num) {
        chars += generateSentence() + ' ';
      }
      result = chars.substring(0, num);
    }

    setOutput(result);
  };

  useEffect(() => {
    generateText();
  }, [type, count, startWithLorem]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 bg-surface-2 border-border-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col gap-4 border-r border-border-soft pr-4">
            <h3 className="text-sm font-medium flex items-center gap-2 text-text mb-2">
              <Type className="h-4 w-4 text-accent" />
              Generator Settings
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Generate</label>
              <Tabs 
                activeTab={type} 
                onChange={(v) => {
                  setType(v as any);
                  if (v === 'characters') setCount(500);
                  else if (v === 'words') setCount(50);
                  else if (v === 'sentences') setCount(10);
                  else setCount(3);
                }} 
                tabs={[
                  { label: 'Paragraphs', value: 'paragraphs' },
                  { label: 'Sentences', value: 'sentences' },
                  { label: 'Words', value: 'words' },
                  { label: 'Characters', value: 'characters' },
                ]}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Count</label>
              <Input 
                type="number" 
                min="1" 
                max={type === 'characters' ? 10000 : 500} 
                value={count} 
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="mt-2">
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded border-border bg-surface accent-accent"
                />
                Start with "Lorem ipsum..."
              </label>
            </div>

            <Button onClick={generateText} className="w-full gap-2 mt-auto pt-4">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          <div className="lg:col-span-8 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text">Generated Text</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(output)}
                className="gap-2 bg-surface"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
            </div>
            <div className="flex-1 bg-[#0d0d12] border border-border-soft rounded-lg p-6 overflow-auto">
              <p className="font-serif text-base leading-relaxed text-text whitespace-pre-wrap">
                {output}
              </p>
            </div>
            <div className="mt-2 text-right text-xs text-text-muted">
              {output.split(/\s+/).filter(w => w.length > 0).length} words | {output.length} characters
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
