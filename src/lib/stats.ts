import type { Stats } from "../types";
import { MAX_GUESSES } from "../types";

const STATS_KEY = "vocab-stats";
const LEGACY_STATS_KEY = "lex-wordle-stats";

export const defaultStats: Stats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: Array(MAX_GUESSES).fill(0),
};

export function loadStats(): Stats {
  try {
    let raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STATS_KEY);
      if (raw) localStorage.setItem(STATS_KEY, raw);
    }
    if (!raw) return { ...defaultStats, distribution: [...defaultStats.distribution] };
    const parsed = JSON.parse(raw) as Stats;
    return {
      ...defaultStats,
      ...parsed,
      distribution: parsed.distribution?.length === MAX_GUESSES
        ? parsed.distribution
        : [...defaultStats.distribution],
    };
  } catch {
    return { ...defaultStats, distribution: [...defaultStats.distribution] };
  }
}

export function saveStats(stats: Stats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordResult(stats: Stats, won: boolean, guessCount: number): Stats {
  const distribution = [...stats.distribution];
  const next: Stats = {
    played: stats.played + 1,
    won: stats.won + (won ? 1 : 0),
    currentStreak: won ? stats.currentStreak + 1 : 0,
    maxStreak: 0,
    distribution,
  };
  next.maxStreak = Math.max(stats.maxStreak, next.currentStreak);
  if (won && guessCount >= 1 && guessCount <= MAX_GUESSES) {
    distribution[guessCount - 1] += 1;
  }
  saveStats(next);
  return next;
}
