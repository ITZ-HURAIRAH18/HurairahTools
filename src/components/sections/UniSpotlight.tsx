'use client';

import Link from 'next/link';
import { tools } from '@/lib/tools-registry';
import { Icon } from '@/components/ui/Icon';
import { Lock } from 'lucide-react';

export function UniSpotlight() {
  const universityTools = tools.filter((t) => t.category === 'university');

  return (
    <section className="w-full bg-surface py-24 sm:py-32 overflow-hidden border-y border-amber/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/10 px-3 py-1 text-xs font-medium text-amber">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber"></span>
              </span>
              University Spotlight
            </div>
            <h2 className="font-display text-3xl font-bold text-text sm:text-4xl">
              Tools your professor won't tell you about.
            </h2>
          </div>
          <Link href="/tools/gpa-calculator" className="text-sm font-medium text-amber hover:text-amber/80 transition-colors">
            View all university tools &rarr;
          </Link>
        </div>

        {/* Scrollable Row */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-4 scrollbar-thin scrollbar-thumb-amber/20 scrollbar-track-transparent">
          {universityTools.map((tool) => (
            <Link 
              key={tool.slug} 
              href={`/tools/${tool.slug}`} 
              className="group min-w-[280px] max-w-[320px] shrink-0 snap-start snap-always h-full block"
            >
              <div className="h-full rounded-2xl border border-amber/10 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber/30 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber transition-colors group-hover:bg-amber group-hover:text-black">
                    <Icon name={tool.icon} className="h-6 w-6" />
                  </div>
                  <span className="pill-badge flex items-center gap-1 bg-amber/10 text-amber">
                    <Lock className="h-3 w-3" />
                    Local
                  </span>
                </div>
                
                <h3 className="mb-2 font-display text-lg font-bold text-text">
                  {tool.title}
                </h3>
                <p className="text-sm text-text-muted line-clamp-3">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
