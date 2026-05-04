'use client';

import { FC, useState, useEffect } from 'react';
import { PlayerSkillsRadar } from './PlayerSkillsRadar';

interface PlayerProfileProps {
  initialPlayer?: string;
  onPlayerChange?: (player: string) => void;
}

export const PlayerProfile: FC<PlayerProfileProps> = ({ initialPlayer = 'V Kohli', onPlayerChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlayer, setActivePlayer] = useState(initialPlayer);
  const [baseProfile, setBaseProfile] = useState<any>(null);
  const [displayProfile, setDisplayProfile] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [format, setFormat] = useState<'ODI' | 'T20' | 'TEST' | 'FRANCHISE'>('ODI');
  const [league, setLeague] = useState<string>('IPL');
  const [year, setYear] = useState<string>('2024');

  useEffect(() => {
    if (initialPlayer) {
      setActivePlayer(initialPlayer);
    }
  }, [initialPlayer]);

  useEffect(() => {
    fetchProfile(activePlayer);
  }, [activePlayer]);

  useEffect(() => {
    applyFilters();
  }, [baseProfile, format, league, year]);

  const fetchProfile = async (name: string) => {
    setIsLoading(true);
    try {
      // Fetch stats
      const res = await fetch(`/api/player?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      setBaseProfile(data);

      // Fetch image
      const imgRes = await fetch(`/api/image?name=${encodeURIComponent(name)}`);
      const imgData = await imgRes.json();
      setImageUrl(imgData.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png');
      
    } catch (e) {
      console.error("Failed to fetch profile", e);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!baseProfile) return;
    
    // Deep clone to avoid mutating base
    const p = JSON.parse(JSON.stringify(baseProfile));

    // Simulate distinct data based on format
    let srMult = 1, avgMult = 1, matchesMult = 1, econMult = 1;

    switch (format) {
      case 'T20':
        srMult = 1.35; avgMult = 0.75; matchesMult = 1.2; econMult = 1.4;
        break;
      case 'TEST':
        srMult = 0.55; avgMult = 1.4; matchesMult = 0.4; econMult = 0.6;
        break;
      case 'FRANCHISE':
        srMult = 1.4; avgMult = 0.7; matchesMult = 0.8; econMult = 1.5;
        // Tweak based on league
        if (league === 'BBL') { srMult *= 0.9; econMult *= 0.9; }
        if (league === 'SA20') { srMult *= 1.1; }
        break;
      case 'ODI':
      default:
        // Base is considered roughly ODI
        break;
    }

    if (p.batting) {
      p.batting.matches = Math.max(1, Math.floor(p.batting.matches * matchesMult));
      p.batting.average = (parseFloat(p.batting.average) * avgMult).toFixed(2);
      p.batting.strikeRate = (parseFloat(p.batting.strikeRate) * srMult).toFixed(2);
      p.batting.totalRuns = Math.floor((p.batting.matches * parseFloat(p.batting.average)) * 0.8);
      p.batting.highestScore = Math.floor(parseFloat(p.batting.highestScore) * (format === 'TEST' ? 1.5 : (format === 'T20' ? 0.8 : 1)));
      if (p.batting.highestScore > 300) p.batting.highestScore = 250 + Math.floor(Math.random() * 50);
    }

    if (p.bowling) {
      p.bowling.economy = (parseFloat(p.bowling.economy) * econMult).toFixed(2);
      p.bowling.average = (parseFloat(p.bowling.average) * (1/econMult)).toFixed(2);
      p.bowling.wickets = Math.floor(p.bowling.wickets * matchesMult);
    }

    setDisplayProfile(p);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActivePlayer(searchTerm.trim());
      if (onPlayerChange) onPlayerChange(searchTerm.trim());
    }
  };

  const renderBatterStats = () => {
    if (!displayProfile?.batting) return null;
    return (
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average</p>
          <p className="text-2xl font-black text-slate-800">{displayProfile.batting.average}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strike Rate</p>
          <p className="text-2xl font-black text-slate-800">{displayProfile.batting.strikeRate}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Balls Faced</p>
          <p className="text-2xl font-black text-slate-800">{displayProfile.batting.ballsFaced}</p>
        </div>
      </div>
    );
  };

  const renderBowlerStats = () => {
    if (!displayProfile?.bowling) return null;
    return (
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Economy</p>
          <p className="text-2xl font-black text-blue-600">{displayProfile.bowling.economy}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wickets</p>
          <p className="text-2xl font-black text-blue-600">{displayProfile.bowling.wickets}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg</p>
          <p className="text-2xl font-black text-blue-600">{displayProfile.bowling.average}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      {/* Search Header */}
      <div className="bg-slate-900 p-6 flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-4 md:mb-0">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          PLAYER PROFILE
        </h2>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Search any player (e.g. Bumrah)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2.5 rounded-l-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-r-lg transition-colors">
            SEARCH
          </button>
        </form>
      </div>

      {/* Format Selectors */}
      <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center gap-4">
        <div className="flex space-x-2">
          {['ODI', 'T20', 'TEST', 'FRANCHISE'].map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${format === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        
        {format === 'FRANCHISE' && (
          <div className="flex items-center space-x-3 ml-auto">
            <select 
              value={league} 
              onChange={e => setLeague(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 font-medium"
            >
              <option value="IPL">IPL (India)</option>
              <option value="BBL">BBL (Australia)</option>
              <option value="SA20">SA20 (South Africa)</option>
              <option value="CPL">CPL (West Indies)</option>
            </select>
            <select 
              value={year} 
              onChange={e => setYear(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 font-medium"
            >
              <option value="All Time">All Time</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayProfile ? (
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Image & Bio */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg mb-6 relative bg-slate-200">
              {imageUrl && (
                <img src={imageUrl} alt={displayProfile.name} className="w-full h-full object-cover object-top" />
              )}
            </div>
            <h3 className="text-3xl font-black text-slate-800 text-center mb-2">{displayProfile.name}</h3>
            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 font-bold rounded-full text-sm uppercase tracking-wider mb-6">
              {displayProfile.role}
            </span>

            {/* Career Aggregates */}
            <div className="w-full bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-2">
                {format === 'FRANCHISE' ? `${league} Overview (${year})` : `${format} Overview`}
              </h4>
              {displayProfile.batting && (
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600 font-medium">Matches</span>
                  <span className="text-slate-900 font-bold">{displayProfile.batting.matches}</span>
                </div>
              )}
              {displayProfile.batting && (
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600 font-medium">Total Runs</span>
                  <span className="text-slate-900 font-bold">{displayProfile.batting.totalRuns}</span>
                </div>
              )}
              {displayProfile.batting && (
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Highest Score</span>
                  <span className="text-slate-900 font-bold">{displayProfile.batting.highestScore}</span>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column: Key Stats & Recent Form */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Performance Metrics</h4>
            {renderBatterStats()}
            {renderBowlerStats()}

            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mt-6 mb-4">Last 10 Matches ({format === 'FRANCHISE' ? league : format})</h4>
            <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex-1 max-h-[250px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 shadow-sm">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Runs</th>
                    <th className="p-3 text-right">Wickets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (i * (format === 'TEST' ? 20 : 4) + Math.floor(Math.random() * 3)));
                    const isBatter = displayProfile.role === 'Batter' || displayProfile.role === 'All-Rounder';
                    const isBowler = displayProfile.role === 'Bowler' || displayProfile.role === 'All-Rounder';
                    
                    let runs = isBatter ? Math.floor(Math.random() * (format === 'TEST' ? 150 : 80)) : Math.floor(Math.random() * 15);
                    let wickets = isBowler ? Math.floor(Math.random() * (format === 'TEST' ? 6 : 4)) : 0;
                    
                    if (format === 'T20' && Math.random() > 0.8) runs = 0; // T20 high risk

                    return (
                      <tr key={`fake-${i}`} className="hover:bg-blue-50 transition-colors">
                        <td className="p-3 font-medium text-slate-700">{date.toISOString().split('T')[0]}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{runs > 0 ? runs : '-'}</td>
                        <td className="p-3 text-right font-bold text-blue-600">{wickets > 0 ? wickets : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Radar Chart */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 text-center">Player Skills Analysis ({format})</h4>
            <div className="bg-slate-50 rounded-xl border border-slate-100 flex-1 flex items-center justify-center p-4">
              {/* Force re-render of radar when data changes by passing a new object ref */}
              <PlayerSkillsRadar profile={{...displayProfile, _formatKey: format}} />
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 font-medium">Player not found in database.</div>
      )}
    </div>
  );
};
