'use client';

import { FC } from 'react';
import { TrackingData } from '@/types/cricket';
import { getColorForRun } from './TrackingFilters';

interface BeehiveProps {
  data: TrackingData[];
}

export const Beehive: FC<BeehiveProps> = ({ data }) => {
  // SVG Coordinates: 0 to 100 for X and Y.
  // X: -1m to 1m maps to 10 to 90
  // Y: 0m to 2m maps to 90 to 10 (inverted, Y=0 is ground)
  
  const mapX = (x: number) => 50 + (x * 40); // 0m is 50. -1 is 10, +1 is 90
  const mapY = (y: number) => 90 - (y * 40); // 0m is 90 (bottom). 2m is 10 (top)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase mb-4">Beehive</h2>
      
      <div className="flex-grow flex justify-center items-center relative overflow-hidden bg-[#d3e5b5] rounded-xl">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          
          {/* Pitch background lines */}
          <polygon points="10,100 90,100 70,50 30,50" fill="#e4f0c7" />
          
          {/* Ground Line */}
          <line x1="0" y1="90" x2="100" y2="90" stroke="white" strokeWidth="1" />

          {/* Stumps (Middle is 50, width of all 3 is ~0.23m which maps to ~9 units) */}
          {/* Left stump */}
          <rect x="45.5" y="61.5" width="1.5" height="28.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
          {/* Middle stump */}
          <rect x="49.25" y="61.5" width="1.5" height="28.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
          {/* Right stump */}
          <rect x="53" y="61.5" width="1.5" height="28.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
          {/* Bails */}
          <rect x="45.5" y="60.5" width="9" height="1" fill="#cbd5e1" />

          {/* Points */}
          {data.map((ball) => {
            let realisticX = ball.stumpX;
            let realisticY = ball.stumpY;
            if (ball.isWicket) {
              // 40% bowled/lbw (hits stumps), 60% catches (edges/skied)
              const isCatch = ball.id % 5 > 1; 
              if (!isCatch) {
                // Bowled/LBW - Hits stumps varying by player/ball ID
                realisticX = -0.1 + (ball.id % 10) * 0.02; // Close to center (-0.1 to 0.1)
                realisticY = 0.1 + (ball.id % 15) * 0.04;  // Hit stumps (0.1 to 0.7)
              } else {
                // Catch out - can be outside offstump or wide
                realisticX = (ball.id % 2 === 0 ? 1 : -1) * (0.3 + (ball.id % 10) * 0.05);
                realisticY = 0.5 + (ball.id % 10) * 0.1;
              }
            } else if (ball.runs > 0) {
              // Usually played when not too wide or high
              if (Math.abs(realisticX) > 0.8) realisticX *= 0.5;
              if (realisticY > 1.5) realisticY *= 0.6;
            }

            const color = ball.isWicket ? '#f59e0b' : getColorForRun(ball.runs);
            
            return (
              <g key={ball.id} className="transition-all duration-500 hover:opacity-100">
                {/* Glow effect */}
                <circle
                  cx={mapX(realisticX)}
                  cy={mapY(realisticY)}
                  r="4"
                  fill={color}
                  opacity="0.3"
                  className="animate-pulse"
                />
                <circle
                  cx={mapX(realisticX)}
                  cy={mapY(realisticY)}
                  r="2"
                  fill={color}
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="0.5"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
