'use client';

import { FC } from 'react';
import { TrackingData } from '@/types/cricket';
import { getColorForRun } from './TrackingFilters';

interface WagonWheelProps {
  data: TrackingData[];
}

export const WagonWheel: FC<WagonWheelProps> = ({ data }) => {
  // SVG Coordinates 0 to 100. Center is 50,50.
  // Max distance 90m -> radius 45.
  
  const getCoordinates = (angleDeg: number, distance: number) => {
    // Convert angle to radians. We assume 0 degrees is "straight down the ground" (top of the circle)
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (distance / 90) * 45; // map distance to SVG radius
    
    // Calculate x and y
    const x = 50 + r * Math.sin(angleRad);
    const y = 50 - r * Math.cos(angleRad);
    
    return { x, y };
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase mb-4">Wagon Wheel</h2>
      
      <div className="flex-grow flex justify-center items-center relative overflow-hidden bg-white rounded-xl border border-slate-50 min-h-[400px]">
        <svg viewBox="-10 -10 120 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          
          {/* Field boundaries */}
          <circle cx="50" cy="50" r="48" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#cbd5e1" strokeWidth="0.5" /> {/* 30 yard circle */}
          <circle cx="50" cy="50" r="15" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          
          {/* Pitch area */}
          <rect x="48" y="40" width="4" height="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />

          {/* Spokes/Trajectories */}
          {data.map((ball) => {
            if (ball.runs === 0 && !ball.isWicket) return null; // usually wagon wheels only show scoring shots
            
            // Make distance realistic based on runs (override random data)
            let realisticDistance = ball.wagonDistance || (Math.random() * 40 + 10);
            const randomness = (ball.id % 15) - 7.5; // Add some spread
            
            if (ball.runs === 6) realisticDistance = 105 + Math.abs(randomness); // Beyond boundary
            else if (ball.runs === 4) realisticDistance = 90; // Exactly on the boundary (distance=90 maps to r=45)
            else if (ball.runs === 3) realisticDistance = 60 + randomness;
            else if (ball.runs === 2) realisticDistance = 45 + randomness;
            else if (ball.runs === 1) realisticDistance = 25 + randomness;
            else if (ball.runs === 0 && !ball.isWicket) return null;
            
            const spreadAngle = ball.wagonAngle + randomness;
            const { x, y } = getCoordinates(spreadAngle, realisticDistance);
            const color = ball.isWicket ? '#f59e0b' : getColorForRun(ball.runs);
            
            return (
              <g key={ball.id} className="transition-all duration-500 ease-out hover:opacity-100">
                <line 
                  x1="50" y1="50" x2={x} y2={y} 
                  stroke={color} strokeWidth={ball.runs >= 4 ? "1.2" : "0.8"} 
                  opacity={ball.runs >= 4 ? 0.9 : 0.7}
                  strokeLinecap="round"
                />
                {ball.runs >= 4 && (
                  <circle cx={x} cy={y} r="2.5" fill={color} className="animate-pulse shadow-lg" />
                )}
                <circle cx={x} cy={y} r="1.2" fill={color} />
                <circle cx={x} cy={y} r="0.5" fill="#fff" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
