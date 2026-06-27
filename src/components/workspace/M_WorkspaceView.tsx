"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePrivy } from "@privy-io/react-auth";
import { ButtonRegular } from "@/components/ButtonRegular";
import { AiProcessingDetails } from "@/components/ai/ai-processing-details";
import { AiChatbox } from "@/components/ai/ai-chatbox";
import { Modal, ModalContent } from "@/components/Modal";
import WorkspaceVerification from "./C_WorkspaceVerification";
import RevealIcon from "@/components/RevealIcon";
import { AiIcon } from "@/components/ai/ai-icon";
import {
  ModernMenu,
  ModernMenuTrigger,
  ModernMenuContent,
  ModernMenuItem
} from "@/components/ModernMenu";

// New modular Level 2 sub-components
import StoryAssessment from "./C_StoryAssessment";
import ExperienceProfile from "./C_ExperienceProfile";
import ValidationMetrics from "./C_ValidationMetrics";
import EcoGuidelines from "./C_EcoGuidelines";
import RegistrationStatus from "./C_RegistrationStatus";
import VibeGuideModal from "./C_VibeGuideModal";
import NarrativePolishModal from "./C_NarrativePolishModal";
import Loader from "@/components/Loader";

interface VectorSection {
  extractedText: string;
  sufficient: boolean;
  grade?: "High" | "Medium" | "Low";
  feedback?: string;
  score?: number;
  resourceEfficiency?: number;
  circularityUpcycling?: number;
  ecosystemHarmony?: number;
}

interface IndustryExperience {
  inferredYearsOfExperience: number;
  inferredMasteryTier: "Apprentice" | "Professional" | "Master" | "Unknown";
  missingExperienceDetail: boolean;
  yearsOfExperience?: number;
  masteryTier?: "Apprentice" | "Professional" | "Master" | "Unknown";
}

interface EvaluationResult {
  overallSummary: string;
  tagline?: string;
  cardSuggestions?: {
    experienceProfile: string;
    validationMetrics: string;
    ecoGuidelines: string;
    registrationStatus: string;
  };
  qualificationStatus: string;
  industryExperience: IndustryExperience;
  overallQualified: boolean;
  keyConcepts?: string[];
  analysis: {
    operationalStrategy: VectorSection;
    sustainabilityProcess: VectorSection;
    worldBetterment: VectorSection;
    expertiseOrigin: VectorSection;
  };
}

interface WorkspaceViewProps {
  onClose?: () => void;
}

export interface AiPromptItem {
  label: string;
  value: string;
}

const availablePrompts: AiPromptItem[] = [
  {
    label: "Artisan Textile Studio",
    value: "We are an artisan textile studio weaving custom linens by hand using traditional wooden looms. We gather all our organic flax from local fields and use plant-based dyes to care for the environment. Our workshop provides fair-wage livelihoods and hosts free weekly craft classes to share our 12 years of weaving mastery with neighborhood youth."
  },
  {
    label: "Zero-Waste Wooden Workshop",
    value: "We handcraft custom wooden furniture using local, salvaged timber to give fallen trees a second life. Our workshop welcomes local apprentices to keep the heritage craft of hand carpentry alive. Guided by over 15 years of building experience, we make sure every leftover scrap is upcycled or returned to the earth as compost."
  },
  {
    label: "Regenerative Organic Farm",
    value: "We nurture organic heirloom vegetables using regenerative farming to heal and restore local soil health. We turn all our farm waste back into rich compost, share our fresh harvests with regional food banks, and support our neighborhood with local livelihoods. Our team brings over a decade of caring for the land."
  },
  {
    label: "Community Heritage Bakery",
    value: "We bake organic sourdough breads using heritage grains grown nearby to support our regional farming families. We compost our kitchen scraps, bake using clean solar power, and host welcoming workshops for neighborhood youth. Our head baker brings 12 years of gentle, artisanal culinary expertise to the community."
  }
];

export default function WorkspaceView({ onClose }: WorkspaceViewProps) {
  const { login, authenticated: isConnected, user } = usePrivy();
  const address = user?.wallet?.address;

  const [rawNarrative, setRawNarrative] = useState("");
  const [lastEvaluatedText, setLastEvaluatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [evalStartTime, setEvalStartTime] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showPromptsDropdown, setShowPromptsDropdown] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [lvl1Tokens, setLvl1Tokens] = useState({
    input: 0,
    output: 0,
    total: 0,
    cost: 0,
  });

  // Pre-flight polish interceptor states
  const [isPolishModalOpen, setIsPolishModalOpen] = useState(false);
  const [polishedText, setPolishedText] = useState("");
  const [polishRationale, setPolishRationale] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishStartTime, setPolishStartTime] = useState(0);

  const remainingChats = Math.max(0, 10 - chatCount);
  const isOutOfChats = chatCount >= 10;

  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [masteryTier, setMasteryTier] = useState<"Apprentice" | "Professional" | "Master" | "Unknown">("Unknown");

  const [checkedPillars, setCheckedPillars] = useState({
    creation: false,
    sourcing: false,
    sustainability: false,
    community: false,
  });

  const [isEvaluatorOpen, setIsEvaluatorOpen] = useState(false);
  const [showVibeGuide, setShowVibeGuide] = useState(false);

  const isUnlocked = !!result || Object.values(checkedPillars).every(Boolean);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (result && result.industryExperience) {
        setYearsOfExperience(result.industryExperience.yearsOfExperience ?? result.industryExperience.inferredYearsOfExperience ?? 0);
        setMasteryTier(result.industryExperience.masteryTier ?? result.industryExperience.inferredMasteryTier ?? "Unknown");
      } else {
        setYearsOfExperience(0);
        setMasteryTier("Unknown");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [result]);

  // Wire up onClose telemetry to avoid unused variable warning
  useEffect(() => {
    if (onClose) {
      console.log("[WORKSPACE] Close handler is active.");
    }
  }, [onClose]);

  // Look up existing database profile when the wallet is connected
  useEffect(() => {
    let active = true;
    if (isConnected && address) {
      console.log("[WORKSPACE_WALLET_LOG] Connection updated - isConnected:", isConnected, "address:", address);
      Promise.resolve().then(() => {
        if (active) setIsInitialLoading(true);
      });
      console.log(`[WORKSPACE_VIEW] Requesting profile sync: /api/get-profile?address=${address.toLowerCase()}`);
      fetch(`/api/get-profile?address=${address.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("[WORKSPACE_VIEW] Profile sync response payload received:", data);
          if (!active) return;
          if (data.exists && data.profile) {
            setResult(data.profile.geminiEvaluation || null);
            setRawNarrative(data.profile.narrative || "");
            setLastEvaluatedText((data.profile.narrative || "").trim());
            setChatCount(data.profile.chatCount || data.profile.geminiEvaluation?.chatCount || 0);
            setCompleteSuccess(true);
            setLvl1Tokens({
              input: data.profile.lvl1InputTokens || 0,
              output: data.profile.lvl1OutputTokens || 0,
              total: data.profile.lvl1TotalTokens || 0,
              cost: data.profile.lvl1CostUsd || 0,
            });
            console.log("[WORKSPACE_VIEW] Synchronized profile state. chatCount:", data.profile.chatCount || data.profile.geminiEvaluation?.chatCount || 0, "resultExists:", !!data.profile.geminiEvaluation);
          } else {
            console.log("[WORKSPACE_VIEW] Sync indicated no existing database profile. Resetting state.");
            // Reset states for new connection
            setResult(null);
            setEvalStartTime(0);
            setRawNarrative("");
            setLastEvaluatedText("");
            setChatCount(0);
            setCompleteSuccess(false);
            setLvl1Tokens({
              input: 0,
              output: 0,
              total: 0,
              cost: 0,
            });
          }
        })
        .catch((err) => console.error("[WORKSPACE_VIEW] Error checking founder profile status:", err))
        .finally(() => {
          if (active) {
            setIsInitialLoading(false);
          }
        });
    } else {
      console.log("[WORKSPACE_VIEW] Sync skipped: Wallet connection inactive or address undefined.");
      Promise.resolve().then(() => {
        if (active) setIsInitialLoading(false);
      });
    }
    return () => { active = false; };
  }, [isConnected, address]);

  const handleEvaluateChat = async (textToEvaluate?: string) => {
    const text = textToEvaluate !== undefined ? textToEvaluate : rawNarrative;
    if (!text.trim()) {
      toast.error("Please enter your project's story first.");
      return;
    }

    // Check if the narrative matches one of the example templates exactly (meaning they didn't change it)
    const isExample = availablePrompts.some(p => p.value.trim() === text.trim());
    if (isExample) {
      toast.warning("Please customize the example narrative with your own project details before submitting.");
      return;
    }

    if (isOutOfChats) {
      toast.error("You have reached your limit of 10 narrative evaluations.");
      return;
    }

    setLoading(true);
    setResult(null);
    setEvalStartTime(Date.now());
    
    try {
      const response = await fetch("/api/workspace-ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rawNarrative: text, 
          storyText: text,
          address: address
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Workspace narrative assessment service failed (HTTP ${response.status})`);
      }
      
      if (data.chatCount !== undefined) {
        setChatCount(data.chatCount);
      }

      if (data.lvl1InputTokens !== undefined) {
        setLvl1Tokens({
          input: data.lvl1InputTokens,
          output: data.lvl1OutputTokens || 0,
          total: data.lvl1TotalTokens || 0,
          cost: data.lvl1CostUsd || 0,
        });
      }

      setResult(data.result || data);
      setLastEvaluatedText(text.trim());
    } catch (error) {
      console.error("Narrative review failed:", error);
      const errMsg = error instanceof Error ? error.message : "Narrative review failed. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePreFlightSubmit = async () => {
    if (!rawNarrative.trim()) {
      toast.error("Please enter your project's story first.");
      return;
    }

    const isExample = availablePrompts.some(p => p.value.trim() === rawNarrative.trim());
    if (isExample) {
      toast.warning("Please customize the example narrative with your own project details before submitting.");
      return;
    }

    if (isOutOfChats) {
      toast.error("You have reached your limit of 10 narrative evaluations.");
      return;
    }

    // Reset and open modal immediately
    setPolishedText("");
    setPolishRationale("");
    setPolishStartTime(Date.now());
    setIsPolishing(true);
    setIsPolishModalOpen(true);

    try {
      const response = await fetch("/api/workspace-ai-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawNarrative, address }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Workspace narrative polish service failed.");
      }

      setPolishedText(data.polishedText || "");
      setPolishRationale(data.rationale || "");

      if (data.lvl1InputTokens !== undefined) {
        setLvl1Tokens({
          input: data.lvl1InputTokens,
          output: data.lvl1OutputTokens || 0,
          total: data.lvl1TotalTokens || 0,
          cost: data.lvl1CostUsd || 0,
        });
      }
    } catch (error) {
      console.error("Narrative polish failed:", error);
      toast.error("AI pre-flight optimization failed. Continuing with original draft.");
      setIsPolishModalOpen(false);
      await handleEvaluateChat(rawNarrative);
    } finally {
      setIsPolishing(false);
    }
  };

  const allVectorsSufficient = result
    ? result.analysis.operationalStrategy.sufficient &&
      result.analysis.sustainabilityProcess.sufficient &&
      result.analysis.worldBetterment.sufficient &&
      result.analysis.expertiseOrigin.sufficient &&
      !result.industryExperience.missingExperienceDetail &&
      masteryTier !== "Unknown"
    : false;

  const trustScore = result
    ? Math.round(
        ((result.analysis.operationalStrategy.score || 0) * 5) +
        ((result.analysis.sustainabilityProcess.score || 0) * 5) +
        ((result.analysis.worldBetterment.score || 0) * 5) +
        ((result.analysis.expertiseOrigin.score || 0) * 5)
      )
    : 0;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || !address) return;
    
    try {
      const response = await fetch("/api/register-founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address.toLowerCase(),
          narrative: rawNarrative,
          geminiEvaluation: result,
          isQualified: allVectorsSufficient,
          totalGrade: trustScore,
          experienceProfile: {
            yearsOfPractice: yearsOfExperience,
            masteryLevel: masteryTier
          }
        }),
      });
      
      if (!response.ok) throw new Error("Backend save endpoint rejected registration.");
      
      setCompleteSuccess(true);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="workspace-connect-view">
        <div className="workspace-connect-card">
          <h3 className="brand-h3">Connect Wallet to Access Workspace</h3>
          <p className="brand-paragraph text-center">
            Connect your wallet to enter your personalized workspace. This securely sets up your developer profile.
          </p>
          <div className="flex justify-center pt-2">
            <ButtonRegular
              onClick={login}
              variant="accent"
              className="uppercase tracking-wider w-64 h-12"
            >
              Connect Wallet
            </ButtonRegular>
          </div>
        </div>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="workspace-container flex flex-col items-center justify-center min-h-[350px] relative p-12">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="modal-close-block-btn z-50 absolute top-4 right-4"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 overflow-visible"
            >
              <rect
                className="rect-close__block rect-close__block--center"
                x="42"
                y="42"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--top-left"
                x="22"
                y="22"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--top-right"
                x="62"
                y="22"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--bottom-left"
                x="22"
                y="62"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--bottom-right"
                x="62"
                y="62"
                width="22"
                height="22"
              />
            </svg>
          </button>
        )}
        <Loader text="Syncing Workspace Profile..." />
      </div>
    );
  }

  return (
    <div className="workspace-container">
      {/* Sticky Header */}
      <div className="workspace-header relative pr-12 md:pr-14">
        <div className="workspace-header-content !flex-row !items-center !justify-between gap-4">
          <h3 className="workspace-header-title">
            Level 1: Tell Us Your Story
          </h3>
          <div className="workspace-header-actions !w-auto !justify-start flex items-center gap-3">
            <ButtonRegular
              onClick={() => setShowVibeGuide(true)}
              className="workspace-header-score-btn"
            >
              <div className="flex items-center justify-center relative w-full h-full">
                {/* Blurred color dots as background covering the entire button */}
                <div className="absolute -inset-x-6 -inset-y-4 flex items-center justify-between px-2 opacity-95 pointer-events-none filter blur-[5px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse [animation-delay:150ms]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse [animation-delay:300ms]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse [animation-delay:450ms]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:600ms]" />
                </div>
                <span className="workspace-header-score-btn-text"> Score</span>
              </div>
            </ButtonRegular>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="modal-close-block-btn"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 overflow-visible"
            >
              <rect
                className="rect-close__block rect-close__block--center"
                x="42"
                y="42"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--top-left"
                x="22"
                y="22"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--top-right"
                x="62"
                y="22"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--bottom-left"
                x="22"
                y="62"
                width="22"
                height="22"
              />
              <rect
                className="rect-close__block rect-close__block--bottom-right"
                x="62"
                y="62"
                width="22"
                height="22"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Scrollable Body */}
      <div className="workspace-body custom-scrollbar">
        <div className="workspace-body-wrapper">
          <div className="text-left">
            <div className="workspace-reveal-card" data-open={isEvaluatorOpen}>
              <button
                type="button"
                className="workspace-reveal-trigger"
                onClick={() => setIsEvaluatorOpen(!isEvaluatorOpen)}
              >
                <div className="workspace-reveal-trigger-content">
                  <AiIcon className="workspace-reveal-icon-left" />
                  <h4 className="workspace-reveal-title">
                    Onboarding Checklist & Evaluation Engine
                  </h4>
                </div>
                <RevealIcon isOpen={isEvaluatorOpen} className="workspace-reveal-icon-arrow" />
              </button>
              
              <div className="workspace-reveal-content" onClick={(e) => e.stopPropagation()}>
                <div className="workspace-guidelines-checklist mb-6">
                  <h4 className="workspace-checklist-title">
                    ✦ Checklist: Core Project Features
                  </h4>
                  <p className="brand-paragraph text-slate-300 mb-3">
                    To unlock the AI Evaluation Engine, confirm that your story will cover these four essential aspects of your regional project:
                  </p>
                  
                  <div className="flex flex-col">
                    {/* Item 1 */}
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="pillar-creation"
                        className="task-checkbox"
                        checked={checkedPillars.creation}
                        onChange={(e) => setCheckedPillars(prev => ({ ...prev, creation: e.target.checked }))}
                      />
                      <label htmlFor="pillar-creation" className="checkbox-label">
                        <div className="checkbox-box">
                          <div className="checkbox-fill"></div>
                          <div className="checkmark">
                            <svg viewBox="0 0 24 24" className="check-icon">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                            </svg>
                          </div>
                          <div className="success-ripple"></div>
                        </div>
                        <span className="checkbox-text workspace-checklist-text">
                          <strong>Core Creation:</strong> I will describe my real-world craft, farm, or production project.
                        </span>
                      </label>
                    </div>

                    {/* Item 2 */}
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="pillar-sourcing"
                        className="task-checkbox"
                        checked={checkedPillars.sourcing}
                        onChange={(e) => setCheckedPillars(prev => ({ ...prev, sourcing: e.target.checked }))}
                      />
                      <label htmlFor="pillar-sourcing" className="checkbox-label">
                        <div className="checkbox-box">
                          <div className="checkbox-fill"></div>
                          <div className="checkmark">
                            <svg viewBox="0 0 24 24" className="check-icon">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                            </svg>
                          </div>
                          <div className="success-ripple"></div>
                        </div>
                        <span className="checkbox-text workspace-checklist-text">
                          <strong>Sourcing Integrity:</strong> I will specify the raw materials, tools, or ingredients I use.
                        </span>
                      </label>
                    </div>

                    {/* Item 3 */}
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="pillar-sustainability"
                        className="task-checkbox"
                        checked={checkedPillars.sustainability}
                        onChange={(e) => setCheckedPillars(prev => ({ ...prev, sustainability: e.target.checked }))}
                      />
                      <label htmlFor="pillar-sustainability" className="checkbox-label">
                        <div className="checkbox-box">
                          <div className="checkbox-fill"></div>
                          <div className="checkmark">
                            <svg viewBox="0 0 24 24" className="check-icon">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                            </svg>
                          </div>
                          <div className="success-ripple"></div>
                        </div>
                        <span className="checkbox-text workspace-checklist-text">
                          <strong>Process Sustainability:</strong> I will explain how I handle materials and resource footprints responsibly.
                        </span>
                      </label>
                    </div>

                    {/* Item 4 */}
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="pillar-community"
                        className="task-checkbox"
                        checked={checkedPillars.community}
                        onChange={(e) => setCheckedPillars(prev => ({ ...prev, community: e.target.checked }))}
                      />
                      <label htmlFor="pillar-community" className="checkbox-label">
                        <div className="checkbox-box">
                          <div className="checkbox-fill"></div>
                          <div className="checkmark">
                            <svg viewBox="0 0 24 24" className="check-icon">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                            </svg>
                          </div>
                          <div className="success-ripple"></div>
                        </div>
                        <span className="checkbox-text workspace-checklist-text">
                          <strong>Community Betterment:</strong> I will detail how my business actively supports our regional community.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>



                <AiChatbox
                  value={rawNarrative}
                  onChange={setRawNarrative}
                  onSubmit={handlePreFlightSubmit}
                  placeholder={
                    isOutOfChats 
                      ? "🔒 You have used all 10 of your narrative evaluations." 
                      : isUnlocked 
                        ? "Describe your real-world project..." 
                        : "🔒 Check all four guidelines above to unlock the AI narrative evaluator..."
                  }
                  availablePrompts={[]}
                  quickTags={[]}
                  className="w-full mb-5"
                  disabled={!isUnlocked || isOutOfChats}
                  submitDisabled={isOutOfChats || (!!lastEvaluatedText && rawNarrative.trim() === lastEvaluatedText)}
                  remainingChats={remainingChats}
                  maxLength={1000}
                >
                  <div className="workspace-prompts-wrapper" data-bclick-skip="true">
                    <ModernMenu open={showPromptsDropdown && isUnlocked} onOpenChange={(open) => isUnlocked && setShowPromptsDropdown(open)} layout="col-flow">
                      <ModernMenuTrigger
                        disabled={!isUnlocked}
                        showSideLight={isUnlocked}
                        sideLightColor="#6d8394"
                        className="workspace-prompts-trigger"
                      >
                        <div className="workspace-prompts-trigger-inner">
                          <span className="workspace-prompts-trigger-text">Example</span>
                          <RevealIcon isOpen={showPromptsDropdown && isUnlocked} className="workspace-reveal-icon-arrow" />
                        </div>
                      </ModernMenuTrigger>

                      <ModernMenuContent className="workspace-prompt-menu-content">
                        {availablePrompts.map((prompt: AiPromptItem, idx: number) => {
                          return (
                            <ModernMenuItem
                              key={`sample-${idx}`}
                              index={idx}
                              className="workspace-prompt-item"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setRawNarrative(prompt.value);
                                  setShowPromptsDropdown(false);
                                }}
                                className="workspace-prompt-btn-layout"
                              >
                                <span className="workspace-prompt-label">{prompt.label}</span>
                                <span className="workspace-prompt-value">{prompt.value}</span>
                              </button>
                            </ModernMenuItem>
                          );
                        })}
                      </ModernMenuContent>
                    </ModernMenu>
                  </div>
                </AiChatbox>

                {/* Level 1 Token Telemetry read-out */}
                {lvl1Tokens.total > 0 && (
                  <div className="mt-4 p-3 bg-zinc-950/40 border border-zinc-800/80 rounded-lg flex flex-wrap gap-x-6 gap-y-2 items-center justify-between text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="uppercase text-slate-300 font-bold">Level 1 AI Metrics:</span>
                    </div>
                    <div className="flex gap-4">
                      <span>INPUT: <strong className="text-emerald-400">{lvl1Tokens.input.toLocaleString()}</strong></span>
                      <span>OUTPUT: <strong className="text-emerald-400">{lvl1Tokens.output.toLocaleString()}</strong></span>
                      <span>TOTAL: <strong className="text-emerald-400">{lvl1Tokens.total.toLocaleString()}</strong></span>
                      <span>USD COST: <strong className="text-emerald-400">${lvl1Tokens.cost.toFixed(4)}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Step-by-Step Processing Timeline */}
          {evalStartTime > 0 && (
            <div className="animate-fade-in mb-6">
              <AiProcessingDetails
                url="funpro.space/api/workspace-ai-review"
                prompt={rawNarrative}
                startTime={evalStartTime}
                isComplete={!loading && !!result}
              />
            </div>
          )}

          {result && !loading && (
            <div className="workspace-body-wrapper animate-fade-in text-left space-y-4">
              
              {/* Aggregated Suggestions */}
              {trustScore < 100 && (
                <div className="workspace-interpretation-card mb-2" style={{ borderColor: 'rgba(102, 154, 225, 0.3)' }}>
                  <h4 className="workspace-suggestions-title">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    Improvement Suggestions
                  </h4>
                  <ul className="workspace-suggestions-list">
                    {(result.analysis.operationalStrategy.score || 0) < 5 && result.analysis.operationalStrategy.feedback && <li><strong>Strategy:</strong> {result.analysis.operationalStrategy.feedback.replace(/\*\*/g, '')}</li>}
                    {(result.analysis.sustainabilityProcess.score || 0) < 5 && result.analysis.sustainabilityProcess.feedback && <li><strong>Sustainability:</strong> {result.analysis.sustainabilityProcess.feedback.replace(/\*\*/g, '')}</li>}
                    {(result.analysis.worldBetterment.score || 0) < 5 && result.analysis.worldBetterment.feedback && <li><strong>Community:</strong> {result.analysis.worldBetterment.feedback.replace(/\*\*/g, '')}</li>}
                    {(result.analysis.expertiseOrigin.score || 0) < 5 && result.analysis.expertiseOrigin.feedback && <li><strong>Mastery:</strong> {result.analysis.expertiseOrigin.feedback.replace(/\*\*/g, '')}</li>}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <StoryAssessment
                  overallSummary={result.overallSummary}
                  qualificationStatus={result.qualificationStatus}
                  keyConcepts={result.keyConcepts}
                />
                
                <ExperienceProfile
                  missingExperienceDetail={!!result.industryExperience?.missingExperienceDetail}
                  yearsOfExperience={yearsOfExperience}
                  setYearsOfExperience={setYearsOfExperience}
                  masteryTier={masteryTier}
                  setMasteryTier={setMasteryTier}
                  customSuggestion={result.cardSuggestions?.experienceProfile}
                />
                
                <ValidationMetrics
                  analysis={result.analysis}
                  customSuggestion={result.cardSuggestions?.validationMetrics}
                />
                
                <EcoGuidelines
                  customSuggestion={result.cardSuggestions?.ecoGuidelines}
                />
                
                <RegistrationStatus
                  allVectorsSufficient={allVectorsSufficient}
                  completeSuccess={completeSuccess}
                  handleSaveProfile={handleSaveProfile}
                  setShowSuccessModal={setShowSuccessModal}
                  customSuggestion={result.cardSuggestions?.registrationStatus}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Success & Notification Settings Modal */}
      <Modal open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <ModalContent
          size="default"
          overlayClassName="level2-modal-overlay"
          className="level2-modal-content"
          showCloseButton={true}
        >
          <div className="p-6 text-center">
            <h4 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wider">
              🎉 Registration Complete
            </h4>
            <div className="workspace-success-message mb-6">
              ✓ Profile Registered. We will notify you when the next level feature sandboxes open!
            </div>
            
            {/* Notification & Verification Settings */}
            <WorkspaceVerification isModal={true} />
          </div>
        </ModalContent>
      </Modal>

      {/* Dynamic Thermal Alignment Telemetry Vibe Guide */}
      <VibeGuideModal isOpen={showVibeGuide} onOpenChange={setShowVibeGuide} />

      {/* AI Input Pre-flight Interceptor & Comparison Modal */}
      <NarrativePolishModal
        isOpen={isPolishModalOpen}
        onOpenChange={setIsPolishModalOpen}
        originalText={rawNarrative}
        polishedText={polishedText}
        rationale={polishRationale}
        isLoading={isPolishing}
        polishStartTime={polishStartTime}
        lvl1Tokens={lvl1Tokens}
        onConfirm={async (editedText) => {
          setIsPolishModalOpen(false);
          setRawNarrative(editedText);
          await handleEvaluateChat(editedText);
        }}
        onKeepOriginal={async () => {
          setIsPolishModalOpen(false);
          await handleEvaluateChat(rawNarrative);
        }}
      />
    </div>
  );
}
