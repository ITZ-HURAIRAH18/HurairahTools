'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function DeveloperFloatingCard() {
  const [showCard, setShowCard] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('developerCardDismissed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !dismissed) {
        setShowCard(true);
      } else {
        setShowCard(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowCard(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('developerCardDismissed', 'true');
    }
  };

  if (dismissed || !showCard) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 cursor-pointer bg-white border border-[#D5EDD9] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(26,107,58,0.12)] hover:border-[#1A6B3A]/20 transition-colors"
      onClick={() => window.open('https://abuhurairah.engineer', '_blank')}
      style={{
        bottom: '24px',
        right: '24px',
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A2415] text-white text-xs font-bold">
        MAH
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-[#0A2415]">Built by M Abu Hurairah</p>
        <p className="text-xs text-[#6B9478]">Full-Stack Developer · UCP</p>
      </div>
      <ArrowRight className="h-4 w-4 text-[#1A6B3A]" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute -top-1 -right-1 p-1 rounded-full hover:bg-[#1A6B3A]/5 text-xs text-[#6B9478]"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}