---
name: sound-design
description: How a finished video sounds — music, sound effects on the motion, levels, the ending — and where to get sounds in a Wamotion project. Read it when you write or change `worlds/film.tsx`, when the user says the sound is thin, cheap or off, or before you tell anyone how the video sounds.
---

# Sound design for a Wamotion video

You cannot hear the video you are making, so this folder holds what professional launch films measurably do with
sound and how to get the same material. Numbers marked **[measured]** come from earshot's analysis of seven
professional launch films (`launch-video-sound.md`, MIT); treat them as what pros did, not as laws. The video's
own style, music and idea decide the rest.

## What the references do

- **Music leads.** One track runs under 89–100 % of the film [measured]; pick it first and cut the picture to it.
  Section changes, the reveal and the logo sit on downbeats or bar lines.
- **Dense groove, few big accents.** 2.5–8.2 sound onsets per second, but only 1.2–1.7 salient hits per second
  [measured]. Designed effects per 10 s: music-led 3–13 · voice-over explainer 18–30 · effects-led 30–38 (`kit.md`).
  A video with one effect per shot sits far below the sparsest reference and reads as unfinished.
- **A hit is a small cluster, not one file.** A card arriving is a soft pop at ~50 % of its travel and a tick when
  it locks; a whoosh peaks on the fastest frame of the move and starts 0.2–0.6 s before it; the music steps down
  6–12 dB for 0.3–0.5 s before a hit, a drop or a big whoosh and comes back on it (`kit.md`).
- **Not a hit on every cut.** Dense music covers plain cuts; accents go on the reveal, the logo, the key UI action
  and section changes. Cursor moves, hovers and scrolls get no sound.
- **Open at once, land the ending.** First sound within ~0.1 s; the last 3 s at body level; fades are short
  (median 0.27 s) [measured]. A logo: the music stops on a bar line or filters down, 0.2–0.7 s of near-silence,
  one soft in-key note, a tail to silence.
- **Real recordings and produced music read as expensive;** oscillator beeps and filtered-noise whooshes read as
  cheap next to them (`launch-video-sound.md` §10). UI ticks and pops are the exception where designed sounds work.

## Writing sound into the film

Sound lives in `worlds/film.tsx`, next to the motion that causes it, so the two never drift:

```tsx
import { Audio } from "@remotion/media"
import { Sequence, staticFile, interpolate, useCurrentFrame } from "remotion"

// the card lands on frame `land`; the pop's attack is 0.03 s into its file (peakLagSec from `wamotion sound get`)
<Sequence from={land - Math.round(0.03 * fps)}>
  <Audio src={staticFile("assets/sfx/es-ui-pop-soft.mp3")} volume={0.5} />
</Sequence>
```

- `from` places the sound's ATTACK on the frame: `hitFrame - round(peakLagSec * fps)`. A whoosh is placed by its
  peak (the file's loudest moment, the same field for whoosh/riser/swell entries), so the peak meets the fastest
  frame of the move.
- Volume is linear (0–1): a UI tick ~10–15 dB under the music peaks is `volume={0.2–0.3}`; a hit on a reveal
  can be `0.8–1`. For a music track written in the film, `volume={(f) => interpolate(...)}` gives the
  stop-down before a hit and the stop on a bar line at the logo.
- Music: `wamotion music pick` (bundled CC0 track, the app mixes it, ducks it under narration) or
  `wamotion music pick --place film` / `music make --place film`, which hands you the file so you own its volume
  curve inside the film. Pick one of the two; the app mixes no music when you place it in the film. The bank holds
  14 tracks; when none fits, `wamotion stock search --kind audio --category music --query "…"` searches Openverse
  (Jamendo, Freesound, Wikimedia), `stock import` the one you want and `wamotion music pick --assetRef <it>` lays it
  like a bank track, matched to the bank's loudness.
- Narration (when the user turned it on) is laid by the app; keep big hits off the key words and let the music
  dip 3–6 dB under speech.

## Where sounds come from, in order

1. **Real recordings.** The bundled CC0 bank (`bank.md`: Kenney, Freesound, OpenGameArt — whooshes, impacts,
   risers, foley, ambience) via `wamotion sound get --id <id>` or `sound get --query "cloth swish, short, dry"`; more
   online with `wamotion stock search --kind audio --query "…"` then `stock import` (Openverse, commercial-use
   licences only; `--category sound_effect` keeps music out).
2. **Designed UI sounds.** The earshot bank in the same `bank.md` (`es-…`: ticks, pops, taps, keys, toggles,
   shutters, bells, risers, swells, stings, glitches), each with the kit role it was made for; `kit.md` gives the
   role's level over the music and its offset from the cut.
3. **Made for this video, on the user's ElevenLabs key.** `wamotion sfx make --text "a ceramic cup set down on
   wood, close, dry" --durationSec 1.2` and `wamotion music make --prompt "…" --lengthSec 20` spend the user's quota; use them
   for a sound nothing in the banks has, or when the user asks.

Every bank sound, Openverse import and generated file is listed by `wamotion sound credits`; the export writes it
beside the film. A CC BY track is marked "credit required": its line has to go in the video description.

## Hearing it

When the user has installed the agent's ears (Settings → Âm thanh), `wamotion sound hear` renders the film's
audio alone and scores it against the seven references: onsets per second, salient hits, cuts without sound,
music presence, loudness, realness, with fixes carrying timestamps. `wamotion sound listen <file> --query "…"`
tells what a downloaded or generated file is like before you place it. Without the ears, `sound hear` says so in
one line; the numbers above still tell you where a sound track is thin.

## Three videos, three different sound tracks

- **A 15 s mascot episode on playful music (music-led, 3–13 effects per 10 s):** the mascot's hop lands on a
  soft pop (`es-ui-pop-soft`) each time, its wink a single tick, the speech bubble a paper swish from the CC0
  bank; the music steps down for the one big reveal and a `fit/tick/domino` closes the end card. Five to eight
  sounds in total, all on the character's own motion.
- **An app walkthrough with narration (18–30 per 10 s):** one real click voice for every press, typing as single
  keys from `es-typing-key-*` at most 12 per second, a `land` thump when a panel arrives, the music ducked under
  the voice, nothing on cursor travel.
- **A 30 s kinetic-type brand film (effects-led, 30–38 per 10 s):** every word arrival is a `text` mallet note
  from a pentatonic set, whooshes peak on the whip pans, a riser ends 30–250 ms before the hero line's impact,
  a reverse swell once for the logo.

What makes them different is the idea and the motion; the sound only follows what the picture does.
