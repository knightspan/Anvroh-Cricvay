'use client';

import { FC, useMemo } from 'react';
import { TrackingData } from '@/types/cricket';
import { getColorForRun } from './TrackingFilters';

interface PitchMapProps {
  data: TrackingData[];
}

export const PitchMap: FC<PitchMapProps> = ({ data }) => {
  // SVG Coordinates: X from 0 to 100, Y from 0 to 200 (for vertical pitch)
  // Pitch is roughly 3 meters wide, 20 meters long.
  // We'll map X (-1.5 to 1.5) -> (10 to 90)
  // We'll map Y (0 to 20) -> (10 to 190) (Batter is at Y=0 -> SVG Y=10)
  
  const mapX = (x: number) => 50 + (x * 16.666); // Center is 50, +/- 1.5m spreads exactly to 25-75 (pitch width)
  const mapY = (y: number) => 10 + (y * 9);  // 0m -> 10, 20m -> 190

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase mb-4">Pitchmap (Ball Tracking)</h2>
      
      <div className="flex-grow flex justify-center items-center relative overflow-hidden bg-[#d3e5b5] rounded-xl">
        <svg viewBox="0 0 100 200" className="w-full h-full max-w-[400px]" preserveAspectRatio="xMidYMid meet">
          {/* Main Pitch Area */}
          <rect x="25" y="0" width="50" height="200" fill="#e4f0c7" />
          
          {/* Crease Lines (Batter end) */}
          <line x1="15" y1="20" x2="85" y2="20" stroke="white" strokeWidth="1" /> {/* Popping crease */}
          <line x1="25" y1="10" x2="75" y2="10" stroke="white" strokeWidth="1" /> {/* Bowling crease */}
          
          {/* Stumps (Batter end) */}
          <rect x="47" y="8" width="6" height="2" fill="#475569" />

          {/* Zones (Yorker, Full, Length, Short) */}
          <line x1="25" y1="30" x2="75" y2="30" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" /> {/* Yorker (0-2m) */}
          <line x1="25" y1="65" x2="75" y2="65" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" /> {/* Full (2-6m) */}
          <line x1="25" y1="100" x2="75" y2="100" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" /> {/* Length (6-10m) */}
          <line x1="25" y1="150" x2="75" y2="150" stroke="white" strokeWidth="0.5" strokeOpacity="0.5" /> {/* Short (10-15m) */}

          {/* Zone Labels */}
          <text x="80" y="25" fontSize="4" fill="white" opacity="0.8">Yorker</text>
          <text x="80" y="47" fontSize="4" fill="white" opacity="0.8">Full</text>
          <text x="80" y="82" fontSize="4" fill="white" opacity="0.8">Length</text>
          <text x="80" y="125" fontSize="4" fill="white" opacity="0.8">Short</text>

          {/* Plotting the deliveries */}
          {data.map((ball) => {
            // Make pitch realistic: Pace is usually length/short (6-12m), Spin is full (2-6m)
            // Override the random data
            let realisticY = ball.pitchY;
            if (ball.bowlingType === 'Pace') {
              realisticY = 6 + (ball.id % 6) + (Math.random() * 2); // 6m to 14m
            } else if (ball.bowlingType === 'Spin') {
              realisticY = 2 + (ball.id % 4) + (Math.random() * 1); // 2m to 7m
            }
            
            // Randomize X slightly so they aren't in a perfectly straight line
            let realisticX = ball.pitchX;
            if (Math.abs(realisticX) > 1.2) realisticX = (realisticX > 0 ? 1 : -1) * (0.3 + (ball.id % 10) * 0.05);

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
                {/* Core dot */}
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
