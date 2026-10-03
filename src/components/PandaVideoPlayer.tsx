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
      className="fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-[#180612] select-none"
    >
      {/* 1. CRYSTAL-CLEAR FULL-SCREEN VIDEO (100% unobstructed, zero dark fades) */}
      <div className="absolute inset-0 z-0 overflow-hidden" onClick={togglePlay}>
        <video
          ref={videoRef}
          src="/download.mp4"
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover object-center cursor-pointer"
        />
      </div>

      {/* 2. FLOATING ATMOSPHERE: ROSE PETALS, GLOWING PARTICLES & RISING BALLOONS (z-15) */}
      <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
        <FloatingPetals />
        <GlowingParticles count={16} />
        {/* Festive rising balloons activate when video ends */}
        <FestiveBalloons active={hasEnded} />
      </div>

      {/* 3. FLOATING TOP HEADER & TITLES OVER THE VIDEO (z-20) */}
      <header className="relative z-20 w-full px-4 pt-4 sm:pt-6 flex flex-col items-center text-center space-y-2 pointer-events-auto">
        {/* Top Control Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between gap-2">
          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#200715]/80 backdrop-blur-md border border-[#e8a2b5]/35 text-[11px] sm:text-xs font-sans text-[#ffd1dc] shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb285]" />
            <span className="font-medium tracking-wide">
              {hasEnded ? 'Birthday Surprise Revealed! 🎉' : 'Baby Panda Surprise 🐼🎂'}
            </span>
          </div>

          {/* Action Buttons: Play/Pause, Sound, Replay, Switch */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#200715]/80 hover:bg-[#3a1324] backdrop-blur-md border border-[#e8a2b5]/35 text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#dfb285]" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#dfb285]" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#200715]/80 hover:bg-[#3a1324] backdrop-blur-md border border-[#e8a2b5]/35 text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#e5a4b4]" />
                  <span className="hidden sm:inline">Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#dfb285]" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              aria-label="Replay video"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#200715]/80 hover:bg-[#3a1324] backdrop-blur-md border border-[#e8a2b5]/35 text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#dfb285]" />
              <span className="hidden sm:inline">Replay</span>
            </button>

            {onSwitchToInteractive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToInteractive();
                }}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#3a1324]/85 hover:bg-[#521b33] backdrop-blur-md border border-[#dfb285]/40 text-xs font-sans text-[#ffd1dc] transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Cake className="w-3.5 h-3.5 text-[#dfb285]" />
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
              initial={{ opacity: 0, scale: 0.85, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 14, stiffness: 180 }}
              className="flex flex-col items-center pt-1 sm:pt-2 space-y-1.5"
            >
              {/* Surprise Festive Ribbon / Embellishments */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl animate-bounce">🎈</span>
                <span className="text-xl sm:text-2xl animate-pulse text-[#dfb285]">✨</span>
                <span className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#dfb285] font-bold px-3.5 py-1 rounded-full bg-[#2a0c1e]/90 border border-[#dfb285]/60 shadow-[0_4px_16px_rgba(223,178,133,0.3)]">
                  Surprise Celebration 🎉
                </span>
                <span className="text-xl sm:text-2xl animate-pulse text-[#dfb285]">✨</span>
                <span className="text-xl sm:text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
              </div>

              {/* Grand Shimmering Happy Birthday Title */}
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ffd166] via-[#fff5eb] to-[#f4a2b6] drop-shadow-[0_4px_24px_rgba(255,209,102,0.7)]">
                Happy Birthday, {BIRTHDAY_CONFIG.herName}! 🎂
              </h2>

              <p className="font-serif italic text-xs sm:text-base md:text-lg text-[#ffe0eb] max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                Wishing you a day as sweet, bright, and unforgettable as your smile! ♡
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="panda-watching-title"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-1 pt-1 sm:pt-2"
            >
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-wide text-[#fce8ee] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Look at the Baby Panda! 🐼🎂
              </h2>
              <p className="font-serif italic text-xs sm:text-base md:text-lg text-[#ffd1dc] max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                He smelled your birthday cake, took a sweet bite, and has the happiest smile for you! ♡
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 4. FLOATING BOTTOM FOOTER: ROMANTIC MESSAGE, BALLOON DECORATIONS & CTA (z-20) */}
      <footer className="relative z-20 w-full px-4 pb-6 sm:pb-8 flex flex-col items-center text-center space-y-3 pointer-events-auto">
        <AnimatePresence mode="wait">
          {hasEnded ? (
            <motion.div
              key="surprise-footer-card"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 15, stiffness: 180 }}
              className="relative px-6 sm:px-8 py-3 rounded-2xl bg-[#1e0714]/85 backdrop-blur-md border border-[#dfb285]/55 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(223,178,133,0.3)] flex flex-col items-center gap-1 max-w-lg text-center"
            >
              {/* Decorative Left & Right Floating Balloon Emojis with rhythmic sway */}
              <div
                className="absolute -left-3.5 -top-3 text-2xl sm:text-3xl animate-bounce pointer-events-none select-none"
                style={{ animationDuration: '2.4s' }}
              >
                🎈
              </div>
              <div
                className="absolute -right-3.5 -top-3 text-2xl sm:text-3xl animate-bounce pointer-events-none select-none"
                style={{ animationDuration: '2.7s', animationDelay: '0.4s' }}
              >
                🎈
              </div>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-sans font-bold text-[#dfb285]">
                <PartyPopper className="w-4 h-4 text-[#ffd166]" />
                <span>Even the baby panda is celebrating your special day! 🐼✨</span>
              </div>
              <p className="font-serif text-xs sm:text-sm md:text-base italic text-[#fce8ee]">
                "May all your dreams come true, today and always. Happy Birthday, My Love."
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="standard-footer-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="px-5 sm:px-6 py-2 rounded-full bg-[#1e0714]/80 backdrop-blur-md border border-[#e8a2b5]/35 shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex items-center gap-2 max-w-lg"
            >
              <Heart className="w-4 h-4 text-[#e5a4b4] fill-current animate-pulse shrink-0" />
              <p className="font-serif text-xs sm:text-sm md:text-base italic text-[#fce8ee]">
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
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <RomanticButton onClick={onComplete}>
              One Last Letter 💌
            </RomanticButton>
          </motion.div>
        )}
      </footer>

      {/* 5. SUBTLE HAIRLINE PROGRESS INDICATOR (z-20) */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10 z-20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#dfb285] via-[#e5a4b4] to-[#dfb285] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
