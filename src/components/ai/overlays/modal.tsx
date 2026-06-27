"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={() => onOpenChange(false)} 
      />
      <div className="relative z-10 w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-100 flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
  size?: "compact" | "normal" | "large" | "wide" | string;
  padding?: string;
}

export function ModalContent({ children, size = "normal", padding }: ModalContentProps) {
  return (
    <div className={cn("space-y-4", padding === "none" ? "p-0" : "p-1", size === "wide" ? "max-w-4xl" : "")}>
      {children}
    </div>
  );
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return <div className={cn("border-b border-zinc-800/80 pb-3 mb-2", className)}>{children}</div>;
}

interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalTitle({ children, className }: ModalTitleProps) {
  return <h2 className={cn("text-sm font-bold text-zinc-100 tracking-wide uppercase", className)}>{children}</h2>;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={cn("text-xs text-zinc-300 leading-relaxed py-1", className)}>{children}</div>;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn("flex justify-end gap-3 pt-3 border-t border-zinc-800/80 mt-2", className)}>{children}</div>;
}
