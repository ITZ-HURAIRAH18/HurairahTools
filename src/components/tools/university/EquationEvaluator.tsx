'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useClipboard } from '@/hooks/useClipboard';

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export default function EquationEvaluator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('equation-history', []);
  const { copied, copyToClipboard } = useClipboard();

  const evaluateExpression = (expr: string): string => {
    try {
      setError('');

      // Dynamic import of mathjs
      const math = require('mathjs');

      // Replace common mathematical notation
      let processedExpr = expr
        .replace(/deg/g, '* (π/180)')
        .replace(/π/g, 'pi')
        .replace(/sin\(/g, 'sin(')
        .replace(/cos\(/g, 'cos(')
        .replace(/tan\(/g, 'tan(')
        .replace(/sqrt\(/g, 'sqrt(')
        .replace(/log\(/g, 'log10(')
        .replace(/ln\(/g, 'log(');

      const evaluated = math.evaluate(processedExpr);

      // Handle complex numbers and formatting
      if (typeof evaluated === 'object' && evaluated.type === 'BigNumber') {
        return evaluated.toString();
      } else if (typeof evaluated === 'object' && evaluated.im !== undefined) {
        return `${evaluated.re.toFixed(6)}${evaluated.im >= 0 ? '+' : ''}${evaluated.im.toFixed(6)}i`;
      }

      const num = Number(evaluated);
      if (isNaN(num)) throw new Error('Invalid result');

      // Format with appropriate precision
      if (num % 1 === 0) {
        return num.toString();
      } else {
        return parseFloat(num.toFixed(10)).toString();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid expression';
      setError(errorMessage);
      return '';
    }
  };

  const handleEvaluate = () => {
    if (!expression.trim()) return;

    const res = evaluateExpression(expression);
    setResult(res);

    if (res && !error) {
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        expression,
        result: res,
        timestamp: Date.now(),
      };

      setHistory([newEntry, ...history].slice(0, 20));
    }
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm text-text-muted block mb-2">Enter Expression</label>
          <div className="flex gap-3">
            <Input
              placeholder="e.g., sin(45deg) + log(100) / sqrt(16)"
              value={expression}
              onChange={e => setExpression(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleEvaluate()}
            />
            <Button onClick={handleEvaluate} variant="primary" className="whitespace-nowrap">
              Calculate
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 rounded-lg p-3">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {result && !error && (
          <div className="bg-gradient-to-r from-accent/20 to-violet/20 border border-accent/30 rounded-lg p-4">
            <p className="text-text-muted text-xs mb-1">Result</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-bold text-accent break-all">{result}</p>
              <Button
                onClick={() => copyToClipboard(result)}
                variant="ghost"
                size="sm"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Syntax Help */}
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold text-text">Supported Functions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-text-muted">Trigonometry</p>
            <p className="text-text/80">sin(), cos(), tan(), asin(), acos(), atan()</p>
          </div>
          <div>
            <p className="text-text-muted">Logarithms</p>
            <p className="text-text/80">log() [base 10], ln() [natural]</p>
          </div>
          <div>
            <p className="text-text-muted">Math</p>
            <p className="text-text/80">sqrt(), pow(), abs(), ceil(), floor()</p>
          </div>
          <div>
            <p className="text-text-muted">Operators</p>
            <p className="text-text/80">+ - * / ^ % ** (power)</p>
          </div>
          <div>
            <p className="text-text-muted">Constants</p>
            <p className="text-text/80">π (pi), e, i (imaginary)</p>
          </div>
          <div>
            <p className="text-text-muted">Angles</p>
            <p className="text-text/80">Use deg suffix (45deg)</p>
          </div>
        </div>
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text">History (Last 20)</h3>
            <button
              onClick={clearHistory}
              className="text-xs text-danger hover:text-danger/80"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-surface/50 rounded border border-border hover:border-accent/50 transition group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted mb-1">{entry.expression}</p>
                  <p className="text-sm text-accent font-semibold break-all">{entry.result}</p>
                </div>
                <button
                  onClick={() => deleteHistoryEntry(entry.id)}
                  className="p-2 text-danger opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Example Expressions */}
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold text-text">Example Expressions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { expr: 'sin(45deg) + cos(45deg)', desc: 'Trigonometry' },
            { expr: 'log(100) + ln(e)', desc: 'Logarithms' },
            { expr: 'sqrt(16) * pow(2, 3)', desc: 'Powers & Roots' },
            { expr: '(5 + 3) * 2 / 4', desc: 'Basic Arithmetic' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setExpression(item.expr);
                setResult('');
              }}
              className="p-3 bg-surface/50 hover:bg-surface border border-border hover:border-accent/50 rounded-lg text-left transition"
            >
              <p className="text-xs text-text-muted mb-1">{item.desc}</p>
              <p className="text-sm text-accent font-mono">{item.expr}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
