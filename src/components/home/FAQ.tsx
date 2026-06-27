"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import RevealIcon from '@/components/RevealIcon';

interface SubFAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  subFAQs?: SubFAQItem[];
}

const renderTextWithIcons = (text: string) => {
  const regex = /(Base Mainnet|USDC|ETH|Gemini AI|Gemini)/g;
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  
  return parts.map((part, index) => {
    switch (part) {
      case "Base Mainnet":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/base-mainnet.svg" className="faq-inline-icon faq-icon-base-mainnet" alt="Base Mainnet" width={20} height={20} />
            Base Mainnet
          </span>
        );
      case "USDC":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/usdc.svg" className="faq-inline-icon faq-icon-usdc" alt="USDC" width={20} height={20} />
            USDC
          </span>
        );
      case "testnet ETH":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/ETH.svg" className="faq-inline-icon faq-icon-eth" alt="ETH" width={20} height={20} />
            testnet ETH
          </span>
        );
      case "ETH":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/ETH.svg" className="faq-inline-icon faq-icon-eth" alt="ETH" width={20} height={20} />
            ETH
          </span>
        );
      case "Gemini AI":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/Google_Gemini_icon_2025.svg" className="faq-inline-icon faq-icon-gemini" alt="Gemini AI" width={20} height={20} />
            Gemini AI
          </span>
        );
      case "Gemini":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/Google_Gemini_icon_2025.svg" className="faq-inline-icon faq-icon-gemini" alt="Gemini" width={20} height={20} />
            Gemini
          </span>
        );
      default:
        return part;
    }
  });
};

function FAQSubItem({ sub }: { sub: SubFAQItem }) {
  return (
    <div className="faq-sub-item">
      <div className="faq-sub-question">
        <span>{renderTextWithIcons(sub.question)}</span>
      </div>
      <div className="faq-sub-answer">
        <div className="faq-sub-answer-inner">
          <p className="brand-paragraph">{renderTextWithIcons(sub.answer)}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const measureRef = useRef<(() => void) | null>(null);

  const handleToggle = (id: string, open: boolean) => {
    if (open) {
      setActiveId(id);
    } else {
      setActiveId((prev) => (prev === id ? null : prev));
    }
  };

  const getGlowColor = (id: string | null): string => {
    switch (id) {
      case "base-mainnet":
        return "rgba(59, 130, 246, 0.35)"; // Bright Base Mainnet Blue
      case "how-does-verification-work":
        return "rgba(139, 92, 246, 0.35)"; // Purple/violet verification engine
      case "why-base-ecosystem":
        return "rgba(6, 182, 212, 0.35)"; // Cyan ecosystem sky
      case "gemini-ai-role":
        return "rgba(16, 185, 129, 0.35)"; // Emerald Gemini green
      case "how-do-i-manage-my-base-account":
        return "rgba(245, 158, 11, 0.35)"; // Amber gas/eth gold
      case "what-is-onchain":
        return "rgba(59, 130, 246, 0.35)"; // Bright Base Blue
      case "what-is-usdc":
        return "rgba(34, 197, 94, 0.35)"; // Green for USDC
      case "what-are-smart-contracts":
        return "rgba(236, 72, 153, 0.35)"; // Pink for smart contracts/code
      case "what-is-multisig":
        return "rgba(249, 115, 22, 0.35)"; // Orange for security/multisig
      default:
        return "rgba(30, 45, 64, 0.52)"; // Default dim slate-blue
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const measureContentHeights = () => {
      const details = containerRef.current?.querySelectorAll('.morphing-disclosure > details') as NodeListOf<HTMLDetailsElement>;
      if (!details) return;

      details.forEach((detail) => {
        const wasOpen = detail.hasAttribute('open');
        
        // Temporarily open to measure
        if (!wasOpen) {
          detail.setAttribute('open', '');
        }

        const content = detail.querySelector('.content') as HTMLElement;
        if (content) {
          const height = content.getBoundingClientRect().height;
          detail.style.setProperty('--content-height', `${Math.ceil(height)}px`);
        }

        // Restore original state
        if (!wasOpen) {
          detail.removeAttribute('open');
        }
      });
    };

    measureRef.current = measureContentHeights;

    // Run measurement on load
    measureContentHeights();

    // Re-run on resize
    window.addEventListener('resize', measureContentHeights);
    return () => {
      window.removeEventListener('resize', measureContentHeights);
    };
  }, []);

  const faqItems: FAQItem[] = [
    {
      id: "base-mainnet",
      question: "Base Mainnet",
      answer: "Base Mainnet is the official, public production network for the Base blockchain. It uses the exact same code, rules, and smart contract logic as the test network, but it runs on real tokens and represents a live environment."
    },
    {
      id: "how-does-verification-work",
      question: "How does the on-chain verification work?",
      answer: "By connecting your wallet—such as Coinbase Smart Wallet—you can initialize automated audits. Important milestones and financial commitments are processed through our prediction engine and safely anchored on the Base Mainnet using the FunPro Registry contract."
    },
    {
      id: "why-base-ecosystem",
      question: "Why deploy on the Base ecosystem?",
      answer: "Base offers lightning-fast execution, exceptionally low gas fees, and standard-setting security. It provides deep, native alignment with Coinbase products and Smart Wallets, enabling frictionless UX for developers and users navigating decentralized networks."
    },
    {
      id: "gemini-ai-role",
      question: "What role does the Gemini AI engine play?",
      answer: "The Gemini AI engine analyzes startup business metrics during the sandbox evaluation phase, generating accurate performance predictions. This objective prediction layer acts as a decentralized underwriting assistant before any milestones or funds are committed on-chain."
    },
    {
      id: "how-do-i-manage-my-base-account",
      question: "How do I manage my Base account?",
      answer: "Our platform operates exclusively on Base Mainnet and uses Coinbase Smart Wallet with passkeys. Traditional browser extensions like MetaMask or Rainbow are not supported on this interface. Your secure Base account is automatically created on login.",
      subFAQs: [
        {
          id: "official-dashboard",
          question: "On Web: The Official Web Dashboard",
          answer: "To access your account settings, passkeys, and assets via a browser, go to: https://keys.coinbase.com. This dashboard gives you full visibility and control over your Smart Wallet."
        },
        {
          id: "network-switching",
          question: "Do I need to switch networks manually?",
          answer: "No. Since you are using a built-in Smart Wallet configured for Base Mainnet, all network routing is handled automatically by the application. You never have to deal with manual network configs or RPC settings."
        }
      ]
    },
    {
      id: "what-is-onchain",
      question: "What does \"Onchain\" mean?",
      answer: "Being \"onchain\" simply means your project milestones, financial targets, and agreements are securely saved on a public digital ledger like Base. This ensures your records remain completely safe, fully transparent, and instantly verifiable without the need for traditional corporate paperwork."
    },
    {
      id: "what-is-usdc",
      question: "What is USDC?",
      answer: "USDC is a fully-backed stablecoin issued by Circle, pegged 1:1 to the US Dollar. By using USDC instead of highly volatile cryptocurrencies, we ensure project funding remains steady and predictable, protecting your budget from sudden market swings.",
      subFAQs: [
        {
          id: "who-is-circle",
          question: "Who is Circle?",
          answer: "Circle is a fully regulated global financial technology firm that legally issues and backs USDC. They ensure that every digital USDC dollar on the network is always matched 1:1 by real US dollars held securely in highly secure, transparent reserve accounts."
        }
      ]
    },
    {
      id: "what-are-smart-contracts",
      question: "What are Smart Contracts & Escrows?",
      answer: "Smart contracts are self-executing programs on the blockchain with rules written directly into code. An escrow is a specialized smart contract that securely locks milestone-allocated funds. The funds are automatically released to the founder only when predefined milestone criteria are fully verified and completed."
    },
    {
      id: "what-is-multisig",
      question: "What is a Multi-Signature (Multi-Sig) Protocol?",
      answer: "A multi-signature protocol is a security mechanism that requires multiple authorized private keys (e.g., the founder and a compliance reviewer) to co-sign and approve actions before any transaction—like a budget change or milestone release—is executed. This prevents single-point-of-failure vulnerabilities and malicious actions."
    }
  ];

  return (
    <section ref={containerRef} className="faq-section py-5 md:py-12 relative">
      {/* Decorative background glow matching site standard */}
      <div 
        className="faq-glow-bg" 
        style={{
          '--faq-glow-color': getGlowColor(activeId)
        } as React.CSSProperties}
      />

      <div className="faq-outer-container">
        {/* Styled Section Header */}
        <div className="faq-header">
          <h3 className="brand-h3 faq-title">Frequently Asked Questions</h3>
          <p className=" brand-paragraph mx-auto">
            Find answers to common questions about our platform, on-chain metrics, and Gemini AI.
          </p>
        </div>

        {/* Morphing Disclosure List */}
        <div 
          className="faq-disclosure-wrapper" 
          data-bordered="true" 
          data-translate="true" 
          data-highlight="true" 
          data-style="border"
          data-depth="false"
        >
          <div className="morphing-disclosure">
            {faqItems.map((item) => (
              <details 
                key={item.id} 
                name="morph"
                onToggle={(e) => handleToggle(item.id, e.currentTarget.open)}
              >
                <summary>
                  <h4 className="brand-h4 faq-question-title">
                    {renderTextWithIcons(item.question)}
                  </h4>
                  <RevealIcon isOpen={activeId === item.id} className="faq-expand-icon" />
                </summary>
                <div className="content" onClick={(e) => e.stopPropagation()}>
                  <p className="brand-paragraph">{renderTextWithIcons(item.answer)}</p>
                  {item.subFAQs && (
                    <div className="faq-sub-list">
                      {item.subFAQs.map((sub) => (
                        <FAQSubItem 
                          key={sub.id} 
                          sub={sub} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
