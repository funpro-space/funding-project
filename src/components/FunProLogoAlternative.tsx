import React from 'react';

interface FunProLogoAlternativeProps {
  className?: string;
  size?: number | string;
}

export default function FunProLogoAlternative({ 
  className = '', 
  size = 64 
}: FunProLogoAlternativeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} funpro-alt-logo-svg select-none pointer-events-none`}
    >
      <defs>
        <style>{`
          .funpro-alt-logo-svg {
            overflow: visible;
          }

          /* Pulse and glow animation for bright rects */
          @keyframes brightPulse {
            0%, 100% {
              filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 6px var(--brand-primary));
              transform: scale(1);
              fill: #ffffff;
            }
            50% {
              filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 16px var(--brand-primary));
              transform: scale(1.18);
              fill: var(--brand-primary-hover, #8cb4f5);
            }
          }

          /* Smooth wave across columns */
          @keyframes altColWave {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          .logo-rect-big, .logo-rect-med {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), fill 0.3s ease, filter 0.3s ease;
            transform-box: fill-box;
            transform-origin: center;
            animation: brightPulse 3s ease-in-out infinite;
            animation-delay: calc(var(--rect-delay) * 0.12s);
          }

          .logo-col {
            animation: altColWave 3.5s ease-in-out infinite;
            animation-delay: calc(var(--col-index) * 0.15s);
            transform-box: fill-box;
            transform-origin: center;
          }
        `}</style>
      </defs>

      <g>
        {/* Column 1: x=28 */}
        <g className="logo-col" style={{ '--col-index': 1 } as React.CSSProperties}>
          <rect x="27.2" y="58.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 1 } as React.CSSProperties} />
          <rect x="27.2" y="66.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 2 } as React.CSSProperties} />
        </g>

        {/* Column 2: x=35 */}
        <g className="logo-col" style={{ '--col-index': 2 } as React.CSSProperties}>
          <rect x="34.2" y="54.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 2 } as React.CSSProperties} />
          <rect x="33.2" y="61.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 3 } as React.CSSProperties} />
          <rect x="34.2" y="70.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 4 } as React.CSSProperties} />
        </g>

        {/* Column 3: x=42 */}
        <g className="logo-col" style={{ '--col-index': 3 } as React.CSSProperties}>
          <rect x="41.2" y="50.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 3 } as React.CSSProperties} />
          <rect x="40.2" y="57.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 4 } as React.CSSProperties} />
          <rect x="40.2" y="65.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 5 } as React.CSSProperties} />
          <rect x="41.2" y="74.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 6 } as React.CSSProperties} />
        </g>

        {/* Column 4: x=49 */}
        <g className="logo-col" style={{ '--col-index': 4 } as React.CSSProperties}>
          <rect x="48.2" y="46.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 4 } as React.CSSProperties} />
          <rect x="47.2" y="53.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 5 } as React.CSSProperties} />
          <rect x="47.2" y="61.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 6 } as React.CSSProperties} />
          <rect x="47.2" y="69.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 7 } as React.CSSProperties} />
          <rect x="48.2" y="78.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 8 } as React.CSSProperties} />
        </g>

        {/* Column 5: x=56 */}
        <g className="logo-col" style={{ '--col-index': 5 } as React.CSSProperties}>
          <rect x="55.2" y="42.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 5 } as React.CSSProperties} />
          <rect x="54.2" y="49.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 6 } as React.CSSProperties} />
          <rect x="54.2" y="57.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 7 } as React.CSSProperties} />
          <rect x="54.2" y="65.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 8 } as React.CSSProperties} />
          <rect x="55.2" y="74.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 9 } as React.CSSProperties} />
        </g>

        {/* Column 6: x=63 (Center) */}
        <g className="logo-col" style={{ '--col-index': 6 } as React.CSSProperties}>
          <rect x="62.2" y="38.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 6 } as React.CSSProperties} />
          <rect x="61.2" y="45.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 7 } as React.CSSProperties} />
          <rect x="61.2" y="53.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 8 } as React.CSSProperties} />
          <rect x="61.2" y="61.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 9 } as React.CSSProperties} />
          <rect x="62.2" y="70.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 10 } as React.CSSProperties} />
        </g>

        {/* Column 7: x=70 */}
        <g className="logo-col" style={{ '--col-index': 7 } as React.CSSProperties}>
          <rect x="69.2" y="42.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 7 } as React.CSSProperties} />
          <rect x="68.2" y="49.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 8 } as React.CSSProperties} />
          <rect x="68.2" y="57.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 9 } as React.CSSProperties} />
          <rect x="68.2" y="65.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 10 } as React.CSSProperties} />
          <rect x="69.2" y="74.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 11 } as React.CSSProperties} />
        </g>

        {/* Column 8: x=77 */}
        <g className="logo-col" style={{ '--col-index': 8 } as React.CSSProperties}>
          <rect x="76.2" y="46.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 8 } as React.CSSProperties} />
          <rect x="75.2" y="53.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 9 } as React.CSSProperties} />
          <rect x="75.2" y="61.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 10 } as React.CSSProperties} />
          <rect x="75.2" y="69.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 11 } as React.CSSProperties} />
          <rect x="76.2" y="78.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 12 } as React.CSSProperties} />
        </g>

        {/* Column 9: x=84 */}
        <g className="logo-col" style={{ '--col-index': 9 } as React.CSSProperties}>
          <rect x="83.2" y="50.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 9 } as React.CSSProperties} />
          <rect x="82.2" y="57.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 10 } as React.CSSProperties} />
          <rect x="82.2" y="65.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 11 } as React.CSSProperties} />
          <rect x="83.2" y="74.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 12 } as React.CSSProperties} />
        </g>

        {/* Column 10: x=91 */}
        <g className="logo-col" style={{ '--col-index': 10 } as React.CSSProperties}>
          <rect x="90.2" y="54.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 10 } as React.CSSProperties} />
          <rect x="89.2" y="61.2" width="5.6" height="5.6" className="logo-rect-big" style={{ '--rect-delay': 11 } as React.CSSProperties} />
          <rect x="90.2" y="70.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 12 } as React.CSSProperties} />
        </g>

        {/* Column 11: x=98 */}
        <g className="logo-col" style={{ '--col-index': 11 } as React.CSSProperties}>
          <rect x="97.2" y="58.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 11 } as React.CSSProperties} />
          <rect x="97.2" y="66.2" width="3.6" height="3.6" className="logo-rect-med" style={{ '--rect-delay': 12 } as React.CSSProperties} />
        </g>
      </g>
    </svg>
  );
}
