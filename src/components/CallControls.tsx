import React from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  RotateCcw,
  Radio,
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
    <div className="w-full max-w-md my-4 p-3 rounded-3xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-2xl flex items-center justify-around gap-2 shadow-2xl">
      {/* Mute Microphone Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggleMute}
        title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        className={`relative p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
          isMuted
            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60 shadow-lg shadow-rose-950/50'
            : 'bg-slate-900 text-slate-100 border border-slate-700/60 hover:bg-slate-800 hover:border-blue-500/50'
        }`}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-blue-400" />}
        <span className="text-[10px] font-medium mt-1">
          {isMuted ? 'Muted' : 'Mic On'}
        </span>
        {!isMuted && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        )}
      </motion.button>

      {/* Speaker Output Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggleSpeaker}
        title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
        className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
          isSpeakerOn
            ? 'bg-slate-900 text-sky-400 border border-sky-500/40 shadow-md shadow-sky-950/40'
            : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
        }`}
      >
        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        <span className="text-[10px] font-medium mt-1">
          {isSpeakerOn ? 'Speaker' : 'Mute Spk'}
        </span>
      </motion.button>

      {/* Reconnect Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onReconnect}
        title="Reconnect Session"
        className="p-4 rounded-2xl bg-slate-900 text-amber-400 border border-slate-800 hover:bg-slate-800 hover:border-amber-500/50 flex flex-col items-center justify-center transition-all duration-300"
      >
        <RotateCcw className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1 text-slate-300">
          Reconnect
        </span>
      </motion.button>

      {/* End Call Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onEndCall}
        title="End Call"
        className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white border border-rose-400/40 shadow-xl shadow-rose-950/80 flex flex-col items-center justify-center transition-all duration-300"
      >
        <PhoneOff className="w-5 h-5 fill-current" />
        <span className="text-[10px] font-bold mt-1">
          End Call
        </span>
      </motion.button>
    </div>
  );
};
