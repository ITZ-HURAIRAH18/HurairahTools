'use client';

import Link from 'next/link';
import { tools } from '@/lib/tools-registry';
import { Icon } from '@/components/ui/Icon';
import { Lock } from 'lucide-react';

export function UniSpotlight() {
  const universityTools = tools.filter((t) => t.category === 'university');

  return (
    <section className="w-full bg-[#EEF7F1] py-20 sm:py-24 overflow-hidden border-y border-[#D5EDD9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D5EDD9] bg-[#EEF7F1] px-3 py-1 text-xs font-semibold text-[#1A6B3A]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1A6B3A] opacity-40"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1A6B3A]"></span>
              </span>
              University Spotlight
            </div>
            <h2 className="font-display text-4xl font-bold text-[#0A2415] sm:text-5xl">
              Tools your professor won&apos; tell you about.
            </h2>
          </div>
          <Link href="/tools/gpa-calculator" className="text-sm font-semibold text-[#1A6B3A] hover:text-[#0A2415] transition-colors">
            View all university tools &rarr;
          </Link>
        </div>

        {/* Scrollable Row */}
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide">
          {universityTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group min-w-[280px] max-w-[320px] shrink-0 snap-start snap-always h-full block"
            >
              <div className="h-full rounded-xl border border-[#D5EDD9] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#1A6B3A] hover:shadow-[0_8px_30px_rgba(26,107,58,0.10)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF7F1] text-[#1A6B3A] transition-colors group-hover:bg-[#1A6B3A] group-hover:text-white">
                    <Icon name={tool.icon} className="h-5 w-5" />
                  </div>
                  <span className="pill-badge flex items-center gap-1 bg-[#EEF7F1] text-[#1A6B3A] border border-[#D5EDD9]">
                    <Lock className="h-3 w-3" />
                    Local
                  </span>
                </div>

                <h3 className="mb-2 font-display text-base font-bold text-[#0A2415]">
                  {tool.title}
                </h3>
                <p className="text-sm text-[#3D6B4F] line-clamp-3">
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