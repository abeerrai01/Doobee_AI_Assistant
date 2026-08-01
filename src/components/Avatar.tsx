import React from 'react';
import { motion } from 'framer-motion';
import { AgentState } from '../types';
import { Bot, Sparkles } from 'lucide-react';

interface AvatarProps {
  agentState: AgentState;
  audioLevel?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ agentState, audioLevel = 0.3 }) => {
  // State specific colors & animations in Golden Theme
  const getStateConfig = () => {
    switch (agentState) {
      case 'speaking':
        return {
          glowColor: 'rgba(245, 158, 11, 0.8)',
          ringColor: 'border-amber-400',
          badgeText: 'Doobee Speaking',
          accentGradient: 'from-amber-500 via-yellow-400 to-amber-600',
          iconColor: 'text-amber-300',
        };
      case 'listening':
        return {
          glowColor: 'rgba(252, 211, 77, 0.7)',
          ringColor: 'border-yellow-400',
          badgeText: 'Listening to You',
          accentGradient: 'from-yellow-500 via-amber-400 to-amber-600',
          iconColor: 'text-yellow-200',
        };
      case 'thinking':
        return {
          glowColor: 'rgba(217, 119, 6, 0.7)',
          ringColor: 'border-amber-500',
          badgeText: 'Doobee Thinking...',
          accentGradient: 'from-amber-600 via-amber-500 to-yellow-500',
          iconColor: 'text-amber-200',
        };
      default:
        return {
          glowColor: 'rgba(180, 83, 9, 0.4)',
          ringColor: 'border-amber-800',
          badgeText: 'Doobee Ready',
          accentGradient: 'from-amber-950 via-yellow-950 to-amber-900',
          iconColor: 'text-amber-400/80',
        };
    }
  };

  const config = getStateConfig();
  const scaleEffect = 1 + audioLevel * 0.15;

  return (
    <div className="relative flex flex-col items-center justify-center my-6">
      {/* Outer Pulse Rings */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: agentState === 'speaking' ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          boxShadow: `0 0 60px 20px ${config.glowColor}`,
        }}
        className="absolute w-44 h-44 rounded-full border border-amber-400/20 pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.1, 1.35, 1.1],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: agentState === 'speaking' ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className={`absolute w-56 h-56 rounded-full border ${config.ringColor} opacity-30 pointer-events-none`}
      />

      {/* Main Avatar Circle */}
      <motion.div
        animate={{ scale: scaleEffect }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-2xl z-10"
      >
        <div className="w-full h-full rounded-full bg-[#0f0b01] flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Inner Animated Gradient Background */}
          <div
            className={`absolute inset-0 opacity-40 bg-gradient-to-br ${config.accentGradient} blur-md transition-all duration-500`}
          />

          {/* Doobee Futuristic Logo / Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-900/40 border border-amber-400/50 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Bot className={`w-9 h-9 ${config.iconColor} drop-shadow-md`} />
            </div>
            
            <div className="flex items-center gap-1 mt-2">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-widest text-amber-300 uppercase">
                DOOBEE AI
              </span>
            </div>
          </div>

          {/* Active Speaking / Listening Wave Indicator */}
          {agentState === 'speaking' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-2 flex gap-1 items-end h-3"
            >
              {[0.4, 0.8, 0.5, 0.9, 0.3].map((val, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['4px', '14px', '4px'] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="w-1 bg-amber-400 rounded-full"
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* State Label Pill */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-4 px-3.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/50 backdrop-blur-md flex items-center gap-2 shadow-lg"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            agentState === 'speaking'
              ? 'bg-amber-400 animate-ping'
              : agentState === 'listening'
              ? 'bg-yellow-400 animate-pulse'
              : agentState === 'thinking'
              ? 'bg-amber-500 animate-spin'
              : 'bg-amber-600'
          }`}
        />
        <span className="text-xs font-bold text-amber-200">
          {config.badgeText}
        </span>
      </motion.div>
    </div>
  );
};
