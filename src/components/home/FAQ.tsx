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
  const regex = /(Coinbase Smart Wallet|MetaMask|Rainbow|Uniswap|Base Mainnet|USDC|ETH|Gemini AI|Gemini)/g;
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  
  return parts.map((part, index) => {
    switch (part) {
      case "Coinbase Smart Wallet":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/coinbase.svg" className="faq-inline-icon faq-icon-coinbase" alt="Coinbase Smart Wallet" width={20} height={20} />
            Coinbase Smart Wallet
          </span>
        );
      case "MetaMask":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/metamask.svg" className="faq-inline-icon faq-icon-metamask" alt="MetaMask" width={20} height={20} />
            MetaMask
          </span>
        );
      case "Rainbow":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/rainbow.avif" className="faq-inline-icon faq-icon-rainbow" alt="Rainbow" width={20} height={20} />
            Rainbow
          </span>
        );
      case "Uniswap":
        return (
          <span key={index} className="faq-term-wrapper">
            <Image src="/media/home/icons/uniswap.svg" className="faq-inline-icon faq-icon-uniswap" alt="Uniswap" width={20} height={20} />
            Uniswap
          </span>
        );
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
      answer: "Think of Base as a fast, modern digital highway built by Coinbase. It connects your transactions to the real world instantly and securely, keeping fees incredibly low. Mainnet just means the highway is officially open, live, and ready for real-world projects."
    },
    {
      id: "how-does-verification-work",
      question: "How does the on-chain verification work?",
      answer: "By connecting your wallet—such as Coinbase Smart Wallet, MetaMask, Rainbow, or Uniswap—you can initialize automated audits. Important milestones and financial commitments are processed through our prediction engine and safely anchored on the Base Mainnet using the FunPro Registry contract."
    },
 {
  "id": "why-base-ecosystem",
  "question": "Why do we use the Base network?",
  "answer": "Base is built by Coinbase to make digital transactions lightning-fast, ultra-secure, and practically free. Because it plugs directly into standard Coinbase features and Smart Wallets, it completely removes the usual tech headaches, making it incredibly easy for anyone to use."
},
{
  "id": "gemini-ai-role",
  "question": "What does the Gemini AI engine do?",
  "answer": "Think of the Gemini AI engine as your smart preparation partner. During your initial evaluation, it gently looks over your business setup to see how ready it is. This objective analysis helps highlight your project’s strengths and potential, making sure everything is in great shape before any commitments are made."
},
{
  "id": "how-do-i-manage-my-base-account",
  "question": "How do I manage my account?",
  "answer": "It’s completely automatic if using Coinbase Smart Wallet, or standard if using any supported Web3 wallet (such as MetaMask, Rainbow, or Uniswap)! When you sign in, your secure account connection is established instantly. Everything is designed to give you a smooth, seamless start.",
  "subFAQs": [
    {
      "id": "official-dashboard",
      "question": "Where can I see my wallet settings?",
      "answer": "If you are using Coinbase Smart Wallet, you can view your security settings, recovery keys, and assets at any time by visiting the official Coinbase dashboard at https://keys.coinbase.com. For other wallets like MetaMask or Rainbow, you can manage your settings directly in their respective extensions or apps."
    },
    {
      "id": "network-switching",
      "question": "Do I need to change any technical network settings?",
      "answer": "No, never. Because your Smart Wallet is already perfectly configured for the live network, our application handles all the background technical routing automatically. You’ll never have to fiddle with manual network configurations or confusing settings."
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
