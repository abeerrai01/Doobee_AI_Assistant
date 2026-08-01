import React from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  RotateCcw,
} from 'lucide-react';

interface CallControlsProps {
  isMuted: boolean;
  isSpeakerOn: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onReconnect: () => void;
  onEndCall: () => void;
  isConnected: boolean;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  isSpeakerOn,
  onToggleMute,
  onToggleSpeaker,
  onReconnect,
  onEndCall,
  isConnected,
}) => {
  return (
    <div className="w-full max-w-md my-2 sm:my-4 p-2 sm:p-3 rounded-3xl bg-amber-950/40 border border-amber-500/40 backdrop-blur-2xl flex items-center justify-around gap-1.5 sm:gap-2 shadow-2xl shadow-amber-950/60">
      {/* Mute Microphone Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggleMute}
        title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        className={`relative flex-1 p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
          isMuted
            ? 'bg-rose-950/90 text-rose-400 border border-rose-800/60 shadow-lg shadow-rose-950/50'
            : 'bg-amber-950/80 text-amber-100 border border-amber-500/40 hover:bg-amber-900 hover:border-amber-400/60'
        }`}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-amber-400" />}
        <span className="text-[10px] font-bold mt-1">
          {isMuted ? 'Muted' : 'Mic On'}
        </span>
        {!isMuted && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        )}
      </motion.button>

      {/* Speaker Output Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggleSpeaker}
        title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
        className={`flex-1 p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
          isSpeakerOn
            ? 'bg-amber-950/90 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-950/60'
            : 'bg-amber-950/40 text-amber-400/60 border border-amber-500/30 hover:bg-amber-900/50'
        }`}
      >
        {isSpeakerOn ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-amber-500/50" />}
        <span className="text-[10px] font-bold mt-1">
          {isSpeakerOn ? 'Speaker' : 'Mute Spk'}
        </span>
      </motion.button>

      {/* Reconnect Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onReconnect}
        title="Reconnect Session"
        className="flex-1 p-3 sm:p-4 rounded-2xl bg-amber-950/80 text-amber-300 border border-amber-500/40 hover:bg-amber-900 hover:border-amber-400 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] font-bold mt-1 text-amber-200">
          Reconnect
        </span>
      </motion.button>

      {/* End Call Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onEndCall}
        title="End Call"
        className="flex-1 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white border border-rose-400/40 shadow-xl shadow-rose-950/80 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
      >
        <PhoneOff className="w-5 h-5 fill-current" />
        <span className="text-[10px] font-bold mt-1">
          End Call
        </span>
      </motion.button>
    </div>
  );
};
