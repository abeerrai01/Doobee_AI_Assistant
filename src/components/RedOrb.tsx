import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentState, CallState } from '../types';

interface RedOrbProps {
  agentState: AgentState;
  callState: CallState;
  audioLevel?: number;
  onClick?: () => void;
  tapCount?: number;
  isFullscreen?: boolean;
}

export const RedOrb: React.FC<RedOrbProps> = ({
  agentState,
  callState,
  audioLevel = 0.2,
  onClick,
  tapCount = 0,
  isFullscreen = false,
}) => {
  const isConnected = callState === 'connected';
  const isConnecting = callState === 'connecting' || callState === 'reconnecting';
  const isSpeaking = agentState === 'speaking';

  // Dynamic scale factor based on audio reactivity
  const dynamicScale = isConnected ? 1 + audioLevel * 0.25 : 1;

  return (
    <div className="relative flex flex-col items-center justify-center my-4 sm:my-8 select-none">
      {/* Tap Counter Toast Feedback */}
      <AnimatePresence>
        {tapCount > 0 && isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: -24, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-0 z-30 px-3.5 py-1.5 rounded-full bg-purple-950/90 border border-purple-400/50 text-xs font-semibold text-purple-200 shadow-xl backdrop-blur-md whitespace-nowrap"
          >
            Tap center 5 times to exit ({tapCount}/5)
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Lavender Atmospheric Glow Rings */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: isSpeaking ? [0.5, 0.9, 0.5] : [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: isSpeaking ? 1.2 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-purple-500/35 blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-purple-400/30 pointer-events-none"
      />

      {/* 3D Glossy Lavender Light Sphere */}
      <motion.div
        whileTap={{ scale: dynamicScale * 0.94 }}
        animate={{ scale: dynamicScale }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        onClick={onClick}
        className="relative w-36 h-36 xs:w-44 xs:h-44 sm:w-52 sm:h-52 rounded-full lavender-orb-3d flex items-center justify-center cursor-pointer shadow-2xl z-10 active:scale-95 transition-transform"
      >
        {/* Top Gloss Highlight Lens */}
        <div className="absolute top-2 left-4 sm:top-3 sm:left-6 w-10 h-6 sm:w-14 sm:h-8 rounded-full bg-white/60 blur-[3px] transform -rotate-45 pointer-events-none" />

        {/* Dark Inner Center Core / Lens */}
        <motion.div
          animate={{
            scale: isSpeaking ? [0.85, 1.05, 0.85] : [0.95, 1, 0.95],
          }}
          transition={{
            duration: isSpeaking ? 0.8 : 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-full lavender-orb-inner-lens flex items-center justify-center relative overflow-hidden border border-purple-800/60"
        >
          {/* Inner Core Pulsing Glow */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-400/60 blur-md animate-pulse" />
        </motion.div>

        {/* Connecting Spinner Ring if in loading state */}
        {isConnecting && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-6px] rounded-full border-2 border-transparent border-t-purple-300 border-r-indigo-300"
          />
        )}
      </motion.div>
    </div>
  );
};

export const LavenderOrb = RedOrb;
