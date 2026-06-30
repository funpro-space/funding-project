"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { AiChatbox } from "@/components/ai/ai-chatbox";
import {
  ModernMenu,
  ModernMenuTrigger,
  ModernMenuContent,
  ModernMenuItem
} from "@/components/ModernMenu";
import { useWorkspaceModal } from "@/components/providers/WorkspaceModalProvider";
import { ButtonRegular } from "@/components/ButtonRegular";

export default function AIChatbox() {
  const { isOpen, openWorkspace } = useWorkspaceModal();
  const { authenticated: isConnected, user } = usePrivy();
  const address = user?.wallet?.address;

  const [rawNarrative, setRawNarrative] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [showPromptsDropdown, setShowPromptsDropdown] = useState(false);
  const [guestUsed, setGuestUsed] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    if (isOpen) return; // Skip fetching when workspace is open/active
    const checkLimit = async () => {
      try {
        const url = address 
          ? `/api/check-guest-limit?address=${encodeURIComponent(address)}` 
          : "/api/check-guest-limit";
        const res = await fetch(url);
        const data = await res.json();
        setGuestUsed(!!data.limited);
        setGuestCount(data.count || 0);
      } catch (err) {
        console.error("[AIChatbox] Failed to check guest rate limit:", err);
      }
    };
    checkLimit();
  }, [address, isOpen]);

  const isUnlocked = true;
  const maxChats = isConnected ? 100 : 3;
  const remainingChats = isConnected ? Math.max(0, 100 - chatCount) : Math.max(0, 3 - guestCount);
  const isOutOfChats = isConnected ? (chatCount >= 100) : (guestUsed || guestCount >= 3);

  // Retrieve user chatCount from profile db if logged in
  useEffect(() => {
    if (isOpen) return; // Skip fetching when workspace is open/active
    if (isConnected && address) {
      fetch(`/api/get-profile?address=${address.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.exists && data.profile) {
            setChatCount(data.profile.chatCount || data.profile.geminiEvaluation?.chatCount || 0);
          } else {
            setChatCount(0);
          }
        })
        .catch((err) => console.error("[AIChatbox] Error checking founder profile status:", err));
    } else {
      Promise.resolve().then(() => {
        setChatCount(0);
      });
    }
  }, [isConnected, address, isOpen]);

  const handlePreFlightSubmit = () => {
    if (!rawNarrative.trim()) {
      toast.error("Please enter your project's story first.");
      return;
    }

    if (isOutOfChats) {
      if (!isConnected) {
        toast.error("Free guest limit reached. Please connect your wallet to get 10 evaluations.");
      } else {
        toast.error("You have reached your limit of 10 narrative evaluations.");
      }
      return;
    }

    console.log("[AIChatbox] Submitting narrative from landing page:", rawNarrative);
    openWorkspace(rawNarrative);
  };

  return (
    <>
      {!isOpen && (
        <section className="py-5 px-4 md:px-8 z-10 relative flex flex-col items-center w-full max-w-7xl mx-auto animate-hero opacity-0">
          {/* Header block describing the interactive underwriting sandbox */}

          <div className="w-full max-w-4xl px-6 pb-6 md:px-8 md:pb-8 rounded-[var(--brand-radius-lg)] relative overflow-visible">
            {/* Embedded Active AiChatbox */}
            <div className="relative z-20 w-full">
              {isOutOfChats && (
                <div className="mb-4 glass-alert glass-alert-error animate-fade-in text-left">
                  <div className="glass-alert-inner">
                    <strong className="glass-alert-title">
                      ⚠️ Evaluation Limit Reached
                    </strong>
                    <span className="glass-alert-text">
                      {isConnected 
                        ? "You have used all 10 of your narrative evaluations. If you need more access, please contact core registry support."
                        : "You have reached your 3-evaluation guest limit. Connect your Coinbase Smart Wallet or another Web3 identity to instantly unlock more evaluations."}
                    </span>
                  </div>
                </div>
              )}

              <AiChatbox
                value={rawNarrative}
                onChange={setRawNarrative}
                onSubmit={handlePreFlightSubmit}
                placeholder={
                  isOutOfChats 
                    ? isConnected
                      ? "🔒 You have used all 10 of your narrative evaluations." 
                      : "🔒 Free guest limit reached. Connect wallet to get 10 evals."
                    : isUnlocked 
                      ? "What project are we building?" 
                      : "🔒 Check all four guidelines above to unlock the AI narrative evaluator..."
                }
                availablePrompts={[]}
                quickTags={[]}
                className="w-full"
                disabled={!isUnlocked || isOutOfChats}
                submitDisabled={isOutOfChats}
                remainingChats={remainingChats}
                maxChats={maxChats}
                maxLength={1000}
              >
                <div className="workspace-prompts-wrapper" data-bclick-skip="true">
                  <ModernMenu open={showPromptsDropdown && isUnlocked} onOpenChange={(open) => isUnlocked && setShowPromptsDropdown(open)} layout="col-flow">
                    <ModernMenuTrigger
                      disabled={!isUnlocked}
                      showSideLight={isUnlocked}
                      sideLightColor="#6d8394"
                      className="workspace-prompts-trigger !h-10 !py-0"
                    >
                      <div className="workspace-prompts-trigger-inner flex items-center justify-between w-full">
                        {/* <span className="workspace-prompts-trigger-text">How to write</span> */}
                        <svg 
                          className={`w-4 h-4 fill-current transition-all duration-300 ${showPromptsDropdown ? 'scale-110 text-white' : 'text-slate-400'}`} 
                          viewBox="0 0 100 100" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Retro info icon: Dot and Stem */}
                          <rect x="42" y="15" width="16" height="16" />
                          <rect x="42" y="42" width="16" height="32" />
                        </svg>
                      </div>
                    </ModernMenuTrigger>

                    <ModernMenuContent className="workspace-prompt-menu-content">
                      <ModernMenuItem
                        index={0}
                        className="workspace-prompt-item !cursor-default w-fit p-4 flex flex-col gap-3"
                        onClick={(e) => {
                          // Prevent closing menu when clicking on the guidelines card
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1 pb-2 border-b border-zinc-800/80">
                          <span className="font-display text-lg text-white uppercase tracking-wider">How to write your narrative</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {/* Item 1 */}
                          <div className="checkbox-container !cursor-default">
                            <input
                              type="checkbox"
                              id="pillar-creation-static"
                              className="task-checkbox"
                              checked={true}
                              readOnly
                            />
                            <label htmlFor="pillar-creation-static" className="checkbox-label !cursor-default !pointer-events-none !px-0 !py-1">
                              <div className="checkbox-box">
                                <div className="checkbox-fill"></div>
                                <div className="checkmark">
                                  <svg viewBox="0 0 24 24" className="check-icon">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                                  </svg>
                                </div>
                                <div className="success-ripple"></div>
                              </div>
                              <span className="checkbox-text workspace-checklist-text text-left text-zinc-300">
                                <strong>Core Creation:</strong> Describe a real-world craft, farm, or production project.
                              </span>
                            </label>
                          </div>

                          {/* Item 2 */}
                          <div className="checkbox-container !cursor-default">
                            <input
                              type="checkbox"
                              id="pillar-sourcing-static"
                              className="task-checkbox"
                              checked={true}
                              readOnly
                            />
                            <label htmlFor="pillar-sourcing-static" className="checkbox-label !cursor-default !pointer-events-none !px-0 !py-1">
                              <div className="checkbox-box">
                                <div className="checkbox-fill"></div>
                                <div className="checkmark">
                                  <svg viewBox="0 0 24 24" className="check-icon">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                                  </svg>
                                </div>
                                <div className="success-ripple"></div>
                              </div>
                              <span className="checkbox-text workspace-checklist-text text-left text-zinc-300">
                                <strong>Sourcing Integrity:</strong> Specify the raw materials, tools, or ingredients used.
                              </span>
                            </label>
                          </div>

                          {/* Item 3 */}
                          <div className="checkbox-container !cursor-default">
                            <input
                              type="checkbox"
                              id="pillar-sustainability-static"
                              className="task-checkbox"
                              checked={true}
                              readOnly
                            />
                            <label htmlFor="pillar-sustainability-static" className="checkbox-label !cursor-default !pointer-events-none !px-0 !py-1">
                              <div className="checkbox-box">
                                <div className="checkbox-fill"></div>
                                <div className="checkmark">
                                  <svg viewBox="0 0 24 24" className="check-icon">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                                  </svg>
                                </div>
                                <div className="success-ripple"></div>
                              </div>
                              <span className="checkbox-text workspace-checklist-text text-left text-zinc-300">
                                <strong>Process Sustainability:</strong> Explain how materials and resource footprints are handled responsibly.
                              </span>
                            </label>
                          </div>

                          {/* Item 4 */}
                          <div className="checkbox-container !cursor-default">
                            <input
                              type="checkbox"
                              id="pillar-community-static"
                              className="task-checkbox"
                              checked={true}
                              readOnly
                            />
                            <label htmlFor="pillar-community-static" className="checkbox-label !cursor-default !pointer-events-none !px-0 !py-1">
                              <div className="checkbox-box">
                                <div className="checkbox-fill"></div>
                                <div className="checkmark">
                                  <svg viewBox="0 0 24 24" className="check-icon">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                                  </svg>
                                </div>
                                <div className="success-ripple"></div>
                              </div>
                              <span className="checkbox-text workspace-checklist-text text-left text-zinc-300">
                                <strong>Community Betterment:</strong> Detail how the business actively supports its regional community.
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* One-click template example button below list info */}
                        <div className="mt-3 pt-3 border-t border-zinc-800/80 flex justify-center">
                          <ButtonRegular
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setRawNarrative(
                                "We nurture organic heirloom vegetables using regenerative farming to heal and restore local soil health. We turn all our farm waste back into rich compost, share our fresh harvests with regional food banks, and support our neighborhood with local livelihoods. Our team brings over a decade of caring for the land."
                              );
                              setShowPromptsDropdown(false);
                              toast.success("Loaded Regenerative Organic Farm example!");
                            }}
                            variant="default"
                            className="text-xs uppercase tracking-wider font-bold px-3 py-1.5"
                          >
                            Organic Farm Example
                          </ButtonRegular>
                        </div>
                      </ModernMenuItem>
                    </ModernMenuContent>
                  </ModernMenu>
                </div>
              </AiChatbox>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
