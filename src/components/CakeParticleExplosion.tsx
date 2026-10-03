import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  type: 'star' | 'diamond' | 'heart' | 'sparkle' | 'disc';
  color: string;
  size: number;
  dx: number;
  dy: number;
  rotate: number;
  delay: number;
}

interface CakeParticleExplosionProps {
  explosionId: number;
  originXPercent?: number; // 0 to 100%
  originYPercent?: number; // 0 to 100%
}

const COLORS = [
  '#ffd166', // Golden yellow
  '#f472b6', // Soft pink
  '#dfb285', // Warm champagne
  '#ffffff', // Crisp white sparkle
  '#e63946', // Strawberry ruby
  '#fb7185', // Coral blush
  '#ffe3a8', // Pale gold
];

const TYPES: Array<'star' | 'diamond' | 'heart' | 'sparkle' | 'disc'> = [
  'star',
  'diamond',
  'heart',
  'sparkle',
  'disc',
];

export const CakeParticleExplosion: React.FC<CakeParticleExplosionProps> = ({
  explosionId,
  originXPercent = 50,
  originYPercent = 48,
}) => {
  if (explosionId === 0) return null;

  // Generate 32 unique celebratory particles
  const particles: Particle[] = React.useMemo(() => {
    return Array.from({ length: 32 }, (_, idx) => {
      const angle = (idx / 32) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 40 + Math.random() * 95;
      const dx = Math.cos(angle) * distance;
      // Slight upward bias for celebratory burst
      const dy = Math.sin(angle) * distance - 15;

      return {
        id: idx,
        type: TYPES[idx % TYPES.length],
        color: COLORS[idx % COLORS.length],
        size: 7 + Math.random() * 8,
        dx,
        dy,
        rotate: (Math.random() - 0.5) * 480,
        delay: Math.random() * 0.08,
      };
    });
  }, [explosionId]);

  return (
    <div
      key={explosionId}
      className="pointer-events-none absolute inset-0 z-35 overflow-hidden"
    >
      <div
        style={{
          left: `${originXPercent}%`,
          top: `${originYPercent}%`,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: p.dx,
                y: p.dy,
                scale: [0, 1.4, 0.2],
                rotate: p.rotate,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.85,
                delay: p.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                color: p.color,
                fontSize: `${p.size}px`,
              }}
              className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            >
              {p.type === 'star' && '★'}
              {p.type === 'diamond' && '✦'}
              {p.type === 'heart' && '♥'}
              {p.type === 'sparkle' && '✧'}
              {p.type === 'disc' && (
                <div
                  style={{
                    backgroundColor: p.color,
                    width: `${p.size * 0.75}px`,
                    height: `${p.size * 0.75}px`,
                  }}
                  className="rounded-full shadow-sm"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Central Flash Shockwave */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-gradient-to-r from-[#ffd166]/60 via-[#ffb3c6]/40 to-transparent blur-md"
        />
      </div>
    </div>
  );
};
