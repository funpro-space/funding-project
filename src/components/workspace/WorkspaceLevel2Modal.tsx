"use client";

import React from "react";
import { Modal, ModalContent } from "@/components/Modal";
import { cn } from "@/lib/utils";

interface WorkspaceLevel2ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: "default" | "wide";
  contentClassName?: string;
  headerContent?: React.ReactNode;
}

export default function WorkspaceLevel2Modal({
  isOpen,
  onOpenChange,
  title,
  icon,
  children,
  size = "default",
  contentClassName,
  headerContent
}: WorkspaceLevel2ModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent
        size={size}
        overlayClassName="level2-modal-overlay"
        className={cn(
          "level2-modal-content workspace-modal-content border border-zinc-800 bg-[#090d16]/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden",
          contentClassName
        )}
        showCloseButton={false}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#090d16] px-6 py-4 border-b border-zinc-800 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <h3 className="workspace-modal-title text-white font-bold tracking-wide m-0 text-xl flex items-center gap-2 font-mono">
              {icon && <span>{icon}</span>}
              {title}
            </h3>
            {headerContent}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="modal-close-block-btn"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 overflow-visible"
            >
              <rect className="rect-close__block rect-close__block--center" x="42" y="42" width="22" height="22" />
              <rect className="rect-close__block rect-close__block--top-left" x="22" y="22" width="22" height="22" />
              <rect className="rect-close__block rect-close__block--top-right" x="62" y="22" width="22" height="22" />
              <rect className="rect-close__block rect-close__block--bottom-left" x="22" y="62" width="22" height="22" />
              <rect className="rect-close__block rect-close__block--bottom-right" x="62" y="62" width="22" height="22" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="workspace-modal-body p-6 flex flex-col h-full overflow-y-auto custom-scrollbar flex-1 gap-6 bg-[#090d16]">
          {children}
        </div>
      </ModalContent>
    </Modal>
  );
}
