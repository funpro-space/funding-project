import React from 'react';

interface FunProIconProps {
  className?: string;
}

export default function FunProIcon({ className = 'w-auto h-12 select-none pointer-events-none' }: FunProIconProps) {
  return (
    <svg
      width="128"
      height="128"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} funpro-logo-svg`}
    >
      <defs>
        <style>{`
          .funpro-logo-svg {
            overflow: visible;
          }

          .fp-nav-logo-rect-big, .fp-nav-logo-rect-med, .fp-nav-logo-rect-small {
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), fill 0.4s ease, filter 0.4s ease;
            transform-box: fill-box;
            transform-origin: center;
          }

          /* Subtle wave animation across columns ONLY on hover */
          .fp-nav-logo-col {
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .funpro-logo-svg:hover .fp-nav-logo-col,
          .navbar-logo-wrapper:hover .fp-nav-logo-col,
          .navbar-logo-main-floating:hover .fp-nav-logo-col {
            animation: logoWave 4.5s ease-in-out infinite;
            animation-delay: calc(var(--col-index) * 0.15s);
          }

          @keyframes logoWave {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          /* Uplift hover effects */
          .funpro-logo-svg:hover .fp-nav-logo-rect-big,
          .navbar-logo-wrapper:hover .fp-nav-logo-rect-big,
          .navbar-logo-main-floating:hover .fp-nav-logo-rect-big {
            transform: translateY(-8px);
            fill: #ffffff;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.95));
          }

          .funpro-logo-svg:hover .fp-nav-logo-rect-med,
          .navbar-logo-wrapper:hover .fp-nav-logo-rect-med,
          .navbar-logo-main-floating:hover .fp-nav-logo-rect-med {
            transform: translateY(-4.5px);
            fill: #ffffff;
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.7));
          }

          .funpro-logo-svg:hover .fp-nav-logo-rect-small,
          .navbar-logo-wrapper:hover .fp-nav-logo-rect-small,
          .navbar-logo-main-floating:hover .fp-nav-logo-rect-small {
            transform: translateY(-2px);
            fill: #ffffff;
            opacity: 1;
          }
        `}</style>
      </defs>

      <g fill="#FFFFFF">
        {/* Column 0: x=21 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 0 } as React.CSSProperties}>
          <rect x="21" y="47" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="21" y="55" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="21" y="63" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="21" y="71" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="21" y="79" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 1: x=28 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 1 } as React.CSSProperties}>
          <rect x="28" y="43" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="28" y="51" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="27.2" y="58.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="27.2" y="66.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="28" y="75" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="28" y="83" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 2: x=35 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 2 } as React.CSSProperties}>
          <rect x="35" y="39" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="35" y="47" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="34.2" y="54.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="33.2" y="61.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="34.2" y="70.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="35" y="79" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="35" y="87" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 3: x=42 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 3 } as React.CSSProperties}>
          <rect x="42" y="35" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="42" y="43" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="41.2" y="50.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="40.2" y="57.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="40.2" y="65.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="41.2" y="74.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="42" y="83" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="42" y="91" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 4: x=49 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 4 } as React.CSSProperties}>
          <rect x="49" y="31" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="49" y="39" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="48.2" y="46.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="47.2" y="53.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="47.2" y="61.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="47.2" y="69.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="48.2" y="78.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="49" y="87" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="49" y="95" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 5: x=56 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 5 } as React.CSSProperties}>
          <rect x="56" y="27" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="56" y="35" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="55.2" y="42.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="54.2" y="49.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="54.2" y="57.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="54.2" y="65.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="55.2" y="74.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="56" y="83" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="56" y="91" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="56" y="99" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 6: x=63 (Center) */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 6 } as React.CSSProperties}>
          <rect x="63" y="23" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="63" y="31" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="62.2" y="38.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="61.2" y="45.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="61.2" y="53.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="61.2" y="61.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="62.2" y="70.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="63" y="79" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="63" y="87" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="63" y="95" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="63" y="103" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 7: x=70 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 7 } as React.CSSProperties}>
          <rect x="70" y="27" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="70" y="35" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="69.2" y="42.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="68.2" y="49.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="68.2" y="57.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="68.2" y="65.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="69.2" y="74.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="70" y="83" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="70" y="91" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="70" y="99" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 8: x=77 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 8 } as React.CSSProperties}>
          <rect x="77" y="31" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="77" y="39" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="76.2" y="46.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="75.2" y="53.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="75.2" y="61.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="75.2" y="69.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="76.2" y="78.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="77" y="87" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="77" y="95" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 9: x=84 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 9 } as React.CSSProperties}>
          <rect x="84" y="35" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="84" y="43" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="83.2" y="50.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="82.2" y="57.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="82.2" y="65.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="83.2" y="74.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="84" y="83" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="84" y="91" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 10: x=91 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 10 } as React.CSSProperties}>
          <rect x="91" y="39" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="91" y="47" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="90.2" y="54.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="89.2" y="61.2" width="5.6" height="5.6" className="fp-nav-logo-rect-big" />
          <rect x="90.2" y="70.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="91" y="79" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="91" y="87" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 11: x=98 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 11 } as React.CSSProperties}>
          <rect x="98" y="43" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="98" y="51" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="97.2" y="58.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="97.2" y="66.2" width="3.6" height="3.6" className="fp-nav-logo-rect-med" />
          <rect x="98" y="75" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="98" y="83" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>

        {/* Column 12: x=105 */}
        <g className="fp-nav-logo-col" style={{ '--col-index': 12 } as React.CSSProperties}>
          <rect x="105" y="47" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="105" y="55" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="105" y="63" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="105" y="71" width="2" height="2" className="fp-nav-logo-rect-small" />
          <rect x="105" y="79" width="2" height="2" className="fp-nav-logo-rect-small" />
        </g>
      </g>
    </svg>
  );
}
