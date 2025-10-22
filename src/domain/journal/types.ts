export type LogSource =
  | 'journal'
  | 'pomodoro'
  | 'workout'
  | 'cycle'
  | 'recipes'
  | 'meditation'
  | 'audio';

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface LogEntry {
  id: string;
  dateISO: string;
  source: LogSource;
  tags: string[];
  durataMin?: number;
  mood?: MoodLevel;
  note?: string;
  format?: 'plain' | 'md';
}
