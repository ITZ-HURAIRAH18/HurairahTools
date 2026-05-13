import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - UniToolKit',
  description: 'Privacy policy for UniToolKit - learn how we protect your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="text-sm text-text-muted mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-text transition">Home</Link>
            <ChevronRight size={16} />
            <span className="text-text">Privacy</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-text">Privacy Policy</h1>
          <p className="text-lg text-text-muted mt-3">
            Last updated: May 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">The Short Version</h2>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
              <p className="text-text-muted">
                <strong className="text-accent">We don't collect your data.</strong> We don't send your files anywhere.
                We don't track you. Your data stays in your browser. That's it.
              </p>
            </div>
          </section>

          {/* Data We Don't Collect */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">Data We Don't Collect</h2>
            <ul className="space-y-3 text-text-muted">
              <li className="flex gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span><strong className="text-text">Your files:</strong> PDFs, images, documents — never uploaded, never sent anywhere.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span><strong className="text-text">Your personal data:</strong> We don't ask for your name, email, or account information.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span><strong className="text-text">Your input:</strong> Text you type, calculations you run — all processed locally in your browser.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span><strong className="text-text">Your location:</strong> We don't track where you are or where your requests come from.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span><strong className="text-text">Your behavior:</strong> We don't track which tools you use or how long you use them.</span>
              </li>
            </ul>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">How UniToolKit Works (Technically)</h2>
            <div className="bg-surface rounded-lg p-6 space-y-4 text-text-muted">
              <p>
                Every tool runs entirely in your browser using Web APIs and WebAssembly:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-text">Canvas API</strong> — Image resizing, cropping, watermarking</li>
                <li><strong className="text-text">File API & FileReader</strong> — Loading files locally</li>
                <li><strong className="text-text">SubtleCrypto</strong> — Hash generation, encryption</li>
                <li><strong className="text-text">Web Workers</strong> — Heavy processing without blocking the UI</li>
                <li><strong className="text-text">WebAssembly</strong> — PDF processing, AI models (background removal)</li>
                <li><strong className="text-text">localStorage</strong> — Saving your preferences and data locally</li>
              </ul>
              <p className="mt-4">
                <strong className="text-accent">Zero backend servers.</strong> Zero API calls. Zero uploads.
              </p>
            </div>
          </section>

          {/* Verification */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">How to Verify This</h2>
            <div className="bg-surface rounded-lg p-6 space-y-4 text-text-muted">
              <p>
                Open your browser's DevTools and check:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong className="text-text">Network Tab:</strong> Upload a file to any tool. Zero requests to external servers.</li>
                <li><strong className="text-text">Console:</strong> No tracking scripts. No analytics. No third-party libraries phoning home.</li>
                <li><strong className="text-text">Application Tab:</strong> Your data only lives in localStorage — never sent anywhere.</li>
                <li><strong className="text-text">Offline:</strong> Refresh the page after first load — everything works without internet.</li>
              </ol>
            </div>
          </section>

          {/* localStorage */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">Data Stored Locally</h2>
            <p className="text-text-muted mb-4">
              Some tools save your data to <code className="bg-surface-2 px-2 py-1 rounded text-accent">localStorage</code> for convenience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-muted ml-4">
              <li><strong className="text-text">GPA Calculator:</strong> Your courses and grades (optional)</li>
              <li><strong className="text-text">Deadline Tracker:</strong> Your assignments and due dates (optional)</li>
              <li><strong className="text-text">Resume Builder:</strong> Your CV sections (optional)</li>
              <li><strong className="text-text">Timetable Builder:</strong> Your class schedule (optional)</li>
              <li><strong className="text-text">Equation History:</strong> Recent calculations (last 20)</li>
            </ul>
            <p className="text-text-muted mt-4">
              <strong className="text-accent">All stored 100% locally.</strong> If you clear your browser cache, your data is deleted.
            </p>
          </section>

          {/* No Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">Cookies & Tracking</h2>
            <p className="text-text-muted">
              We don't use cookies, pixels, or any tracking technology. No Google Analytics. No Mixpanel. No Segment.
              No third-party scripts. Your usage is completely private.
            </p>
          </section>

          {/* Legal Stuff */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">Legal (The Boring Stuff)</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                <strong className="text-text">GDPR:</strong> We comply with GDPR because we don't collect any personal data. There's nothing to comply with beyond that.
              </p>
              <p>
                <strong className="text-text">CCPA:</strong> California residents — same story. No data collection = no CCPA obligations.
              </p>
              <p>
                <strong className="text-text">Subpoenas:</strong> We have no user data to hand over. If subpoenaed, there's literally nothing to produce.
              </p>
              <p>
                <strong className="text-text">Changes to this policy:</strong> If we ever collect data, we'll update this policy. You'll see it here first.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">Questions?</h2>
            <p className="text-text-muted mb-4">
              If you have questions about privacy, email us at <strong className="text-accent">privacy@unitoolkit.dev</strong>
            </p>
          </section>

          {/* Footer Note */}
          <div className="bg-surface rounded-lg p-6 border border-border mt-12 text-text-muted text-sm">
            <p>
              <strong className="text-text">TL;DR:</strong> We don't collect your data. Everything runs in your browser. Your files never leave your device.
              Open DevTools and verify for yourself.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
