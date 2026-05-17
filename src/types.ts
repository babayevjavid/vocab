export type LetterStatus = "correct" | "present" | "absent" | "empty" | "tbd" | "hint";

export type Tile = {
  letter: string;
  status: LetterStatus;
};

export type GameStatus = "playing" | "won" | "lost";

export type GameMode = "daily" | "practice" | "blitz";

export type ColorTheme = "dark" | "light" | "ocean" | "sunset" | "forest" | "midnight";

export type KeyState = Record<string, LetterStatus>;

export type Stats = {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
};

export type HintState = {
  position: number;
  letter: string;
} | null;

export type Settings = {
  hardMode: boolean;
  soundEnabled: boolean;
  colorTheme: ColorTheme;
};

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
export const BLITZ_SECONDS = 180;

export const STREAK_MILESTONES = [3, 7, 14, 30] as const;
