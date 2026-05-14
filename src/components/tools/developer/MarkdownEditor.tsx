'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { downloadBlob } from '@/lib/utils';
import { useClipboard } from '@/hooks/useClipboard';
import { Copy, Download, FileCode, Edit3, Eye } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';

const DEFAULT_MD = `# Markdown Editor

Welcome to the local Markdown editor! This supports **GitHub Flavored Markdown** thanks to \`remark-gfm\`.

## Features
* **Bold** and *Italic* text
* [Links](https://unitoolkit.com)
* Inline \`code\` blocks

### Code Blocks
\`\`\`javascript
function helloWorld() {
  console.log("Everything runs locally!");
}
\`\`\`

### Tables
| Feature | Supported |
|---------|-----------|
| GFM     | ✅ Yes    |
| Local   | ✅ Yes    |
| Fast    | ✅ Yes    |

### Task Lists
- [x] Write markdown
- [x] Preview live
- [ ] Export to HTML

> "Privacy is not an option, and it shouldn't be the price we accept for just getting on the Internet."
`;

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  // View mode for mobile (where split pane is too squished)
  const [mobileView, setMobileView] = useState<'write' | 'preview'>('write');
  
  const { hasCopied, copyToClipboard } = useClipboard();

  const handleExportMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, 'document.md');
  };

  const handleExportHtml = () => {
    // Generate simple HTML wrapper for the content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    code { font-family: monospace; background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    pre code { background: none; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    blockquote { border-left: 4px solid #ddd; padding-left: 1rem; color: #666; margin-left: 0; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  <div id="content">
    <!-- Note: A true HTML export would require ReactDOMServer.renderToString, but since we are fully client-side and want to avoid heavy dependencies, we'll let the user download the MD or use the copy rendered text option if they just want the visuals. For a robust HTML export, one would normally use unified/remark to stringify to HTML. We will provide a basic alert here or a simplified export. -->
    <p><em>HTML export requires a full markdown-to-html parser. For now, please use the .md export.</em></p>
  </div>
</body>
</html>
    `;
    
    // To do a real HTML export client-side without adding rehype-stringify, we can 
    // grab the innerHTML of the preview container.
    const previewElement = document.getElementById('md-preview-container');
    if (previewElement) {
      const realHtml = htmlContent.replace('<p><em>HTML export requires a full markdown-to-html parser. For now, please use the .md export.</em></p>', previewElement.innerHTML);
      const blob = new Blob([realHtml], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, 'document.html');
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-[800px]">
      
      {/* Action Bar */}
      <Card className="p-3 bg-surface border-border-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <Tabs 
            activeTab={mobileView} 
            onChange={(v) => setMobileView(v as any)} 
            tabs={[
              { label: 'Write', value: 'write' },
              { label: 'Preview', value: 'preview' },
            ]}
          />
        </div>
        
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-text-muted ml-2">
          <Edit3 className="h-4 w-4" /> Markdown Editor
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(markdown)}>
            {hasCopied ? 'Copied MD' : <Copy className="h-4 w-4 mr-2" />}
            <span className="hidden sm:inline">Copy MD</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportMd} className="gap-2">
            <Download className="h-4 w-4" />
            .md
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportHtml} className="gap-2">
            <FileCode className="h-4 w-4" />
            .html
          </Button>
        </div>
      </Card>

      {/* Split Pane */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
        
        {/* Editor Pane */}
        <Card className={`flex flex-col border-border-soft h-full ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="border-b border-border-soft bg-surface px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Raw Input</span>
          </div>
          <Textarea 
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 resize-none border-0 rounded-none bg-surface-2 font-mono text-sm leading-relaxed p-6 focus-visible:ring-0 text-text"
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </Card>

        {/* Preview Pane */}
        <Card className={`flex flex-col border-border-soft h-full ${mobileView === 'write' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="border-b border-border-soft bg-surface px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-mono text-accent uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-3 w-3" /> Live Preview
            </span>
          </div>
          
          <div 
            id="md-preview-container"
            className="flex-1 overflow-auto p-8 bg-white text-black"
            style={{ color: '#24292f' }} // Force GitHub-like colors for the preview to ensure readability regardless of dark mode
          >
            {/* We apply local styles directly or via a wrapper class to style the markdown */}
            <div className="prose prose-sm max-w-none prose-neutral">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
            
            {/* Custom inline styling for the preview to look good even without tailwind typography plugin */}
            <style dangerouslySetInnerHTML={{__html: `
              #md-preview-container h1 { font-size: 2em; margin-bottom: 0.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; font-weight: 600; }
              #md-preview-container h2 { font-size: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; font-weight: 600; margin-top: 1.5em; }
              #md-preview-container h3 { font-size: 1.25em; margin-bottom: 0.5em; font-weight: 600; margin-top: 1.5em; }
              #md-preview-container p { margin-bottom: 1em; line-height: 1.6; }
              #md-preview-container a { color: #0969da; text-decoration: none; }
              #md-preview-container a:hover { text-decoration: underline; }
              #md-preview-container strong { font-weight: 600; }
              #md-preview-container ul, #md-preview-container ol { padding-left: 2em; margin-bottom: 1em; }
              #md-preview-container li { margin-bottom: 0.25em; }
              #md-preview-container blockquote { padding: 0 1em; color: #57606a; border-left: 0.25em solid #d0d7de; margin: 0 0 1em 0; }
              #md-preview-container code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: rgba(175, 184, 193, 0.2); border-radius: 6px; font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace; }
              #md-preview-container pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #f6f8fa; border-radius: 6px; margin-bottom: 1em; }
              #md-preview-container pre code { background-color: transparent; padding: 0; }
              #md-preview-container table { border-spacing: 0; border-collapse: collapse; margin-bottom: 1em; width: 100%; max-width: 100%; }
              #md-preview-container th, #md-preview-container td { padding: 6px 13px; border: 1px solid #d0d7de; }
              #md-preview-container th { font-weight: 600; background-color: #f6f8fa; }
              #md-preview-container tr:nth-child(2n) { background-color: #f6f8fa; }
              #md-preview-container img { max-width: 100%; box-sizing: content-box; background-color: #fff; }
              #md-preview-container input[type="checkbox"] { margin: 0 0.2em 0.25em -1.6em; vertical-align: middle; }
              #md-preview-container li.task-list-item { list-style-type: none; }
            `}} />
          </div>
        </Card>
      </div>
    </div>
  );
}
