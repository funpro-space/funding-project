"use client";

import WorkspaceLevel2Modal from "./WorkspaceLevel2Modal";

interface VibeGuideModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VibeGuideModal({ isOpen, onOpenChange }: VibeGuideModalProps) {
  const tiers = [
    {
      tier: "Red",
      range: "0% - 19%",
      title: "Red",
      colorName: "Red",
      colorClass: "bg-red-500",
      glowColor: "rgba(239, 68, 68, 0.7)",
      borderColor: "border-red-500/20",
      bgClass: "bg-red-950/5 hover:bg-red-950/10",
      textColor: "text-red-400",
      icon: "🔴",
      description: "You just started! Your page is empty right now. Add your basic info to get moving.",
      suggestion: "Workspace initialized. Add your core summary details to begin calibration."
    },
    {
      tier: "Orange",
      range: "20% - 39%",
      title: "Orange",
      colorName: "Orange",
      colorClass: "bg-amber-500",
      glowColor: "rgba(245, 158, 11, 0.7)",
      borderColor: "border-amber-500/20",
      bgClass: "bg-amber-950/5 hover:bg-amber-950/10",
      textColor: "text-amber-400",
      icon: "🟠",
      description: "Your page is shaping up nicely. Keep going by telling us more about your plan.",
      suggestion: "Structure found. Elaborate further on your timeline milestones to expand signal."
    },
    {
      tier: "Blue",
      range: "40% - 59%",
      title: "Blue",
      colorName: "Blue",
      colorClass: "bg-cyan-500",
      glowColor: "rgba(6, 182, 212, 0.7)",
      borderColor: "border-cyan-500/20",
      bgClass: "bg-cyan-950/5 hover:bg-cyan-950/10",
      textColor: "text-cyan-400",
      icon: "🔵",
      description: "You are halfway there! Your project page looks great and fits our community standards.",
      suggestion: "Good momentum. Complete the remaining profile inputs to lock down verification."
    },
    {
      tier: "Purple",
      range: "60% - 79%",
      title: "Purple",
      colorName: "Purple",
      colorClass: "bg-purple-500",
      glowColor: "rgba(168, 85, 247, 0.7)",
      borderColor: "border-purple-500/20",
      bgClass: "bg-purple-950/5 hover:bg-purple-950/10",
      textColor: "text-purple-400",
      icon: "🟣",
      description: "You are almost done! Everything looks strong and you only need a few more quick fixes.",
      suggestion: "Almost complete! Attaching your contact node now will unlock live notifications."
    },
    {
      tier: "Green",
      range: "80% - 100%",
      title: "Green",
      colorName: "Green",
      colorClass: "bg-emerald-500",
      glowColor: "rgba(16, 185, 129, 0.7)",
      borderColor: "border-emerald-500/20",
      bgClass: "bg-emerald-950/5 hover:bg-emerald-950/10",
      textColor: "text-emerald-400",
      icon: "🟢",
      description: "Perfect! Your page is 100% complete, fully optimized, and ready for the whole network to see.",
      suggestion: "Total synergy achieved. Your workspace parameters are fully optimized for the network."
    }
  ];

  return (
    <>
      <WorkspaceLevel2Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="The Color Guide"
        size="wide"
        contentClassName="!max-w-4xl"
      >
        <p className="workspace-vibe-guide-description">
          Forget boring scores and hard grades. Our tracking bars change colors from Red to Green so you can easily see how close your project is to being finished.
        </p>

        {/* Interactive Thermal Bar Visualizer */}
        <div className="mb-6 rounded-xl border border-zinc-800/80 bg-zinc-950/40 relative text-left">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-amber-500/5 via-cyan-500/5 via-purple-500/5 to-emerald-500/5 pointer-events-none" />
          <span className="workspace-vibe-guide-spectrum-title px-3">
            ✦ Your Project Color Bar
          </span>
          <div className="h-4 w-full flex overflow-hidden border border-zinc-900 shadow-inner">
            <div className="h-full flex-1 bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all hover:opacity-100" title="Red (0-19%)" />
            <div className="h-full flex-1 bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-all hover:opacity-100" title="Orange (20-39%)" />
            <div className="h-full flex-1 bg-cyan-500/80 shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all hover:opacity-100" title="Blue (40-59%)" />
            <div className="h-full flex-1 bg-purple-500/80 shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all hover:opacity-100" title="Purple (60-79%)" />
            <div className="h-full flex-1 bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all hover:opacity-100" title="Green (80-100%)" />
          </div>
          <div className="px-3 pb-5 workspace-vibe-guide-spectrum-ticks flex justify-between font-mono text-[9px] text-zinc-500 mt-2 px-1">
            <span>RED (0%)</span>
            <span>ORANGE</span>
            <span>BLUE</span>
            <span>PURPLE</span>
            <span>GREEN (100%)</span>
          </div>
        </div>

        {/* Vibe Tiers List */}
        <div className="flex flex-col gap-4">
          {tiers.map((t) => (
            <div
              key={t.tier}
              className={`flex flex-col md:flex-row gap-4 p-4 rounded-xl border ${t.borderColor} ${t.bgClass} transition-all duration-300 group hover:scale-[1.01]`}
              style={{
                boxShadow: `inset 0 0 12px rgba(255, 255, 255, 0.01), 0 4px 20px rgba(0, 0, 0, 0.2)`
              }}
            >
              {/* Left Side Color Pill */}
              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center md:items-center md:w-36 shrink-0 bg-zinc-950/60 border border-zinc-900 rounded-lg p-3 gap-2">
                <div className="flex items-center gap-2 md:flex-col md:gap-1">
                  <span className="workspace-vibe-tier-badge font-mono font-bold text-xs text-white">{t.range}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${t.colorClass} transition-all duration-300 group-hover:scale-125`}
                    style={{
                      boxShadow: `0 0 12px ${t.glowColor}`
                    }}
                  />
                  <span className={`workspace-vibe-tier-title-tag text-[10px] font-mono font-semibold uppercase ${t.textColor}`}>
                    {t.title}
                  </span>
                </div>
              </div>

              {/* Right Side Info */}
              <div className="flex flex-col flex-1 gap-2 text-left">
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="text-sm font-bold text-white tracking-wide">{t.icon} {t.colorName} State</span>
                </div>
                <p className="workspace-vibe-tier-text text-xs text-zinc-400 font-sans leading-relaxed">
                  {t.description}
                </p>
                <div className="workspace-vibe-tier-tip-box mt-1 p-2 rounded-lg bg-zinc-950/80 border border-zinc-900 text-[11px] font-mono text-zinc-400">
                  <span className="workspace-vibe-tier-tip-label text-zinc-500 mr-1">💡 QUICK TIP:</span>
                  <span className="italic">{t.suggestion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-zinc-800 pt-4 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="workspace-vibe-guide-close-btn px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all"
          >
            Back to Workspace
          </button>
        </div>
      </WorkspaceLevel2Modal>
    </>
  );
}