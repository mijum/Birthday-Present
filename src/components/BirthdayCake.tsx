import React from 'react';
import { motion } from 'motion/react';
import { Candle } from './Candle';

interface BirthdayCakeProps {
  candleCount?: number;
  extinguishedCandles?: boolean[];
  audioLevel?: number;
  mode?: 'candles' | 'cutting';
  cutProgress?: number; // 0: untouched, 1: first cut, 2: second cut (wedge cut), 3: separated slice
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  candleCount = 6,
  extinguishedCandles = [false, false, false, false, false, false],
  audioLevel = 0,
  mode = 'candles',
  cutProgress = 0,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Warm Ambient Cake Illumination Underneath */}
      <div className="pointer-events-none absolute -bottom-10 h-36 w-80 rounded-full bg-gradient-to-t from-[#e5a4b4]/20 via-[#dfb285]/15 to-transparent blur-2xl" />

      {/* Main Cake Assembly */}
      <div className="relative flex flex-col items-center">
        {/* CANDLES ROW (when in 'candles' mode or before cutting) */}
        {mode === 'candles' && (
          <div className="relative z-30 -mb-4 flex items-end justify-center gap-3 sm:gap-4 px-4">
            {Array.from({ length: candleCount }).map((_, index) => {
              // Create a gentle natural height curve for the candles
              const yOffset = Math.sin((index / (candleCount - 1)) * Math.PI) * -8;
              return (
                <div
                  key={index}
                  style={{ transform: `translateY(${yOffset}px)` }}
                  className="transition-transform duration-300"
                >
                  <Candle
                    index={index}
                    isExtinguished={extinguishedCandles[index] || false}
                    audioLevel={audioLevel}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 3D CAKE STRUCTURE */}
        <div className="relative z-20 flex flex-col items-center">
          {/* TOP CAKE TIER */}
          <div className="relative h-24 w-52 sm:w-64 rounded-[40px] bg-gradient-to-b from-[#fff6f8] via-[#fcebed] to-[#f7d9df] shadow-[0_6px_20px_rgba(40,10,20,0.35)] border-t border-white/90">
            {/* Strawberries on Top */}
            <div className="absolute -top-3.5 inset-x-0 flex justify-around px-4 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {/* Strawberry Green Leaves */}
                  <div className="flex gap-0.5 -mb-1">
                    <span className="h-1.5 w-2 bg-[#4a7c59] rounded-full rotate-[-20deg]" />
                    <span className="h-2 w-1.5 bg-[#5b8e66] rounded-full" />
                    <span className="h-1.5 w-2 bg-[#4a7c59] rounded-full rotate-[20deg]" />
                  </div>
                  {/* Strawberry Berry */}
                  <div className="h-4 w-4 rounded-full bg-gradient-to-b from-[#e63946] to-[#b7094c] shadow-sm relative">
                    <div className="absolute top-1 left-1 h-1 w-1 bg-white/50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Tier Frosting Rosettes & Drips */}
            <div className="absolute top-1 inset-x-2 flex justify-between px-2 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-full bg-gradient-to-b from-white to-[#fae6eb] shadow-sm"
                />
              ))}
            </div>

            {/* Gold Dragees / Sugar Pearls */}
            <div className="absolute top-8 inset-x-4 flex justify-around pointer-events-none opacity-80">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-[#dfb285] shadow-[0_0_3px_#e5b887]"
                />
              ))}
            </div>

            {/* Top Tier Cream Ribbon */}
            <div className="absolute bottom-1 inset-x-0 h-4 bg-gradient-to-r from-[#f0c4cf] via-[#f7d9e0] to-[#f0c4cf] rounded-b-[40px] flex items-center justify-around px-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/70" />
              ))}
            </div>
          </div>

          {/* BOTTOM CAKE TIER */}
          <div className="relative -mt-4 h-28 w-64 sm:w-80 rounded-[46px] bg-gradient-to-b from-[#fcebf0] via-[#f4c8d3] to-[#e7a2b2] shadow-[0_12px_30px_rgba(30,5,15,0.45)] border-t border-white/80">
            {/* Scalloped Frosting Border */}
            <div className="absolute top-0 inset-x-3 flex justify-between px-1 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-4 -mt-1.5 rounded-full bg-gradient-to-b from-[#ffffff] to-[#fae4ea] shadow-sm"
                />
              ))}
            </div>

            {/* Fresh Strawberries along middle band */}
            <div className="absolute top-8 inset-x-6 flex justify-between items-center pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-4 rounded-full bg-gradient-to-br from-[#e63946] via-[#c9184a] to-[#800f2f] shadow-md border border-[#ff758f]/40 flex items-center justify-center"
                >
                  <div className="h-1 w-1 bg-white/60 rounded-full -mt-1.5" />
                </div>
              ))}
            </div>

            {/* Bottom tier decorative gold pearls & delicate piping */}
            <div className="absolute bottom-3 inset-x-4 flex justify-around pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#dfb285] shadow-[0_0_4px_#e5b887]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* PORCELAIN PEDESTAL CAKE STAND */}
        <div className="relative z-10 -mt-2 flex flex-col items-center">
          {/* Plate Rim */}
          <div className="h-5 w-72 sm:w-96 rounded-full bg-gradient-to-r from-[#d6cad2] via-[#faf5ee] to-[#d6cad2] shadow-[0_10px_25px_rgba(20,5,15,0.5)] border-t border-white" />
          {/* Pedestal Stem */}
          <div className="h-8 w-20 bg-gradient-to-b from-[#ebe1e7] to-[#d3c5ce] shadow-md" />
          {/* Pedestal Base */}
          <div className="h-4 w-40 rounded-full bg-gradient-to-r from-[#d6cad2] via-[#faf5ee] to-[#d6cad2] shadow-[0_6px_20px_rgba(0,0,0,0.6)]" />
        </div>
      </div>
    </div>
  );
};
