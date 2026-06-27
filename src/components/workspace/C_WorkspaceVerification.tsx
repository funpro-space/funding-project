'use client';

import { usePrivy, useLinkAccount } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ButtonRegular2 } from '@/components/ButtonRegular2';
import { useWorkspaceModal } from '@/components/providers/WorkspaceModalProvider';
import { toast } from 'sonner';

export default function WorkspaceVerification({ isModal = false }: { isModal?: boolean } = {}) {
  const { user, getAccessToken } = usePrivy();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const { openUpdates } = useWorkspaceModal();

  const [notificationsConfirmed, setNotificationsConfirmed] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const address = user?.wallet?.address;

  // Fetch current notification preference from MongoDB on mount or when address changes
  useEffect(() => {
    let active = true;
    if (address) {
      Promise.resolve().then(() => {
        if (active) setIsLoadingProfile(true);
      });
      fetch(`/api/get-profile?address=${address.toLowerCase()}`)
        .then((res) => res.json())
        .then((data) => {
          if (!active) return;
          if (data.exists && data.profile) {
            setNotificationsConfirmed(!!data.profile.notificationsConfirmed);
          }
        })
        .catch((err) => console.error('Error fetching notification state:', err))
        .finally(() => {
          if (active) setIsLoadingProfile(false);
        });
    }
    return () => {
      active = false;
    };
  }, [address]);

  // Sync verified contact details back to our MongoDB Backend
  const syncContactWithBackend = async (payload: { email?: string; phone?: string; notificationsConfirmed?: boolean }) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const token = await getAccessToken();
      const response = await fetch('/api/user/update-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...payload,
          walletAddress: address?.toLowerCase()
        }),
      });

      if (!response.ok) throw new Error('Failed to update contact records in database.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during DB synchronization.';
      setSyncError(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  // Configure Privy account linking handlers
  const { linkEmail, linkPhone } = useLinkAccount({
    onSuccess: ({ user: updatedUser, linkMethod }) => {
      if (linkMethod === 'email' && updatedUser.email) {
        syncContactWithBackend({ email: updatedUser.email.address });
      }
      if (linkMethod === 'sms' && updatedUser.phone) {
        syncContactWithBackend({ phone: updatedUser.phone.number });
      }
    },
    onError: (error) => {
      console.error('Privy verification failed:', error);
      setSyncError('Verification canceled or failed to complete.');
    },
  });

  if (!user) return null;

  return (
    <div className="workspace-verification-container" data-modal={isModal}>
      <h3 className="workspace-verification-title text-white">Workspace Notification Settings</h3>
      <p className="workspace-verification-text brand-text">
        Choose where you want to receive updates. You will receive a secure code via{' '}
        <a
          href="https://www.privy.io/security"
          target="_blank"
          rel="noopener noreferrer"
          className="workspace-verification-link"
        >
          <Image
            src="/media/home/icons/privy.png"
            alt="Privy"
            width={14}
            height={14}
            className="workspace-verification-link-logo"
          />
          <span>Privy&apos;s</span>
        </a>
        infrastructure to confirm your identity.
      </p>

      {syncError && <div className="workspace-verification-error">{syncError}</div>}
      {isSyncing && <div className="workspace-verification-status">Syncing securely with MongoDB...</div>}

      <div className="workspace-verification-skip-panel">
        <p className="workspace-verification-skip-text">
          Prefer anonymity? Skip this step and simply revisit your dashboard anytime to check live{' '}
          <button
            onClick={openUpdates}
            className="workspace-verification-skip-btn"
          >
            Project Updates
          </button>.
        </p>
      </div>

      <div className="workspace-verification-buttons">
        {!user.email ? (
          <ButtonRegular2
            onClick={linkEmail}
            disabled={isSyncing}
            theme="blue"
            className="w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            Verify & Connect Email Address
          </ButtonRegular2>
        ) : (
          <div className="workspace-verification-success-badge">
            <span>✓ Verified Email:</span>
            <span>{user.email.address}</span>
          </div>
        )}

        {!user.phone ? (
          <ButtonRegular2
            onClick={linkPhone}
            disabled={isSyncing}
            theme="purple"
            className="w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            Verify & Connect SMS Mobile Number
          </ButtonRegular2>
        ) : (
          <div className="workspace-verification-success-badge">
            <span>✓ Verified SMS:</span>
            <span>{user.phone.number}</span>
          </div>
        )}
      </div>

      {/* Confirm Notifications & Reminders section */}
      <div className="workspace-verification-consent-panel mt-6 pt-4 border-t border-zinc-800 flex flex-col items-center">
        <div className="checkbox-container mb-4">
          <input
            type="checkbox"
            id="notifications-optin"
            className="task-checkbox"
            checked={notificationsConfirmed}
            onChange={(e) => setNotificationsConfirmed(e.target.checked)}
          />
          <label htmlFor="notifications-optin" className="checkbox-label">
            <div className="checkbox-box">
              <div className="checkbox-fill"></div>
              <div className="checkmark">
                <svg viewBox="0 0 24 24" className="check-icon">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                </svg>
              </div>
            </div>
            <span className="checkbox-text workspace-verification-checkbox-text text-zinc-300">
              Confirm and allow workspace reminders & notifications
            </span>
          </label>
        </div>

        <div className="flex justify-center w-full">
          <ButtonRegular2
            onClick={async () => {
              try {
                await syncContactWithBackend({ notificationsConfirmed });
                toast.success("Notification preferences saved successfully!");
              } catch {
                toast.error("Failed to save notification preferences.");
              }
            }}
            disabled={isSyncing || isLoadingProfile}
            theme="emerald"
            className="w-full sm:w-fit px-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            Confirm & Save Settings
          </ButtonRegular2>
        </div>
      </div>
    </div>
  );
}
