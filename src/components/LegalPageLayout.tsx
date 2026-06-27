'use client';

import React from 'react';
import Link from 'next/link';

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  icon: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  icon,
  sections,
}: LegalPageLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
      {/* Decorative background glows specific to this document layout */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-[var(--brand-primary-glow)] opacity-20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Back to Home Link */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-[var(--brand-primary)] hover:text-white transition-colors duration-300 group"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
            &larr;
          </span>
          Back to Platform
        </Link>
      </div>

      {/* Premium Document Header */}
      <div className="relative border border-[var(--brand-border-light)] bg-[rgba(15,23,42,0.4)] backdrop-blur-md rounded-lg p-8 md:p-12 mb-16 overflow-hidden">
        {/* Glow corner decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary-glow)] opacity-30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(203,213,225,0.05)] border border-[var(--brand-border-light)] text-3xl shadow-[0_0_20px_0_rgba(102,154,225,0.1)]">
            {icon}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-orbitron bg-gradient-to-r from-white via-[var(--brand-primary)] to-white bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-base font-mono text-[var(--brand-text-secondary)]">
              {subtitle}
            </p>
          </div>
          <div className="inline-flex items-center px-3 py-1.5 rounded bg-[rgba(203,213,225,0.05)] border border-[var(--brand-border-light)] text-sm font-bold font-mono uppercase tracking-wider text-[var(--brand-text-dim)]">
            {lastUpdated}
          </div>
        </div>
      </div>

      {/* Main Content Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28 self-start max-h-[75vh] overflow-y-auto pr-4 scrollbar-thin">
          <div className="space-y-6">
            <div className="text-sm font-extrabold font-mono uppercase tracking-widest text-[var(--brand-text-muted)] border-b border-[var(--brand-border-light)] pb-3">
              Document Outline
            </div>
            <nav className="flex flex-col gap-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm font-mono tracking-wide text-[var(--brand-text-dim)] hover:text-[var(--brand-primary)] transition-colors duration-200 border-l-2 border-transparent hover:border-[var(--brand-primary)] pl-3 block py-1"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-16">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 group relative"
            >
              {/* Decorative top dot marker */}
              <div className="absolute -left-4 top-2 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary-border)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <h2 className="text-xl font-bold font-orbitron uppercase tracking-wider text-[var(--brand-primary)] border-b border-[var(--brand-border-light)] pb-3 mb-6 flex items-center gap-2">
                <span className="text-[var(--brand-border)] font-mono text-sm opacity-60">#</span>
                {section.title}
              </h2>
              <div className="space-y-4 text-base font-mono text-[var(--brand-text-secondary)] leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}