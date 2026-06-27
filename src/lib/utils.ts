import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ThermalState {
  colorClass: string;
  shadowClass: string;
  colorHex: string;
  suggestion: string;
}

export function getThermalState(percentage: number): ThermalState {
  if (percentage < 20) {
    return {
      colorClass: "bg-red-500",
      shadowClass: "shadow-[0_0_10px_rgba(239,68,68,0.5)]",
      colorHex: "#ef4444",
      suggestion: "Workspace initialized. Add your core summary details to begin calibration."
    };
  } else if (percentage < 40) {
    return {
      colorClass: "bg-amber-500",
      shadowClass: "shadow-[0_0_10px_rgba(245,158,11,0.5)]",
      colorHex: "#f59e0b",
      suggestion: "Structure found. Elaborate further on your timeline milestones to expand signal."
    };
  } else if (percentage < 60) {
    return {
      colorClass: "bg-cyan-500",
      shadowClass: "shadow-[0_0_10px_rgba(6,182,212,0.5)]",
      colorHex: "#06b6d4",
      suggestion: "Good momentum. Complete the remaining profile inputs to lock down verification."
    };
  } else if (percentage < 80) {
    return {
      colorClass: "bg-purple-500",
      shadowClass: "shadow-[0_0_10px_rgba(168,85,247,0.5)]",
      colorHex: "#a855f7",
      suggestion: "Almost complete! Attaching your contact node now will unlock live notifications."
    };
  } else {
    return {
      colorClass: "bg-emerald-500",
      shadowClass: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
      colorHex: "#10b981",
      suggestion: "Total synergy achieved. Your workspace parameters are fully optimized for the network."
    };
  }
}
