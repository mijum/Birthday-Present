import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Wind, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BirthdayCake } from '../components/BirthdayCake';
import { RomanticButton } from '../components/RomanticButton';
import { useBlowDetection } from '../hooks/useBlowDetection';
import { BIRTHDAY_CONFIG } from '../config/birthday';

interface CakeSceneProps {
  onContinue: () => void;
}

export const CakeScene: React.FC<CakeSceneProps> = ({ onContinue }) => {
  const [showCelebrationMessage, setShowCelebrationMessage] = useState(false);

  const {
    micState,
    audioLevel,
    extinguishedCandles,
    allExtinguished,
    requestMicAndListen,
    stopListening,
    triggerManualBlow,
  } = useBlowDetection({
    candleCount: BIRTHDAY_CONFIG.candleCount,
    onBlowingExtinguished: () => {
      setShowCelebrationMessage(true);
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285', '#ef476f'],
        disableForReducedMotion: true,
      });
    },
  });

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between px-4 pt-6 pb-[max(2rem,env(safe-area-inset-bottom,2rem))] select-none overflow-y-auto">
      {/* Header & Prompt */}
      <div className="space-y-2 text-center max-w-lg z-20">
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide text-[#fce8ee]"
        >
          {allExtinguished ? 'Your Wish is Made! ♡' : 'Make a Wish, Birthday Girl! ♡'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-base sm:text-lg italic text-[#e0a8b9]"
        >
          {allExtinguished
            ? 'May every wish you make come true. ♡'
            : 'Close your eyes, make a silent wish, and blow out the candles...'}
        </motion.p>
      </div>

      {/* Centerpiece Birthday Cake with 6 Candles */}
      <div className="my-auto relative flex flex-col items-center justify-center py-6">
        <BirthdayCake
          candleCount={BIRTHDAY_CONFIG.candleCount}
          extinguishedCandles={extinguishedCandles}
          audioLevel={audioLevel}
          mode="candles"
        />

        {/* Real-time blowing air indicator gauge if listening */}
        {micState === 'LISTENING' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 text-xs font-sans text-[#fce8ee] bg-[#3a1324]/80 px-4 py-1.5 rounded-full border border-[#e5a4b4]/30 backdrop-blur-sm shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>Microphone listening — blow gently into your mic!</span>
            </div>

            {/* Audio reactivity visualizer meter */}
            <div className="w-48 h-1.5 bg-[#4c1c2e]/60 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#dfb285] to-[#f472b6] transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(8, audioLevel * 100))}%` }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls / Interaction Bar */}
      <div className="min-h-[85px] w-full max-w-md flex flex-col items-center justify-center z-20 space-y-3">
        {allExtinguished || showCelebrationMessage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center space-y-3 text-center"
          >
            <RomanticButton onClick={onContinue}>
              Cut the Cake ♡
            </RomanticButton>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Primary / Fallback Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {micState === 'NOT_REQUESTED' && (
                <button
                  onClick={requestMicAndListen}
                  className="relative flex items-center gap-2 px-6 py-3 min-h-[50px] rounded-full bg-[#4a182d] hover:bg-[#5e203a] text-[#fce8ee] border border-[#e8a2b5]/40 text-sm font-sans font-semibold transition-all shadow-md touch-manipulation after:absolute after:-inset-2.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
                >
                  <Mic className="h-4 w-4 text-[#dfb285]" />
                  <span>Blow with Microphone</span>
                </button>
              )}

              {micState === 'LISTENING' && (
                <button
                  onClick={stopListening}
                  className="relative flex items-center gap-1.5 px-5 py-2.5 min-h-[46px] rounded-full bg-black/50 hover:bg-black/70 text-[#e8b5c4] text-xs sm:text-sm font-sans font-medium transition-colors touch-manipulation after:absolute after:-inset-2 after:content-['']"
                >
                  <MicOff className="h-4 w-4" />
                  <span>Stop Listening</span>
                </button>
              )}

              {/* Instant Manual Fallback Button (Always Available) */}
              <button
                onClick={triggerManualBlow}
                className="relative flex items-center gap-2.5 px-7 py-3 min-h-[50px] rounded-full bg-gradient-to-r from-[#94314e] to-[#b64b67] text-[#fff6f4] shadow-[0_4px_18px_rgba(182,75,103,0.45)] border border-[#e5a4b4]/50 hover:scale-[1.02] active:scale-[0.98] text-sm font-sans font-semibold transition-transform touch-manipulation after:absolute after:-inset-2.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
              >
                <Wind className="h-4 w-4 text-[#dfb285]" />
                <span>Blow Out Candles</span>
              </button>
            </div>

            {/* Microphone Permission Status & Feedback */}
            {micState === 'REQUESTING' && (
              <span className="text-xs text-[#e8bed0] animate-pulse font-sans">
                Please allow microphone access when prompted...
              </span>
            )}

            {micState === 'PERMISSION_DENIED' && (
              <div className="flex items-center gap-2 text-xs text-[#fca5a5] font-sans">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Microphone access was denied. You can tap "Blow Out Candles" directly!</span>
              </div>
            )}

            {micState === 'UNAVAILABLE' && (
              <span className="text-xs text-[#fce8ee]/70 font-sans">
                Microphone not supported on this browser. Use the button above!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
