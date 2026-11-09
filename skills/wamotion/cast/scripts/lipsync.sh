#!/usr/bin/env bash
# A spoken line → wav (48 kHz mono) + Rhubarb mouth cues (JSON) that src/visemes.ts reads.
#
#   bash lipsync.sh "Xin chào, ghé Hẻm 12 nhé" --out public/voice/line [--voice Linh] [--rate 170]
#   bash lipsync.sh --wav my-recording.wav --out public/voice/line
#
# Writes <out>.wav and <out>.rhubarb.json. The text form uses macOS `say` (voice "Linh" is Apple's Vietnamese voice;
# `say -v '?'` lists the rest). Rhubarb Lip Sync 1.14 (MIT) does the mouth shapes: its acoustic model is English,
# so on Vietnamese the shapes are acoustic guesses — readable, not phoneme-accurate. The macOS Rhubarb build is x86_64
# and crashes under Rosetta, so on a Mac it runs through Docker (linux/amd64); on x86_64 Linux it runs directly.
# The binary (~160 MB with its models) is downloaded once into scripts/rhubarb/bin/ (git-ignored).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
TEXT=""; WAV=""; OUT=""; VOICE="Linh"; RATE="170"
while [ $# -gt 0 ]; do
  case "$1" in
    --wav) WAV="$2"; shift 2;;
    --out) OUT="$2"; shift 2;;
    --voice) VOICE="$2"; shift 2;;
    --rate) RATE="$2"; shift 2;;
    *) TEXT="$1"; shift;;
  esac
done
if [ -z "$OUT" ]; then echo "lipsync.sh: --out <path without extension> is required" >&2; exit 2; fi
if [ -z "$TEXT" ] && [ -z "$WAV" ]; then echo "lipsync.sh: give a text to speak or --wav <file>" >&2; exit 2; fi
mkdir -p "$(dirname "$OUT")"
BIN="$here/rhubarb/bin"; mkdir -p "$BIN"
work="$(mktemp -d)"
if [ -n "$TEXT" ]; then
  if ! command -v say >/dev/null; then echo "lipsync.sh: macOS 'say' not found; pass --wav with a recorded line instead" >&2; exit 2; fi
  say -v "$VOICE" -r "$RATE" -o "$work/line.aiff" "$TEXT"
  SRC="$work/line.aiff"
else
  SRC="$WAV"
fi
ffmpeg -y -loglevel error -i "$SRC" -ar 48000 -ac 1 -c:a pcm_s16le "$OUT.wav"
ffmpeg -y -loglevel error -i "$SRC" -ar 16000 -ac 1 -c:a pcm_s16le "$BIN/in16k.wav"
if [ "$(uname -s)" = "Linux" ] && [ "$(uname -m)" = "x86_64" ]; then
  if [ ! -x "$BIN/Rhubarb-Lip-Sync-1.14.0-Linux/rhubarb" ]; then
    curl -sSL -o "$BIN/rhubarb-linux.zip" https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.14.0/Rhubarb-Lip-Sync-1.14.0-Linux.zip
    unzip -q -o "$BIN/rhubarb-linux.zip" -d "$BIN"
  fi
  (cd "$BIN" && ./Rhubarb-Lip-Sync-1.14.0-Linux/rhubarb -f json --extendedShapes GHX -o out.rhubarb.json in16k.wav)
else
  if ! command -v docker >/dev/null; then echo "lipsync.sh: needs Docker on this platform (the macOS Rhubarb build crashes on Apple silicon)" >&2; exit 2; fi
  if [ ! -x "$BIN/Rhubarb-Lip-Sync-1.14.0-Linux/rhubarb" ]; then
    curl -sSL -o "$BIN/rhubarb-linux.zip" https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.14.0/Rhubarb-Lip-Sync-1.14.0-Linux.zip
    unzip -q -o "$BIN/rhubarb-linux.zip" -d "$BIN"
  fi
  docker run --rm --platform linux/amd64 -v "$BIN:/w" -w /w debian:bookworm-slim \
    ./Rhubarb-Lip-Sync-1.14.0-Linux/rhubarb -f json --extendedShapes GHX -o out.rhubarb.json in16k.wav
fi
mv "$BIN/out.rhubarb.json" "$OUT.rhubarb.json"
rm -rf "$work" "$BIN/in16k.wav"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT.wav")
cues=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$OUT.rhubarb.json','utf8')).mouthCues.length)")
echo "wrote $OUT.wav (${dur}s) and $OUT.rhubarb.json ($cues cues)"
