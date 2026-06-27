"use client";

import React from 'react';
import { ButtonRegular } from "@/components/ButtonRegular";
import { useWorkspaceModal } from "@/components/providers/WorkspaceModalProvider";
import { usePrivy } from '@privy-io/react-auth';

export default function BottomCallToAction() {
  const { openWorkspace } = useWorkspaceModal();
  const { login, authenticated: isConnected } = usePrivy();

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-5 md:py-12 text-center relative z-10">
      
      {/* Background radial accent glow for structural separation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[var(--brand-primary-glow)] opacity-20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        
        {/* 🚀 Human-First Focused Headline */}
        <h3 className="brand-h3 mb-4">
          Ready to see if your business qualifies?
        </h3>

        {/* 🎯 Clear, Relatable Human Copy Block */}
        <p className="brand-paragraph mb-8 mx-auto">
          Connect your wallet to get started. Let our Gemini AI engine analyze your business readiness, 
          check your literacy, and build a safe, milestone-driven roadmap to secure your funding.
        </p>

        {/* Action Button Layout */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-sm mx-auto">
          
          {/* Primary Action Button (Typo Fixed) */}
          {!isConnected ? (
            <ButtonRegular 
              onClick={login} 
              variant="accent"
              className="w-full sm:w-auto text-center font-medium cursor-pointer"
            >
              Connect Wallet
            </ButtonRegular>
          ) : (
            <ButtonRegular 
              onClick={openWorkspace} 
              variant="accent"
              className="w-full sm:w-auto text-center font-medium cursor-pointer"
            >
              Launch Business Evaluation
            </ButtonRegular>
          )}

        </div>

      </div>
    </section>
  );
}