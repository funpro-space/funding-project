"use client";

import * as React from "react";
import { Plus, ChevronRight, ChevronLeft, Send, Sparkles } from "lucide-react";
import "@/styles/ai/ai-chatbox.css";

// Self-contained utility to merge class names without requiring external workspace imports
function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(" ");
}

// Helper to parse **bold** text
function parseBolding(text: string) {
  const parts = text.split("**");
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return <strong key={idx} className="font-semibold text-emerald-400 font-sans">{part}</strong>;
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

        // Check if line is a bullet point starting with '*' or '-'
        const isBullet = trimmed.startsWith("*") || trimmed.startsWith("-");
        if (isBullet) {
          trimmed = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed my-0.5">
              <span className="text-violet-500 mt-1 shrink-0 text-xs">✦</span>
              <span className="flex-1 font-sans">{parseBolding(trimmed)}</span>
            </div>
          );
        }

        // Check if line is a header starting with '#'
        if (trimmed.startsWith("#")) {
          const depth = (trimmed.match(/^#+/) || [""])[0].length;
          const cleanText = trimmed.replace(/^#+\s*/, "");
          const headingClass = 
            depth === 1 ? "text-lg font-bold text-white mt-3 mb-1.5 font-mono uppercase tracking-wider" :
            depth === 2 ? "text-base font-bold text-white mt-2.5 mb-1 font-mono uppercase" :
            "text-sm font-bold text-zinc-200 mt-2 mb-1 font-mono";
          return <div key={idx} className={headingClass}>{parseBolding(cleanText)}</div>;
        }

        // Regular paragraph text
        return (
          <p key={idx} className="text-zinc-300 text-sm leading-relaxed m-0 font-sans">
            {parseBolding(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/* ==========================================================================        
   1. AI CHAT BUTTON COMPONENT (Sparkle Generate Button)
   ========================================================================== */     

export interface AiChatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isGenerating?: boolean;
  label?: string;
  activeLabel?: string;
  className?: string;
  wrapperClassName?: string;
}

export function AiChatButton({
  isGenerating = false,
  label = "Generate",
  activeLabel = "Generating",
  className,
  wrapperClassName,
  ...props
}: AiChatButtonProps) {
  // Split strings into letters to run individual letter flicker/glow transitions    
  const displayLabel = isGenerating ? activeLabel : label;
  const letters = displayLabel.split("");

  return (
    <div className={cn("btn-wrapper", wrapperClassName)}>
      <button
        type="button"
        className={cn("btn-sparkle", isGenerating && "generating", className)}       
        disabled={isGenerating || props.disabled}
        {...props}
      >
        <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>

        <div className="txt-wrapper">
          <div className="txt-letters">
            {letters.map((char, index) => (
              <span
                key={index}
                className="btn-letter"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>
      </button>
    </div>
  );
}

/* ==========================================================================        
   2. AI CHATBOX COMPONENT (With nested prompts & Voice overlay)
   ========================================================================== */     

export type AiPromptItem = string | { label: string; value?: string; action?: () => void; children?: AiPromptItem[] };

export interface AiChatboxProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  availablePrompts?: AiPromptItem[];
  onPromptSelect?: (prompt: string) => void;
  quickTags?: { label: string; value: string }[];
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  submitDisabled?: boolean;
  maxLength?: number;
  remainingChats?: number;
  maxChats?: number;
}

export function AiChatbox({
  value,
  onChange,
  onSubmit,
  placeholder = "Imagine Something...✦",
  availablePrompts = [],
  onPromptSelect,
  quickTags = [],
  className,
  children,
  disabled = false,
  submitDisabled = false,
  maxLength = 1000,
  remainingChats,
  maxChats = 10,
}: AiChatboxProps) {
  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const progress = Math.min(100, Math.round((words / 40) * 100));
  
  let barColor = "workspace-progress-danger";
  if (progress >= 35 && progress < 75) {
    barColor = "workspace-progress-warning";
  } else if (progress >= 75) {
    barColor = "workspace-progress-success";
  }

  const [isVoice, setIsVoice] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(true);
  const [promptsOpen, setPromptsOpen] = React.useState(false);
  const [menuStack, setMenuStack] = React.useState<{ title: string; items: AiPromptItem[] }[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Auto-resize textarea logic
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value, isVoice]);

  // Click outside to close the custom popover dropdown menu
  React.useEffect(() => {
    if (!promptsOpen) {
      const timer = setTimeout(() => {
        setMenuStack([]);
      }, 0);
      return () => clearTimeout(timer);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {    
        setPromptsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [promptsOpen]);

  const handlePromptClick = (item: AiPromptItem) => {
    if (typeof item === "object" && item.children && item.children.length > 0) {     
      setMenuStack((prev) => [...prev, { title: item.label, items: item.children! }]);
      return;
    }

    if (typeof item === "object" && item.action) {
      item.action();
    } else {
      const val = typeof item === "string" ? item : (item.value || item.label);      
      if (onPromptSelect) {
        onPromptSelect(val);
      } else {
        onChange(val);
      }
    }
    setPromptsOpen(false);
  };

  const currentMenu = menuStack.length > 0 ? menuStack[menuStack.length - 1] : { title: "Available Prompts", items: availablePrompts };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit?.();
      }
    }
  };

  return (
    <div className={cn("export-chatbox-container", className, disabled && "disabled-chatbox")}>
      <div className="container-chat-options-gradient">
        <div className="chat-box-main">
          {isVoice ? (
            /* Voice Overlay State */
            <div className="voice-simulation-state" onClick={() => setIsVoice(false)}>
              <div className="ai">
                <div className="ai-container">
                  <div className="c c4"></div>
                  <div className="c c1"></div>
                  <div className="c c2"></div>
                  <div className="c c3"></div>
                  <div className="glass"></div>
                  <div className="rings"></div>
                </div>
              </div>
              <div className="voice-feedback">
                <p className="voice-title">Listening...</p>
                <p className="voice-subtitle">Click anywhere to cancel voice</p>     
              </div>
            </div>
          ) : (
            /* Text Input State */
            <div className="text-input-state">
              {showPreview && value.trim() && (value.includes("**") || value.includes("*") || value.includes("#")) ? (
                <div 
                  onClick={() => {
                    setShowPreview(false);
                    setTimeout(() => {
                      textareaRef.current?.focus();
                    }, 0);
                  }}
                  className="chat-textarea-preview cursor-pointer hover:bg-zinc-900/10 p-2 rounded-lg border border-transparent hover:border-zinc-800/40 transition-all select-text max-h-[12rem] overflow-y-auto min-h-[100px]"
                  title="Click to edit draft"
                >
                  {renderMarkdown(value)}
                  <div className="text-[9px] text-zinc-500 font-mono uppercase mt-3 select-none flex items-center gap-1">
                    <span>💡 Click anywhere to edit raw text</span>
                  </div>
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  className="chat-textarea"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  rows={4}
                  disabled={disabled}
                  maxLength={maxLength}
                />
              )}

              <div className="options-bar w-full">
                <div className="flex items-center gap-2 w-full">
                  {availablePrompts && availablePrompts.length > 0 && (
                    <div className="btns-add">
                      {/* Custom popover dropdown trigger */}
                      <div className="popover-wrapper" ref={popoverRef}>
                        <button
                          type="button"
                          className={cn("add-option-btn", promptsOpen && "active")}      
                          onClick={() => setPromptsOpen(!promptsOpen)}
                          title="Prompts list"
                        >
                          <Plus className="size-4" />
                        </button>

                        {promptsOpen && (
                          <div className="custom-dropdown-menu">
                            <div className="dropdown-inner">
                              {menuStack.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setMenuStack((prev) => prev.slice(0, -1));
                                  }}
                                  className="dropdown-back-btn"
                                >
                                  <ChevronLeft className="size-3.5" />
                                  <span>{currentMenu.title}</span>
                                </button>
                              ) : (
                                <div className="dropdown-title">
                                  {currentMenu.title}
                                </div>
                              )}

                              <div className="dropdown-items">
                                {currentMenu.items.length > 0 ? (
                                  currentMenu.items.map((item, idx) => {
                                    const label = typeof item === "string" ? item : item.label;
                                    const itemValue = typeof item === "string" ? item : (item.value || item.label);
                                    const isSelected = itemValue === "" ? value.trim() === "" : value.includes(itemValue);
                                    const hasChildren = typeof item === "object" && item.children && item.children.length > 0;

                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        className={cn("dropdown-item", isSelected && !hasChildren && "selected")}
                                        onClick={() => handlePromptClick(item)}
                                      >
                                        <span className="dropdown-item-text">{label}</span>
                                        {hasChildren && <ChevronRight className="size-3.5 opacity-50 shrink-0" />}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="dropdown-empty">
                                    No prompts available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {children}

                  {value.trim() && (value.includes("**") || value.includes("*") || value.includes("#")) && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPreview(!showPreview);
                        if (showPreview) {
                          setTimeout(() => {
                            textareaRef.current?.focus();
                          }, 0);
                        }
                      }}
                      className="ml-auto mr-5 cursor-pointer px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all shrink-0"
                    >
                      {showPreview ? "✍️ Edit" : "✨ Preview"}
                    </button>
                  )}
                </div>

                {/* Submit query button */}
                <button
                  type="button"
                  className={cn("label-text btn-submit-ai", value.trim() && !submitDisabled && "has-value")}
                  onClick={() => {
                    if (value.trim() && !submitDisabled) onSubmit?.();
                  }}
                  disabled={disabled || !value.trim() || submitDisabled}
                  aria-label="Submit prompt"
                >
                  <i>
                    <Send className="size-3.5" />
                  </i>
                </button>
              </div>

              {/* Metrics Row (progress bar & word count) on the same line */}
              <div className="chatbox-metrics-row">
                {/* Progress bar */}
                <div className="chatbox-progress-container">
                  <div 
                    className={`chatbox-progress-bar ${barColor}`} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* Metrics Info */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {remainingChats !== undefined && (
                    <div className="chatbox-eval-dots-container" title={`${remainingChats} evaluations remaining out of ${maxChats}`}>
                      <span className="text-[9px] uppercase font-mono tracking-wider opacity-60 mr-1 select-none">
                        Evals
                      </span>
                      {Array.from({ length: maxChats }).map((_, index) => {
                        const usedChats = maxChats - remainingChats;
                        const isFilled = index < usedChats;
                        return (
                          <div
                            key={index}
                            className={cn(
                              "chatbox-eval-dot",
                              isFilled && "filled"
                            )}
                          />
                        );
                      })}
                    </div>
                  )}
                  <span className="chatbox-metric">
                    {value.length}/{maxLength} chars
                  </span>
                  <span className="chatbox-metric">
                    {words} {words === 1 ? "word" : "words"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Under quick tags (e.g. suggestions list) */}
      {!isVoice && quickTags.length > 0 && (
        <div className="chatbox-quick-tags">
          {quickTags.map((tag, i) => (
            <button
              key={i}
              type="button"
              className="quick-tag-btn"
              onClick={() => {
                if (onPromptSelect) onPromptSelect(tag.value);
                else onChange(tag.value);
              }}
            >
              <Sparkles className="size-3 text-violet-500 mr-1" />
              <span>{tag.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
