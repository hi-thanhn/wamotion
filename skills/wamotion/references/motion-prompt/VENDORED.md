# Vendored: motion-prompt

Source: https://github.com/showheyohtaki/motion-prompt (MIT, (c) 2026 Shohei Ohtaki — see LICENSE and
THIRD-PARTY-NOTICES.md), commit b4b676ef693080e78b706e36b47a8faa5286298e. Wamotion installs this folder (without
this file) into every project as `.claude/skills/motion-prompt/` (plan/56 §56.11).

Kept as published: LICENSE, THIRD-PARTY-NOTICES.md, references/porting.md, the English catalog data
(`api/v1/catalog.json`, `api/v1/en/`, `api/v1/kit/` → `data/`).

Changed for Wamotion:
- `scripts/motion-prompt.mjs`: also looks for the data in `../data` (offline, next to the skill).
- `SKILL.md`: concrete command path; Workflow step 1 reads a Wamotion film (Remotion TSX, `worlds/film.tsx`,
  `useBeat`) instead of "empty folder → Canvas page"; removed "Plan scene by scene — the one motion it needs" and
  "let one thing move at a time, leave a hold after each move" (they push a film into one block per scene — film U,
  plan/56 §56.9); port by moving the numbers into DOM/SVG/kit elements, not a `<canvas>` (point-and-ask needs real
  elements); check with `wamotion shot check --all`; troubleshooting points at `data/`.

Update: copy the same files from a newer commit, re-apply the changes above, run
`pnpm --filter @workspace/video-styles gen`.
