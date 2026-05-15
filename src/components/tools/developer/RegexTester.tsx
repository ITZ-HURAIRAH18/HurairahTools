'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

export function RegexTester() {
  const [regexStr, setRegexStr] = useState('[a-zA-Z]+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello World 123! This is a test string for HurairahToolsKit.');
  const [error, setError] = useState<string | null>(null);
  
  // Create RegExp object safely
  const regex = useMemo(() => {
    try {
      if (!regexStr) return null;
      setError(null);
      return new RegExp(regexStr, flags);
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [regexStr, flags]);

  const { highlightedHtml, matchData } = useMemo(() => {
    if (!regex || !testString) return { highlightedHtml: testString, matchData: [] };

    // We need 'g' flag to find multiple matches
    const safeFlags = flags.includes('g') ? flags : flags + 'g';
    const safeRegex = new RegExp(regexStr, safeFlags);
    
    let match;
    const matches = [];
    let lastIndex = 0;
    let html = '';

    while ((match = safeRegex.exec(testString)) !== null) {
      if (match[0].length === 0) {
        safeRegex.lastIndex++; // Prevent infinite loops on empty matches
        continue;
      }
      
      // Add text before match
      html += escapeHtml(testString.substring(lastIndex, match.index));
      
      // Add matched text wrapped in span
      html += `<mark class="bg-accent/30 text-accent font-medium rounded px-0.5">${escapeHtml(match[0])}</mark>`;
      
      lastIndex = match.index + match[0].length;
      
      // Store match and capture groups
      const groups = match.slice(1);
      matches.push({
        fullMatch: match[0],
        index: match.index,
        groups: groups
      });
    }

    // Add remaining text
    html += escapeHtml(testString.substring(lastIndex));

    return { highlightedHtml: html, matchData: matches };
  }, [regex, testString, regexStr, flags]);

  // Helper to escape HTML to prevent XSS in highlighted output
  function escapeHtml(unsafe: string) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">Regular Expression</label>
            <div className="flex gap-2">
              <div className="flex flex-1 items-center rounded-lg border border-border bg-surface px-3">
                <span className="text-text-muted font-mono select-none">/</span>
                <input
                  type="text"
                  value={regexStr}
                  onChange={(e) => setRegexStr(e.target.value)}
                  className="flex-1 bg-transparent px-2 py-2 font-mono text-sm text-text focus:outline-none"
                  placeholder="pattern"
                />
                <span className="text-text-muted font-mono select-none">/</span>
              </div>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="gm"
                className="w-24 font-mono text-center"
                title="Regex Flags (g, i, m, s, u, y)"
              />
            </div>
            {error && <p className="mt-2 text-xs text-danger font-mono">{error}</p>}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-text">Test String</label>
              <span className="text-xs text-text-muted">{matchData.length} matches found</span>
            </div>
            
            {/* Fake textarea that shows highlighting */}
            <div className="relative min-h-[200px] w-full rounded-md border border-border bg-surface overflow-hidden">
              {/* Highlight layer */}
              <div 
                className="absolute inset-0 p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap pointer-events-none break-words text-transparent"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
              {/* Input layer */}
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full resize-none bg-transparent p-3 font-mono text-sm leading-relaxed text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
              />
            </div>
          </div>
        </div>
      </Card>

      {matchData.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b border-border-soft bg-surface px-6 py-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-medium text-text">Match Information</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text">
              <thead className="bg-surface-2 text-text-muted border-b border-border-soft">
                <tr>
                  <th className="px-6 py-3 font-medium w-16">#</th>
                  <th className="px-6 py-3 font-medium">Match</th>
                  <th className="px-6 py-3 font-medium w-24">Index</th>
                  <th className="px-6 py-3 font-medium">Capture Groups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {matchData.map((m, i) => (
                  <tr key={i} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-text-muted">{i + 1}</td>
                    <td className="px-6 py-3 font-mono text-xs text-accent break-all">{m.fullMatch}</td>
                    <td className="px-6 py-3 font-mono text-xs">{m.index}</td>
                    <td className="px-6 py-3">
                      {m.groups.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {m.groups.map((g, j) => (
                            <div key={j} className="flex text-xs font-mono">
                              <span className="text-text-muted w-16">Group {j + 1}:</span>
                              <span className="text-success">{g === undefined ? 'undefined' : g}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-text-faint italic">No groups</span>
                      )}
                    </td>
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
