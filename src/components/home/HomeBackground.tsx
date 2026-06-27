'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAnimation } from '@/components/providers/AnimationEngine';

export default function HomeBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useAnimation();

  useGSAP(() => {
    if (!bgRef.current) return;

    if (!isLoaded) {
      gsap.set(bgRef.current, { opacity: 0 });
      return;
    }

    // Delay: navbar animation is delay 0.1s + duration 1.2s = 1.3s total.
    // We bring the background with opacity starting exactly after nav drops.
    gsap.to(bgRef.current, {
      opacity: 1,
      duration: 1.6,
      ease: 'power3.out',
      delay: 1.3,
    });
  }, { dependencies: [isLoaded] });

  return (
    <div
      ref={bgRef}
      className="absolute inset-0 home-bg-image pointer-events-none z-0 opacity-0"
    />
  );
}
