import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Film, Cake } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynthesizer';
import { RomanticButton } from './RomanticButton';
import { Walking2DPanda, PandaAnimPhase } from './Walking2DPanda';
import { PandaVideoPlayer } from './PandaVideoPlayer';
import { CakeParticleExplosion } from './CakeParticleExplosion';
import { CinematicFireworks } from './CinematicFireworks';
import { FestiveBalloons } from './FestiveBalloons';

interface CakeCuttingProps {
  onComplete: () => void;
}

export const CakeCutting: React.FC<CakeCuttingProps> = ({ onComplete }) => {
  // Cut stages:
  // 0 = Whole cake (uncut)
  // 1 = Cut 1: Cake halves physically split and separate left/right
  // 2 = Cut 2: First slice physically detaches and slides onto the dessert plate
  // 3 = Cut 3: Second slice separates, triggering the natural 2D baby panda sequence!
  const [cutStage, setCutStage] = useState<number>(0);
  const [knifeSvgPos, setKnifeSvgPos] = useState<{ x: number; y: number }>({ x: 200, y: 70 });
  const [isSlicing, setIsSlicing] = useState<boolean>(false);
  const [explosionId, setExplosionId] = useState<number>(0);
  const [explosionOrigin, setExplosionOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 48 });
  const [pandaPhase, setPandaPhase] = useState<PandaAnimPhase | 'idle'>('idle');
  const [bitesTaken, setBitesTaken] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'video' | 'interactive'>('video');
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Convert pointer event to SVG coordinates (0 - 400, 0 - 340)
  const getSvgCoordinates = useCallback((e: React.PointerEvent<SVGSVGElement>): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return null;
    const svgPoint = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.min(370, Math.max(30, svgPoint.x)),
      y: Math.min(320, Math.max(30, svgPoint.y)),
    };
  }, []);

  // Update knife position
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getSvgCoordinates(e);
    if (!coords) return;
    setKnifeSvgPos(coords);
  };

  // Perform physical cake cut with celebratory Framer Motion particle explosion on every cut
  const executeCut = () => {
    if (isSlicing || cutStage >= 3) return;
    setIsSlicing(true);
    romanticAudio.playCakeCutSound();

    setTimeout(() => {
      setCutStage((prev) => {
        const next = prev + 1;

        // Trigger celebratory Framer Motion particle explosion at the cut incision point
        setExplosionId(Date.now());
        if (next === 1) {
          setExplosionOrigin({ x: 50, y: 46 });
        } else if (next === 2) {
          setExplosionOrigin({ x: 58, y: 52 });
        } else if (next === 3) {
          setExplosionOrigin({ x: 42, y: 44 });
          setViewMode('video');
          confetti({
            particleCount: 75,
            spread: 85,
            origin: { y: 0.65 },
            colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285', '#e91e63'],
            disableForReducedMotion: true,
          });
          romanticAudio.playCelebrationChime();
        }
        return next;
      });
      setIsSlicing(false);
    }, 380);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getSvgCoordinates(e);
    if (!coords) return;
    setKnifeSvgPos(coords);

    if (cutStage < 3) {
      executeCut();
    }
  };

  // Natural Panda Animation Sequence (Executed exactly once when cutStage === 3)
  // Scene 1: Slowly walks toward cake with small, adorable natural steps (2.5s)
  // Scene 2a: Pauses beside cake and looks at it with curious, excited expression (0.5s)
  // Scene 2b: Slowly leans head toward cake (0.5s)
  // Scene 2c: Takes one small, adorable bite with synchronized audio & bite mark on slice (0.6s)
  // Scene 2d: Delighted chewing with puffed cheeks and gentle crumbs (1.0s)
  // Scene 2e: Slowly pulls head back into natural position (0.4s)
  // Scene 3: Turns toward viewer, warm smile revealing cute white teeth and sparkle chime (1.0s)
  // Scene 4: Sits/stands comfortably in stationary pose holding smile indefinitely
  useEffect(() => {
    if (cutStage !== 3 || pandaPhase !== 'idle') return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setPandaPhase('finalPose');
      setBitesTaken(1);
      return;
    }

    // Scene 1: Panda Enters (2.5s slow natural walk)
    setPandaPhase('entering');

    const t1 = setTimeout(() => {
      // Scene 2a: Pause & look at cake (0.5s)
      setPandaPhase('pausing');
    }, 2500);

    const t2 = setTimeout(() => {
      // Scene 2b: Lean toward cake (0.5s)
      setPandaPhase('leaning');
    }, 3000);

    const t3 = setTimeout(() => {
      // Scene 2c: Take bite with synchronized audio & bite mark on slice (0.6s)
      setPandaPhase('biting');
      romanticAudio.playPandaChewingSequence();
      setBitesTaken(1);
    }, 3500);

    const t4 = setTimeout(() => {
      // Scene 2d: Chew happily with puffed cheeks (1.0s)
      setPandaPhase('chewing');
    }, 4100);

    const t5 = setTimeout(() => {
      // Scene 2e: Pull head back to natural position (0.4s)
      setPandaPhase('pullingBack');
    }, 5100);

    const t6 = setTimeout(() => {
      // Scene 3: Turn toward viewer and smile showing teeth (1.0s)
      setPandaPhase('smiling');
      romanticAudio.playCelebrationChime();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285'],
        disableForReducedMotion: true,
      });
    }, 5500);

    const t7 = setTimeout(() => {
      // Scene 4: Final Pose (holds smiling pose indefinitely with subtle breathing only)
      setPandaPhase('finalPose');
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [cutStage, pandaPhase]);

  // When in video mode and cake is cut, render the immersive full-screen PandaVideoPlayer!
  if (cutStage >= 3 && viewMode === 'video') {
    return (
      <PandaVideoPlayer
        onComplete={onComplete}
        onSwitchToInteractive={() => setViewMode('interactive')}
      />
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-between px-3 pt-2 pb-[max(2rem,env(safe-area-inset-bottom,2rem))] text-center select-none">
      {/* Subtle, cinematic firework effect in the background triggering when user finishes cutting cake (cutStage >= 3) */}
      <CinematicFireworks active={cutStage >= 3} />

      {/* Subtle, slow-rising festive balloons floating in the background after the cake is cut */}
      <FestiveBalloons active={cutStage >= 3} />

      {/* Title & Instructions */}
      <div className="space-y-1.5 z-20">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-wide text-[#fce8ee]"
        >
          {cutStage === 0
            ? "Slice Your Birthday Cake! ♡"
            : cutStage === 1
            ? "Separate a Piece! (Slice 2 of 3)"
            : cutStage === 2
            ? "One More Slice! (Slice 3 of 3)"
            : "Look at the Baby Panda! 🐼🎂"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-serif text-sm sm:text-base md:text-lg italic text-[#e0a8b9]"
        >
          {cutStage === 0
            ? "Tap the cake to make cut 1 and see the celebratory spark burst..."
            : cutStage === 1
            ? "Make cut 2 to separate a birthday slice onto the plate..."
            : cutStage === 2
            ? "Make cut 3 to finish slicing the cake..."
            : "He smelled your birthday cake, took a sweet bite, and has the happiest smile for you! ♡"}
        </motion.p>

        {/* View Switcher button when Cake is Cut */}
        {cutStage >= 3 && (
          <div className="flex items-center justify-center gap-2 pt-2 z-20">
            <button
              type="button"
              onClick={() => setViewMode('video')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#dfb285] hover:bg-[#f0c396] text-[#270b18] text-xs sm:text-sm font-sans font-bold shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Film className="w-4 h-4" />
              <span>🎬 Full-Screen 3D Panda Video</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Slicing Arena */}
      <div className="relative my-3 sm:my-6 w-full max-w-[480px] aspect-[4/3] flex items-center justify-center cursor-none touch-none overflow-visible">
        {/* Warm Ambient Underglow */}
        <div className="pointer-events-none absolute inset-x-8 bottom-4 h-36 rounded-full bg-gradient-to-t from-[#e5a4b4]/25 via-[#dfb285]/20 to-transparent blur-3xl" />

        {/* FRAMER MOTION PARTICLE EXPLOSION (Triggers on every single cut) */}
        <CakeParticleExplosion
          explosionId={explosionId}
          originXPercent={explosionOrigin.x}
          originYPercent={explosionOrigin.y}
        />

        {/* PRIMARY SVG CAKE WITH REAL PHYSICALLY SEPARATING PIECES */}
        <svg
          ref={svgRef}
          viewBox="0 0 400 340"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="relative z-10 w-full h-full drop-shadow-[0_15px_30px_rgba(20,5,15,0.45)] overflow-visible"
        >
          <defs>
            {/* Gradients for cake frosting & internal sponge layers */}
            <linearGradient id="topFrostingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff8fa" />
              <stop offset="40%" stopColor="#fdebed" />
              <stop offset="100%" stopColor="#f8d4dc" />
            </linearGradient>

            <linearGradient id="bottomFrostingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fcebf0" />
              <stop offset="45%" stopColor="#f4c8d3" />
              <stop offset="100%" stopColor="#e7a2b2" />
            </linearGradient>

            {/* Exposed Internal Cut Face (Sponge + Cream + Berry Jam) */}
            <linearGradient id="spongeFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff9e6" />
              <stop offset="25%" stopColor="#ffd166" />
              <stop offset="50%" stopColor="#f4a261" />
              <stop offset="100%" stopColor="#ffe8a3" />
            </linearGradient>

            <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d6cad2" />
              <stop offset="50%" stopColor="#faf5ee" />
              <stop offset="100%" stopColor="#d6cad2" />
            </linearGradient>

            <linearGradient id="dessertPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f5e6eb" />
              <stop offset="100%" stopColor="#d8c2cb" />
            </linearGradient>

            <linearGradient id="strawberryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e63946" />
              <stop offset="100%" stopColor="#b7094c" />
            </linearGradient>

            <filter id="cutShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-2" dy="4" stdDeviation="4" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* MAIN PORCELAIN CAKE STAND */}
          <g id="cakeStand">
            <ellipse cx="200" cy="305" rx="85" ry="12" fill="url(#pedestalGrad)" />
            <path d="M 182 300 L 190 255 L 210 255 L 218 300 Z" fill="#ebe1e7" />
            <ellipse cx="200" cy="255" rx="175" ry="20" fill="url(#pedestalGrad)" stroke="#ffffff" strokeWidth="1.5" />
            <ellipse cx="200" cy="254" rx="165" ry="15" fill="#f8eff3" opacity="0.7" />
          </g>

          {/* FRONT DESSERT SERVING PLATE */}
          <g id="servingPlate" className="transition-opacity duration-500">
            <ellipse cx="230" cy="295" rx="75" ry="18" fill="url(#dessertPlateGrad)" stroke="#dfb285" strokeWidth="1.5" />
            <ellipse cx="230" cy="294" rx="66" ry="13" fill="#ffffff" opacity="0.8" />

            {/* Cute leftover crumbs on the dessert plate after panda takes the slice */}
            {bitesTaken >= 1 && (
              <g id="plateCrumbs">
                <circle cx="225" cy="294" r="1.8" fill="#ffd166" />
                <circle cx="233" cy="296" r="1.5" fill="#e63946" />
                <circle cx="218" cy="293" r="1.4" fill="#ffd166" />
                <circle cx="238" cy="295" r="1.3" fill="#b7094c" />
                <circle cx="228" cy="297" r="1.1" fill="#dfb285" />
              </g>
            )}
          </g>

          {/* PIECE 1: LEFT HALF OF THE CAKE */}
          {/* On Cut 1: physically separates and translates to the left by 32px */}
          {/* On Cut 3: a slice is cut from the left, shifting left half further by 44px */}
          <motion.g
            id="leftPiece"
            animate={{
              x: cutStage >= 3 ? -44 : cutStage >= 1 ? -32 : 0,
              rotate: cutStage >= 1 ? -2.5 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '70px 250px' }}
          >
            {/* Bottom Tier Left Half */}
            <path
              d="M 60 145 C 60 145, 60 220, 60 225 C 60 248, 120 252, 198 252 L 198 145 Z"
              fill="url(#bottomFrostingGrad)"
            />
            <path
              d="M 60 145 C 60 133, 120 124, 198 124 L 198 145 C 120 145, 60 145, 60 145 Z"
              fill="#fff0f3"
              stroke="#ffffff"
              strokeWidth="1"
            />
            {/* Scallops */}
            <path
              d="M 60 150 Q 90 170 125 152 Q 160 172 198 152"
              fill="none"
              stroke="#fae4ea"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse cx="95" cy="195" rx="8" ry="10" fill="url(#strawberryGrad)" />
            <ellipse cx="145" cy="200" rx="8" ry="10" fill="url(#strawberryGrad)" />

            {/* Top Tier Left Half */}
            <path
              d="M 95 65 C 95 65, 95 130, 95 134 C 95 152, 140 156, 198 156 L 198 65 Z"
              fill="url(#topFrostingGrad)"
            />
            <path
              d="M 95 65 C 95 54, 140 48, 198 48 L 198 65 Z"
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <ellipse cx="115" cy="67" rx="6" ry="4" fill="#fae6eb" />
            <ellipse cx="145" cy="67" rx="6" ry="4" fill="#fae6eb" />
            <ellipse cx="175" cy="67" rx="6" ry="4" fill="#fae6eb" />
            <ellipse cx="130" cy="53" rx="7" ry="9" fill="url(#strawberryGrad)" />
            <ellipse cx="170" cy="52" rx="7" ry="9" fill="url(#strawberryGrad)" />

            {/* Exposed Internal Cut Face */}
            {cutStage >= 1 && (
              <g id="leftExposedCutFace" filter="url(#cutShadow)">
                <rect x="194" y="48" width="6" height="204" fill="url(#spongeFaceGrad)" />
                <rect x="194" y="90" width="6" height="5" fill="#b7094c" />
                <rect x="194" y="125" width="6" height="6" fill="#800f2f" />
                <rect x="194" y="175" width="6" height="7" fill="#b7094c" />
                <rect x="194" y="215" width="6" height="7" fill="#800f2f" />
                <rect x="194" y="95" width="6" height="2.5" fill="#ffffff" />
                <rect x="194" y="182" width="6" height="2.5" fill="#ffffff" />
              </g>
            )}
          </motion.g>

          {/* PIECE 2: RIGHT MAIN CAKE */}
          {/* On Cut 1: translates right by 30px */}
          <motion.g
            id="rightPiece"
            animate={{
              x: cutStage >= 1 ? 30 : 0,
              rotate: cutStage >= 1 ? 2 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '330px 250px' }}
          >
            <path
              d="M 202 145 L 202 252 C 280 252, 340 248, 340 225 C 340 220, 340 145, 340 145 Z"
              fill="url(#bottomFrostingGrad)"
            />
            <path
              d="M 202 124 C 280 124, 340 133, 340 145 L 202 145 Z"
              fill="#fff0f3"
              stroke="#ffffff"
              strokeWidth="1"
            />
            <path
              d="M 202 152 Q 240 172 275 152 Q 310 170 340 150"
              fill="none"
              stroke="#fae4ea"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse cx="255" cy="200" rx="8" ry="10" fill="url(#strawberryGrad)" />
            <ellipse cx="305" cy="195" rx="8" ry="10" fill="url(#strawberryGrad)" />

            <path
              d="M 202 65 L 202 156 C 260 156, 305 152, 305 134 C 305 130, 305 65, 305 65 Z"
              fill="url(#topFrostingGrad)"
            />
            <path
              d="M 202 48 C 260 48, 305 54, 305 65 L 202 65 Z"
              fill="#ffffff"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <ellipse cx="225" cy="67" rx="6" ry="4" fill="#fae6eb" />
            <ellipse cx="255" cy="67" rx="6" ry="4" fill="#fae6eb" />
            <ellipse cx="285" cy="67" rx="6" ry="4" fill="#fae6eb" />
            <ellipse cx="230" cy="52" rx="7" ry="9" fill="url(#strawberryGrad)" />
            <ellipse cx="270" cy="53" rx="7" ry="9" fill="url(#strawberryGrad)" />

            {cutStage >= 1 && cutStage < 2 && (
              <g id="rightExposedCutFace" filter="url(#cutShadow)">
                <rect x="200" y="48" width="6" height="204" fill="url(#spongeFaceGrad)" />
                <rect x="200" y="90" width="6" height="5" fill="#b7094c" />
                <rect x="200" y="125" width="6" height="6" fill="#800f2f" />
                <rect x="200" y="175" width="6" height="7" fill="#b7094c" />
                <rect x="200" y="215" width="6" height="7" fill="#800f2f" />
              </g>
            )}

            {/* Cavity / Missing Notch where the piece was cut */}
            {cutStage >= 2 && (
              <g id="sliceCavity">
                <path
                  d="M 200 48 L 245 60 L 245 235 L 200 252 Z"
                  fill="url(#spongeFaceGrad)"
                  opacity="0.95"
                />
                <rect x="200" y="90" width="45" height="5" fill="#b7094c" opacity="0.9" />
                <rect x="200" y="125" width="45" height="6" fill="#800f2f" opacity="0.9" />
                <rect x="200" y="175" width="45" height="7" fill="#b7094c" opacity="0.9" />
                <rect x="200" y="215" width="45" height="7" fill="#800f2f" opacity="0.9" />
              </g>
            )}
          </motion.g>

          {/* PIECE 3: SEVERED CAKE SLICE SITTING ON THE FRONT DESSERT PLATE */}
          {/* On Cut 2 & 3: PHYSICALLY DETACHES and slides forward onto the dessert plate */}
          {/* When panda bites: PHYSICALLY LIFTS OFF PLATE INTO PANDA'S PAWS! */}
          {cutStage >= 2 && (
            <motion.g
              id="severedSlice"
              initial={{ x: 20, y: 0, scale: 0.96 }}
              animate={
                bitesTaken >= 1
                  ? {
                      x: [40, 75, 115],
                      y: [65, 45, 20],
                      scale: [1.05, 0.75, 0],
                      opacity: [1, 0.9, 0],
                      rotate: [6, 16, 28],
                    }
                  : {
                      x: 40,
                      y: 65,
                      rotate: 6,
                      scale: 1.05,
                      opacity: 1,
                    }
              }
              transition={
                bitesTaken >= 1
                  ? { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }
                  : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
              }
            >
              <g filter="url(#cutShadow)">
                <path
                  d="M 185 85 L 235 98 L 235 210 L 185 200 Z"
                  fill="url(#spongeFaceGrad)"
                />
                <rect x="185" y="115" width="50" height="5" fill="#b7094c" />
                <rect x="185" y="145" width="50" height="6" fill="#800f2f" />
                <rect x="185" y="175" width="50" height="6" fill="#b7094c" />

                <path
                  d="M 235 98 C 248 102, 255 110, 255 125 L 255 218 C 255 224, 245 220, 235 210 Z"
                  fill="url(#topFrostingGrad)"
                />
                <path
                  d="M 185 85 L 235 98 C 248 102, 255 110, 255 125 L 185 85 Z"
                  fill="#ffffff"
                  stroke="#fae6eb"
                  strokeWidth="1.5"
                />

                <ellipse cx="225" cy="98" rx="8" ry="11" fill="url(#strawberryGrad)" />
                <circle cx="222" cy="95" r="1.5" fill="#ffffff" opacity="0.7" />
                <ellipse cx="242" cy="112" rx="5" ry="4" fill="#fae6eb" />
              </g>
            </motion.g>
          )}
        </svg>

        {/* 2D BABY PANDA CUB ENTERS FROM THE RIGHT WALKING TO THE CAKE!
            Scene 1: Slowly walks toward cake with small, adorable natural steps (2.5s)
            Scene 2: Pauses, leans, takes bite, pulls back (2.5s)
            Scene 3: Smiles showing cute white teeth (0.8s)
            Scene 4: Settles into stationary final pose holding smile indefinitely
        */}
        <AnimatePresence>
          {cutStage >= 3 && pandaPhase !== 'idle' && (
            <motion.div
              initial={{ x: 160, opacity: 0 }}
              animate={{
                x:
                  pandaPhase === 'entering' || pandaPhase === 'approaching'
                    ? [160, -24]
                    : pandaPhase === 'pausing' || pandaPhase === 'looking'
                    ? -26
                    : pandaPhase === 'leaning'
                    ? -38
                    : pandaPhase === 'biting'
                    ? -52
                    : pandaPhase === 'chewing'
                    ? -30
                    : -24,
                y: 0,
                opacity: 1,
              }}
              transition={{
                x:
                  pandaPhase === 'entering' || pandaPhase === 'approaching'
                    ? { duration: 2.5, ease: [0.25, 0.1, 0.25, 1.0] }
                    : { duration: 0.45, ease: 'easeInOut' },
                opacity: { duration: 0.4 },
              }}
              className="absolute right-1 sm:right-5 bottom-2 sm:bottom-3 z-40 flex flex-col items-center pointer-events-none select-none"
            >
              <Walking2DPanda phase={pandaPhase} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOVEABLE KNIFE (Follows user's pointer, animates slice plunge on click) */}
        {cutStage < 3 && (
          <div
            style={{
              left: `${(knifeSvgPos.x / 400) * 100}%`,
              top: `${(knifeSvgPos.y / 340) * 100}%`,
            }}
            className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[85%]"
          >
            <motion.div
              animate={
                isSlicing
                  ? { y: [0, 50, -10, 0], rotate: [-15, 0, -20, -15], scale: [1, 1.15, 0.95, 1] }
                  : { y: [0, -6, 0], rotate: [-18, -15, -18] }
              }
              transition={{
                duration: isSlicing ? 0.38 : 2.2,
                repeat: isSlicing ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex flex-col items-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
            >
              {/* Knife Silver Blade */}
              <div className="h-28 w-4 rounded-t-sm bg-gradient-to-r from-[#d8d8de] via-[#ffffff] to-[#a8a8b2] border-r border-[#888890] [clip-path:polygon(0%_0%,100%_15%,100%_100%,0%_100%)] shadow-inner">
                <div className="absolute inset-y-0 left-1 w-1 bg-white/70" />
              </div>

              {/* Knife Bolster */}
              <div className="h-2 w-6 rounded-sm bg-[#dfb285] shadow-sm" />

              {/* Luxury Wooden Handle */}
              <div className="h-16 w-4 rounded-b-md bg-gradient-to-b from-[#7a2238] to-[#451422] border border-[#a2485e]/50 shadow-md">
                <div className="h-1 w-full bg-[#dfb285]/40 mt-3" />
                <div className="h-1 w-full bg-[#dfb285]/40 mt-3" />
              </div>

              {/* Action Badge */}
              <div className="absolute -top-7 whitespace-nowrap rounded-full bg-[#270b18]/90 px-3.5 py-1 text-[11px] font-sans font-semibold text-[#ffd1dc] border border-[#e8a2b5]/40 shadow-lg backdrop-blur-sm">
                {isSlicing
                  ? 'Cutting Cake... 🔪'
                  : `Tap to Cut Slice ${cutStage + 1} 🔪`}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Progress & Next Scene Action Button */}
      <div className="min-h-[80px] flex flex-col items-center justify-center z-20 space-y-2">
        {cutStage >= 3 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col items-center space-y-2.5"
          >
            <p className="font-serif text-sm sm:text-base text-[#f2cad6] italic max-w-md">
              "Even the little panda couldn't resist how sweet you are! ♡ Happy Birthday, My Love."
            </p>
            <RomanticButton onClick={onComplete}>
              One Last Letter 💌
            </RomanticButton>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={executeCut}
                className="relative inline-flex items-center gap-2 px-6 py-2.5 min-h-[46px] rounded-full bg-[#3a1324]/85 hover:bg-[#521b33] text-[#ffd1dc] border border-[#e5a4b4]/40 text-xs sm:text-sm font-sans font-semibold transition-all shadow-md touch-manipulation cursor-pointer active:scale-98"
              >
                <Sparkles className="h-4 w-4 text-[#dfb285]" />
                <span>
                  {cutStage === 0
                    ? 'Click to Make Slice 1 (Split Cake)'
                    : cutStage === 1
                    ? 'Click to Make Slice 2 (Separate Piece)'
                    : 'Click to Make Slice 3 (Summon Baby Panda!)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCutStage(3);
                  setViewMode('video');
                  confetti({
                    particleCount: 75,
                    spread: 85,
                    origin: { y: 0.65 },
                    colors: ['#ffd166', '#f7b6c5', '#ffffff', '#dfb285', '#e91e63'],
                    disableForReducedMotion: true,
                  });
                  romanticAudio.playCelebrationChime();
                }}
                className="relative inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[46px] rounded-full bg-[#270b18]/85 hover:bg-[#42172a] text-[#ffd1dc] border border-[#e8a2b5]/35 text-xs sm:text-sm font-sans font-medium transition-all shadow-sm cursor-pointer active:scale-98"
              >
                <Film className="h-4 w-4 text-[#dfb285]" />
                <span>Watch Panda Video 🎬</span>
              </button>
            </div>
            <span className="text-xs font-sans text-[#e8bed0]/80">
              Cut {cutStage} of 3 completed — each cut triggers celebratory particle sparks! ✨
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
