import React from 'react';
import { CallState, AgentState } from '../types';
import { Wifi, WifiOff, Loader2, Radio } from 'lucide-react';

interface ConnectionStatusProps {
  callState: CallState;
  agentState: AgentState;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  callState,
  agentState,
}) => {
  const getStatusTextAndStyle = () => {
    if (callState === 'connecting') {
      return {
        text: 'Connecting to Doobee AI...',
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />,
        badgeClass: 'bg-blue-950/80 border-blue-800/60 text-blue-300',
        indicatorClass: 'bg-blue-400',
      };
    }

    if (callState === 'reconnecting') {
      return {
        text: 'Reconnecting session...',
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />,
        badgeClass: 'bg-amber-950/80 border-amber-800/60 text-amber-300',
        indicatorClass: 'bg-amber-400',
      };
    }

    if (callState === 'disconnected' || callState === 'error') {
      return {
        text: 'Disconnected',
        icon: <WifiOff className="w-3.5 h-3.5 text-rose-400" />,
        badgeClass: 'bg-rose-950/80 border-rose-800/60 text-rose-300',
        indicatorClass: 'bg-rose-500',
      };
    }

    // Call state is connected -> display active agent state
    switch (agentState) {
      case 'speaking':
        return {
          text: 'Speaking...',
          icon: <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />,
          badgeClass: 'bg-blue-900/60 border-blue-500/40 text-blue-200',
          indicatorClass: 'bg-blue-400 animate-ping',
        };
      case 'listening':
        return {
          text: 'Listening...',
          icon: <Radio className="w-3.5 h-3.5 text-emerald-400" />,
          badgeClass: 'bg-emerald-900/60 border-emerald-500/40 text-emerald-200',
          indicatorClass: 'bg-emerald-400 animate-pulse',
        };
      case 'thinking':
        return {
          text: 'Thinking...',
          icon: <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />,
          badgeClass: 'bg-purple-900/60 border-purple-500/40 text-purple-200',
          indicatorClass: 'bg-purple-400',
        };
      default:
        return {
          text: 'Connected',
          icon: <Wifi className="w-3.5 h-3.5 text-emerald-400" />,
          badgeClass: 'bg-slate-900/80 border-emerald-500/30 text-emerald-300',
          indicatorClass: 'bg-emerald-400',
        };
    }
  };

  const status = getStatusTextAndStyle();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-sm ${status.badgeClass}`}
    >
      <span className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${status.indicatorClass}`} />
        {status.icon}
      </span>
      <span>{status.text}</span>
    </div>
  );
};
