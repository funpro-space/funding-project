"use client";

import { useState } from "react";
import { ButtonRegular } from "@/components/ButtonRegular";
import RevealIcon from "@/components/RevealIcon";
import { getThermalState } from "@/lib/utils";

interface RegistrationStatusProps {
  allVectorsSufficient: boolean;
  completeSuccess: boolean;
  handleSaveProfile: (e: React.FormEvent) => void;
  setShowSuccessModal: (show: boolean) => void;
  customSuggestion?: string;
}

export default function RegistrationStatus({
  allVectorsSufficient,
  completeSuccess,
  handleSaveProfile,
  setShowSuccessModal,
  customSuggestion
}: RegistrationStatusProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cardStatusText = completeSuccess
    ? "Successfully Registered"
    : allVectorsSufficient
    ? "Ready to Register"
    : "Profile Incomplete";

  const cardStatusSub = completeSuccess
    ? "Profile saved. Click to configure notifications."
    : allVectorsSufficient
    ? "Requirements met! Click to save profile & join queue."
    : "Requirements not met yet. Review other sections.";

  const registrationProgress = completeSuccess ? 100 : allVectorsSufficient ? 80 : 40;
  const thermal = getThermalState(registrationProgress);

  return (
    <div className="workspace-reveal-card" data-open={isOpen} style={{ "--thermal-color": thermal.colorHex } as React.CSSProperties}>
      <button
        type="button"
        className="workspace-reveal-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="workspace-reveal-trigger-content w-full">
          <div className="workspace-pillar-content w-full flex-1">
            <div className="flex items-center gap-4 w-full mb-1">
              <h4 className="workspace-pillar-card-title">
                Registration Status
              </h4>
              <span className="workspace-pillar-category-tag">{registrationProgress}%</span>
              <div className="workspace-pillar-status-container !ml-0">
                {completeSuccess ? (
                  <span className="workspace-badge-verified">
                    Registered
                  </span>
                ) : allVectorsSufficient ? (
                  <span className="workspace-badge-ready">
                    Ready
                  </span>
                ) : (
                  <span className="workspace-badge-incomplete">
                    Incomplete
                  </span>
                )}
              </div>
            </div>
            <p className="workspace-pillar-card-subtitle  text-left">
              {cardStatusText} • {cardStatusSub}
            </p>
            <p className="workspace-thermal-suggestion">{customSuggestion || thermal.suggestion}</p>
          </div>
        </div>
        <div className="workspace-pillar-arrow-container">
          <RevealIcon isOpen={isOpen} className="workspace-reveal-icon-arrow" />
        </div>
      </button>

      <div className="workspace-reveal-content" onClick={(e) => e.stopPropagation()}>
        <div className="workspace-slider-group">
          {!allVectorsSufficient ? (
            <div className="workspace-alert-incomplete">
              <h5 className="workspace-alert-title">
                ⚠️ Profile Incomplete — Additional Details Required
              </h5>
              <p className="workspace-alert-text">
                Your project profile does not yet meet the platform minimum requirements. Please review the ✗ Incomplete Details or Expertise Unverified sections in the metrics modal, add more detail to your story, and submit again to qualify.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                handleSaveProfile(e);
                setIsOpen(false);
              }}
              className="workspace-form-success"
            >
              <div className="workspace-success-banner">
                <h5 className="workspace-success-title">
                  🎉 Profile Verification Successful
                </h5>
                <p className="workspace-success-text">
                  Your project qualifies for the platform roadmap. Save your verification profile to secure your spot in our regional sandbox.
                </p>
              </div>

              {!completeSuccess ? (
                <div className="workspace-verification-buttons">
                  <ButtonRegular
                    type="submit"
                    variant="accent"
                    className="workspace-registration-action-btn"
                  >
                    Save Profile & Join Queue
                  </ButtonRegular>
                </div>
              ) : (
                <div className="workspace-verification-buttons">
                  <div className="workspace-success-message">
                    ✓ Profile Registered. We will notify you when the next level feature sandboxes open!
                  </div>
                  <ButtonRegular
                    type="button"
                    onClick={() => {
                      setShowSuccessModal(true);
                      setIsOpen(false);
                    }}
                    variant="accent"
                    className="workspace-registration-action-btn"
                  >
                    Configure Notifications & Verification
                  </ButtonRegular>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
