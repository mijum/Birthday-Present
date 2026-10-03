import React from 'react';
import { MemoryGallery } from '../components/MemoryGallery';
import { BIRTHDAY_CONFIG } from '../config/birthday';

interface MemoriesSceneProps {
  onContinue: () => void;
}

export const MemoriesScene: React.FC<MemoriesSceneProps> = ({ onContinue }) => {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-3 py-6 sm:py-8 select-none overflow-y-auto">
      <MemoryGallery
        memories={BIRTHDAY_CONFIG.memories}
        onComplete={onContinue}
      />
    </div>
  );
};
