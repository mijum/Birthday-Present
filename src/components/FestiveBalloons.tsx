import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FestiveBalloonsProps {
  active: boolean;
}

interface BalloonData {
  id: number;
  leftPercent: number; // 0 to 100
  sizeScale: number; // 0.75 to 1.25
  duration: number; // 8 to 14s (slow, graceful rising)
  delay: number; // Staggered launch
  swayDistance: number; // 12 to 24px
  swayDuration: number; // 3 to 4.5s
  opacity: number; // 0.45 to 0.75 (subtle background feel)
  colorGradId: string;
}

const BALLOON_COLORS = [
  { id: 'balloonGold', top: '#ffe5a3', mid: '#f4a261', base: '#c97a3e', string: '#dfb285' },
  { id: 'balloonRose', top: '#fbcfe8', mid: '#f472b6', base: '#be185d', string: '#f472b6' },
  { id: 'balloonChampagne', top: '#ffffff', mid: '#ffd166', base: '#d49b3d', string: '#dfb285' },
  { id: 'balloonRuby', top: '#fda4af', mid: '#e11d48', base: '#9f1239', string: '#fda4af' },
  { id: 'balloonLavender', top: '#f5d0fe', mid: '#c084fc', base: '#7e22ce', string: '#c084fc' },
  { id: 'balloonCream', top: '#ffffff', mid: '#fde047', base: '#ca8a04', string: '#fde047' },
];

export const FestiveBalloons: React.FC<FestiveBalloonsProps> = ({ active }) => {
  // Pre-calculate 10 elegant, romantic balloons with staggered timing
  const balloons: BalloonData[] = useMemo(() => {
    const rawData = [
      { leftPercent: 12, sizeScale: 0.85, duration: 11, delay: 0.2, swayDistance: 16, swayDuration: 3.2, opacity: 0.6, colorIndex: 0 },
      { leftPercent: 84, sizeScale: 0.95, duration: 10, delay: 0.6, swayDistance: 18, swayDuration: 3.6, opacity: 0.65, colorIndex: 1 },
      { leftPercent: 28, sizeScale: 0.75, duration: 13, delay: 1.4, swayDistance: 14, swayDuration: 4.0, opacity: 0.5, colorIndex: 2 },
      { leftPercent: 72, sizeScale: 1.05, duration: 9.5, delay: 2.1, swayDistance: 20, swayDuration: 3.4, opacity: 0.7, colorIndex: 3 },
      { leftPercent: 44, sizeScale: 0.8, duration: 12, delay: 2.8, swayDistance: 15, swayDuration: 3.8, opacity: 0.55, colorIndex: 4 },
      { leftPercent: 92, sizeScale: 0.9, duration: 10.5, delay: 3.6, swayDistance: 16, swayDuration: 3.5, opacity: 0.6, colorIndex: 0 },
      { leftPercent: 8, sizeScale: 1.0, duration: 10, delay: 4.3, swayDistance: 22, swayDuration: 3.3, opacity: 0.65, colorIndex: 1 },
      { leftPercent: 60, sizeScale: 0.85, duration: 11.5, delay: 5.0, swayDistance: 17, swayDuration: 3.7, opacity: 0.55, colorIndex: 5 },
      { leftPercent: 20, sizeScale: 1.1, duration: 9.0, delay: 5.8, swayDistance: 22, swayDuration: 3.2, opacity: 0.7, colorIndex: 2 },
      { leftPercent: 80, sizeScale: 0.8, duration: 12.5, delay: 6.5, swayDistance: 14, swayDuration: 4.2, opacity: 0.5, colorIndex: 3 },
    ];

    return rawData.map((b, idx) => ({
      id: idx,
      leftPercent: b.leftPercent,
      sizeScale: b.sizeScale,
      duration: b.duration,
      delay: b.delay,
      swayDistance: b.swayDistance,
      swayDuration: b.swayDuration,
      opacity: b.opacity,
      colorGradId: BALLOON_COLORS[b.colorIndex].id,
    }));
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
      <svg className="absolute w-0 h-0">
        <defs>
          {BALLOON_COLORS.map((c) => (
            <radialGradient
              key={c.id}
              id={c.id}
              cx="35%"
              cy="30%"
              r="70%"
              fx="25%"
              fy="20%"
            >
              <stop offset="0%" stopColor={c.top} />
              <stop offset="45%" stopColor={c.mid} />
              <stop offset="100%" stopColor={c.base} />
            </radialGradient>
          ))}
        </defs>
      </svg>

      {balloons.map((b) => (
        <motion.div
          key={b.id}
          initial={{
            y: '105vh',
            x: 0,
            opacity: 0,
          }}
          animate={{
            y: '-130px',
            opacity: [0, b.opacity, b.opacity, 0],
          }}
          transition={{
            y: {
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: 'linear',
            },
            opacity: {
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.85, 1],
              ease: 'easeInOut',
            },
          }}
          style={{
            left: `${b.leftPercent}%`,
          }}
          className="absolute bottom-0 -translate-x-1/2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
        >
          {/* Gentle horizontal sway & slight rhythmic tilt */}
          <motion.div
            animate={{
              x: [-b.swayDistance, b.swayDistance, -b.swayDistance],
              rotate: [-4, 4, -4],
            }}
            transition={{
              duration: b.swayDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              transformOrigin: 'bottom center',
              scale: b.sizeScale,
            }}
          >
            <svg
              viewBox="0 0 50 110"
              width="44"
              height="96"
              className="overflow-visible"
            >
              {/* Balloon String (Delicate curved ribbon) */}
              <path
                d="M 25 56 Q 21 72 29 88 T 24 112"
                fill="none"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Balloon Knot */}
              <polygon points="22,54 28,54 25,57" fill={`url(#${b.colorGradId})`} />

              {/* Balloon Body */}
              <ellipse
                cx="25"
                cy="28"
                rx="20"
                ry="25"
                fill={`url(#${b.colorGradId})`}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="0.8"
              />

              {/* Soft 3D Glossy Light Reflection */}
              <ellipse
                cx="18"
                cy="19"
                rx="5"
                ry="9"
                fill="#ffffff"
                opacity="0.45"
                transform="rotate(-22 18 19)"
              />
              <circle cx="21" cy="27" r="1.5" fill="#ffffff" opacity="0.35" />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
