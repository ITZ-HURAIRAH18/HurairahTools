'use client';

import React, { useState, useEffect } from 'react';
import * as Diff from 'diff';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { ArrowRightLeft } from 'lucide-react';

export function DiffChecker() {
  const [oldText, setOldText] = useState('This is a test text.\nIt has a few lines.\nSome things will change.');
  const [newText, setNewText] = useState('This is a tested text.\nIt has some lines.\nSome things will change.\nAnd some things are new.');
  const [diffType, setDiffType] = useState<'chars' | 'words' | 'lines'>('words');
  const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);

  useEffect(() => {
    let result: Diff.Change[] = [];
    if (diffType === 'chars') {
      result = Diff.diffChars(oldText, newText);
    } else if (diffType === 'words') {
      result = Diff.diffWords(oldText, newText);
    } else if (diffType === 'lines') {
      result = Diff.diffLines(oldText, newText);
    }
    setDiffResult(result);
  }, [oldText, newText, diffType]);

  const renderDiff = () => {
    if (diffType === 'lines') {
      // Line diff needs to be block level
      return diffResult.map((part, index) => {
        const color = part.added ? 'bg-success/20 text-success border-l-2 border-success' 
                    : part.removed ? 'bg-danger/20 text-danger border-l-2 border-danger line-through opacity-70' 
                    : 'text-text border-l-2 border-transparent';
        
        return (
          <div key={index} className={`font-mono text-sm px-2 py-0.5 whitespace-pre-wrap break-words ${color}`}>
            {part.value}
          </div>
        );
      });
    } else {
      // Word and char diffs are inline
      return (
        <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          {diffResult.map((part, index) => {
            if (part.added) {
              return <span key={index} className="bg-success/20 text-success px-0.5 rounded">{part.value}</span>;
            }
            if (part.removed) {
              return <span key={index} className="bg-danger/20 text-danger line-through opacity-70 px-0.5 rounded">{part.value}</span>;
            }
            return <span key={index} className="text-text">{part.value}</span>;
          })}
        </div>
      );
    }
  };

  const handleSwap = () => {
    const temp = oldText;
    setOldText(newText);
    setNewText(temp);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center bg-surface-2 p-2 rounded-lg border border-border-soft">
        <Tabs 
          activeTab={diffType} 
          onChange={(v) => setDiffType(v as any)} 
          tabs={[
            { label: 'Words', value: 'words' },
            { label: 'Characters', value: 'chars' },
            { label: 'Lines', value: 'lines' },
          ]}
        />
        <Button variant="ghost" size="sm" onClick={handleSwap} className="gap-2 text-text-muted hover:text-text">
          <ArrowRightLeft className="h-4 w-4" /> Swap Texts
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Old Text */}
        <Card className="flex flex-col h-[300px]">
          <div className="border-b border-border-soft bg-surface px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-danger uppercase tracking-wider">Original Text</span>
            <Button variant="ghost" size="sm" onClick={() => setOldText('')} className="h-6 text-xs px-2">Clear</Button>
          </div>
          <Textarea 
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            className="flex-1 resize-none border-0 rounded-none bg-surface-2 font-mono text-sm leading-relaxed p-4 focus-visible:ring-0 text-text"
            placeholder="Paste original text here..."
            spellCheck={false}
          />
        </Card>

        {/* New Text */}
        <Card className="flex flex-col h-[300px]">
          <div className="border-b border-border-soft bg-surface px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-success uppercase tracking-wider">Modified Text</span>
            <Button variant="ghost" size="sm" onClick={() => setNewText('')} className="h-6 text-xs px-2">Clear</Button>
          </div>
          <Textarea 
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 resize-none border-0 rounded-none bg-surface-2 font-mono text-sm leading-relaxed p-4 focus-visible:ring-0 text-text"
            placeholder="Paste modified text here..."
            spellCheck={false}
          />
        </Card>
      </div>

      <Card className="flex flex-col min-h-[400px]">
        <div className="border-b border-border-soft bg-surface px-4 py-3 flex items-center gap-4">
          <span className="text-sm font-medium text-text">Diff Result</span>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-danger/20 rounded inline-block border border-danger/50"></span> Removed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-success/20 rounded inline-block border border-success/50"></span> Added</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-[#0d0d12]">
          {diffResult.length > 0 ? renderDiff() : <span className="text-text-muted text-sm">No differences found.</span>}
        </div>
      </Card>
    </div>
  );
}
