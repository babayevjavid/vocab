import type { LetterStatus } from "../types";
import { WORD_LENGTH } from "../types";

export type HardConstraints = {
  fixedPositions: (string | null)[];
  mustInclude: string[];
};

export function getHardConstraints(
  guesses: string[],
  evaluations: LetterStatus[][]
): HardConstraints {
  const fixedPositions: (string | null)[] = Array(WORD_LENGTH).fill(null);
  const mustIncludeSet = new Set<string>();

  for (let g = 0; g < guesses.length; g++) {
    const word = guesses[g];
    const ev = evaluations[g];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const ch = word[i];
      if (ev[i] === "correct") {
        fixedPositions[i] = ch;
        mustIncludeSet.add(ch);
      } else if (ev[i] === "present") {
        mustIncludeSet.add(ch);
      }
    }
  }

  return {
    fixedPositions,
    mustInclude: [...mustIncludeSet],
  };
}

export function validateHardModeGuess(
  guess: string,
  constraints: HardConstraints
): string | null {
  for (let i = 0; i < WORD_LENGTH; i++) {
    const required = constraints.fixedPositions[i];
    if (required && guess[i] !== required) {
      return "Hard mode: use all revealed hints";
    }
  }

  for (const ch of constraints.mustInclude) {
    if (!guess.includes(ch)) {
      return "Hard mode: use all revealed hints";
    }
  }

  return null;
}
