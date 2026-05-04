'use client';

import { useState } from 'react';
import { TrackingDashboard } from '@/components/TrackingDashboard';
import { PredictionEngine } from '@/components/PredictionEngine';
import { CaptaincyGrid } from '@/components/CaptaincyGrid';
import { PitchInsights } from '@/components/PitchInsights';
import { PlayerDataSearch } from '@/components/PlayerDataSearch';
import { PlayerProfile } from '@/components/PlayerProfile';
import { MatchAnalysis } from '@/components/MatchAnalysis';
import { TacticalGraphs } from '@/components/TacticalGraphs';
import { MakeTeam } from '@/components/MakeTeam';
import { Activity, ShieldCheck, EyeOff } from 'lucide-react';

export default function DashboardPage() {
  const [activePlayerGraphics, setActivePlayerGraphics] = useState<string | null>('V Kohli');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Crickvay Intelligence" className="h-[60px] w-auto object-contain" />
        </div>
        <div className="flex items-center space-x-4">
          {/* Header actions can go here */}
        </div>
      </header>

      {/* Main Grid */}
      <main className="p-8 max-w-[1800px] mx-auto space-y-8">
        
        {/* Player Profile Full Width Section */}
        <PlayerProfile initialPlayer={activePlayerGraphics || 'V Kohli'} onPlayerChange={setActivePlayerGraphics} />
        
        {/* Top Section: AI & Graphics */}
        <div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[800px]">
            {/* Left Column: Advanced Tracking Visuals (Hidden by default) */}
            <div className="xl:col-span-9 h-full flex flex-col space-y-6">
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg inline-flex items-center self-start shadow-sm mb-[-1rem] z-10 relative">
                <span className="font-bold text-sm tracking-wide">
                  {activePlayerGraphics ? `Showing Graphics For: ${activePlayerGraphics}` : 'Match Tracking Analytics'}
                </span>
              </div>
              <TrackingDashboard activePlayer={activePlayerGraphics} />
            </div>

            {/* Right Column: Prediction Engine */}
            <div className="xl:col-span-3 h-full">
              <PredictionEngine onActivateGraphics={setActivePlayerGraphics} />
            </div>
          </div>
        </div>

        {/* Match Strategy Section (New) */}
        <div>
          <div className="mb-6 mt-12">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Match Strategy & Conditions</h2>
            <p className="text-slate-500 mt-1">Live match analytics, win probabilities, and condition assessments</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-full">
               <MatchAnalysis />
            </div>
            <div className="lg:col-span-5 h-full">
               <TacticalGraphs />
            </div>
          </div>
        </div>

        {/* Bottom Section: Three New Grids */}
        <div>
          <div className="mb-6 mt-12">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Strategic Intel</h2>
            <p className="text-slate-500 mt-1">Pitch analysis, field settings, and global player database</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 h-full">
               <CaptaincyGrid />
            </div>
            <div className="lg:col-span-6 h-full flex flex-col space-y-6">
               <PitchInsights />
            </div>
          </div>
          <div className="mt-6">
             <PlayerDataSearch />
          </div>
        </div>

        {/* Brand New Section: Make Team */}
        <div className="mt-16">
          <MakeTeam />
        </div>

      </main>
    </div>
  );
}
