'use client';

import { FC, useState } from 'react';
import { ShieldAlert, Crosshair, Users } from 'lucide-react';

const FIELD_SETUPS = {
  Attacking: [
    { name: 'Slip 1', x: 45, y: 30 },
    { name: 'Slip 2', x: 40, y: 32 },
    { name: 'Gully', x: 30, y: 40 },
    { name: 'Point', x: 20, y: 55 },
    { name: 'Cover', x: 25, y: 70 },
    { name: 'Mid Off', x: 45, y: 85 },
    { name: 'Mid On', x: 55, y: 85 },
    { name: 'Mid Wicket', x: 75, y: 65 },
    { name: 'Square Leg', x: 80, y: 50 },
    { name: 'Fine Leg', x: 70, y: 25 },
    { name: 'Wicket Keeper', x: 50, y: 20 }
  ],
  Defensive: [
    { name: 'Deep Point', x: 10, y: 55 },
    { name: 'Deep Cover', x: 15, y: 80 },
    { name: 'Long Off', x: 35, y: 95 },
    { name: 'Long On', x: 65, y: 95 },
    { name: 'Deep Mid Wicket', x: 85, y: 75 },
    { name: 'Deep Square Leg', x: 90, y: 50 },
    { name: 'Fine Leg', x: 75, y: 25 },
    { name: 'Third Man', x: 25, y: 25 },
    { name: 'Cover', x: 30, y: 65 },
    { name: 'Square Leg', x: 70, y: 50 },
    { name: 'Wicket Keeper', x: 50, y: 20 }
  ],
  Spin: [
    { name: 'Slip', x: 45, y: 30 },
    { name: 'Leg Slip', x: 55, y: 30 },
    { name: 'Silly Point', x: 40, y: 45 },
    { name: 'Short Leg', x: 60, y: 45 },
    { name: 'Point', x: 25, y: 55 },
    { name: 'Cover', x: 30, y: 75 },
    { name: 'Long Off', x: 40, y: 95 },
    { name: 'Long On', x: 60, y: 95 },
    { name: 'Mid Wicket', x: 75, y: 65 },
    { name: 'Square Leg', x: 80, y: 50 },
    { name: 'Wicket Keeper', x: 50, y: 25 }
  ]
};

export const CaptaincyGrid: FC = () => {
  const [activeSetup, setActiveSetup] = useState<keyof typeof FIELD_SETUPS>('Attacking');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
          <Crosshair className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800">Captaincy Tactics & Field</h2>
      </div>

      <div className="flex space-x-2 mb-6">
        {(Object.keys(FIELD_SETUPS) as Array<keyof typeof FIELD_SETUPS>).map((setup) => (
          <button
            key={setup}
            onClick={() => setActiveSetup(setup)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSetup === setup
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {setup}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        {/* Field Setting SVG */}
        <div className="relative bg-slate-50 rounded-xl flex items-center justify-center p-4 border border-slate-100">
          <svg viewBox="0 0 100 100" className="w-full max-w-[300px] h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Outfield */}
            <circle cx="50" cy="50" r="48" fill="#d3e5b5" stroke="white" strokeWidth="0.5" />
            {/* 30 Yard Circle */}
            <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
            {/* Pitch */}
            <rect x="46" y="35" width="8" height="30" fill="#e4f0c7" />
            
            {/* Fielders */}
            {FIELD_SETUPS[activeSetup].map((fielder, idx) => (
              <g key={idx} className="transition-all duration-500 ease-in-out" style={{ transform: `translate(${fielder.x - 50}px, ${fielder.y - 50}px)` }}>
                {/* The translation is handled natively via cx/cy for smooth transition if we want, but since it's React mapping, we can just use cx/cy directly with standard CSS transition. Note: standard SVG elements don't transition cx/cy in all browsers perfectly without CSS vars, but it's okay here */}
              </g>
            ))}
            
            {/* To support smooth transitions natively, we output circles with tailwind transition */}
            {FIELD_SETUPS[activeSetup].map((fielder, idx) => (
              <circle
                key={fielder.name} // Keying by name ensures smooth transition if the same position exists, but keying by index is better for morphing all 11 players
                cx={fielder.x}
                cy={fielder.y}
                r="2.5"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="1"
                className="transition-all duration-700 ease-out"
              >
                <title>{fielder.name}</title>
              </circle>
            ))}
          </svg>
        </div>

        {/* Tactical Advice */}
        <div className="flex flex-col space-y-4 justify-center">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <h3 className="text-sm font-bold text-amber-800 uppercase flex items-center mb-2">
              <ShieldAlert className="w-4 h-4 mr-2" /> Bowling Strategy
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              {activeSetup === 'Attacking' && 'Bowl 4th stump line, full length. Induce the drive and bring the slip cordon into play.'}
              {activeSetup === 'Defensive' && 'Bowl wide outside off stump or dart it into the pads. Restrict boundaries by cutting off angles.'}
              {activeSetup === 'Spin' && 'Vary pace through the air. Use the rough outside the right-hander’s off stump. Keep the short leg active.'}
            </p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h3 className="text-sm font-bold text-emerald-800 uppercase flex items-center mb-2">
              <Users className="w-4 h-4 mr-2" /> Fielder Notes
            </h3>
            <p className="text-sm text-emerald-900 leading-relaxed">
              Ensure point and cover are synchronized. The boundary riders need to be at exactly 80m.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
