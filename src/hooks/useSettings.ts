import { useCallback, useEffect, useState } from "react";
import { defaultSettings, loadSettings, saveSettings } from "../lib/settings";
import type { ColorTheme, Settings } from "../types";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.colorTheme);
    saveSettings(settings);
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const setColorTheme = useCallback((colorTheme: ColorTheme) => {
    setSettings((s) => ({ ...s, colorTheme }));
  }, []);

  const toggleHardMode = useCallback(() => {
    setSettings((s) => ({ ...s, hardMode: !s.hardMode }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }));
  }, []);

  return {
    settings,
    updateSettings,
    setColorTheme,
    toggleHardMode,
    toggleSound,
    resetSettings: () => setSettings({ ...defaultSettings }),
  };
}
