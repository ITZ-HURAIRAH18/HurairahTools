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
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-border-soft bg-surface/50 lg:flex h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        
        {/* Category Header */}
        <div className="mb-4 mt-2 px-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
            {categoryNames[activeCategory]}
          </h2>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1">
          {categoryTools.map((tool) => {
            const isActive = tool.slug === activeSlug;
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-surface-2 text-text border-l-2 border-accent rounded-l-none'
                    : 'text-text-muted hover:bg-surface-2 hover:text-text border-l-2 border-transparent rounded-l-none'
                )}
              >
                <Icon
                  name={tool.icon}
                  className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-accent' : 'text-text-muted group-hover:text-text')}
                />
                <span className="truncate">{tool.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Trust Badge */}
        <div className="mt-6 px-2 pb-4">
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3 text-xs text-success">
            <Lock className="h-4 w-4 shrink-0" />
            <span className="font-medium leading-tight">Local Only<br/><span className="font-normal opacity-80">No uploads</span></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
