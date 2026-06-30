'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimationContextProps {
  isLoaded: boolean;
}

const AnimationContext = createContext<AnimationContextProps | null>(null);

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    // Default to true if used outside of AnimationEngine
    return { isLoaded: true };
  }
  return context;
}

interface AnimationEngineProps {
  children: React.ReactNode;
}

export default function AnimationEngine({ children }: AnimationEngineProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [counter, setCounter] = useState(0);
  const masterContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // 1. Preloader Animation
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
      }
    });

    const countObj = { value: 0 };
    tl.to(countObj, {
      value: 100,
      duration: 1.6,
      ease: 'power3.in',
      onUpdate: () => {
        setCounter(Math.round(countObj.value));
      }
    });

    tl.to(loaderRef.current, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.6,
      ease: 'power3.inOut'
    }, '+=0.2');

  }, { scope: loaderRef });

  // 2. Page Transitions and Scoped Animations (only run when loaded)
  useGSAP(() => {
    if (!isLoaded) return;

    // --- TRANSITION 01: The Left-To-Right 6 Bar Chart Wave ---
    const chartBars = masterContainerRef.current?.querySelectorAll('[data-animate="chart-bar"]');
    if (chartBars && chartBars.length > 0) {
      gsap.to(chartBars, {
        scaleY: 1.6,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: 'bottom center',
        stagger: {
          each: 0.15,
          from: 'start'
        }
      });
    }

    // --- TRANSITION 02: Subtle Stagger Fade for Human-Readable Cards ---
    const cardGrid = masterContainerRef.current?.querySelector('[data-animate="card-grid"]');
    const fadeCards = masterContainerRef.current?.querySelectorAll('[data-animate="fade-card"]');
    if (cardGrid && fadeCards && fadeCards.length > 0) {
      gsap.from(fadeCards, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: cardGrid,
          start: 'top 85%',
        }
      });
    }

    // --- TRANSITION 03: Global Subtle Header Text Fade ---
    const headerTexts = masterContainerRef.current?.querySelectorAll('[data-animate="header-text"]');
    if (headerTexts && headerTexts.length > 0) {
      gsap.from(headerTexts, {
        opacity: 0,
        filter: 'blur(4px)',
        duration: 1.2,
        ease: 'power3.out'
      });
    }

  }, { scope: masterContainerRef, dependencies: [isLoaded] });

  return (
    <AnimationContext.Provider value={{ isLoaded }}>
      <div ref={masterContainerRef} className="w-full relative">
        {/* Preloader Screen */}
        {!isLoaded && (
          <div
            ref={loaderRef}
            id="global-preloader"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950"
          >
            {/* Cyberpunk glowing background auras */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-nice-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Progress percentage */}
              <div className="text-4xl font-extrabold font-mono text-zinc-100 tracking-wider">
                {String(counter).padStart(3, '0')}
              </div>

              {/* High-tech custom thin progress bar */}
              <div className="w-64 h-[2px] bg-zinc-900/80 rounded-full relative mt-2">
                <div
                  className="absolute left-0 top-0 bottom-0 rounded-full animate-loader-fill shadow-[0_0_16px_rgba(140,180,245,0.9)]"
                  style={{ width: `${counter}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content body wrapper with smooth fade reveal */}
        <div
          id="global-content-wrapper"
          className={`w-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {children}
        </div>
      </div>
    </AnimationContext.Provider>
  );
}
