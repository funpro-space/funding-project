"use client";

import React from "react";
import WorkspaceLevel2Modal from "./WorkspaceLevel2Modal";
import { AiProcessingDetails } from "@/components/ai/ai-processing-details";
import { ButtonRegular } from "@/components/ButtonRegular";
import { ButtonRegular2 } from "@/components/ButtonRegular2";

// Helper to parse **bold** text
function parseBolding(text: string) {
  const parts = text.split("**");
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return <strong key={idx} className="font-semibold text-gray-400 font-sans">{part}</strong>;
    }
    return part;
  });
}

// Helper to parse basic Markdown with emojis, bullets, and section headers
function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  
  return (
    <div className="markdown-preview-container text-left space-y-2 mt-1">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Handle HTML escaped ampersands
        trimmed = trimmed.replace(/&amp;/g, "&");

        // Check if line is a bullet point starting with '*' or '-'
        const isBullet = trimmed.startsWith("*") || trimmed.startsWith("-");
        if (isBullet) {
          trimmed = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start gap-2 text-gray-200 leading-relaxed my-0.5">
              <span className="text-gray-400 mt-1 shrink-0 text-xs">✦</span>
              <span className="flex-1 font-sans">{parseBolding(trimmed)}</span>
            </div>
          );
        }

        // Check if line is a header starting with '#'
        if (trimmed.startsWith("#")) {
          const depth = (trimmed.match(/^#+/) || [""])[0].length;
          const cleanText = trimmed.replace(/^#+\s*/, "");
          const headingClass = 
            depth === 1 ? "text-lg font-bold text-white mt-4 mb-2 font-mono uppercase tracking-wider border-b border-emerald-500/10 pb-0.5" :
            depth === 2 ? "text-base font-bold text-white mt-3 mb-1.5 font-mono uppercase border-b border-emerald-500/10 pb-0.5" :
            " font-bold text-zinc-200 mt-2 mb-1 font-mono";
          return <div key={idx} className={headingClass}>{parseBolding(cleanText)}</div>;
        }

        // Regular paragraph text
        return (
          <p key={idx} className="text-gray-200/90 leading-relaxed m-0 font-sans">
            {parseBolding(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

interface NarrativePolishModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  polishedText: string;
  rationale: string;
  onConfirm: (text: string) => void;
  onKeepOriginal: () => void;
  isLoading: boolean;
  polishStartTime: number;
  lvl1Tokens?: { input: number; output: number; total: number; cost: number; };
}

export default function NarrativePolishModal({
  isOpen,
  onOpenChange,
  originalText,
  polishedText,
  onConfirm,
  onKeepOriginal,
  isLoading,
  polishStartTime,
  lvl1Tokens,
}: NarrativePolishModalProps) {
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);
  const [editedText, setEditedText] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setEditedText(null);
      setIsEditing(false);
    }
  }

  const currentText = editedText !== null ? editedText : polishedText;

  return (
    <WorkspaceLevel2Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Project Text Optimization"
      size="wide"
      contentClassName="!max-w-7xl"
    >
      {/* Comparison Grid */}
      <div className="polish-modal-grid">
        {/* Original Draft Box */}
        <div className="polish-column-box">
          <span className="polish-column-title">
            📝 Your Original Draft
          </span>
          <div className="polish-original-draft custom-scrollbar">
            {originalText || <span>No content provided.</span>}
          </div>
        </div>

        {/* Polished Recommendation Box or AI Processing Details */}
        <div className="polish-column-box">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="polish-column-title" style={{ color: '#9ac7ff' }}>
                {isLoading ? "⚡ AI Polishing in Progress..." : "✨ Recommended Improvements"}
              </span>
              {!isLoading && lvl1Tokens && lvl1Tokens.total > 0 && (
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Level 1 Tokens: {lvl1Tokens.total.toLocaleString()} (${lvl1Tokens.cost.toFixed(4)})
                </span>
              )}
            </div>
            {!isLoading && (
              <ButtonRegular
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-mono uppercase tracking-wider"
              >
                {isEditing ? "👁️ View Preview" : "✏️ Edit Text"}
              </ButtonRegular>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex-1 min-h-[18rem] bg-zinc-950/20 border border-zinc-800/80 rounded-lg overflow-hidden">
              <AiProcessingDetails
                url="funpro.space/api/workspace-ai-polish"
                prompt={originalText}
                startTime={polishStartTime}
                isComplete={false}
              />
            </div>
          ) : isEditing ? (
            <textarea
              value={currentText}
              onChange={(e) => setEditedText(e.target.value)}
              className="polish-recommendation-box polish-edit-textarea custom-scrollbar"
              autoFocus
            />
          ) : (
            <div 
              className="polish-recommendation-box custom-scrollbar"
            >
              {renderMarkdown(currentText) || <span>Polishing narrative...</span>}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="px-6 py-4 bg-[#070b12] border-t border-zinc-800/80 flex flex-col sm:flex-row sm:justify-end gap-3 items-center mt-auto -mx-6 -mb-6">
        <ButtonRegular
          type="button"
          onClick={onKeepOriginal}
          className="w-full sm:w-auto font-mono uppercase tracking-wider"
        >
          {isLoading ? "Skip & Use Original" : "Keep Original"}
        </ButtonRegular>
        
        <ButtonRegular2
          type="button"
          disabled={isLoading}
          onClick={() => onConfirm(currentText)}
          theme="emerald"
          className="w-full sm:w-auto font-mono uppercase tracking-wider"
        >
          Confirm & Update
        </ButtonRegular2>
      </div>
    </WorkspaceLevel2Modal>
  );
}
