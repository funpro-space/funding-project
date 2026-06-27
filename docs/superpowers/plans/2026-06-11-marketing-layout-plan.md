# Marketing Layout and Hero Component Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move global/marketing layout elements (header, footer, background glows) to a dedicated Next.js layout file, and replace the inline hero with the `MarketingHero` component.

**Architecture:** Create a new `(marketing)/layout.tsx` layout to wrap the pages in the marketing group. This avoids duplicating header/footer code. Refactor the `(marketing)/page.tsx` file to render the pre-built `<MarketingHero />` component and keep clean layout separation.

**Tech Stack:** Next.js (App Router), React, TailwindCSS / PostCSS.

---

### Task 1: Create Marketing Layout

**Files:**
- Create: `src/app/(marketing)/layout.tsx`

- [ ] **Step 1: Write the marketing layout file**
Create `src/app/(marketing)/layout.tsx` with standard React props, Next.js metadata, and components moved from the marketing page.

```tsx
import React from 'react';
import Link from 'next/link';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between relative overflow-hidden selection:bg-nice-500/30">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-nice-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* FIXED PLATFORM HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-zinc-900/60 bg-zinc-950/80 backdrop-blur-md sticky top-0">
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-zinc-100">funpro<span className="text-nice-400">.space</span></span>
          <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Funding Ecosystem</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:block">Ecosystem Blueprint</a>
          <Link 
            href="/workspace" 
            className="text-xs font-bold bg-nice-600 hover:bg-nice-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-nice-600/10"
          >
            Launch Active Sandbox
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow z-10">
        {children}
      </main>

      {/* FOOTER SYSTEM */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-zinc-900 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-zinc-600 tracking-wider uppercase gap-4 z-10">
        <div>© 2026 funpro.space. All rights reserved. Built for the Base ecosystem.</div>
        <div className="flex gap-4">
          <a href="https://funpro.space" className="hover:text-zinc-400 transition-colors">funpro.space Main</a>
          <span>•</span>
          <span className="text-zinc-500">Stablecoin Focus: USDC</span>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Commit layout**
```bash
git add src/app/\(marketing\)/layout.tsx
git commit -m "feat(marketing): create layout with header and footer"
```

---

### Task 2: Update Marketing Hero Component Buttons

**Files:**
- Modify: `src/components/marketing/MarketingHero.tsx`

- [ ] **Step 1: Replace plain button with Next.js Link in MarketingHero**
Import `Link` from `next/link` and wrap the "Test Live AI Underwriting Box" button to direct users to `/workspace`.

```tsx
import Link from 'next/link';

export default function MarketingHero() {
  return (
    <section className="pt-28 pb-16 text-center max-w-5xl mx-auto px-4 z-10 relative">
      {/* ⚡ Action-Driven Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-xs font-mono text-nice-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Stage 1 Live: Next-Gen Onchain Business Registration
      </div>

      {/* 🚀 Simplified, Grounded Headline */}
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent leading-tight max-w-4xl mx-auto">
        Modern Funding Infrastructure <br className="hidden sm:inline" />
        for Sustainable Businesses
      </h1>

      {/* 🎯 Real-World Subtext */}
      <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
        We reject short-lived automation trends. Our platform provides next-generation capital 
        pipelines and structured tools built for foundational companies that require long-term execution, 
        deliberate financial planning, and programmatic security.
      </p>
      
      {/* 🎛️ Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link 
          href="/workspace"
          className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
        >
          Test Live AI Underwriting Box <span>→</span>
        </Link>
        <a 
          href="https://funpro.space" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full sm:w-auto bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-medium px-6 py-3 rounded-xl transition-colors flex items-center justify-center"
        >
          Explore funpro.space
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit MarketingHero update**
```bash
git add src/components/marketing/MarketingHero.tsx
git commit -m "refactor(marketing): update hero buttons to link to workspace"
```

---

### Task 3: Refactor Marketing Page to Use MarketingHero

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Replace page content**
Rewrite `src/app/(marketing)/page.tsx` to render `<MarketingHero />` and remove the redundant layout containers, header, and footer. Keep GSAP animations if needed, or simplify since the layout wrapper is now handled by the parent layout component.

Let's keep page-level structure simple and render the main section contents.

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import OnchainStepper from '@/components/marketing/OnchainStepper';
import MarketingHero from '@/components/marketing/MarketingHero';

export default function MarketingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.animate-hero', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.1 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col gap-12 pb-16">
      
      {/* RENDER PRE-BUILT MARKETING HERO */}
      <MarketingHero />

      {/* STEPPER SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 z-10 border-t border-zinc-900 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-nice-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md">
          <OnchainStepper />
        </div>
      </section>

      {/* DETAILED INFORMATION SECTION (The 3 Core Pillars) */}
      <section id="features" className="w-full max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 border-t border-zinc-900">
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-2xl transition-all hover:border-zinc-700">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 font-mono text-xs">        
            01
          </div>
          <h3 className="font-semibold text-white text-base">Underwrite in the Sandbox</h3>
          <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
            Founders structure messy, high-level business ideas. AI parameters convert inputs into clear target budgets, calculated down to the cent.
          </p>
        </div>

        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-2xl transition-all hover:border-zinc-700">
          <div className="w-8 h-8 rounded-lg bg-nice-500/10 border border-nice-500/20 flex items-center justify-center text-nice-400 mb-4 font-mono text-xs">
            02
          </div>
          <h3 className="font-semibold text-white text-base">Optimize via Private Notes</h3>
          <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
            Review live strategies, adjust structural dependencies, and log everyday granular project milestones inside an isolated, private workspace framework.
          </p>
        </div>

        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-2xl transition-all hover:border-zinc-700">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 font-mono text-xs">
            03
          </div>
          <h3 className="font-semibold text-white text-base">Stabilize & Distribute</h3>
          <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
            Deploy finalized funding models straight into locked multi-sig environments, releasing team capital systematically over the Base network.
          </p>
        </div>
      </section>

    </div>
  );
}
```

- [ ] **Step 2: Commit Page refactor**
```bash
git add src/app/\(marketing\)/page.tsx
git commit -m "refactor(marketing): replace page body with MarketingHero and remove layout elements"
```

---

### Task 4: Verify Compilation

- [ ] **Step 1: Run Next.js build compilation to verify**
Run the compiler to ensure everything integrates correctly with no lint/type errors.

Command: `npm run build` or `npx next build`
Expected: Successful build completion with no errors.
