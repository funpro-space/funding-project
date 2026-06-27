import React from 'react';

interface RevealIconProps {
  isOpen?: boolean;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export default function RevealIcon({
  isOpen = false,
  className = "w-4 h-4",
  activeColor = "var(--brand-primary, #669ae1)",
  inactiveColor = "rgba(255, 255, 255, 0.4)",
}: RevealIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible`}
    >
      <rect
        className="rect-faq__block rect-faq__block--center"
        x="42"
        y="42"
        width="16"
        height="16"
        style={{
          fill: isOpen ? activeColor : inactiveColor,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s ease",
        }}
      />
      <rect
        className="rect-faq__block rect-faq__block--bottom"
        x="42"
        y="62"
        width="16"
        height="16"
        style={{
          transform: isOpen ? "translateY(-20px)" : undefined,
          fill: isOpen ? activeColor : inactiveColor,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s ease",
          transformOrigin: "center",
        }}
      />
      <rect
        className="rect-faq__block rect-faq__block--left"
        x="22"
        y="42"
        width="16"
        height="16"
        style={{
          transform: isOpen ? "translateX(20px)" : undefined,
          fill: isOpen ? activeColor : inactiveColor,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s ease",
          transformOrigin: "center",
        }}
      />
      <rect
        className="rect-faq__block rect-faq__block--right"
        x="62"
        y="42"
        width="16"
        height="16"
        style={{
          transform: isOpen ? "translateX(-20px)" : undefined,
          fill: isOpen ? activeColor : inactiveColor,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s ease",
          transformOrigin: "center",
        }}
      />
    </svg>
  );
}
