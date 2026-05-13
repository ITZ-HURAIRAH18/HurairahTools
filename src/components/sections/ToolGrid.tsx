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
    <section id="tool-grid" className="w-full bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl font-bold text-[#0A2415] sm:text-5xl">Browse the Toolkit</h2>
            <p className="mt-2 text-[#4A6B55]">Select a category or search for exactly what you need.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 rounded-full border border-[#D8ECD9] bg-white p-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-medium transition-all tracking-wider',
                  activeTab === cat.value
                    ? 'bg-[#1A6B3A] text-white'
                    : 'text-[#4A6B55] border border-[#D8ECD9] hover:border-[#1A6B3A] hover:text-[#0A2415]'
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
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.slug}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  delay: idx * 0.04,
                  type: 'spring',
                  stiffness: 200,
                  damping: 30,
                }}
              >
                <Link href={`/tools/${tool.slug}`} className="block h-full">
                  <div className="card-premium group relative flex h-full flex-col justify-between overflow-hidden p-4">
                    <div>
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                          tool.category === 'pdf' && 'bg-[#EAF5EC] text-[#1A6B3A]',
                          tool.category === 'image' && 'bg-[#E8F1FB] text-[#2563EB]',
                          tool.category === 'developer' && 'bg-[#FEF3E2] text-[#D97706]',
                          tool.category === 'university' && 'bg-[#FDE8E8] text-[#DC2626]',
                        )}>
                          <Icon name={tool.icon} className="h-5 w-5" />
                        </div>
                        
                        {/* Badges */}
                        <div className="flex gap-2">
                          {tool.isNew && (
                            <span className="pill-badge bg-[#FEF3C7] text-[#92660A]">New</span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-display text-sm font-semibold text-[#0A2415] mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-[#6B8F74] line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E0EDE2]">
                      <span className="pill-badge bg-[#EAF5EC] text-[#1A6B3A] border border-[#C4E0CA]">
                        <Lock className="h-2.5 w-2.5 inline mr-1" />Local
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
