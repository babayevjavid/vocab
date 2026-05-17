import type { HintState } from "../types";
import { WORD_LENGTH } from "../types";

/** Partial string = typed letters excluding the locked hint slot */
export function partialLength(hint: HintState | null): number {
  return hint ? WORD_LENGTH - 1 : WORD_LENGTH;
}

export function partialToWord(partial: string, hint: HintState | null): string {
  if (!hint) return partial;
  const chars: string[] = [];
  let p = 0;
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (i === hint.position) {
      chars.push(hint.letter);
    } else if (p < partial.length) {
      chars.push(partial[p++]);
    }
  }
  return chars.join("");
}

export function isPartialComplete(partial: string, hint: HintState | null): boolean {
  const needed = hint ? WORD_LENGTH - 1 : WORD_LENGTH;
  return partial.length === needed;
}
