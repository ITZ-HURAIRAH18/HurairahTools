import Link from 'next/link';
import { ChevronRight, Github, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'About UniToolKit',
  description: 'Learn about UniToolKit - a free, privacy-first toolkit for university students.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="text-sm text-text-muted mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-text transition">Home</Link>
            <ChevronRight size={16} />
            <span className="text-text">About</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-text">About UniToolKit</h1>
          <p className="text-lg text-text-muted mt-3">
            Built for students, by developers who understand your needs.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text mb-6">Our Mission</h2>
          <div className="space-y-4 text-text-muted">
            <p>
              UniToolKit exists to remove friction from student workflows. We believe every student should have
              access to professional-grade tools without paying subscriptions, dealing with ads, or compromising
              their privacy.
            </p>
            <p>
              That's why we built <strong className="text-text">47 tools, all running locally in your browser</strong>.
              Your PDF merging, image resizing, GPA calculations, and resume building never touches our servers. Your
              files never leave your device.
            </p>
          </div>
        </section>

        {/* Why We Built It */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text mb-6">Why We Built This</h2>
          <div className="space-y-4 text-text-muted">
            <p>
              In 2024, we were students juggling:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>A dozen paid SaaS tools ($15/month each)</li>
              <li>Clunky online converters bloated with ads</li>
              <li>Sketchy "free" services selling data</li>
              <li>Offline tools that required installation and updates</li>
            </ul>
            <p className="mt-4">
              We realized: everything these tools do can run in the browser, instantly, without any backend.
              So we built UniToolKit.
            </p>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text mb-6">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🔒',
                title: 'Zero Uploads',
                desc: 'All processing happens in your browser. No servers. No data collection.',
              },
              {
                icon: '⚡',
                title: 'Instant Results',
                desc: 'No waiting for server responses. Your CPU handles the work. Subsecond performance.',
              },
              {
                icon: '💰',
                title: 'Forever Free',
                desc: 'No premium tiers. No freemium trap. Every tool is 100% free, forever.',
              },
              {
                icon: '📱',
                title: 'Works Offline',
                desc: 'First load caches everything. Works fully offline. Perfect for low-connectivity areas.',
              },
              {
                icon: '🎓',
                title: 'Built for Students',
                desc: 'GPA calculator, citations, deadlines, resume builder — tools you actually need.',
              },
              {
                icon: '🔧',
                title: 'Open to Feedback',
                desc: 'Built by students, for students. We listen to what you need.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-surface rounded-xl p-6 border border-border">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Tech */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text mb-6">The Tech Stack</h2>
          <div className="bg-surface rounded-xl p-8 border border-border">
            <div className="space-y-4 text-text-muted">
              <p>
                Built with <strong className="text-text">Next.js 14</strong>, <strong className="text-text">React</strong>,{' '}
                <strong className="text-text">TypeScript</strong>, and <strong className="text-text">Tailwind CSS</strong>.
              </p>
              <p>
                Tools use battle-tested libraries like:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong className="text-text">pdf-lib</strong> for PDF manipulation</li>
                <li><strong className="text-text">pdfjs-dist</strong> for PDF rendering</li>
                <li><strong className="text-text">Canvas API</strong> for image processing</li>
                <li><strong className="text-text">mathjs</strong> for equation evaluation</li>
                <li><strong className="text-text">@imgly/background-removal</strong> for AI-powered background removal (locally)</li>
              </ul>
              <p className="mt-4">
                Zero external API calls. Everything runs in your browser.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-text mb-6">Made by Developers</h2>
          <div className="bg-gradient-to-r from-accent/10 to-violet/10 rounded-xl p-8 border border-border">
            <p className="text-text-muted mb-4">
              UniToolKit is built and maintained by a team of engineers who understand what students need. We've been
              there — juggling assignments, optimizing workflows, and needing tools that just work.
            </p>
            <p className="text-text-muted">
              We're committed to keeping this free, fast, and private. Always.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-text mb-4">Ready to get started?</h2>
          <p className="text-text-muted mb-8">47 tools. Zero signup. All local.</p>
          <Link href="/">
            <Button variant="primary" className="inline-block">
              Go to Tools
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
