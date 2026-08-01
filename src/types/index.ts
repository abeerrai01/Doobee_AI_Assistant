export interface StartSessionResponse {
  status: string;
  message: string;
  livekitUrl: string;
  token: string;
  roomName: string;
  identity: string;
}

export type CallState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export type AgentState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking';

export interface TranscriptMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isFinal?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  color: string;
  badge?: string;
  popularServices: string[];
}

export interface BookingPayload {
  serviceType: string;
  userAddress?: string;
  scheduledTime?: string;
  description?: string;
  contactNumber?: string;
}

export interface WorkerInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  service: string;
  estimatedArrival: string;
  avatarUrl?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  serviceType: string;
  status: 'confirmed' | 'pending' | 'assigned';
  worker?: WorkerInfo;
  createdAt: string;
}
