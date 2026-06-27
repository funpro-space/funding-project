import React from 'react';

interface AIIconProps {
  className?: string;
}

export default function AIIcon({ className = 'w-auto h-12 select-none pointer-events-none' }: AIIconProps) {
  return (
    <svg
      width="508"
      height="508"
      viewBox="0 0 508 508"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 1. Background Blur Frame 1 */}
      <foreignObject x="-79" y="-79" width="666" height="666">
        <div
          style={{
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            clipPath: 'url(#bgblur_0_75_2910_clip_path)',
            height: '100%',
            width: '100%',
          }}
        />
      </foreignObject>
      <rect
        opacity="0.2"
        data-figma-bg-blur-radius="100"
        x="21.5"
        y="21.5"
        width="465"
        height="465"
        rx="99.5"
        stroke="url(#paint0_linear_75_2910)"
        strokeDasharray="6 6"
      />

      {/* 2. Background Blur Frame 2 */}
      <foreignObject x="-100" y="-100" width="708" height="708">
        <div
          style={{
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            clipPath: 'url(#bgblur_1_75_2910_clip_path)',
            height: '100%',
            width: '100%',
          }}
        />
      </foreignObject>
      <rect
        opacity="0.08"
        data-figma-bg-blur-radius="100"
        x="0.5"
        y="0.5"
        width="507"
        height="507"
        rx="115.5"
        stroke="url(#paint1_linear_75_2910)"
        strokeDasharray="6 6"
      />

      {/* 3. Background Blur Frame 3 */}
      <foreignObject x="-100" y="-100" width="708" height="708">
        <div
          style={{
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            clipPath: 'url(#bgblur_2_75_2910_clip_path)',
            height: '100%',
            width: '100%',
          }}
        />
      </foreignObject>
      <rect
        data-figma-bg-blur-radius="12"
        x="45.5"
        y="45.5"
        width="417"
        height="417"
        rx="79.5"
        fill="url(#paint2_radial_75_2910)"
        fillOpacity="0.08"
        stroke="url(#paint3_radial_75_2910)"
      />

      {/* 4. Centered Astroid Icon Shape (Drawn on top of the frames) */}
      <g transform="translate(94, 94) scale(2.5)">
        {/* Background Overlay Layer from original asset */}
        <g opacity="0.24" style={{ mixBlendMode: 'overlay' }}>
          <path
            d="M64 128C63.975 92.6642 35.3359 64.025 9.35521e-06 64C35.3359 63.975 63.975 35.3359 64 0C64.025 35.3359 92.6642 63.975 128 64C92.6642 64.025 64.025 92.6642 64 128Z"
            fill="#000000"
          />
        </g>

        {/* Foreground Interactive Shimmer Layer */}
        <path
          className="animated-shimmer-flare"
          d="M64 128C63.975 92.6642 35.3359 64.025 9.35521e-06 64C35.3359 63.975 63.975 35.3359 64 0C64.025 35.3359 92.6642 63.975 128 64C92.6642 64.025 64.025 92.6642 64 128Z"
        />
      </g>

      <defs>
        {/* Shimmer animation definitions */}
        <linearGradient id="shimmer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.4" />
          <stop offset="35%" stopColor="var(--brand-primary)" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="65%" stopColor="var(--brand-primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.4" />
        </linearGradient>

        <style>{`
          @keyframes globalShimmerSweep {
            0% {
              background-position: -200% 0%;
            }
            30% {
              background-position: 200% 0%;
            }
            100% {
              background-position: 200% 0%;
            }
          }

          .animated-shimmer-flare {
            fill: url(#shimmer-gradient);
            background-size: 200% 100%;
            animation: globalShimmerSweep 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          }
        `}</style>

        {/* Frame background blur clip paths */}
        <clipPath id="bgblur_0_75_2910_clip_path" transform="translate(79 79)">
          <rect x="21.5" y="21.5" width="465" height="465" rx="99.5" />
        </clipPath>
        <clipPath id="bgblur_1_75_2910_clip_path" transform="translate(100 100)">
          <rect x="0.5" y="0.5" width="507" height="507" rx="115.5" />
        </clipPath>
        <clipPath id="bgblur_2_75_2910_clip_path" transform="translate(100 100)">
          <rect x="45.5" y="45.5" width="417" height="417" rx="79.5" />
        </clipPath>

        {/* Frame gradient painters */}
        <linearGradient
          id="paint0_linear_75_2910"
          x1="50.8471"
          y1="126.428"
          x2="490.981"
          y2="267.835"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.0554814" stopColor="white" stopOpacity="0" />
          <stop offset="0.120115" stopColor="white" />
          <stop offset="0.175792" stopColor="white" stopOpacity="0.19" />
          <stop offset="0.233944" stopColor="white" stopOpacity="0.87" />
          <stop offset="0.275292" stopColor="white" stopOpacity="0.24" />
          <stop offset="0.301221" stopColor="white" stopOpacity="0.04" />
          <stop offset="0.337094" stopColor="white" stopOpacity="0.46" />
          <stop offset="0.413036" stopColor="white" />
          <stop offset="0.495921" stopColor="white" stopOpacity="0.11" />
          <stop offset="0.563283" stopColor="white" stopOpacity="0.84" />
          <stop offset="0.62261" stopColor="white" stopOpacity="0.07" />
          <stop offset="0.681496" stopColor="white" stopOpacity="0.77" />
          <stop offset="0.742564" stopColor="white" stopOpacity="0" />
          <stop offset="0.801618" stopColor="white" stopOpacity="0" />
          <stop offset="0.858302" stopColor="white" stopOpacity="0.8" />
          <stop offset="0.901042" stopColor="white" stopOpacity="0.06" />
          <stop offset="0.947284" stopColor="white" stopOpacity="0.16" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_75_2910"
          x1="7.35521"
          y1="122.587"
          x2="510.269"
          y2="420.2"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.0554814" stopColor="white" stopOpacity="0" />
          <stop offset="0.120115" stopColor="white" />
          <stop offset="0.175792" stopColor="white" stopOpacity="0.19" />
          <stop offset="0.233944" stopColor="white" stopOpacity="0.87" />
          <stop offset="0.275292" stopColor="white" stopOpacity="0.24" />
          <stop offset="0.301221" stopColor="white" stopOpacity="0.04" />
          <stop offset="0.337094" stopColor="white" stopOpacity="0.46" />
          <stop offset="0.413036" stopColor="white" />
          <stop offset="0.495921" stopColor="white" stopOpacity="0.11" />
          <stop offset="0.563283" stopColor="white" stopOpacity="0.84" />
          <stop offset="0.62261" stopColor="white" stopOpacity="0.07" />
          <stop offset="0.681496" stopColor="white" stopOpacity="0.77" />
          <stop offset="0.742564" stopColor="white" stopOpacity="0" />
          <stop offset="0.801618" stopColor="white" stopOpacity="0" />
          <stop offset="0.858302" stopColor="white" stopOpacity="0.8" />
          <stop offset="0.901042" stopColor="white" stopOpacity="0.06" />
          <stop offset="0.947284" stopColor="white" stopOpacity="0.16" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint2_radial_75_2910"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(254 45) rotate(90) scale(429.5)"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="paint3_radial_75_2910"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(115.5 115.5) rotate(35.6639) scale(237.553)"
        >
          <stop stopColor="white" stopOpacity="0.34" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
