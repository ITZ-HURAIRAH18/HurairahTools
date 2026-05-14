'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, RefreshCw, Key } from 'lucide-react';

export function UuidGenerator() {
  const [count, setCount] = useState<number>(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const { hasCopied: copied, copyToClipboard } = useClipboard();

  const generateV4 = () => {
    // Native crypto.randomUUID()
    return crypto.randomUUID();
  };

  const generateV1 = () => {
    // Basic pseudo-v1 (timestamp-based) since browser crypto doesn't have native v1
    // Format: time_low - time_mid - time_hi_and_version - clock_seq - node
    const now = new Date().getTime();
    // Not a true v1, but simulates the structure with current timestamp
    const hex = now.toString(16).padStart(12, '0');
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);
    
    let time_low = hex.substring(4, 12);
    let time_mid = hex.substring(0, 4).padStart(4, '0');
    let time_hi_and_version = '1' + Array.from({length: 3}, randomHex).join(''); // Version 1
    let clock_seq = (Math.floor(Math.random() * 0x3fff) | 0x8000).toString(16); // Variant 1
    let node = Array.from({length: 12}, randomHex).join('');

    return `${time_low}-${time_mid}-${time_hi_and_version}-${clock_seq}-${node}`;
  };

  const generateList = () => {
    let num = Math.min(Math.max(1, count), 500); // Max 500
    setCount(num);
    const newUuids = [];
    for (let i = 0; i < num; i++) {
      newUuids.push(generateV4());
    }
    setUuids(newUuids);
  };

  useEffect(() => {
    generateList();
  }, []);

  const handleCopyAll = () => {
    copyToClipboard(uuids.join('\n'));
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 bg-surface-2 border-border-soft">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Number of UUIDs</label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                min="1" 
                max="500" 
                value={count} 
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-24 text-center"
              />
              <Button onClick={generateList} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Generate
              </Button>
            </div>
            <p className="mt-2 text-xs text-text-muted">Max 500 UUIDs per generation.</p>
          </div>

          <Button 
            variant="outline" 
            onClick={handleCopyAll}
            className="gap-2 bg-surface"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied All!' : 'Copy All'}
          </Button>
        </div>

        <div className="bg-[#0d0d12] border border-border-soft rounded-lg overflow-hidden flex flex-col h-[400px]">
          <div className="border-b border-border-soft bg-surface px-4 py-2 flex items-center justify-between text-xs text-text-muted font-medium">
            <span>UUID v4 (Random)</span>
            <span>{uuids.length} generated</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-accent select-all">
            {uuids.join('\n')}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium flex items-center gap-2 mb-4 text-text">
          <Key className="h-4 w-4 text-violet" />
          UUID v1 (Timestamp-based)
        </h3>
        <p className="text-sm text-text-muted mb-4">
          Need a version 1 UUID? We generate a simulated timestamp-based UUID for you.
        </p>
        <div className="flex items-center gap-4">
          <code className="bg-surface-2 px-4 py-3 rounded-lg border border-border font-mono text-violet flex-1 text-sm select-all">
            {generateV1()}
          </code>
        </div>
      </Card>
    </div>
  );
}
