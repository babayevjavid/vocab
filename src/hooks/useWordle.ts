import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VALID_GUESSES, pickDailyWord, pickRandomWord } from "../data/words";
import { buildRows, evaluateGuess, mergeKeyState } from "../lib/gameLogic";
import { getHardConstraints, validateHardModeGuess } from "../lib/hardMode";
import { isPartialComplete, partialLength, partialToWord } from "../lib/guessInput";
import { pickHintPosition } from "../lib/hints";
import { playSound } from "../lib/sounds";
import { loadStats, recordResult } from "../lib/stats";
import type {
  GameMode,
  GameStatus,
  HintState,
  KeyState,
  LetterStatus,
  Settings,
  Stats,
} from "../types";
import { BLITZ_SECONDS, MAX_GUESSES, WORD_LENGTH } from "../types";

type Options = {
  mode: GameMode;
  settings: Settings;
};

function pickSolution(mode: GameMode): string {
  return mode === "daily" ? pickDailyWord() : pickRandomWord();
}

export function useWordle({ mode, settings }: Options) {
  const [solution, setSolution] = useState(() => pickSolution(mode));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<LetterStatus[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [keyState, setKeyState] = useState<KeyState>({});
  const [stats, setStats] = useState<Stats>(loadStats);
  const [shake, setShake] = useState(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [statsRecorded, setStatsRecorded] = useState(false);
  const [lockedHint, setLockedHint] = useState<HintState>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BLITZ_SECONDS);
  const tickPlayed = useRef(false);

  const { hardMode, soundEnabled } = settings;
  const currentRow = guesses.length;
  const isBlitz = mode === "blitz";

  const rows = useMemo(
    () =>
      buildRows(
        guesses,
        evaluations,
        currentGuess,
        currentRow,
        MAX_GUESSES,
        WORD_LENGTH,
        lockedHint
      ),
    [guesses, evaluations, currentGuess, currentRow, lockedHint]
  );

  const showMessage = useCallback((text: string, ms = 2000) => {
    setMessage(text);
    const t = window.setTimeout(() => setMessage(null), ms);
    return () => clearTimeout(t);
  }, []);

  const failGame = useCallback(
    (msg: string, sound: "lose" | "invalid" = "lose") => {
      setStatus("lost");
      showMessage(msg, 3000);
      playSound(sound, soundEnabled);
      if (!statsRecorded) {
        setStats(recordResult(loadStats(), false, 0));
        setStatsRecorded(true);
      }
    },
    [showMessage, soundEnabled, statsRecorded]
  );

  const submitGuess = useCallback(() => {
    if (status !== "playing" || revealingRow !== null) return;
    if (!isPartialComplete(currentGuess, lockedHint)) {
      setShake(true);
      showMessage("Not enough letters");
      playSound("invalid", soundEnabled);
      window.setTimeout(() => setShake(false), 500);
      return;
    }

    const word = partialToWord(currentGuess, lockedHint).toLowerCase();

    if (!VALID_GUESSES.has(word)) {
      setShake(true);
      showMessage("Not in word list");
      playSound("invalid", soundEnabled);
      window.setTimeout(() => setShake(false), 500);
      return;
    }

    if (hardMode && guesses.length > 0) {
      const err = validateHardModeGuess(word, getHardConstraints(guesses, evaluations));
      if (err) {
        setShake(true);
        showMessage(err);
        playSound("invalid", soundEnabled);
        window.setTimeout(() => setShake(false), 500);
        return;
      }
    }

    const evalResult = evaluateGuess(word, solution);
    const rowIndex = guesses.length;

    playSound("submit", soundEnabled);
    setRevealingRow(rowIndex);
    setGuesses((g) => [...g, word]);
    setEvaluations((e) => [...e, evalResult]);
    setKeyState((k) => mergeKeyState(k, word, evalResult));
    setCurrentGuess("");
    setLockedHint(null);

    const won = evalResult.every((s) => s === "correct");
    const lost = !won && rowIndex + 1 >= MAX_GUESSES;

    window.setTimeout(() => {
      setRevealingRow(null);
      playSound("reveal", soundEnabled);
      if (won) {
        setStatus("won");
        playSound("win", soundEnabled);
        if (!statsRecorded) {
          setStats(recordResult(loadStats(), true, rowIndex + 1));
          setStatsRecorded(true);
        }
      } else if (lost) {
        failGame(`The word was ${solution.toUpperCase()}`, "lose");
      }
    }, WORD_LENGTH * 350 + 200);
  }, [
    status,
    revealingRow,
    currentGuess,
    lockedHint,
    solution,
    guesses,
    evaluations,
    hardMode,
    showMessage,
    soundEnabled,
    statsRecorded,
    failGame,
  ]);

  const onKey = useCallback(
    (key: string) => {
      if (status !== "playing" || revealingRow !== null) return;

      if (key === "ENTER") {
        submitGuess();
        return;
      }
      if (key === "BACKSPACE") {
        if (currentGuess.length === 0) return;
        playSound("backspace", soundEnabled);
        setCurrentGuess((g) => g.slice(0, -1));
        return;
      }
      if (/^[a-zA-Z]$/.test(key)) {
        const maxLen = lockedHint ? partialLength(lockedHint) : WORD_LENGTH;
        if (currentGuess.length >= maxLen) return;
        playSound("key", soundEnabled);
        setCurrentGuess((g) => g + key.toLowerCase());
      }
    },
    [status, revealingRow, currentGuess, lockedHint, submitGuess, soundEnabled]
  );

  const useHint = useCallback(() => {
    if (status !== "playing" || hintUsed || revealingRow !== null) return false;
    const hint = pickHintPosition(solution, guesses, evaluations);
    if (!hint) {
      showMessage("No hints left for this word");
      return false;
    }
    setLockedHint(hint);
    setHintUsed(true);
    playSound("hint", soundEnabled);
    showMessage(`Hint: letter ${hint.position + 1} is "${hint.letter.toUpperCase()}"`);
    return true;
  }, [
    status,
    hintUsed,
    revealingRow,
    solution,
    guesses,
    evaluations,
    showMessage,
    soundEnabled,
  ]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key;
      if (key === "Enter") onKey("ENTER");
      else if (key === "Backspace") onKey("BACKSPACE");
      else if (/^[a-zA-Z]$/.test(key)) onKey(key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  useEffect(() => {
    if (!isBlitz || status !== "playing") return;

    tickPlayed.current = false;
    const interval = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(interval);
          failGame("Time's up!");
          return 0;
        }
        if (t <= 10 && !tickPlayed.current) {
          tickPlayed.current = true;
        }
        if (t <= 10) playSound("tick", soundEnabled);
        return t - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isBlitz, status, failGame, soundEnabled]);

  const reset = useCallback(
    (newMode?: GameMode) => {
      const m = newMode ?? mode;
      setSolution(pickSolution(m));
      setGuesses([]);
      setEvaluations([]);
      setCurrentGuess("");
      setStatus("playing");
      setKeyState({});
      setShake(false);
      setRevealingRow(null);
      setMessage(null);
      setStatsRecorded(false);
      setLockedHint(null);
      setHintUsed(false);
      setTimeLeft(BLITZ_SECONDS);
      tickPlayed.current = false;
    },
    [mode]
  );

  const formatTime = useMemo(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  return {
    solution,
    rows,
    currentRow,
    status,
    keyState,
    stats,
    shake,
    revealingRow,
    message,
    guesses,
    evaluations,
    onKey,
    reset,
    mode,
    hardMode,
    hintUsed,
    lockedHint,
    useHint,
    timeLeft,
    formatTime,
    isBlitz,
  };
}
