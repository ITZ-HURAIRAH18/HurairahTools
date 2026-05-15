import Hero from '@/components/sections/Hero';
import { ToolGrid } from '@/components/sections/ToolGrid';
import { WhySection } from '@/components/sections/WhySection';
import { UniSpotlight } from '@/components/sections/UniSpotlight';
import DeveloperFloatingCard from '@/components/DeveloperFloatingCard';

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      <Hero />
      <ToolGrid />
      <WhySection />
      <UniSpotlight />

      {/* Developer Floating Card */}
      <DeveloperFloatingCard />

      {/* SECTION 5 — Trust Banner */}
      <section className="w-full bg-surface-2 py-8 border-t border-border/50 text-center px-4">
        <div className="mx-auto max-w-4xl rounded-xl border border-success/20 bg-success/5 p-4 sm:p-6 shadow-sm">
          <p className="text-sm font-medium text-success sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>Open DevTools &rarr; Network Tab &rarr; Upload a file &rarr;</span>
            <strong className="bg-success text-black px-2 py-0.5 rounded uppercase tracking-wider text-xs">See zero requests</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
