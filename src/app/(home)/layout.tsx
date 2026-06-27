'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import AnimationEngine from '@/components/providers/AnimationEngine';
import HomeBackground from '@/components/home/HomeBackground';
import FunProLogoAlternative from '@/components/FunProLogoAlternative';
import WorkspaceModal from '@/components/workspace/M_WorkspaceModal';
import ProjectUpdatesModal from '@/components/updates/ProjectUpdatesModal';
import Loader from '@/components/Loader';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loaderText, setLoaderText] = useState("Loading...");
  const [currentPath, setCurrentPath] = useState(pathname);

  console.log(`[HomeLayout Debug] Render | pathname: "${pathname}" | currentPath: "${currentPath}" | isNavigating: ${isNavigating}`);

  useEffect(() => {
    console.log(`[HomeLayout Debug] Mounted/Updated on path "${pathname}"`);
  }, [pathname]);

  // Track path change to measure and clean up navigation timing safely in an effect
  useEffect(() => {
    const perfWindow = window as unknown as { __navStartTime?: number };
    if (perfWindow?.__navStartTime) {
      const duration = performance.now() - perfWindow.__navStartTime;
      console.log(`[HomeLayout Debug] Navigation from "${currentPath}" to "${pathname}" completed in ${duration.toFixed(2)}ms`);
      perfWindow.__navStartTime = undefined;
    }
  }, [pathname, currentPath]);

  // Sync state with path change during rendering (React recommended pattern)
  if (pathname !== currentPath) {
    setCurrentPath(pathname);
    setIsNavigating(false);
  }

  const handleLinkClick = (text: string, href: string) => {
    console.log(`[HomeLayout Debug] handleLinkClick called for "${text}" -> href: "${href}"`);
    if (typeof window !== 'undefined') {
      const perfWindow = window as unknown as { __navStartTime?: number };
      perfWindow.__navStartTime = performance.now();
    }
    setIsNavigating(true);
    setLoaderText(text);
  };

  return (
    <AnimationEngine>
      <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)] flex flex-col justify-between relative selection:bg-[var(--brand-primary-glow)]">
        
        {/* Fullscreen Navigation Loader Overlay */}
        {isNavigating && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md">
            <Loader text={loaderText} />
          </div>
        )}

        {/* Isolated Background Glow System (Prevents horizontal scrollbars without clipping top blur) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <HomeBackground />
          {/* Decorative Theme Glows (Slightly dim slow-motion background blooms) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--brand-primary-glow)] opacity-40 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[var(--brand-success-glow)] opacity-30 rounded-full blur-[120px] pointer-events-none" />
          {/* Dynamic Colorful Bottom Center Border Glow */}
          <div className="gradient-line-bottom" />
        </div>

        {/* Dynamic Colorful Top Center Border Glow (Allowed to bleed out top edge of viewport) */}
        <div className="gradient-line" />

        {/* FIXED PLATFORM HEADER */}
        <Navbar />

        {/* Shared Workspace Modal */}
        <WorkspaceModal />

        {/* Project Updates Modal */}
        <ProjectUpdatesModal />

        {/* Page Content */}
        <main className="flex-grow z-10">
          {children}
        </main>

        {/* FOOTER SYSTEM — Fully Purged of Internal Channels */}
        <footer 
          className="w-full relative z-10 pt-16"
          style={{
            background: 'linear-gradient(to top, #000000 0%, rgba(14, 22, 34, 0.85) 50%, rgba(33, 42, 57, 0) 100%)'
          }}
        >
          <div className="max-w-7xl mx-auto w-full px-6 flex flex-col items-center gap-4 text-center">
            
            {/* Middle Line: Animated Alternative Logo (Bright Rects only, Larger) */}
            <div className="my-2 select-none pointer-events-none transition-transform duration-500 hover:scale-110">
              <FunProLogoAlternative size={96} className="opacity-90" />
            </div>

            {/* Legal / Policy Links */}
            <div className="flex justify-center gap-8 text-[14px] font-bold font-mono uppercase tracking-wider my-1">
              <Link 
                href="/terms" 
                onClick={() => handleLinkClick("Loading Terms of Service...", "/terms")}
                className="text-[var(--brand-text-dim)] hover:text-[var(--brand-primary)] transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy" 
                onClick={() => handleLinkClick("Loading Privacy Policy...", "/privacy")}
                className="text-[var(--brand-text-dim)] hover:text-[var(--brand-primary)] transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>

            {/* Glassmorphic Social Section */}
            <div className="social-glass-btn mt-2">
              <div className="social-glass-blob1"></div>
              <div className="social-glass-inner">
                <a 
                  href="https://warpcast.com/funpro" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[var(--brand-text-dim)] hover:text-[var(--brand-primary)] text-[13px] font-bold font-mono uppercase tracking-wider transition-colors duration-200 flex items-center gap-2 relative z-10"
                >
                  <div className="relative w-4 h-4 flex items-center justify-center">
                    {/* Glowing Blurred Drop-Shadow (Reusing the image itself as a colored glow) */}
                    <Image 
                      src="/media/home/icons/warpcast.avif" 
                      alt="" 
                      width={16} 
                      height={16} 
                      className="absolute w-4 h-4 rounded-sm object-contain blur-[5px] opacity-80 scale-125 pointer-events-none select-none z-0"
                    />
                    {/* Clean Foreground Icon */}
                    <Image 
                      src="/media/home/icons/warpcast.avif" 
                      alt="Warpcast" 
                      width={16} 
                      height={16} 
                      className="relative w-4 h-4 rounded-sm object-contain z-10"
                    />
                  </div>
                  Farcaster
                </a>
                <a 
                  href="https://basescan.org/address/0xfe0ad36ab1f67acb75ebb3ac1b7fd970863d1dcc" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[var(--brand-text-dim)] hover:text-[var(--brand-primary)] text-[13px] font-bold font-mono uppercase tracking-wider transition-colors duration-200 relative z-10"
                >
                  Verified Contract
                </a>
              </div>
            </div>

            {/* Bottom Line: Smaller, Darker Copyright Text */}
            <div className=" text-[var(--brand-text-muted)] tracking-wider uppercase font-mono mt-5 text-sm">
              © 2026 funpro.space. All rights reserved. Built for the Base ecosystem.
            </div>

          </div>
        </footer>

      </div>
    </AnimationEngine>
  );
}