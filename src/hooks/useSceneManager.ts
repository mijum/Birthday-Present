import { useState, useCallback } from 'react';
import { SceneId } from '../types/birthday';

export const SCENE_ORDER: readonly SceneId[] = [
  'INTRO',
  'FIRST_LETTER',
  'MEMORIES',
  'BIRTHDAY_CAKE',
  'CAKE_CUTTING',
  'FINAL_LETTER',
] as const;

export function useSceneManager(initialScene: SceneId = 'INTRO') {
  const [currentScene, setCurrentScene] = useState<SceneId>(initialScene);

  // Directly and deterministically moves to the next scene in the sequence:
  // INTRO -> FIRST_LETTER -> MEMORIES -> BIRTHDAY_CAKE -> CAKE_CUTTING -> FINAL_LETTER -> INTRO
  const nextScene = useCallback(() => {
    setCurrentScene((prev) => {
      const currentIndex = SCENE_ORDER.indexOf(prev);
      if (currentIndex === -1) return SCENE_ORDER[0];
      const nextIndex = (currentIndex + 1) % SCENE_ORDER.length;
      return SCENE_ORDER[nextIndex];
    });
  }, []);

  // Directly sets a specific target scene
  const goToScene = useCallback((targetScene: SceneId) => {
    setCurrentScene(targetScene);
  }, []);

  // Resets cleanly back to the first scene (INTRO)
  const restartExperience = useCallback(() => {
    setCurrentScene(SCENE_ORDER[0]);
  }, []);

  return {
    currentScene,
    nextScene,
    goToScene,
    restartExperience,
  };
}
