'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, GitFork, Lightbulb, ExternalLink, Wrench } from 'lucide-react';

interface AboutClientProps {
  technologies: string[];
  projects: Array<{
    name: string;
    desc: string;
    tags: string[];
    github: string;
  }>;
  stats: Array<{ num: string; label: string }>;
}

export default function AboutClient({ technologies, projects, stats }: AboutClientProps) {
  return (
    <div className="min-h-screen bg-[#F7FAF8]">
      {/* ===== HERO BAND ===== */}
      <section className="relative w-full bg-[#0A2415] px-6 py-14 md:px-24 md:py-20 overflow-hidden">
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[960px]">
          <div className="flex flex-col items-start gap-10 md:flex-row">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#2D8A50] bg-[#1A6B3A] font-display text-2xl font-extrabold text-white leading-none"
                style={{ fontFamily: 'var(--font-bricolage)' }}
              >
                MAH
              </div>
            </motion.div>

            {/* Content */}
            <div className="min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <span
                  className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[1.5px] text-[#6DBB8A]"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  About the Creator
                </span>

                <h1
                  className="text-3xl font-extrabold leading-[1] tracking-[-1.5px] text-white md:text-4xl"
                  style={{ fontFamily: 'var(--font-bricolage)' }}
                >
                  <span className="block text-white">M Abu </span>
                  <span className="block text-[#4ADE80]">Hurairah</span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {[
                  'Full-Stack Developer',
                  'Final Year CS · UCP',
                  'Open Source Builder',
                  'MERN Stack Certified',
                ].map((badge, i) => (
                  <span
                    key={i}
                    className="inline-block rounded-full border border-white/[.15] bg-white/[.08] px-3.5 py-1 text-[11px] font-semibold text-[#A7F3C0]"
                  >
                    {badge}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="mt-6 max-w-[520px] text-sm leading-relaxed text-[#9AB8A0]"
              >
                I&apos;m a final-year CS student at UCP and a practicing
                Full-Stack Developer at Nexagen Solution. I built
                HurairahTools because I was tired of sketchy online
                tools that upload your files to unknown servers. So I
                built 47 utilities that run entirely in your browser
                — free, private, and forever.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <Link
                  href="https://abuhurairah.engineer"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1A6B3A] px-5 py-[9px] text-sm font-semibold text-white transition-colors hover:bg-[#155C30]"
                >
                  <Globe className="h-[15px] w-[15px]" />
                  abuhurairah.engineer <ExternalLink className="ml-0.5 h-3 w-3" />
                </Link>

                <Link
                  href="https://github.com/ITZ-HURAIRAH18"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-5 py-[9px] text-sm font-semibold text-[#A7F3C0] transition-colors hover:bg-white/[.06]"
                >
                  <GitFork className="h-[15px] w-[15px]" />
                  ITZ-HURAIRAH18 <ExternalLink className="ml-0.5 h-3 w-3" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ROW ===== */}
      <section className="relative z-10 mx-auto max-w-[960px] px-6 md:px-16 -mt-7 mb-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-3.5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="rounded-xl border border-[#D5EDD9] bg-white p-5 text-center shadow-[0_4px_20px_rgba(26,107,58,0.08)]"
            >
              <div
                className="font-display text-2xl font-extrabold tracking-[-1px] text-[#0A2415]"
                style={{ fontFamily: 'var(--font-bricolage)' }}
              >
                {stat.num}
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-[#6B9478]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION WRAPPER ===== */}
      <div className="mx-auto max-w-[960px] px-6 pb-16 md:px-16">
        {/* ===== TECH STACK ===== */}
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <span
              className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#9AB8A0]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              TECH STACK
            </span>
            <div className="flex-1 border-t border-[#D5EDD9]" />
          </div>

          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {technologies.map((tech, i) => (
              <motion.span
                key={tech}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="inline-block rounded-full border border-[#D5EDD9] bg-white px-4 py-[7px] text-sm font-medium text-[#0A2415] transition-colors hover:border-[#1A6B3A] hover:text-[#1A6B3A]"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </section>

        {/* ===== THE STORY ===== */}
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <span
              className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#9AB8A0]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              THE STORY
            </span>
            <div className="flex-1 border-t border-[#D5EDD9]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-[#D5EDD9] bg-white"
          >
            {/* Top strip */}
            <div className="flex items-center gap-4 bg-[#EEF7F1] border-b border-[#D5EDD9] px-7 py-[22px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A6B3A]">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3
                  className="text-[15px] font-bold text-[#0A2415]"
                  style={{ fontFamily: 'var(--font-bricolage)' }}
                >
                  Why I built HurairahTools
                </h3>
                <p className="mt-[3px] text-[12px] text-[#6B9478]">
                  A student&apos;s frustration turned into 47 tools
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-7 py-8">
              <p className="mb-[18px] text-[14px] leading-relaxed text-[#3D6B4F]">
                Every time I needed to compress a PDF before submitting an
                assignment, or convert an image for a presentation, or generate
                a citation for my thesis — I&apos;d find some sketchy website
                that uploads your file to a server you know nothing about, shows
                you ads, and makes you wait.
              </p>
              <p className="mb-[18px] text-[14px] leading-relaxed text-[#3D6B4F]">
                So I built the tools myself. 47 of them. All running entirely
                in your browser. Your files never touch a server — because there
                is no server.
              </p>
              <p className="mb-[18px] text-[14px] leading-relaxed text-[#3D6B4F]">
                This is my way of giving back to every student who&apos;s been
                in the same situation.
              </p>
              <div className="border-t border-[#EEF7F1] pt-5 text-right">
                <p
                  className="text-[13px] font-semibold text-[#1A6B3A]"
                  style={{ fontFamily: 'var(--font-bricolage)' }}
                >
                  — M Abu Hurairah, CS Student &amp; Developer
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== OTHER PROJECTS ===== */}
        <section className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <span
              className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#9AB8A0]"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              OTHER PROJECTS
            </span>
            <div className="flex-1 border-t border-[#D5EDD9]" />
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="rounded-xl border border-[#D5EDD9] bg-white p-[22px] transition-colors hover:border-[#1A6B3A]"
              >
                <div className="mb-[10px] flex items-center justify-between">
                  <h3
                    className="text-[15px] font-bold text-[#0A2415]"
                    style={{ fontFamily: 'var(--font-bricolage)' }}
                  >
                    {project.name}
                  </h3>
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1A6B3A] transition-colors hover:underline"
                  >
                    ↗ GitHub <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <p className="mb-3.5 text-[13px] leading-relaxed text-[#3D6B4F]">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-[#EEF7F1] px-2.5 py-[3px] text-[10px] font-semibold text-[#1A6B3A]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== CTA CARD ===== */}
        <section className="relative overflow-hidden rounded-2xl bg-[#0A2415] px-6 py-12 text-center md:px-16 md:py-[56px]">
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h2
              className="mb-2.5 text-2xl font-extrabold tracking-[-0.5px] text-white md:text-[28px]"
              style={{ fontFamily: 'var(--font-bricolage)' }}
            >
              Ready to use the tools?
            </h2>
            <p className="mb-7 text-[15px] text-[#6DBB8A]">
              47 utilities. Zero signup. All running in your browser.
            </p>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1A6B3A] px-8 py-[14px] text-sm font-semibold text-white transition-colors hover:bg-[#155C30]"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                <Wrench className="h-4 w-4" />
                Browse All Tools →
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}