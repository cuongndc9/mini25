import React, { useState, useRef, useEffect } from 'react';
import { LOFI_THEMES } from '../constants';
import { LofiTheme } from '../types';
import { PlayIcon, PauseIcon, Volume2Icon } from './icons';

const Player: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<LofiTheme>(LOFI_THEMES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  // This single effect handles all audio state synchronization.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Sync volume
    audio.volume = volume;

    // Sync playing state
    if (isPlaying) {
      // The play() method returns a promise which can be used to catch errors.
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio play failed:", error);
          // Auto-pausing UI if playback fails (e.g. browser policy)
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  // When the theme changes, the `src` prop on the <audio> element updates.
  // This effect will then re-run, and if `isPlaying` is true, it will play the new source.
  }, [isPlaying, currentTheme, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = LOFI_THEMES.find(theme => theme.name === event.target.value);
    if (selectedTheme) {
      setCurrentTheme(selectedTheme);
    }
  };

  return (
    <div className="glass-pane p-6 rounded-2xl w-full mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex-grow mr-4">
            <label htmlFor="theme-select" className="text-sm text-[var(--text-secondary)] mb-1 block">Choose your vibe</label>
            <select
                id="theme-select"
                value={currentTheme.name}
                onChange={handleThemeChange}
                className="w-full bg-white/50 border border-[var(--glass-border)] text-[var(--text-primary)] rounded-lg p-2.5 focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-[var(--primary-accent)] transition appearance-none"
            >
            {LOFI_THEMES.map(theme => (
              <option key={theme.name} value={theme.name} className="bg-[var(--card-bg)] text-[var(--text-primary)]">{theme.name}</option>
            ))}
          </select>
        </div>
        <button onClick={togglePlay} className="bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-[var(--text-primary)] rounded-full w-14 h-14 flex items-center justify-center transition-colors flex-shrink-0" aria-label={isPlaying ? 'Pause Music' : 'Play Music'}>
          {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 pl-1" />}
        </button>
      </div>
      <div className="flex items-center mt-4 space-x-3">
        <Volume2Icon className="text-[var(--text-secondary)]" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="Volume control"
        />
      </div>
      <audio ref={audioRef} src={currentTheme.url} loop preload="auto" />
    </div>
  );
};

export default Player;