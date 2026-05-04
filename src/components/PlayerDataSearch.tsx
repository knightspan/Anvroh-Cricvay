'use client';

import { FC, useState, useEffect } from 'react';
import { Search, UserCircle, Trophy, Activity } from 'lucide-react';

interface PlayerStat {
  name: string;
  matches: number;
  totalRuns: number;
  timesOut: number;
  ballsFaced: number;
  highestScore: number;
  fifties: number;
  hundreds: number;
  average: string | number;
  strikeRate: string | number;
}

export const PlayerDataSearch: FC = () => {
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState<PlayerStat[]>([]);
  
  useEffect(() => {
    fetch('/player_stats.json')
      .then(res => res.json())
      .then(json => setStats(json))
      .catch(err => console.error(err));
  }, []);

  const defaultPlayers = ['V Kohli', 'JE Root', 'SPD Smith'];
  
  // If search is active, show matches. Otherwise show defaults.
  const displayedPlayers = query.trim() !== ''
    ? stats.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : stats.filter(p => defaultPlayers.includes(p.name));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-fuchsia-100 p-2 rounded-lg text-fuchsia-600">
            <UserCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Player Intelligence Database</h2>
        </div>
        
        <div className="relative w-72">
          <input 
            type="text" 
            placeholder="Search any player..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="flex-grow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold">Player</th>
              <th className="px-4 py-3 font-semibold">Matches</th>
              <th className="px-4 py-3 font-semibold">Runs</th>
              <th className="px-4 py-3 font-semibold">Avg</th>
              <th className="px-4 py-3 font-semibold">SR</th>
              <th className="px-4 py-3 font-semibold">HS</th>
              <th className="px-4 py-3 font-semibold">50s/100s</th>
            </tr>
          </thead>
          <tbody>
            {displayedPlayers.length > 0 ? displayedPlayers.map((player) => (
              <tr key={player.name} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-800 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-slate-200 mr-3 flex items-center justify-center text-xs text-slate-500">
                    {player.name.charAt(0)}
                  </div>
                  {player.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{player.matches}</td>
                <td className="px-4 py-3 font-semibold text-slate-700">{player.totalRuns}</td>
                <td className="px-4 py-3 text-emerald-600 font-medium">{player.average}</td>
                <td className="px-4 py-3 text-blue-600 font-medium">{player.strikeRate}</td>
                <td className="px-4 py-3 text-slate-600">{player.highestScore}</td>
                <td className="px-4 py-3 text-slate-600">{player.fifties} / {player.hundreds}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No players found matching "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
