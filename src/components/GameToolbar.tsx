type Props = {
  hardMode: boolean;
  hintUsed: boolean;
  onHint: () => void;
  disabled: boolean;
  isBlitz: boolean;
  formatTime: string;
  timeLeft: number;
  blitzSeconds: number;
};

export function GameToolbar({
  hardMode,
  hintUsed,
  onHint,
  disabled,
  isBlitz,
  formatTime,
  timeLeft,
  blitzSeconds,
}: Props) {
  const urgent = isBlitz && timeLeft <= 30;

  return (
    <div className="game-toolbar">
      {hardMode && <span className="badge badge--hard">Hard</span>}
      {isBlitz && (
        <span className={`badge badge--timer ${urgent ? "badge--urgent" : ""}`}>
          ⏱ {formatTime}
        </span>
      )}
      <div className="toolbar-spacer" />
      {isBlitz && (
        <div className="timer-bar" aria-hidden>
          <div
            className="timer-bar-fill"
            style={{ width: `${(timeLeft / blitzSeconds) * 100}%` }}
          />
        </div>
      )}
      <button
        type="button"
        className="hint-btn"
        onClick={onHint}
        disabled={disabled || hintUsed}
        title={hintUsed ? "Hint already used" : "Reveal one correct letter"}
      >
        💡 {hintUsed ? "Hint used" : "Hint"}
      </button>
    </div>
  );
}
