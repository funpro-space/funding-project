"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

interface FeatureItem {
  name: string;
  status: "Live" | "Staging Integration" | "Level 2 Pipeline";
  statusColorClass: string;
  isLiveStatus?: boolean;
  icon?: string;
}

interface Step {
  title: string;
  description: string;
  badge: string;
  badgeIcon?: string;
  featuresTitle: string;
  features: FeatureItem[];
}

export default function OnchainStepper() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [prevStep, setPrevStep] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRowRef = useRef<HTMLDivElement>(null);
  const slidingBgRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  
  const prevHeightRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  const steps: Step[] = [
    {
      title: "Project Analysis",
      description: "The feature enabling founders to discover new possibilities that are inside of the process.",
      badge: "Base Mainnet Live",
      badgeIcon: "/media/home/icons/base-mainnet.svg",
      featuresTitle: "Level 1 Feature Capability Set",
      features: [
        { name: "Gemini Underwriting Engine", status: "Live", statusColorClass: "text-[var(--brand-success)]", isLiveStatus: true, icon: "/media/home/icons/Google_Gemini_icon_2025.svg" },
        { name: "Base Mainnet Smart Contract Registry", status: "Live", statusColorClass: "text-[var(--brand-success)]", isLiveStatus: true, icon: "/media/home/icons/base-mainnet.svg" },
        { name: "Business Readiness", status: "Live", statusColorClass: "text-[var(--brand-success)]", isLiveStatus: true }
      ]
    },
    {
      title: "Project Workspace",
      description: "A tool for possibilities and a workstation for your curiosity—flexible, open, and built to help us prepare for the launch.",
      badge: "Module Ready",
      featuresTitle: "Level 2 Internal System Dependencies",
      features: [
        { name: "Split-Screen Note Canvas Web App", status: "Live", statusColorClass: "text-[var(--brand-success)]", isLiveStatus: true },
        { name: "Ecosystem Portal Account Bridging", status: "Staging Integration", statusColorClass: "text-[var(--brand-primary)]" }
      ]
    },
    {
      title: "Expense and Revenue ",
      description: "This is why some founders succeed—they know their numbers. A world-class system that lets you stay ahead of the game.",
      badge: "Module Ready",
      featuresTitle: "Level 3 Core Architecture Assets",
      features: [
        { name: "Financial Institution Integration", status: "Live", statusColorClass: "text-[var(--brand-primary)]" },
        { name: "Dynamic Burn-Rate Burner Engine", status: "Level 2 Pipeline", statusColorClass: "text-[var(--brand-text-dim)]" }
      ]
    },
    {
      title: "Advisory Review & Milestone Lock",
      description: "Connecting founders to share support, build momentum, and unlock new possibilities.",
      badge: "Module Ready",
      featuresTitle: "Level 4 Settlement Rules Engine",
      features: [
        { name: "Gasless USDC Minting Contract", status: "Level 2 Pipeline", statusColorClass: "text-[var(--brand-text-dim)]" },
        { name: "Multi-Signature Milestone Escrow Protocol", status: "Level 2 Pipeline", statusColorClass: "text-[var(--brand-text-dim)]" }
      ]
    }
  ];

  // Capture Flip state and trigger transition
  const handleStepClick = (index: number) => {
    if (index === activeStep || isAnimatingRef.current) return;
    setActiveStep(index);
  };

  useGSAP(() => {
    if (!containerRef.current || !tabsRowRef.current || !slidingBgRef.current) return;

    // 1. Flip slide animation when activeStep changes via arrow clicks
    const activeElement = tabsRowRef.current.querySelector('[data-active="true"]');
    if (activeElement && slidingBgRef.current.parentElement !== activeElement) {
      const state = Flip.getState(slidingBgRef.current);
      activeElement.appendChild(slidingBgRef.current);
      
      const isInitial = prevStep === activeStep;
      if (!isInitial) {
        const startAngle = activeStep > prevStep ? '45deg' : '225deg';
        gsap.fromTo(slidingBgRef.current, 
          { '--gradient-angle': startAngle },
          {
            '--gradient-angle': '135deg',
            duration: 0.45,
            ease: 'power3.inOut'
          }
        );

        Flip.from(state, {
          duration: 0.45,
          ease: 'power3.inOut',
        });
      } else {
        gsap.set(slidingBgRef.current, { display: 'block', clearProps: 'transform' });
        gsap.set(slidingBgRef.current, { '--gradient-angle': '135deg' });
      }
    } else if (slidingBgRef.current.style.display === 'none') {
      gsap.set(slidingBgRef.current, { display: 'block' });
    }

    // 2. Animate right card height dynamically if changed
    if (rightCardRef.current) {
      const newHeight = rightCardRef.current.offsetHeight;
      if (prevHeightRef.current > 0 && prevHeightRef.current !== newHeight) {
        gsap.set(rightCardRef.current, { overflow: 'hidden' });
        gsap.fromTo(rightCardRef.current,
          { height: prevHeightRef.current },
          {
            height: newHeight,
            duration: 0.5,
            ease: 'power3.inOut',
            clearProps: 'height,overflow',
          }
        );
      }
      prevHeightRef.current = newHeight;
    }

    // 3. Text/Content change transitions (stagger fade slide)
    const isInitial = prevStep === activeStep;

    if (isInitial) {
      // Set initial state without animation
      const activeContent = containerRef.current.querySelector(`[data-step-index="${activeStep}"]`);
      const activeVisual = containerRef.current.querySelector(`[data-visual-index="${activeStep}"]`);
      if (activeContent) {
        gsap.set(activeContent.querySelectorAll('[data-tabs-fade]'), { y: '0em', autoAlpha: 1 });
      }
      if (activeVisual) {
        gsap.set(activeVisual, { autoAlpha: 1, xPercent: 0 });
      }
      return;
    }

    isAnimatingRef.current = true;

    const outgoingContent = containerRef.current.querySelector(`[data-step-index="${prevStep}"]`);
    const incomingContent = containerRef.current.querySelector(`[data-step-index="${activeStep}"]`);
    const outgoingVisual = containerRef.current.querySelector(`[data-visual-index="${prevStep}"]`);
    const incomingVisual = containerRef.current.querySelector(`[data-visual-index="${activeStep}"]`);

    const outgoingLines = outgoingContent?.querySelectorAll('[data-tabs-fade]') || [];
    const incomingLines = incomingContent?.querySelectorAll('[data-tabs-fade]') || [];

    if (incomingContent) {
      gsap.set(incomingContent, { display: 'flex' });
    }
    if (incomingVisual) {
      gsap.set(incomingVisual, { display: 'flex' });
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        if (outgoingContent) {
          gsap.set(outgoingContent, { display: 'none' });
        }
        if (outgoingVisual) {
          gsap.set(outgoingVisual, { display: 'none' });
        }
        isAnimatingRef.current = false;
        setPrevStep(activeStep);
      }
    });

    timeline
      .to(outgoingLines, { y: "-1.5em", autoAlpha: 0, duration: 0.4, ease: 'power3.in' }, 0)
      .to(outgoingVisual, { autoAlpha: 0, xPercent: 3, duration: 0.4, ease: 'power3.in' }, 0)
      .fromTo(incomingLines,
        { y: "1.5em", autoAlpha: 0 },
        { y: "0em", autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06 },
        0.25
      )
      .fromTo(incomingVisual,
        { autoAlpha: 0, xPercent: 3 },
        { autoAlpha: 1, xPercent: 0, duration: 0.5, ease: 'power3.out' },
        "<"
      );
 
  }, { dependencies: [activeStep], scope: containerRef });

  return (
    <div ref={containerRef} className="w-full">
      
      {/* Level Header Tabs Row with Flip Slide Background */}
      <div 
        ref={tabsRowRef}
        data-flip-button="wrap"
        className="grid grid-cols-2 md:grid-cols-4 rounded-t-[var(--brand-radius-lg)] mb-6 relative"
        style={{ background: 'var(--brand-gradient-gray)'}}
      >
        {/* Single sliding background element */}
        <div
          ref={slidingBgRef}
          data-flip-button="bg"
          className="absolute inset-0 shadow-[var(--shadow-tab-active-glow)] z-0 pointer-events-none"
          style={{ display: 'none', background: 'var(--brand-gradient-active-tab)' }}
        />

        {steps.map((step, index) => {
          const isActive = index === activeStep;
          return (
            <div
              key={index}
              tabIndex={0}
              data-flip-button="button"
              data-active={isActive ? "true" : "false"}
              onClick={() => handleStepClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStepClick(index);
                }
              }}
              className="flex flex-col items-start p-4 text-left transition-all relative z-10 select-none cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2 mb-2 relative z-10 flex-wrap">
                <span className={`font-mono text-[var(--font-size-xxs)] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                  index === 0 
                    ? 'bg-black text-[var(--brand-success-color)] border border-[var(--brand-success-border)]' 
                    : 'bg-[var(--brand-input)] text-[var(--brand-text-secondary)] border border-[var(--brand-border)]'
                }`}>
                  {index === 0 ? "Level 01" : `Level 0${index + 1}`}
                </span>
                {index === 0 && (
                  <span className="stepper-status-badge completed">
                    Completed
                  </span>
                )}
                {index === 1 && (
                  <span className="stepper-status-badge next">
                    Next
                  </span>
                )}
              </div>
              <h3 className={`font-display text-[var(--font-size-sm)] font-semibold leading-tight relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-[var(--brand-text-secondary)]'}`}>
                {step.title.split(" & ")[0]}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Main Split Content Panel View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-8">
        
        {/* Left Column: Level Text Scope Descriptions */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Nav buttons for quick desktop switching */}
          <div className="flex gap-2 mb-5 pb-4">
            <button
              disabled={activeStep === 0}
              onClick={() => handleStepClick(activeStep - 1)} 
              data-animation="bClick"
              className="group p-[2px] w-10 h-10 rounded-[var(--brand-radius-sm)] border border-[var(--brand-border)] disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer focus:outline-none flex items-center justify-center bg-[var(--brand-bg)]"
              aria-label="Previous Layer"
            >
              <span 
                className="w-full h-full  group-hover:bg-[rgba(255,255,255,0.04)] group-hover:border-slate-700 transition-all flex items-center justify-center text-[var(--brand-text-secondary)] group-hover:text-white group-hover:shadow-[0_0_12px_rgba(102,154,225,0.08)]"
                style={{ 
                  backgroundImage: 'radial-gradient(at 95% 89%, rgba(102, 154, 225, 0.06) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 255, 255, 0.01) 0px, transparent 50%)'
                }}
              >
                <svg 
                  className="w-5 h-5 fill-current" 
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Apex Block */}
                  <rect
                    x="12"
                    y="42"
                    width="16"
                    height="16"
                    className="transition-all duration-300 ease-out group-hover:-translate-x-1"
                  />
                  {/* Top Wing Block */}
                  <rect
                    x="32"
                    y="22"
                    width="16"
                    height="16"
                    className="transition-all duration-300 ease-out group-hover:translate-x-0.5"
                  />
                  {/* Bottom Wing Block */}
                  <rect
                    x="32"
                    y="62"
                    width="16"
                    height="16"
                    className="transition-all duration-300 ease-out group-hover:translate-x-0.5"
                  />
                </svg>
              </span>
            </button>
            <button
              disabled={activeStep === steps.length - 1}
              onClick={() => handleStepClick(activeStep + 1)}
              data-animation="bClick"
              className="group p-[2px] w-10 h-10 rounded-[var(--brand-radius-sm)] border border-[var(--brand-border)] disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer focus:outline-none flex items-center justify-center bg-[var(--brand-bg)]"
              aria-label="Next Layer"
            >
              <span 
                className="w-full h-full  group-hover:bg-[rgba(255,255,255,0.04)] group-hover:border-slate-700 transition-all flex items-center justify-center text-[var(--brand-text-secondary)] group-hover:text-white group-hover:shadow-[0_0_12px_rgba(102,154,225,0.08)]"
                style={{ 
                  backgroundImage: 'radial-gradient(at 95% 89%, rgba(102, 154, 225, 0.06) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 255, 255, 0.01) 0px, transparent 50%)'
                }}
              >
                <svg 
                  className="w-5 h-5 fill-current" 
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Apex Block */}
                  <rect
                    x="72"
                    y="42"
                    width="16"
                    height="16"
                    className="transition-all duration-300 ease-out group-hover:translate-x-1"
                  />
                  {/* Top Wing Block */}
                  <rect
                    x="52"
                    y="22"
                    width="16"
                    height="16"
                    className="transition-all duration-300 ease-out group-hover:-translate-x-0.5"
                  />
                  {/* Bottom Wing Block */}
                  <rect
                    x="52"
                    y="62"
                    width="16"
                    height="16"
                    className="transition-all duration-300 ease-out group-hover:-translate-x-0.5"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Stepper Content Items Container */}
          <div className="relative min-h-[180px] lg:min-h-[220px]">
            {steps.map((step, index) => {
              const isCurrent = index === activeStep;
              const isPrev = index === prevStep;
              const isVisible = isCurrent || isPrev;

              return (
                <div
                  key={index}
                  data-step-index={index}
                  className={`flex flex-col ${
                    isCurrent ? 'relative z-10' : 'absolute inset-x-0 top-0 z-0'
                  }`}
                  style={{
                    display: isVisible ? 'flex' : 'none',
                  }}
                >
                  <div data-tabs-fade className="stepper-content-badge mb-3">
                    {step.badgeIcon && (
                      <Image 
                        src={step.badgeIcon} 
                        alt="" 
                        width={18}
                        height={18}
                        className="object-contain" 
                      />
                    )}
                    <span>{step.badge}</span>
                  </div>
                  <h4 data-tabs-fade className="font-display text-[var(--font-size-xl)] font-bold text-white mb-3">
                    {step.title}
                  </h4>
                  <p data-tabs-fade className="brand-paragraph">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recreated Capability Feature Set Box */}
        <div ref={rightCardRef} className="lg:col-span-7 bg-[var(--brand-input)] border border-[var(--brand-border)] rounded-[var(--brand-radius-md)] p-5 relative overflow-hidden min-h-[260px]">
          {steps.map((step, index) => {
            const isCurrent = index === activeStep;
            const isPrev = index === prevStep;
            const isVisible = isCurrent || isPrev;

            return (
              <div
                key={index}
                data-visual-index={index}
                className={`flex flex-col justify-between h-full w-full ${
                  isCurrent ? 'relative z-10' : 'absolute inset-0 p-5 z-0'
                }`}
                style={{
                  display: isVisible ? 'flex' : 'none',
                }}
              >
                <div>
                  {/* Capability Heading Header */}
                  <div data-tabs-fade className="flex items-center gap-2 mb-4 border-b border-[var(--brand-border)] pb-3">
                    <span className="relative flex h-4.5 w-4.5 shrink-0 items-center justify-center">
                      <span 
                        className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-pulse"
                        style={{ 
                          backgroundColor: index === 0 
                            ? 'var(--brand-success-color)' 
                            : index === 1 
                              ? 'var(--brand-primary)' 
                              : 'var(--brand-moon)',
                          filter: 'blur(5px)'
                        }} 
                      />
                      <span 
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ 
                          backgroundColor: index === 0 
                            ? 'var(--brand-success-color)' 
                            : index === 1 
                              ? 'var(--brand-primary)' 
                              : 'var(--brand-moon)'
                        }} 
                      />
                    </span>
                    <h5 className="font-display text-[var(--font-size-xs)] font-bold uppercase tracking-wider text-[var(--brand-text-secondary)]">
                      {step.featuresTitle}
                    </h5>
                  </div>

                  {/* Matrix Columns Meta Header */}
                  <div data-tabs-fade className="flex justify-between text-[var(--font-size-xxs)] font-mono text-[var(--brand-text-muted)] uppercase tracking-wider font-bold mb-2 px-1">
                    <span>System Feature Name</span>
                    <span>Engineering Status</span>
                  </div>

                  {/* Feature Records Stack */}
                  <div className="space-y-3">
                    {step.features.map((feature, fIndex) => (
                      <div key={fIndex} data-tabs-fade className="flex justify-between items-center py-2 px-3 bg-[var(--brand-surface)]/40 border border-[var(--brand-border)] rounded-[var(--brand-radius-sm)]">
                        <span className="text-[var(--font-size-xs)] text-[var(--brand-text-secondary)] font-medium flex items-center gap-2">
                          {feature.icon && (
                            <span className="flex items-center justify-center w-6 h-6 shrink-0">
                              <Image 
                                src={feature.icon} 
                                alt="" 
                                width={feature.icon.includes('Gemini') ? 24 : 20}
                                height={feature.icon.includes('Gemini') ? 24 : 20}
                                className="object-contain" 
                              />
                            </span>
                          )}
                          <span>{feature.name}</span>
                        </span>
                        <span className={`text-[var(--font-size-xs)] font-mono font-semibold flex items-center gap-1.5 ${feature.statusColorClass}`}>
                          {feature.isLiveStatus && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-success)] inline-block animate-pulse" />
                          )}
                          {feature.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
