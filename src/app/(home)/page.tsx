'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import OnchainStepper from '@/components/home/OnchainStepper';
import MarketingHero from '@/components/home/HomeHero';
import BottomCallToAction from '@/components/home/BottomCallToAction';
import FAQ from '@/components/home/FAQ';
import Mission from '@/components/home/Mission';
import FloatingUSDC from '@/components/home/FloatingUSDC';
import { useAnimation } from '@/components/providers/AnimationEngine';
import { usePrivy } from '@privy-io/react-auth';
import { ButtonLoader } from '@/components/ButtonLoader';
import { ModernMenu, ModernMenuTrigger, ModernMenuContent, ModernMenuItem } from '@/components/ModernMenu';
import RevealIcon from '@/components/RevealIcon';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useAnimation();
  const { logout, authenticated: isConnected, user } = usePrivy();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("[Logout Debug - page.tsx] Render - isConnected:", isConnected, "isLoggingOut:", isLoggingOut, "isMenuOpen:", isMenuOpen, "Has user:", !!user);

  const handleLogout = async (e: React.MouseEvent) => {
    console.log("[Logout Debug - page.tsx] handleLogout called");
    e.stopPropagation();
    setIsLoggingOut(true);
    try {
      console.log("[Logout Debug - page.tsx] Starting logout and 2s delay...");
      await Promise.all([
        logout().then(() => {
          console.log("[Logout Debug - page.tsx] Privy logout finished");
        }),
        new Promise((resolve) => setTimeout(() => {
          console.log("[Logout Debug - page.tsx] 2s timeout finished");
          resolve(true);
        }, 2000))
      ]);
    } catch (error) {
      console.error("[Logout Debug - page.tsx] Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      console.log("[Logout Debug - page.tsx] isLoggingOut reset to false");
    }
  };

  useGSAP(() => {
    if (!isLoaded) return;

    const elements = containerRef.current?.querySelectorAll('.animate-hero');
    const fadeElement = containerRef.current?.querySelector('.animate-hero-fade');

    if ((elements && elements.length > 0) || fadeElement) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      if (elements && elements.length > 0) {
        tl.fromTo(elements, 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.15 }
        );
      }

      if (fadeElement) {
        tl.fromTo(fadeElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.2"
        );
      }
    }
  }, { scope: containerRef, dependencies: [isLoaded] });

  return (
    <div ref={containerRef} className="flex flex-col">
      
      {/* RENDER PRE-BUILT MARKETING HERO */}
      <MarketingHero />

      {/* STEPPER SECTION */}
      <section className="stepper-section py-5 md:py-12">
        <div className="stepper-glow-bg" />
        <div className="stepper-outer-container">
          <OnchainStepper />
        </div>
      </section>

      {/* BOTTOM CALL TO ACTION SECTION */}
      <BottomCallToAction />

      {/* FAQ SECTION */}
      <FAQ />

      {/* OUR MISSION SECTION */}
      <Mission />

      {/* FLOATING USDC COIN (Scroll animated) */}
      <FloatingUSDC />

      {/* STICKY BOTTOM LEFT FLOATING ACTIONS CONTROL CAPSULE (BELOW MODALS) */}
      {(isConnected || isLoggingOut) && (
        <div className="absolute top-24 left-12 z-40 animate-hero-fade">
          <ModernMenu layout="col-flow" open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <ModernMenuTrigger
              showSideLight={false}
              className="menu-trigger-raw"
            >
              <div className="flex items-center gap-3 p-3 bg-zinc-950/85 backdrop-blur-md border border-[var(--brand-border)]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:bg-zinc-900/40">
                <div className="flex items-center gap-2 px-1 shrink-0">
                  <span className="w-2 h-2 rounded-full workspace-address-pulse" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400 ml-1">Connected</span>
                </div>
                <div className="flex items-center gap-2 px-2 border-l border-[var(--brand-border)]/20">
                  <span className="font-mono text-xs font-semibold text-zinc-300">
                    {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : "Unknown Address"}
                  </span>
                </div>
                <div className="flex items-center pl-2 border-l border-[var(--brand-border)]/20">
                  <RevealIcon isOpen={isMenuOpen} className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
            </ModernMenuTrigger>

            <ModernMenuContent className="relative flex flex-col gap-2 mt-2 w-fit">
              <ModernMenuItem index={0} className="w-full">
                <div className="p-2 bg-zinc-950/90 backdrop-blur-md border border-red-500/20 rounded-2xl shadow-xl flex justify-center w-full">
                  <ButtonLoader
                    isLoading={isLoggingOut}
                    onClick={handleLogout}
                    className="w-full text-center text-[10px] uppercase tracking-wider font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 py-1.5 px-3 rounded-xl border border-red-500/20 transition-all cursor-pointer bg-transparent"
                  >
                    Disconnect
                  </ButtonLoader>
                </div>
              </ModernMenuItem>
            </ModernMenuContent>
          </ModernMenu>
        </div>
      )}

    </div>
  );
}
