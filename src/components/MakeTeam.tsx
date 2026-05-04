'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import { Plus, Minus, X, Info, Shield, Target, Zap, Activity, Users, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface PlayerStats {
  matches: number;
  runs?: number;
  average?: number;
  strikeRate?: number;
  wickets?: number;
  economy?: number;
  bestBowling?: string;
  highestScore?: number;
}

interface PlayerDef {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder';
  subRole: string;
  speciality: string;
  stats: PlayerStats;
  imageUrl: string;
}

interface OpponentDef extends PlayerDef {
  advantage: string;
  howToWin: string;
  upperHand: string;
}

interface TalentDef extends PlayerDef {
  league: string;
  country: string;
  potential: string;
}

const MOCK_SQUAD: PlayerDef[] = [
  { id: 'p1', name: 'Rohit Sharma', role: 'Batsman', subRole: 'Opener - Aggressor', speciality: 'Exceptional against pace, lethal pull shot, high intent in powerplay.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 257, runs: 6628, average: 29.72, strikeRate: 131.14, highestScore: 118 } },
  { id: 'p2', name: 'Virat Kohli', role: 'Batsman', subRole: 'Top Order Anchor', speciality: 'Master of the chase, elite gap-finding, incredible fitness and running between the wickets.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 252, runs: 8004, average: 38.66, strikeRate: 131.97, highestScore: 113 } },
  { id: 'p3', name: 'Suryakumar Yadav', role: 'Batsman', subRole: 'Middle Order 360°', speciality: 'Unorthodox shot-making, attacks all areas of the field, dominant against spin.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 150, runs: 3594, average: 32.08, strikeRate: 145.32, highestScore: 103 } },
  { id: 'p4', name: 'Hardik Pandya', role: 'All-Rounder', subRole: 'Finisher / Pacer - Hit the Deck', speciality: 'Batting: Power hitting against spin and pace. Bowling: Fast, heavy ball with cross-seam variations.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 137, runs: 2525, average: 26.57, strikeRate: 146.03, wickets: 64, economy: 8.8, bestBowling: '3/17' } },
  { id: 'p5', name: 'Ravindra Jadeja', role: 'All-Rounder', subRole: 'Lower Order / Spinner - Left Arm Orthodox', speciality: 'Batting: Quick cameos. Bowling: Flat trajectory, attacks the stumps, unplayable on turning tracks. Field: Elite.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 240, runs: 2959, average: 27.4, strikeRate: 129.55, wickets: 160, economy: 7.66, bestBowling: '5/16' } },
  { id: 'p6', name: 'Jasprit Bumrah', role: 'Bowler', subRole: 'Pacer - Yorker / Death Over Specialist', speciality: 'Pinpoint yorkers, deceptive slower balls, brutal bouncers. Best death bowler in the world.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 133, wickets: 165, economy: 7.3, bestBowling: '5/10', average: 22.51 } },
  { id: 'p7', name: 'Kuldeep Yadav', role: 'Bowler', subRole: 'Spinner - Left Arm Wrist Spin', speciality: 'Sharp turn both ways, deceptive loop and dip.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 102, wickets: 172, economy: 5.01, bestBowling: '6/25', average: 25.82 } },
  { id: 'p8', name: 'Mohammed Shami', role: 'Bowler', subRole: 'Pacer - Seam Specialist', speciality: 'Perfect upright seam presentation, lethal reverse swing.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 101, wickets: 195, economy: 5.55, bestBowling: '7/57', average: 23.68 } },
  { id: 'p9', name: 'Rishabh Pant', role: 'Batsman', subRole: 'Wicketkeeper / Middle Order Aggressor', speciality: 'Fearless hitting against spin, reverse sweeps fast bowlers, incredible hand-eye coordination.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 111, runs: 3284, average: 34.61, strikeRate: 148.93, highestScore: 128 } },
  { id: 'p10', name: 'KL Rahul', role: 'Batsman', subRole: 'Top/Middle Order / Wicketkeeper', speciality: 'Technically sound, excellent against pace, versatile batting positions.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 75, runs: 2820, average: 49.15, strikeRate: 87.80, highestScore: 112 } },
  { id: 'p11', name: 'Arshdeep Singh', role: 'Bowler', subRole: 'Pacer - Left Arm Swing / Death', speciality: 'Swings the new ball, highly effective wide yorkers at the death.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 45, wickets: 62, economy: 8.35, bestBowling: '4/9', average: 19.5 } },
  // Substitutes below
  { id: 'p12', name: 'R Ashwin', role: 'Bowler', subRole: 'Spinner - Off Spinner / Carrom Ball', speciality: 'Tactical genius, lethal carrom ball, operates well in powerplay against left-handers.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 116, wickets: 156, economy: 4.94, bestBowling: '4/25', average: 33.20 } },
  { id: 'p13', name: 'Shubman Gill', role: 'Batsman', subRole: 'Opener - Anchor', speciality: 'Classical strokeplay, high consistency, elegant pull and cover drive.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 44, runs: 2271, average: 61.37, strikeRate: 103.46, highestScore: 208 } },
  { id: 'p14', name: 'Mohammed Siraj', role: 'Bowler', subRole: 'Pacer - Outswing / Aggressor', speciality: 'Scrambled seam variations, lethal outswing with the new ball, fiery pace.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 41, wickets: 68, economy: 5.18, bestBowling: '6/21', average: 22.79 } },
  { id: 'p15', name: 'Axar Patel', role: 'All-Rounder', subRole: 'Lower Order / Spinner - Left Arm Orthodox', speciality: 'Batting: Reliable lower-order hitting. Bowling: Accurate, non-turning dart balls.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 57, runs: 481, average: 20.04, strikeRate: 104.56, wickets: 60, economy: 4.54, bestBowling: '3/24' } },
  { id: 'p16', name: 'Yashasvi Jaiswal', role: 'Batsman', subRole: 'Opener - Aggressor', speciality: 'Explosive left-handed opener, dominance over spin.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 17, runs: 502, average: 33.46, strikeRate: 161.93, highestScore: 100 } }
];

const OPPONENT_SQUAD: OpponentDef[] = [
  { 
    id: 'o1', name: 'Travis Head', role: 'Batsman', subRole: 'Opener - Aggressor', 
    speciality: 'Brutal attack in powerplays, exceptional against short and wide deliveries.', 
    advantage: 'Scores very quickly upfront, unsettling the opening bowlers.',
    howToWin: 'Attack with high-pace inswingers or left-arm spin targeting the stumps.',
    upperHand: 'Our left-arm pace (Arshdeep) can exploit his weakness against inswinging deliveries early on.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', 
    stats: { matches: 65, runs: 2450, average: 40.83, strikeRate: 155.6, highestScore: 137 } 
  },
  { 
    id: 'o2', name: 'David Warner', role: 'Batsman', subRole: 'Top Order Aggressor', 
    speciality: 'Excellent runner, powerful square of the wicket, highly experienced.', 
    advantage: 'Can anchor and explode, knows Indian conditions well.',
    howToWin: 'Off-spin from around the wicket, forcing him to hit against the spin.',
    upperHand: 'Ashwin or Bumrah’s angle across the left-hander has proven effective historically.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', 
    stats: { matches: 161, runs: 6932, average: 45.3, strikeRate: 97.2, highestScore: 178 } 
  },
  { 
    id: 'o3', name: 'Glenn Maxwell', role: 'All-Rounder', subRole: 'Middle Order 360° / Spinner', 
    speciality: 'Switch hits, reverse sweeps, extreme strike rate against spin.', 
    advantage: 'Can single-handedly change the momentum of the game in 5 overs.',
    howToWin: 'Express pace, short-pitched bowling at the body, wide yorkers out of his reach.',
    upperHand: 'Bumrah’s yorkers and Shami’s bouncers are perfectly suited to counter his unorthodox style.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', 
    stats: { matches: 138, runs: 3895, average: 34.5, strikeRate: 125.7, wickets: 74, economy: 5.6 } 
  },
  { 
    id: 'o4', name: 'Pat Cummins', role: 'Bowler', subRole: 'Pacer - Hit the Deck / Leader', 
    speciality: 'Relentless hard lengths, excellent slow bouncer, high pressure creator.', 
    advantage: 'Extracts bounce from any surface, elite game awareness as captain.',
    howToWin: 'Play him out with minimal risk, attack other bowlers. Force him to bowl fuller lengths.',
    upperHand: 'Kohli and Rohit have strong records against back-of-a-length bowling on true pitches.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', 
    stats: { matches: 88, wickets: 141, economy: 5.3, bestBowling: '5/70', average: 28.6 } 
  },
  { 
    id: 'o5', name: 'Adam Zampa', role: 'Bowler', subRole: 'Spinner - Leg Spin', 
    speciality: 'Accurate wrong-uns, skiddy trajectory, targets the stumps.', 
    advantage: 'Wicket-taker in middle overs, very economical when batsmen try to sweep.',
    howToWin: 'Use feet to get to the pitch of the ball, play with straight bat down the ground.',
    upperHand: 'Our middle order (Pant, SKY) are excellent players of spin and can disrupt his length early.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', 
    stats: { matches: 99, wickets: 168, economy: 5.4, bestBowling: '4/8', average: 27.2 } 
  }
];

const SUGGESTED_TALENTS: TalentDef[] = [
  { id: 't1', name: 'Mayank Yadav', role: 'Bowler', subRole: 'Express Pacer (155kmph+)', speciality: 'Raw pace, unsettling bounce off a good length.', league: 'IPL', country: 'India', potential: 'Next generational fast bowler.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 5, wickets: 12, economy: 6.8, bestBowling: '3/14' } },
  { id: 't2', name: 'Will Smeed', role: 'Batsman', subRole: 'Top Order Power Hitter', speciality: 'Extreme bat speed, clearing boundaries effortlessly.', league: 'Vitality Blast', country: 'UK', potential: 'T20 franchise globetrotter.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 85, runs: 2150, average: 28.4, strikeRate: 148.5, highestScore: 118 } },
  { id: 't3', name: 'Jake Fraser-McGurk', role: 'Batsman', subRole: 'Top Order Aggressor', speciality: 'Fastest List-A century, fearless ball striking.', league: 'BBL / IPL', country: 'Australia', potential: 'Next David Warner.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 42, runs: 1120, average: 29.5, strikeRate: 165.2, highestScore: 125 } },
  { id: 't4', name: 'Dewald Brevis', role: 'Batsman', subRole: 'Middle Order 360°', speciality: '"Baby AB", clean striker, excellent against spin.', league: 'SA20 / IPL', country: 'South Africa', potential: 'Future all-format superstar.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 48, runs: 1205, average: 27.8, strikeRate: 145.6, highestScore: 162 } },
  { id: 't5', name: 'Shamar Joseph', role: 'Bowler', subRole: 'Pacer - Skiddy / Swing', speciality: 'Aggressive lines, rapid pace, great stamina.', league: 'CPL', country: 'West Indies', potential: 'Test & T20 strike bowler.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 15, wickets: 32, economy: 7.9, bestBowling: '7/68' } },
  { id: 't6', name: 'Noor Ahmad', role: 'Bowler', subRole: 'Spinner - Left Arm Wrist Spin', speciality: 'Unreadable googly, fast through the air.', league: 'Global T20s', country: 'Afghanistan', potential: 'Successor to Rashid Khan.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png', stats: { matches: 85, wickets: 95, economy: 7.1, bestBowling: '4/10' } }
];

export const MakeTeam: FC = () => {
  const [playingXI, setPlayingXI] = useState<PlayerDef[]>(MOCK_SQUAD.slice(0, 11));
  const [substitutes, setSubstitutes] = useState<PlayerDef[]>(MOCK_SQUAD.slice(11));
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDef | OpponentDef | TalentDef | null>(null);
  
  // Fluctuate Win % whenever XI changes or randomly every few seconds to simulate live modeling
  const [winPercent, setWinPercent] = useState<number>(65.4);
  
  useEffect(() => {
    // Base win percent calculation
    let base = 50;
    if (playingXI.length === 11) {
      const totalAvg = playingXI.reduce((acc, p) => acc + (p.stats.average || 20), 0) / 11;
      const totalSR = playingXI.reduce((acc, p) => acc + (p.stats.strikeRate || 100), 0) / 11;
      base = (totalAvg * 0.4) + (totalSR * 0.3);
      base = Math.min(Math.max(base, 40), 85); // Clamp between 40 and 85
    } else {
      base = 30 + (playingXI.length * 3);
    }
    
    setWinPercent(base);
    
    // Simulate live fluctuation
    const interval = setInterval(() => {
      setWinPercent(prev => {
        const fluctuation = (Math.random() * 2 - 1); // -1 to +1
        return Math.min(Math.max(prev + fluctuation, 10), 99);
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [playingXI]);

  const moveToSubs = (player: PlayerDef) => {
    setPlayingXI(prev => prev.filter(p => p.id !== player.id));
    setSubstitutes(prev => [...prev, player]);
  };

  const moveToXI = (player: PlayerDef) => {
    if (playingXI.length >= 11) {
      alert("You can only have 11 players in your Playing XI. Please remove a player first.");
      return;
    }
    setSubstitutes(prev => prev.filter(p => p.id !== player.id));
    setPlayingXI(prev => [...prev, player]);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Batsman': return <Target className="w-4 h-4 text-emerald-500" />;
      case 'Bowler': return <Activity className="w-4 h-4 text-rose-500" />;
      case 'All-Rounder': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Shield className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Bowler': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'All-Rounder': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const renderPlayerCard = (player: PlayerDef, isXI: boolean, isOpponent = false, isTalent = false) => {
    const p = player as any;
    return (
      <div key={player.id} className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all relative group
        ${isOpponent ? 'border-red-200 hover:border-red-400' : ''}
        ${isTalent ? 'border-blue-200 hover:border-blue-400' : ''}
      `}>
        {/* Action Button (Only for our squad) */}
        {!isOpponent && !isTalent && (
          <button 
            onClick={() => isXI ? moveToSubs(player) : moveToXI(player)}
            className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm
              ${isXI ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            title={isXI ? "Remove to Substitutes" : "Add to Playing XI"}
          >
            {isXI ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
  
        <div className="flex items-center space-x-4 mb-3 cursor-pointer pr-10" onClick={() => setSelectedPlayer(player)}>
          <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex-shrink-0 relative">
            <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
            {isTalent && <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-pulse pointer-events-none"></div>}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{player.name}</h3>
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-1 ${getRoleColor(player.role)}`}>
              {getRoleIcon(player.role)}
              <span>{player.role}</span>
            </span>
          </div>
        </div>
        
        <div className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <span className="font-semibold text-slate-800">{isTalent ? 'Profile:' : 'Role:'}</span> {player.subRole}
          {isTalent && p.country && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">{p.country}</span>}
        </div>
        
        <button 
          onClick={() => setSelectedPlayer(player)}
          className="w-full mt-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 rounded-lg flex items-center justify-center space-x-1 transition-colors"
        >
          <Info className="w-3 h-3" />
          <span>{isOpponent ? 'View Threat Analysis' : 'View Full Profile'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[800px]">
      
      {/* Header */}
      <div className="px-8 py-6 bg-slate-900 border-b border-slate-800 flex justify-between items-center relative overflow-hidden flex-wrap gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <span>SQUAD & MATCHUP BUILDER</span>
          </h2>
          <p className="text-slate-400 mt-1 font-medium">Build your XI, analyze opponents, and scout global talent.</p>
        </div>
        
        {/* Win Probability Metric */}
        <div className="relative z-10 flex items-center space-x-6 bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <TrendingUp className={`w-5 h-5 ${winPercent > 50 ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block">Live Win Prob</span>
              <span className={`text-2xl font-black transition-colors duration-500 ${winPercent >= 60 ? 'text-emerald-400' : winPercent >= 45 ? 'text-amber-400' : 'text-rose-400'}`}>
                {winPercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-700"></div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">XI Count</span>
            <span className={`text-2xl font-black ${playingXI.length === 11 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {playingXI.length}<span className="text-slate-500 text-lg">/11</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row flex-1 p-6 gap-6 relative z-10">
        
        {/* Left Column: Our Squad (XI + Subs) */}
        <div className="w-full xl:w-1/2 flex flex-col gap-6">
          {/* Playing XI */}
          <div className="flex flex-col bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Current Playing XI (India)
            </h3>
            {playingXI.length === 0 ? (
              <div className="flex-1 p-8 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                Add players from the substitutes list.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {playingXI.map(p => renderPlayerCard(p, true))}
              </div>
            )}
          </div>

          {/* Substitutes */}
          <div className="flex flex-col bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-slate-500 mr-2"></span>
              Available Bench
            </h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
              {substitutes.length === 0 ? (
                <div className="p-8 w-full text-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                  No substitutes available.
                </div>
              ) : (
                substitutes.map(p => (
                  <div key={p.id} className="w-64 flex-shrink-0">
                    {renderPlayerCard(p, false)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Opponent & Scouting */}
        <div className="w-full xl:w-1/2 flex flex-col gap-6">
          {/* Opponent Analysis */}
          <div className="flex flex-col bg-slate-800/50 rounded-2xl p-6 border border-red-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center text-red-400">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Opponent Threat Analysis (Australia)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {OPPONENT_SQUAD.map(p => renderPlayerCard(p, false, true, false))}
            </div>
          </div>

          {/* Young Talents Scouting */}
          <div className="flex flex-col bg-slate-800/50 rounded-2xl p-6 border border-blue-900/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center text-blue-400">
              <Lightbulb className="w-5 h-5 mr-2" />
              Global Scouting / Domestic Talents
            </h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
              {SUGGESTED_TALENTS.map(p => (
                <div key={p.id} className="w-64 flex-shrink-0">
                  {renderPlayerCard(p, false, false, true)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Overlay for Full Stats */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Modal Header Cover */}
            <div className={`h-32 relative shrink-0 ${(selectedPlayer as OpponentDef).advantage ? 'bg-gradient-to-r from-red-900 to-rose-800' : (selectedPlayer as TalentDef).league ? 'bg-gradient-to-r from-blue-900 to-cyan-800' : 'bg-gradient-to-r from-blue-900 to-indigo-800'}`}>
              <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-white p-1 shadow-lg transform rotate-3">
                <img src={selectedPlayer.imageUrl} alt={selectedPlayer.name} className="w-full h-full rounded-xl object-cover" />
              </div>
            </div>

            <div className="pt-16 pb-8 px-8 overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                  {selectedPlayer.name}
                  {(selectedPlayer as TalentDef).country && (
                    <span className="ml-4 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded border border-slate-200">
                      {(selectedPlayer as TalentDef).country}
                    </span>
                  )}
                </h2>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleColor(selectedPlayer.role)}`}>
                    {getRoleIcon(selectedPlayer.role)}
                    <span>{selectedPlayer.role}</span>
                  </span>
                  <span className="text-slate-500 font-medium ml-3 text-sm">{selectedPlayer.subRole}</span>
                  {(selectedPlayer as TalentDef).league && (
                    <span className="text-blue-600 font-bold ml-3 text-sm flex items-center before:content-['•'] before:mr-2 before:text-slate-300">
                      League: {(selectedPlayer as TalentDef).league}
                    </span>
                  )}
                </div>
              </div>

              {/* Opponent Specific Data */}
              {(selectedPlayer as OpponentDef).advantage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-2 flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/> Their Advantage</h4>
                    <p className="text-red-900/80 leading-relaxed text-sm">{(selectedPlayer as OpponentDef).advantage}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center"><Target className="w-4 h-4 mr-2"/> How to win</h4>
                    <p className="text-emerald-900/80 leading-relaxed text-sm">{(selectedPlayer as OpponentDef).howToWin}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 md:col-span-2">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center"><Shield className="w-4 h-4 mr-2"/> Our Upper Hand</h4>
                    <p className="text-blue-900/80 leading-relaxed text-sm">{(selectedPlayer as OpponentDef).upperHand}</p>
                  </div>
                </div>
              )}

              {/* Talent Specific Data */}
              {(selectedPlayer as TalentDef).potential && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5 mb-8 flex items-start space-x-4">
                   <div className="bg-cyan-100 p-2 rounded-xl text-cyan-600 mt-1">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cyan-900 uppercase tracking-widest mb-1">Scouting Potential</h4>
                    <p className="text-cyan-800/80 leading-relaxed text-sm">{(selectedPlayer as TalentDef).potential}</p>
                  </div>
                </div>
              )}

              {/* General Speciality */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8 flex items-start space-x-4">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 mt-1">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-1">Unique Talent / Speciality</h4>
                  <p className="text-indigo-800/80 leading-relaxed text-sm">{selectedPlayer.speciality}</p>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Career Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase">Matches</p>
                    <p className="text-2xl font-black text-slate-800">{selectedPlayer.stats.matches}</p>
                  </div>
                  
                  {selectedPlayer.stats.runs !== undefined && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Total Runs</p>
                      <p className="text-2xl font-black text-slate-800">{selectedPlayer.stats.runs}</p>
                    </div>
                  )}
                  {selectedPlayer.stats.average !== undefined && selectedPlayer.role !== 'Bowler' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Bat Avg</p>
                      <p className="text-2xl font-black text-slate-800">{selectedPlayer.stats.average}</p>
                    </div>
                  )}
                  {selectedPlayer.stats.strikeRate !== undefined && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Strike Rate</p>
                      <p className="text-2xl font-black text-slate-800">{selectedPlayer.stats.strikeRate}</p>
                    </div>
                  )}

                  {selectedPlayer.stats.wickets !== undefined && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Wickets</p>
                      <p className="text-2xl font-black text-blue-600">{selectedPlayer.stats.wickets}</p>
                    </div>
                  )}
                  {selectedPlayer.stats.economy !== undefined && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Economy</p>
                      <p className="text-2xl font-black text-blue-600">{selectedPlayer.stats.economy}</p>
                    </div>
                  )}
                  {selectedPlayer.stats.bestBowling && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Best Bowl</p>
                      <p className="text-2xl font-black text-blue-600">{selectedPlayer.stats.bestBowling}</p>
                    </div>
                  )}
                  {selectedPlayer.role === 'Bowler' && selectedPlayer.stats.average !== undefined && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase">Bowl Avg</p>
                      <p className="text-2xl font-black text-blue-600">{selectedPlayer.stats.average}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
