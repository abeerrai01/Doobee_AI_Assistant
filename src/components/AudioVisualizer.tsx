import React from 'react';
import { motion } from 'framer-motion';
import { AgentState } from '../types';

interface AudioVisualizerProps {
  agentState: AgentState;
  audioLevel?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  agentState,
  audioLevel = 0.2,
}) => {
  const barsCount = 28;

  const getBarColor = (index: number) => {
    if (agentState === 'speaking') {
      return index % 2 === 0 ? 'bg-blue-600' : 'bg-sky-500';
    }
    if (agentState === 'listening') {
      return index % 2 === 0 ? 'bg-emerald-500' : 'bg-teal-500';
    }
    if (agentState === 'thinking') {
      return index % 2 === 0 ? 'bg-slate-400' : 'bg-slate-500';
    }
    return 'bg-slate-200';
  };

  return (
    <div className="w-full max-w-sm h-12 my-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-1 shadow-xs">
      {Array.from({ length: barsCount }).map((_, i) => {
        const centerDistance = Math.abs(i - barsCount / 2) / (barsCount / 2);
        const heightFactor = Math.max(0.15, 1 - centerDistance * 0.6);
        
        let minHeight = 4;
        let maxHeight = 34 * heightFactor;

        if (agentState === 'speaking') {
          maxHeight = (28 + Math.sin(i + Date.now() * 0.01) * 12) * heightFactor * Math.max(0.4, audioLevel * 1.5);
          minHeight = 5;
        } else if (agentState === 'listening') {
          maxHeight = (22 + Math.cos(i * 0.8) * 10) * heightFactor * Math.max(0.3, audioLevel * 1.3);
          minHeight = 4;
        } else if (agentState === 'thinking') {
          maxHeight = (10 + Math.sin(i * 0.5 + Date.now() * 0.005) * 6) * heightFactor;
          minHeight = 4;
        } else {
          maxHeight = 6;
          minHeight = 3;
        }

        return (
          <motion.div
            key={i}
            className={`w-1.5 rounded-full transition-colors duration-300 ${getBarColor(i)}`}
            animate={{
              height: [minHeight, Math.max(minHeight, maxHeight), minHeight],
            }}
            transition={{
              duration: agentState === 'speaking' ? 0.4 + (i % 3) * 0.1 : agentState === 'listening' ? 0.5 + (i % 4) * 0.1 : 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i % 5) * 0.05,
            }}
          />
        );
      })}
    </div>
  );
};
