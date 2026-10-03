import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RotateCcw } from 'lucide-react';
import { MobileRomanticLetter } from '../components/MobileRomanticLetter';
import { BIRTHDAY_CONFIG } from '../config/birthday';

interface FinalLetterSceneProps {
  onRestart: () => void;
}

export const FinalLetterScene: React.FC<FinalLetterSceneProps> = ({ onRestart }) => {
  const [readingFinished, setReadingFinished] = useState(false);

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-3 py-4 sm:py-8 select-none overflow-y-auto">
      {!readingFinished ? (
        <MobileRomanticLetter
          content={BIRTHDAY_CONFIG.finalLetter}
          onContinue={() => setReadingFinished(true)}
          continueButtonText="With All My Heart ♡"
          senderName={BIRTHDAY_CONFIG.yourName || 'Your Love'}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto flex w-full max-w-[390px] flex-col items-center justify-center rounded-[38px] bg-[#faf6ee] p-7 text-[#3a1d28] shadow-[0_25px_60px_rgba(15,3,10,0.65)] border border-[#ead5cb] text-center space-y-5"
        >
          {/* Pulsing Heart Emblem */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e63956] to-[#d81e5b] text-white shadow-[0_8px_25px_rgba(230,57,86,0.45)]"
          >
            <Heart className="h-8 w-8 fill-current" />
          </motion.div>

          <h3 className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-[#541629]">
            Happy Birthday, My Love. ♡
          </h3>

          <p className="font-serif text-base sm:text-lg italic text-[#6e2c3e] leading-relaxed">
            "Forever a beautiful part of my story."
          </p>

          <div className="pt-3">
            <button
              onClick={onRestart}
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#94314e] to-[#b64b67] text-[#fff5f7] text-xs sm:text-sm font-sans font-medium tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
            >
              <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-90" />
              <span>Experience Again</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
