import { TimerMode, LofiTheme } from './types';

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  [TimerMode.Pomodoro]: 25 * 60,
  [TimerMode.ShortBreak]: 5 * 60,
  [TimerMode.LongBreak]: 15 * 60,
};

export const POMODOROS_UNTIL_LONG_BREAK = 4;

export const LOFI_THEMES: LofiTheme[] = [
  { name: "Lofi Study", url: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_c3a071b35b.mp3" },
  { name: "Just Relax", url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_2d02518b57.mp3" },
  { name: "Rainy Day", url: "https://cdn.pixabay.com/download/audio/2022/08/04/audio_3c3b529792.mp3" },
  { name: "Ocean Waves", url: "https://cdn.pixabay.com/download/audio/2022/08/03/audio_51c633a69a.mp3" },
  { name: "Cafe Vibes", url: "https://cdn.pixabay.com/download/audio/2022/04/18/audio_34bcf1b873.mp3" },
  { name: "Forest Sounds", url: "https://cdn.pixabay.com/download/audio/2022/05/17/audio_38294451b6.mp3" },
  { name: "Campfire", url: "https://cdn.pixabay.com/download/audio/2022/11/17/audio_84f932f520.mp3" },
  { name: "Jazz Cafe", url: "https://cdn.pixabay.com/download/audio/2023/05/26/audio_4f0c7657b9.mp3" },
  { name: "Synthwave", url: "https://cdn.pixabay.com/download/audio/2023/03/23/audio_903067195d.mp3" },
  { name: "Ambient", url: "https://cdn.pixabay.com/download/audio/2022/12/16/audio_29118e7786.mp3" },
];