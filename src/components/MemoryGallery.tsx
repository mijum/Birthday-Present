import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';
import { MemoryItem } from '../types/birthday';
import { RomanticButton } from './RomanticButton';

interface MemoryGalleryProps {
  memories: MemoryItem[];
  onComplete: () => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ memories, onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxMemory, setLightboxMemory] = useState<MemoryItem | null>(null);

  const isLastMemory = activeIndex === memories.length - 1;
  const currentMemory = memories[activeIndex];

  // Preload all memory photos immediately for instant switching
  React.useEffect(() => {
    memories.forEach((mem) => {
      if (mem.imageUrl) {
        const img = new Image();
        img.src = mem.imageUrl;
      }
    });
  }, [memories]);

  const handleNext = () => {
    if (isLastMemory) {
      // Proceed to the next scene (The Birthday Cake & Candles)
      onComplete();
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : memories.length - 1));
  };

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-between px-3 py-3 sm:py-6 text-center">
      {/* Header */}
      <div className="space-y-1 mb-2">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide text-[#fce8ee]"
        >
          Little Moments, Endless Memories ♡
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-serif text-xs sm:text-sm md:text-base italic text-[#e0a8b9]"
        >
          Every moment with you is a memory worth keeping.
        </motion.p>
      </div>

      {/* Main Photographic Album Card Display (Compact & Mobile-Optimized) */}
      <div className="relative w-full max-w-md my-1 sm:my-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl bg-[#faf5ee] p-3 sm:p-4 shadow-[0_16px_40px_rgba(10,2,8,0.5),0_0_0_1px_rgba(255,255,255,0.15)] text-left"
            onClick={() => setLightboxMemory(currentMemory)}
          >
            {/* Photographic Viewport */}
            <div className="relative aspect-[4/3] w-full max-h-[280px] sm:max-h-[340px] overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#451426] to-[#200813]">
              {currentMemory.imageUrl ? (
                <img
                  key={currentMemory.imageUrl}
                  src={currentMemory.imageUrl}
                  alt={currentMemory.title}
                  loading="eager"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                /* Editorial Fallback Artistic Canvas */
                <div
                  className="relative flex h-full w-full flex-col items-center justify-center p-4 text-center overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${currentMemory.accentColor || '#e8a4b8'}30 0%, #200813 100%)`,
                  }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#fce4ec]/10 border border-[#fce4ec]/30 backdrop-blur-sm text-[#fcd8e3] shadow-md mb-2">
                      <Sparkles className="h-6 w-6 text-[#dfb285]" />
                    </div>
                    <span className="font-serif text-lg sm:text-2xl font-medium text-[#faebf0] tracking-wide">
                      {currentMemory.title}
                    </span>
                    <span className="mt-1 text-[10px] sm:text-xs text-[#e8b5c4] font-sans tracking-widest uppercase">
                      Tap to view memory
                    </span>
                  </div>
                </div>
              )}

              {/* Memory Index Pill */}
              <div className="absolute top-2.5 left-2.5 rounded-full bg-black/50 px-2.5 py-0.5 font-mono text-[11px] text-[#fce8ee] backdrop-blur-md border border-white/20">
                {activeIndex + 1} / {memories.length}
              </div>
            </div>

            {/* Caption & Metadata */}
            <div className="pt-2.5 pb-1 px-1">
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#401222] tracking-wide">
                {currentMemory.title}
              </h3>
              <p className="mt-0.5 font-serif text-sm sm:text-base italic text-[#6e2c3e]">
                "{currentMemory.caption}"
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] sm:text-xs font-sans text-[#8f495c]">
                {currentMemory.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#dfb285]" />
                    {currentMemory.date}
                  </span>
                )}
                {currentMemory.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#dfb285]" />
                    {currentMemory.location}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Buttons Bar */}
        <div className="mt-3 flex items-center justify-between px-1">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous memory"
            className="relative flex h-13 w-13 min-h-[50px] min-w-[50px] items-center justify-center rounded-full bg-[#351222]/90 text-[#fce8ee] border border-[#e8a2b5]/40 shadow-md hover:bg-[#4c1830] active:scale-95 transition-all touch-manipulation after:absolute after:-inset-2.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {memories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to memory ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 touch-manipulation after:absolute after:-inset-2 after:content-[''] ${
                  idx === activeIndex
                    ? 'w-7 bg-[#dfb285]'
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Next Button — If on the last memory, it directly says 'Make a Wish' or leads to Scene 4! */}
          {isLastMemory ? (
            <button
              onClick={onComplete}
              aria-label="Go to Make a Wish scene"
              className="relative flex items-center gap-2 px-5 min-h-[50px] rounded-full bg-gradient-to-r from-[#94314e] to-[#b64b67] text-[#fff6f4] shadow-[0_4px_18px_rgba(182,75,103,0.45)] border border-[#e5a4b4]/60 hover:scale-105 active:scale-95 text-sm font-sans font-semibold transition-all touch-manipulation after:absolute after:-inset-2.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
            >
              <span>Make a Wish</span>
              <Heart className="h-4 w-4 fill-[#ffd1dc] text-[#ffd1dc]" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              aria-label="Next memory"
              className="relative flex h-13 w-13 min-h-[50px] min-w-[50px] items-center justify-center rounded-full bg-[#351222]/90 text-[#fce8ee] border border-[#e8a2b5]/40 shadow-md hover:bg-[#4c1830] active:scale-95 transition-all touch-manipulation after:absolute after:-inset-2.5 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Prominent Next Scene Action Button with safe-area bottom bounds */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 sm:mt-5 flex flex-col items-center space-y-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]"
      >
        <p className="font-serif text-sm sm:text-base text-[#f2cad6] italic">
          {isLastMemory
            ? "Ready for your birthday cake & candles?"
            : "And now, it's time to make another beautiful memory..."}
        </p>
        <RomanticButton onClick={onComplete}>
          Make a Wish ♡
        </RomanticButton>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-xl w-full rounded-2xl bg-[#faf5ee] p-5 text-left shadow-2xl text-[#3a1d29]"
            >
              <button
                onClick={() => setLightboxMemory(null)}
                aria-label="Close memory view"
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#4a1c2d]/10 hover:bg-[#4a1c2d]/20 text-[#4a1c2d] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-[#451426] to-[#200813] overflow-hidden flex items-center justify-center mb-3">
                {lightboxMemory.imageUrl ? (
                  <img
                    src={lightboxMemory.imageUrl}
                    alt={lightboxMemory.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center p-6 text-center">
                    <Sparkles className="h-8 w-8 text-[#dfb285] mb-2" />
                    <span className="font-serif text-2xl font-medium text-[#fce8ee]">
                      {lightboxMemory.title}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-serif text-xl font-bold text-[#591b2c]">
                {lightboxMemory.title}
              </h3>
              <p className="mt-1 font-serif text-base italic text-[#6e2c3e]">
                "{lightboxMemory.caption}"
              </p>
              <div className="mt-3 flex gap-3 text-xs font-sans text-[#8f495c]">
                {lightboxMemory.date && <span>{lightboxMemory.date}</span>}
                {lightboxMemory.location && <span>· {lightboxMemory.location}</span>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
