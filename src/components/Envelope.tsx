import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynthesizer';

interface EnvelopeProps {
  onOpenComplete: () => void;
  title?: string;
  sealLabel?: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  onOpenComplete,
  title = 'A letter written just for you',
  sealLabel = 'Tap to open',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    romanticAudio.playEnvelopeOpenSound();

    setTimeout(() => {
      onOpenComplete();
    }, 1100);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-3 sm:p-4 max-w-lg w-full">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mb-5 sm:mb-6 font-serif text-lg sm:text-2xl text-[#fce8ee] tracking-wider text-center"
      >
        {title}
      </motion.p>

      {/* Luxury Stationery Flatlay Presentation (Using letter.jpg) */}
      <div
        className="group relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(20,5,15,0.6),0_0_0_1px_rgba(235,190,195,0.3)] transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        aria-label="Open birthday letter envelope"
      >
        {/* letter.jpg realistic flatlay image */}
        <img
          src="/letter.jpg"
          alt="Vintage letter with wax seal and pink roses"
          className={`h-full w-full object-cover transition-all duration-700 ${
            isOpen ? 'scale-110 filter blur-[2px] opacity-80' : 'scale-100 group-hover:scale-105'
          }`}
        />

        {/* Soft vignette and romantic lighting gradient over the image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#200814]/70 via-transparent to-[#200814]/30" />

        {/* Letter paper sliding out animation when opened */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.9 }}
              animate={{ y: -20, opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-6 top-8 bottom-8 rounded-2xl bg-[#faf5ee] shadow-2xl p-5 border border-[#e5ccd3] flex flex-col justify-center space-y-2.5 z-30"
            >
              <div className="h-2.5 w-32 bg-[#94314e]/40 rounded-full" />
              <div className="h-2 w-full bg-[#94314e]/20 rounded-full" />
              <div className="h-2 w-5/6 bg-[#94314e]/20 rounded-full" />
              <div className="h-2 w-4/6 bg-[#94314e]/20 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Wax Stamp Action Indicator (Centered on the ribbon wax seal) */}
        {!isOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#d46a84]/90 via-[#992d4c]/90 to-[#591428]/95 shadow-[0_6px_22px_rgba(89,20,40,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-[#ffccd8]/60"
            >
              <Heart className="h-7 w-7 text-[#fff0f4] fill-[#fff0f4]" />

              {/* Glowing Pulse Halo */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#ffd3de]"
                animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <span className="mt-3 text-xs font-sans font-medium tracking-widest uppercase text-[#fff0f4] bg-[#220712]/85 px-4 py-1 rounded-full border border-[#e8a2b5]/40 shadow-lg backdrop-blur-sm">
              {sealLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
