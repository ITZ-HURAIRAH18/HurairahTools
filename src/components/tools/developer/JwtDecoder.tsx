'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Key } from 'lucide-react';

export function JwtDecoder() {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');
  const [expiryStatus, setExpiryStatus] = useState<{ status: string, variant: 'green' | 'red' | 'amber' } | null>(null);

  const decodeBase64Url = (str: string) => {
    try {
      // Add removed at end '='
      str = (str + '===').slice(0, str.length + (str.length % 4));
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      throw new Error('Invalid Base64Url string');
    }
  };

  useEffect(() => {
    if (!input.trim()) {
      setHeader('');
      setPayload('');
      setError('');
      setExpiryStatus(null);
      return;
    }

    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must have exactly 3 parts separated by dots');
      }

      const decodedHeader = decodeBase64Url(parts[0]);
      const decodedPayload = decodeBase64Url(parts[1]);

      const parsedHeader = JSON.parse(decodedHeader);
      const parsedPayload = JSON.parse(decodedPayload);

      setHeader(JSON.stringify(parsedHeader, null, 2));
      setPayload(JSON.stringify(parsedPayload, null, 2));
      setError('');

      // Check Expiry
      if (parsedPayload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (parsedPayload.exp < now) {
          setExpiryStatus({ status: 'Expired', variant: 'red' });
        } else {
          setExpiryStatus({ status: 'Valid', variant: 'green' });
        }
      } else {
        setExpiryStatus(null);
      }
      
      // Check Not Before
      if (parsedPayload.nbf) {
        const now = Math.floor(Date.now() / 1000);
        if (parsedPayload.nbf > now) {
          setExpiryStatus({ status: 'Not Yet Valid', variant: 'amber' });
        }
      }

    } catch (err: any) {
      setHeader('');
      setPayload('');
      setExpiryStatus(null);
      setError(err.message || 'Failed to decode JWT. Ensure it is a valid token.');
    }
  }, [input]);

  const renderJson = (jsonStr: string) => {
    if (!jsonStr) return null;
    const html = jsonStr.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-amber'; 
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = 'text-accent font-medium';
          else cls = 'text-success';
        } else if (/true|false/.test(match)) cls = 'text-violet font-medium';
        else if (/null/.test(match)) cls = 'text-text-faint font-medium';
        return `<span class="${cls}">${match}</span>`;
      }
    );
    return <code dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4 text-accent" />
            Paste JWT
          </h3>
          {expiryStatus && (
            <Badge variant={expiryStatus.variant}>{expiryStatus.status}</Badge>
          )}
        </div>
        
        <Textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="min-h-[120px] font-mono text-xs break-all"
        />

        {error && (
          <div className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger font-mono">
            {error}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col min-h-[300px]">
          <div className="border-b border-border-soft p-4 bg-surface rounded-t-xl">
            <h3 className="text-sm font-medium text-text-muted">Header <span className="text-xs text-accent ml-2">(Algorithm & Type)</span></h3>
          </div>
          <div className="flex-1 p-4 bg-[#0d0d12] overflow-auto rounded-b-xl">
            <pre className="font-mono text-xs leading-relaxed text-text">
              {renderJson(header)}
            </pre>
          </div>
        </Card>

        <Card className="flex flex-col min-h-[400px]">
          <div className="border-b border-border-soft p-4 bg-surface rounded-t-xl">
            <h3 className="text-sm font-medium text-text-muted">Payload <span className="text-xs text-violet ml-2">(Data)</span></h3>
          </div>
          <div className="flex-1 p-4 bg-[#0d0d12] overflow-auto rounded-b-xl">
            <pre className="font-mono text-xs leading-relaxed text-text">
              {renderJson(payload)}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
