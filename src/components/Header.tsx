import type { GameMode } from "../types";

type Props = {
  onHelp: () => void;
  onStats: () => void;
  onSettings: () => void;
  onAbout: () => void;
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
};

export function Header({ onHelp, onStats, onSettings, onAbout, mode, onModeChange }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <button type="button" className="icon-btn" onClick={onHelp} aria-label="How to play">
          <HelpIcon />
        </button>
        <button type="button" className="icon-btn" onClick={onSettings} aria-label="Settings">
          <SettingsIcon />
        </button>
        <button type="button" className="icon-btn" onClick={onAbout} aria-label="About">
          <AboutIcon />
        </button>
      </div>

      <div className="brand">
        <h1 className="logo">
          <span className="logo-accent">V</span>ocab
        </h1>
        <p className="tagline">guess the word</p>
      </div>

      <div className="header-actions">
        <div className="mode-toggle" role="group" aria-label="Game mode">
          {(["daily", "practice", "blitz"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`mode-btn ${mode === m ? "active" : ""}`}
              onClick={() => onModeChange(m)}
            >
              {m === "blitz" ? "Blitz" : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <button type="button" className="icon-btn" onClick={onStats} aria-label="Statistics">
          <StatsIcon />
        </button>
      </div>
    </header>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.5 9.5a2.5 2.5 0 0 1 4.6 1.2c0 1.5-2.1 1.9-2.1 3.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="14" width="4" height="6" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="4" height="10" rx="1" fill="currentColor" />
      <rect x="16" y="6" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
