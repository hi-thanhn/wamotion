# Launch posts (drafts for the owner to post)

All numbers come from [docs/blind-tests](blind-tests/README.md). Install line everywhere:
`curl -fsSL https://raw.githubusercontent.com/hi-thanhn/wamotion/main/install.sh | sh`

## Show HN

**Title:** Show HN: Wamotion – a sound bank, tempo meter and 3D character kit for agents that write Remotion videos

**Text:**

I spent two weeks running blind A/B tests of an agent making short videos with Remotion, and the thing that moved the score was never the app or the rules around the agent; it was the material it could reach for. So this is just the material, packaged as an agent skill: an offline bank of 341 CC0/MIT sound effects and 14 music tracks with measured attack times and BPM, a tempo measurer, optional "ears" (earshot) that score a soundtrack, a CC0 VRM character kit with body clips, HDRIs and PBR textures for @remotion/three, and one review round by a subagent that only sees rendered frames. With the same prompt and the same model, the agent with this skill beat the agent without it 5 of 5 on two briefs (design, less AI slop, sound, sync, overall), scored blind by me, so take the number as a signal, not a measurement. Install: `curl -fsSL https://raw.githubusercontent.com/hi-thanhn/wamotion/main/install.sh | sh`, then ask Claude Code or Codex for a video in an empty folder.

## r/remotion

**Title:** I packaged the material that made my agent's Remotion videos better into a skill (sound bank, tempo, 3D character kit) — MIT/CC0

**Body:**

For the past two weeks I have been testing Claude Code making short Remotion videos: showreels, a 30-second ad for a tea shop, a 20-second ad with a 3D character. Every test was the same prompt and the same model, one run with some addition and one without, then I scored the two films blind on five items (design, AI slop, sound quality, sound-to-motion sync, overall).

What did not help: a desktop app around the agent, templates, review checklists, rules about how the film should look. What did help was giving the agent things it could not make itself:

- an offline bank of 341 sound effects (CC0 recordings + earshot's MIT set) and 14 CC0 music tracks, each with a one-line description, `durationSec` and `peakLagSec` (time to the attack, so a hit can be placed on the exact frame), music with LUFS and BPM
- a tempo measurer (`tempo.mjs file.mp3` prints bpm, downbeat, meter, confidence) so cuts land on the grid
- optional ears: earshot scores the soundtrack against professional launch films, describes sounds, draws a timeline; the agent called it on its own and fixed what it reported
- a 3D character kit: a CC0 VRoid VRM that walks and talks, 11 Quaternius clips retargeted to it, 3 Poly Haven HDRIs, 4 PBR sets, and small modules that drive all of it from `useCurrentFrame()` in `@remotion/three`
- one review round: render frames, hand them to a subagent that has not seen the code, fix or reject each finding once

Results, blind, same prompt: skill vs no skill, 5/5 on a 15 s showreel; skill with ears vs skill without ears vs nothing, 5/5 on a 30 s ad. One scorer (me), one film per arm, so a signal, not a benchmark. Films, prompts, vote logs and keys are in the repo.

The skill has no rule about the film: the agent writes a normal Remotion project the way it would alone. Remotion's own skills (`npx skills add remotion-dev/skills`) are a good companion; they are not bundled because of the Remotion licence.

Install (Node ≥ 20, git): `curl -fsSL https://raw.githubusercontent.com/hi-thanhn/wamotion/main/install.sh | sh`, or `npx skills add hi-thanhn/wamotion`.

Repo: https://github.com/hi-thanhn/wamotion

## X thread

**1/4**
I ran blind A/B tests for two weeks on an agent making Remotion videos. Nothing I built around the agent helped. The material it could reach for did: same prompt, same model, 5/5 wins on two briefs. So I open-sourced the material as a skill. https://github.com/hi-thanhn/wamotion

**2/4**
What is in it: 341 sound effects + 14 music tracks (CC0/MIT, offline) with measured attack time and BPM, a tempo meter, optional ears (earshot) that score the soundtrack, a CC0 3D character kit for @remotion/three, one fresh-eyes review round. No rules about how the film should look.

**3/4**
Numbers: 15 s showreel, skill vs bare agent, skill won design / slop / sound / sync / overall. 30 s tea-shop ad, skill with ears beat skill without ears and the bare agent on all five. One scorer (me), one film per arm, so a signal, not a benchmark. Vote logs are in the repo.

**4/4**
Install: curl -fsSL https://raw.githubusercontent.com/hi-thanhn/wamotion/main/install.sh | sh
Then open Claude Code or Codex in an empty folder and ask for a video. Three example films with their prompts are in the README.
