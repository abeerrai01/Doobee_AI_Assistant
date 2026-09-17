import React from 'react';
import { formatDuration } from '../utils/formatters';
import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
  isConnected: boolean;
}

export const Timer: React.FC<TimerProps> = ({ seconds, isConnected }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs shadow-xs">
      <Clock className={`w-3.5 h-3.5 ${isConnected ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
      <span>{formatDuration(seconds)}</span>
    </div>
  );
};
