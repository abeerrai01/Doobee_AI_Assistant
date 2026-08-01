import { useState, useEffect, useRef } from 'react';

export function useAudioLevel(
  isSpeaking: boolean,
  agentState: 'idle' | 'listening' | 'thinking' | 'speaking'
) {
  const [level, setLevel] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let phase = 0;

    const animate = () => {
      phase += 0.1;
      if (agentState === 'speaking') {
        // Dynamic active speech waveform pattern
        const base = 0.5 + Math.sin(phase * 1.5) * 0.3;
        const noise = Math.random() * 0.2;
        setLevel(Math.min(1, Math.max(0.2, base + noise)));
      } else if (agentState === 'listening') {
        // User speaking waveform pattern
        const base = 0.4 + Math.cos(phase * 2) * 0.3;
        const noise = Math.random() * 0.15;
        setLevel(Math.min(1, Math.max(0.15, base + noise)));
      } else if (agentState === 'thinking') {
        // Smooth gentle breathing pulse
        setLevel(0.2 + Math.sin(phase * 0.8) * 0.1);
      } else {
        // Subtle idle micro-wave
        setLevel(0.05 + Math.sin(phase * 0.4) * 0.03);
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isSpeaking, agentState]);

  return level;
}
