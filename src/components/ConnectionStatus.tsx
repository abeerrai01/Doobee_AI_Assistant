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
        text: 'Connecting to BIS Saarthi...',
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />,
        badgeClass: 'bg-blue-50 border-blue-200 text-blue-800',
        indicatorClass: 'bg-blue-500',
      };
    }

    if (callState === 'reconnecting') {
      return {
        text: 'Reconnecting session...',
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />,
        badgeClass: 'bg-amber-50 border-amber-200 text-amber-800',
        indicatorClass: 'bg-amber-500',
      };
    }

    if (callState === 'disconnected' || callState === 'error') {
      return {
        text: 'Disconnected',
        icon: <WifiOff className="w-3.5 h-3.5 text-rose-600" />,
        badgeClass: 'bg-rose-50 border-rose-200 text-rose-800',
        indicatorClass: 'bg-rose-500',
      };
    }

    switch (agentState) {
      case 'speaking':
        return {
          text: 'BIS Saarthi Speaking...',
          icon: <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />,
          badgeClass: 'bg-blue-50 border-blue-200 text-blue-800',
          indicatorClass: 'bg-blue-500 animate-ping',
        };
      case 'listening':
        return {
          text: 'Listening...',
          icon: <Radio className="w-3.5 h-3.5 text-emerald-600" />,
          badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          indicatorClass: 'bg-emerald-500 animate-pulse',
        };
      case 'thinking':
        return {
          text: 'Thinking...',
          icon: <Loader2 className="w-3.5 h-3.5 text-slate-600 animate-spin" />,
          badgeClass: 'bg-slate-100 border-slate-300 text-slate-800',
          indicatorClass: 'bg-slate-500',
        };
      default:
        return {
          text: 'Connected',
          icon: <Wifi className="w-3.5 h-3.5 text-emerald-600" />,
          badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          indicatorClass: 'bg-emerald-500',
        };
    }
  };

  const status = getStatusTextAndStyle();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-xs ${status.badgeClass}`}
    >
      <span className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${status.indicatorClass}`} />
        {status.icon}
      </span>
      <span>{status.text}</span>
    </div>
  );
};
