import { useState, useEffect, useRef, useCallback } from 'react';
import { MicState } from '../types/birthday';
import { romanticAudio } from '../utils/audioSynthesizer';

interface UseBlowDetectionProps {
  onBlowingExtinguished?: () => void;
  candleCount?: number;
}

export function useBlowDetection({ onBlowingExtinguished, candleCount = 6 }: UseBlowDetectionProps = {}) {
  const [micState, setMicState] = useState<MicState>('NOT_REQUESTED');
  const [audioLevel, setAudioLevel] = useState<number>(0); // 0 to 1 for visual reactivity
  const [extinguishedCandles, setExtinguishedCandles] = useState<boolean[]>(
    new Array(candleCount).fill(false)
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sustainedBlowCounterRef = useRef<number>(0);
  const hasTriggeredExtinguishRef = useRef<boolean>(false);

  // Clean up all audio inputs
  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    setMicState((prev) => (prev === 'LISTENING' || prev === 'REQUESTING' ? 'NOT_REQUESTED' : prev));
  }, []);

  // Staggered candle extinguishing sequence
  const triggerExtinguishSequence = useCallback(() => {
    if (hasTriggeredExtinguishRef.current) return;
    hasTriggeredExtinguishRef.current = true;

    setMicState('BLOWING_DETECTED');
    romanticAudio.playCandleBlowSound();

    // Extinguish candles in a natural, organic staggered order (e.g. from center outwards)
    const order = [2, 3, 1, 4, 0, 5];
    order.forEach((index, step) => {
      setTimeout(() => {
        setExtinguishedCandles((prev) => {
          const next = [...prev];
          if (index < next.length) {
            next[index] = true;
          }
          return next;
        });
      }, 180 * (step + 1));
    });

    const totalExtinguishDuration = 180 * (candleCount + 1) + 400;
    setTimeout(() => {
      setMicState('EXTINGUISHED');
      romanticAudio.playCelebrationChime();
      stopListening();
      if (onBlowingExtinguished) {
        onBlowingExtinguished();
      }
    }, totalExtinguishDuration);
  }, [candleCount, onBlowingExtinguished, stopListening]);

  // Request microphone and start real-time blow analysis
  const requestMicAndListen = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicState('UNAVAILABLE');
      return;
    }

    try {
      setMicState('REQUESTING');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      // Filter specifically targeting breath/wind turbulent frequencies (100Hz - 800Hz)
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(250, audioCtx.currentTime);
      bandpass.Q.setValueAtTime(0.7, audioCtx.currentTime);

      source.connect(bandpass);
      bandpass.connect(analyser);

      setMicState('LISTENING');
      sustainedBlowCounterRef.current = 0;

      const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);

      const checkAudio = () => {
        if (!analyserRef.current || hasTriggeredExtinguishRef.current) return;

        analyserRef.current.getByteTimeDomainData(timeDomainData);
        analyserRef.current.getByteFrequencyData(frequencyData);

        // Calculate Root Mean Square (RMS) volume
        let sumSquares = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          const normalized = (timeDomainData[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / timeDomainData.length);

        // Normalize level for UI feedback (0 to 1) with higher sensitivity
        const reactiveLevel = Math.min(1, Math.max(0, rms * 7.5));
        setAudioLevel(reactiveLevel);

        // Calculate low-frequency turbulent breath wind energy
        let lowFreqSum = 0;
        const binCount = Math.min(12, frequencyData.length);
        for (let i = 1; i < binCount; i++) {
          lowFreqSum += frequencyData[i];
        }
        const avgLowFreq = lowFreqSum / (binCount - 1);

        // Soft, gentle blow threshold (easily triggered by soft exhale or breath)
        const isGentleBlow = rms > 0.07 || avgLowFreq > 55;

        if (isGentleBlow) {
          sustainedBlowCounterRef.current += 1;
          // ~3 consecutive frames (~50ms) of gentle breath triggers extinguishing
          if (sustainedBlowCounterRef.current >= 3) {
            triggerExtinguishSequence();
            return;
          }
        } else {
          sustainedBlowCounterRef.current = Math.max(0, sustainedBlowCounterRef.current - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };

      animationFrameRef.current = requestAnimationFrame(checkAudio);
    } catch (err) {
      console.warn('Microphone permission or hardware error:', err);
      setMicState('PERMISSION_DENIED');
    }
  }, [triggerExtinguishSequence]);

  // Fallback trigger (instant manual blow)
  const triggerManualBlow = useCallback(() => {
    triggerExtinguishSequence();
  }, [triggerExtinguishSequence]);

  // Reset candle state
  const resetCandles = useCallback(() => {
    stopListening();
    hasTriggeredExtinguishRef.current = false;
    sustainedBlowCounterRef.current = 0;
    setExtinguishedCandles(new Array(candleCount).fill(false));
    setMicState('NOT_REQUESTED');
    setAudioLevel(0);
  }, [candleCount, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    micState,
    audioLevel,
    extinguishedCandles,
    allExtinguished: extinguishedCandles.every(Boolean),
    requestMicAndListen,
    stopListening,
    triggerManualBlow,
    resetCandles,
  };
}
