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
  // Number of visualizer bars
  const barsCount = 28;

  const getBarColor = (index: number) => {
    if (agentState === 'speaking') {
      return index % 2 === 0 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]';
    }
    if (agentState === 'listening') {
      return index % 2 === 0 ? 'bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.7)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]';
    }
    if (agentState === 'thinking') {
      return index % 2 === 0 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]' : 'bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.7)]';
    }
    return 'bg-amber-900/40';
  };

  return (
    <div className="w-full max-w-sm h-14 my-2 px-4 py-2 rounded-2xl bg-amber-950/40 border border-amber-500/40 backdrop-blur-xl flex items-center justify-between gap-1 shadow-inner">
      {Array.from({ length: barsCount }).map((_, i) => {
        // Calculate heights dynamically based on audio level & bar position
        const centerDistance = Math.abs(i - barsCount / 2) / (barsCount / 2);
        const heightFactor = Math.max(0.15, 1 - centerDistance * 0.6);
        
        let minHeight = 4;
        let maxHeight = 40 * heightFactor;

        if (agentState === 'speaking') {
          maxHeight = (30 + Math.sin(i + Date.now() * 0.01) * 15) * heightFactor * Math.max(0.4, audioLevel * 1.5);
          minHeight = 6;
        } else if (agentState === 'listening') {
          maxHeight = (25 + Math.cos(i * 0.8) * 12) * heightFactor * Math.max(0.3, audioLevel * 1.3);
          minHeight = 5;
        } else if (agentState === 'thinking') {
          maxHeight = (12 + Math.sin(i * 0.5 + Date.now() * 0.005) * 8) * heightFactor;
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
