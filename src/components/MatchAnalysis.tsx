import { FC } from 'react';
import { CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

export const MatchAnalysis: FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 tracking-tight">Match Conditions Analysis</h2>
      
      <div className="grid grid-cols-2 gap-4 flex-grow">
        <div className="bg-slate-50 p-4 rounded-xl flex items-start space-x-4 border border-slate-100">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Temperature</p>
            <p className="text-lg font-semibold text-slate-800">28°C</p>
            <p className="text-xs text-slate-400 mt-1">Optimal for batting</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl flex items-start space-x-4 border border-slate-100">
          <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Precipitation</p>
            <p className="text-lg font-semibold text-slate-800">0%</p>
            <p className="text-xs text-slate-400 mt-1">Clear skies expected</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl flex items-start space-x-4 border border-slate-100">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Dew Factor</p>
            <p className="text-lg font-semibold text-slate-800">High (2nd Inn)</p>
            <p className="text-xs text-slate-400 mt-1">Bowlers will struggle</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl flex items-start space-x-4 border border-slate-100">
          <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pitch Surface</p>
            <p className="text-lg font-semibold text-slate-800">Dry & Dusty</p>
            <p className="text-xs text-slate-400 mt-1">Supports spin early on</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-800 text-white p-4 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-300">Predicted Par Score</p>
          <p className="text-2xl font-bold">185 - 195</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-300">Win Probability (Bat 1st)</p>
          <p className="text-2xl font-bold text-emerald-400">42%</p>
        </div>
      </div>
    </div>
  );
};
