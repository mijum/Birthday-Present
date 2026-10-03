import React from 'react';
import { CakeCutting } from '../components/CakeCutting';

interface CakeCuttingSceneProps {
  onContinue: () => void;
}

export const CakeCuttingScene: React.FC<CakeCuttingSceneProps> = ({ onContinue }) => {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-6 sm:py-10 select-none overflow-y-auto">
      <CakeCutting onComplete={onContinue} />
    </div>
  );
};
