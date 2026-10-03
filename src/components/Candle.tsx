import React from 'react';
import { motion } from 'motion/react';

interface CandleProps {
  index: number;
  isExtinguished: boolean;
  audioLevel?: number; // 0 to 1 reactivity while blowing
}

export const Candle: React.FC<CandleProps> = ({
  index,
  isExtinguished,
  audioLevel = 0,
}) => {
  // Candle wax color variations (rose gold, ivory, blush)
  const waxColors = [
    'linear-gradient(to right, #f6ccd5, #fff5f7, #e8b0bd)',
    'linear-gradient(to right, #dfb285, #fef4e8, #cfa070)',
    'linear-gradient(to right, #f2bac5, #fdf0f3, #e59fb0)',
    'linear-gradient(to right, #dfb285, #fef4e8, #cfa070)',
    'linear-gradient(to right, #f6ccd5, #fff5f7, #e8b0bd)',
    'linear-gradient(to right, #f2bac5, #fdf0f3, #e59fb0)',
  ];

  const waxBackground = waxColors[index % waxColors.length];

  // Dynamic flicker and flame waver from audio/wind
  const flameWaverX = audioLevel > 0.05 ? (audioLevel * 14 * (index % 2 === 0 ? 1 : -1)) : 0;
  const flameScaleY = audioLevel > 0.05 ? Math.max(0.4, 1 - audioLevel * 0.5) : 1;

  return (
    <div className="relative flex flex-col items-center">
      {/* Candle Flame / Smoke Area */}
      <div className="relative h-14 w-8 flex items-end justify-center">
        {!isExtinguished ? (
          <motion.div
            className="relative flex flex-col items-center origin-bottom cursor-pointer"
            animate={{
              x: flameWaverX,
              scaleY: flameScaleY,
              scaleX: 1 + (audioLevel > 0.1 ? 0.3 : 0),
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          >
            {/* Ambient Candle Glow Halo */}
            <motion.div
              className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-t from-[#ff8c42]/30 via-[#ffd166]/40 to-transparent blur-md"
              animate={{
                scale: [1, 1.15, 0.95, 1.05],
                opacity: [0.75, 0.95, 0.65, 0.85],
              }}
              transition={{
                duration: 1.2 + (index % 3) * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Outer Flame (Warm Orange/Red) */}
            <motion.div
              className="relative h-9 w-4 rounded-full bg-gradient-to-t from-[#ff3b30] via-[#ff9500] to-[#ffd60a] shadow-[0_0_12px_#ff9500]"
              style={{
                borderRadius: '50% 50% 35% 35% / 70% 70% 30% 30%',
              }}
              animate={{
                scaleY: [1, 1.08, 0.94, 1],
                scaleX: [1, 0.92, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 0.8 + (index % 4) * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Inner Flame Core (Brilliant Yellow / White-Hot Center) */}
              <motion.div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 h-5 w-2 rounded-full bg-gradient-to-t from-[#ffd60a] to-[#ffffff] shadow-[0_0_6px_#fff]"
                style={{
                  borderRadius: '50% 50% 40% 40% / 70% 70% 30% 30%',
                }}
              />
              {/* Base Blue Hot Flame */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#3a86ff]/80 blur-[0.5px]" />
            </motion.div>
          </motion.div>
        ) : (
          /* Realistic Smoke Wisps upon being extinguished */
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: -35, x: [-2, 4, -5] }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="pointer-events-none absolute bottom-1 flex flex-col items-center"
          >
            <div className="h-4 w-1.5 rounded-full bg-slate-300/60 blur-[1px]" />
            <div className="h-6 w-3 rounded-full bg-slate-200/40 blur-[2px] mt-1" />
          </motion.div>
        )}
      </div>

      {/* Candle Wick */}
      <div className="h-2.5 w-[2px] bg-[#221017] rounded-t-sm" />

      {/* Candle Body */}
      <div
        className="relative h-14 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_6px_rgba(0,0,0,0.4)] overflow-hidden"
        style={{ background: waxBackground }}
      >
        {/* Decorative Gold Spiral Pinstripe */}
        <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(223,178,133,0.8)_4px,rgba(223,178,133,0.8)_6px)]" />

        {/* Melted Wax Rim Curve */}
        <div className="absolute top-0 inset-x-0 h-1 bg-[#fff8fa] rounded-b-md shadow-inner" />
      </div>
    </div>
  );
};
