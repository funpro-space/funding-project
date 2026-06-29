"use client";

import React, { useState, useEffect } from "react";
import { ButtonRegular } from "@/components/ButtonRegular";

interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface ProjectUpdatesViewProps {
  onClose?: () => void;
}

export default function ProjectUpdatesView({ onClose }: ProjectUpdatesViewProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUpdates = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // Add cache buster to ensure live updates are loaded immediately
      const response = await fetch(`/updates/project-updates.json?t=${Date.now()}`);
      if (!response.ok) throw new Error("Failed to load updates.");
      const data = await response.json();
      setUpdates(data);
    } catch (err) {
      console.error("Failed to fetch updates:", err);
      setFetchError("We couldn't load the updates right now.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load updates on mount (when modal opens or page loads)
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) fetchUpdates();
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="workspace-container h-full">
      {/* Sticky Header */}
      <div className="workspace-header relative pr-12 md:pr-14">
        <div className="workspace-header-content flex !flex-row items-center justify-between w-full">
          <div>
            <h3 className="workspace-header-title text-base sm:text-lg uppercase tracking-wider text-[var(--brand-primary)] flex items-center gap-2 m-0">
              Project Updates
            </h3>
            
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
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
        )}
      </div>

      {/* Scrollable Body */}
      <div className="workspace-body custom-scrollbar flex-1 pb-6">
        {isLoading && updates.length === 0 ? (
          <div className="project-updates-loading">
            <div className="project-updates-loading-spinner" />
            <span className="project-updates-loading-text">Loading updates...</span>
          </div>
        ) : fetchError ? (
          <div className="project-updates-error">
            <span className="project-updates-error-title">⚠ Error</span>
            <p className="project-updates-error-message">{fetchError}</p>
            <ButtonRegular onClick={fetchUpdates} variant="default" className="mt-4 px-4 py-1.5 text-[10px] uppercase font-bold tracking-wider">
              Try Again
            </ButtonRegular>
          </div>
        ) : updates.length === 0 ? (
          <div className="project-updates-empty">
            No updates yet.
          </div>
        ) : (
          <div className="project-updates-list">
            {updates.map((update, index) => (
              <div
                key={update.id || index}
                className="project-update-card"
              >
                <div className="project-update-card-header">
                  <span className="project-update-date">
                    {update.date}
                  </span>
                  <span className="project-update-id">
                     #{update.id}
                  </span>
                </div>
                <h4 className="project-update-title">
                  {update.title}
                </h4>
                <p className="project-update-content">
                  {update.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
