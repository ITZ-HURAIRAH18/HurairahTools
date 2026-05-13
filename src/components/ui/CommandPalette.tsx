'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { tools } from '@/lib/tools-registry';
import { useCommandStore } from '@/store/useCommandStore';
import { Icon } from '@/components/ui/Icon';

export function CommandPalette() {
  const { isOpen, setOpen } = useCommandStore();
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const onSelect = (slug: string) => {
    setOpen(false);
    setSearch('');
    router.push(`/tools/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <Command
        className="relative z-50 w-[90vw] max-w-[640px] overflow-hidden rounded-xl border border-border-soft bg-surface shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <div className="flex items-center border-b border-border-soft px-4">
          <Search className="h-5 w-5 text-text-muted" />
          <Command.Input
            autoFocus
            value={search}
            onValueChange={setSearch}
            placeholder="Search for a tool... (e.g., 'merge pdf')"
            className="flex-1 bg-transparent px-4 py-4 text-sm text-text outline-none placeholder:text-text-muted"
          />
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-text-muted">ESC</kbd>
          </div>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Command.Empty className="p-4 text-center text-sm text-text-muted">
            No tools found. Try a different search term.
          </Command.Empty>

          {['pdf', 'image', 'developer', 'university'].map((category) => {
            const categoryTools = tools.filter((t) => t.category === category);
            if (!categoryTools.length) return null;

            return (
              <Command.Group
                key={category}
                heading={category.toUpperCase()}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-text-faint"
              >
                {categoryTools.map((tool) => (
                  <Command.Item
                    key={tool.slug}
                    value={`${tool.title} ${tool.tags.join(' ')}`}
                    onSelect={() => onSelect(tool.slug)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-text-muted aria-selected:bg-surface-2 aria-selected:text-text data-[selected=true]:bg-surface-2 data-[selected=true]:text-text"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-2 text-accent">
                      <Icon name={tool.icon} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-text">{tool.title}</span>
                      <span className="text-xs text-text-faint line-clamp-1">{tool.description}</span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>
      </Command>
    </div>
  );
}
