'use client';

import React, { useEffect } from 'react';
import LegalPageLayout, { LegalSection } from '@/components/LegalPageLayout';

export default function TermsOfServicePage() {
  console.log(`[TermsOfServicePage Debug] Rendered`);

  useEffect(() => {
    console.log(`[TermsOfServicePage Debug] Mounted`);
    const perfWindow = window as unknown as { __navStartTime?: number };
    if (perfWindow?.__navStartTime) {
      const duration = performance.now() - perfWindow.__navStartTime;
      console.log(`[TermsOfServicePage Debug] Time to mount from navigation start: ${duration.toFixed(2)}ms`);
    }
  }, []);

  const sections: LegalSection[] = [
    {
      id: 'summary',
      title: 'Summary & Key Points',
      content: (
        <div className="space-y-4">
          <p>
            These Terms of Service (T&amp;C) outline your rights and responsibilities when using the FunPro Space App. By using the App, you agree to these terms. You must be at least 18 years of age to use the App.
          </p>
          <div className="border border-[var(--brand-border-light)] bg-[rgba(203,213,225,0.02)] rounded-lg p-5">
            <div className="text-sm font-bold uppercase tracking-wider text-[var(--brand-primary)] mb-3">
              Key Highlights:
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-[var(--brand-text-dim)] pl-1">
              <li>Age requirements (minimum 18 years old) and wallet connectivity responsibilities</li>
              <li>Use of your personal data and account profiles</li>
              <li>Limitations of liability regarding AI engines and blockchain interactions</li>
              <li>Disclaimer of professional financial or business advice</li>
              <li>Data handling and third-party cloud infrastructure</li>
            </ul>
          </div>
          <p className="text-base text-[var(--brand-text-dim)] border-t border-[var(--brand-border-light)] pt-4">
            Our Terms and Conditions constituent a legally binding agreement between FunPro Space (&quot;Us,&quot; &quot;We,&quot; or &quot;Our&quot;) and you (&quot;User,&quot; &quot;Users,&quot; &quot;your,&quot; or &quot;yours&quot;). Your use of our App shall be governed by the following T&amp;C.
          </p>
          <div className="border border-[var(--brand-danger-border)] bg-[var(--brand-danger-glow)] rounded-lg p-4 text-[var(--brand-danger-color)] text-sm font-bold uppercase tracking-wider font-orbitron">
            ⚠️ YOU MUST BE AT LEAST 18 YEARS OLD TO USE THIS APP.
          </div>
        </div>
      ),
    },
    {
      id: 'eligibility',
      title: '1. Introduction and Eligibility',
      content: (
        <p>
          These Terms and Conditions (&quot;T&amp;C&quot;) form a legally binding agreement between FunPro Space (&quot;Us&quot;, &quot;We&quot;, &quot;Our&quot;) and you (&quot;User&quot;, &quot;you&quot;, &quot;your&quot;). By using our App, you agree to these Terms. You warrant and represent that you are at least 18 years old. Under no circumstances may individuals under the age of 18 access or use the App.
        </p>
      ),
    },
    {
      id: 'infrastructure',
      title: '2. Third-Party Services &amp; Technical Infrastructure',
      content: (
        <div className="space-y-4">
          <p>
            Our core dApp execution pipeline depends on premium Web3 and AI infrastructure:
          </p>
          <ul className="space-y-3 border-l border-[var(--brand-border-light)] pl-4 ml-2">
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Identity &amp; Authentication (Privy):</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                We utilize Privy for progressive onboarding, cryptographic identity pairing, and One-Time Password (OTP) verification.
              </p>
            </li>
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">AI Processing (Google Gemini &amp; Vercel):</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                We leverage Google Generative AI APIs (<code className="text-[var(--brand-primary)]">@google/genai</code>) and the Vercel AI SDK to orchestrate data ingestion and text streaming for our automated underwriting modules.
              </p>
            </li>
            <li className="space-y-1">
              <strong className="text-[var(--brand-primary)]">Onchain Frameworks (Coinbase &amp; Base):</strong>
              <p className="text-base text-[var(--brand-text-dim)]">
                We utilize OnchainKit and Coinbase Smart Wallets to facilitate interactions with the blockchain ledger. You acknowledge that your use of the App is also governed by the terms of these independent third-party services.
              </p>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'wallet-registration',
      title: '3. Wallet Registration &amp; Onboarding',
      content: (
        <p>
          You agree to provide accurate registration signals (including email addresses and mobile numbers) through our onboarding provider, Privy, and to keep this identity valid. You are solely responsible for maintaining the confidentiality and safety of your cryptographic keys, web3 wallet credentials, and connected accounts.
        </p>
      ),
    },
    {
      id: 'acceptable-use',
      title: '4. Acceptable Use',
      content: (
        <div className="space-y-4">
          <p>
            You agree to comply with all applicable local, national, and international laws. You must not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-[var(--brand-text-dim)] pl-2">
            <li>Use the App for criminal, fraudulent, or unauthorized activities, or to facilitate any illegal activities.</li>
            <li>Generate, submit, or distribute content that is sexually explicit, hateful, violent, harassing, or otherwise dangerous or harmful.</li>
            <li>Share, rent, reverse engineer, or maliciously exploit the platform&apos;s code.</li>
            <li>Submit deceptive, harmful, or plagiarized materials through the Operational Strategy Canvas.</li>
            <li>Bypass or attempt to disrupt the core AI throttling rules or system security.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'privacy-immutability',
      title: '5. Privacy &amp; Ledger Immutability',
      content: (
        <div className="space-y-4">
          <p>
            Your use of the App is governed by our Privacy Policy, including provisions for US state-specific regulations such as the California Consumer Privacy Act (CCPA).
          </p>
          
          <div className="border border-[var(--brand-warning-border)] bg-[var(--brand-warning-glow)] rounded-lg p-5 space-y-2">
            <strong className="text-sm text-[var(--brand-warning-color)] uppercase tracking-wider font-orbitron block">
              ⚠️ AI Privacy Warning:
            </strong>
            <p className="text-base text-[var(--brand-text-dim)] leading-relaxed">
              The App leverages Google Generative AI (Gemini) APIs. If a free-tier API is active, Google may utilize prompt inputs and generated outputs to train and improve its AI models. These inputs may also be reviewed by human annotators. <strong>YOU AGREE NOT TO SUBMIT SENSITIVE, CONFIDENTIAL, PERSONAL, OR PROPRIETARY BUSINESS INFORMATION to the AI modules.</strong> We are not responsible for any privacy leakages or losses resulting from your disclosure of confidential data to the AI modules.
            </p>
          </div>

          <p>
            <strong className="text-[var(--brand-primary)]">Off-Chain Databases:</strong> Profile metadata, verified contact indicators, and structural assessments are securely processed and retained using MongoDB Atlas cloud servers.
          </p>
          
          <p>
            <strong className="text-[var(--brand-primary)]">On-Chain Immutability:</strong> When utilizing the &quot;Log Budget On-Chain&quot; features, metadata, project benchmarks, and requested USDC parameters are permanent records anchored directly onto the Base Mainnet public network. You acknowledge that data written to a decentralized public ledger cannot be modified, updated, deleted, or removed by Us.
          </p>
        </div>
      ),
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      content: (
        <div className="space-y-3">
          <p>
            To the maximum extent permitted by applicable law, FunPro Space, its developers, founders, contributors, and third-party infrastructure providers (including Google, Privy, Vercel, and MongoDB) shall absolutely not be liable to you or any third party for any direct, indirect, incidental, special, consequential, exemplary, or punitive damages whatsoever.
          </p>
          <p className="text-base text-[var(--brand-text-dim)]">
            This includes, but is not limited to, damages for loss of profits, loss of funds, crypto asset or web3 wallet leakage, smart contract compilation bugs, gas fee spikes, AI analysis inaccuracies, data processing anomalies, network hacks, or pipeline downtime. Under no circumstances will our maximum aggregate liability exceed $100. If you do not agree to this total release of liability, you must terminate your use of the platform immediately.
          </p>
        </div>
      ),
    },
    {
      id: 'indemnification',
      title: '7. Indemnification',
      content: (
        <p>
          You agree to defend, indemnify, and hold harmless FunPro Space and its contributors against any claims, damages, liabilities, losses, or expenses arising directly out of your use of the App, your interactions with the Base network, or your breach of these terms.
        </p>
      ),
    },
    {
      id: 'warranties',
      title: '8. Disclaimer of Warranties',
      content: (
        <div className="space-y-6">
          <div className="border border-[var(--brand-border-light)] bg-[rgba(203,213,225,0.02)] rounded-lg p-5 space-y-2">
            <strong className="text-sm text-[var(--brand-primary)] uppercase tracking-wider font-orbitron block">
              🚨 NO PROFESSIONAL BUSINESS, LEGAL, OR FINANCIAL ADVICE:
            </strong>
            <p className="text-base text-[var(--brand-text-dim)] uppercase leading-relaxed font-mono">
              THE APP, THE GEMINI UNDERWRITING ENGINE, AND ALL ASSOCIATED AI-GENERATED ASSESSMENTS, METRICS, OPERATIONAL PATHWAYS, AND STRATEGIC RECOMMENDATIONS ARE PROVIDED FOR GENERAL INFORMATIONAL AND EXPERIMENTAL PURPOSES ONLY. FUNPRO SPACE IS NOT A LICENSED FINANCIAL ADVISOR, CPA, INVESTMENT CONSULTANT, ATTORNEY, OR PROFESSIONAL BUSINESS ADVISOR. YOUR USE OF THE APP DOES NOT CREATE A PROFESSIONAL-CLIENT, ADVISORY, OR FIDUCIARY RELATIONSHIP BETWEEN YOU AND US.
            </p>
          </div>

          <div className="border border-[var(--brand-border-light)] bg-[rgba(203,213,225,0.02)] rounded-lg p-5 space-y-2">
            <strong className="text-sm text-[var(--brand-primary)] uppercase tracking-wider font-orbitron block">
              💼 BUSINESS DECISIONS AND FINANCIAL RISK:
            </strong>
            <p className="text-base text-[var(--brand-text-dim)] uppercase leading-relaxed font-mono">
              YOU ACKNOWLEDGE AND AGREE THAT BUSINESS DEVELOPMENT, PROJECT CAPITAL ALLOCATION, AND DECENTRALIZED ON-CHAIN OPERATIONS (INCLUDING LOGGING USDC BUDGETS) INVOLVE SIGNIFICANT FINANCIAL RISK. WE MAKE NO GUARANTEES, WARRANTIES, OR REPRESENTATIONS REGARDING THE ACCURACY, COMPLETENESS, VIABILITY, PROFITABILITY, OR SUCCESS OF ANY BUSINESS STRATEGIES, REVENUE PROJECTIONS, OR DECISIONS INSPIRED OR ASSESSED BY THE APP. YOU ARE SOLELY RESPONSIBLE FOR ALL BUSINESS DECISIONS, ACTIONS, AND OUTCOMES. YOU SHOULD CONSULT QUALIFIED BUSINESS, FINANCIAL, AND LEGAL PROFESSIONALS IN YOUR JURISDICTION BEFORE COMMITTING CAPITAL, LAUNCHING PROJECTS, OR TAKING ANY FINANCIAL ACTIONS BASED ON APP CONTENT.
            </p>
          </div>

          <div className="border border-[var(--brand-border-light)] bg-[rgba(203,213,225,0.02)] rounded-lg p-5 space-y-2">
            <strong className="text-sm text-[var(--brand-primary)] uppercase tracking-wider font-orbitron block">
              💻 &quot;AS IS&quot; WARRANTY DISCLAIMER:
            </strong>
            <p className="text-base text-[var(--brand-text-dim)] uppercase leading-relaxed font-mono">
              THE APP AND ALL ASSOCIATED AI FEATURES, ANALYTICAL METRICS, AND BLOCKCHAIN PATHWAYS ARE PROVIDED STRICTLY ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; basis without any warranties of any kind, whether express, implied, or statutory. To the fullest extent permitted by law, we disclaim all warranties, including any implied warranties of merchantability, fitness for a particular purpose, non-infringement, security, and accuracy. The automated assessments provided by the Gemini Underwriting Engine are intended strictly for experimental, mock evaluation, and ecosystem deployment purposes.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'amendments',
      title: '9. Amendments',
      content: (
        <p>
          We may update these T&amp;C at any time. Continued use of the platform following any modifications constitutes your explicit acceptance of the updated terms.
        </p>
      ),
    },
    {
      id: 'severability',
      title: '10. Severability and Assignment',
      content: (
        <p>
          If any portion of these T&amp;C is found to be invalid or unenforceable under applicable jurisdiction, the remaining sections shall stay in full effect. You may not assign your rights under these terms. We may assign our rights freely.
        </p>
      ),
    },
    {
      id: 'intellectual-property',
      title: '11. Intellectual Property &amp; Enforcement',
      content: (
        <p>
          All visual architecture, algorithmic processing pipelines, layouts, and system designs within the dApp interface belong exclusively to FunPro Space. Unauthorized replication or malicious system exploitation may result in immediate access revocation and legal action.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="FunPro Space Terms of Service"
      lastUpdated="Effective: June 24, 2026"
      icon="📜"
      sections={sections}
    />
  );
}