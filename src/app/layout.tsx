import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CommandPalette } from '@/components/ui/CommandPalette';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HurairahTools — Free Browser Tools by M Abu Hurairah',
  description: `47 free PDF, image, developer, and university tools
    built by M Abu Hurairah, a Full-Stack Developer and CS student
    at UCP. Everything runs in your browser — no uploads, no signup,
    no tracking.`,
  keywords: [
    'M Abu Hurairah',
    'HurairahTools',
    'Abu Hurairah developer',
    'free PDF tools',
    'browser tools no upload',
    'student tools free',
    'GPA calculator online',
    'citation generator free',
    'UCP developer portfolio',
  ],
  authors: [{ name: 'M Abu Hurairah', url: 'https://abuhurairah.engineer' }],
  creator: 'M Abu Hurairah',
  openGraph: {
    title: 'HurairahTools by M Abu Hurairah',
    description: '47 free tools. All run in your browser. Built by a student.',
    url: 'https://hurairahtools.vercel.app',
    siteName: 'HurairahTools',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-text antialiased flex flex-col">
        <Navbar />
        <CommandPalette />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
