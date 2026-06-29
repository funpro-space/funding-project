"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimation } from '@/components/providers/AnimationEngine';
import Image from 'next/image';

interface FloatingUSDCProps {
  className?: string; // For custom positioning overrides
}

export default function FloatingUSDC({ className = "fixed bottom-12 right-12 lg:bottom-16 lg:right-16" }: FloatingUSDCProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useAnimation();

  useGSAP(() => {
    if (!isLoaded || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(containerRef.current,
      {
        scale: 1,
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0
      },
      {
        scale: 0.1,
        opacity: 0,
        y: 150, // move down out of screen
        x: 150, // move right out of screen
        rotation: 35, // twist
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=500", // Animate over the first 500px of scroll
          scrub: 1.2, // Smooth scrub
          invalidateOnRefresh: true,
        }
      }
    );
  }, { dependencies: [isLoaded] });

  return (
    <div 
      ref={containerRef}
      className={`w-[40] h-[40] lg:w-[80px] lg:h-[80px] pointer-events-none hidden lg:block select-none z-100 ${className}`}
    >
      <div className="relative w-full h-full animate-float-coin">
        {/* 💙 Soft Blue Blur Backdrop Ring (Mirrors Screenshot_160 2.png tone) */}
        <div className="absolute inset-4 rounded-full bg-[var(--brand-primary)] opacity-20 blur-[60px] animate-pulse-glow" />

        {/* 🪙 Rendered USDC Token Dynamic Asset */}
        <Image 
          src="/media/home/usdc-coin.png" 
          alt="USDC Funding Token"
          fill
          unoptimized
          priority
          className="object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(0,82,255,0.25)]"
        />
      </div>
    </div>
  );
}
