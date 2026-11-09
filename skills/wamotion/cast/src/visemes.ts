export type RhubarbCue = { start: number; end: number; value: string };
export type RhubarbFile = { metadata: { soundFile: string; duration: number }; mouthCues: RhubarbCue[] };

export type MouthWeights = Partial<Record<"aa" | "ih" | "ou" | "ee" | "oh", number>>;

/** Rhubarb shapes A–H, X → VRM preset mouth expressions. Rough by design (Rhubarb's model is English). */
export const RHUBARB_TO_VRM: Record<string, MouthWeights> = {
  A: {}, // closed (M B P)
  B: { ih: 0.35 }, // slightly open, teeth
  C: { ee: 0.55, aa: 0.15 }, // open (EH AE)
  D: { aa: 0.9 }, // wide open (AA)
  E: { oh: 0.6 }, // slightly rounded (AO ER)
  F: { ou: 0.8 }, // puckered (UW OW W)
  G: { ih: 0.25 }, // F V
  H: { ee: 0.3, aa: 0.15 }, // L
  X: {}, // idle
};

const KEYS = ["aa", "ih", "ou", "ee", "oh"] as const;
const TRANSITION = 0.06; // s, blend from the previous shape

const smoothstep = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Mouth weights at `t` seconds into the audio (deterministic, no state). */
export function mouthAt(file: RhubarbFile, t: number): MouthWeights {
  const cues = file.mouthCues;
  let i = cues.findIndex((c) => t >= c.start && t < c.end);
  if (i < 0) return {};
  const cur = RHUBARB_TO_VRM[cues[i].value] ?? {};
  const prev = i > 0 ? RHUBARB_TO_VRM[cues[i - 1].value] ?? {} : {};
  const a = smoothstep((t - cues[i].start) / TRANSITION);
  const out: MouthWeights = {};
  for (const k of KEYS) {
    const v = (prev[k] ?? 0) * (1 - a) + (cur[k] ?? 0) * a;
    if (v > 0) out[k] = v;
  }
  return out;
}

/** Blink amount 0..1 at `t` seconds for a fixed schedule (close 60 ms, hold 40 ms, open 90 ms). */
export function blinkAt(t: number, schedule: number[]): number {
  for (const s of schedule) {
    const d = t - s;
    if (d < 0 || d > 0.19) continue;
    if (d < 0.06) return smoothstep(d / 0.06);
    if (d < 0.1) return 1;
    return 1 - smoothstep((d - 0.1) / 0.09);
  }
  return 0;
}
