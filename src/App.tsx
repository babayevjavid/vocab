import { useCallback, useEffect, useMemo, useState } from "react";
import { AboutPanel } from "./components/AboutPanel";
import { Board } from "./components/Board";
import { Confetti } from "./components/Confetti";
import { Footer } from "./components/Footer";
import { GameToolbar } from "./components/GameToolbar";
import { Header } from "./components/Header";
import { Keyboard } from "./components/Keyboard";
import { Modal } from "./components/Modal";
import { SettingsPanel } from "./components/SettingsPanel";
import { StatsPanel } from "./components/StatsPanel";
import { useSettings } from "./hooks/useSettings";
import { useWordle } from "./hooks/useWordle";
import type { GameMode } from "./types";
import { BLITZ_SECONDS, STREAK_MILESTONES } from "./types";

export default function App() {
  const [mode, setMode] = useState<GameMode>("daily");
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const { settings, updateSettings, setColorTheme } = useSettings();
  const game = useWordle({ mode, settings });

  const streakMilestone = useMemo(() => {
    if (game.status !== "won") return null;
    const streak = game.stats.currentStreak;
    return (STREAK_MILESTONES as readonly number[]).includes(streak) ? streak : null;
  }, [game.status, game.stats.currentStreak]);

  useEffect(() => {
    if (game.status === "won" || game.status === "lost") {
      const t = window.setTimeout(() => setResultOpen(true), 600);
      return () => clearTimeout(t);
    }
    setResultOpen(false);
  }, [game.status]);

  useEffect(() => {
    if (game.status === "won") {
      setConfetti(true);
      const t = window.setTimeout(() => setConfetti(false), 4500);
      return () => clearTimeout(t);
    }
  }, [game.status]);

  const handleModeChange = useCallback(
    (next: GameMode) => {
      setMode(next);
      game.reset(next);
      setResultOpen(false);
    },
    [game]
  );

  const playing = game.status === "playing";
  const disabled = !playing || game.revealingRow !== null;

  return (
    <div className="app">
      <Confetti active={confetti} />

      <div className="bg-orbs" aria-hidden>
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      <Header
        onHelp={() => setHelpOpen(true)}
        onStats={() => setStatsOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        onAbout={() => setAboutOpen(true)}
        mode={mode}
        onModeChange={handleModeChange}
      />

      <main className="game">
        {game.message && (
          <div className="toast" role="status">
            {game.message}
          </div>
        )}

        <GameToolbar
          hardMode={settings.hardMode}
          hintUsed={game.hintUsed}
          onHint={game.useHint}
          disabled={disabled}
          isBlitz={game.isBlitz}
          formatTime={game.formatTime}
          timeLeft={game.timeLeft}
          blitzSeconds={BLITZ_SECONDS}
        />

        <Board
          rows={game.rows}
          currentRow={game.currentRow}
          shake={game.shake}
          revealingRow={game.revealingRow}
          won={game.status === "won"}
        />

        <Keyboard keyState={game.keyState} onKey={game.onKey} disabled={disabled} />
      </main>

      <Footer />

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="How to play">
        <div className="help-content">
          <p>
            Guess the <strong>5-letter</strong> word in <strong>6 tries</strong>.
          </p>
          <ul>
            <li>Each guess must be a valid word. Press <kbd>Enter</kbd> to submit.</li>
            <li>
              <strong>Daily</strong> — same word for everyone. <strong>Practice</strong> — random
              word. <strong>Blitz</strong> — solve in 3 minutes.
            </li>
            <li>
              <strong>Hard mode</strong> (settings): you must use all revealed green and yellow
              hints in later guesses.
            </li>
            <li>
              <strong>Hint</strong> (💡): reveals one correct letter once per game.
            </li>
          </ul>
          <div className="help-examples">
            <ExampleRow word="CRANE" highlight={[{ i: 0, s: "correct" }]} />
            <p>
              <span className="pill correct">Green</span> — correct spot.
            </p>
            <ExampleRow word="SLATE" highlight={[{ i: 1, s: "present" }]} />
            <p>
              <span className="pill present">Amber</span> — in word, wrong spot.
            </p>
            <ExampleRow word="DREAM" highlight={[{ i: 2, s: "absent" }]} />
            <p>
              <span className="pill absent">Gray</span> — not in word.
            </p>
          </div>
        </div>
      </Modal>

      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <SettingsPanel
          settings={settings}
          onHardModeChange={(hardMode) => updateSettings({ hardMode })}
          onSoundChange={(soundEnabled) => updateSettings({ soundEnabled })}
          onThemeChange={setColorTheme}
        />
      </Modal>

      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="About Vocab">
        <AboutPanel />
      </Modal>

      <Modal open={statsOpen} onClose={() => setStatsOpen(false)} title="Statistics">
        <StatsPanel stats={game.stats} />
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            game.reset(mode);
            setStatsOpen(false);
            setResultOpen(false);
          }}
        >
          New game
        </button>
      </Modal>

      <Modal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title={game.status === "won" ? "Brilliant!" : game.isBlitz && game.timeLeft === 0 ? "Time's up!" : "So close"}
      >
        <div className="result-content">
          {game.status === "won" ? (
            <>
              <p className="result-msg">
                You solved it in <strong>{game.guesses.length}</strong>{" "}
                {game.guesses.length === 1 ? "try" : "tries"}!
                {game.isBlitz && <> with <strong>{game.formatTime}</strong> left.</>}
              </p>
              {streakMilestone && (
                <p className="result-milestone">
                  🔥 {streakMilestone}-day streak! Keep it going.
                </p>
              )}
            </>
          ) : (
            <p className="result-msg">
              The word was{" "}
              <strong className="solution-word">{game.solution.toUpperCase()}</strong>
            </p>
          )}
          <div className="result-grid" aria-hidden>
            {game.evaluations.map((row, ri) =>
              row.map((status, ci) => (
                <span key={`${ri}-${ci}`} className={`mini-tile mini-tile--${status}`} />
              ))
            )}
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              game.reset(mode);
              setResultOpen(false);
            }}
          >
            Play again
          </button>
        </div>
      </Modal>
    </div>
  );
}

function ExampleRow({
  word,
  highlight,
}: {
  word: string;
  highlight: { i: number; s: "correct" | "present" | "absent" }[];
}) {
  const map = Object.fromEntries(highlight.map((h) => [h.i, h.s]));
  return (
    <div className="help-row">
      {word.split("").map((ch, i) => (
        <span key={i} className={`help-tile ${map[i] ? `help-tile--${map[i]}` : ""}`}>
          {ch}
        </span>
      ))}
    </div>
  );
}
