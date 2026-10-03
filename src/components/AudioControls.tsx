import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Compass, X } from 'lucide-react';
import { romanticAudio } from '../utils/audioSynthesizer';
import { SceneId } from '../types/birthday';

interface AudioControlsProps {
  currentScene: SceneId;
  onNavigateToScene: (scene: SceneId) => void;
  musicStarted: boolean;
  onStartMusic: () => void;
}

const SCENE_NAMES: { id: SceneId; label: string; number: string }[] = [
  { id: 'INTRO', label: 'Introduction', number: '01' },
  { id: 'FIRST_LETTER', label: 'First Love Letter', number: '02' },
  { id: 'MEMORIES', label: 'Shared Memories', number: '03' },
  { id: 'BIRTHDAY_CAKE', label: 'Six Candles Wish', number: '04' },
  { id: 'CAKE_CUTTING', label: 'Cutting the Cake', number: '05' },
  { id: 'FINAL_LETTER', label: 'Final Love Letter', number: '06' },
];

export const AudioControls: React.FC<AudioControlsProps> = ({
  currentScene,
  onNavigateToScene,
  musicStarted,
  onStartMusic,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleToggleAudio = () => {
    if (!musicStarted) {
      onStartMusic();
      setIsMuted(false);
    } else {
      const muted = romanticAudio.toggleMute();
      setIsMuted(muted);
    }
  };

  return (
    <>
      <header className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Story Scenes Jump Menu Button */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Story chapter navigation"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#270e1b]/70 text-[#f6d7df] backdrop-blur-md border border-[#e8a2b5]/25 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:bg-[#3d162b] hover:border-[#e8a2b5]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285]"
        >
          <Compass className="h-4 w-4" />
        </button>

        {/* Music Sound Toggle */}
        <button
          onClick={handleToggleAudio}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          className={`group relative flex h-11 items-center gap-2.5 rounded-full px-3.5 backdrop-blur-md border transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dfb285] ${
            isMuted || !musicStarted
              ? 'bg-[#270e1b]/70 border-[#e8a2b5]/20 text-[#d8a8b5] hover:bg-[#3d162b]'
              : 'bg-[#401328]/85 border-[#f2b9c7]/40 text-[#fbebf0] hover:bg-[#4f1832]'
          }`}
        >
          {isMuted || !musicStarted ? (
            <VolumeX className="h-4 w-4 transition-transform group-hover:scale-110" />
          ) : (
            <Volume2 className="h-4 w-4 text-[#dfb285] transition-transform group-hover:scale-110" />
          )}

          {/* Animated audio bar indicator */}
          <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
            <span
              className={`w-0.5 rounded-full transition-all duration-300 ${
                musicStarted && !isMuted
                  ? 'h-3 bg-[#dfb285] animate-pulse'
                  : 'h-1 bg-[#d8a8b5]/50'
              }`}
            />
            <span
              className={`w-0.5 rounded-full transition-all duration-300 ${
                musicStarted && !isMuted
                  ? 'h-2 bg-[#f2b9c7] animate-pulse delay-75'
                  : 'h-1 bg-[#d8a8b5]/50'
              }`}
            />
            <span
              className={`w-0.5 rounded-full transition-all duration-300 ${
                musicStarted && !isMuted
                  ? 'h-3.5 bg-[#dfb285] animate-pulse delay-150'
                  : 'h-1 bg-[#d8a8b5]/50'
              }`}
            />
          </div>
        </button>
      </header>

      {/* Chapters Overlay Drawer */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#220c18] border border-[#d97c92]/30 p-6 shadow-2xl text-[#f7eef2]">
            <div className="flex items-center justify-between pb-4 border-b border-[#d97c92]/20">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-[#dfb285]" />
                <h3 className="font-serif text-lg tracking-wide text-[#fce8ee]">Story Chapters</h3>
              </div>
              <button
                onClick={() => setIsNavOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 text-[#d8a8b5] transition-colors"
                aria-label="Close story navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-4 space-y-2">
              {SCENE_NAMES.map((scene) => {
                const isActive = scene.id === currentScene;
                return (
                  <button
                    key={scene.id}
                    onClick={() => {
                      onNavigateToScene(scene.id);
                      setIsNavOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                      isActive
                        ? 'bg-[#501732] text-white font-medium border border-[#e5a4b4]/40'
                        : 'text-[#d8a8b5] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-mono text-[#dfb285]">{scene.number}</span>
                    <span className="text-sm tracking-wide font-sans">{scene.label}</span>
                    {isActive ? (
                      <span className="h-2 w-2 rounded-full bg-[#dfb285]" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
