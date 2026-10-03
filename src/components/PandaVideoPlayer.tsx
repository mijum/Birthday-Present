import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Volume2, VolumeX, Play, Pause, Cake, Heart, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RomanticButton } from './RomanticButton';
import { FloatingPetals } from './FloatingPetals';
import { GlowingParticles } from './GlowingParticles';
import { FestiveBalloons } from './FestiveBalloons';
import { BIRTHDAY_CONFIG } from '../config/birthday';
import { romanticAudio } from '../utils/audioSynthesizer';

interface PandaVideoPlayerProps {
  onComplete?: () => void;
  onSwitchToInteractive?: () => void;
  autoPlay?: boolean;
}

export const PandaVideoPlayer: React.FC<PandaVideoPlayerProps> = ({
  onComplete,
  onSwitchToInteractive,
  autoPlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Attempt autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      video.play().catch((err) => {
        console.warn('Autoplay prevented, fallback to muted or manual play', err);
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => setIsPlaying(false));
      });
    }
  }, [autoPlay]);

  // Handle video progress updates
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  // When video ends: trigger surprise celebration with confetti, audio chime & festive balloons
  const handleVideoEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    romanticAudio.playCelebrationChime();

    // Multi-burst celebratory confetti cannons
    confetti({
      particleCount: 65,
      angle: 60,
      spread: 70,
      origin: { x: 0.15, y: 0.65 },
      colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285', '#e91e63'],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 65,
      angle: 120,
      spread: 70,
      origin: { x: 0.85, y: 0.65 },
      colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285', '#e91e63'],
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285'],
        disableForReducedMotion: true,
      });
    }, 450);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      if (hasEnded) {
        video.currentTime = 0;
        setHasEnded(false);
      }
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleReplay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setHasEnded(false);
    video.play();
    setIsPlaying(true);
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.65 },
      colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285'],
      disableForReducedMotion: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-[#14040e] select-none"
    >
      {/* 1. ATMOSPHERIC AMBIENT BACKDROP (z-0) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#200717] via-[#10030c] to-[#220718] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(153,45,76,0.22)_0%,_transparent_75%)] pointer-events-none" />

      {/* 2. FLOATING ATMOSPHERE: ROSE PETALS, GLOWING PARTICLES & RISING BALLOONS (z-15) */}
      <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
        <FloatingPetals />
        <GlowingParticles count={16} />
        {/* Festive rising balloons activate when video ends */}
        <FestiveBalloons active={hasEnded} />
      </div>

      {/* 3. TOP HEADER & TITLES (z-20) */}
      <header className="relative z-20 w-full px-3 pt-[max(0.5rem,env(safe-area-inset-top,0.5rem))] sm:pt-4 flex flex-col items-center text-center space-y-1 sm:space-y-2 pointer-events-auto shrink-0">
        {/* Top Control Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-[#200715]/85 backdrop-blur-md border border-[#e8a2b5]/35 text-[10px] sm:text-xs font-sans text-[#ffd1dc] shadow-md">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dfb285]" />
            <span className="font-medium tracking-wide">
              {hasEnded ? 'Surprise Revealed! 🎉' : 'Baby Panda Surprise 🐼🎂'}
            </span>
          </div>

          {/* Action Buttons: Play/Pause, Sound, Replay, Switch */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#200715]/85 hover:bg-[#3a1324] backdrop-blur-md border border-[#e8a2b5]/35 text-[11px] sm:text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-md active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dfb285]" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dfb285]" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#200715]/85 hover:bg-[#3a1324] backdrop-blur-md border border-[#e8a2b5]/35 text-[11px] sm:text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-md active:scale-95"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#e5a4b4]" />
                  <span className="hidden sm:inline">Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dfb285]" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              aria-label="Replay video"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#200715]/85 hover:bg-[#3a1324] backdrop-blur-md border border-[#e8a2b5]/35 text-[11px] sm:text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-md active:scale-95"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dfb285]" />
              <span className="hidden sm:inline">Replay</span>
            </button>

            {onSwitchToInteractive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToInteractive();
                }}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#3a1324]/85 hover:bg-[#521b33] backdrop-blur-md border border-[#dfb285]/40 text-[11px] sm:text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Cake className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dfb285]" />
                <span className="hidden sm:inline">Interactive Cake</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Titles: Switches to grand Surprise Birthday Banner with Decorations when video ends */}
        <AnimatePresence mode="wait">
          {hasEnded ? (
            <motion.div
              key="birthday-surprise-title"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 14, stiffness: 180 }}
              className="flex flex-col items-center pt-0.5 sm:pt-1 space-y-1"
            >
              {/* Surprise Festive Ribbon / Embellishments */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl animate-bounce">🎈</span>
                <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] text-[#dfb285] font-bold px-3 py-0.5 rounded-full bg-[#2a0c1e]/90 border border-[#dfb285]/60 shadow-[0_2px_10px_rgba(223,178,133,0.3)]">
                  Surprise Celebration 🎉
                </span>
                <span className="text-base sm:text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
              </div>

              {/* Grand Shimmering Happy Birthday Title */}
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ffd166] via-[#fff5eb] to-[#f4a2b6] drop-shadow-[0_2px_16px_rgba(255,209,102,0.6)]">
                Happy Birthday, {BIRTHDAY_CONFIG.herName}! 🎂
              </h2>

              <p className="font-serif italic text-[11px] sm:text-sm md:text-base text-[#ffe0eb] max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Wishing you a day as sweet, bright, and unforgettable as your smile! ♡
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="panda-watching-title"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-0.5 pt-0.5 sm:pt-1"
            >
              <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-medium tracking-wide text-[#fce8ee] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                Look at the Baby Panda! 🐼🎂
              </h2>
              <p className="font-serif italic text-[11px] sm:text-sm md:text-base text-[#ffd1dc] max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                He smelled your birthday cake, took a sweet bite, and has the happiest smile for you! ♡
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 4. CRYSTAL-CLEAR UNCROPPED VIDEO VIEWPORT (Properly scaled for mobile & desktop, never cropped) */}
      <div 
        className="relative flex-1 w-full min-h-0 flex items-center justify-center px-1 sm:px-4 py-1 z-10 cursor-pointer overflow-hidden"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src="/download.mp4"
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full max-h-full object-contain object-center rounded-xl sm:rounded-2xl drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* 5. BOTTOM FOOTER: ROMANTIC MESSAGE, BALLOON DECORATIONS & CTA (z-20) */}
      <footer className="relative z-20 w-full px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] sm:pb-5 pt-1 flex flex-col items-center text-center space-y-2 pointer-events-auto shrink-0">
        <AnimatePresence mode="wait">
          {hasEnded ? (
            <motion.div
              key="surprise-footer-card"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 15, stiffness: 180 }}
              className="relative px-4 sm:px-6 py-2 rounded-xl bg-[#1e0714]/90 backdrop-blur-md border border-[#dfb285]/55 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col items-center gap-0.5 max-w-lg text-center"
            >
              {/* Decorative Left & Right Floating Balloon Emojis */}
              <div
                className="absolute -left-2.5 -top-2.5 text-xl sm:text-2xl animate-bounce pointer-events-none select-none"
                style={{ animationDuration: '2.4s' }}
              >
                🎈
              </div>
              <div
                className="absolute -right-2.5 -top-2.5 text-xl sm:text-2xl animate-bounce pointer-events-none select-none"
                style={{ animationDuration: '2.7s', animationDelay: '0.4s' }}
              >
                🎈
              </div>

              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-sans font-bold text-[#dfb285]">
                <PartyPopper className="w-3.5 h-3.5 text-[#ffd166]" />
                <span>Even the baby panda is celebrating your special day! 🐼✨</span>
              </div>
              <p className="font-serif text-[11px] sm:text-xs md:text-sm italic text-[#fce8ee]">
                "May all your dreams come true, today and always. Happy Birthday, My Love."
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="standard-footer-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-1.5 rounded-full bg-[#1e0714]/85 backdrop-blur-md border border-[#e8a2b5]/35 shadow-md flex items-center gap-2 max-w-lg"
            >
              <Heart className="w-3.5 h-3.5 text-[#e5a4b4] fill-current animate-pulse shrink-0" />
              <p className="font-serif text-[11px] sm:text-xs md:text-sm italic text-[#fce8ee]">
                "Even the little panda couldn't resist how sweet you are! ♡ Happy Birthday, My Love."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Romantic CTA Button to the Final Letter Scene */}
        {onComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <RomanticButton onClick={onComplete}>
              One Last Letter 💌
            </RomanticButton>
          </motion.div>
        )}
      </footer>

      {/* 6. SUBTLE HAIRLINE PROGRESS INDICATOR (z-20) */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10 z-20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#dfb285] via-[#e5a4b4] to-[#dfb285] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
