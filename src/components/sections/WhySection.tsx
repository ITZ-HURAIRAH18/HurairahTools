import { ShieldCheck, Zap, GraduationCap } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Zero Uploads',
    description: "Files are processed entirely in your browser tab. We literally can't see your data.",
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'No server round-trips. Your local CPU does all the heavy lifting instantly.',
  },
  {
    icon: GraduationCap,
    title: 'Built for Students',
    description: 'From GPA calculators to citation generators, every tool is designed for university life.',
  },
];

export function WhySection() {
  return (
    <section id="why-unitoolkit" className="w-full bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-text sm:text-4xl">Why use UniToolKit?</h2>
          <p className="mt-4 text-lg text-text-muted">Fast, free, and incredibly secure.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-2 border border-border-soft">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--violet))] shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 font-display text-xl font-bold text-text">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
