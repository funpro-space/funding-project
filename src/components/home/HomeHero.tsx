"use client";

import React from 'react';
import Image from 'next/image';
import WarningIcon from '@/components/WarningIcon';
const railsDivider = '/media/home/rails.avif';

export interface PublicStatsType {
  totalChats: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTotalTokens: number;
  totalCostUsd: number;
}

interface MarketingHeroProps {
  onOpenSandbox?: () => void;
}

export default function MarketingHero({}: MarketingHeroProps) {
  return (
    <>
      <section className="pt-2 md:pt-6 text-center max-w-8xl mx-auto px-4 z-10 relative">
        
        {/* ⚡ Cleaned Pill Badge — Fully synced to your structural theme variables */}
        <div className="v-badge animate-hero opacity-0">
          <WarningIcon className="v-badge-ai-icon" />
          <span>Active Development <span className="v-badge-detail">(Project Analysis Live)</span></span>
        </div>

        {/* 🚀 Sleek, Direct Funding Headline */}
        <div className="backdrop py-5 sm:py-7 lg:py-12">
        <span className="animate-hero ">
        Funding and Support 
        </span>
        </div>


        {/* 🎯 Nice, Simple, and Human-Readable Subtext */}
        <p className="brand-tag animate-hero opacity-0 mx-auto max-w-5xl">
Discover project development possibilities through a designed process  </p>

        
        {/* 🌐 Network and Settlement Metadata */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center text-[var(--font-size-xxs)] font-bold uppercase tracking-wider opacity-85 animate-hero opacity-0 mt-6">
          <span className="flex items-center gap-1.5 text-[var(--brand-text-dim)] font-mono normal-case">
            Powered by
            <Image 
              src="/media/home/icons/base-mainnet.svg" 
              alt="Base" 
              width={16} 
              height={16} 
              className="object-contain"
            />
            Base
          </span>
          <span className="flex items-center gap-1.5 text-[var(--brand-success)] font-mono opacity-90">
            Currency:
            <Image 
              src="/media/home/icons/usdc.svg" 
              alt="USDC" 
              width={18} 
              height={18} 
              className="object-contain"
            />
            USDC
          </span>
        </div>

      </section>

      {/* 🛤️ Rails Divider with Ambient Shadow Glow */}
      <div className="w-full animate-hero-fade opacity-0 relative py-6 z-10"
      style={{ maxHeight: 1 }}>
        {/* Glow Shadow (Duplicate image placed behind) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none filter blur-2xl opacity-80 scale-y-110 scale-x-95">
          <Image 
            src={railsDivider} 
            alt="" 
            className="w-full h-full object-cover" 
            priority
            unoptimized
            width={1920}
            height={3}
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
          width={1920}
          height={3}
        />
      </div>
    </>
  );
}
