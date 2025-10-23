
import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode } from '../types';
import { TIMER_DURATIONS, POMODOROS_UNTIL_LONG_BREAK } from '../constants';

interface UseTimerProps {
  onTimerEnd: (completedMode: TimerMode) => void;
}

export const useTimer = ({ onTimerEnd }: UseTimerProps) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.Pomodoro);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATIONS[mode]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [pomodoroCycle, setPomodoroCycle] = useState<number>(0);
  
  const intervalRef = useRef<number | null>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationAudioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
  }, []);

  const switchMode = useCallback(() => {
    const completedMode = mode;
    let nextMode: TimerMode;
    let newPomodoroCycle = pomodoroCycle;
    
    if (completedMode === TimerMode.Pomodoro) {
        newPomodoroCycle = pomodoroCycle + 1;
        setPomodoroCycle(newPomodoroCycle);
        nextMode = newPomodoroCycle % POMODOROS_UNTIL_LONG_BREAK === 0 ? TimerMode.LongBreak : TimerMode.ShortBreak;
    } else {
        nextMode = TimerMode.Pomodoro;
    }
    
    setMode(nextMode);
    setIsActive(true); // Auto-start next session
    onTimerEnd(completedMode);
  }, [mode, pomodoroCycle, onTimerEnd]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            notificationAudioRef.current?.play().catch(e => console.error("Error playing sound:", e));
            switchMode();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, switchMode]);

  // Effect to reset time when mode changes
  useEffect(() => {
    setTimeLeft(TIMER_DURATIONS[mode]);
  }, [mode]);
  
  // Effect to update document title when time changes
  useEffect(() => {
    document.title = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')} - Focus`;
  }, [timeLeft]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  const selectMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
  }

  return { timeLeft, mode, isActive, start, pause, reset, selectMode };
};
