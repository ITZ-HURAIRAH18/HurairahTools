import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Lock } from 'lucide-react';
import { tools } from '@/lib/tools-registry';
import { Icon } from '@/components/ui/Icon';
import { ToolSidebar } from '@/components/layout/ToolSidebar';
import { Badge } from '@/components/ui/Badge';
import { ToolRenderer } from '@/components/tools/ToolRenderer';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  const tool = tools.find((t) => t.slug === slug);
  if (!tool) {
    return notFound();
  }

  const categoryNames = {
    pdf: 'PDF Tools',
    image: 'Image Tools',
    developer: 'Developer Tools',
    university: 'University Tools',
  };

  return (
    <div className="flex w-full flex-1 max-w-[1600px] mx-auto">
      <ToolSidebar activeSlug={slug} activeCategory={tool.category} />
      
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize">{categoryNames[tool.category]}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-text">{tool.title}</span>
          </nav>

          {/* Tool Header */}
          <header className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--violet))] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Icon name={tool.icon} className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-text">{tool.title}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="blue" className="uppercase">{tool.category}</Badge>
                    <Badge variant="green" className="gap-1 px-2">
                      <Lock className="h-3 w-3" /> Local
                    </Badge>
                    {tool.isNew && <Badge variant="amber">New</Badge>}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg text-text-muted max-w-2xl">{tool.description}</p>
          </header>

          {/* Tool Implementation Area */}
          <div className="w-full">
            <ToolRenderer slug={slug} />
          </div>
        </div>
      </main>
    </div>
  );
}
