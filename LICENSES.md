# Licences

The code in this repository (scripts, the ears server, the character-kit modules, the texts written here) is
MIT, see [LICENSE](LICENSE). The material bundled with the skill comes from other people under their own
licences. Every asset has its licence or attribution file next to it; this page only points at them.

| What | Where | Licence | Source |
|---|---|---|---|
| 89 sound recordings and 14 music tracks | `skills/wamotion/bank/` | CC0 1.0 | Kenney (kenney.nl), Freesound, OpenGameArt — every file is listed with its author and URL in [`bank/ATTRIBUTION.md`](skills/wamotion/bank/ATTRIBUTION.md) |
| 252 `es-…` sound effects | `skills/wamotion/bank/sfx/` | MIT | rendered from the bank recipes of [earshot](https://github.com/Leonxlnx/earshot) by Leon Lin, commit `591fa3e`; MIT text in [`references/sound-design/LICENSE.md`](skills/wamotion/references/sound-design/LICENSE.md). The `es-fit-…` ones were fitted from CC0 Freesound recordings listed in [`CREDITS_FIT.md`](skills/wamotion/references/sound-design/CREDITS_FIT.md) |
| `Base_Female.vrm` | `skills/wamotion/cast/models/base-female/` | CC0 1.0 | VRoid Studio base model (VRoid Project, pixiv Inc.); [`LICENSE.md`](skills/wamotion/cast/models/base-female/LICENSE.md) |
| 11 body-motion clips | `skills/wamotion/cast/clips/` | CC0 1.0 | Quaternius, Universal Animation Library; [`SOURCE.md`](skills/wamotion/cast/clips/SOURCE.md), [licence text](skills/wamotion/cast/clips/LICENSE-CC0-universal-animation-library.txt) |
| 3 HDRIs | `skills/wamotion/cast/env/hdri/` | CC0 1.0 | Poly Haven; [`LICENSE.md`](skills/wamotion/cast/env/hdri/LICENSE.md) |
| 4 PBR texture sets | `skills/wamotion/cast/env/textures/` | CC0 1.0 | Poly Haven; [`LICENSE.md`](skills/wamotion/cast/env/textures/LICENSE.md) |
| Rhubarb Lip Sync (downloaded by `lipsync.sh`, not bundled) | `skills/wamotion/cast/scripts/rhubarb/` | MIT | Daniel Wolf; [`LICENSE.md`](skills/wamotion/cast/scripts/rhubarb/LICENSE.md), [`SOURCE.md`](skills/wamotion/cast/scripts/rhubarb/SOURCE.md) |
| motion-prompt (named motion moves, catalog data, script) | `skills/wamotion/references/motion-prompt/` | MIT | Shohei Ohtaki; [`LICENSE`](skills/wamotion/references/motion-prompt/LICENSE), [`THIRD-PARTY-NOTICES.md`](skills/wamotion/references/motion-prompt/THIRD-PARTY-NOTICES.md), changes in [`VENDORED.md`](skills/wamotion/references/motion-prompt/VENDORED.md) |
| sound-design reference (`launch-video-sound.md`, `kit.md`, `CREDITS_FIT.md`) | `skills/wamotion/references/sound-design/` | MIT | earshot docs by Leon Lin; [`NOTICE.md`](skills/wamotion/references/sound-design/NOTICE.md). `SKILL.md` and `bank.md` there are ours (MIT) |
| vector-art reference, review, character and ears notes, `SKILL.md` | `skills/wamotion/references/`, `skills/wamotion/SKILL.md` | MIT | written for this repository |
| earshot itself (installed by the user or by `ears/Dockerfile`, not bundled) | — | MIT | https://github.com/Leonxlnx/earshot |
| Example films | `examples/` | CC BY 4.0 | made with the skill for this repository; posters and GIFs likewise |

Not bundled on purpose: Remotion's own agent skills (`remotion-markup` and the rest) are under the
[Remotion License](https://www.remotion.dev/license) and install with `npx skills add remotion-dev/skills`.
Remotion the library has the same licence: free for individuals and companies of up to three people, a company
licence otherwise.
