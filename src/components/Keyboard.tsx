import type { KeyState } from "../types";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

type Props = {
  keyState: KeyState;
  onKey: (key: string) => void;
  disabled?: boolean;
};

export function Keyboard({ keyState, onKey, disabled }: Props) {
  return (
    <div className="keyboard" role="group" aria-label="On-screen keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => {
            const label = key === "BACK" ? "⌫" : key;
            const value = key === "BACK" ? "BACKSPACE" : key;
            const state = key.length === 1 ? keyState[key] : undefined;
            const wide = key === "ENTER" || key === "BACK";

            return (
              <button
                key={key}
                type="button"
                className={[
                  "key",
                  wide ? "key--wide" : "",
                  state && state !== "empty" && state !== "tbd"
                    ? `key--${state}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onKey(value)}
                disabled={disabled}
                aria-label={key === "BACK" ? "Backspace" : key}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
