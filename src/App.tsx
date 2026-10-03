/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSceneManager } from './hooks/useSceneManager';
import { FloatingPetals } from './components/FloatingPetals';
import { GlowingParticles } from './components/GlowingParticles';
import { AudioControls } from './components/AudioControls';
import { IntroScene } from './scenes/IntroScene';
import { FirstLetterScene } from './scenes/FirstLetterScene';
import { MemoriesScene } from './scenes/MemoriesScene';
import { CakeScene } from './scenes/CakeScene';
import { CakeCuttingScene } from './scenes/CakeCuttingScene';
import { FinalLetterScene } from './scenes/FinalLetterScene';
import { romanticAudio } from './utils/audioSynthesizer';
import { BIRTHDAY_CONFIG } from './config/birthday';

export default function App() {
  const { currentScene, nextScene, goToScene, restartExperience } = useSceneManager('INTRO');
  const [musicStarted, setMusicStarted] = useState<boolean>(false);
  const [experienceKey, setExperienceKey] = useState<number>(0);

  const handleStartMusic = () => {
    if (!musicStarted) {
      setMusicStarted(true);
      romanticAudio.startMusic(BIRTHDAY_CONFIG.audio.backgroundMusicUrl);
    }
  };

  const handleRestart = () => {
    setExperienceKey((prev) => prev + 1);
    restartExperience();
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      romanticAudio.stopMusic();
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#1b0a15] text-[#faf5ee] overflow-x-hidden font-sans selection:bg-[#dfb285] selection:text-[#270b16]">
      {/* Visual Image Layer 1: background.jpg (dreamy blush bokeh and floating petals) */}
      <img
        src="/background.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover opacity-35 mix-blend-screen transition-opacity duration-1000"
      />

      {/* Cinematic Romantic Gradient Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
        style={{
          background:
            currentScene === 'BIRTHDAY_CAKE' || currentScene === 'CAKE_CUTTING'
              ? 'radial-gradient(circle at 50% 45%, rgba(61,16,36,0.85) 0%, rgba(32,7,19,0.92) 60%, rgba(17,3,9,0.98) 100%)'
              : currentScene === 'FIRST_LETTER' || currentScene === 'FINAL_LETTER'
              ? 'radial-gradient(circle at 50% 30%, rgba(74,21,42,0.82) 0%, rgba(39,11,24,0.90) 55%, rgba(21,5,14,0.98) 100%)'
              : 'radial-gradient(circle at 50% 40%, rgba(82,22,48,0.78) 0%, rgba(46,13,29,0.88) 50%, rgba(22,4,13,0.96) 100%)',
        }}
      />

      {/* Visual Image Layer 2: bottom.jpg (lush bed of pink rose petals anchored at the bottom) */}
      <div className="pointer-events-none fixed bottom-0 inset-x-0 z-0 h-28 sm:h-40 overflow-hidden [mask-image:linear-gradient(to_top,black_40%,transparent_100%)] opacity-40">
        <img
          src="/bottom.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top"
        />
      </div>

      {/* Subtle Filmic Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)]"
        aria-hidden="true"
      />

      {/* Floating Rose Petals & Glowing Bokeh */}
      <FloatingPetals />
      <GlowingParticles count={24} />

      {/* Persistent Audio & Story Navigation Controls */}
      <AudioControls
        currentScene={currentScene}
        onNavigateToScene={(scene) => {
          handleStartMusic();
          goToScene(scene);
        }}
        musicStarted={musicStarted}
        onStartMusic={handleStartMusic}
      />

      {/* Central Interactive Story Scenes */}
      <main className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene}-${experienceKey}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[100dvh] w-full flex-col items-center justify-center"
          >
            {currentScene === 'INTRO' && (
              <IntroScene
                onContinue={nextScene}
                onUserInteraction={handleStartMusic}
              />
            )}

            {currentScene === 'FIRST_LETTER' && (
              <FirstLetterScene onContinue={nextScene} />
            )}

            {currentScene === 'MEMORIES' && (
              <MemoriesScene onContinue={nextScene} />
            )}

            {currentScene === 'BIRTHDAY_CAKE' && (
              <CakeScene onContinue={nextScene} />
            )}

            {currentScene === 'CAKE_CUTTING' && (
              <CakeCuttingScene onContinue={nextScene} />
            )}

            {currentScene === 'FINAL_LETTER' && (
              <FinalLetterScene onRestart={handleRestart} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
