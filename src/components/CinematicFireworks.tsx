import React, { useEffect, useRef } from 'react';
import { romanticAudio } from '../utils/audioSynthesizer';

interface CinematicFireworksProps {
  active: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  flickerSpeed: number;
  flickerPhase: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
}

const PALETTES = [
  ['#ffd166', '#ffe8a3', '#dfb285'], // Champagne Gold
  ['#f472b6', '#fbcfe8', '#fecdd3'], // Rose Quartz
  ['#dfb285', '#ffd166', '#ffffff'], // Warm Candlelight
  ['#fb7185', '#fda4af', '#fff0f3'], // Coral Blush
  ['#ffe49e', '#ffffff', '#ffd166'], // Golden Willow
];

export const CinematicFireworks: React.FC<CinematicFireworksProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      height = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    };

    window.addEventListener('resize', handleResize);

    const sparks: Spark[] = [];
    const rockets: Rocket[] = [];

    const createBurst = (originX: number, originY: number, paletteIndex: number) => {
      romanticAudio.playDistantFireworkPop();
      const colors = PALETTES[paletteIndex % PALETTES.length];
      const count = 42;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const speed = (2.2 + Math.random() * 3.8) * (window.devicePixelRatio || 1);
        const color = colors[Math.floor(Math.random() * colors.length)];

        sparks.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.01,
          size: (1.5 + Math.random() * 2) * (window.devicePixelRatio || 1),
          flickerSpeed: 0.15 + Math.random() * 0.2,
          flickerPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const launchRocket = (
      targetXPercent: number,
      targetYPercent: number,
      paletteIndex: number
    ) => {
      const targetX = width * targetXPercent;
      const targetY = height * targetYPercent;
      const startX = targetX + (Math.random() - 0.5) * 40;
      const startY = height * 0.95;
      const vy = -((startY - targetY) / 36);

      rockets.push({
        x: startX,
        y: startY,
        targetY,
        vy,
        color: PALETTES[paletteIndex % PALETTES.length][0],
        exploded: false,
      });
    };

    if (prefersReducedMotion) {
      // For reduced motion: single soft warm ambient bloom
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        10,
        width * 0.5,
        height * 0.3,
        width * 0.4
      );
      gradient.addColorStop(0, 'rgba(255, 209, 102, 0.25)');
      gradient.addColorStop(1, 'rgba(255, 209, 102, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    // Schedule 6 cinematic, staggered firework launches
    const schedule = [
      { delay: 150, x: 0.22, y: 0.22, palette: 0 },
      { delay: 950, x: 0.78, y: 0.26, palette: 1 },
      { delay: 1900, x: 0.64, y: 0.18, palette: 2 },
      { delay: 2850, x: 0.35, y: 0.17, palette: 3 },
      { delay: 3900, x: 0.50, y: 0.19, palette: 4 }, // Grand center golden peony
      { delay: 5100, x: 0.82, y: 0.20, palette: 0 },
    ];

    const timers: number[] = [];
    schedule.forEach((s) => {
      const id = window.setTimeout(() => {
        launchRocket(s.x, s.y, s.palette);
      }, s.delay);
      timers.push(id);
    });

    let running = true;

    const render = () => {
      if (!running) return;

      // Soft semi-transparent trail clear
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // 1. Update & Render Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;

        // Rocket spark head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = r.color;
        ctx.fill();

        // Trail spark
        ctx.beginPath();
        ctx.arc(r.x, r.y - r.vy * 0.8, 1.2 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        if (r.y <= r.targetY && !r.exploded) {
          r.exploded = true;
          const paletteIndex = rockets.length % PALETTES.length;
          createBurst(r.x, r.y, paletteIndex);
          rockets.splice(i, 1);
        }
      }

      // 2. Update & Render Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];

        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.965; // Air drag
        s.vy *= 0.965;
        s.vy += 0.045 * (window.devicePixelRatio || 1); // Subtle natural gravity
        s.alpha -= s.decay;

        s.flickerPhase += s.flickerSpeed;
        const currentAlpha = Math.max(
          0,
          s.alpha * (0.8 + 0.2 * Math.sin(s.flickerPhase))
        );

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      timers.forEach((t) => clearTimeout(t));
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
