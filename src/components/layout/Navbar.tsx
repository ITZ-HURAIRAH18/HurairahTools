'use client';

import Link from 'next/link';
import { Search, Command } from 'lucide-react';
import { useCommandStore } from '@/store/useCommandStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { setOpen } = useCommandStore();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border-soft bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--accent),var(--violet))] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Command className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-text">
              UniToolKit
            </span>
          </Link>
        </div>

        {/* Search Bar / CMD+K Trigger */}
        <div className="hidden flex-1 items-center justify-center sm:flex max-w-md mx-8">
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between rounded-full border border-border-soft bg-surface px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent/50 hover:text-text"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search tools...</span>
            </div>
            <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-text-muted sm:inline-block">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="p-2 text-text-muted hover:text-text sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <div className="hidden items-center gap-4 text-sm font-medium text-text-muted sm:flex">
            <Link href="/tools/pdf-merge" className="transition-colors hover:text-text">
              Tools
            </Link>
            <Link href="/about" className="transition-colors hover:text-text">
              About
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="rounded-full bg-surface-2 px-4 py-2 transition-colors hover:bg-border"
            >
              GitHub
            </a>
          </div>
        </div>

      </div>
    </nav>
  );
}
