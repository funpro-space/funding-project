"use client";

import React from 'react';
import Image from 'next/image';
import WarningIcon from '@/components/WarningIcon';
import railsDivider from '../../../public/media/home/rails.avif';

export default function MarketingHero() {
  return (
    <>
      <section className="pt-5 md:pt-12 text-center max-w-8xl mx-auto px-4 z-10 relative">
        
        {/* ⚡ Cleaned Pill Badge — Fully synced to your structural theme variables */}
        <div className="v-badge animate-hero opacity-0">
          <WarningIcon className="v-badge-ai-icon" />
          <span>Active Development Sandbox <span className="v-badge-detail">(Not live yet for public)</span></span>
        </div>

        {/* 🚀 Sleek, Direct Funding Headline */}
        <div className="backdrop py-5 sm:py-7 lg:py-12">
        <span className="animate-hero ">
        Funding and Support 
        </span>
        </div>


        {/* 🎯 Nice, Simple, and Human-Readable Subtext */}
        <p className="brand-paragraph animate-hero opacity-0 mt-4 mx-auto max-w-5xl">
          A Web3 advisory and milestone ecosystem built for the physical economy. We provide tools and milestone-driven funding structures designed to support talented artists, craftspeople, farmers, and sustainable producers looking to grow structured projects.
        </p>

        
        {/* 🌐 Network and Settlement Metadata */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 items-center text-[var(--font-size-xxs)] font-bold uppercase tracking-wider opacity-85 animate-hero opacity-0 mt-6">
          <span className="text-[var(--brand-text-dim)] font-mono normal-case">
            Network Target: Base Mainnet
          </span>
          <span className="text-[var(--brand-border)] opacity-40">•</span>
          <span className="text-[var(--brand-success)] font-mono opacity-90">
            Settlement Asset: USDC
          </span>
        </div>

      </section>

      {/* 🛤️ Rails Divider with Ambient Shadow Glow */}
      <div className="w-full animate-hero-fade opacity-0 relative py-6"
      style={{ maxHeight: 1 }}>
        {/* Glow Shadow (Duplicate image placed behind) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none filter blur-2xl opacity-80 scale-y-110 scale-x-95">
          <Image 
            src={railsDivider} 
            alt="" 
            className="w-full h-full object-cover" 
            priority
            unoptimized
          />
        </div>

        {/* Sharp Foreground Image */}
        <Image 
          src={railsDivider} 
          alt="Rails Divider" 
          className="w-full h-auto block object-cover relative z-10" 
          style={{ maxHeight: 3 }}
          priority
          unoptimized
        />
      </div>
    </>
  );
}
