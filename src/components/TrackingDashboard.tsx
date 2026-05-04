'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import { TrackingData, FilterState } from '@/types/cricket';
import { TrackingFilters } from './TrackingFilters';
import { PitchMap } from './PitchMap';
import { Beehive } from './Beehive';
import { WagonWheel } from './WagonWheel';
import Pitch3D from './Pitch3D';

export interface TrackingDashboardProps {
  activePlayer?: string | null;
}

export const TrackingDashboard: FC<TrackingDashboardProps> = ({ activePlayer }) => {
  const [data, setData] = useState<TrackingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pitchmap' | 'beehive' | 'wagonwheel' | '3d'>('pitchmap');
  const [filters, setFilters] = useState<FilterState>({
    runs: [0, 1, 2, 4, 6],
    showWickets: true,
    bowlingType: null,
  });

  useEffect(() => {
    setIsLoading(true);
    const url = activePlayer 
      ? `/api/tracking?player=${encodeURIComponent(activePlayer)}`
      : `/api/tracking`;
      
    fetch(url)
      .then(res => res.json())
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load tracking data:", err);
        setIsLoading(false);
      });
  }, [activePlayer]);

  const filteredData = useMemo(() => {
    return data.filter((ball) => {
      // Filter by runs/wickets
      let matchOutcome = false;
      if (ball.isWicket && filters.showWickets) matchOutcome = true;
      if (!ball.isWicket && filters.runs.includes(ball.runs)) matchOutcome = true;
      if (ball.runs === 3 && filters.runs.includes(2)) matchOutcome = true; // group 3s with 2s
      
      if (!matchOutcome) return false;

      // Filter by bowling type
      if (filters.bowlingType && ball.bowlingType !== filters.bowlingType) return false;

      return true;
    });
  }, [data, filters]);

  return (
    <div className="flex flex-col space-y-4 h-full">
      <TrackingFilters filters={filters} setFilters={setFilters} />
      
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        {['pitchmap', 'beehive', 'wagonwheel', '3d'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2 text-sm font-bold uppercase tracking-wide rounded-t-lg transition-colors ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {tab === '3d' ? '3D Trajectory' : tab}
          </button>
        ))}
      </div>

      <div className="relative flex-1 min-h-[500px] bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-slate-100 flex flex-col p-6 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-slate-500 mt-4 tracking-wide uppercase">Loading Intelligence...</span>
            </div>
          </div>
        )}
        
        <div className="flex-1 w-full h-full flex justify-center items-center">
          <div className={`w-full max-w-3xl h-full ${activeTab === 'pitchmap' ? 'block' : 'hidden'}`}>
            <PitchMap data={filteredData} />
          </div>
          <div className={`w-full max-w-3xl h-full ${activeTab === 'beehive' ? 'block' : 'hidden'}`}>
            <Beehive data={filteredData} />
          </div>
          <div className={`w-full max-w-3xl h-full ${activeTab === 'wagonwheel' ? 'block' : 'hidden'}`}>
            <WagonWheel data={filteredData} />
          </div>
          <div className={`w-full h-full ${activeTab === '3d' ? 'block' : 'hidden'}`}>
            <Pitch3D 
              trajectories={filteredData.slice(0, 15).map(ball => {
                return {
                  points: [
                    [0, 2.2, -10],
                    [ball.pitchX || 0, 0, 10 - (ball.pitchY || 10)],
                    [ball.stumpX || 0, ball.stumpY || 0.5, 10]
                  ],
                  color: ball.isWicket ? '#f59e0b' : (ball.runs >= 4 ? '#ec4899' : '#0ea5e9')
                };
              })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
