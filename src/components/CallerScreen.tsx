import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useLocalParticipant,
} from '@livekit/components-react';
import { RoomEvent, Track, TrackPublication, Participant } from 'livekit-client';
import { motion } from 'framer-motion';
import {
  Menu,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Loader2,
  Volume2,
  ShieldCheck,
  Maximize,
  Minimize,
  Sparkles,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

import { WhiteOrb } from './RedOrb';
import { BISSummaryCard } from './BISSummaryCard';
import { CallState, AgentState, StartSessionResponse, TranscriptMessage, BISInquirySummary } from '../types';
import { useAudioLevel } from '../hooks/useAudioLevel';
import { startVoiceSession } from '../services/api';
import { extractBISInquiryFromTranscript } from '../utils/summaryExtractor';
import { generateId, getCurrentTimestamp } from '../utils/formatters';
import { getFastReply } from '../services/bisSaarthi';
import blueSphereImg from '../assets/blue-sphere.jpg';

const QUICK_PROMPTS = [
  'IS 10500 Drinking Water',
  'Gold Hallmarking 6-Digit HUID',
  'CRS Electronics Registration',
  'ISI Mark & CM/L Verification',
];

export const CallerScreen: React.FC = () => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [sessionCredentials, setSessionCredentials] = useState<StartSessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Post-Call Standards Advisory Summary State
  const [summaryDetails, setSummaryDetails] = useState<BISInquirySummary | null>(null);
  const [transcriptMessages, setTranscriptMessages] = useState<TranscriptMessage[]>([]);

  // Fullscreen state and 5-tap counter
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPseudoFs, setIsPseudoFs] = useState<boolean>(false);
  const [tapCount, setTapCount] = useState<number>(0);
  const lastTapTimeRef = useRef<number>(0);

  // Listen to browser Fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );
      setIsFullscreen(isFs);
      if (!isFs) {
        setIsPseudoFs(false);
        setTapCount(0);
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Toggle browser Fullscreen mode with fallback to CSS pseudo-fullscreen for iOS Safari
  const toggleFullscreen = useCallback(async () => {
    const currentlyActive = isFullscreen || isPseudoFs;

    if (!currentlyActive) {
      let nativeFsSuccess = false;
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
          nativeFsSuccess = true;
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
          nativeFsSuccess = true;
        }
      } catch (err) {
        console.warn('Native fullscreen request rejected/unsupported:', err);
      }
      setIsPseudoFs(true);
      setIsFullscreen(true);
    } else {
      try {
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          }
        }
      } catch (err) {
        console.warn('Native exitFullscreen error:', err);
      }
      setIsPseudoFs(false);
      setIsFullscreen(false);
      setTapCount(0);
    }
  }, [isFullscreen, isPseudoFs]);

  // 5-Tap Gesture on center orb to exit fullscreen
  const handleCenterTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 1500) {
      const nextCount = tapCount + 1;
      if (nextCount >= 5) {
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          try {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
              (document as any).webkitExitFullscreen();
            }
          } catch (e) {}
        }
        setIsPseudoFs(false);
        setIsFullscreen(false);
        setTapCount(0);
      } else {
        setTapCount(nextCount);
      }
    } else {
      setTapCount(1);
    }
    lastTapTimeRef.current = now;
  }, [tapCount]);

  // Audio level generator for smooth visualizer and pearl orb
  const isSpeaking = agentState === 'speaking';
  const audioLevel = useAudioLevel(isSpeaking, agentState);

  // Initiates connection to voice session
  const handleConnect = useCallback(async (presetPrompt?: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setCallState('connecting');
    setSummaryDetails(null);

    const initialGreeting = presetPrompt
      ? `Hello! Welcome to BIS Saarthi. How can I assist you with ${presetPrompt}?`
      : 'Hello! I am BIS Saarthi. How can I help you with Indian Standards today?';

    setTranscriptMessages([
      {
        id: generateId(),
        sender: 'ai',
        text: initialGreeting,
        timestamp: getCurrentTimestamp(),
      },
    ]);

    try {
      // 1. Request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (micErr) {
        console.warn('Microphone permission warning:', micErr);
      }

      // 2. Fetch session credentials from backend API
      console.log('Initiating BIS Saarthi voice session...');
      const session = await startVoiceSession();
      console.log('Session created successfully:', session);
      setSessionCredentials(session);
      setCallState('connected');
      setAgentState('speaking');

      setTimeout(() => {
        setAgentState('listening');
      }, 3500);
    } catch (error: any) {
      console.error('Call initialization failed:', error);
      setErrorMessage(error?.message || 'Failed to connect to BIS Saarthi server');
      setCallState('error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Handles disconnection and triggers extracted standards advisory summary
  const handleEndCall = useCallback(() => {
    setCallState('disconnected');
    setAgentState('idle');
    setSessionCredentials(null);

    // Extract BIS standards inquiry details from accumulated transcript messages
    const extracted = extractBISInquiryFromTranscript(transcriptMessages);
    setSummaryDetails(extracted);

    setTimeout(() => {
      setCallState('idle');
    }, 500);
  }, [transcriptMessages]);

  const handleResetNewCall = useCallback(() => {
    setSummaryDetails(null);
    setCallState('idle');
    setTranscriptMessages([]);
  }, []);

  // Lock mobile body touchmove to prevent rubber-banding
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('.overflow-y-auto')) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  const isFsActive = isFullscreen || isPseudoFs;

  return (
    <div className={`w-full h-[100dvh] max-h-[100dvh] bg-slate-100 text-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-blue-600 selection:text-white relative overflow-hidden fixed inset-0 touch-none overscroll-none select-none ${
      isFsActive ? 'z-[9999]' : ''
    }`}>
      {/* Background Soft Pearl Aura Glow */}
      <div
        className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
          isSpeaking ? 'white-ambient-glow-speaking' : 'white-ambient-glow'
        }`}
      />

      {/* Outer Phone Frame Container */}
      <div className={`w-full h-[100dvh] max-h-[100dvh] ${
        isFsActive
          ? 'max-w-none rounded-none border-0'
          : 'sm:min-h-0 sm:max-w-[420px] sm:h-[800px] sm:max-h-[94vh] sm:rounded-[48px] sm:border sm:border-slate-200/80 sm:shadow-2xl sm:shadow-slate-300/60'
      } bg-white rounded-none border-0 flex flex-col justify-between p-4 pt-safe pb-safe sm:p-6 relative overflow-hidden z-10 touch-none overscroll-none`}>
        
        {/* Top Status & Header Bar */}
        <header className="w-full flex items-center justify-between z-20 pt-1 sm:pt-2 px-1">
          {/* Information / Help Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-slate-800">BIS Saarthi</span>
              <span className="text-[9px] text-slate-500 font-medium -mt-0.5">Team AKRIX</span>
            </div>
          </div>

          {/* Fullscreen Toggle Button & Caller ID Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFullscreen();
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                toggleFullscreen();
              }}
              title={isFsActive ? "Exit Fullscreen (or tap center 5 times)" : "Enter Fullscreen Mode"}
              className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all z-30 select-none"
            >
              {isFsActive ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-slate-600" />
                  <span>Exit FS</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-slate-600" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 p-[2px] shadow-xs">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={blueSphereImg} alt="BIS Saarthi" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Conditional Content: Standards Advisory vs Connected Call vs Disconnected */}
        {summaryDetails ? (
          <BISSummaryCard summary={summaryDetails} onNewCall={handleResetNewCall} />
        ) : sessionCredentials && callState === 'connected' ? (
          <LiveKitRoom
            serverUrl={sessionCredentials.livekitUrl}
            token={sessionCredentials.token}
            connect={true}
            audio={true}
            video={false}
            onError={(err) => {
              console.error('LiveKit Error:', err);
              setErrorMessage('LiveKit connection error');
            }}
            className="w-full flex-1 flex flex-col items-center justify-between"
          >
            <RoomAudioRenderer />
            <ConnectedCallerUI
              callState={callState}
              agentState={agentState}
              setAgentState={setAgentState}
              audioLevel={audioLevel}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              onEndCall={handleEndCall}
              onCenterTap={handleCenterTap}
              tapCount={tapCount}
              isFullscreen={isFullscreen}
              setTranscriptMessages={setTranscriptMessages}
            />
          </LiveKitRoom>
        ) : (
          <DisconnectedCallerUI
            callState={callState}
            agentState={agentState}
            audioLevel={audioLevel}
            onConnect={handleConnect}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onCenterTap={handleCenterTap}
            tapCount={tapCount}
            isFullscreen={isFullscreen}
          />
        )}
      </div>
    </div>
  );
};

interface DisconnectedCallerUIProps {
  callState: CallState;
  agentState: AgentState;
  audioLevel: number;
  onConnect: (preset?: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onCenterTap?: () => void;
  tapCount?: number;
  isFullscreen?: boolean;
}

const DisconnectedCallerUI: React.FC<DisconnectedCallerUIProps> = ({
  callState,
  agentState,
  audioLevel,
  onConnect,
  isLoading,
  errorMessage,
  onCenterTap,
  tapCount = 0,
  isFullscreen = false,
}) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between z-10 pt-2 sm:pt-4">
      {/* Center 3D White Pearl Sphere */}
      <div className="flex-1 flex items-center justify-center">
        <WhiteOrb
          agentState={agentState}
          callState={callState}
          audioLevel={audioLevel}
          onClick={onCenterTap}
          tapCount={tapCount}
          isFullscreen={isFullscreen}
        />
      </div>

      {/* Main Headlines */}
      <div className="text-center my-3 space-y-1.5 w-full">
        {/* Caller ID Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 shadow-xs mx-auto">
          <img src={blueSphereImg} alt="BIS Saarthi" className="w-4 h-4 rounded-full object-cover border border-blue-300" />
          <span className="text-xs font-semibold">Caller ID: BIS Saarthi</span>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        </div>

        <p className="text-xs font-medium text-slate-500 tracking-wide">
          {callState === 'connecting' ? 'Connecting to BIS Saarthi...' : 'National Standards AI Assistant'}
        </p>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
          How Can I Help With Indian Standards?
        </h1>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium mt-1 px-2">
            {errorMessage}
          </p>
        )}

        {/* Quick Topic Chips */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-2 max-w-sm mx-auto">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onConnect(prompt)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-600 font-medium transition-colors cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom White Translucent Pill Control */}
      <div className="w-full mb-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onConnect()}
          disabled={isLoading}
          className="w-full h-15 rounded-3xl white-pill-container px-5 flex items-center justify-between border border-slate-200 cursor-pointer group shadow-lg"
        >
          <span className="text-slate-700 text-sm font-semibold group-hover:text-blue-700 transition-colors flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Connecting to BIS Saarthi...</span>
              </>
            ) : (
              <span>Ask about Indian Standards, ISI, HUID...</span>
            )}
          </span>

          <div className="w-10 h-10 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
            <PhoneCall className="w-4 h-4 fill-current" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

interface ConnectedCallerUIProps {
  callState: CallState;
  agentState: AgentState;
  setAgentState: (state: AgentState) => void;
  audioLevel: number;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  onEndCall: () => void;
  onCenterTap?: () => void;
  tapCount?: number;
  isFullscreen?: boolean;
  setTranscriptMessages?: React.Dispatch<React.SetStateAction<TranscriptMessage[]>>;
}

const ConnectedCallerUI: React.FC<ConnectedCallerUIProps> = ({
  callState,
  agentState,
  setAgentState,
  audioLevel,
  isMuted,
  setIsMuted,
  onEndCall,
  onCenterTap,
  tapCount = 0,
  isFullscreen = false,
  setTranscriptMessages,
}) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(true);

  // Guarantee microphone publishing & audio context unlock upon joining LiveKit room
  useEffect(() => {
    if (!room) return;

    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(true).catch((err) => {
        console.warn('Auto mic enable warning:', err);
      });
    }

    room.startAudio().catch((err) => {
      console.warn('Audio start warning:', err);
      setAudioUnlocked(false);
    });

    const handleTrackSubscribed = (
      track: Track,
      publication: TrackPublication,
      participant: Participant
    ) => {
      if (track.kind === Track.Kind.Audio) {
        console.log('Subscribed to remote audio track from participant:', participant.identity);
        const audioElement = track.attach();
        audioElement.autoplay = true;
        document.body.appendChild(audioElement);
        audioElement.play().catch((playErr) => {
          console.warn('Remote audio playback blocked by browser:', playErr);
          setAudioUnlocked(false);
        });
      }
    };

    const handleTranscription = (transcripts: any[], participant?: Participant) => {
      if (!setTranscriptMessages) return;
      transcripts.forEach((t) => {
        if (t.text && t.text.trim().length > 0) {
          const isUser = participant?.identity === localParticipant?.identity;
          const sender = isUser ? 'user' : 'ai';
          setTranscriptMessages((prev) => [
            ...prev,
            {
              id: t.id || generateId(),
              sender,
              text: t.text,
              timestamp: getCurrentTimestamp(),
              isFinal: t.isFinal,
            },
          ]);
        }
      });
    };

    const handleDataReceived = (payload: Uint8Array, participant?: Participant) => {
      if (!setTranscriptMessages) return;
      try {
        const str = new TextDecoder().decode(payload);
        const data = JSON.parse(str);
        if (data.type === 'transcript' || data.text) {
          const isUser = participant?.identity === localParticipant?.identity;
          setTranscriptMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              sender: isUser ? 'user' : 'ai',
              text: data.text || data.message,
              timestamp: getCurrentTimestamp(),
            },
          ]);
        }
      } catch (e) {}
    };

    const handleActiveSpeakers = (speakers: Participant[]) => {
      const isRemoteSpeaking = speakers.some(
        (s) => localParticipant && s.identity !== localParticipant.identity
      );
      const isUserSpeaking = speakers.some(
        (s) => localParticipant && s.identity === localParticipant.identity
      );

      if (isRemoteSpeaking) {
        setAgentState('speaking');
      } else if (isUserSpeaking) {
        setAgentState('listening');
      } else {
        setAgentState('listening');
      }
    };

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.TranscriptionReceived, handleTranscription);
    room.on(RoomEvent.DataReceived, handleDataReceived);
    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);

    return () => {
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.off(RoomEvent.TranscriptionReceived, handleTranscription);
      room.off(RoomEvent.DataReceived, handleDataReceived);
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);
    };
  }, [room, localParticipant, setAgentState, setTranscriptMessages]);

  const unlockAudioManually = () => {
    if (room) {
      room.startAudio();
      setAudioUnlocked(true);
    }
  };

  const toggleMic = () => {
    if (localParticipant) {
      const current = localParticipant.isMicrophoneEnabled === false;
      localParticipant.setMicrophoneEnabled(current);
      setIsMuted(!current);
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between z-10 pt-2 sm:pt-4">
      {/* Center 3D White Pearl Sphere */}
      <div className="flex-1 flex items-center justify-center">
        <WhiteOrb
          agentState={agentState}
          callState={callState}
          audioLevel={audioLevel}
          onClick={onCenterTap}
          tapCount={tapCount}
          isFullscreen={isFullscreen}
        />
      </div>

      {/* Main Headlines */}
      <div className="text-center my-3 space-y-1.5">
        {/* Caller ID Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 shadow-xs mx-auto">
          <img src={blueSphereImg} alt="BIS Saarthi" className="w-4 h-4 rounded-full object-cover border border-blue-300" />
          <span className="text-xs font-semibold">Caller ID: BIS Saarthi</span>
        </div>

        <p className="text-xs font-medium text-slate-500 tracking-wide">
          {agentState === 'speaking' ? 'BIS Saarthi Speaking...' : 'BIS Saarthi Listening...'}
        </p>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Bureau of Indian Standards Advisory
        </h1>

        {!audioUnlocked && (
          <button
            onClick={unlockAudioManually}
            className="mt-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-300 text-xs text-blue-700 flex items-center gap-1.5 mx-auto cursor-pointer animate-bounce shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5" /> Tap to Enable Audio Output
          </button>
        )}
      </div>

      {/* Bottom White Translucent Pill Control */}
      <div className="w-full mb-2">
        <div className="w-full h-15 rounded-3xl white-pill-container px-5 flex items-center justify-between border border-slate-200 shadow-lg">
          <button
            onClick={toggleMic}
            className="flex items-center gap-3 text-slate-700 text-sm font-semibold hover:text-blue-700 cursor-pointer"
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-rose-500" />
            ) : (
              <Mic className="w-5 h-5 text-blue-600 animate-pulse" />
            )}
            <span>{isMuted ? 'Microphone Muted' : 'Listening...'}</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Waveform indicator */}
            <div className="flex items-center gap-0.5">
              {[0.4, 0.9, 0.6, 1, 0.5].map((val, idx) => (
                <motion.span
                  key={idx}
                  animate={{
                    height: agentState === 'speaking' ? ['6px', '18px', '6px'] : ['4px', '10px', '4px'],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: idx * 0.1,
                  }}
                  className="w-1 bg-blue-600 rounded-full"
                />
              ))}
            </div>

            {/* End Call button */}
            <button
              onClick={onEndCall}
              className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
