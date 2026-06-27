# Specification: Implement Progressive Contact Verification via Privy

## Objective
Enhance the existing Web3 Privy authentication architecture by implementing a progressive onboarding dashboard component. Once a user has authenticated using their wallet, the system must allow them to securely verify and link their email address or phone number (with native country code collection) using Privy's secure `useLinkAccount` hook. Upon verification, the updated contact details must be securely saved via an API endpoint to the user's MongoDB profile.

## Documentation References
* **Privy Link Additional Accounts:** https://docs.privy.io/basics/react/link-accounts
* **Privy User Object Schema:** https://docs.privy.io/basics/react/user-object
* **E.164 Phone Formatting Standards:** Standard international formatting with leading plus sign (+).

---

## 1. Frontend: Progressive Verification Component (`src/components/workspace/C_WorkspaceVerification.tsx`)
Create a new client component that imports `useLinkAccount` and `usePrivy`. This component will dynamically render the current link status and handle the native Privy modal overlays for OTP email/SMS verification.

```tsx
'use client';
import { usePrivy, useLinkAccount } from '@privy-io/react-auth';
import { useState } from 'react';

export default function WorkspaceVerification() {
  const { user, getAccessToken } = usePrivy();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sync verified contact details back to our MongoDB Backend
  const syncContactWithBackend = async (payload: { email?: string; phone?: string }) => {
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
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update contact records in database.');
    } catch (err: any) {
      setSyncError(err.message || 'An error occurred during DB synchronization.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Configure Privy account linking handlers
  const { linkEmail, linkPhone } = useLinkAccount({
    onSuccess: (updatedUser, linkMethod) => {
      if (linkMethod === 'email' && updatedUser.email) {
        syncContactWithBackend({ email: updatedUser.email.address });
      }
      if (linkMethod === 'phone' && updatedUser.phone) {
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
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl max-w-md mx-auto text-center my-8">
      <h3 className="text-lg font-semibold text-white mb-2">Workspace Notification Settings</h3>
      <p className="text-xs text-zinc-400 mb-6">
        Select your preferred method to receive status updates for your workspace. Privy will verify your details using a secure one-time passcode.
      </p>

      {syncError && <div className="mb-4 text-xs text-red-400 font-mono">{syncError}</div>}
      {isSyncing && <div className="mb-4 text-xs text-blue-400 font-mono">Syncing securely with MongoDB...</div>}

      <div className="flex flex-col gap-3">
        
        {!user.email ? (
          <button
            onClick={linkEmail}
            disabled={isSyncing}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white rounded-lg transition disabled:opacity-50"
          >
            📧 Verify & Connect Email Address
          </button>
        ) : (
          <div className="p-3 bg-zinc-800/50 border border-emerald-900/50 rounded-lg text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
            <span>✓ Verified Email:</span>
            <span className="text-zinc-300 font-sans">{user.email.address}</span>
          </div>
        )}

        
        {!user.phone ? (
          <button
            onClick={linkPhone}
            disabled={isSyncing}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-200 rounded-lg transition border border-zinc-700 disabled:opacity-50"
          >
            📱 Verify & Connect SMS Mobile Number
          </button>
        ) : (
          <div className="p-3 bg-zinc-800/50 border border-emerald-900/50 rounded-lg text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
            <span>✓ Verified SMS:</span>
            <span className="text-zinc-300 font-sans">{user.phone.number}</span>
          </div>
        )}
      </div>
    </div>
  );
}