import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { RomanticButton } from '../components/RomanticButton';
import { BIRTHDAY_CONFIG } from '../config/birthday';

interface IntroSceneProps {
  onContinue: () => void;
  onUserInteraction: () => void;
}

export const IntroScene: React.FC<IntroSceneProps> = ({ onContinue, onUserInteraction }) => {
  const messages = BIRTHDAY_CONFIG.introMessages;
  const [visibleCount, setVisibleCount] = useState<number>(1);

  // Sequentially reveal introductory messages with emotional pacing
  useEffect(() => {
    if (visibleCount < messages.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, messages.length]);

  const allMessagesRevealed = visibleCount >= messages.length;

  const handleStart = () => {
    onUserInteraction();
    onContinue();
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between px-4 sm:px-6 pt-[max(2rem,env(safe-area-inset-top,2rem))] pb-[max(2.5rem,env(safe-area-inset-bottom,2.5rem))] text-center select-none overflow-y-auto">
      {/* Subtle Top Accent */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-2 text-xs md:text-sm font-sans tracking-widest uppercase text-[#e5a4b4]/80"
      >
        <span>A Birthday Story</span>
        <span aria-hidden="true">·</span>
        <span>For {BIRTHDAY_CONFIG.herName}</span>
      </motion.div>

      {/* Center Cinematic Typography */}
      <div className="my-auto max-w-2xl w-full flex flex-col items-center space-y-6">
        {/* Glowing Center Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#691c34]/50 to-[#992d4c]/30 border border-[#e5a4b4]/40 shadow-[0_0_40px_rgba(229,164,180,0.25)]"
        >
          <motion.div
            animate={{ scale: [1, 1.14, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="h-9 w-9 text-[#fce8ee] fill-[#fce8ee]/80" />
          </motion.div>
        </motion.div>

        {/* Story Text Reveal Stream */}
        <div className="space-y-4 min-h-[190px] flex flex-col items-center justify-center">
          <AnimatePresence>
            {messages.slice(0, visibleCount).map((msg, idx) => {
              const isLatest = idx === visibleCount - 1;
              return (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{
                    opacity: isLatest ? 1 : 0.65,
                    y: 0,
                    scale: isLatest ? 1.02 : 0.98,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-serif tracking-wide text-balance ${
                    idx === 0
                      ? 'text-2xl sm:text-3xl md:text-4xl text-[#dfb285] italic font-medium'
                      : idx === messages.length - 1
                      ? 'text-xl sm:text-2xl md:text-3xl text-[#fff0f4] font-medium'
                      : 'text-lg sm:text-xl md:text-2xl text-[#f3cbd6]'
                  }`}
                >
                  {msg}
                </motion.p>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="min-h-[64px] flex items-center justify-center z-10">
        <AnimatePresence>
          {allMessagesRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <RomanticButton onClick={handleStart}>
                Read My Letter ♡
              </RomanticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
