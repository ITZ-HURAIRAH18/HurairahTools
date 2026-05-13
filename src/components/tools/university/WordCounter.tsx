'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

const calculateStats = (text: string): Stats => {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  const readingTime = Math.ceil(words / 200);
  const speakingTime = Math.ceil(words / 130);

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime,
    speakingTime,
  };
};

const getKeywordDensity = (text: string): Array<[string, number]> => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);

  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => [word, (count / words.length) * 100]);
};

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => calculateStats(text), [text]);
  const keywords = useMemo(() => getKeywordDensity(text), [text]);

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text">Enter your text</label>
        <Textarea
          placeholder="Paste or type your text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="h-64"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5">
          <p className="text-xs text-text-muted">Words</p>
          <p className="text-2xl font-bold text-accent mt-1">{stats.words}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-violet/10 to-violet/5">
          <p className="text-xs text-text-muted">Characters</p>
          <p className="text-2xl font-bold text-violet mt-1">{stats.characters}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5">
          <p className="text-xs text-text-muted">Sentences</p>
          <p className="text-2xl font-bold text-success mt-1">{stats.sentences}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber/10 to-amber/5">
          <p className="text-xs text-text-muted">Paragraphs</p>
          <p className="text-2xl font-bold text-amber mt-1">{stats.paragraphs}</p>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-text">Reading & Speaking Time</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Reading Time</span>
              <span className="font-semibold text-accent">
                {stats.readingTime} min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Speaking Time</span>
              <span className="font-semibold text-violet">
                {stats.speakingTime} min
              </span>
            </div>
            <p className="text-xs text-text-muted mt-4">
              Reading speed: 200 wpm • Speaking speed: 130 wpm
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-text">Additional Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Characters (no spaces)</span>
              <span className="font-semibold text-accent">
                {stats.charactersNoSpaces}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Average word length</span>
              <span className="font-semibold text-violet">
                {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : 0} chars
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Avg words per sentence</span>
              <span className="font-semibold text-accent">
                {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Keyword Density */}
      {keywords.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-text">Top 10 Keywords (Density %)</h3>
          <div className="space-y-2">
            {keywords.map(([word, percent], idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-20">{idx + 1}.</span>
                <span className="text-sm text-text flex-1">{word}</span>
                <div className="flex-1 max-w-xs bg-surface-2 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-accent to-violet h-full"
                    style={{ width: `${Math.min(percent * 10, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-accent font-semibold w-12 text-right">
                  {percent.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Button
        onClick={() => setText('')}
        variant="outline"
        className="w-full text-danger"
      >
        Clear Text
      </Button>
    </div>
  );
}
