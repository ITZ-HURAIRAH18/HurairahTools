import Link from 'next/link';
import { Command, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[linear-gradient(135deg,var(--accent),var(--violet))] shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                <Command className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-text">
                UniToolKit
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-text-muted">
              Every tool a student actually needs. All run in your browser. Your files never leave your device.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-text">Categories</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-text-muted">
              <li><Link href="/tools/pdf-merge" className="hover:text-accent transition-colors">PDF Tools</Link></li>
              <li><Link href="/tools/image-compressor" className="hover:text-accent transition-colors">Image Tools</Link></li>
              <li><Link href="/tools/json-formatter" className="hover:text-accent transition-colors">Developer Tools</Link></li>
              <li><Link href="/tools/gpa-calculator" className="hover:text-accent transition-colors">University Tools</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-text">Legal</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-text-muted">
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium">100% Private & Local</span>
            </div>
            <p className="text-xs text-text-faint">
              We literally can't see your files. Open DevTools and check the network tab.
            </p>
          </div>

        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-soft pt-8 sm:flex-row">
          <p className="text-xs text-text-faint">
            &copy; {new Date().getFullYear()} UniToolKit. All processing happens in your browser.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-text-faint">
            Made with Next.js & Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}
