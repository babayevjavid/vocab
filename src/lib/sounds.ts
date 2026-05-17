export type SoundId =
  | "key"
  | "backspace"
  | "submit"
  | "invalid"
  | "reveal"
  | "win"
  | "lose"
  | "hint"
  | "tick";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.08,
  when = 0
) {
  const audio = getCtx();
  if (!audio) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + when + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime + when);
  osc.stop(audio.currentTime + when + duration);
}

export function playSound(id: SoundId, enabled: boolean): void {
  if (!enabled) return;

  switch (id) {
    case "key":
      tone(420, 0.04, "triangle", 0.05);
      break;
    case "backspace":
      tone(300, 0.05, "triangle", 0.04);
      break;
    case "submit":
      tone(520, 0.06, "sine", 0.06);
      tone(680, 0.08, "sine", 0.05, 0.06);
      break;
    case "invalid":
      tone(180, 0.12, "sawtooth", 0.06);
      break;
    case "reveal":
      tone(600, 0.05, "sine", 0.04);
      break;
    case "win":
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.15, "sine", 0.07, i * 0.1));
      break;
    case "lose":
      tone(220, 0.2, "sine", 0.06);
      tone(165, 0.35, "sine", 0.05, 0.15);
      break;
    case "hint":
      tone(880, 0.08, "sine", 0.06);
      tone(1100, 0.12, "sine", 0.05, 0.08);
      break;
    case "tick":
      tone(800, 0.03, "square", 0.02);
      break;
  }
}
