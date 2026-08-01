import { StartSessionResponse } from '../types';

const BACKEND_URL = 'https://theabeerrai-payal-2-0.hf.space/start';

/**
 * Calls the backend POST endpoint to initiate a LiveKit voice session.
 * Returns livekitUrl, token, roomName, and identity.
 */
export async function startVoiceSession(): Promise<StartSessionResponse> {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to start session: ${response.status} ${response.statusText}`);
    }

    const data: StartSessionResponse = await response.json();

    if (data.status !== 'success' || !data.token || !data.livekitUrl) {
      throw new Error(data.message || 'Invalid session credentials received from backend');
    }

    return data;
  } catch (error: any) {
    console.error('API Error starting voice session:', error);
    throw new Error(error?.message || 'Network error connecting to Doobee AI backend');
  }
}
