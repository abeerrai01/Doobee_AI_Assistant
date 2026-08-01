import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useLocalParticipant,
} from '@livekit/components-react';
import { RoomEvent, Track, TrackPublication, Participant } from 'livekit-client';
import { motion } from 'framer-motion';
import { Menu, Mic, MicOff, PhoneCall, PhoneOff, Loader2, Volume2, ShieldCheck, Maximize, Minimize } from 'lucide-react';

import { RedOrb } from './RedOrb';
import { BookingSummaryCard } from './BookingSummaryCard';
import { CallState, AgentState, StartSessionResponse, TranscriptMessage, ExtractedBookingDetails } from '../types';
import { useAudioLevel } from '../hooks/useAudioLevel';
import { startVoiceSession } from '../services/api';
import { extractBookingDetailsFromTranscript } from '../utils/summaryExtractor';
import { generateId, getCurrentTimestamp } from '../utils/formatters';
import blueSphereImg from '../assets/blue-sphere.jpg';

export const CallerScreen: React.FC = () => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [sessionCredentials, setSessionCredentials] = useState<StartSessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Post-Call Booking Summary State
  const [summaryDetails, setSummaryDetails] = useState<ExtractedBookingDetails | null>(null);
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
        // 5 Taps reached: Exit Fullscreen!
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

  // Audio level generator for smooth visualizer and lavender orb
  const isSpeaking = agentState === 'speaking';
  const audioLevel = useAudioLevel(isSpeaking, agentState);

  // Initiates connection automatically or on click
  const handleConnect = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setCallState('connecting');
    setSummaryDetails(null);

    // Initial greeting transcript
    setTranscriptMessages([
      {
        id: generateId(),
        sender: 'ai',
        text: 'Hello! Welcome to Doobee AI Voice Assistant. How can I help you today?',
        timestamp: getCurrentTimestamp(),
      },
    ]);

    try {
      // 1. Request microphone permission first so user browser grants audio input
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release initial stream so LiveKit can consume it cleanly
        stream.getTracks().forEach((t) => t.stop());
      } catch (micErr) {
        console.warn('Microphone permission warning:', micErr);
      }

      // 2. Fetch session credentials from Hugging Face backend API
      console.log('Initiating voice session POST request...');
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
      setErrorMessage(error?.message || 'Failed to connect to Doobee AI server');
      setCallState('error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Handles disconnection and triggers extracted summary receipt
  const handleEndCall = useCallback(() => {
    setCallState('disconnected');
    setAgentState('idle');
    setSessionCredentials(null);

    // Extract booking details from accumulated transcript messages!
    const extracted = extractBookingDetailsFromTranscript(transcriptMessages);
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

  // Lock mobile body touchmove to prevent rubber-banding / downward elastic scrolling
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
    <div className={`w-full h-[100dvh] max-h-[100dvh] bg-[#05020a] text-white flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-purple-600 relative overflow-hidden fixed inset-0 touch-none overscroll-none select-none ${
      isFsActive ? 'z-[9999]' : ''
    }`}>
      {/* Background Lavender Ambient Radial Glow */}
      <div
        className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
          isSpeaking ? 'lavender-ambient-glow-speaking' : 'lavender-ambient-glow'
        }`}
      />

      {/* Mobile Phone Mockup Outer Frame Container */}
      <div className={`w-full h-[100dvh] max-h-[100dvh] ${
        isFsActive
          ? 'max-w-none rounded-none border-0'
          : 'sm:min-h-0 sm:max-w-[400px] sm:h-[780px] sm:max-h-[92vh] sm:rounded-[48px] sm:border-[6px]'
      } bg-[#090314] rounded-none border-0 border-slate-900 shadow-none sm:shadow-[0_0_80px_rgba(168,85,247,0.35)] flex flex-col justify-between p-4 pt-safe pb-safe sm:p-6 relative overflow-hidden z-10 border-t border-purple-900/40 touch-none overscroll-none`}>
        
        {/* Top Phone Status & Header Bar */}
        <header className="w-full flex items-center justify-between z-20 pt-1 sm:pt-2 px-1">
          {/* Hamburger Menu Icon */}
          <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <Menu className="w-5 h-5 text-purple-200" />
          </button>

          {/* Fullscreen Toggle Button & User Icon Avatar / Caller ID */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFullscreen();
              }}
              onPointerDown={(e) => {
                // Prevent ghost click delays on mobile touch devices
                e.preventDefault();
                toggleFullscreen();
              }}
              title={isFsActive ? "Exit Fullscreen (or tap center 5 times)" : "Enter Fullscreen Mode"}
              className="px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-400/50 hover:bg-purple-900 text-purple-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all z-30 select-none"
            >
              {isFsActive ? (
                <>
                  <Minimize className="w-3.5 h-3.5 text-purple-300" />
                  <span>Exit FS</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5 text-purple-300" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-400 to-sky-300 p-[2px] shadow-lg shadow-purple-950/60">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img src={blueSphereImg} alt="Caller ID" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Conditional Content: Booking Summary Card vs Connected Call vs Disconnected */}
        {summaryDetails ? (
          <BookingSummaryCard summary={summaryDetails} onNewCall={handleResetNewCall} />
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
  onConnect: () => void;
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
    <div className="w-full flex-1 flex flex-col items-center justify-between z-10 pt-4">
      {/* Center 3D Lavender Orb Sphere */}
      <div className="flex-1 flex items-center justify-center">
        <RedOrb
          agentState={agentState}
          callState={callState}
          audioLevel={audioLevel}
          onClick={onCenterTap}
          tapCount={tapCount}
          isFullscreen={isFullscreen}
        />
      </div>

      {/* Main Headlines matching mockup */}
      <div className="text-center my-4 space-y-2">
        {/* Caller ID Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-400/30 backdrop-blur-md shadow-md mx-auto">
          <img src={blueSphereImg} alt="Caller ID" className="w-4 h-4 rounded-full object-cover border border-purple-300/40" />
          <span className="text-xs font-medium text-purple-200">Caller ID: Doobee AI</span>
          <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
        </div>

        <p className="text-sm font-medium text-purple-200/80 tracking-wide">
          {callState === 'connecting' ? 'Connecting to Doobee...' : 'Hello!'}
        </p>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
          How Can I Help You Today?
        </h1>

        {errorMessage && (
          <p className="text-xs text-rose-300 font-medium mt-1 px-2">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Bottom Lavender Translucent Pill Control matching reference design */}
      <div className="w-full mb-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConnect}
          disabled={isLoading}
          className="w-full h-16 rounded-3xl lavender-pill-container px-6 flex items-center justify-between border border-purple-400/40 cursor-pointer group shadow-xl shadow-purple-950/40"
        >
          <span className="text-purple-100 text-sm font-medium group-hover:text-white transition-colors flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                <span>Connecting to Doobee...</span>
              </>
            ) : (
              <span>Ask anything...</span>
            )}
          </span>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <PhoneCall className="w-5 h-5 text-white fill-current" />
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

    // 1. Enable local microphone track so backend worker agent receives user speech!
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(true).catch((err) => {
        console.warn('Auto mic enable warning:', err);
      });
    }

    // 2. Unlock browser audio playback context
    room.startAudio().catch((err) => {
      console.warn('Audio start warning:', err);
      setAudioUnlocked(false);
    });

    // 3. Explicitly attach & play remote audio tracks when published by AI Agent
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

    // 4. Handle LiveKit transcription received event
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

    // 5. Handle DataReceived JSON payload packets
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

    // 6. Handle active speakers to update agent state
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
    <div className="w-full flex-1 flex flex-col items-center justify-between z-10 pt-4">
      {/* Center 3D Lavender Orb Sphere */}
      <div className="flex-1 flex items-center justify-center">
        <RedOrb
          agentState={agentState}
          callState={callState}
          audioLevel={audioLevel}
          onClick={onCenterTap}
          tapCount={tapCount}
          isFullscreen={isFullscreen}
        />
      </div>

      {/* Main Headlines matching mockup */}
      <div className="text-center my-4 space-y-2">
        {/* Caller ID Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-400/30 backdrop-blur-md shadow-md mx-auto">
          <img src={blueSphereImg} alt="Caller ID" className="w-4 h-4 rounded-full object-cover border border-purple-300/40" />
          <span className="text-xs font-medium text-purple-200">Caller ID: Doobee AI</span>
        </div>

        <p className="text-sm font-medium text-purple-200/80 tracking-wide">
          {agentState === 'speaking' ? 'Doobee Speaking...' : 'Doobee Listening...'}
        </p>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
          How Can I Help You Today?
        </h1>

        {!audioUnlocked && (
          <button
            onClick={unlockAudioManually}
            className="mt-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-400 text-xs text-purple-200 flex items-center gap-1.5 mx-auto cursor-pointer animate-bounce"
          >
            <Volume2 className="w-3.5 h-3.5" /> Tap to Enable Audio Output
          </button>
        )}
      </div>

      {/* Bottom Lavender Translucent Pill Control matching reference design */}
      <div className="w-full mb-3">
        <div className="w-full h-16 rounded-3xl lavender-pill-container px-6 flex items-center justify-between border border-purple-400/40">
          <button
            onClick={toggleMic}
            className="flex items-center gap-3 text-purple-100 text-sm font-medium hover:text-white cursor-pointer"
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-purple-400" />
            ) : (
              <Mic className="w-5 h-5 text-purple-300 animate-pulse" />
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
                  className="w-1 bg-purple-300 rounded-full"
                />
              ))}
            </div>

            {/* End Call button */}
            <button
              onClick={onEndCall}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-950/80 transition-transform active:scale-95 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
