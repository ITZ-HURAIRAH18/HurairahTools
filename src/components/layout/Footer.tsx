import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer>
      {/* Top Section */}
      <div className="bg-white border-t border-[#D5EDD9] px-16 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

            {/* Col 1 — Brand */}
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#1A6B3A] shadow-sm">
                  <span className="font-display text-sm font-bold text-white">H</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-lg font-bold tracking-tight text-[#0A2415]">
                    HurairahTools
                  </span>
                  <span className="font-display text-[10px] font-normal text-[#6B9478]">
                    Tools
                  </span>
                </div>
              </Link>
              <p className="text-sm leading-relaxed text-[#3D6B4F] max-w-[220px]">
                Built by a student, for every student.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://abuhurairah.engineer"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#1A6B3A] hover:underline"
                >
                  abuhurairah.engineer ↗
                </a>
              </div>
            </div>

            {/* Col 2 — Categories */}
            <div>
              <h3 className="text-[10px] font-semibold tracking-[1.2px] text-[#9AB8A0] uppercase mb-4">Categories</h3>
              <ul className="flex flex-col gap-2 text-sm text-[#3D6B4F]">
                <li><Link href="/tools/pdf-merge" className="hover:text-[#1A6B3A] transition-colors">PDF Tools</Link></li>
                <li><Link href="/tools/image-compressor" className="hover:text-[#1A6B3A] transition-colors">Image Tools</Link></li>
                <li><Link href="/tools/json-formatter" className="hover:text-[#1A6B3A] transition-colors">Developer Tools</Link></li>
                <li><Link href="/tools/gpa-calculator" className="hover:text-[#1A6B3A] transition-colors">University Tools</Link></li>
              </ul>
            </div>

            {/* Col 3 — Legal */}
            <div>
              <h3 className="text-[10px] font-semibold tracking-[1.2px] text-[#9AB8A0] uppercase mb-4">Legal</h3>
              <ul className="flex flex-col gap-2 text-sm text-[#3D6B4F]">
                <li><Link href="/privacy" className="hover:text-[#1A6B3A] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/about" className="hover:text-[#1A6B3A] transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Col 4 — Trust Badge */}
            <div className="flex flex-col items-start gap-3">
              <div className="bg-[#EEF7F1] border border-[#D5EDD9] rounded-xl p-5 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[#1A6B3A] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#0A2415]">100% Private &amp; Local</p>
                  <p className="text-xs text-[#3D6B4F] leading-relaxed mt-0.5">
                    We literally can&apos;t see your files. Open DevTools and check the network tab.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-16 border-t border-[#D5EDD9] sm:mx-6 lg:mx-8" />

      {/* Bottom Bar */}
      <div className="bg-white px-16 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <p className="text-xs text-[#9AB8A0]">
            &copy; 2026 HurairahTools — All processing happens in your browser.
          </p>
          <p className="text-xs text-[#9AB8A0]">
            Made with Next.js &amp; Tailwind
          </p>
        </div>
      </div>

      {/* Creator Strip */}
      <div className="bg-[#0A2415] px-16 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 text-center">
          <span className="text-xs text-[#6DBB8A]">Built with</span>
          <svg className="h-3.5 w-3.5 text-[#2D7A4F]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-xs text-[#6DBB8A]">by</span>
          <a
            href="https://abuhurairah.engineer"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#2D7A4F] hover:underline"
          >
            M Abu Hurairah
          </a>
        </div>
      </div>
    </footer>
  );
}