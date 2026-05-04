'use client';

import { FC } from 'react';
import { MapPin, TrendingUp, BarChart3 } from 'lucide-react';

const VENUE_INSIGHTS = [
  {
    venue: "M Chinnaswamy Stadium, Bangalore",
    type: "Batting Paradise",
    avg1stInnings: 185,
    spinFactor: 3.5, // out of 10
    paceFactor: 7.2,
    notes: "High altitude, short boundaries. Bowlers must avoid pitching full. The ball flies through the thin air."
  },
  {
    venue: "Wankhede Stadium, Mumbai",
    type: "Pace & Bounce",
    avg1stInnings: 172,
    spinFactor: 4.8,
    paceFactor: 8.5,
    notes: "Red soil offers tremendous bounce early on. Dew is a massive factor in the second innings. Win toss -> Bowl first."
  },
  {
    venue: "MA Chidambaram Stadium, Chennai",
    type: "Spin Web",
    avg1stInnings: 158,
    spinFactor: 9.1,
    paceFactor: 4.2,
    notes: "Historically slow and gripping. Spinners rule the middle overs. Par score is significantly lower here."
  }
];

export const PitchInsights: FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
          <MapPin className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800">Global Pitch Insights</h2>
      </div>

      <div className="grid gap-4">
        {VENUE_INSIGHTS.map((venue, idx) => (
          <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{venue.venue}</h3>
                <span className="inline-block mt-1 px-2 py-1 bg-white border border-slate-200 text-slate-500 text-xs rounded-md font-medium">
                  {venue.type}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Par Score</p>
                <p className="text-lg font-bold text-slate-800">{venue.avg1stInnings}</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">{venue.notes}</p>

            <div className="flex space-x-6">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Pace Factor</span>
                  <span className="text-slate-700 font-bold">{venue.paceFactor}/10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${venue.paceFactor * 10}%` }}></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Spin Factor</span>
                  <span className="text-slate-700 font-bold">{venue.spinFactor}/10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${venue.spinFactor * 10}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
