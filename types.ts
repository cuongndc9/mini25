
export enum TimerMode {
  Pomodoro = 'POMODORO',
  ShortBreak = 'SHORT_BREAK',
  LongBreak = 'LONG_BREAK',
}

export interface HistoryEntry {
  id: string;
  taskName: string;
  timestamp: number;
}

export interface LofiTheme {
  name: string;
  url: string;
}
