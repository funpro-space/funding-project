"use client";

import { useState } from "react";
import WorkspaceLevel2Modal from "./WorkspaceLevel2Modal";
import RevealCrossIcon from "@/components/RevealCrossIcon";
import { getThermalState } from "@/lib/utils";

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

interface ValidationMetricsProps {
  analysis: {
    operationalStrategy: VectorSection;
    sustainabilityProcess: VectorSection;
    worldBetterment: VectorSection;
    expertiseOrigin: VectorSection;
  };
  customSuggestion?: string;
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

export default function ValidationMetrics({ analysis, customSuggestion }: ValidationMetricsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!analysis) return null;

  const pillars = [
    {
      id: "ops",
      title: "Operational Strategy",
      section: analysis.operationalStrategy,
      desc: "Core creation tools, viability, and production logic."
    },
    {
      id: "sust",
      title: "Sustainability Process",
      section: analysis.sustainabilityProcess,
      desc: "Resource management, upcycling, and eco footprint."
    },
    {
      id: "comm",
      title: "Community Betterment",
      section: analysis.worldBetterment,
      desc: "Local jobs, short supply-chain, regional culture."
    },
    {
      id: "exp",
      title: "Craft Mastery & Heritage",
      section: analysis.expertiseOrigin,
      desc: "Founder tenure, training, and heritage transfer."
    }
  ];

  const overallSufficient = pillars.every(p => p.section?.sufficient);
  const trustScore = Math.round(
    ((analysis.operationalStrategy.score || 0) * 5) +
    ((analysis.sustainabilityProcess.score || 0) * 5) +
    ((analysis.worldBetterment.score || 0) * 5) +
    ((analysis.expertiseOrigin.score || 0) * 5)
  );
  const thermal = getThermalState(trustScore);

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
                Profile Validation
              </h4>
              <span className="font-mono text-sm text-[var(--brand-primary)] font-bold">{trustScore} / 100</span>
              <div className="workspace-pillar-status-container !ml-0">
                {overallSufficient ? (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-[#a7f3d0]" title="Passed">
                    <svg className="w-3.5 h-3.5 text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-[#fbbf24]" title="Needs Information">
                    <svg className="w-3.5 h-3.5 text-[#fbbf24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <p className="workspace-pillar-card-subtitle  text-left">
              {overallSufficient ? "All pillars satisfied" : "Some metrics need refinement"}
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
        title="Profile Check"
        icon=""
        size="wide"
      >
        <div className="workspace-modal-scrollable custom-scrollbar">
          <div className="workspace-pillars-grid">
            {pillars.map(({ id, title, section, desc }) => {
              if (!section) return null;
              const gradeClass = 
                section.grade === "High" ? "workspace-validation-badge-high" :
                section.grade === "Medium" ? "workspace-validation-badge-medium" :
                "workspace-validation-badge-low";

              const score = section.score || 1;
              const fillWidth = score * 40;

              return (
                <div key={id} className="workspace-pillar-card">
                  <div>
                    <div className="workspace-pillar-header">
                      <span className="workspace-pillar-title">{title}</span>
                      <span className={`workspace-badge-unverified ${gradeClass}`}>
                        {section.grade || "Low"}
                      </span>
                    </div>
                    <p className="workspace-modal-text mb-4">{desc}</p>

                    <div className="workspace-quality-score-row">
                      <span className="workspace-quality-score-label">Quality Score: {score}/5</span>
                      <svg className="w-40" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="200" height="6" rx="3" fill="#2D2D2D"></rect>
                        <rect width={fillWidth} height="6" rx="3" fill={`url(#paint0_linear_${id})`}></rect>
                        <rect x="38" width="2" height="6" fill="#171717"></rect>
                        <rect x="78" width="2" height="6" fill="#171717"></rect>
                        <rect x="118" width="2" height="6" fill="#171717"></rect>
                        <rect x="158" width="2" height="6" fill="#171717"></rect>
                        <defs>
                          <linearGradient id={`paint0_linear_${id}`} x1="0" y1="0" x2="1" y2="0">
                            <stop stopColor="#8E76EF"></stop>
                            <stop offset={1} stopColor="#3912D2"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {section.sufficient ? (
                      <div className="workspace-pillar-status-ok">
                        <span>✓</span> Standard Satisfied
                      </div>
                    ) : (
                      <div className="workspace-pillar-status-missing">
                        <span>✗</span> Incomplete Details
                      </div>
                    )}

                    <p className="workspace-pillar-quote font-sans">
                      &ldquo;{section.extractedText || "No explicit background provided in narrative context."}&rdquo;
                    </p>

                    {id === "sust" && (
                      <div className="workspace-sustainability-breakdown">
                        <span className="workspace-sustainability-breakdown-title">
                          🍃 Sustainability Index Breakdown:
                        </span>
                        {[
                          { label: "Resource Efficiency", score: section.resourceEfficiency || 1 },
                          { label: "Circularity & Upcycling", score: section.circularityUpcycling || 1 },
                          { label: "Ecosystem Harmony", score: section.ecosystemHarmony || 1 }
                        ].map((sub, idx) => (
                          <div key={idx} className="workspace-sustainability-row">
                            <span>{sub.label}</span>
                            <div className="workspace-sustainability-score-wrapper">
                              <span className="workspace-sustainability-score-value">{sub.score}/5</span>
                              <svg className="w-24" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="200" height="6" rx="3" fill="#2D2D2D"></rect>
                                <rect width={sub.score * 40} height="6" rx="3" fill={`url(#paint0_linear_sust_sub_${idx})`}></rect>
                                <rect x="38" width="2" height="6" fill="#171717"></rect>
                                <rect x="78" width="2" height="6" fill="#171717"></rect>
                                <rect x="118" width="2" height="6" fill="#171717"></rect>
                                <rect x="158" width="2" height="6" fill="#171717"></rect>
                                <defs>
                                  <linearGradient id={`paint0_linear_sust_sub_${idx}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop stopColor="#8E76EF"></stop>
                                    <stop offset={1} stopColor="#3912D2"></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {section.feedback && (
                    <div className="workspace-pillar-recommendation font-sans">
                      <span className="workspace-pillar-rec-label">Recommendation:</span>
                      {renderTextWithBolding(section.feedback)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </WorkspaceLevel2Modal>
    </>
  );
}
