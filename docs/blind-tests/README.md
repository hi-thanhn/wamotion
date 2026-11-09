# Blind tests

Two tests, same method, two briefs. Each arm is one run of the same agent (Claude Opus 5.5, effort medium,
`claude -p`, an empty folder), with the same prompt and the same music track placed in `music/` beforehand.
The prompts say nothing about sound and nothing about the skill. The finished films were loudness-normalised to
−16 LUFS, shuffled, and the author scored them blind on a page with buttons, one vote per item:
**design**, **less AI slop**, **sound quality**, **sound-to-motion sync**, **overall**. `votes.jsonl` is the vote
log, `key.json` says which number was which arm, `prompt.txt` is the prompt, `README.vi.md` the full write-up in
Vietnamese.

The method has obvious limits: one scorer who is also the author, one film per arm, not repeated. The result
is a signal that the material helps, not a measurement of how much.

## 2026-11-05 — a 15-second showreel

Folder: [`2026-11-05-showreel/`](2026-11-05-showreel/). Prompt: *"make a dynamic 15-second motion graphics video for
Wamotion AI, shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out."*

| Arm | What | Cost · time |
|---|---|---|
| K | agent + the `wamotion` skill | $6.21 · 32 min · 49 turns |
| C | agent alone (run before the skill existed) | $7.07 |

**Result: K (skill) won 5 of 5** — design, less slop, sound, sync, overall.

What the agent with the skill did, read from its transcript, not from what it said: called the skill on its first
turn; copied six bank sounds with `sound.mjs get` and placed them by `peakLagSec`; measured the track at 132 BPM
with `tempo.mjs` and cut to that grid; ran `hear.sh` once (23 of 23 metrics in range); spawned one fresh-eyes
review subagent, which caught a real bug (a quote mark made the name read as "AII"). The rest was its own: a WebGL
engine, 24-sample motion blur, 620,000 particles, 60 fps. The film is [`examples/showreel-15s.mp4`](../../examples/showreel-15s.mp4).

## 2026-11-06 — a 30-second Facebook ad for a tea shop

Folder: [`2026-11-06-hem12/`](2026-11-06-hem12/). A different kind of brief: a real client-style ad with three
must-haves, three things to avoid and three facts, square 1080×1080, Vietnamese on screen. Three arms this time.

| Arm | What | Cost · time | Bank sounds | Tempo | Ears | Review |
|---|---|---|---|---|---|---|
| C | agent alone | $3.79 · 23 min | 0 (synthesised its own) | — | — | 0 |
| N | agent + skill, ears made unavailable (`WAMOTION_EARSHOT_DIR=/nonexistent`) | $4.69 · 27 min | 22 files | yes | 0 | 1 |
| K | agent + skill, ears available (local earshot) | $5.35 · 30 min | 22 files | 70 BPM, cut to the grid | 3 calls | 1 |

**Result: K (skill with ears) won 5 of 5 against both other arms.**

The ears were not forced; the agent called them three times on its own: the first call pointed at one of eleven
visual events with no sound and suggested a step-down before the big hit; after the agent changed the mix the ears
reported the whole film at −18.4 LUFS, so the agent wrote a mastering step with a limiter and got 23 of 23. Since
the films were loudness-normalised before scoring, what the scorer could still hear was placement and sound
quality, and K beat N on both. The film itself is no longer in `examples/`.

## What the skill is, for these tests

Material and tools only, no rule about the film: an offline bank of 341 sound effects and 14 music tracks with
measured metadata, a tempo measurer, optional ears (earshot), one round of review on rendered frames by a subagent
that has not seen the code, and reference texts. The `SKILL.md` the agent read was under 400 words at the time of
the first test and about 720 words at the second.
