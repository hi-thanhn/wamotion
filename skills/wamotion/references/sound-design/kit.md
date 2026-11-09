# Launch kit — roles, levels over the music, placement against the cut

Measured medians from earshot's `launch` kit (Leonxlnx/earshot, MIT; `earshot/forge/kits/launch.json`): a music-led
launch film where every effect is balanced against the music bed instead of at a fixed level. Use the numbers as
what pros did on reference clips, not as laws. Bank ids are the earshot members; in Wamotion's bank the same sound is
`es-<category>-<member>` (see `bank.md`), e.g. `pro_hover_tick/ping` → `es-pro-hover-tick-ping`.

| role | what it is for | bank sound | align | offset ms | level over bed dB | min gap ms | width |
|---|---|---|---|---|---|---|---|
| `tick` | an airy 8.8 kHz tick (60 ms), set fully wide: ticks come in runs ~66 ms apart; felt in the run, as low over the bed as the light touches | `pro_hover_tick/ping` | onset | 0 | 3.0 | 66 | 0.1 |
| `tick.crisp` | a bright designed tink for the crisper tick, a little wide | `pro_click/tink` | onset | 0 | 3.0 | 66 | 0.3 |
| `tock` | a mid-band wooden knock (0.15 s, 400 Hz block): knocks lead the cut by ~40 ms | `knock/wood` | onset | -40 | 8.0 | 100 |  |
| `hit` | one short punchy cut hit (0.28 s, two thirds under 150 Hz), on the cut, after the music steps down | `cut_hit/punch` | onset | 0 | 7.5 |  |  |
| `land` | a round low pop-in thump (124 Hz, 0.18 s): it lands ~30 ms after the cut | `pro_pop_in/round` | onset | 30 | 8.0 | 159 |  |
| `land.light` | a light finger tap (150-260 Hz and a faint click), low under the bed: taps lead the cut by ~60 ms | `tap/finger` | onset | -60 | 3.0 | 115 |  |
| `pop` | the soft rounded mid pop (0.14 s, 550 Hz, 22 ms onset, t20 75 ms): the most used effect, in runs ~114 ms apart | `ui_pop/soft` | onset | 4 | 8.5 | 114 |  |
| `whoosh.short` | a fast air whoosh (0.37 s, 570 Hz): its peak lands ~37 ms after the cut (swish/bright for a brighter 2.4 kHz flick) | `whoosh_fast/crisp` | peak | 37 | 9.0 |  |  |
| `whoosh.long` | a big low whoosh that lands with a thump ~80 ms in and rings ~0.35 s | `whoosh_big/thump` | peak | 3 | 8.5 |  |  |
| `suck` | off — off: a reverse whoosh into a cut stacks a lead-in on the hit; the music stop-down does that job | — | | | | | |
| `riser` | a short dark riser (0.8 s, noise + sub + a speeding stutter, no synth sweep), its peak ~23 ms before the cut and its fall across it (it rings on past its loudest point, so it is aligned on the peak, not its end); at most one or two a film | `riser/dark` | peak | -23 | 8.0 |  |  |
| `swell` | a darker near-mono reverse swell peaking ~42 ms after the cut; at most one a film (reverse_swell/cymbal for the bright wide cymbal) | `reverse_swell/dark` | peak | 42 | 9.5 |  |  |
| `drop` | a short kick-led sub hit (0.22 s) on the cut; set edits.pitch to the film's root | `cut_hit/kick` | onset | 0 | 7.0 |  |  |
| `key` | realistic mid keys (1.3-4.4 kHz), a new take per keystroke, ~87 ms apart in a run | `typing_key/clicky` | onset | 8 | 6.5 | 87 |  |
| `key.space` | a mechanical keyboard space bar, a CC0 recording fitted as code | `fit/key.space/thock_space` | onset | 8 | 6.5 |  |  |
| `key.return` | the run's own switch on its own seeds, a little louder | `typing_key/clicky` | onset | 8 | 7.0 |  |  |
| `click` | a small plastic click, a CC0 recording fitted as code: clicks lead the cut by ~11 ms | `fit/click/floss_lid` | onset | -11 | 6.5 | 85 |  |
| `click.confirm` | a rounded mid ding (690 Hz, 32 ms onset), the accent at the end of a run | `notify/mid_tine` | onset | 0 | 8.5 |  |  |
| `snap` | a camera shutter for snap zooms and whip-cuts (fit/snap/switch_flip for a toggle) | `shutter/dslr` | onset | 9 | 4.0 | 66 |  |
| `bell` | a gated glockenspiel note doubled an octave under (0.35 s), C pentatonic G4-E6, set wide (L / R correlation 0.6): notes lead the cut by ~20 ms | `mallet/glock` | onset | -20 | 7.5 | 110 | 0.6 |
| `text` | one soft felt pluck per resolved fragment (C pentatonic C4-A4), low under the bed | `mallet/pluck` | onset | 0 | 4.0 | 110 |  |

`align`: `onset` = the sound's attack sits on the frame; `peak` = its loudest moment does (whooshes, risers, swells).
`offset ms`: negative leads the cut (taps, knocks, clicks), positive lands after it (pop-in thumps, whoosh and swell peaks).
`level over bed`: the mix's loudest 50 ms at the effect over the music's median level in the second before the cue.

## Mix rules the kit was measured with

- No ducking under effects (`duck_db` 0). Instead the music steps down 6–12 dB for 0.3–0.5 s before `hit`, `drop`, `whoosh.long`, `swell` and comes back on the hit.
- A run of ticks or keys accents at its end with `click.confirm`, `land`, `drop`.
- Designed effects per 10 s: music led 3–13 · voice over explainer 18–30 · effects led 30–38.

Kit note (verbatim): The music-led launch film: soft, short, mid-register effects mixed against the music bed instead of at a fixed level. Every role names its level over the bed (bed_db: the mix's loudest 50 ms at the effect over the music's median 50 ms level in the second before the cue), where it sits against the cut (offset_ms: taps, knocks and clicks lead, pop-in thumps and whoosh and swell peaks land after) and how close a run may go (min_gap_ms); ticks and bells are set wide. The numbers are medians measured on a private set of licensed reference clips; the members are the earshot 0.4 recipe sounds made for that style (ui_pop, knock, cut_hit, mallet, shutter, the thump-whoosh, the dark riser and swell, the mid ding). level_db is the same balance for a mixer without a bed (the loudest role at 0 dB). One gesture at a time: the music steps down before a hit, a drop, a big whoosh or a swell and comes back on it; nothing ducks under the effects. Every take passes the model-free audit (earshot kit check).
