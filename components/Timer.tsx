import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { TimerMode } from '../types';
import { PlayIcon, PauseIcon, ResetIcon } from './icons';

interface TimerProps {
  onPomodoroComplete: (taskName: string) => void;
  currentTask: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const getModeName = (mode: TimerMode): string => {
  switch (mode) {
    case TimerMode.Pomodoro: return "Focus";
    case TimerMode.ShortBreak: return "Breathe";
    case TimerMode.LongBreak: return "Relax";
    default: return "";
  }
};

const Timer: React.FC<TimerProps> = ({ onPomodoroComplete, currentTask }) => {
  const handleTimerEnd = (completedMode: TimerMode) => {
    if (completedMode === TimerMode.Pomodoro) {
      onPomodoroComplete(currentTask);
    }
  };

  const { timeLeft, mode, isActive, start, pause, reset, selectMode } = useTimer({ onTimerEnd: handleTimerEnd });

  const modes = [
    { id: TimerMode.Pomodoro, label: "Focus" },
    { id: TimerMode.ShortBreak, label: "Short Break" },
    { id: TimerMode.LongBreak, label: "Long Break" },
  ];
  
  return (
    <div className="glass-pane p-6 sm:p-8 rounded-2xl w-full mx-auto text-center">
      <div className="bg-[rgba(0,0,0,0.05)] p-1 rounded-full flex justify-center items-center space-x-1 mb-8">
        {modes.map(m => (
          <button 
            key={m.id}
            onClick={() => selectMode(m.id)} 
            className={`flex-1 px-2 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[var(--primary-accent)] ${
              mode === m.id ? 'bg-[var(--primary-accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[rgba(0,0,0,0.05)]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      
      <div className="mb-6">
        <p className="text-7xl md:text-8xl font-bold tracking-tighter text-[var(--text-primary)] tabular-nums">
          {formatTime(timeLeft)}
        </p>
        <p className="text-[var(--primary-accent)] mt-2 text-lg font-medium">{getModeName(mode)}</p>
      </div>

      <div className="flex justify-center items-center space-x-6">
        <button onClick={reset} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2" aria-label="Reset Timer">
          <ResetIcon className="w-7 h-7"/>
        </button>
        <button 
          onClick={isActive ? pause : start}
          className="bg-[var(--primary-accent)] hover:bg-[var(--primary-accent-hover)] text-white rounded-full w-24 h-24 flex items-center justify-center text-2xl font-bold transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
          aria-label={isActive ? 'Pause Timer' : 'Start Timer'}
        >
          {isActive ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10 pl-1" />}
        </button>
        <div className="w-7 h-7 p-2"></div>
      </div>
    </div>
  );
};

export default Timer;