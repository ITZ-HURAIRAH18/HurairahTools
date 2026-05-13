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
    <section id="why-unitoolkit" className="w-full bg-[#EEF7F1] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
<h2 className="font-display text-4xl font-bold text-[#0A2415] sm:text-5xl">Why use UniToolKit?</h2>
           <p className="mt-4 text-lg text-[#3D6B4F]">Fast, free, and incredibly secure.</p>
        </div>

<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
           {features.map((feature, index) => (
             <div key={index} className="flex flex-col items-center text-center p-8 rounded-xl bg-white border border-[#D5EDD9] hover:border-[#1A6B3A] transition-colors">
               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-[#EEF7F1]">
                 <feature.icon className="h-7 w-7 text-[#1A6B3A]" />
               </div>
               <h3 className="mb-3 font-display text-lg font-bold text-[#0A2415]">{feature.title}</h3>
               <p className="text-[#3D6B4F] leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
