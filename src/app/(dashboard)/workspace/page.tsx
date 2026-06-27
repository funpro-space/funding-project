"use client";

import WorkspaceView from "@/components/workspace/M_WorkspaceView";
import { useRouter } from "next/navigation";
import HomeBackground from "@/components/home/HomeBackground";

export default function WorkspacePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text-primary)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <HomeBackground />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--brand-primary-glow)] opacity-40 rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-2xl bg-[var(--brand-surface-card)] border border-[var(--brand-border)] rounded-2xl shadow-2xl p-0 z-10 h-[min(90vh,48rem)] flex flex-col overflow-hidden">
        <WorkspaceView onClose={() => router.push("/")} />
      </div>
    </div>
  );
}
