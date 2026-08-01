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
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />,
        badgeClass: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
        indicatorClass: 'bg-amber-400',
      };
    }

    if (callState === 'reconnecting') {
      return {
        text: 'Reconnecting session...',
        icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />,
        badgeClass: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
        indicatorClass: 'bg-amber-400',
      };
    }

    if (callState === 'disconnected' || callState === 'error') {
      return {
        text: 'Disconnected',
        icon: <WifiOff className="w-3.5 h-3.5 text-rose-400" />,
        badgeClass: 'bg-rose-950/90 border-rose-800/60 text-rose-300',
        indicatorClass: 'bg-rose-500',
      };
    }

    // Call state is connected -> display active agent state in Golden theme
    switch (agentState) {
      case 'speaking':
        return {
          text: 'Speaking...',
          icon: <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
          badgeClass: 'bg-amber-950/90 border-amber-400/60 text-amber-200',
          indicatorClass: 'bg-amber-400 animate-ping',
        };
      case 'listening':
        return {
          text: 'Listening...',
          icon: <Radio className="w-3.5 h-3.5 text-yellow-400" />,
          badgeClass: 'bg-amber-950/90 border-yellow-500/50 text-yellow-200',
          indicatorClass: 'bg-yellow-400 animate-pulse',
        };
      case 'thinking':
        return {
          text: 'Thinking...',
          icon: <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />,
          badgeClass: 'bg-amber-950/90 border-amber-500/50 text-amber-300',
          indicatorClass: 'bg-amber-400',
        };
      default:
        return {
          text: 'Connected',
          icon: <Wifi className="w-3.5 h-3.5 text-amber-400" />,
          badgeClass: 'bg-amber-950/90 border-amber-400/50 text-amber-300',
          indicatorClass: 'bg-amber-400',
        };
    }
  };

  const status = getStatusTextAndStyle();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md transition-all duration-300 shadow-md ${status.badgeClass}`}
    >
      <span className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${status.indicatorClass}`} />
        {status.icon}
      </span>
      <span>{status.text}</span>
    </div>
  );
};
