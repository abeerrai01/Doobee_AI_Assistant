import React from 'react';
import { motion } from 'framer-motion';
import { AgentState } from '../types';
import { Bot, Sparkles, Mic } from 'lucide-react';

interface AvatarProps {
  agentState: AgentState;
  audioLevel?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ agentState, audioLevel = 0.3 }) => {
  // State specific colors & animations
  const getStateConfig = () => {
    switch (agentState) {
      case 'speaking':
        return {
          glowColor: 'rgba(37, 99, 235, 0.7)',
          ringColor: 'border-blue-500',
          badgeText: 'Doobee Speaking',
          accentGradient: 'from-blue-600 via-sky-500 to-teal-400',
          iconColor: 'text-blue-200',
        };
      case 'listening':
        return {
          glowColor: 'rgba(16, 185, 129, 0.7)',
          ringColor: 'border-emerald-500',
          badgeText: 'Listening to You',
          accentGradient: 'from-emerald-600 via-teal-500 to-cyan-400',
          iconColor: 'text-emerald-200',
        };
      case 'thinking':
        return {
          glowColor: 'rgba(147, 51, 234, 0.7)',
          ringColor: 'border-purple-500',
          badgeText: 'Doobee Thinking...',
          accentGradient: 'from-purple-600 via-indigo-500 to-sky-400',
          iconColor: 'text-purple-200',
        };
      default:
        return {
          glowColor: 'rgba(30, 41, 59, 0.4)',
          ringColor: 'border-slate-700',
          badgeText: 'Doobee Ready',
          accentGradient: 'from-slate-700 via-blue-900 to-slate-800',
          iconColor: 'text-slate-400',
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
        className="absolute w-44 h-44 rounded-full border border-white/10 pointer-events-none"
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
        className={`absolute w-56 h-56 rounded-full border ${config.ringColor} opacity-20 pointer-events-none`}
      />

      {/* Main Avatar Circle */}
      <motion.div
        animate={{ scale: scaleEffect }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-blue-600 via-sky-400 to-teal-400 shadow-2xl z-10"
      >
        <div className="w-full h-full rounded-full bg-[#090d16] flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Inner Animated Gradient Background */}
          <div
            className={`absolute inset-0 opacity-30 bg-gradient-to-br ${config.accentGradient} blur-md transition-all duration-500`}
          />

          {/* Doobee Futuristic Logo / Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/40 to-sky-400/40 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Bot className={`w-9 h-9 ${config.iconColor} drop-shadow-md`} />
            </div>
            
            <div className="flex items-center gap-1 mt-2">
              <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
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
                  className="w-1 bg-sky-400 rounded-full"
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
        className="mt-4 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex items-center gap-2 shadow-lg"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            agentState === 'speaking'
              ? 'bg-blue-400 animate-ping'
              : agentState === 'listening'
              ? 'bg-emerald-400 animate-pulse'
              : agentState === 'thinking'
              ? 'bg-purple-400 animate-spin'
              : 'bg-slate-500'
          }`}
        />
        <span className="text-xs font-medium text-slate-300">
          {config.badgeText}
        </span>
      </motion.div>
    </div>
  );
};
