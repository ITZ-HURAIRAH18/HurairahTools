'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { tools } from '@/lib/tools-registry';
import { ToolCategory } from '@/types/tool';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

const categories: { label: string; value: ToolCategory | 'all' }[] = [
  { label: 'All Tools', value: 'all' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Image', value: 'image' },
  { label: 'Developer', value: 'developer' },
  { label: 'University', value: 'university' },
];

export function ToolGrid() {
  const [activeTab, setActiveTab] = useState<ToolCategory | 'all'>('all');

  const filteredTools = tools.filter((tool) => 
    activeTab === 'all' ? true : tool.category === activeTab
  );

  return (
    <section id="tool-grid" className="w-full bg-surface-2 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold text-text sm:text-4xl">Browse the Toolkit</h2>
            <p className="mt-2 text-text-muted">Select a category or search for exactly what you need.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  activeTab === cat.value
                    ? 'bg-accent text-white shadow-md'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/tools/${tool.slug}`} className="block h-full">
                  <div className="card-premium group relative flex h-full flex-col justify-between overflow-hidden p-6">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                          <Icon name={tool.icon} className="h-6 w-6" />
                        </div>
                        
                        {/* Badges */}
                        <div className="flex gap-2">
                          {tool.isNew && (
                            <span className="pill-badge bg-amber/20 text-amber">New</span>
                          )}
                          <span className="pill-badge flex items-center gap-1 bg-success/10 text-success">
                            <Lock className="h-3 w-3" />
                            Local
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="font-display text-lg font-semibold text-text mb-2">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-text-muted line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border-soft pt-4">
                      <span className="text-xs font-medium uppercase tracking-wider text-text-faint">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
