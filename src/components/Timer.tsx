import React from 'react';
import { formatDuration } from '../utils/formatters';
import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
  isConnected: boolean;
}

export const Timer: React.FC<TimerProps> = ({ seconds, isConnected }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 font-mono text-xs shadow-inner">
      <Clock className={`w-3.5 h-3.5 ${isConnected ? 'text-blue-400 animate-pulse' : 'text-slate-500'}`} />
      <span>{formatDuration(seconds)}</span>
    </div>
  );
};
