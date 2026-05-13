import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#E0EDE2] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#1A6B3A]">
                <span className="font-display text-sm font-bold text-white">H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-bold tracking-tight text-[#1A6B3A]">
                  Hurairah
                </span>
                <span className="font-display text-[10px] font-normal text-[#4A6B55]">
                  Tools
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#4A6B55]">
              Every tool a student actually needs. All run in your browser. Your files never leave your device.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-[#7A9B82] uppercase">Categories</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-[#4A6B55]">
              <li><Link href="/tools/pdf-merge" className="hover:text-[#1A6B3A] transition-colors">PDF Tools</Link></li>
              <li><Link href="/tools/image-compressor" className="hover:text-[#1A6B3A] transition-colors">Image Tools</Link></li>
              <li><Link href="/tools/json-formatter" className="hover:text-[#1A6B3A] transition-colors">Developer Tools</Link></li>
              <li><Link href="/tools/gpa-calculator" className="hover:text-[#1A6B3A] transition-colors">University Tools</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-[#7A9B82] uppercase">Legal</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-[#4A6B55]">
              <li><Link href="/privacy" className="hover:text-[#1A6B3A] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-[#1A6B3A] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-[#C4E0CA] bg-[#EAF5EC] px-3 py-2 text-sm text-[#1A6B3A]">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium">100% Private & Local</span>
            </div>
            <p className="text-xs text-[#7A9B82]">
              We literally can't see your files. Open DevTools and check the network tab.
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#E0EDE2] pt-8 sm:flex-row">
          <p className="text-xs text-[#7A9B82]">
            &copy; {new Date().getFullYear()} Hurairah Tools. All processing happens in your browser.
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-[#7A9B82]">
            Made with Next.js & Tailwind
          </div>
        </div>

        {/* Dark Strip - Trust Banner */}
        <div className="mt-12 -mx-4 px-4 py-4 bg-[#0A2415] text-center">
          <p className="text-sm text-[#6DBB8A]">
            Built with ❤️ by <span className="text-[#2D7A4F] font-medium">M Abu Hurairah</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
