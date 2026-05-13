'use client';

import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, Hash, Check } from 'lucide-react';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  const { copiedText, copyWithFeedback } = useClipboard();

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    const generateHashes = async () => {
      // MD5 (using crypto-js since SubtleCrypto doesn't support it well)
      const md5Hash = CryptoJS.MD5(input).toString();
      
      // We can use crypto-js for all of them for simplicity and synchronous behavior,
      // but the requirement says SubtleCrypto for SHA. Let's stick to crypto-js for all 
      // if it's easier, or mix them. 
      // crypto-js is requested for MD5. SubtleCrypto for SHA is native and fast.

      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      try {
        const [sha1Buffer, sha256Buffer, sha512Buffer] = await Promise.all([
          crypto.subtle.digest('SHA-1', data),
          crypto.subtle.digest('SHA-256', data),
          crypto.subtle.digest('SHA-512', data)
        ]);

        const bufToHex = (buffer: ArrayBuffer) => {
          return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        };

        setHashes({
          md5: md5Hash,
          sha1: bufToHex(sha1Buffer),
          sha256: bufToHex(sha256Buffer),
          sha512: bufToHex(sha512Buffer),
        });
      } catch (err) {
        // Fallback to crypto-js if SubtleCrypto fails (e.g., non-secure context)
        setHashes({
          md5: md5Hash,
          sha1: CryptoJS.SHA1(input).toString(),
          sha256: CryptoJS.SHA256(input).toString(),
          sha512: CryptoJS.SHA512(input).toString(),
        });
      }
    };

    generateHashes();
  }, [input]);

  const hashTypes = [
    { label: 'MD5', value: hashes.md5 },
    { label: 'SHA-1', value: hashes.sha1 },
    { label: 'SHA-256', value: hashes.sha256 },
    { label: 'SHA-512', value: hashes.sha512 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col h-[300px]">
        <div className="flex items-center justify-between border-b border-border-soft p-4 bg-surface">
          <h3 className="text-sm font-medium flex items-center gap-2 text-text">
            <Hash className="h-4 w-4 text-accent" />
            Input Text
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setInput('')}>Clear</Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash..."
          className="flex-1 resize-none border-0 rounded-none bg-transparent font-mono text-sm focus-visible:ring-0 p-4"
        />
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {hashTypes.map((hash) => (
          <Card key={hash.label} className="p-4 bg-surface-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-text">{hash.label}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyWithFeedback(hash.value)}
                disabled={!hash.value}
                className="h-8"
              >
                {copiedText === hash.value ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="bg-[#0d0d12] p-3 rounded border border-border-soft overflow-x-auto min-h-[44px] flex items-center">
              {hash.value ? (
                <span className="font-mono text-sm text-accent break-all">{hash.value}</span>
              ) : (
                <span className="text-sm text-text-muted italic">Awaiting input...</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
