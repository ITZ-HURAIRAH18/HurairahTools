'use client';

import Link from 'next/link';
import { Search, Command } from 'lucide-react';
import { useCommandStore } from '@/store/useCommandStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { setOpen } = useCommandStore();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#D5EDD9] bg-white">
      <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#1A6B3A] shadow-sm">
              <span className="font-display text-base font-bold text-white">H</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-[#1A6B3A]">
                UniToolKit
              </span>
              <span className="font-display text-[10px] font-normal tracking-normal text-[#4A6B55]">
                Tools
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar / CMD+K Trigger */}
        <div className="hidden flex-1 items-center justify-center sm:flex max-w-md mx-8">
<button
             onClick={() => setOpen(true)}
             className="flex w-full items-center justify-between rounded-lg border border-[#D5EDD9] bg-[#EEF7F1] px-4 py-2 text-sm text-[#3D6B4F] transition-colors hover:border-[#1A6B3A] hover:text-[#0A2415]"
           >
             <div className="flex items-center gap-2">
               <Search className="h-4 w-4" />
               <span>Search tools...</span>
             </div>
             <kbd className="hidden rounded border border-[#D5EDD9] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#9AB8A0] sm:inline-block">
               <span className="text-xs">⌘</span>K
             </kbd>
          </button>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
<button
             onClick={() => setOpen(true)}
             className="p-2 text-[#3D6B4F] hover:text-[#0A2415] sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <div className="hidden items-center gap-4 text-sm font-medium text-[#3D6B4F] sm:flex">
            <Link href="/tools" className="transition-colors hover:text-[#0A2415]">
              Tools
            </Link>
            <Link href="/about" className="transition-colors hover:text-[#0A2415]">
              About
            </Link>
            <a 
              href="https://github.com/ITZ-HURAIRAH18" 
              target="_blank" 
              rel="noreferrer"
              className="rounded-lg bg-[#1A6B3A] px-4 py-2 text-white transition-colors hover:bg-[#155C30]"
            >
              GitHub
            </a>
          </div>
        </div>

      </div>
    </nav>
  );
}
