"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Globe, Sparkles, Cpu } from "lucide-react";

// Minimal classmerger/cn utility if target project doesn't have it
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface AiProcessingDetailsProps {
  url: string;
  prompt: string;
  startTime: number;
  isComplete?: boolean;
  tokens?: number;
}

export function AiProcessingDetails({ url, prompt, startTime, isComplete, tokens }: AiProcessingDetailsProps) {
  const [tokensProcessed, setTokensProcessed] = useState(0);
  const [step, setStep] = useState(isComplete ? 4 : 0);

  // Derive basic visual metadata from URL immediately
  const domain = getDomain(url);
  const hasPrompt = typeof prompt === "string" && prompt.trim().length > 0;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setStep(4);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  useEffect(() => {
    const estimatedInput = Math.max(12, Math.round((prompt || "").length / 4));
    const t = setTimeout(() => {
      setTokensProcessed(estimatedInput);
    }, 0);
    return () => clearTimeout(t);
  }, [prompt, startTime]);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => {
        if (tokens && tokens > 0) {
          setTokensProcessed(tokens);
        } else {
          const estimatedInput = Math.max(12, Math.round((prompt || "").length / 4));
          setTokensProcessed(prev => Math.max(prev, estimatedInput + 380));
        }
      }, 0);
      return () => clearTimeout(t);
    }

    const timer = setInterval(() => {
      setTokensProcessed(prev => {
        // Simulate real-time token processing / generation progress
        const increment = Math.floor(Math.random() * 5) + 4; // 4 to 8 tokens per 100ms
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isComplete, tokens, prompt]);

  useEffect(() => {
    if (isComplete) return;
    // Fake sequence for visual feedback before API completes
    const s1 = setTimeout(() => setStep(1), 800);  // Prompt checked
    const s2 = setTimeout(() => setStep(2), 2000); // Initial connection
    const s3 = setTimeout(() => setStep(3), 3500); // Running AI
    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
    };
  }, [isComplete]);

  return (
    <div className="bg-muted/10 p-4 space-y-5 animate-in fade-in zoom-in-95 duration-300 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className={cn("h-5 w-5", !isComplete && "animate-pulse")} />
          <h3 className="text-sm font-semibold tracking-tight">AI Processing Data</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium tabular-nums bg-background/80 px-2 py-1 rounded-md border border-border/50 shadow-sm">
          <Cpu className={cn("h-3.5 w-3.5 text-muted-foreground", !isComplete && "animate-pulse")} />
          <span className={tokensProcessed > 1500 && !isComplete ? "text-amber-500" : ""}>{tokensProcessed.toLocaleString()} Tokens</span>
        </div>
      </div>

      <div className="space-y-4 text-sm relative z-10">
        {/* Step 1: Request analysis */}
        <div className="space-y-2">
          <StepItem 
            active={step === 0} 
            completed={step > 0} 
            text="Analyzing request parameters" 
          />
          <div className={cn("pl-7 overflow-hidden transition-all duration-500", step > 0 ? "max-h-12 opacity-100" : "max-h-0 opacity-0")}>
            {hasPrompt ? (
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                Prompt: <span className="truncate max-w-[200px] text-foreground normal-case">{prompt}</span>
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none border-transparent bg-secondary text-secondary-foreground text-[10px] uppercase tracking-wider">
                Default Extraction
              </div>
            )}
          </div>
        </div>
        
        {/* Step 2: Metadata / connection */}
        <div className="space-y-2">
          <StepItem 
            active={step === 1 || step === 2} 
            completed={step > 2} 
            text="Connecting & reading source" 
          />
          <div className={cn("pl-7 grid gap-2 transition-all duration-500 overflow-hidden", step > 1 ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0")}>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-background shadow-sm px-2.5 py-1.5 rounded-md max-w-[200px]">
                <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span className="truncate font-medium">{domain}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: AI execution */}
        <div className="space-y-2">
          <StepItem 
            active={step === 3} 
            completed={step > 3} 
            text={step > 3 ? "Data extracted successfully" : step >= 3 ? "Running AI extraction model..." : "Awaiting document..."}
            icon={step === 3 ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
          />
        </div>
      </div>
    </div>
  );
}

function StepItem({ active, completed, text, icon }: { active: boolean, completed: boolean, text: string, icon?: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2.5 transition-all duration-300", active || completed ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-1")}>
      <div className="shrink-0 flex items-center justify-center h-5 w-5">
        {completed ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : icon ? (
          icon
        ) : active ? (
           <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <div className="h-2.5 w-2.5 rounded-full border-2 border-muted-foreground/30" />
        )}
      </div>
      <span className={cn(
        "transition-colors",
        active && "font-medium text-foreground", 
        completed && "text-muted-foreground",
        !active && !completed && "text-muted-foreground"
      )}>
        {text}
      </span>
    </div>
  );
}

function getDomain(urlStr: string) {
  if (!urlStr || typeof urlStr !== "string") return "unknown source";
  try {
    const u = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "unknown source";
  }
}
