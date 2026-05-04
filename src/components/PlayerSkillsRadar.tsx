'use client';

import { FC, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PlayerSkillsRadarProps {
  profile: any;
}

export const PlayerSkillsRadar: FC<PlayerSkillsRadarProps> = ({ profile }) => {
  const data = useMemo(() => {
    if (!profile) return [];

    const isBowler = profile.role === 'Bowler';
    
    // Authentically derive skills from stats (Normalized 0-100)
    
    if (isBowler && profile.bowling) {
      // Bowler Skills
      const economy = parseFloat(profile.bowling.economy);
      const strikeRate = parseFloat(profile.bowling.strikeRate);
      const average = parseFloat(profile.bowling.average);
      
      return [
        { subject: 'Economy Rate', A: Math.max(10, 100 - (economy * 8)), fullMark: 100 }, // Lower economy is better
        { subject: 'Wicket Taking', A: Math.max(10, 100 - (strikeRate * 3)), fullMark: 100 }, // Lower SR is better
        { subject: 'Consistency', A: Math.max(10, 100 - (average * 2)), fullMark: 100 },
        { subject: 'Pace Variation', A: 85, fullMark: 100 }, // Approximate based on typical pace
        { subject: 'Death Overs', A: economy < 8 ? 90 : 60, fullMark: 100 },
      ];
    } else {
      // Batter Skills
      const strikeRate = parseFloat(profile.batting?.strikeRate || '100');
      const average = parseFloat(profile.batting?.average || '30');
      const hundreds = parseInt(profile.batting?.hundreds || '0');
      
      // Calculate from recent matches if available
      let boundaryFreq = 50;
      let consistency = average > 40 ? 90 : (average > 30 ? 70 : 50);
      
      return [
        { subject: 'Aggression (SR)', A: Math.min(100, strikeRate * 0.7), fullMark: 100 },
        { subject: 'Consistency (Avg)', A: Math.min(100, average * 2), fullMark: 100 },
        { subject: 'Wicket Retention', A: Math.min(100, average * 1.5), fullMark: 100 },
        { subject: 'Pace Play', A: Math.min(100, strikeRate * 0.75), fullMark: 100 }, // Approx
        { subject: 'Spin Play', A: Math.min(100, average * 2.2), fullMark: 100 }, // Approx
        { subject: 'Big Innings', A: Math.min(100, 40 + (hundreds * 10)), fullMark: 100 },
      ];
    }
  }, [profile]);

  if (!data.length) return null;

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Player Skills"
            dataKey="A"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.5}
            isAnimationActive={true}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }}
            itemStyle={{ color: '#60a5fa' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
