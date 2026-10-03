import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { LetterContent } from '../types/birthday';
import { romanticAudio } from '../utils/audioSynthesizer';
import { BIRTHDAY_CONFIG } from '../config/birthday';

interface MobileRomanticLetterProps {
  content: LetterContent;
  onContinue: () => void;
  continueButtonText: string;
  senderName?: string;
  initialOpen?: boolean;
}

export const MobileRomanticLetter: React.FC<MobileRomanticLetterProps> = ({
  content,
  onContinue,
  continueButtonText,
  senderName = BIRTHDAY_CONFIG.yourName || 'Your Secret Admirer',
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    romanticAudio.playEnvelopeOpenSound();
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[390px] flex-col items-center justify-center px-2 py-2 sm:py-6 select-none">
      {/* Outer Mobile Frame resembling the letter2.jpg phone presentation */}
      <div className="relative w-full rounded-[38px] bg-[#faf6ee] p-4 sm:p-6 shadow-[0_25px_60px_rgba(15,3,10,0.65),0_0_0_1px_rgba(255,255,255,0.4)] text-[#3a1d28] overflow-hidden border border-[#ead5cb]">
        {/* Soft background glow within the card */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fffaf2] via-[#faf4eb] to-[#f5ede2]" />

        {/* Floating watercolor hearts cluster around top of letter (matching letter2.jpg) */}
        <div className="pointer-events-none absolute top-3 inset-x-6 h-24 flex justify-center z-40">
          <div className="relative w-full max-w-[280px]">
            <span className="absolute -top-1 left-2 h-6 w-6 text-[#f06292]/80 opacity-90 rotate-[-15deg]"><Heart className="fill-current w-full h-full" /></span>
            <span className="absolute top-2 left-9 h-4 w-4 text-[#ec407a]/70 rotate-[10deg]"><Heart className="fill-current w-full h-full" /></span>
            <span className="absolute -top-2 left-18 h-5 w-5 text-[#f48fb1]/85 rotate-[-8deg]"><Heart className="fill-current w-full h-full" /></span>
            <span className="absolute -top-3 right-20 h-6 w-6 text-[#e91e63]/75 rotate-[12deg]"><Heart className="fill-current w-full h-full" /></span>
            <span className="absolute top-1 right-10 h-4 w-4 text-[#f06292]/70 rotate-[-18deg]"><Heart className="fill-current w-full h-full" /></span>
            <span className="absolute -top-1 right-2 h-7 w-7 text-[#ec407a]/85 rotate-[15deg]"><Heart className="fill-current w-full h-full" /></span>
            <span className="absolute top-8 left-1 h-4 w-4 text-[#f48fb1]/60 rotate-[-25deg]"><Heart className="fill-current w-full h-full" /></span>
            <span className="absolute top-8 right-1 h-5 w-5 text-[#f06292]/65 rotate-[20deg]"><Heart className="fill-current w-full h-full" /></span>
          </div>
        </div>

        {/* PARCHMENT LETTER SHEET */}
        <motion.div
          animate={
            isOpen
              ? { y: 0, scale: 1 }
              : { y: 35, scale: 0.96 }
          }
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`relative ${
            isOpen ? 'z-30' : 'z-10'
          } mx-auto w-full rounded-2xl bg-[#fdfaf2] p-4 sm:p-5 shadow-[0_4px_16px_rgba(80,50,40,0.12)] border border-[#e8d5be] ${
            isOpen
              ? 'max-h-[62vh] overflow-y-auto custom-scrollbar pb-36 sm:pb-40'
              : 'h-[230px] overflow-hidden'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 100% 0%, rgba(247, 219, 224, 0.25) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(250, 230, 210, 0.25) 0%, transparent 60%)`,
            boxShadow: 'inset 0 0 20px rgba(220,180,140,0.2), 0 8px 24px rgba(60,20,30,0.12)',
          }}
        >
          {/* Deckled Edge Feather Texture */}
          <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-[#dfc4a8]/50 rounded-2xl" />

          {/* Salutation */}
          <div className="relative text-center pb-2">
            <h3 className="font-serif italic text-xl sm:text-2xl font-semibold text-[#541629] tracking-wide">
              {content.salutation}
            </h3>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-3 pt-2 text-left">
            {content.paragraphs.map((para, idx) => (
              <p
                key={idx}
                className="font-serif text-sm sm:text-base leading-relaxed text-[#3f1f2a]/95 font-normal"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Sign-off & Signature */}
          <div className="mt-4 pt-3 border-t border-[#ebd0be]/70 text-center space-y-1">
            <p className="font-serif text-base italic text-[#541629]">
              {content.signOff}
            </p>
            <p className="font-serif text-sm sm:text-base font-semibold text-[#78283d] whitespace-pre-line">
              {content.signature}
            </p>
          </div>

          {/* Pill Action Button — Generous breathing room, expanded touch target with after:-inset-3.5 */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex justify-center pb-8 relative z-50 pointer-events-auto"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onContinue();
                }}
                className="group relative inline-flex items-center justify-center gap-2.5 px-9 py-4 min-h-[54px] min-w-[220px] rounded-full bg-gradient-to-r from-[#94314e] via-[#b64b67] to-[#862540] text-[#fff5f7] font-sans text-sm sm:text-base font-semibold tracking-wide shadow-[0_6px_25px_rgba(148,49,78,0.5)] hover:shadow-[0_8px_30px_rgba(148,49,78,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer touch-manipulation after:absolute after:-inset-3.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
              >
                <span>{continueButtonText}</span>
                <span className="text-[#ffd1dc] group-hover:translate-x-0.5 transition-transform">♡</span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* ENVELOPE BASE */}
        {/* Recedes downward and completely disables pointer events when open so it never blocks taps */}
        <motion.div
          animate={{
            y: isOpen ? 60 : 0,
            opacity: isOpen ? 0.75 : 1,
          }}
          transition={{ duration: 0.5 }}
          className={`relative z-10 -mt-16 sm:-mt-20 w-full transition-all ${
            isOpen ? 'pointer-events-none' : 'cursor-pointer hover:scale-[1.01]'
          }`}
          onClick={!isOpen ? handleOpen : undefined}
          role="button"
          tabIndex={!isOpen ? 0 : -1}
          onKeyDown={(e) => {
            if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleOpen();
            }
          }}
          aria-label="Open letter envelope"
        >
          {/* White / Cream Envelope Shell */}
          <div className="relative w-full aspect-[16/10] max-h-[170px] rounded-b-3xl bg-[#f5efe6] shadow-[0_12px_30px_rgba(40,10,20,0.18)] border-b border-x border-[#e8ded3] overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: 'polygon(0% 0%, 50% 52%, 100% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(to bottom, #f0e7db, #f7f1e7)',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                clipPath: 'polygon(0% 0%, 50% 52%, 0% 100%)',
                background: 'linear-gradient(to right, rgba(0,0,0,0.06), transparent)',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                clipPath: 'polygon(100% 0%, 50% 52%, 100% 100%)',
                background: 'linear-gradient(to left, rgba(0,0,0,0.06), transparent)',
              }}
            />

            {/* Watercolor Pink/Red Heart Seal in Center */}
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
              <motion.div
                animate={
                  !isOpen
                    ? { scale: [1, 1.14, 1] }
                    : { scale: 0.95 }
                }
                transition={{ duration: 2, repeat: !isOpen ? Infinity : 0, ease: 'easeInOut' }}
                className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center drop-shadow-[0_4px_10px_rgba(220,60,90,0.35)]"
              >
                <Heart className="h-12 w-12 sm:h-14 sm:w-14 text-[#e63956] fill-[#e63956]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Heart className="h-7 w-7 text-[#ff8fa3]/60 fill-[#ff8fa3]/60" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer Typography & Open Prompt */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex flex-col items-center text-center space-y-1 cursor-pointer touch-manipulation"
            onClick={handleOpen}
          >
            <p className="font-serif italic text-lg sm:text-xl font-medium text-[#4a1828]">
              From: {senderName}
            </p>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-sans text-[#78283d] font-medium tracking-wide">
              <span>Tap to Open</span>
              <Heart className="h-3 w-3 text-[#e63956] fill-[#e63956] animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
