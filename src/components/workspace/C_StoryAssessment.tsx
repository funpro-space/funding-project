"use client";

import { useState } from "react";
import WorkspaceLevel2Modal from "./WorkspaceLevel2Modal";
import RevealCrossIcon from "@/components/RevealCrossIcon";
import { getThermalState } from "@/lib/utils";

interface StoryAssessmentProps {
  overallSummary: string;
  qualificationStatus: string;
  keyConcepts?: string[];
  tagline?: string;
}

function renderTextWithBolding(text: string) {
  if (!text) return "";
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, idx) => {
        if (idx % 2 === 1) {
          return (
            <strong key={idx} className="workspace-bold-text">
              {part}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

function renderQualificationStatus(text: string) {
  if (!text) {
    return (
      <p className="workspace-modal-text">
        Platform rules are evaluated against your narrative pillars to verify your project validation tier.
      </p>
    );
  }
  
  const lines = text.split("\n");
  
  return (
    <div className="workspace-qualification-container">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="workspace-qualification-bullet">
              <span className="workspace-qualification-bullet-icon">✦</span>
              <span className="workspace-qualification-bullet-text">{renderTextWithBolding(content)}</span>
            </div>
          );
        }
        
        return (
          <p key={idx} className="workspace-qualification-paragraph">
            {renderTextWithBolding(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function StoryAssessment({ overallSummary, qualificationStatus, keyConcepts = [], tagline }: StoryAssessmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const thermal = getThermalState(100);

  return (
    <>
      {/* Level 1: Summary Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="workspace-pillar-summary-card"
        style={{ "--thermal-color": thermal.colorHex } as React.CSSProperties}
      >
        <div className="workspace-reveal-trigger-content w-full">
          <div className="workspace-pillar-content w-full flex-1">
            <div className="flex items-center gap-4 w-full mb-1">
              <h4 className="workspace-pillar-card-title">
                Story Assessment
              </h4>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[#a7f3d0]" title="Analysis Complete">
                <svg className="w-3.5 h-3.5 text-[#34d399] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
            <p className="workspace-pillar-card-subtitle mb-2 text-left">
              {tagline || overallSummary || "Platform interpretation and qualification assessment details."}
            </p>
            {keyConcepts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
                {keyConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-[14px] font-bold font-mono tracking-wider bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] text-[#9ac7ff] uppercase shadow-sm"
                  >
                    ✦ {concept}
                  </span>
                ))}
              </div>
            )}
            <p className="workspace-thermal-suggestion">{thermal.suggestion}</p>
          </div>
        </div>
        <div className="workspace-pillar-arrow-container">
          <RevealCrossIcon isOpen={isOpen} className="workspace-pillar-arrow-icon" />
        </div>
      </div>

      {/* Level 2: Modal */}
      <WorkspaceLevel2Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Platform Interpretation & Summary"
        icon="✦"
      >
        <div className="workspace-modal-scrollable custom-scrollbar">
          <div className="workspace-slider-group">
            <h4 className="workspace-guideline-card-title uppercase tracking-wider font-mono">
              Executive Summary
            </h4>
            <p className="workspace-modal-text mb-4">
              {overallSummary ? renderTextWithBolding(overallSummary) : "Analyzing your narrative description..."}
            </p>
            {keyConcepts.length > 0 && (
              <div className="mt-2.5">
                <h5 className="text-[13px] font-bold font-mono tracking-widest text-[#94a3b8] uppercase mb-2">
                  Extracted High-Vibe Key Concepts:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[14px] font-bold font-mono tracking-wider bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.35)] text-[#9ac7ff] uppercase shadow-md shadow-blue-900/10"
                    >
                      ✦ {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="workspace-mastery-group">
            <h4 className="workspace-mastery-label font-mono">
              Qualification Assessment
            </h4>
            {renderQualificationStatus(qualificationStatus)}
          </div>
        </div>
      </WorkspaceLevel2Modal>
    </>
  );
}
