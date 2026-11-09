---
name: wamotion
description: Material and tools for making a video with Remotion on your own — a bundled offline sound-effects bank and music bank with measured bpm, a tempo measurer for any track, optional earshot ears that score, describe, picture, search and check sound, a one-round fresh-eyes review on real rendered frames, a 3D character kit (CC0 VRM, body clips, lipsync, HDRIs and PBR textures for @remotion/three), and reference skills (motion moves, sound design, vector art). Use when making a video, motion graphics, a showreel, an explainer, a product or ad film, or any Remotion composition.
---

# Wamotion kit for a video you make yourself

You write a normal Remotion project yourself, in whatever folder the user gives you: any
npm packages, any file layout, your own scripts (Node, Python, ffmpeg). Export with
`npx remotion render`; a film that uses WebGL or three.js needs `--gl=angle`. Nothing here
decides how the film looks or is structured. `<skill>` below is this folder; every script
runs from any folder with plain `node`/`bash`, nothing to install.

**Sound effects** — 341 files (CC0 recordings + the earshot MIT set), offline:
- `node <skill>/scripts/sound.mjs search "<what it sounds like>" [--kind whoosh|impact|riser|sparkle|transition|foley|ambience]` — matches by words (material, size, dry/wet, real/electronic) with `describe`, `durationSec`, `peakLagSec`, `roles`; add `--ears` to order by listening instead of words (slower; with `--kind` it listens to the whole kind).
- `node <skill>/scripts/sound.mjs get <id or words> --to public/sfx [--fps 30]` — copies the file in and prints its `staticFile` path. `peakLagSec` is the time to the attack, so the hit lands on `hitFrame` with `<Sequence from={hitFrame - Math.round(peakLagSec * fps)}>`.
- `<skill>/references/sound-design/bank.md` lists the whole bank.

**Music** — 14 CC0 tracks levelled near −16 LUFS: `sound.mjs music list [--mood calm|warm|upbeat|tech|playful|cinematic|tense]`, `sound.mjs music get <id> --to public/music`.

**Tempo** — `node <skill>/scripts/tempo.mjs <file…>` prints `{bpm, downbeatSec, meter, confidence}` for any track (needs ffmpeg on PATH or a Remotion project's bundled one). bpm reads in 80–160; it is a measurement to use or ignore.

**Credits** — `sound.mjs credits public` finds every bank file in a folder (renamed copies too) and prints licences plus a `text` for credits.txt. CC0 and MIT ask for no attribution.

**Ears (optional)** — earshot hears for you; use any of it when a number or picture would help, none is required. Run as `bash <skill>/scripts/hear.sh …`:
- `out/film.mp4 [--fast]` — scorecard against seven launch films (loudness, hits on cuts, density, realness) with timestamped fixes.
- `describe <file>` — what a track or sound is, in words.
- `sheet <film> -o sheet.png` — a picture to look at: frames, cuts, sound events, spectrogram, loudness on one time axis.
- `timeline <film> [--cues …]` — a listening transcript: events, sections, beat grid, how close sounds land to cuts or your cue frames.
- `match <file> "<words>"`, `rank "<words>" <files>`, `find <long file> "<words>"` — how well sounds fit a description.
- `realness <file>` — does a sound read as real/pro or as cheap code-synthesized.
- `ab <a> <b>` — what changed between two takes.

`<skill>/references/ears.md` has every option, output and measured time. Without earshot each prints one line and exits.

**Character kit** — `<skill>/cast/`: a CC0 VRM character (walks, talks with mouth shapes from a voice line, eyes on the camera, blinks, spring bones), eleven CC0 body clips on its skeleton, three CC0 Poly Haven HDRIs and four CC0 PBR texture sets for a real-lit set, and small modules (`CastCanvas`, `Hdri`, `Character`, `Post` with depth of field and seeded grain, loaders) that render it all from the Remotion frame in `@remotion/three`. `<skill>/references/character.md` says what each piece is, what it costs, how to add a clip or a VRM, and what it cannot do.

**Fresh-eyes review** — `<skill>/references/review.md`: render real frames, hand them to a subagent that has not seen the code, answer each finding once (fix, or reject with a reason). Only a broken film is held back: unreadable or off-frame text, silence, a frozen picture, a render failure, or something the user asked for that is missing.

**References** to look things up in, each with its licence: `references/motion-prompt/` (named motion moves, MIT), `references/sound-design/`, `references/vector-art/`. They were written for the Wamotion app: where they say `wamotion sound search/get`, `music list`, `sound credits` or `sound hear`, use the scripts above; other `wamotion …` commands do not exist outside the app. Remotion's own agent skills (markup, timing, transitions, audio, fonts, 3D) are not bundled here: `npx skills add remotion-dev/skills` installs them.
