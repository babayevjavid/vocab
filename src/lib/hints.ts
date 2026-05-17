import type { HintState } from "../types";
import type { LetterStatus } from "../types";
import { WORD_LENGTH } from "../types";

export function pickHintPosition(
  solution: string,
  guesses: string[],
  evaluations: LetterStatus[][]
): HintState {
  const knownCorrect = new Set<number>();

  for (let g = 0; g < guesses.length; g++) {
    const ev = evaluations[g];
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (ev[i] === "correct") knownCorrect.add(i);
    }
  }

  const available: number[] = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (!knownCorrect.has(i)) available.push(i);
  }

  if (available.length === 0) return null;

  const position = available[Math.floor(Math.random() * available.length)];
  return { position, letter: solution[position] };
}
