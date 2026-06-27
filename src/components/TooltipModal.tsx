"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TooltipModalProps {
  trigger: React.ReactNode;
  content?: React.ReactNode;
}

export default function TooltipModal({ trigger, content }: TooltipModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Close when clicking outside of the tooltip
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Support Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const defaultContent = (
    <>
      <i>Onchain</i> means transactions and project milestones are recorded directly on the <i>Base blockchain</i>, ensuring full transparency, automated tranches, and trustless distribution of funds.
    </>
  );

  return (
    <span ref={tooltipRef} className="tooltip-trigger-wrapper">
      <span 
        onClick={() => setIsOpen(!isOpen)} 
        className="tooltip-trigger-note"
        role="button"
        tabIndex={0}
      >
        {trigger}
      </span>

      <span className={`tooltip-floating-box ${isOpen ? 'open' : ''}`}>
        <span className="tooltip-floating-content">
          {content || defaultContent}
        </span>
        <span className="tooltip-arrow" />
        <span className="tooltip-arrow-border" />
      </span>
    </span>
  );
}
