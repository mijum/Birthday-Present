import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  color: string;
}

export const FloatingPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rose petal color palette (translucent blush, dusty rose, delicate mauve)
    const colors = [
      'rgba(247, 182, 192, 0.45)',
      'rgba(235, 148, 163, 0.40)',
      'rgba(214, 116, 134, 0.35)',
      'rgba(255, 209, 218, 0.50)',
      'rgba(189, 78, 98, 0.28)',
    ];

    const petalCount = Math.min(24, Math.floor(width / 50));
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 10 + Math.random() * 12,
        speedY: 0.4 + Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.8,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.01 + Math.random() * 0.02,
        opacity: 0.3 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(Math.cos(p.flip), 1);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Delicate organic curved petal shape
      ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.7, p.size, -p.size * 0.2, 0, p.size);
      ctx.bezierCurveTo(-p.size, -p.size * 0.2, -p.size * 0.5, -p.size * 0.7, 0, 0);

      ctx.fillStyle = p.color;
      ctx.fill();

      // Soft highlight vein
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(0, p.size * 0.4, 0, p.size * 0.85);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.restore();
    };

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 16.66;
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY * delta;
        p.x += Math.sin(p.y * 0.008) * 0.6 * delta + p.speedX * delta;
        p.rotation += p.rotationSpeed * delta;
        p.flip += p.flipSpeed * delta;

        // Wrap around smoothly
        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }
        if (p.x > width + 30) p.x = -30;
        if (p.x < -30) p.x = width + 30;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
      aria-hidden="true"
    />
  );
};
