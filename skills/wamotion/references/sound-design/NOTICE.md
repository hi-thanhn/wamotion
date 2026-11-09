# Notice

This folder is installed into every Wamotion project as `.claude/skills/sound-design/`. It bundles material from
**earshot** by Leon Lin — https://github.com/Leonxlnx/earshot, MIT License (`LICENSE.md`), commit
591fa3e028032e6dce56620a20e932e35667e8d8 (2026-10-22):

- `launch-video-sound.md` — `docs/launch-video-sound.md`, with a short "In Wamotion" note on top and two sentences
  pointing at Wamotion commands instead of earshot's `skills/real-sound/` pipeline.
- `kit.md` — the roles, levels and offsets of `earshot/forge/kits/launch.json`, laid out as a table.
- `CREDITS_FIT.md` — `docs/CREDITS_FIT.md`: the CC0 Freesound recordings the 15 `fit/…` bank sounds were fitted from.
- The `es-…` sounds listed in `bank.md` are rendered from earshot's bank recipes (`earshot/forge/bank/*.json`).

`SKILL.md` and `bank.md` are Wamotion's own text (`bank.md` is generated from the sound bank's manifest). The bundled
CC0 sounds in `bank.md` are credited in the app's `ATTRIBUTION.md`; `wamotion sound credits` lists what a film uses.
