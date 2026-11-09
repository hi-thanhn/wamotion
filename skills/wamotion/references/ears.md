# Ears: what earshot can tell you

The ears are optional. Nothing here is required and there is no order: each command is a
way to get a number, a sentence or a picture about sound you cannot hear yourself. Use one
when it would help you decide something, skip them all when it would not. Without earshot
installed every command prints one line saying so and exits 0.

All commands run through `bash <skill>/scripts/hear.sh <command> …`. Most take `--json`
(the full result) and `--out <file>` (also write that JSON to a file); `--help` after any
command lists its options. There are two ways to have ears; either is enough:

- **A local earshot install** (about 4 GB: Python venv, CPU torch, two models). Everything
  runs on this machine's CPU; nothing is sent anywhere.
- **An ears server you run yourself** (`ears/` in the repository: the same earshot build kept
  loaded behind a small HTTP API, in Docker). Set `WAMOTION_EARS_URL` (and `WAMOTION_EARS_TOKEN`);
  `hear.sh` then sends the command and its files there and prints exactly what a local earshot
  would (same flags, same JSON, same numbers). See "Ears over the API" at the end for what
  travels and how long it is kept.

**Time.** With a local install each `hear.sh` call is a new process that loads its models
again, so even a small job takes about 4–5 s. Times below were measured on an Apple M-series Mac
(models already downloaded), on a 30 s 1080×1080 film unless said otherwise. earshot keeps
results by file content: asking again about the same unchanged file comes back in about 1 s.
The very first `sheet` also builds a font cache once. Over the API the model load happens
once for everyone, so a call costs the upload plus the work itself (times in that section).

| command | job | time |
|---|---|---|
| `critique` | 30 s film | 12 s (`--fast` 4 s) |
| `describe` | 30 s film | 10 s |
| `sheet` | 30 s film | 16 s |
| `timeline` | 30 s film | 12 s |
| `match` | one sound effect | 5 s |
| `rank` | 22 sound effects | 8 s |
| `find` | 100 s music track | 14 s |
| `realness` | one sound effect | 5 s |
| `ab` | two sound effects | 5 s |
| `measure` | 30 s film | 4 s |

## critique — a scorecard against professional launch films

`bash <skill>/scripts/hear.sh out/film.mp4 [--fast] [--json]` (the default command; same as
`hear.sh critique out/film.mp4`)

Measures the whole soundtrack — loudness, true peak, loudness arc, ending, music presence,
hit density, sound on picture cuts, spectrum, stereo, realness — and compares each number
with seven bundled launch films. Text output: a `VERDICT` line (e.g. "launch-grade, 21 of 21
scored metrics in range"), a `SCORECARD` with value, ok range, reference median and status
per metric, a loudness arc next to the references, and timestamped `tip`s and fixes.
JSON: `verdict`, `score`, `in_range`/`scored`, `critical_issues`, `major_issues`, `actions`
(fixes with times), `tips`, `metrics[]` (each with `value`, `range`, `median`, `status`,
`weight` and a `why`).

`--fast` skips the AudioSet pass (music and speech presence) and the realness pass; the
verdict then says it is partial.

Helps when: the film is rendered and you want to know whether it plays too quiet or too
loud next to other launch videos, clips on AAC, has dead air, or has cuts with no sound
under them. Its ranges come from seven films of one genre; a number out of range is a
question, not an error.

## describe — what a sound or a film sounds like, in words

`bash <skill>/scripts/hear.sh describe <file> [--start s --end s] [--json]`

A paragraph: shape ("busy, 2.8 onsets/s"), music genre and mood hints, the sound-effect
descriptions it is closest to, AudioSet tags (Music, Speech, …), level and brightness, and
windows of the file that read differently from the rest. JSON: `measurements`, `shape`,
`top_tags`, `music_hints`, `audioset`, `distinct_windows`, `summary`.

Helps when: you picked a music track or a sound by name and want to know what it actually
is before building on it ("is this track calm or busy?", "is there a voice in it?").

## sheet — one picture of sound and picture together

`bash <skill>/scripts/hear.sh sheet out/film.mp4 -o /tmp/sheet.png [--from s --to s] [--cues cues.json]`

Writes a PNG you can open with your image reader: video frames across the top, picture cuts
as dashed lines, tagged sound events, a spectrogram, the waveform, loudness over time, and
a sync row (a diamond per cut: green = a sound starts within one frame, amber = within
100 ms, red = no hit) over the beat grid — all on one time axis. The printed JSON gives
`png`, `cuts`, `events`, `labelled_events` and the same summary as `timeline`.

Helps when: you want to see at a glance where the sound is thin, where a big visual moment
has no hit, or whether the music's loud part lines up with the film's big moment. `--from`
/ `--to` zooms into a few seconds.

## timeline — a listening transcript

`bash <skill>/scripts/hear.sh timeline out/film.mp4 [--from s --to s] [--cues cues.json] [--detail low|normal|high] [--json]`

Text: a summary (loudness, beat grid with its clarity, sections with genre tags, the
strongest accents, sync to cuts as percentages against chance), then `SECTIONS`, then a
`TRANSCRIPT` row per event: time, kind (UI, KEY, DRUM, NOTE, WHOOSH, FOLEY, VOICE), a guessed
tag, peak, how far it rises over the bed, length, brightness, and its offset to the nearest
cut ("cut -27 ms OK", "cut -79 ms near"). JSON: `loudness`, `music`, `events[]`,
`sections[]`, `sync`, `cuts`.

`--cues` takes your own intended moments, so it checks the sound against what you meant,
not only against detected cuts: a JSON file `{"fps":30,"events":[{"f":300,"kind":"hit","id":"logo"}]}`,
a JSON list, or `"1.5,3.2"` in seconds. It then adds a "Sync to N cues" line.

Helps when: you placed hits on frames and want to know whether they landed (offset in ms),
or you want to know what is happening in the sound at 0:14 without listening. Times, levels
and offsets are measurements; the tags are guesses (a "?" marks a weak one).

## match, find, rank — does a sound fit a description

`bash <skill>/scripts/hear.sh match <file> "a glass ting" [--alts "a door slam" "a whoosh"]`
— how well one file fits one or more descriptions. Returns `z` (how far above chance),
`cosine`, `verdict` (strong / plausible / weak / no match), the rank of your words among
322 vocabulary descriptions, and what the file sounds most like. `--alts` adds a forced
choice (`p_vs_alts`). Measured: a small-bell file read as "a glass ting" strong, z +3.2,
"sounds most like a triangle hit".

`bash <skill>/scripts/hear.sh rank "a soft glass ting" public/sfx [--top 5] [--json]` —
orders many files (files, folders or globs) by how well they fit one description. JSON:
`results[]` with `name`, `path`, `z`, `cosine`, `verdict`, `sounds_most_like`.
`node <skill>/scripts/sound.mjs search "<words>" --ears` uses this on the bank's best word
matches.

`bash <skill>/scripts/hear.sh find <long file> "<description>" [--top 3] [--kind event|texture]`
— finds the moments inside one long recording that fit a description, with start/end trims
in seconds. When nothing fits it says so ("the recording may not contain this sound").

Helps when: several bank sounds share the same words and you want the one that actually
sounds like what you have in mind, or you want to check a sound before it goes in. In
earshot's own test "strong" was the right kind of sound about 98% of the time and the exact
variant about 61%.

## realness — real or pro sound, or cheap code-synthesized

`bash <skill>/scripts/hear.sh realness <file…> [--json]`

Returns `p_real` (0–1), a `verdict` ("real or pro-produced", "likely code-synthesized"),
and the evidence (pure tones, oscillator-steady pitch, low crest factor). Measured: a bank
bell 0.99 real; an 880 Hz sine beep made with ffmpeg 0.01, "likely code-synthesized".

Helps when: you synthesized a sound yourself (Web Audio, numpy, ffmpeg) and want to know
whether it will read as cheap next to recorded sounds. It hears how a sound sounds, not
where it came from: clean professional UI chimes can also read as synthesized.

## ab — compare two takes in words

`bash <skill>/scripts/hear.sh ab <a> <b> [--query "a soft UI tap"] [--refs <files or folder>]`

One paragraph: which one is closer to the description (z for each), how related they
sound, and how they differ in level, brightness, attack and tail. Measured: "B is slightly
closer to 'a soft UI tap' (z A +1.7, B +2.4) … B is 5 dB louder, darker, with a sharper
attack". Trims with `--a-start/--a-end/--b-start/--b-end`; A and B may be the same file.

Helps when: you changed a mix or swapped a sound and want to know what changed.

## measure — meter numbers only, no models

`bash <skill>/scripts/hear.sh measure <file…> [--music] [--start s --end s] [--json]`

LUFS, true peak, loudness range, noise floor, attack and decay, brightness, frequency
bands, stereo width and correlation, onset times. `--music` adds tempo, beat times and key
(measured: 139.7 BPM, G minor on the test film). Fast.

Helps when: you only need numbers — the level of a stem before mixing, the attack of a hit
to line it up, or onset times.

## profile — your own reference set (advanced)

`bash <skill>/scripts/hear.sh profile <reference films or folder> -o my-profile.json`, then
`hear.sh critique out/film.mp4 --profile my-profile.json` scores against your references
instead of the bundled seven launch films. Useful when the film is a different genre
(a calm explainer, a music video) and the launch-film ranges do not fit it.

## Ears over the API

`WAMOTION_EARS_URL=https://<host>` and `WAMOTION_EARS_TOKEN=<token>` in the environment make
`hear.sh` run every command above on that ears server instead of a local install. It is
the same earshot commit, called with the same arguments; `--json` prints the same JSON, `-o`
and `--out` files come back to the path you gave. Nothing to install; Node ≥ 20 is enough.

What travels: the command's arguments and the files named in them (a folder given to `rank`
or `realness` is sent as its audio/video files, up to 200). The server keeps an uploaded file
for 24 hours so later commands on the same film reuse earshot's caches, then deletes it; it
keeps no sound library and runs nothing else on your files. One request may carry up to 300 MB
and up to 10 minutes of media; a 30 s 1080p mp4 is usually 20–50 MB.

What comes back: `stdout` and `stderr` exactly as the command prints them, the exit code, and
`WAMOTION_EARS_TIMING=1` adds one stderr line with bytes uploaded, time queued and time run.
Jobs run one at a time per server; when more than 8 wait the API answers "busy" and `hear.sh`
falls back to a local install if there is one, else prints one line and exits 0. A 401 means
the token was not accepted (`WAMOTION_EARS_TOKEN` must be one of the server's `WAMOTION_EARS_TOKENS`).

Measured on a Mac against the API running in Docker on the same machine (30 s film, 27.8 MB
upload on localhost; a remote server adds the upload time of your connection): the numbers for
the same file are identical to the local install's, and the second command on a film takes
1–4 s instead of 10–16 s because the models are already loaded.
