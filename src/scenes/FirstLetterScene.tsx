import React from 'react';
import { MobileRomanticLetter } from '../components/MobileRomanticLetter';
import { BIRTHDAY_CONFIG } from '../config/birthday';

interface FirstLetterSceneProps {
  onContinue: () => void;
}

export const FirstLetterScene: React.FC<FirstLetterSceneProps> = ({ onContinue }) => {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-3 py-4 sm:py-8 select-none overflow-y-auto">
      <MobileRomanticLetter
        content={BIRTHDAY_CONFIG.firstLetter}
        onContinue={onContinue}
        continueButtonText="Continue Our Story"
        senderName={BIRTHDAY_CONFIG.yourName || 'Your Secret Admirer'}
      />
    </div>
  );
};
