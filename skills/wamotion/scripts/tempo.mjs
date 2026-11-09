#!/usr/bin/env node
// Measure a track's tempo: bpm, first strong onset, meter. Node >= 20, no dependencies.
// Standalone port of analyzeMusicFile (apps/sidecar/src/project/music-tempo.ts): energy
// envelope at 10 ms → onset strength → autocorrelation → comb score over 1, 2, 4, 8 beats
// (so a 3:2 related pulse does not win) → parabolic refinement.
// Decoding needs an ffmpeg: the one on PATH, else Remotion's bundled one via
// `npx --no-install remotion ffmpeg` in the current folder.
import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const SAMPLE_RATE = 11025
const HOP_SEC = 0.01
const MIN_BPM = 60
const PREFER_MIN_BPM = 80
const PREFER_MAX_BPM = 160
const COMB_MULTIPLES = [1, 2, 4, 8]
const COMB_STEP = 0.25

function wavPcm16(raw) {
  let offset = 12
  while (offset + 8 <= raw.byteLength) {
    const id = raw.toString("ascii", offset, offset + 4)
    const size = raw.readUInt32LE(offset + 4)
    if (id === "data") {
      const end = Math.min(raw.byteLength, offset + 8 + size)
      const bytes = end - (offset + 8)
      return new Int16Array(raw.buffer.slice(raw.byteOffset + offset + 8, raw.byteOffset + offset + 8 + bytes - (bytes % 2)))
    }
    offset += 8 + size + (size % 2)
  }
  return new Int16Array(0)
}

function decode(file) {
  const dir = mkdtempSync(join(tmpdir(), "wamotion-tempo-"))
  const out = join(dir, "mono.wav")
  const args = ["-v", "error", "-i", file, "-vn", "-ac", "1", "-ar", String(SAMPLE_RATE), "-f", "wav", "-acodec", "pcm_s16le", "-y", out]
  try {
    let run = spawnSync("ffmpeg", args, { encoding: "utf8" })
    if (run.error) run = spawnSync("npx", ["--no-install", "remotion", "ffmpeg", ...args], { encoding: "utf8" })
    if (run.error || run.status !== 0)
      throw new Error(`could not decode with ffmpeg (${run.error?.message ?? run.stderr?.trim() ?? "exit " + run.status}). Install ffmpeg, or run from a Remotion project folder.`)
    return wavPcm16(readFileSync(out))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function estimateTempo(samples, sampleRate, hopSec = HOP_SEC) {
  const hop = Math.max(1, Math.round(sampleRate * hopSec))
  const frames = Math.floor(samples.length / hop)
  const env = new Float64Array(frames)
  for (let f = 0; f < frames; f += 1) {
    let sum = 0
    for (let i = f * hop; i < (f + 1) * hop; i += 1) {
      const v = samples[i] / 32768
      sum += v * v
    }
    env[f] = Math.sqrt(sum / hop)
  }
  const onset = new Float64Array(frames)
  for (let f = 1; f < frames; f += 1) onset[f] = Math.max(0, env[f] - env[f - 1])
  const maxOnset = onset.reduce((m, v) => (v > m ? v : m), 0)
  const maxLag = Math.ceil(60 / MIN_BPM / hopSec)
  if (maxOnset <= 0 || onset.length < maxLag * 2) return null

  const cache = new Map()
  const autocorr = (lag) => {
    let s = cache.get(lag)
    if (s === undefined) {
      const n = onset.length - lag
      let sum = 0
      for (let i = 0; i < n; i += 1) sum += onset[i] * onset[i + lag]
      s = n > 0 ? sum / n : 0
      cache.set(lag, s)
    }
    return s
  }
  const rAt = (x) => {
    const i = Math.floor(x)
    const f = x - i
    return autocorr(i) * (1 - f) + autocorr(i + 1) * f
  }
  const peakNear = (x) => Math.max(rAt(x - 1), rAt(x), rAt(x + 1))
  const reach = onset.length / 2
  const comb = (l) => {
    let sum = 0
    let n = 0
    for (const m of COMB_MULTIPLES) {
      if (m > 1 && l * m + 1 > reach) break
      sum += peakNear(l * m)
      n += 1
    }
    return sum / n
  }
  const lo = 60 / PREFER_MAX_BPM / hopSec
  const hi = 60 / PREFER_MIN_BPM / hopSec
  const steps = Math.floor((hi - lo) / COMB_STEP)
  let bestStep = 0
  let bestScore = -1
  for (let s = 0; s <= steps; s += 1) {
    const score = comb(lo + s * COMB_STEP)
    if (score > bestScore) {
      bestScore = score
      bestStep = s
    }
  }
  let lag = lo + bestStep * COMB_STEP
  if (bestStep > 0 && bestStep < steps) {
    const a = comb(lag - COMB_STEP)
    const c = comb(lag + COMB_STEP)
    const denom = a - 2 * bestScore + c
    if (denom < 0) lag += (COMB_STEP * 0.5 * (a - c)) / denom
  }
  const bpm = Math.round((60 / (lag * hopSec)) * 10) / 10
  const first = onset.findIndex((v) => v >= 0.6 * maxOnset)
  const downbeatSec = Math.round(Math.max(0, first) * hopSec * 1000) / 1000
  const zero = autocorr(0)
  const confidence = zero > 0 ? Math.round(Math.min(1, peakNear(lag) / zero) * 100) / 100 : 0
  return { bpm, downbeatSec, meter: "4/4", confidence }
}

const files = process.argv.slice(2)
if (files.length === 0) {
  process.stdout.write(
    "Usage: node tempo.mjs <audio-file> [more files]\nPrints {bpm, downbeatSec, meter, confidence} per file. bpm is reported in 80–160 (a 170 bpm track reads 85); meter is assumed 4/4; downbeatSec is the first strong onset, not a verified bar line.\n"
  )
  process.exit(0)
}
let failed = false
for (const file of files) {
  try {
    const result = estimateTempo(decode(resolve(file)), SAMPLE_RATE)
    process.stdout.write(`${JSON.stringify(result ? { file, ...result } : { file, error: "silent or shorter than two bars" })}\n`)
    if (!result) failed = true
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ file, error: error.message })}\n`)
    failed = true
  }
}
process.exit(failed ? 1 : 0)
