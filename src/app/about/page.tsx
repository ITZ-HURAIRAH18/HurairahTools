import { Metadata } from 'next';
import AboutPage from '@/components/pages/AboutClient';

export const metadata: Metadata = {
  title: 'About — M Abu Hurairah | HurairahTools',
  description:
    'Meet M Abu Hurairah, a final-year CS student at UCP and Full-Stack Developer who built HurairahTools — 47 free browser tools for students. No uploads, no signup, forever free.',
};

const technologies = [
  'Next.js',
  'TypeScript',
  'React',
  'Python',
  'Django',
  'FastAPI',
  'Node.js',
  'Express.js',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'WebSockets',
  'JWT Auth',
  'n8n Automation',
  'Tailwind CSS',
  'LangChain',
  'LangGraph',
  'Electron.js',
  'Laravel',
  'Vue.js',
];

const projects = [
  {
    name: 'FinScope',
    desc: 'Real-time crypto & stock analytics dashboard with live WebSocket data feeds and interactive charts.',
    tags: ['React', 'WebSocket', 'Chart.js'],
    github: 'https://github.com/ITZ-HURAIRAH18',
  },
  {
    name: 'HireLens',
    desc: 'AI-powered resume analysis tool using LangChain and LangGraph for intelligent candidate evaluation.',
    tags: ['FastAPI', 'LangChain', 'LangGraph', 'React'],
    github: 'https://github.com/ITZ-HURAIRAH18',
  },
  {
    name: 'DonorHub',
    desc: 'Charity and donation platform built on the MERN stack with full NGO management workflows.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    github: 'https://github.com/ITZ-HURAIRAH18',
  },
  {
    name: 'LoanVerse',
    desc: 'Full-stack loan management system with applicant tracking and admin dashboard.',
    tags: ['Django', 'React', 'PostgreSQL'],
    github: 'https://github.com/ITZ-HURAIRAH18',
  },
  {
    name: 'NexGen',
    desc: 'Video meeting scheduling platform with WebRTC real-time communication built in.',
    tags: ['WebRTC', 'Node.js', 'React'],
    github: 'https://github.com/ITZ-HURAIRAH18',
  },
  {
    name: 'Supportify',
    desc: 'AI customer support automation connecting a Telegram bot to FastAPI via n8n workflows.',
    tags: ['Telegram', 'FastAPI', 'n8n'],
    github: 'https://github.com/ITZ-HURAIRAH18',
  },
];

const stats = [
  { num: '47', label: 'Tools Built' },
  { num: '0', label: 'Server Uploads' },
  { num: '6+', label: 'Projects Shipped' },
  { num: '∞', label: 'Free Forever' },
];

export default function AboutServerPage() {
  return <AboutPage technologies={technologies} projects={projects} stats={stats} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#9AB8A0]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
        {children}
      </span>
      <div className="flex-1 border-t border-[#D5EDD9]" />
    </div>
  );
}