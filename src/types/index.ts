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

export type BISSchemeType =
  | 'Scheme-I (ISI Mark)'
  | 'Scheme-II (Simplified)'
  | 'CRS (Electronics)'
  | 'FMCS (Foreign Manufacturers)'
  | 'Hallmarking (6-Digit HUID)'
  | 'Eco Mark'
  | 'General Standards Guidance';

export interface BISDepartmentInfo {
  code: string;
  name: string;
  description: string;
  exampleStandard: string;
}

export interface BISInquirySummary {
  inquiryId: string;
  inquiryDate: string;
  topic: string;
  detectedStandard?: string;
  standardTitle?: string;
  departmentCode?: string;
  departmentName?: string;
  scheme: BISSchemeType;
  mandatoryStatus: 'Mandatory (QCO)' | 'Voluntary' | 'Verification Required';
  keyGuidance: string[];
  officialPortals: { name: string; url: string }[];
  verificationMethod: string;
  notes: string;
  createdAt: string;
}
