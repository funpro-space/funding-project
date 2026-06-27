"use client";

import React, { useState, useEffect } from "react";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";
import "@/styles/ai/ai-chat.css";

import TextareaAutosize from "react-textarea-autosize";

// Dummy elements to make this component self-contained for other apps
// Adapt to your overlays / popover system if preferred.
function Popover({ children }: { children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) {
  return <div className="relative inline-block">{children}</div>;
}
function PopoverTrigger({ children }: { children: React.ReactElement; asChild?: boolean }) {
  return children;
}
function PopoverContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`absolute left-0 bottom-full mb-2 bg-background border border-border rounded-lg shadow-xl z-[99999] ${className}`} {...props}>
      {children}
    </div>
  );
}

export type AiPromptItem = string | { label: string; value?: string; action?: () => void; children?: AiPromptItem[] };

export interface AiSimpleChatProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  availablePrompts?: AiPromptItem[];
  onPromptSelect?: (prompt: string) => void;
  onSubmit?: () => void;
}

export function AiSimpleChat({
  value,
  onChange,
  placeholder = "",
  availablePrompts = [],
  onPromptSelect,
  onSubmit,
}: AiSimpleChatProps) {
  const [isVoice, setIsVoice] = useState(false);
  const [promptsOpen, setPromptsOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<{title: string; items: AiPromptItem[]}[]>([]);

  useEffect(() => {
    if (!promptsOpen) {
      setTimeout(() => setMenuStack([]), 200);
    }
  }, [promptsOpen]);

  const handlePromptClick = (item: AiPromptItem) => {
    if (typeof item === "object" && item.children && item.children.length > 0) {
      setMenuStack(prev => [...prev, { title: item.label, items: item.children! }]);
      return;
    }

    if (typeof item === "object" && item.action) {
      item.action();
    } else {
      const val = typeof item === "string" ? item : (item.value || item.label);
      if (onPromptSelect) onPromptSelect(val);
      else onChange(val);
    }
    setPromptsOpen(false);
  };

  const currentMenu = menuStack.length > 0 ? menuStack[menuStack.length - 1] : { title: "Available Prompts", items: availablePrompts };

  return (
    <div className="container-ia-chat">
      <input
        type="checkbox"
        id="input-voice"
        className="input-voice"
        checked={isVoice}
        onChange={(e) => setIsVoice(e.target.checked)}
      />
      <TextareaAutosize
        id="input-text"
        placeholder={placeholder}
        className="input-text resize-none"
        minRows={1}
        maxRows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && value.trim()) { 
            e.preventDefault();
            onSubmit?.();
          }
        }}
      />

      <div className="container-upload-files btns-add">
        <Popover open={promptsOpen} onOpenChange={setPromptsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="upload-file-btn"
              title="Available prompts"
              onClick={() => setPromptsOpen(!promptsOpen)}
            >
              <Plus className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          {promptsOpen && (
            <PopoverContent className="w-64 p-2">
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {menuStack.length > 0 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuStack(prev => prev.slice(0, -1));
                    }}
                    className="w-full flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2 py-1 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-left"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 -ml-1 shrink-0" />
                    <span className="truncate">{currentMenu.title}</span>
                  </button>
                ) : (
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2 flex items-center gap-1">
                    {currentMenu.title}
                  </div>
                )}
                {currentMenu.items.length > 0 ? (
                  currentMenu.items.map((item, idx) => {
                    const label = typeof item === "string" ? item : item.label;
                    const itemValue = typeof item === "string" ? item : (item.value || item.label);
                    const isSelected = itemValue === "" ? value.trim() === "" : value.includes(itemValue);
                    const hasChildren = typeof item === "object" && item.children && item.children.length > 0;

                    return (
                      <div key={idx} className="flex items-center group">
                        <button
                          type="button"
                          className={`prompt-button flex-1 flex items-start justify-between text-left px-2 py-1.5 text-sm rounded-md transition-colors focus:outline-none ${isSelected && !hasChildren ? 'active bg-secondary text-secondary-foreground font-medium' : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'}`}
                          onClick={() => handlePromptClick(item)}
                        >
                          <span className="break-words mr-1">{label}</span>
                          {hasChildren && <ChevronRight className="h-4 w-4 opacity-50 shrink-0 mt-0.5" />}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No prompts available.
                  </div>
                )}
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>

      <label htmlFor="input-voice" className="label-voice">
        <svg
          className="icon-voice"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M12 4v16m4-13v10M8 7v10m12-6v2M4 11v2"
          ></path>
        </svg>
        <div className="ai">
          <div className="ai-container">
            <div className="c c4"></div>
            <div className="c c1"></div>
            <div className="c c2"></div>
            <div className="c c3"></div>
            <div className="rings"></div>
          </div>
          <div className="glass"></div>
        </div>
        <div className="text-voice">
          <p>Conversation Started</p>
          <p>Press to cancel the conversation</p>
        </div>
      </label>

      <button 
        type="button"
        className="label-text btn-submit-ai"
        onClick={() => {
          if (value.trim()) {
            onSubmit?.();
          }
        }}
        aria-label="Submit chat"
      >
        <i>
          <svg viewBox="0 0 512 512" width="16" height="16">
            <path
              fill="currentColor"
              d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
            ></path>
          </svg>
        </i>
      </button>
    </div>
  );
}
