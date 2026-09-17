import React from 'react';
import { motion } from 'framer-motion';
import { AgentState } from '../types';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface AvatarProps {
  agentState: AgentState;
  audioLevel?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ agentState, audioLevel = 0.3 }) => {
  const getStateConfig = () => {
    switch (agentState) {
      case 'speaking':
        return {
          glowColor: 'rgba(37, 99, 235, 0.4)',
          ringColor: 'border-blue-400',
          badgeText: 'BIS Saarthi Speaking',
          accentGradient: 'from-blue-600 via-sky-500 to-indigo-600',
          iconColor: 'text-blue-600',
        };
      case 'listening':
        return {
          glowColor: 'rgba(16, 185, 129, 0.35)',
          ringColor: 'border-emerald-400',
          badgeText: 'Listening to You',
          accentGradient: 'from-emerald-500 via-teal-400 to-blue-500',
          iconColor: 'text-emerald-600',
        };
      case 'thinking':
        return {
          glowColor: 'rgba(100, 116, 139, 0.3)',
          ringColor: 'border-slate-400',
          badgeText: 'Checking Standards...',
          accentGradient: 'from-slate-600 via-slate-500 to-blue-500',
          iconColor: 'text-slate-600',
        };
      default:
        return {
          glowColor: 'rgba(148, 163, 184, 0.2)',
          ringColor: 'border-slate-300',
          badgeText: 'BIS Saarthi Ready',
          accentGradient: 'from-slate-700 via-blue-800 to-slate-900',
          iconColor: 'text-blue-700',
        };
    }
  };

  const config = getStateConfig();
  const scaleEffect = 1 + audioLevel * 0.15;

  return (
    <div className="relative flex flex-col items-center justify-center my-4">
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
          boxShadow: `0 0 50px 15px ${config.glowColor}`,
        }}
        className="absolute w-40 h-40 rounded-full border border-blue-200 pointer-events-none"
      />

      {/* Main Avatar Circle */}
      <motion.div
        animate={{ scale: scaleEffect }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-600 shadow-xl z-10"
      >
        <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center relative overflow-hidden group border border-slate-100">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
              <ShieldCheck className={`w-8 h-8 ${config.iconColor}`} />
            </div>
            
            <div className="flex items-center gap-1 mt-1.5">
              <Sparkles className="w-2.5 h-2.5 text-blue-600" />
              <span className="text-[9px] font-extrabold tracking-widest text-slate-800 uppercase">
                BIS SAARTHI
              </span>
            </div>
          </div>

          {/* Active Speaking / Listening Wave Indicator */}
          {agentState === 'speaking' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-1.5 flex gap-1 items-end h-2.5"
            >
              {[0.4, 0.8, 0.5, 0.9, 0.3].map((val, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['3px', '10px', '3px'] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="w-1 bg-blue-600 rounded-full"
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
        className="mt-3 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs flex items-center gap-1.5"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            agentState === 'speaking'
              ? 'bg-blue-600 animate-ping'
              : agentState === 'listening'
              ? 'bg-emerald-500 animate-pulse'
              : agentState === 'thinking'
              ? 'bg-slate-500 animate-spin'
              : 'bg-blue-600'
          }`}
        />
        <span className="text-xs font-semibold text-slate-700">
          {config.badgeText}
        </span>
      </motion.div>
    </div>
  );
};
