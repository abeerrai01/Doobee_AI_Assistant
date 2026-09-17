/**
 * Audio constraints configuration for crystal clear voice processing in BIS Saarthi
 */
export function getRecommendedAudioPublishOptions() {
  return {
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true,
  };
}
