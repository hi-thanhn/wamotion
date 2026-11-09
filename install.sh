#!/bin/sh
# Install the wamotion skill into an agent's skills folder, in one line:
#
#   curl -fsSL https://raw.githubusercontent.com/hi-thanhn/wamotion/main/install.sh | sh
#
# or, from a clone:  sh install.sh [--to <dir>] [--ref <branch|tag>]
#
# Needs git and Node >= 20 (ffmpeg for tempo.mjs and the review's frame extraction). It clones
# only skills/wamotion (a sparse, blob-less, depth-1 clone; the sound bank and the character kit
# are in it, about 55 MB), copies the skill to <dir> (default ~/.claude/skills/wamotion) and checks
# the result. Nothing else to download. WAMOTION_REPO overrides the clone URL (e.g. the ssh form).
set -eu

TO="${HOME}/.claude/skills/wamotion"
REF="main"
REPO="${WAMOTION_REPO:-https://github.com/hi-thanhn/wamotion.git}"

while [ $# -gt 0 ]; do
  case "$1" in
    --to) TO="$2"; shift 2 ;;
    --ref) REF="$2"; shift 2 ;;
    -h|--help) sed -n '2,11p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

need() { command -v "$1" >/dev/null 2>&1 || { echo "install.sh needs $1 on PATH" >&2; exit 1; }; }
need git
need node
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 20 ] || { echo "install.sh needs Node >= 20 (found $(node -v))" >&2; exit 1; }

TMP="$(mktemp -d 2>/dev/null || mktemp -d -t wamotion)"
trap 'rm -rf "$TMP"' EXIT INT TERM

echo "cloning skills/wamotion @ $REF from $REPO"
git clone --quiet --depth 1 --filter=blob:none --sparse --branch "$REF" "$REPO" "$TMP/repo"
git -C "$TMP/repo" sparse-checkout set --no-cone skills/wamotion >/dev/null

[ -f "$TMP/repo/skills/wamotion/SKILL.md" ] || { echo "clone has no skills/wamotion/SKILL.md" >&2; exit 1; }

if [ -e "$TO" ] || [ -L "$TO" ]; then
  BAK="${TO}.bak.$(date +%Y%m%d%H%M%S)"
  echo "moving the existing $TO to $BAK"
  mv "$TO" "$BAK"
fi
mkdir -p "$(dirname "$TO")"
cp -R "$TMP/repo/skills/wamotion" "$TO"

[ -f "$TO/bank/manifest.json" ] || { echo "bank did not copy; the clone is incomplete" >&2; exit 1; }
SFX="$(node -e 'const m=require(process.argv[1]);console.log(m.sfx.length+" sfx, "+m.music.length+" music")' "$TO/bank/manifest.json")"
CAST="no"
[ -f "$TO/cast/models/base-female/Base_Female.vrm" ] && CAST="yes"

cat <<DONE

wamotion skill installed at $TO
  sound bank      $SFX
  character kit   $CAST (cast/: VRM, clips, HDRI, PBR textures)
  ears            optional: a local earshot install, or an ears server (WAMOTION_EARS_URL + WAMOTION_EARS_TOKEN); hear.sh prints how

Try:  node "$TO/scripts/sound.mjs" search "glass clink"
Then open an agent in any folder and ask for a video; it reads $TO/SKILL.md on its own.
DONE
