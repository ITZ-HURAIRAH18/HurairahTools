'use client';

import { useState } from 'react';
import { Trash2, Plus, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useClipboard } from '@/hooks/useClipboard';

type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'IEEE';
type SourceType = 'Book' | 'Journal' | 'Website' | 'Video' | 'Conference' | 'Thesis' | 'Newspaper';

interface Citation {
  id: string;
  type: SourceType;
  data: Record<string, string>;
}

const SOURCE_FIELDS: Record<SourceType, string[]> = {
  Book: ['author', 'title', 'publisher', 'year', 'place'],
  Journal: ['author', 'title', 'journal', 'volume', 'issue', 'pages', 'year', 'doi'],
  Website: ['author', 'title', 'url', 'accessDate', 'year'],
  Video: ['creator', 'title', 'platform', 'url', 'year'],
  Conference: ['author', 'title', 'conference', 'place', 'year'],
  Thesis: ['author', 'title', 'institution', 'year', 'degree'],
  Newspaper: ['author', 'title', 'newspaper', 'date', 'page'],
};

const FIELD_LABELS: Record<string, string> = {
  author: 'Author',
  creator: 'Creator',
  title: 'Title',
  publisher: 'Publisher',
  year: 'Year',
  place: 'Place of Publication',
  journal: 'Journal Name',
  volume: 'Volume',
  issue: 'Issue',
  pages: 'Pages',
  doi: 'DOI',
  url: 'URL',
  accessDate: 'Access Date',
  platform: 'Platform',
  conference: 'Conference Name',
  institution: 'Institution',
  degree: 'Degree',
  newspaper: 'Newspaper Name',
  date: 'Date',
  page: 'Page',
};

const generateCitation = (citation: Citation, style: CitationStyle): string => {
  const d = citation.data;

  switch (style) {
    case 'APA':
      if (citation.type === 'Book') {
        return `${d.author} (${d.year}). ${d.title}. ${d.publisher}.`;
      } else if (citation.type === 'Journal') {
        return `${d.author} (${d.year}). ${d.title}. ${d.journal}, ${d.volume}(${d.issue}), ${d.pages}. ${d.doi ? `https://doi.org/${d.doi}` : ''}`;
      } else if (citation.type === 'Website') {
        return `${d.author} (${d.year}). ${d.title}. Retrieved from ${d.url}`;
      }
      break;

    case 'MLA':
      if (citation.type === 'Book') {
        return `${d.author}. ${d.title}. ${d.publisher}, ${d.year}.`;
      } else if (citation.type === 'Journal') {
        return `${d.author}. "${d.title}." ${d.journal}, vol. ${d.volume}, no. ${d.issue}, ${d.year}, pp. ${d.pages}.`;
      } else if (citation.type === 'Website') {
        return `${d.author}. "${d.title}." Web, ${d.accessDate}. <${d.url}>`;
      }
      break;

    case 'Chicago':
      if (citation.type === 'Book') {
        return `${d.author}. ${d.title}. ${d.publisher}, ${d.year}.`;
      } else if (citation.type === 'Journal') {
        return `${d.author}. "${d.title}." ${d.journal} ${d.volume}, no. ${d.issue} (${d.year}): ${d.pages}.`;
      }
      break;

    case 'IEEE':
      if (citation.type === 'Journal') {
        return `[1] ${d.author}, "${d.title}," ${d.journal}, vol. ${d.volume}, no. ${d.issue}, pp. ${d.pages}, ${d.year}.`;
      } else if (citation.type === 'Website') {
        return `[1] ${d.author}, "${d.title}," [Online]. Available: ${d.url}. [Accessed: ${d.accessDate}].`;
      }
      break;
  }

  return 'Citation format not available for this source type.';
};

export default function CitationGenerator() {
  const [citations, setCitations] = useLocalStorage<Citation[]>('citation-generator', []);
  const [style, setStyle] = useState<CitationStyle>('APA');
  const [newCitation, setNewCitation] = useState<Partial<Citation>>({
    type: 'Book',
    data: {},
  });
  const { hasCopied: copied, copyToClipboard } = useClipboard();

  const sourceType = (newCitation.type || 'Book') as SourceType;
  const fields = SOURCE_FIELDS[sourceType];

  const addCitation = () => {
    if (!Object.values(newCitation.data || {}).every(v => v)) return;

    const citation: Citation = {
      id: Date.now().toString(),
      type: sourceType,
      data: newCitation.data || {},
    };

    setCitations([...citations, citation]);
    setNewCitation({ type: 'Book', data: {} });
  };

  const deleteCitation = (id: string) => {
    setCitations(citations.filter(c => c.id !== id));
  };

  const exportTxt = () => {
    const content = citations
      .map(c => generateCitation(c, style))
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citations-${style}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Citation Style Selector */}
      <Card className="p-4">
        <label className="text-sm text-text-muted block mb-3">Citation Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['APA', 'MLA', 'Chicago', 'IEEE'] as CitationStyle[]).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`p-3 rounded-lg border transition ${
                style === s
                  ? 'bg-accent text-white border-accent'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {/* Input Form */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-text">Add Citation</h3>

        <select
          value={sourceType}
          onChange={e => setNewCitation({ ...newCitation, type: e.target.value as SourceType, data: {} })}
          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm"
        >
          {Object.keys(SOURCE_FIELDS).map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <Input
              key={field}
              placeholder={FIELD_LABELS[field]}
              value={newCitation.data?.[field] || ''}
              onChange={e =>
                setNewCitation({
                  ...newCitation,
                  data: { ...newCitation.data, [field]: e.target.value },
                })
              }
            />
          ))}
        </div>

        <Button onClick={addCitation} variant="primary" className="w-full">
          <Plus size={16} /> Add Citation
        </Button>
      </Card>

      {/* Citations List */}
      <div className="space-y-3">
        {citations.map(citation => {
          const formattedCitation = generateCitation(citation, style);
          return (
            <Card key={citation.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-text-muted mb-2">{citation.type} Citation ({style})</p>
                  <p className="text-sm text-text break-words">{formattedCitation}</p>
                </div>
                <button
                  onClick={() => deleteCitation(citation.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyToClipboard(formattedCitation)}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </Card>
          );
        })}

        {citations.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-muted">No citations yet. Add one to get started!</p>
          </Card>
        )}
      </div>

      <Button onClick={exportTxt} variant="outline" className="w-full">
        <Download size={16} /> Export as Text
      </Button>
    </div>
  );
}
