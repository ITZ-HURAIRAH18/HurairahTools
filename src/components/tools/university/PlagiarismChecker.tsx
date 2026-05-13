'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';

const getNgrams = (text: string, n: number = 3): Set<string> => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const ngrams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.add(words.slice(i, i + n).join(' '));
  }
  return ngrams;
};

const calculateJaccardSimilarity = (set1: Set<string>, set2: Set<string>): number => {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
};

const highlightMatches = (text: string, matchedNgrams: Set<string>): React.ReactNode[] => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const result: React.ReactNode[] = [];
  const matchedIndices = new Set<number>();

  for (let i = 0; i <= words.length - 3; i++) {
    if (matchedNgrams.has(words.slice(i, i + 3).join(' '))) {
      matchedIndices.add(i);
      matchedIndices.add(i + 1);
      matchedIndices.add(i + 2);
    }
  }

  const originalWords = text
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 0);

  let wordIdx = 0;
  originalWords.forEach((word, idx) => {
    const cleanWord = word.toLowerCase().replace(/[^\w\s]/g, '');
    if (matchedIndices.has(wordIdx)) {
      result.push(
        <span key={idx} className="bg-danger/30 text-danger font-semibold">
          {word}{' '}
        </span>
      );
    } else {
      result.push(
        <span key={idx}>
          {word}{' '}
        </span>
      );
    }
    if (cleanWord.length > 0) wordIdx++;
  });

  return result;
};

export default function PlagiarismChecker() {
  const [myText, setMyText] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [matchedNgrams, setMatchedNgrams] = useState<Set<string>>(new Set());

  const similarity = useMemo(() => {
    const set1 = getNgrams(myText);
    const set2 = getNgrams(referenceText);

    const matched = new Set([...set1].filter(x => set2.has(x)));
    setMatchedNgrams(matched);

    return calculateJaccardSimilarity(set1, set2);
  }, [myText, referenceText]);

  const getVerdict = (): { label: string; color: 'green' | 'amber' | 'red' } => {
    if (similarity < 20) return { label: 'Low Similarity', color: 'green' };
    if (similarity < 50) return { label: 'Medium Similarity', color: 'amber' };
    return { label: 'High Similarity', color: 'red' };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-6">
      <div className="bg-amber/10 border border-amber/30 rounded-lg p-4">
        <p className="text-sm text-amber">
          ⚠️ <strong>Disclaimer:</strong> This is a local text comparison tool. It uses n-gram
          similarity analysis and is not connected to any plagiarism database. For academic
          integrity checks, use official plagiarism detection services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Text */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-text block mb-2">My Text</label>
            <Textarea
              placeholder="Paste your text here..."
              value={myText}
              onChange={e => setMyText(e.target.value)}
              className="h-48"
            />
          </div>
        </div>

        {/* Reference Text */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-text block mb-2">Reference Text</label>
            <Textarea
              placeholder="Paste text to compare against..."
              value={referenceText}
              onChange={e => setReferenceText(e.target.value)}
              className="h-48"
            />
          </div>
        </div>
      </div>

      {/* Similarity Result */}
      {myText && referenceText && (
        <>
          <Card className={`p-6 border-2 bg-gradient-to-br ${
            verdict.color === 'green'
              ? 'from-success/10 to-success/5 border-success/30'
              : verdict.color === 'amber'
              ? 'from-amber/10 to-amber/5 border-amber/30'
              : 'from-danger/10 to-danger/5 border-danger/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-2">Similarity Score</p>
                <p className={`text-4xl font-bold ${
                  verdict.color === 'green'
                    ? 'text-success'
                    : verdict.color === 'amber'
                    ? 'text-amber'
                    : 'text-danger'
                }`}>
                  {similarity.toFixed(1)}%
                </p>
              </div>
              <Badge variant={verdict.color}>{verdict.label}</Badge>
            </div>
          </Card>

          {/* Highlighted Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 space-y-2">
              <p className="text-sm font-semibold text-text">My Text (Highlighted)</p>
              <div className="text-sm text-text leading-relaxed bg-surface/50 p-4 rounded border border-border max-h-48 overflow-y-auto">
                {highlightMatches(myText, matchedNgrams)}
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <p className="text-sm font-semibold text-text">Reference Text (Highlighted)</p>
              <div className="text-sm text-text leading-relaxed bg-surface/50 p-4 rounded border border-border max-h-48 overflow-y-auto">
                {highlightMatches(referenceText, matchedNgrams)}
              </div>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setMyText('');
                setReferenceText('');
              }}
              variant="outline"
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
