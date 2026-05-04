'use client';

import { FC } from 'react';
import { FilterState } from '@/types/cricket';
import { Settings, CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';

interface TrackingFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export const TrackingFilters: FC<TrackingFiltersProps> = ({ filters, setFilters }) => {
  const toggleRun = (run: number) => {
    const newRuns = filters.runs.includes(run)
      ? filters.runs.filter((r) => r !== run)
      : [...filters.runs, run];
    setFilters({ ...filters, runs: newRuns });
  };

  const toggleWicket = () => {
    setFilters({ ...filters, showWickets: !filters.showWickets });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Left side: View by Scoring Outcome */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Scoring outcome</p>
          <div className="flex space-x-2">
            {[0, 1, 2, 4, 6].map((run) => (
              <button
                key={run}
                onClick={() => toggleRun(run)}
                className={clsx(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium",
                  filters.runs.includes(run) 
                    ? "bg-slate-50 border-slate-300 text-slate-800 shadow-sm" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                )}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getColorForRun(run) }}
                ></div>
                <span>{run}{run === 2 ? '+' : ''}</span>
              </button>
            ))}
            
            {/* Wicket Toggle */}
            <button
              onClick={toggleWicket}
              className={clsx(
                "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium",
                filters.showWickets 
                  ? "bg-slate-50 border-slate-300 text-slate-800 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>W</span>
            </button>
          </div>
        </div>

        {/* Right side: Filter by Bowling Type */}
        <div className="flex-1 max-w-xs ml-8 border-l border-slate-100 pl-8">
          <div className="flex justify-between items-center mb-2">
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by</p>
             <button className="text-slate-400 hover:text-slate-600"><Settings className="w-4 h-4" /></button>
          </div>
          <select 
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.bowlingType || ''}
            onChange={(e) => setFilters({ ...filters, bowlingType: e.target.value || null })}
          >
            <option value="">All Bowling Types</option>
            <option value="Pace">Pace</option>
            <option value="Spin">Spin</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export function getColorForRun(run: number): string {
  switch (run) {
    case 0: return '#cbd5e1'; // slate-300
    case 1: return '#94a3b8'; // slate-400
    case 2: return '#64748b'; // slate-500
    case 3: return '#64748b'; // treat 3 like 2+
    case 4: return '#38bdf8'; // sky-400
    case 6: return '#d946ef'; // fuchsia-500
    default: return '#94a3b8';
  }
}
