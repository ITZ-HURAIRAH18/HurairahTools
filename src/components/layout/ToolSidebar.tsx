import Link from 'next/link';
import { tools } from '@/lib/tools-registry';
import { ToolCategory } from '@/types/tool';
import { Icon } from '@/components/ui/Icon';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolSidebarProps {
  activeSlug: string;
  activeCategory: ToolCategory;
}

export function ToolSidebar({ activeSlug, activeCategory }: ToolSidebarProps) {
  const categoryTools = tools.filter((t) => t.category === activeCategory);
  
  const categoryNames = {
    pdf: 'PDF Tools',
    image: 'Image Tools',
    developer: 'Developer Tools',
    university: 'University Tools',
  };

  return (
    <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-[#E0EDE2] bg-[#F0F7F1] lg:flex h-[calc(100vh-52px)] sticky top-13">
      <div className="flex flex-col h-full p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D0E8D4] scrollbar-track-transparent">
        
        {/* Category Header */}
        <div className="mb-4 mt-2 px-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#7A9B82]">
            {categoryNames[activeCategory]}
          </h2>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-0.5">
          {categoryTools.map((tool) => {
            const isActive = tool.slug === activeSlug;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#EAF5EC] text-[#0A2415] font-semibold border-l-2 border-[#1A6B3A]'
                    : 'text-[#4A6B55] hover:bg-[#E4F0E6] hover:text-[#0A2415] border-l-2 border-transparent'
                )}
              >
                <Icon
                  name={tool.icon}
                  className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-[#1A6B3A]' : 'text-[#4A6B55] group-hover:text-[#0A2415]')}
                />
                <span className="truncate">{tool.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Trust Badge */}
        <div className="mt-6 px-3 pb-4">
          <div className="flex items-center gap-2 rounded-lg border border-[#C4E0CA] bg-white p-3 text-xs text-[#1A6B3A]">
            <Lock className="h-4 w-4 shrink-0" />
            <span className="font-medium leading-tight">🔒 Local Only<br/><span className="font-normal opacity-75">No uploads</span></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
