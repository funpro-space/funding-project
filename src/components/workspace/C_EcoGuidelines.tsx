"use client";

import { useState } from "react";
import WorkspaceLevel2Modal from "./WorkspaceLevel2Modal";
import RevealCrossIcon from "@/components/RevealCrossIcon";
import { getThermalState } from "@/lib/utils";

interface EcoGuidelinesProps {
  customSuggestion?: string;
}

export default function EcoGuidelines({ customSuggestion }: EcoGuidelinesProps) {
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
                Eco Guidelines
              </h4>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[#a7f3d0]" title="Eco Guidelines / Education">
                <svg className="w-3.5 h-3.5 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <p className="workspace-pillar-card-subtitle  text-left">
              Sustainability education & platform grading indices.
            </p>
            <p className="workspace-thermal-suggestion">{customSuggestion || thermal.suggestion}</p>
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
        title="Sustainability Education & Guidelines"
        icon=""
        size="wide"
      >
        <div className="workspace-modal-scrollable custom-scrollbar">
          <p className="workspace-modal-text">
            Learn how projects are graded on our 1-5 index. Aligning with these standards elevates your artisanal integrity and ecological impact.
          </p>

          <div className="workspace-guidelines-grid">
            <div className="workspace-guideline-card">
              <span className="workspace-guideline-card-title">⚖️ Overall Index</span>
              <p className="workspace-guideline-card-text">
                Overall scoring (1-5) based on water/energy audits, trace supply chain, circular upcycling of waste, and positive ecological restoration.
              </p>
            </div>
            <div className="workspace-guideline-card">
              <span className="workspace-guideline-card-title">♻️ Circular Upcycling</span>
              <p className="workspace-guideline-card-text">
                Reusing and upcycling materials. Scores rise as scrap products find high-value secondary lives or return to soil as clean nutrients.
              </p>
            </div>
            <div className="workspace-guideline-card">
              <span className="workspace-guideline-card-title">🌾 Ecosystem Harmony</span>
              <p className="workspace-guideline-card-text">
                No synthetic fertilizers, pesticides, or toxic pigments. High scores require regenerative soils, biodiversity preservation, and natural inputs.
              </p>
            </div>
          </div>
        </div>
      </WorkspaceLevel2Modal>
    </>
  );
}
