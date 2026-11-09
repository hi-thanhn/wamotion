#!/usr/bin/env bash
# Ears for a film you cannot hear: earshot (MIT, https://github.com/Leonxlnx/earshot), local, CPU.
#   hear.sh <film.mp4|mix.wav> [critique options…]   launch-film sound scorecard (default)
#   hear.sh <earshot command> [args…]                any other earshot command: describe, match,
#                                                    rank, find, realness, timeline, sheet, sfx, …
# Optional. Two ways to have ears, either is enough:
#   WAMOTION_EARS_URL=https://…  (+ WAMOTION_EARS_TOKEN)   an ears server you run yourself (ears/ in the repository):
#                                                          models kept warm, nothing to install locally; see ../references/ears.md "Ears over the API"
#   a local earshot install at ~/Library/Application Support/wamotion/earshot (macOS) or $XDG_DATA_HOME/wamotion/earshot, or
#   WAMOTION_EARSHOT_DIR=<dir containing venv/ and hf/>
# With both set the API is tried first and the local install is used when it does not answer.
set -euo pipefail

if [[ -n "${WAMOTION_EARSHOT_DIR:-}" ]]; then
  DIR="$WAMOTION_EARSHOT_DIR"
elif [[ "$(uname)" == "Darwin" ]]; then
  DIR="$HOME/Library/Application Support/wamotion/earshot"
else
  DIR="${XDG_DATA_HOME:-$HOME/.local/share}/wamotion/earshot"
fi
PY="$DIR/venv/bin/python"

if [[ $# -eq 0 ]]; then
  echo "Usage: hear.sh <film.mp4|mix.wav> [--fast] [--json] [--video <mp4>]   |   hear.sh <earshot command> [args…]"
  exit 2
fi

case "$1" in
  describe|match|rank|find|compare|ab|realness|timeline|sheet|critique|profile|forge|fit|sfx|kit|gallery|measure|doctor|-h|--help) ;;
  *) set -- critique "$@" ;;
esac

if [[ -n "${WAMOTION_EARS_URL:-}" ]]; then
  export EARSHOT_HOME="$DIR/hf" EARSHOT_THREADS="${EARSHOT_THREADS:-3}" PYTHONUNBUFFERED=1
  export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"
  if [[ -x "$PY" ]]; then export WAMOTION_EARS_LOCAL_PY="$PY"; fi
  exec node "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/ears-client.mjs" "$@"
fi

if [[ ! -x "$PY" ]]; then
  echo "earshot is not installed (looked in $DIR) and WAMOTION_EARS_URL is not set; optional — install with: python3.12 -m venv \"$DIR/venv\" && \"$DIR/venv/bin/pip\" install 'earshot[mcp] @ git+https://github.com/Leonxlnx/earshot@591fa3e028032e6dce56620a20e932e35667e8d8' && EARSHOT_HOME=\"$DIR/hf\" \"$DIR/venv/bin/python\" -m earshot doctor --fetch (about 2 GB, needs ffmpeg)"
  exit 0
fi

export EARSHOT_HOME="$DIR/hf" EARSHOT_THREADS="${EARSHOT_THREADS:-3}" PYTHONUNBUFFERED=1
export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"
exec "$PY" -m earshot "$@"
