"use client";

import { useState } from "react";
import RevealIcon from "@/components/RevealIcon";
import { getThermalState } from "@/lib/utils";

interface ExperienceProfileProps {
  missingExperienceDetail: boolean;
  yearsOfExperience: number;
  setYearsOfExperience: (years: number) => void;
  masteryTier: "Apprentice" | "Professional" | "Master" | "Unknown";
  setMasteryTier: (tier: "Apprentice" | "Professional" | "Master" | "Unknown") => void;
  customSuggestion?: string;
}

export default function ExperienceProfile({
  missingExperienceDetail,
  yearsOfExperience,
  setYearsOfExperience,
  masteryTier,
  setMasteryTier,
  customSuggestion
}: ExperienceProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  const experienceProgress = Math.min(100, Math.round((yearsOfExperience / 25) * 100));
  const thermal = getThermalState(experienceProgress);

  return (
    <div className="workspace-reveal-card" data-open={isOpen} style={{ "--thermal-color": thermal.colorHex } as React.CSSProperties}>
      <button
        type="button"
        className="workspace-reveal-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="workspace-reveal-trigger-content w-full">
          <div className="workspace-pillar-content w-full flex-1">
            <div className="flex items-center gap-4 w-full mb-1">
              <h4 className="workspace-pillar-card-title">
                Experience Profile
              </h4>
              <span className="font-mono text-sm text-[var(--brand-primary)] font-bold">{yearsOfExperience === 25 ? "25+" : yearsOfExperience} YRS</span>
              <div className="workspace-pillar-status-container !ml-0">
                {missingExperienceDetail ? (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-[#fbbf24]" title="Supplemental Context Needed">
                    <svg className="w-3.5 h-3.5 text-[#fbbf24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[#a7f3d0]" title="Verified">
                    <svg className="w-3.5 h-3.5 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <p className="workspace-pillar-card-subtitle  text-left">
              Expertise: {yearsOfExperience === 25 ? "25+ years" : `${yearsOfExperience} years`} • {masteryTier}
            </p>
            <p className="workspace-thermal-suggestion">{customSuggestion || thermal.suggestion}</p>
          </div>
        </div>
        <div className="workspace-pillar-arrow-container">
          <RevealIcon isOpen={isOpen} className="workspace-reveal-icon-arrow" />
        </div>
      </button>

      <div className="workspace-reveal-content" onClick={(e) => e.stopPropagation()}>
        <div className="workspace-slider-group">
          {missingExperienceDetail && (
            <div className="workspace-tenure-alert">
              <span className="workspace-bold-text">Supplemental Context Needed:</span> We couldn&apos;t fully isolate your professional timeline or years of experience from your story. Please refine your practice tenure and mastery below:
            </div>
          )}

          {/* Slider for Years of Experience */}
          <div className="workspace-slider-group">
            <div className="workspace-slider-labels">
              <span>Years of Practice:</span>
              <span className="workspace-slider-value">
                {yearsOfExperience === 25 ? "25+ years" : `${yearsOfExperience} years`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(parseInt(e.target.value))}
              className="workspace-range-input"
            />
            <div className="workspace-range-ticks">
              <span>0 yrs</span>
              <span>10 yrs</span>
              <span>20 yrs</span>
              <span>25+ yrs</span>
            </div>
          </div>

          {/* Segmented Radio Mastery level */}
          <div className="workspace-mastery-group">
            <label className="workspace-mastery-label">Select Mastery Level:</label>
            <div className="workspace-mastery-grid">
              {(["Apprentice", "Professional", "Master"] as const).map((tier) => {
                const isActive = masteryTier === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setMasteryTier(tier)}
                    className={`workspace-mastery-btn ${isActive ? "active" : ""}`}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
            <div className="workspace-mastery-desc">
              {masteryTier === "Apprentice" && "• Apprentice: Focused on skill acquisition and development (active under 3 years)."}
              {masteryTier === "Professional" && "• Professional: Fully competent independent practice, runs an active business (3-10 years)."}
              {masteryTier === "Master" && "• Master: Proven expert mastery, heavily involved in training, teaching, or mentoring (10+ years)."}
              {masteryTier === "Unknown" && "• Please select your active mastery level."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
