'use client';

import React, { useEffect } from 'react';
import LegalPageLayout, { LegalSection } from '@/components/LegalPageLayout';

export default function PrivacyPolicyPage() {
  console.log(`[PrivacyPolicyPage Debug] Rendered`);

  useEffect(() => {
    console.log(`[PrivacyPolicyPage Debug] Mounted`);
    const perfWindow = window as unknown as { __navStartTime?: number };
    if (perfWindow?.__navStartTime) {
      const duration = performance.now() - perfWindow.__navStartTime;
      console.log(`[PrivacyPolicyPage Debug] Time to mount from navigation start: ${duration.toFixed(2)}ms`);
    }
  }, []);

  const sections: LegalSection[] = [
    {
      id: 'web3-core-notice',
      title: 'Web3 Core Notice',
      content: (
        <div className="border border-[var(--brand-warning-border)] bg-[var(--brand-warning-glow)] rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-[var(--brand-warning-color)] font-bold text-sm uppercase tracking-wider font-orbitron">
            <span className="text-sm">⚠️</span> Web3 Immutability Warning
          </div>
          <p className="text-base text-[var(--brand-text-secondary)] leading-relaxed">
            By using this application, you interact directly with the public Base Mainnet blockchain network. 
            Blockchain transactions are public, immutable, and permanent. Please do not submit any information 
            you wish to keep entirely confidential to on-chain functions.
          </p>
        </div>
      ),
    },
    {
      id: 'information-collected',
      title: '1. Information We Collect and Process',
      content: (
        <div className="space-y-4">
          <p>
            We leverage industry-leading third-party infrastructure to process your identity and app interactions securely. Here is exactly what we collect:
          </p>
          <ul className="space-y-3 border-l border-[var(--brand-border-light)] pl-4 ml-2">
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Authentication &amp; Identity (Privy):</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                To onboard smoothly, Privy processes and verifies your Web3 cryptographic public wallet address, email address, and mobile phone number via secure One-Time Passwords (OTP).
              </p>
            </li>
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Operational &amp; Business Inputs:</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                We collect your &quot;Operational Strategy Canvas&quot; inputs, including business concepts, project timelines, and requested funding milestones.
              </p>
            </li>
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">On-Chain Data:</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                Your public wallet address, metadata, and requested USDC funding distributions are captured when interacting with our smart contracts.
              </p>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'third-party-processing',
      title: '2. Third-Party Data Processing',
      content: (
        <div className="space-y-4">
          <p>
            Your data is processed by the following third-party services to deliver core application functionality:
          </p>
          <ul className="space-y-3 border-l border-[var(--brand-border-light)] pl-4 ml-2">
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Google Generative AI / Gemini:</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                Your business ideas and canvas inputs are transmitted to Google&apos;s Generative AI APIs (<code className="text-[var(--brand-primary)]">@google/genai</code>) to power the Gemini Underwriting Engine, validating business readiness and generating expense tranches.
              </p>
            </li>
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Privy:</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                Manages your secure progressive onboarding data, linking contact information to web3 identities seamlessly.
              </p>
            </li>
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Vercel AI SDK:</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                Orchestrates the text streaming pipelines between our frontend user interface and the Google AI computational backend.
              </p>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'data-storage',
      title: '3. Data Storage and Retention',
      content: (
        <div className="space-y-4">
          <p>
            We manage off-chain and on-chain storage distinctively to protect identity while ensuring consensus integrity:
          </p>
          <ul className="space-y-3 border-l border-[var(--brand-border-light)] pl-4 ml-2">
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Off-Chain Profiles (MongoDB):</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                Your verified contact profiles synced from Privy, alongside your system generated project assessments, are stored securely using MongoDB. We retain this profile data as long as your account remains active within our ecosystem.
              </p>
            </li>
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">On-Chain Records (Base Network):</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                Budgets logged on-chain via Coinbase Smart Wallets/OnchainKit are anchored directly onto the Base Mainnet network. This data is permanently written to a public distributed ledger and cannot be updated, modified, or deleted by any party.
              </p>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'user-rights',
      title: '4. Your Rights',
      content: (
        <p>
          Depending on your jurisdiction, you may request access to, or deletion of, your off-chain profile data stored 
          in our MongoDB system. However, please note that we exercise no control over data committed to the public blockchain, 
          and exercising rights to deletion cannot apply to on-chain blockchain registries.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="FunPro Space Privacy Policy"
      lastUpdated="Effective: June 24, 2026"
      icon="🌐"
      sections={sections}
    />
  );
}