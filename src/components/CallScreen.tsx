import React, { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useLocalParticipant,
} from '@livekit/components-react';
import { RoomEvent, Participant } from 'livekit-client';

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
  standardPreset?: string;
}

const CallScreenInner: React.FC<{
  livekitUrl: string;
  token: string;
  onEndCall: () => void;
  standardPreset?: string;
}> = ({ livekitUrl, token, onEndCall, standardPreset }) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const [callState, setCallState] = useState<CallState>('connecting');
  const [agentState, setAgentState] = useState<AgentState>('listening');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);

  const isConnected = callState === 'connected';
  const durationSeconds = useTimer(isConnected);

  const isSpeaking = agentState === 'speaking';
  const audioLevel = useAudioLevel(isSpeaking, agentState);

  useEffect(() => {
    const greetingText = standardPreset
      ? `Hello! I am BIS Saarthi. I see you are inquiring about ${standardPreset}. Which language would you prefer: English, Hindi, or Hinglish?`
      : 'Hello! I am BIS Saarthi, your assistant for Indian Standards, ISI certification, and gold hallmarking. How can I assist you today?';

    setMessages([
      {
        id: generateId(),
        sender: 'ai',
        text: greetingText,
        timestamp: getCurrentTimestamp(),
      },
    ]);
  }, [standardPreset]);

  useEffect(() => {
    if (!room) return;

    const handleConnected = () => {
      setCallState('connected');
      setAgentState('speaking');
      setTimeout(() => {
        setAgentState('listening');
      }, 3500);
    };

    const handleReconnecting = () => setCallState('reconnecting');
    const handleReconnected = () => setCallState('connected');
    const handleDisconnected = () => setCallState('disconnected');

    const handleActiveSpeakers = (speakers: Participant[]) => {
      const isRemoteSpeaking = speakers.some(
        (s) => localParticipant && s.identity !== localParticipant.identity
      );
      setAgentState(isRemoteSpeaking ? 'speaking' : 'listening');
    };

    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Reconnecting, handleReconnecting);
    room.on(RoomEvent.Reconnected, handleReconnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);

    return () => {
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Reconnecting, handleReconnecting);
      room.off(RoomEvent.Reconnected, handleReconnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);
    };
  }, [room, localParticipant]);

  const handleToggleMute = () => {
    if (localParticipant) {
      const current = localParticipant.isMicrophoneEnabled === false;
      localParticipant.setMicrophoneEnabled(current);
      setIsMuted(!current);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleReconnect = () => {
    if (room) {
      setCallState('connecting');
      room.connect(livekitUrl, token);
    }
  };

  return (
    <div className="w-full max-w-xl h-full flex flex-col items-center justify-between p-4 bg-white">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-slate-200">
        <ConnectionStatus callState={callState} agentState={agentState} />
        <Timer seconds={durationSeconds} isConnected={isConnected} />
      </div>

      {/* Main Avatar */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <Avatar agentState={agentState} audioLevel={audioLevel} />
        <AudioVisualizer agentState={agentState} audioLevel={audioLevel} />
      </div>

      {/* Transcript Window */}
      <div className="w-full mb-3">
        <Transcript messages={messages} />
      </div>

      {/* Controls */}
      <CallControls
        isMuted={isMuted}
        isSpeakerOn={isSpeakerOn}
        onToggleMute={handleToggleMute}
        onToggleSpeaker={handleToggleSpeaker}
        onReconnect={handleReconnect}
        onEndCall={onEndCall}
        isConnected={isConnected}
      />
    </div>
  );
};

export const CallScreen: React.FC<CallScreenProps> = ({
  sessionCredentials,
  onEndCall,
  standardPreset,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white text-slate-900">
      <LiveKitRoom
        serverUrl={sessionCredentials.livekitUrl}
        token={sessionCredentials.token}
        connect={true}
        audio={true}
        video={false}
        className="w-full h-full flex items-center justify-center"
      >
        <RoomAudioRenderer />
        <CallScreenInner
          livekitUrl={sessionCredentials.livekitUrl}
          token={sessionCredentials.token}
          onEndCall={onEndCall}
          standardPreset={standardPreset}
        />
      </LiveKitRoom>
    </div>
  );
};
