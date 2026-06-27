import React from 'react';

interface WarningIconProps {
  className?: string;
}

export default function WarningIcon({ className = 'w-auto h-12 select-none pointer-events-none' }: WarningIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Fill Gradient: Orange/Yellow warning theme */}
        <linearGradient id="warning-fill-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffb700" />
          <stop offset="100%" stopColor="#ff5500" />
        </linearGradient>

        {/* Stroke Gradient for extra glow and crisp edge */}
        <linearGradient id="warning-stroke-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffe600" />
          <stop offset="100%" stopColor="#ffaa00" />
        </linearGradient>

        {/* Custom CSS for moving/pulsing orange warning glow */}
        <style>{`
          @keyframes warningGlow {
            0% {
              filter: drop-shadow(-1px -1px 3px rgba(255, 115, 0, 0.6)) drop-shadow(0 0 6px rgba(255, 140, 0, 0.4));
            }
            25% {
              filter: drop-shadow(1px -1.5px 5px rgba(255, 115, 0, 0.8)) drop-shadow(0 0 10px rgba(255, 140, 0, 0.5));
            }
            50% {
              filter: drop-shadow(1.5px 1px 7px rgba(255, 85, 0, 0.9)) drop-shadow(0 0 14px rgba(255, 115, 0, 0.6));
            }
            75% {
              filter: drop-shadow(-1px 1.5px 5px rgba(255, 115, 0, 0.8)) drop-shadow(0 0 10px rgba(255, 140, 0, 0.5));
            }
            100% {
              filter: drop-shadow(-1px -1px 3px rgba(255, 115, 0, 0.6)) drop-shadow(0 0 6px rgba(255, 140, 0, 0.4));
            }
          }

          .animated-warning-icon {
            animation: warningGlow 3s ease-in-out infinite;
            transform-origin: center;
          }
        `}</style>
      </defs>

      <g className="animated-warning-icon">
        {/* Triangle Warning Base with solid gradient fill and glowing border stroke */}
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          stroke="url(#warning-stroke-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#warning-fill-gradient)"
        />
        {/* Exclamation Mark (dark charcoal for maximum contrast on yellow/orange) */}
        <path d="M12 9v4" stroke="#1a0d00" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1.25" fill="#1a0d00" />
      </g>
    </svg>
  );
}
