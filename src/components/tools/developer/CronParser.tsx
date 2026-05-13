'use client';

import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

export function CronParser() {
  const [expression, setExpression] = useState('*/15 * * * *');
  const [humanReadable, setHumanReadable] = useState('');
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expression.trim()) {
      setHumanReadable('Please enter a cron expression.');
      setNextRuns([]);
      setError(null);
      return;
    }

    try {
      // 1. Convert to human readable
      const desc = cronstrue.toString(expression, { throwExceptionOnParseError: true });
      setHumanReadable(desc);

      // 2. Calculate next 5 runs
      const interval = parser.parseExpression(expression);
      const runs = [];
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toDate());
      }
      setNextRuns(runs);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid cron expression');
      setHumanReadable('—');
      setNextRuns([]);
    }
  }, [expression]);

  const presetExpressions = [
    { label: 'Every 15 mins', val: '*/15 * * * *' },
    { label: 'Every hour', val: '0 * * * *' },
    { label: 'Every day at midnight', val: '0 0 * * *' },
    { label: 'Every Monday at 9AM', val: '0 9 * * 1' },
    { label: '1st of every month', val: '0 0 1 * *' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <Card className="p-6">
        <h3 className="text-sm font-medium mb-4 text-text flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent" />
          Cron Expression
        </h3>
        
        <div className="mb-4">
          <div className="flex bg-surface-2 rounded-lg border border-border overflow-hidden">
            <span className="bg-surface px-4 py-3 text-text-muted font-mono border-r border-border select-none">
              cron
            </span>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3 font-mono text-lg text-text focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              placeholder="* * * * *"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-mono text-text-muted px-1">
            <span>minute</span>
            <span>hour</span>
            <span>day(month)</span>
            <span>month</span>
            <span>day(week)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {presetExpressions.map((p) => (
            <button
              key={p.label}
              onClick={() => setExpression(p.val)}
              className="text-xs bg-surface-2 hover:bg-surface border border-border-soft rounded px-2 py-1 text-text-muted transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Human Readable Box */}
        <Card className={`p-6 flex flex-col justify-center items-center text-center h-48 border-2 transition-colors ${error ? 'border-danger/30 bg-danger/5' : 'border-success/30 bg-success/5'}`}>
          {error ? (
            <>
              <AlertCircle className="h-8 w-8 text-danger mb-3 opacity-80" />
              <p className="text-danger font-medium">{error}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-success uppercase tracking-widest mb-3 opacity-80">Means</p>
              <h2 className="text-xl md:text-2xl font-bold text-text leading-tight px-4 capitalize">
                "{humanReadable}"
              </h2>
            </>
          )}
        </Card>

        {/* Next Runs Box */}
        <Card className="flex flex-col h-48">
          <div className="border-b border-border-soft bg-surface px-4 py-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-text">Next 5 Executions</span>
          </div>
          <div className="flex-1 overflow-auto bg-[#0d0d12] p-4">
            {nextRuns.length > 0 ? (
              <ul className="space-y-2 font-mono text-sm">
                {nextRuns.map((date, idx) => (
                  <li key={idx} className="flex gap-4 border-b border-border-soft/50 pb-2 last:border-0 last:pb-0 text-text">
                    <span className="text-text-muted w-4">{idx + 1}.</span>
                    <span className="flex-1">{date.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-text-muted italic">
                {error ? 'Fix expression to see next runs' : 'Awaiting valid expression'}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
