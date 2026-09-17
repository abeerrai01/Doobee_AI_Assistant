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
    <div className="w-full max-w-md my-2 sm:my-3 p-2 rounded-3xl bg-white border border-slate-200 flex items-center justify-around gap-1.5 sm:gap-2 shadow-md">
      {/* Mute Microphone Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleMute}
        title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        className={`relative flex-1 p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
          isMuted
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
        }`}
      >
        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-blue-600" />}
        <span className="text-[10px] font-semibold mt-1">
          {isMuted ? 'Muted' : 'Mic On'}
        </span>
        {!isMuted && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
        )}
      </motion.button>

      {/* Speaker Output Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleSpeaker}
        title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
        className={`flex-1 p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
          isSpeakerOn
            ? 'bg-slate-50 text-slate-800 border border-slate-200'
            : 'bg-slate-100 text-slate-400 border border-slate-200'
        }`}
      >
        {isSpeakerOn ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
        <span className="text-[10px] font-semibold mt-1">
          {isSpeakerOn ? 'Speaker' : 'Mute Spk'}
        </span>
      </motion.button>

      {/* Reconnect Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReconnect}
        title="Reconnect Session"
        className="flex-1 p-2.5 sm:p-3 rounded-2xl bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-slate-600" />
        <span className="text-[10px] font-semibold mt-1">
          Reconnect
        </span>
      </motion.button>

      {/* End Call Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEndCall}
        title="End Call"
        className="flex-1 p-2.5 sm:p-3 rounded-2xl bg-rose-600 text-white shadow-sm flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer hover:bg-rose-700"
      >
        <PhoneOff className="w-4 h-4 fill-current" />
        <span className="text-[10px] font-semibold mt-1">
          End Call
        </span>
      </motion.button>
    </div>
  );
};
