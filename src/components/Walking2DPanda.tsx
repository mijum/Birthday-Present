import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

export type PandaAnimPhase =
  | 'idle'
  | 'entering'
  | 'approaching'
  | 'pausing'
  | 'looking'
  | 'leaning'
  | 'biting'
  | 'chewing'
  | 'pullingBack'
  | 'smiling'
  | 'finalPose'
  | 'finished';

interface Walking2DPandaProps {
  phase: PandaAnimPhase;
}

const PANDA_ASSETS = {
  idle: '/panda/panda_idle.webp',
  walk1: '/panda/panda_walk1.webp',
  walk2: '/panda/panda_walk2.webp',
  looking: '/panda/panda_looking.webp',
  biting: '/panda/panda_biting.webp',
  chewing: '/panda/panda_chewing.webp',
  smiling: '/panda/panda_smiling_teeth.webp',
};

export const Walking2DPanda: React.FC<Walking2DPandaProps> = ({ phase }) => {
  const [walkFrame, setWalkFrame] = useState<0 | 1>(0);

  const isEntering = phase === 'entering' || phase === 'approaching';
  const isPausing = phase === 'pausing' || phase === 'looking';
  const isLeaning = phase === 'leaning';
  const isBiting = phase === 'biting';
  const isChewing = phase === 'chewing';
  const isPullingBack = phase === 'pullingBack';
  const isSmiling = phase === 'smiling';
  const isFinalPose = phase === 'finalPose' || phase === 'finished';

  const showTeethSmile = isSmiling || isFinalPose;
  const isChewingOrBiting = isBiting || isChewing;

  // Preload all panda pose assets on mount for instantaneous, flicker-free transitions
  useEffect(() => {
    Object.values(PANDA_ASSETS).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Coordinated walking stride timer alternating walk poses during approach
  useEffect(() => {
    if (!isEntering) return;
    const interval = setInterval(() => {
      setWalkFrame((prev) => (prev === 0 ? 1 : 0));
    }, 240);
    return () => clearInterval(interval);
  }, [isEntering]);

  // Determine current active pose asset
  let currentImageSrc = PANDA_ASSETS.idle;
  if (isEntering) {
    currentImageSrc = walkFrame === 0 ? PANDA_ASSETS.walk1 : PANDA_ASSETS.walk2;
  } else if (isPausing) {
    currentImageSrc = PANDA_ASSETS.looking;
  } else if (isLeaning || isBiting) {
    currentImageSrc = PANDA_ASSETS.biting;
  } else if (isChewing || isPullingBack) {
    currentImageSrc = PANDA_ASSETS.chewing;
  } else if (showTeethSmile) {
    currentImageSrc = PANDA_ASSETS.smiling;
  }

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {/* Speech Bubble — Adorable, contextual reactions */}
      <motion.div
        key={
          isEntering
            ? 'entering'
            : isPausing
            ? 'pausing'
            : isBiting
            ? 'biting'
            : isChewing || isPullingBack
            ? 'chewing'
            : 'smiling'
        }
        initial={{ opacity: 0, scale: 0.88, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="relative mb-2 max-w-[230px] rounded-2xl bg-[#fffaf5] px-3.5 py-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.45)] border border-[#e5a4b4]/60 text-[#4a1224] text-xs font-sans font-semibold tracking-wide flex items-center gap-1.5 whitespace-nowrap z-30"
      >
        <span>
          {isEntering
            ? 'Panda smelled birthday cake! 🐼🐾'
            : isPausing
            ? 'Ooh, a piece on the plate for me! 🍰'
            : isLeaning
            ? 'Reaching for the slice... 🍰'
            : isBiting
            ? 'Took the slice! Chomp chomp! 🍰😋'
            : isChewing
            ? 'Mmm! Nom nom nom... so sweet! ♡'
            : isPullingBack
            ? 'All eaten! Delicious cake! 🍓'
            : 'Look at my happy smile! 🐼✨'}
        </span>
        {showTeethSmile ? (
          <Sparkles className="h-3.5 w-3.5 text-[#dfb285] fill-current animate-pulse" />
        ) : (
          <Heart className="h-3.5 w-3.5 text-[#e63956] fill-current" />
        )}
        {/* Tail pointing down to the panda's head */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fffaf5] border-b border-r border-[#e5a4b4]/60 rotate-45" />
      </motion.div>

      {/* Floating Sparkles & Hearts when revealing smile & teeth */}
      {showTeethSmile && (
        <div className="absolute -top-4 right-1 flex gap-1 pointer-events-none z-30">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ y: [-4, -26], opacity: [0, 1, 0], scale: [0.7, 1.2, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className="text-[#dfb285] text-base"
          >
            ✦
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ y: [-2, -22], opacity: [0, 1, 0], scale: [0.6, 1.1, 0.3] }}
            transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
            className="text-[#e63956] text-sm"
          >
            ♥
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ y: [-5, -28], opacity: [0, 1, 0], scale: [0.5, 1.0, 0.3] }}
            transition={{ duration: 2.0, delay: 1.0, repeat: Infinity, ease: 'easeOut' }}
            className="text-[#dfb285] text-xs"
          >
            ✨
          </motion.div>
        </div>
      )}

      {/* Synchronized Gentle Crumbs during bite and chew */}
      {isChewingOrBiting && (
        <div className="absolute top-16 left-6 flex pointer-events-none z-30">
          <motion.div
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: [-2, -14], y: [0, 12], opacity: [1, 0], scale: [1, 0.4] }}
            transition={{ duration: 0.45, repeat: 2, ease: 'easeOut' }}
            className="h-1.5 w-1.5 rounded-full bg-[#ffd166] shadow-sm"
          />
          <motion.div
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: [1, 12], y: [0, 14], opacity: [1, 0], scale: [1, 0.3] }}
            transition={{ duration: 0.45, delay: 0.15, repeat: 2, ease: 'easeOut' }}
            className="h-1.5 w-1.5 rounded-full bg-[#e63946] shadow-sm ml-1"
          />
        </div>
      )}

      {/* PANDA CONTAINER WITH NATURAL LIFELIKE ANIMATION */}
      <motion.div
        animate={
          isFinalPose
            ? { scale: [1, 1.012, 1], rotate: [0, 0.6, 0] } // Extremely subtle breathing in final pose
            : isEntering
            ? { y: 0 } // Smooth, grounded, zero bounce walk
            : isPausing
            ? { rotate: -4, x: -4 } // Curious head tilt looking at cake
            : isLeaning
            ? { rotate: -7, x: -12, y: 1 }
            : isBiting
            ? { rotate: -9, x: -16, y: 3, scale: 1.04 } // Leaning bite chomp reaching cake
            : isChewing
            ? {
                scaleY: [1, 1.03, 0.98, 1.02, 1],
                scaleX: [1, 0.98, 1.02, 0.99, 1],
                rotate: -2,
                x: -6,
              } // Chewing motion
            : isPullingBack
            ? { rotate: 0, x: 0, y: 0 }
            : isSmiling
            ? { rotate: 3, y: -1, scale: 1.02 } // Head tilt showing teeth smile
            : {}
        }
        transition={
          isFinalPose
            ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            : isChewing
            ? { duration: 0.9, repeat: 1, ease: 'easeInOut' }
            : { duration: 0.45, ease: 'easeInOut' }
        }
        className="relative w-32 h-32 sm:w-36 sm:h-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
      >
        {/* Festive Mini Birthday Party Hat */}
        <div className="absolute top-[3%] left-[45%] -translate-x-1/2 -rotate-3 z-20 pointer-events-none">
          <svg width="24" height="28" viewBox="0 0 24 28" className="drop-shadow-sm">
            <defs>
              <linearGradient id="partyHatPandaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd166" />
                <stop offset="50%" stopColor="#f4a261" />
                <stop offset="100%" stopColor="#e76f51" />
              </linearGradient>
            </defs>
            {/* Cone */}
            <polygon points="12,4 2,24 22,24" fill="url(#partyHatPandaGrad)" stroke="#dfb285" strokeWidth="1" />
            {/* Fluffy Pom Pom */}
            <circle cx="12" cy="4" r="3.5" fill="#ff758f" />
            <circle cx="11" cy="3" r="1.2" fill="#ffffff" opacity="0.8" />
            {/* Festive Ribbon Stripes */}
            <line x1="6" y1="14" x2="18" y2="14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="19" x2="20" y2="19" stroke="#ffd1dc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Custom 2D Baby Panda Character Image Asset */}
        <img
          src={currentImageSrc}
          alt="Custom 2D Birthday Baby Panda"
          className="w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />

        {/* Slice of Cake Held in Panda's Paws while taking and eating */}
        {(isBiting || isChewing) && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: -8, y: 15 }}
            animate={
              isBiting
                ? { scale: 1, opacity: 1, x: 0, y: 0, rotate: [-8, -4, -8] }
                : { scale: [1, 0.8, 0.55], opacity: [1, 0.9, 0.6], x: [0, 2, 4], y: [0, 4, 8] }
            }
            transition={{ duration: isBiting ? 0.4 : 1.0, ease: 'easeOut' }}
            className="absolute bottom-6 left-5 z-30 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
          >
            <svg width="42" height="36" viewBox="0 0 42 36">
              {/* Cake Slice Sponge & Strawberry Frosting */}
              <polygon points="4,26 34,10 36,22 6,34" fill="#ffd166" />
              <polygon points="4,26 34,10 32,5 2,20" fill="#fff5f7" stroke="#e5a4b4" strokeWidth="0.8" />
              {/* Berry Jam Layers */}
              <line x1="5" y1="29" x2="35" y2="14" stroke="#b7094c" strokeWidth="1.8" />
              <line x1="5.5" y1="32" x2="35.5" y2="18" stroke="#800f2f" strokeWidth="1.5" />
              {/* Strawberry on top */}
              <ellipse cx="14" cy="12" rx="3.8" ry="5.2" fill="#e63946" />
              <circle cx="13" cy="10" r="1" fill="#ffffff" opacity="0.8" />
              <ellipse cx="14" cy="7.5" rx="2.2" ry="1" fill="#2d6a4f" />
              {/* Bite mark out of the slice as panda eats it */}
              <path d="M 2 20 Q 9 16 15 21 Q 8 25 2 20 Z" fill="#2b0d19" opacity="0.9" />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
