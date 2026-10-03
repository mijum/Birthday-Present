import React from 'react';
import { motion } from 'motion/react';
import { LetterContent } from '../types/birthday';

interface LetterCardProps {
  content: LetterContent;
  onContinue: () => void;
  continueButtonText: string;
  isRevealed: boolean;
}

export const LetterCard: React.FC<LetterCardProps> = ({
  content,
  onContinue,
  continueButtonText,
  isRevealed,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto flex w-full max-w-xl flex-col rounded-3xl bg-[#faf5ee] p-7 md:p-11 text-[#301622] shadow-[0_20px_60px_rgba(20,5,15,0.45),0_0_0_1px_rgba(235,190,195,0.6)]"
      style={{
        backgroundImage: `radial-gradient(circle at 100% 0%, rgba(247, 219, 224, 0.3) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(250, 230, 210, 0.3) 0%, transparent 60%)`,
      }}
    >
      {/* Decorative Golden Corner Flourishes */}
      <div className="pointer-events-none absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-[#dfb285]/60 rounded-tl-lg" />
      <div className="pointer-events-none absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-[#dfb285]/60 rounded-tr-lg" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-[#dfb285]/60 rounded-bl-lg" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[#dfb285]/60 rounded-br-lg" />

      {/* Scrollable Letter Body */}
      <div className="custom-scrollbar max-h-[58vh] overflow-y-auto pr-2 md:pr-4 space-y-5 text-left">
        {/* Salutation */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-serif text-2xl md:text-3xl font-medium tracking-wide text-[#591b2c] italic"
        >
          {content.salutation}
        </motion.p>

        {/* Paragraphs with sequenced fade */}
        <div className="space-y-4">
          {content.paragraphs.map((para, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.25, duration: 0.7 }}
              className="font-serif text-base md:text-lg leading-relaxed text-[#3a1d29]/90 font-normal"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Sign-off & Signature */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4 + content.paragraphs.length * 0.25,
            duration: 0.7,
          }}
          className="pt-4 border-t border-[#ebccd2]/70 space-y-1"
        >
          <p className="font-serif text-lg md:text-xl italic text-[#591b2c]">
            {content.signOff}
          </p>
          <p className="font-serif text-base md:text-lg whitespace-pre-line text-[#78283d] font-semibold">
            {content.signature}
          </p>
        </motion.div>
      </div>

      {/* Continue Action Button */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={onContinue}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7a1e36] to-[#9b2c4c] text-[#fff5f7] font-sans text-sm md:text-base font-medium tracking-wide shadow-[0_6px_22px_rgba(122,30,54,0.35)] hover:shadow-[0_8px_28px_rgba(122,30,54,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
          >
            <span>{continueButtonText}</span>
            <span className="text-[#f7c0cc] transition-transform group-hover:translate-x-0.5">
              ♡
            </span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
