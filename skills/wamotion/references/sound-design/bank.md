# The sound bank

GENERATED from the app's sound bank manifest — do not edit. Get a sound into the project with
`wamotion sound get --id <id>` (returns the `assets/…` path for `staticFile`) or search by description with
`wamotion sound search --query "…"`. `peakLagSec` is the seconds from the file's start to its attack (for
riser/swell entries: to its peak): place the clip at `hitFrame - round(peakLagSec * fps)`.

## Real recordings — CC0 (Kenney · Freesound · OpenGameArt), 89 sounds

### whoosh

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `whoosh-short` | whoosh |  | 0.43 | 0.049 | Short rush of air passing by, medium size, dry, real recording. |
| `whoosh-whip` | whoosh |  | 0.24 | 0.041 | Very short whip crack/throw, sharp, dry, real recording. |
| `whoosh-quick` | whoosh |  | 0.65 | 0.249 | Quick, slightly cartoonish whoosh, small, dry. |
| `whoosh-soft` | whoosh |  | 0.76 | 0.284 | Soft, low, smooth rush of air with no sharp attack — a bed for text drifting in. |
| `whoosh-medium` | whoosh |  | 0.52 | 0.092 | Medium whoosh, clear attack, dry, fits any pass-by. |
| `whoosh-air` | whoosh |  | 0.25 | 0.044 | Very short swish of air like a hand flick, small, dry. |
| `whoosh-swoosh` | whoosh |  | 2.10 | 0.650 | Long 2 s swoosh, low with body, slightly reverberant. |
| `whoosh-light` | whoosh |  | 0.91 | 0.138 | Light stereo whoosh crossing the frame, bright, for transitions. |
| `whoosh-long` | whoosh |  | 2.50 | 0.310 | Long, low, soft swoosh with a reverberant tail — a slow pan. |
| `whoosh-nice` | whoosh |  | 3.00 | 0.115 | Clean, bright, moderate swoosh, slightly electronic. |
| `whoosh-epic` | whoosh |  | 3.00 | 0.968 | Big, low, reverberant cinematic whoosh — trailer. |

### transition

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `transition-swoosh` | transition |  | 0.33 | 0.021 | Short, sharp, dry transition swoosh with a light tap at the start. |
| `transition-swish` | transition |  | 0.20 | 0.031 | Ultra-short, light, dry transition swish. |
| `transition-whip-click` | transition |  | 0.31 | 0.091 | Whip ending in a snap — a fast pan, then the frame locks. |
| `transition-whoosh-click` | transition |  | 0.70 | 0.107 | Whoosh ending in a mechanical click, plastic/metal, dry. |
| `transition-ethereal` | transition |  | 4.00 | 0.535 | Long 4 s dreamy rush, low, reverberant, electronic — a slow section change. |
| `transition-maximize` | transition |  | 0.38 | 0.059 | UI maximize sound: short rising pitch, electronic, cute. |
| `transition-minimize` | transition |  | 0.38 | 0.178 | UI minimize sound: short falling pitch, electronic, cute. |

### impact

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `impact-big` | impact |  | 3.00 | 0.005 | Big, low cinematic hit with a long reverberant tail — logo, big closing line. |
| `impact-sub-drop` | impact |  | 3.00 | 0.158 | Deep, smooth electronic sub drop with no attack — a number landing. |
| `impact-dramatic` | impact |  | 3.00 | 0.016 | Low dramatic hit with metal, reverberant. |
| `impact-low` | impact |  | 3.00 | 0.026 | Low, thick boom with a long reverberant tail. |
| `impact-horns` | impact |  | 3.50 | 0.051 | Cinematic stinger with brass, loud, reverberant — a big moment. |
| `impact-boom` | impact |  | 3.00 | 1.621 | Action-movie hit, loud, harsh, low, reverberant. |
| `impact-punch-heavy` | impact |  | 0.58 | 0.025 | Heavy punch, low, dry, short, real recording. |
| `impact-punch-medium` | impact |  | 0.35 | 0.019 | Medium thump, dry, short like a stamp or a hand slapped on a table — real recording. |
| `impact-soft-heavy` | impact |  | 0.57 | 0.002 | Something heavy set down softly, low, muffled, dry. |
| `impact-plate` | impact |  | 0.35 | 0.001 | Metal plate hit, medium, bright, with a short ring. |

### riser

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `riser-short` | riser |  | 2.33 | 2.170 | Short 2 s riser building hard, electronic, ends at the peak. |
| `riser-chromatic` | riser |  | 5.00 | 4.001 | Chromatic climbing riser with reverb, 5 s, electronic, brightening. |
| `riser-hit-1` | riser |  | 3.89 | 2.894 | Dark riser building into a hit, cinematic, 4 s. |
| `riser-hit-2` | riser |  | 4.25 | 3.248 | Dark cinematic riser ending in a hit, 4 s, electronic. |
| `riser-impact` | riser |  | 5.00 | 4.001 | Long 5 s riser ending in an impact, low, electronic. |
| `riser-rewind` | riser |  | 4.00 | 3.002 | Tape-rewind sound building up, electronic, unusual. |
| `riser-phaser` | riser |  | 0.48 | 0.117 | Very short rising phaser, 8-bit, electronic, playful. |

### sparkle

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `sparkle-wink` | sparkle |  | 0.43 | 0.003 | Cartoon sparkle wink, very short, bright, small metallic. |
| `sparkle-item` | sparkle |  | 0.49 | 0.004 | Item-pickup sparkle, short, bright and high. |
| `sparkle-bell` | sparkle |  | 1.26 | 0.002 | Single success bell, clean, short ring. |
| `sparkle-chime` | sparkle |  | 2.12 | 0.288 | Bright sparkling wind chime, 2 s, electronic, lighting up. |
| `sparkle-bar-chimes` | sparkle |  | 3.00 | 0.511 | Long descending bar-chime sweep, bright, reverberant — a magical ending. |
| `sparkle-synth` | sparkle |  | 3.00 | 1.295 | Playful cartoon synth sparkle, 3 s. |
| `sparkle-magic` | sparkle |  | 3.00 | 0.322 | Full magic sparkle, bright, reverberant. |
| `sparkle-stars` | sparkle |  | 3.00 | 0.085 | Retro twinkling stars, light, electronic. |
| `sparkle-confirm` | sparkle |  | 0.29 | 0.001 | Two-note UI confirm sound, short, electronic, cute. |
| `sparkle-power-up` | sparkle |  | 0.28 | 0.023 | Rising 8-bit power-up, short, electronic. |

### foley

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `typewriter-1` | foley |  | 2.50 | 0.059 | Continuous typewriter typing, metal, dry, real recording. |
| `typewriter-2` | foley |  | 2.50 | 0.009 | Typewriter typing, bright, with the end-of-line bell, real recording. |
| `keyboard-typing-1` | foley |  | 2.50 | 0.078 | Computer keyboard typing, plastic, dry, real recording. |
| `keyboard-typing-2` | foley |  | 1.00 | 0.002 | Fast electronic key typing, bright, 1 s — text appearing. |
| `paper-page-turn-1` | foley |  | 0.48 | 0.197 | One page turned, short, dry, real recording. |
| `paper-page-turn-2` | foley |  | 1.67 | 0.855 | Longer page turn, thick paper, dry, real recording. |
| `paper-rustle` | foley |  | 2.50 | 0.572 | Paper rustling, crumpling, dry, real recording — a paper bag, a receipt. |
| `paper-flutter` | foley |  | 2.50 | 0.184 | Paper fluttering in the air, light, dry. |
| `clock-tick-1` | foley |  | 4.00 | 0.108 | Steady clock ticking, small metal, dry, real recording. |
| `clock-tick-2` | foley |  | 4.00 | 0.400 | Wooden clock ticking, lower, dry. |
| `clock-tick-stopwatch` | foley |  | 3.86 | 0.002 | Fast stopwatch ticking, plastic, dry — urgency. |
| `pen-write-1` | foley |  | 3.00 | 0.026 | Pen writing on paper, scratchy, dry, real recording. |
| `pen-write-2` | foley |  | 3.00 | 0.737 | Ballpoint pen writing fast on paper, dry, close. |
| `pen-scribble` | foley |  | 1.18 | 0.049 | Quick scribble on paper, short, dry. |
| `pen-marker` | foley |  | 3.00 | 0.087 | Marker drawing a line on paper/board, light squeak, dry. |
| `camera-shutter-1` | foley |  | 0.30 | 0.075 | Single camera shutter, short, mechanical, dry. |
| `camera-shutter-2` | foley |  | 0.42 | 0.024 | Phone camera snap, short, electronic imitating mechanical. |
| `camera-shutter-3` | foley |  | 1.50 | 0.471 | DSLR shutter, mechanical, with the mirror flip. |
| `camera-shutter-flash` | foley |  | 2.97 | 0.965 | Snap with a charging flash, 3 s, electronic. |
| `pop-1` | foley |  | 3.05 | 0.027 | Round cartoon pop with a tail, playful. |
| `pop-2` | foley |  | 0.29 | 0.021 | Very short, dry, round pop — text/icon popping in. |
| `pop-bubble` | foley |  | 1.50 | 1.240 | Bubble bursting, round, wet, playful. |
| `pop-cork` | foley |  | 0.54 | 0.021 | Champagne cork popping, tight, with a hiss. |
| `lock-slide` | foley |  | 1.83 | 0.845 | Sliding lock bolt, metal/wood, dry. |
| `lock-door` | foley |  | 2.00 | 1.336 | Door lock click, metal, tight. |
| `lock-phone` | foley |  | 1.50 | 0.824 | Phone screen lock, small click, electronic. |
| `glass-clink-1` | foley |  | 0.87 | 0.021 | Glasses clinking, bright, short ring. |
| `glass-clink-2` | foley |  | 2.00 | 0.022 | Glass touching glass, longer ring, bright. |
| `ping` | foley |  | 2.00 | 0.006 | Round notification ping with bass, ringing — a message arrives. |
| `switch-1` | foley |  | 0.21 | 0.002 | Flipping a switch, small click, plastic, dry. |
| `switch-2` | foley |  | 0.27 | 0.026 | UI switch, plastic click, short. |
| `click-1` | foley |  | 0.10 | 0.002 | Ultra-short UI click, clean, electronic — a button tap, a card appearing. |
| `click-2` | foley |  | 0.09 | 0.020 | Ultra-short plastic click, dry — a screen tap. |
| `scroll-1` | foley |  | 1.00 | 0.001 | UI scroll, small even ratcheting, electronic. |
| `drop-1` | foley |  | 0.19 | 0.001 | UI drop, small downward pop, electronic. |
| `footstep-1` | foley |  | 0.25 | 0.002 | One footstep on a wooden floor, low, dry. |

### ambience

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `ambience-office-1` | ambience |  | 20.00 | 4.461 | Office background: distant voices, machines, air conditioning. |
| `ambience-office-2` | ambience |  | 20.00 | 1.063 | Office background with paper sounds and sparse keyboard typing. |
| `ambience-room-tone` | ambience |  | 20.00 | 0.311 | Closed-room tone, almost silent, light low hum. |
| `ambience-city-morning` | ambience |  | 20.00 | 1.431 | Street in the morning: distant traffic, birds, people passing. |
| `ambience-city-night` | ambience |  | 20.00 | 0.351 | City at night: distant traffic, wind, emptier. |
| `ambience-street` | ambience |  | 20.00 | 0.307 | Busy street traffic, distant horns, dense. |
| `ambience-rain-light` | ambience |  | 20.00 | 0.550 | Light, steady rain, murmuring. |
| `ambience-rain-forest` | ambience |  | 20.00 | 1.927 | Rain on forest leaves, dense, with insects. |

## Designed sounds — earshot bank (MIT), 252 sounds

Rendered from earshot's recipes (`es-<category>-<member>`); `roles` are the launch-kit roles in `kit.md`.
`fit` entries are fitted from CC0 recordings (`CREDITS_FIT.md`).

### foley

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `es-click-double` | foley | click | 0.10 | 0.003 | cursor presses and buttons: a short modal tick with a small body |
| `es-click-snap` | foley | click | 0.06 | 0.003 | cursor presses and buttons: a short modal tick with a small body |
| `es-click-soft` | foley | click | 0.09 | 0.003 | cursor presses and buttons: a short modal tick with a small body |
| `es-click-thock` | foley | click | 0.10 | 0.003 | cursor presses and buttons: a short modal tick with a small body |
| `es-click-tink` | foley | click | 0.07 | 0.003 | cursor presses and buttons: a short modal tick with a small body |
| `es-drip-bloop` | foley | pop | 0.37 | 0.013 | a big drop's slow bloop: ~5 st over 0.1-0.15 s (the audit's drip allowance) |
| `es-drip-bubble` | foley | pop | 0.29 | 0.009 | a lower bubble rising 10 st with a daughter bubble |
| `es-drip-drop` | foley | pop | 0.33 | 0.018 | a water drop: a 306 Hz bubble rising 8 st within 40 ms, soft onset |
| `es-drip-plink` | foley | pop | 0.26 | 0.016 | a small high plink rising 3 st |
| `es-drip-tiny` | foley | pop | 0.14 | 0.005 | a tiny fast droplet at 1.15 kHz, 0.1 s |
| `es-fit-click-floss-lid` | foley | click, tick.crisp | 0.13 | 0.007 | a small plastic click, fitted from "Plastic Clicks.flac" by qubodup (CC0 1.0): sines model, CLAP 0.96 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-key-space-thock-space` | foley | key.space | 0.39 | 0.020 | a mechanical keyboard space bar, fitted from "Keychron k10 space_bar" by Sadiquecat (CC0 1.0): sines model, CLAP 0.95 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-key-lubed` | foley | key | 0.42 | 0.074 | one mechanical keyboard key press, fitted from "Keyboard typing sounds: Unidentified Technics keyboard" by zrrion (CC0 1.0): modal model, CLAP 0.98 to the recording, takes pass the take check at vary 0.3; the audit notes a comb ring in the tail on some takes, as on the recording itself |
| `es-fit-key-medium` | foley | key | 0.43 | 0.103 | one mechanical keyboard key, press and release, fitted from "mechanical key medium.wav" by bigmonmulgrew (CC0 1.0): hybrid model, CLAP 0.94 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-key-thock` | foley | key | 0.45 | 0.014 | one low mechanical keyboard key press, fitted from "Keychron k10 A to + individual keys" by Sadiquecat (CC0 1.0): modal model, CLAP 0.94 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-pop-lip-pop` | foley | pop | 0.22 | 0.008 | a short pop, fitted from "Pop sound" by deraj (CC0 1.0): modal model, CLAP 0.95 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-pop-mouth-plop` | foley | pop | 0.28 | 0.011 | a soft mouth plop, fitted from "Mouth Plops.wav" by CapsLok (CC0 1.0): hybrid model, CLAP 0.96 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-snap-switch-flip` | foley | snap, click | 0.19 | 0.034 | a switch flip, fitted from "Switch Flip #1" by IanStarGem (CC0 1.0): sines model, CLAP 0.94 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-tick-domino` | foley | tick | 0.14 | 0.007 | domino pieces knocking together, fitted from "Domino pieces hit" by Macif (CC0 1.0): sines model, CLAP 0.94 to the recording, takes pass the take check at vary 0.3 |
| `es-hover-tick-air` | foley | tick | 0.07 | 0.003 | hover, list rows passing, tiny ticks |
| `es-hover-tick-detent` | foley | tick | 0.08 | 0.004 | hover, list rows passing, tiny ticks |
| `es-hover-tick-high` | foley | tick | 0.05 | 0.003 | hover, list rows passing, tiny ticks |
| `es-hover-tick-mid` | foley | tick | 0.09 | 0.003 | hover, list rows passing, tiny ticks |
| `es-hover-tick-ping` | foley | tick | 0.05 | 0.003 | hover, list rows passing, tiny ticks |
| `es-knock-double` | foley | tock | 0.16 | 0.003 | a knock-knock: two wooden taps 55 ms apart |
| `es-knock-plastic` | foley | tock | 0.15 | 0.052 | a plastic click that bounces back 18 ms later (2.4 kHz) |
| `es-knock-snap` | foley | tock | 0.13 | 0.041 | a soft contact, then a bright plastic snap with a bounce (3 kHz) |
| `es-pop-0` | foley | pop | 0.20 | 0.002 | bubble and cork pops (the bubble rises in pitch) |
| `es-pop-1` | foley | pop | 0.15 | 0.002 | bubble and cork pops (the bubble rises in pitch) |
| `es-pop-2` | foley | pop | 0.25 | 0.003 | bubble and cork pops (the bubble rises in pitch) |
| `es-pop-3` | foley | pop | 0.16 | 0.001 | bubble and cork pops (the bubble rises in pitch) |
| `es-pop-4` | foley | pop | 0.22 | 0.001 | bubble and cork pops (the bubble rises in pitch) |
| `es-pro-click-glass` | foley | click, tick.crisp | 0.06 | 0.003 | bright designed UI ticks |
| `es-pro-click-mouse` | foley | click, tick.crisp | 0.05 | 0.003 | bright designed UI ticks |
| `es-pro-click-snap` | foley | click, tick.crisp | 0.05 | 0.003 | bright designed UI ticks |
| `es-pro-click-soft` | foley | click, tick.crisp | 0.05 | 0.003 | bright designed UI ticks |
| `es-pro-click-tink` | foley | click, tick.crisp | 0.04 | 0.003 | bright designed UI ticks |
| `es-pro-hover-tick-air` | foley | tick, tick.crisp | 0.06 | 0.003 | airy digital ticks: cursor blinks, counters |
| `es-pro-hover-tick-detent` | foley | tick, tick.crisp | 0.04 | 0.003 | airy digital ticks: cursor blinks, counters |
| `es-pro-hover-tick-glass` | foley | tick, tick.crisp | 0.04 | 0.003 | airy digital ticks: cursor blinks, counters |
| `es-pro-hover-tick-ping` | foley | tick, tick.crisp | 0.04 | 0.003 | airy digital ticks: cursor blinks, counters |
| `es-pro-hover-tick-soft` | foley | tick, tick.crisp | 0.03 | 0.003 | airy digital ticks: cursor blinks, counters |
| `es-pro-pop-bloop` | foley | pop | 0.12 | 0.004 | tonal pops for a word or badge appearing |
| `es-pro-pop-boop` | foley | pop | 0.11 | 0.001 | tonal pops for a word or badge appearing |
| `es-pro-pop-chirp` | foley | pop | 0.16 | 0.034 | tonal pops for a word or badge appearing |
| `es-pro-pop-double` | foley | pop | 0.16 | 0.002 | tonal pops for a word or badge appearing |
| `es-pro-pop-thup` | foley | pop | 0.10 | 0.002 | tonal pops for a word or badge appearing |
| `es-pro-pop-tink` | foley | pop | 0.09 | 0.001 | tonal pops for a word or badge appearing |
| `es-pro-pop-in-airy` | foley | pop, land, land.light, snap | 0.17 | 0.011 | an icon or element popping in: a round low thump |
| `es-pro-pop-in-deep` | foley | pop, land, land.light, snap | 0.18 | 0.013 | an icon or element popping in: a round low thump |
| `es-pro-pop-in-double` | foley | pop, land, land.light, snap | 0.17 | 0.009 | an icon or element popping in: a round low thump |
| `es-pro-pop-in-knock` | foley | pop, land, land.light, snap | 0.15 | 0.009 | an icon or element popping in: a round low thump |
| `es-pro-pop-in-round` | foley | pop, land, land.light, snap | 0.17 | 0.011 | an icon or element popping in: a round low thump |
| `es-pro-typing-key-blip` | foley | key | 0.08 | 0.006 | high-passed designed ticks for kinetic type |
| `es-pro-typing-key-crackle` | foley | key | 0.07 | 0.006 | high-passed designed ticks for kinetic type |
| `es-pro-typing-key-double` | foley | key | 0.09 | 0.003 | high-passed designed ticks for kinetic type |
| `es-pro-typing-key-glass` | foley | key | 0.06 | 0.007 | high-passed designed ticks for kinetic type |
| `es-pro-typing-key-soft` | foley | key | 0.07 | 0.010 | high-passed designed ticks for kinetic type |
| `es-pro-typing-key-tick` | foley | key | 0.06 | 0.007 | high-passed designed ticks for kinetic type |
| `es-pro-typing-run-blip` | foley | key.run | 1.51 | 0.006 | a whole typed run as one file |
| `es-pro-typing-run-double` | foley | key.run | 1.59 | 0.008 | a whole typed run as one file |
| `es-pro-typing-run-glass` | foley | key.run | 1.47 | 0.006 | a whole typed run as one file |
| `es-pro-typing-run-soft` | foley | key.run | 1.75 | 0.009 | a whole typed run as one file |
| `es-pro-typing-run-standard` | foley | key.run | 1.44 | 0.405 | a whole typed run as one file |
| `es-pro-typing-run-tick` | foley | key.run | 1.27 | 0.096 | a whole typed run as one file |
| `es-shutter-dslr` | foley | snap, click | 0.24 | 0.041 | a camera shutter: latch, 39 ms of curtain travel, the landing on a 1.4 kHz box |
| `es-shutter-film` | foley | snap | 0.28 | 0.098 | a heavier film camera: a dark box after 95 ms of travel, the body's thump, a spring rattle |
| `es-shutter-mirror` | foley | snap | 0.33 | 0.030 | a slower mirror-box shutter with an audible travel |
| `es-shutter-quick` | foley | snap, click | 0.16 | 0.001 | a quick double click: release and curtain 21 ms apart |
| `es-shutter-snap` | foley | snap, click | 0.14 | 0.060 | a dry, bright 2 kHz snap-zoom shutter |
| `es-toggle-latch` | foley | snap, click | 0.22 | 0.003 | switches, settings toggles, lock-ins (press + latch) |
| `es-toggle-micro` | foley | snap, click | 0.12 | 0.003 | switches, settings toggles, lock-ins (press + latch) |
| `es-toggle-off` | foley | snap, click | 0.14 | 0.003 | switches, settings toggles, lock-ins (press + latch) |
| `es-toggle-on` | foley | snap, click | 0.17 | 0.003 | switches, settings toggles, lock-ins (press + latch) |
| `es-toggle-rocker` | foley | snap, click | 0.23 | 0.003 | switches, settings toggles, lock-ins (press + latch) |
| `es-typing-key-clicky` | foley | key, key.space, key.return | 0.19 | 0.012 | realistic mechanical keys, one take per character |
| `es-typing-key-crisp` | foley | key, key.space, key.return | 0.22 | 0.011 | realistic mechanical keys, one take per character |
| `es-typing-key-deep` | foley | key, key.space, key.return | 0.32 | 0.012 | realistic mechanical keys, one take per character |
| `es-typing-key-laptop` | foley | key, key.space, key.return | 0.19 | 0.012 | realistic mechanical keys, one take per character |
| `es-typing-key-light` | foley | key, key.space, key.return | 0.16 | 0.012 | realistic mechanical keys, one take per character |
| `es-typing-key-thock` | foley | key, key.space, key.return | 0.34 | 0.013 | realistic mechanical keys, one take per character |
| `es-ui-pop-blip` | foley | pop | 0.12 | 0.012 | a bright 890 Hz blip, fully decorrelated (L / R correlation ~0.1) |
| `es-ui-pop-boop` | foley | pop | 0.19 | 0.022 | a rounder boop falling 9 st |
| `es-ui-pop-fall` | foley | pop | 0.20 | 0.016 | an eased 7 st fall with a faint second pop |
| `es-ui-pop-soft` | foley | pop, land.light | 0.18 | 0.021 | a soft rounded mid pop: 550 Hz, 22 ms onset, t20 75 ms |
| `es-ui-pop-step` | foley | pop | 0.19 | 0.022 | the soft pop a step higher, falling 3 st |
| `es-ui-pop-wide` | foley | pop | 0.19 | 0.036 | a wide 620 Hz pop with a lip click (correlation ~0.5) |

### impact

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `es-cut-hit-air` | impact | hit | 0.55 | 0.017 | a fast wide sub hit under a sustained bright air band |
| `es-cut-hit-kick` | impact | drop, hit | 0.33 | 0.003 | a kick-led sub hit: the beater lifts it to ~275 Hz |
| `es-cut-hit-punch` | impact | hit, land | 0.28 | 0.011 | a short punchy cut hit (0.28 s), two thirds under 150 Hz |
| `es-cut-hit-rumble` | impact | hit | 1.40 | 0.031 | a kick on a slow sub drop into a wide granular rumble (1.4 s) |
| `es-cut-hit-sub` | impact | drop, hit | 0.29 | 0.008 | a short sub hit, 225 -> 46 Hz, with a kick and a low punch |
| `es-downlifter-air-fall` | impact | drop | 2.06 | 0.068 | energy falling away after a hit, scene exits |
| `es-downlifter-flange-air` | impact | drop | 2.95 | 0.128 | energy falling away after a hit, scene exits |
| `es-downlifter-shepard-fall` | impact | drop | 4.02 | 0.169 | energy falling away after a hit, scene exits |
| `es-downlifter-sub-sink` | impact | drop | 1.79 | 0.028 | energy falling away after a hit, scene exits |
| `es-downlifter-synth-fall` | impact | drop | 4.04 | 0.079 | energy falling away after a hit, scene exits |
| `es-downlifter-tape` | impact | drop | 1.63 | 0.026 | energy falling away after a hit, scene exits |
| `es-fit-hit-bamboo-tok` | impact | hit, tock | 0.17 | 0.011 | a bamboo hit, fitted from "Bamboo hit" by michorvath (CC0 1.0): hybrid model, CLAP 0.97 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-land-light-finger-phone` | impact | land.light, text | 0.33 | 0.011 | a finger tapping a phone, fitted from "Finger Tapping Phone" by jentlemen (CC0 1.0): hybrid model, CLAP 0.93 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-land-light-finger-wood` | impact | land.light, tock | 0.34 | 0.007 | a finger tap on a wooden counter, fitted from "finger tap table counter wood various.wav" by kyles (CC0 1.0): modal model, CLAP 0.93 to the recording, takes pass the take check at vary 0.3 |
| `es-fit-land-light-fingertip-book` | impact | land.light, tock | 0.38 | 0.006 | light finger steps on a book, fitted from "Light Footsteps On Book" by IENBA (CC0 1.0): modal model, CLAP 0.94 to the recording, takes pass the take check at vary 0.3 |
| `es-impact-blast` | impact | hit, land | 5.76 | 0.002 | a cinematic hit: reveal, title slam (long tails: trim with dur or max_s) |
| `es-impact-classic` | impact | hit, land | 4.80 | 0.002 | a cinematic hit: reveal, title slam (long tails: trim with dur or max_s) |
| `es-impact-deep` | impact | hit, land | 6.20 | 0.002 | a cinematic hit: reveal, title slam (long tails: trim with dur or max_s) |
| `es-impact-metal` | impact | hit, land | 5.02 | 0.002 | a cinematic hit: reveal, title slam (long tails: trim with dur or max_s) |
| `es-impact-punch` | impact | hit, land | 2.85 | 0.004 | a cinematic hit: reveal, title slam (long tails: trim with dur or max_s) |
| `es-impact-swell` | impact | hit, land | 6.23 | 0.501 | a cinematic hit: reveal, title slam (long tails: trim with dur or max_s) |
| `es-knock-desk` | impact | tock, land.light | 0.22 | 0.016 | a knuckle on a desk: a low wooden knock with the table under it |
| `es-knock-wood` | impact | tock, land.light | 0.15 | 0.014 | a mid-band wooden knock: a 400 Hz block and its faint rattle |
| `es-notify-m0` | impact | bell, hit, text, click.confirm | 2.30 | 0.002 | struck bell chimes (A4-E6): success, a message, a soft lockup |
| `es-notify-m1` | impact | bell, hit, text, click.confirm | 2.00 | 0.002 | struck bell chimes (A4-E6): success, a message, a soft lockup |
| `es-notify-m2` | impact | bell, hit, text, click.confirm | 1.80 | 0.002 | struck bell chimes (A4-E6): success, a message, a soft lockup |
| `es-notify-m3` | impact | bell, hit, text, click.confirm | 2.50 | 0.003 | struck bell chimes (A4-E6): success, a message, a soft lockup |
| `es-notify-m4` | impact | bell, hit, text, click.confirm | 1.80 | 0.002 | struck bell chimes (A4-E6): success, a message, a soft lockup |
| `es-notify-m5` | impact | bell, hit, text, click.confirm | 1.70 | 0.002 | struck bell chimes (A4-E6): success, a message, a soft lockup |
| `es-pluck-kalimba` | impact | bell, text, hit | 3.00 | 0.005 | the launch film kalimba: a bright steel tine over a small wooden box |
| `es-pluck-kalimba-ring` | impact | bell, text, hit | 3.00 | 0.005 | a longer ring (the film's chord tones): end cards, a tonal lockup |
| `es-pluck-kalimba-soft` | impact | bell, text, hit | 3.00 | 0.006 | a fleshy-thumb pluck: darker and softer at the attack (the film's soft notes) |
| `es-pro-impact-air` | impact | hit, land | 0.85 | 0.032 | a designed gated sub impact |
| `es-pro-impact-deep` | impact | hit, land | 1.31 | 0.126 | a designed gated sub impact |
| `es-pro-impact-rumble` | impact | hit, land | 0.99 | 0.182 | a designed gated sub impact |
| `es-pro-impact-short` | impact | hit, land | 0.67 | 0.110 | a designed gated sub impact |
| `es-pro-impact-swell` | impact | hit, land | 1.12 | 0.308 | a designed gated sub impact |
| `es-pro-sub-drop-bright` | impact | drop | 1.25 | 0.002 | the designed low drop that blooms after the cut |
| `es-pro-sub-drop-low` | impact | drop | 1.14 | 0.239 | the designed low drop that blooms after the cut |
| `es-pro-sub-drop-quick` | impact | drop | 1.00 | 0.002 | the designed low drop that blooms after the cut |
| `es-pro-sub-drop-ref` | impact | drop | 1.45 | 0.215 | the designed low drop that blooms after the cut |
| `es-pro-sub-drop-soft` | impact | drop | 1.48 | 0.219 | the designed low drop that blooms after the cut |
| `es-pro-tap-double` | impact | land.light, tock | 0.12 | 0.008 | the soft low thump of a touch |
| `es-pro-tap-finger` | impact | land.light, tock | 0.09 | 0.008 | the soft low thump of a touch |
| `es-pro-tap-glass` | impact | land.light, tock | 0.10 | 0.003 | the soft low thump of a touch |
| `es-pro-tap-knock` | impact | land.light, tock | 0.09 | 0.007 | the soft low thump of a touch |
| `es-pro-tap-soft` | impact | land.light, tock | 0.10 | 0.012 | the soft low thump of a touch |
| `es-sub-drop-808` | impact | drop | 2.05 | 0.006 | weight under a hit, a music drop |
| `es-sub-drop-gritty` | impact | drop | 2.15 | 0.031 | weight under a hit, a music drop |
| `es-sub-drop-long` | impact | drop | 2.09 | 0.077 | weight under a hit, a music drop |
| `es-sub-drop-pro` | impact | drop | 2.10 | 0.199 | weight under a hit, a music drop |
| `es-sub-drop-punch` | impact | drop | 1.00 | 0.002 | weight under a hit, a music drop |
| `es-tap-finger` | impact | tock, land.light, click, tick | 0.12 | 0.003 | screen taps and light touches on a surface |
| `es-tap-glass` | impact | tock, land.light, click, tick | 0.15 | 0.003 | screen taps and light touches on a surface |
| `es-tap-knuckle` | impact | tock, land.light, click, tick | 0.15 | 0.003 | screen taps and light touches on a surface |
| `es-tap-soft` | impact | tock, land.light, click, tick | 0.13 | 0.004 | screen taps and light touches on a surface |
| `es-tap-table` | impact | tock, land.light, click, tick | 0.13 | 0.004 | screen taps and light touches on a surface |

### sparkle

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `es-fit-bell-small-bell` | sparkle | bell | 1.66 | 0.003 | a small bell struck once, fitted from "Small Bell #2" by steffcaffrey (CC0 1.0): sines model, CLAP 0.94 to the recording, takes pass the take check at vary 0.3; the audit notes a comb ring in the tail on some takes, as on the recording itself |
| `es-logo-sting-reverse-bloom` | sparkle | sting | 2.13 | 0.361 | a composite logo reveal (lead-in + hit + chime) |
| `es-logo-sting-soft-bloom` | sparkle | sting | 1.85 | 0.248 | a composite logo reveal (lead-in + hit + chime) |
| `es-logo-sting-spark` | sparkle | sting | 1.84 | 0.002 | a composite logo reveal (lead-in + hit + chime) |
| `es-logo-sting-whoosh-glass` | sparkle | sting | 1.91 | 0.191 | a composite logo reveal (lead-in + hit + chime) |
| `es-logo-sting-zip-ping` | sparkle | sting | 1.66 | 0.161 | a composite logo reveal (lead-in + hit + chime) |
| `es-mallet-celesta` | sparkle | bell, text | 0.41 | 0.006 | a wide celesta note (G5, L / R correlation ~0.5), gated |
| `es-mallet-flourish` | sparkle | bell | 0.50 | 0.002 | a quick three-note chime flourish in an arc, near mono |
| `es-mallet-glock` | sparkle | bell, text | 0.41 | 0.003 | a gated glockenspiel note doubled an octave under (0.35 s) |
| `es-mallet-marimba` | sparkle | bell, text | 0.56 | 0.004 | a short dry wooden marimba note (G4) |
| `es-mallet-pluck` | sparkle | text, bell | 0.49 | 0.026 | a soft, felt-like low pluck |
| `es-mallet-up4` | sparkle | bell | 0.75 | 0.005 | four gated chime notes up a pentatonic scale in skips, 110 ms apart, panned note by note |
| `es-notify-mid-tine` | sparkle | click.confirm, bell | 0.43 | 0.018 | a rounded mid ding: a felt-struck tine over its octave (690 Hz, 32 ms onset) |
| `es-notify-mid-wood` | sparkle | click.confirm, bell | 0.32 | 0.019 | a soft wooden bar with its octave body, a step higher |
| `es-pro-logo-sting-chirp-hum` | sparkle | sting | 0.99 | 0.057 | designed launch gestures onto a tone |
| `es-pro-logo-sting-sweep-hit` | sparkle | sting | 1.07 | 0.321 | designed launch gestures onto a tone |
| `es-pro-logo-sting-swell-sting` | sparkle | sting | 1.30 | 0.342 | designed launch gestures onto a tone |
| `es-pro-logo-sting-taps-tone` | sparkle | sting | 0.95 | 0.077 | designed launch gestures onto a tone |
| `es-pro-logo-sting-zap-bloom` | sparkle | sting | 0.96 | 0.055 | designed launch gestures onto a tone |
| `es-pro-notify-ding-1822` | sparkle | bell, click.confirm | 0.26 | 0.002 | short clean dings a semitone apart |
| `es-pro-notify-ding-1930` | sparkle | bell, click.confirm | 0.27 | 0.007 | short clean dings a semitone apart |
| `es-pro-notify-ding-2045` | sparkle | bell, click.confirm | 0.36 | 0.003 | short clean dings a semitone apart |
| `es-pro-notify-ding-2167` | sparkle | bell, click.confirm | 0.30 | 0.007 | short clean dings a semitone apart |
| `es-pro-notify-ding-2296` | sparkle | bell, click.confirm | 0.26 | 0.003 | short clean dings a semitone apart |
| `es-pro-shimmer-m0` | sparkle | shimmer | 1.95 | 0.692 | granular sparkle |
| `es-pro-shimmer-m1` | sparkle | shimmer | 1.40 | 0.348 | granular sparkle |
| `es-pro-shimmer-m2` | sparkle | shimmer | 1.65 | 0.719 | granular sparkle |
| `es-pro-shimmer-m3` | sparkle | shimmer | 1.15 | 0.067 | granular sparkle |
| `es-pro-shimmer-m4` | sparkle | shimmer | 2.40 | 0.835 | granular sparkle |
| `es-shimmer-m0` | sparkle | shimmer | 4.20 | 0.157 | chimes ringing out (end-card sparkle) |
| `es-shimmer-m1` | sparkle | shimmer | 4.00 | 0.002 | chimes ringing out (end-card sparkle) |
| `es-shimmer-m2` | sparkle | shimmer | 4.20 | 0.002 | chimes ringing out (end-card sparkle) |
| `es-shimmer-m3` | sparkle | shimmer | 3.60 | 0.101 | chimes ringing out (end-card sparkle) |
| `es-shimmer-m4` | sparkle | shimmer | 4.20 | 0.603 | chimes ringing out (end-card sparkle) |
| `es-shimmer-m5` | sparkle | shimmer | 4.40 | 0.221 | chimes ringing out (end-card sparkle) |

### whoosh

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `es-fit-whoosh-short-bamboo-swish` | whoosh | whoosh.short | 0.48 | 0.109 | a short whoosh, fitted from "Short Whoosh, 13x" by Kinoton (CC0 1.0): sines model, CLAP 0.94 to the recording, takes pass the take check at vary 0.3 |
| `es-pro-whoosh-big-gritty` | whoosh | whoosh.long, swell | 0.93 | 0.240 | a designed low sub swell into a cut |
| `es-pro-whoosh-big-long` | whoosh | whoosh.long, swell | 1.12 | 0.363 | a designed low sub swell into a cut |
| `es-pro-whoosh-big-reverse` | whoosh | whoosh.long, swell | 1.06 | 0.651 | a designed low sub swell into a cut |
| `es-pro-whoosh-big-swell` | whoosh | whoosh.long, swell | 0.81 | 0.255 | a designed low sub swell into a cut |
| `es-pro-whoosh-big-tonal` | whoosh | whoosh.long, swell | 0.81 | 0.266 | a designed low sub swell into a cut |
| `es-pro-whoosh-big-windy` | whoosh | whoosh.long, swell | 0.77 | 0.248 | a designed low sub swell into a cut |
| `es-pro-zip-arc` | whoosh | zip | 0.46 | 0.014 | tonal sweeps across a cut (up / arc members rise in pitch) |
| `es-pro-zip-down` | whoosh | zip | 0.29 | 0.006 | tonal sweeps across a cut (up / arc members rise in pitch) |
| `es-pro-zip-down-warm` | whoosh | zip | 0.37 | 0.006 | tonal sweeps across a cut (up / arc members rise in pitch) |
| `es-pro-zip-up` | whoosh | zip | 0.35 | 0.015 | tonal sweeps across a cut (up / arc members rise in pitch) |
| `es-pro-zip-up-hi` | whoosh | zip | 0.34 | 0.016 | tonal sweeps across a cut (up / arc members rise in pitch) |
| `es-swipe-cloth` | whoosh | whoosh.short | 0.68 | 0.133 | card and panel swipes, page turns (cloth, paper) |
| `es-swipe-flick` | whoosh | whoosh.short | 0.57 | 0.107 | card and panel swipes, page turns (cloth, paper) |
| `es-swipe-glide` | whoosh | whoosh.short | 0.74 | 0.151 | card and panel swipes, page turns (cloth, paper) |
| `es-swipe-paper` | whoosh | whoosh.short | 0.77 | 0.119 | card and panel swipes, page turns (cloth, paper) |
| `es-swipe-velvet` | whoosh | whoosh.short | 1.15 | 0.248 | card and panel swipes, page turns (cloth, paper) |
| `es-swish-blade` | whoosh | whoosh.short | 0.37 | 0.049 | thin quick flicks, text slides, small UI moves |
| `es-swish-bright` | whoosh | whoosh.short | 0.35 | 0.129 | a bright (~2.4 kHz) quick swish |
| `es-swish-cane` | whoosh | whoosh.short | 0.70 | 0.068 | thin quick flicks, text slides, small UI moves |
| `es-swish-flick` | whoosh | whoosh.short | 0.32 | 0.107 | a high flick that rises and stops dead, wide |
| `es-swish-soft` | whoosh | whoosh.short | 0.88 | 0.065 | thin quick flicks, text slides, small UI moves |
| `es-swish-stick` | whoosh | whoosh.short | 0.53 | 0.081 | thin quick flicks, text slides, small UI moves |
| `es-swish-zing` | whoosh | whoosh.short | 0.54 | 0.054 | thin quick flicks, text slides, small UI moves |
| `es-whoosh-big-cape` | whoosh | whoosh.long, swell | 1.33 | 0.281 | big scene transitions, large objects passing |
| `es-whoosh-big-deep` | whoosh | whoosh.long, swell | 2.04 | 0.683 | big scene transitions, large objects passing |
| `es-whoosh-big-gust` | whoosh | whoosh.long, swell | 1.89 | 0.493 | big scene transitions, large objects passing |
| `es-whoosh-big-jet` | whoosh | whoosh.long, swell | 1.65 | 0.409 | big scene transitions, large objects passing |
| `es-whoosh-big-reverse` | whoosh | whoosh.long, swell | 1.51 | 0.700 | big scene transitions, large objects passing |
| `es-whoosh-big-swell` | whoosh | whoosh.long, swell | 1.35 | 0.348 | big scene transitions, large objects passing |
| `es-whoosh-big-thump` | whoosh | whoosh.long | 1.03 | 0.134 | a big low whoosh that lands with a thump (~80 ms in, rings ~0.35 s) |
| `es-whoosh-big-thump-airy` | whoosh | whoosh.long | 0.92 | 0.119 | the thump-whoosh, airier |
| `es-whoosh-big-thump-deep` | whoosh | whoosh.long | 1.36 | 0.150 | the thump-whoosh, deeper and longer |
| `es-whoosh-fast-crisp` | whoosh | whoosh.short, suck | 1.06 | 0.125 | whip pans, fast fly-ins, element moves |
| `es-whoosh-fast-heavy` | whoosh | whoosh.short, suck | 0.77 | 0.124 | whip pans, fast fly-ins, element moves |
| `es-whoosh-fast-reverse` | whoosh | whoosh.short, suck | 0.77 | 0.281 | whip pans, fast fly-ins, element moves |
| `es-whoosh-fast-sleeve` | whoosh | whoosh.short, suck | 1.09 | 0.149 | whip pans, fast fly-ins, element moves |
| `es-whoosh-fast-tight` | whoosh | whoosh.short, suck | 0.54 | 0.138 | whip pans, fast fly-ins, element moves |
| `es-whoosh-fast-whip` | whoosh | whoosh.short | 0.91 | 0.031 | a designed bright whip: a wide ring that falls |
| `es-whoosh-fast-whistle` | whoosh | whoosh.short, suck | 1.00 | 0.171 | whip pans, fast fly-ins, element moves |

### transition

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `es-glitch-burst` | transition | glitch | 0.87 | 0.358 | crackle, then bright bursts that hit first and speed up |
| `es-glitch-chirp` | transition | glitch | 0.41 | 0.075 | a pitched data-chirp stutter that hits first |
| `es-glitch-crush` | transition | glitch | 0.54 | 0.023 | glitch transitions, error states |
| `es-glitch-data` | transition | glitch | 0.49 | 0.091 | glitch transitions, error states |
| `es-glitch-dropout` | transition | glitch | 0.74 | 0.002 | glitch transitions, error states |
| `es-glitch-hit` | transition | glitch | 0.34 | 0.004 | glitch transitions, error states |
| `es-glitch-mid` | transition | glitch | 0.25 | 0.032 | a short mid glitch that hits first |
| `es-glitch-scramble` | transition | glitch | 0.59 | 0.027 | glitch transitions, error states |
| `es-glitch-stutter` | transition | glitch | 0.64 | 0.027 | glitch transitions, error states |
| `es-pro-glitch-crunchy` | transition | glitch | 0.71 | 0.375 | a designed stutter ending on the cut |
| `es-pro-glitch-data` | transition | glitch | 0.67 | 0.377 | a designed stutter ending on the cut |
| `es-pro-glitch-fastroll` | transition | glitch | 0.55 | 0.251 | a designed stutter ending on the cut |
| `es-pro-glitch-framelock` | transition | glitch | 0.73 | 0.393 | a designed stutter ending on the cut |
| `es-pro-glitch-sparse` | transition | glitch | 0.75 | 0.346 | a designed stutter ending on the cut |
| `es-pro-glitch-standard` | transition | glitch | 0.71 | 0.226 | a designed stutter ending on the cut |

### riser

| id | kind | roles | s | peakLagSec | what it sounds like |
|---|---|---|---|---|---|
| `es-pro-riser-air-gate` | riser | riser | 1.20 | 1.183 | a short stutter riser into a cut |
| `es-pro-riser-chop` | riser | riser | 1.00 | 0.995 | a short stutter riser into a cut |
| `es-pro-riser-nblips` | riser | riser | 1.00 | 0.991 | a short stutter riser into a cut |
| `es-pro-riser-nblips-hi` | riser | riser | 0.85 | 0.846 | a short stutter riser into a cut |
| `es-pro-riser-roll` | riser | riser | 1.30 | 1.278 | a short stutter riser into a cut |
| `es-reverse-swell-breath` | riser | swell | 1.24 | 0.733 | a mid-band reverse breath, half wide (1.3 kHz) |
| `es-reverse-swell-cymbal` | riser | swell | 0.90 | 0.476 | a bright wide reverse cymbal: a plateau after the peak, then a stop |
| `es-reverse-swell-dark` | riser | swell | 0.92 | 0.558 | a darker, near-mono reverse swell with a low body |
| `es-reverse-swell-ring` | riser | swell | 1.68 | 0.620 | a reverse cymbal that swells harder and rings out |
| `es-reverse-swell-short` | riser | swell | 0.65 | 0.331 | a short bright reverse cymbal for a quick cut (0.33 s to the peak) |
| `es-riser-air` | riser | riser | 2.40 | 2.379 | a build into a reveal; it stops on its loudest sample |
| `es-riser-build` | riser | riser | 1.76 | 1.129 | a sub-heavy build with crackle and a speeding gate (1.1 s) |
| `es-riser-dark` | riser | riser | 0.95 | 0.699 | a short dark riser (noise, sub, a speeding stutter), no synth sweep |
| `es-riser-rush` | riser | riser | 1.76 | 1.743 | a build into a reveal; it stops on its loudest sample |
| `es-riser-shepard` | riser | riser | 3.71 | 3.692 | a build into a reveal; it stops on its loudest sample |
| `es-riser-snatch` | riser | riser | 0.64 | 0.391 | a half-second stutter snatch into a cut |
| `es-riser-swell` | riser | riser | 2.20 | 2.190 | a build into a reveal; it stops on its loudest sample |
| `es-riser-tension` | riser | riser | 2.80 | 2.784 | a build into a reveal; it stops on its loudest sample |

## Music — CC0, 14 tracks (`wamotion music list`, `music pick`)

| id | title | mood | s | loop | bpm | author |
|---|---|---|---|---|---|---|
| `vaporware` | Vaporware | calm | 100 | no |  | cynicmusic |
| `november-snow` | November Snow | calm | 100 | no |  | cynicmusic |
| `snowfall` | Snowfall (looped) | calm | 50 | yes |  | Kistol |
| `chill-lofi` | Chill Lofi Inspired | warm | 100 | no |  | omfgdude |
| `cup-of-tea` | A Cup of Tea | warm | 100 | no |  | TAD |
| `small-fire` | A Small Fire Will Do | warm | 64 | yes |  | Trex0n |
| `bossa-8bit` | 8bit Bossa | playful | 60 | yes | 129 | Joth |
| `lasso-lady` | Lasso Lady | playful | 74 | yes | 140 | congusbongus |
| `world-is-ours` | The World Is Ours | upbeat | 100 | no |  | Zane Little Music |
| `winning-the-race` | Winning the Race | tech | 100 | no |  | section31 |
| `lifewave` | Lifewave 2k | cinematic | 100 | no |  | cynicmusic |
| `the-rush` | The Rush | cinematic | 100 | no |  | tebruno99 |
| `searching` | Searching | tense | 100 | no |  | yd |
| `loading-loop` | Loading Screen Loop | tense | 21 | yes |  | Brandon Morris |
