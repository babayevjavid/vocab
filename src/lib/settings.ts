import type { ColorTheme, Settings } from "../types";

const KEY = "vocab-settings";
const LEGACY_KEY = "lex-settings";

export const defaultSettings: Settings = {
  hardMode: false,
  soundEnabled: true,
  colorTheme: "dark",
};

const THEMES: ColorTheme[] = ["dark", "light", "ocean", "sunset", "forest", "midnight"];

export function loadSettings(): Settings {
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_KEY);
      if (raw) localStorage.setItem(KEY, raw);
    }
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...defaultSettings,
      ...parsed,
      colorTheme: THEMES.includes(parsed.colorTheme as ColorTheme)
        ? (parsed.colorTheme as ColorTheme)
        : defaultSettings.colorTheme,
    };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
