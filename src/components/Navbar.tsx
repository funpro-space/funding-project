'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ButtonRegular } from './ButtonRegular';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAnimation } from '@/components/providers/AnimationEngine';
import FunProIcon from './FunProIcon';
import { useWorkspaceModal } from '@/components/providers/WorkspaceModalProvider';
import { usePrivy } from '@privy-io/react-auth';

interface NavbarProps {
  subText?: string;
  ctaText?: string;
  ctaHref?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  subText = 'Funding Project Onchain',
  ctaText = 'Project Evaluation',
}) => {
  const navRef = useRef<HTMLElement>(null);
  const { isLoaded } = useAnimation();
  const { openWorkspace, openUpdates } = useWorkspaceModal();
  const { login, authenticated: isConnected } = usePrivy();

  // Entrance animation: slide down on loader complete
  useGSAP(() => {
    if (!navRef.current) return;

    if (!isLoaded) {
      gsap.set(navRef.current, { y: -120, opacity: 0 });
      return;
    }

    gsap.fromTo(navRef.current,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.1 }
    );
  }, { dependencies: [isLoaded] });

  // Scroll animations
  useEffect(() => {
    if (!isLoaded || !navRef.current) return;

    let lastScrollY = window.scrollY;
    let isAnimating = false;
    let hasTriggeredDown = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Scroll back to top
      if (currentScrollY <= 15) {
        if (hasTriggeredDown) {
          hasTriggeredDown = false;
          isAnimating = true;
          gsap.fromTo(navRef.current,
            { y: -120, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 1.0, 
              ease: 'power4.out',
              onComplete: () => {
                isAnimating = false;
              }
            }
          );
        }
        lastScrollY = currentScrollY;
        return;
      }

      // Prevent interrupting active timelines
      if (isAnimating) {
        lastScrollY = currentScrollY;
        return;
      }

      // 2. Scrolling down past threshold
      if (currentScrollY > lastScrollY && currentScrollY > 60 && !hasTriggeredDown) {
        hasTriggeredDown = true;
        isAnimating = true;

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
          }
        });

        tl.to(navRef.current, {
          y: 100,
          duration: 0.35,
          ease: 'power2.out'
        })
        .to(navRef.current, {
          y: -120,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.in',
          delay: 0.15
        });
      }
      
      // 3. Scrolling up when hidden
      else if (currentScrollY < lastScrollY && hasTriggeredDown) {
        hasTriggeredDown = false;
        isAnimating = true;
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => {
            isAnimating = false;
          }
        });
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded]);

  // Interactive glare handler
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    nav.style.setProperty('--x', `${x}px`);
    nav.style.setProperty('--y', `${y}px`);
  };

  return (
    <header className="navbar-container">
      {/* FLOATING LIQUID GLASS NAVIGATION */}
      <nav 
        ref={navRef} 
        className="liquid-nav" 
        onMouseMove={handleMouseMove}
      >
        <div className="liquid-glare-container">
          <div className="liquid-glare"></div>
        </div>

        <div className="nav-items-central">
          {/* BRAND LOGO INSIDE THE LIQUID FLOATING NAV */}
          <Link href="/" className="navbar-logo-wrapper">
            <span className="navbar-logo-main-floating">
              <FunProIcon className="logo-icon-svg" />
            </span>
          </Link>

          {/* STATIC TEXT IN CENTER */}
          <div className="nav-static-item">
            {subText}
          </div>

          {/* BUSINESS EVALUATION ACTION INSIDE THE LIQUID FLOATING NAV */}
          <div className="navbar-cta-wrapper flex items-center gap-3">
            {!isConnected ? (
              <ButtonRegular onClick={login} variant="accent" className="text-xs uppercase tracking-wider font-bold">
                Connect Wallet
              </ButtonRegular>
            ) : (
              <>
                <ButtonRegular onClick={openUpdates} variant="default" className="text-xs uppercase tracking-wider font-bold">
                   Updates
                </ButtonRegular>
                {ctaText && (
                  <ButtonRegular onClick={openWorkspace} variant="accent" className="text-xs uppercase tracking-wider font-bold">
                    {ctaText}
                  </ButtonRegular>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
