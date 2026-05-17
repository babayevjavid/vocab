import type { ColorTheme, Settings } from "../types";

const THEMES: { id: ColorTheme; label: string; swatch: string }[] = [
  { id: "dark", label: "Dark", swatch: "#0c0f14" },
  { id: "light", label: "Light", swatch: "#f1f5f9" },
  { id: "ocean", label: "Ocean", swatch: "#0e4d6e" },
  { id: "sunset", label: "Sunset", swatch: "#7c2d12" },
  { id: "forest", label: "Forest", swatch: "#14532d" },
  { id: "midnight", label: "Midnight", swatch: "#1e1b4b" },
];

type Props = {
  settings: Settings;
  onHardModeChange: (v: boolean) => void;
  onSoundChange: (v: boolean) => void;
  onThemeChange: (t: ColorTheme) => void;
};

export function SettingsPanel({
  settings,
  onHardModeChange,
  onSoundChange,
  onThemeChange,
}: Props) {
  return (
    <div className="settings-panel">
      <label className="setting-row">
        <span className="setting-label">
          <strong>Hard mode</strong>
          <small>Must use all revealed hints</small>
        </span>
        <input
          type="checkbox"
          className="toggle"
          checked={settings.hardMode}
          onChange={(e) => onHardModeChange(e.target.checked)}
        />
      </label>

      <label className="setting-row">
        <span className="setting-label">
          <strong>Sound</strong>
          <small>Key taps &amp; effects</small>
        </span>
        <input
          type="checkbox"
          className="toggle"
          checked={settings.soundEnabled}
          onChange={(e) => onSoundChange(e.target.checked)}
        />
      </label>

      <div className="setting-section">
        <p className="setting-label">
          <strong>Color theme</strong>
        </p>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`theme-swatch ${settings.colorTheme === t.id ? "active" : ""}`}
              onClick={() => onThemeChange(t.id)}
              aria-label={`${t.label} theme`}
              aria-pressed={settings.colorTheme === t.id}
            >
              <span className="theme-swatch-color" style={{ background: t.swatch }} />
              <span className="theme-swatch-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
