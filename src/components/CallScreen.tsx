import React, { useState, useEffect, useCallback } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useLocalParticipant,
  useRemoteParticipants,
} from '@livekit/components-react';
import { RoomEvent, Participant } from 'livekit-client';
import { motion } from 'framer-motion';

import { Avatar } from './Avatar';
import { ConnectionStatus } from './ConnectionStatus';
import { Timer } from './Timer';
import { AudioVisualizer } from './AudioVisualizer';
import { Transcript } from './Transcript';
import { CallControls } from './CallControls';

import { CallState, AgentState, TranscriptMessage, StartSessionResponse } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useAudioLevel } from '../hooks/useAudioLevel';
import { getCurrentTimestamp, generateId } from '../utils/formatters';

interface CallScreenProps {
  sessionCredentials: StartSessionResponse;
  onEndCall: () => void;
  servicePreset?: string;
}

/**
 * Inner Call Screen Component that consumes LiveKit hooks inside LiveKitRoom context
 */
const CallScreenInner: React.FC<{
  livekitUrl: string;
  token: string;
  onEndCall: () => void;
  servicePreset?: string;
}> = ({ livekitUrl, token, onEndCall, servicePreset }) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  const [callState, setCallState] = useState<CallState>('connecting');
  const [agentState, setAgentState] = useState<AgentState>('listening');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);

  // Start Call Duration Timer when connected
  const isConnected = callState === 'connected';
  const durationSeconds = useTimer(isConnected);

  // Audio level generator for smooth visualizer and avatar
  const isSpeaking = agentState === 'speaking';
  const audioLevel = useAudioLevel(isSpeaking, agentState);

  // Default AI initial greeting message
  useEffect(() => {
    const greetingText = servicePreset
      ? `Hello! Welcome to Doobee AI. I see you're interested in ${servicePreset} service! Which language would you prefer: English, Hindi or Hinglish?`
      : 'Hello! Welcome to Doobee. Which language would you prefer: English, Hindi or Hinglish?';

    setMessages([
      {
        id: generateId(),
        sender: 'ai',
        text: greetingText,
        timestamp: getCurrentTimestamp(),
      },
    ]);
  }, [servicePreset]);

  // Handle Room Events
  useEffect(() => {
    if (!room) return;

    const handleConnected = () => {
      console.log('Successfully connected to LiveKit room:', room.name);
      setCallState('connected');
      setAgentState('speaking');

      // Return to listening state after greeting
      setTimeout(() => {
        setAgentState('listening');
      }, 3500);
    };

    const handleReconnecting = () => {
      console.log('LiveKit room reconnecting...');
      setCallState('reconnecting');
    };

    const handleReconnected = () => {
      console.log('LiveKit room reconnected');
      setCallState('connected');
    };

    const handleDisconnected = () => {
      console.log('LiveKit room disconnected');
      setCallState('disconnected');
    };

    // Live Transcription event handling
    const handleTranscription = (
      transcripts: any[],
      participant?: Participant
    ) => {
      transcripts.forEach((t) => {
        if (t.text && t.text.trim().length > 0) {
          const isUser = participant?.identity === localParticipant?.identity;
          const sender = isUser ? 'user' : 'ai';

          setMessages((prev) => {
            const newMsg: TranscriptMessage = {
              id: t.id || generateId(),
              sender,
              text: t.text,
              timestamp: getCurrentTimestamp(),
              isFinal: t.isFinal,
            };
            return [...prev, newMsg];
          });

          if (!isUser) {
            setAgentState('speaking');
          } else {
            setAgentState('listening');
          }
        }
      });
    };

    // Data packet events
    const handleDataReceived = (
      payload: Uint8Array,
      participant?: Participant
    ) => {
      try {
        const str = new TextDecoder().decode(payload);
        const data = JSON.parse(str);
        if (data.type === 'transcript' || data.text) {
          const isUser = participant?.identity === localParticipant?.identity;
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              sender: isUser ? 'user' : 'ai',
              text: data.text || data.message,
              timestamp: getCurrentTimestamp(),
            },
          ]);
        }
      } catch (e) {
        // Ignore non-JSON packets
      }
    };

    // Active speaker detection
    const handleActiveSpeakers = (speakers: Participant[]) => {
      const isRemoteSpeaking = speakers.some(
        (s) => s.identity !== localParticipant?.identity
      );
      const isUserSpeaking = speakers.some(
        (s) => s.identity === localParticipant?.identity
      );

      if (isRemoteSpeaking) {
        setAgentState('speaking');
      } else if (isUserSpeaking) {
        setAgentState('listening');
      } else if (callState === 'connected') {
        setAgentState((prev) => (prev === 'speaking' ? 'listening' : prev));
      }
    };

    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Reconnecting, handleReconnecting);
    room.on(RoomEvent.Reconnected, handleReconnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.TranscriptionReceived, handleTranscription);
    room.on(RoomEvent.DataReceived, handleDataReceived);
    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);

    if (room.state === 'connected') {
      setCallState('connected');
    }

    return () => {
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Reconnecting, handleReconnecting);
      room.off(RoomEvent.Reconnected, handleReconnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.TranscriptionReceived, handleTranscription);
      room.off(RoomEvent.DataReceived, handleDataReceived);
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);
    };
  }, [room, localParticipant, callState]);

  // Microphone toggle handler
  const handleToggleMute = useCallback(() => {
    if (localParticipant) {
      const currentMute = localParticipant.isMicrophoneEnabled === false;
      localParticipant.setMicrophoneEnabled(currentMute);
      setIsMuted(!currentMute);
    } else {
      setIsMuted((prev) => !prev);
    }
  }, [localParticipant]);

  // Speaker toggle handler
  const handleToggleSpeaker = useCallback(() => {
    setIsSpeakerOn((prev) => !prev);
  }, []);

  // Reconnect handler
  const handleReconnect = useCallback(async () => {
    setCallState('reconnecting');
    try {
      if (room) {
        await room.disconnect();
        await room.connect(livekitUrl, token);
        setCallState('connected');
      }
    } catch (err) {
      console.error('Reconnect failed:', err);
      setCallState('error');
    }
  }, [room, livekitUrl, token]);

  // End Call Teardown
  const handleEndCall = useCallback(async () => {
    if (room) {
      await room.disconnect();
    }
    onEndCall();
  }, [room, onEndCall]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden selection:bg-blue-600">
      {/* Automatic LiveKit Remote Audio Renderer */}
      <RoomAudioRenderer />

      {/* Decorative Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Call Header Bar */}
      <header className="w-full max-w-md flex items-center justify-between z-20 py-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
          <span className="font-bold text-lg text-slate-100 tracking-tight">
            Doobee AI Call
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Timer seconds={durationSeconds} isConnected={isConnected} />
          <ConnectionStatus callState={callState} agentState={agentState} />
        </div>
      </header>

      {/* Center Call Visual Area */}
      <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center my-2 z-10 space-y-3">
        {/* Animated Avatar */}
        <Avatar agentState={agentState} audioLevel={audioLevel} />

        {/* Dynamic Voice Visualizer Waveform */}
        <AudioVisualizer agentState={agentState} audioLevel={audioLevel} />

        {/* Live Conversation Transcript */}
        <Transcript messages={messages} />
      </main>

      {/* Bottom Controls Bar */}
      <footer className="w-full max-w-md flex justify-center z-20">
        <CallControls
          isMuted={isMuted}
          isSpeakerOn={isSpeakerOn}
          onToggleMute={handleToggleMute}
          onToggleSpeaker={handleToggleSpeaker}
          onReconnect={handleReconnect}
          onEndCall={handleEndCall}
          isConnected={isConnected}
        />
      </footer>
    </div>
  );
};

export const CallScreen: React.FC<CallScreenProps> = ({
  sessionCredentials,
  onEndCall,
  servicePreset,
}) => {
  return (
    <LiveKitRoom
      serverUrl={sessionCredentials.livekitUrl}
      token={sessionCredentials.token}
      connect={true}
      audio={true}
      video={false}
      onError={(error) => {
        console.error('LiveKit Room Error:', error);
      }}
      className="w-full h-full"
    >
      <CallScreenInner
        livekitUrl={sessionCredentials.livekitUrl}
        token={sessionCredentials.token}
        onEndCall={onEndCall}
        servicePreset={servicePreset}
      />
    </LiveKitRoom>
  );
};
