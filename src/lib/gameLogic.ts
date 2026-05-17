import type { HintState, LetterStatus, Tile } from "../types";
import { WORD_LENGTH } from "../types";

export function evaluateGuess(guess: string, solution: string): LetterStatus[] {
  const result: LetterStatus[] = Array(WORD_LENGTH).fill("absent");
  const solutionChars = solution.split("");
  const guessChars = guess.split("");
  const used = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === solutionChars[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const letter = guessChars[i];
    const idx = solutionChars.findIndex(
      (c, j) => c === letter && !used[j]
    );
    if (idx !== -1) {
      result[i] = "present";
      used[idx] = true;
    }
  }

  return result;
}

export function mergeKeyState(
  prev: Record<string, LetterStatus>,
  guess: string,
  statuses: LetterStatus[]
): Record<string, LetterStatus> {
  const rank: Record<LetterStatus, number> = {
    correct: 3,
    present: 2,
    hint: 2,
    absent: 1,
    empty: 0,
    tbd: 0,
  };
  const next = { ...prev };
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i].toUpperCase();
    const status = statuses[i];
    const current = next[letter] ?? "empty";
    if (rank[status] > rank[current]) {
      next[letter] = status;
    }
  }
  return next;
}

export function buildRows(
  guesses: string[],
  evaluations: LetterStatus[][],
  currentGuess: string,
  currentRow: number,
  maxGuesses: number,
  wordLength: number,
  lockedHint: HintState = null
): Tile[][] {
  const rows: Tile[][] = [];

  for (let r = 0; r < maxGuesses; r++) {
    const row: Tile[] = [];
    if (r < guesses.length) {
      const guess = guesses[r];
      const evals = evaluations[r];
      for (let c = 0; c < wordLength; c++) {
        row.push({
          letter: guess[c].toUpperCase(),
          status: evals[c],
        });
      }
    } else if (r === currentRow) {
      let partialIdx = 0;
      for (let c = 0; c < wordLength; c++) {
        const isHintSlot = lockedHint?.position === c;
        let letter = "";
        if (isHintSlot) {
          letter = lockedHint.letter;
        } else if (partialIdx < currentGuess.length) {
          letter = currentGuess[partialIdx++];
        }
        row.push({
          letter: letter.toUpperCase(),
          status: isHintSlot ? "hint" : letter ? "tbd" : "empty",
        });
      }
    } else {
      for (let c = 0; c < wordLength; c++) {
        row.push({ letter: "", status: "empty" });
      }
    }
    rows.push(row);
  }

  return rows;
}
