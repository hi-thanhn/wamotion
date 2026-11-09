# Character kit: a 3D character in a real-lit scene, inside Remotion

`<skill>/cast/` is material for putting a 3D character and a real-lit 3D set into a Remotion film:
one CC0 VRM character, eleven CC0 body-motion clips already retargeted to the VRM skeleton, a
lipsync script, three CC0 HDRIs, four CC0 PBR texture sets, and eight small TypeScript modules
that make all of it render from `useCurrentFrame()` (same pixels for a frame on any render worker).
Nothing here is required and nothing decides how the film looks; use any piece on its own. Every
asset has its licence file next to it.

## Install

```bash
npm i three@0.180.0 @pixiv/three-vrm@3.5.5 @react-three/fiber@9.8.2 @remotion/three@<your remotion version> postprocessing@6.39.6 @react-three/drei@10.7.9
npm i -D @types/three@0.180.0
cp -R <skill>/cast/src src/cast                 # the modules (they import three, three-vrm, fiber, remotion, postprocessing)
mkdir -p public/cast && cp -R <skill>/cast/models <skill>/cast/clips <skill>/cast/env public/cast/
```

`@react-three/drei` is only needed for `<ContactShadows>` and the like. Render and stills need
`--gl=angle` (`npx remotion render … --gl=angle`); without it Remotion's default renderer draws
WebGL blank. On a Linux box without a GPU use `--gl=swangle` (SwiftShader), about 7–8× slower.
A `<ThreeCanvas>` is one HTML layer: HTML/CSS type, SVG and motion graphics go in sibling layers
above or below it in the same `<AbsoluteFill>`.

## What is in `cast/`

| Path | What | Size |
|---|---|---|
| `models/base-female/Base_Female.vrm` | VRoid Studio *Base_Female*, VRM 0.x, CC0 (licence in the file's meta and `LICENSE.md`). Short blue hair, school uniform, MToon materials with outline, 5 mouth shapes (`aa ih ou ee oh`), `blink`, `happy sad angry surprised relaxed`, eye look-at, 8 spring-bone joints (bust, skirt). | 16.3 MB |
| `clips/*.clip.json` | Quaternius Universal Animation Library (CC0) clips retargeted to the VRM humanoid, 30 fps: `Walk_Loop` `Walk_Formal_Loop` `Idle_Loop` `Idle_Talking_Loop` `Sitting_Enter` `Sitting_Idle_Loop` `Sitting_Talking_Loop` `Interact` (reach out, 2 s) `PickUp_Table` (0.8 s) `Dance_Loop` (1 s). `_Loop` clips loop; the others hold their last frame. | 44–152 KB each |
| `env/hdri/*.hdr` | Poly Haven HDRIs at 1k, equirectangular: `lebombo` (a room with a big window, warm side light), `studio_small_09` (soft neutral studio), `kloofendal_48d_partly_cloudy_puresky` (low sun, sky only). `env/hdri/LICENSE.md` has the URLs; 2k–16k follow the same pattern. | 1.4–1.6 MB each |
| `env/textures/<id>/` | Poly Haven PBR sets at 1k, three JPGs each (`diff`, `nor_gl`, `arm` = AO/roughness/metalness): `wood_table_001` (varnished table top), `concrete_wall_008` (smooth poured concrete), `denim_fabric` (blue weave), `metal_plate` (brushed scratched steel). | 0.5–2.5 MB per set |
| `src/` | The modules below. | 36 KB |
| `scripts/retarget.mjs` | Bakes any of the 46 Quaternius clips onto the VRM skeleton (see "Adding a clip"). | |
| `scripts/lipsync.sh` | A spoken line → wav + Rhubarb mouth cues (see "Making the character speak"). | |

## The modules (`src/cast`)

All of it is driven by the Remotion frame: no `useFrame` deltas, no wall clock, spring bones
replayed from frame 0 each frame, grain seeded by the frame number. `index.ts` re-exports everything.

**`loadVrm(url)`, `loadClip(url)`, `loadRhubarb(url)`, `loadHdri(url)`, `loadPbr(dir, id, {repeat})`** —
promises for the assets. `loadVrm` turns a VRM 0.x model to face +Z, combines skeletons and
switches frustum culling off on the skinned meshes. `loadPbr` returns `{ map, normalMap,
roughnessMap, metalnessMap, aoMap }` with sRGB on the colour map and tiling set, ready to spread
into `<meshStandardMaterial {...maps} />`.

**`useLoaded(() => Promise<T>)`** — loads before the canvas mounts (Remotion waits via
`delayRender`, 3 min timeout) and returns `null` until then. Mounting the canvas first and
loading inside it draws frame 0 before the character exists.

**`<CastCanvas width height toneMapping="aces"|"none" exposure dpr>`** — `@remotion/three`'s
`<ThreeCanvas>` set up for a fixed-frame render: one draw per frame, no MSAA, sRGB out, ACES tone
mapping by default (suits HDRI + PBR; `"none"` keeps MToon colours exactly as authored).

**`<Hdri map background backgroundBlur intensity rotationY>`** — image-based lighting from a loaded
HDRI (`scene.environment`), optionally shown as the background (a colour string shows that
instead). It lights `meshStandardMaterial` / `meshPhysicalMaterial`. **MToon does not read the
environment**: the VRM takes its light from `<directionalLight>`, `<hemisphereLight>`,
`<ambientLight>`, so the character wants its own lights next to the HDRI. drei's
`<Environment map={hdri} />` does the same thing (pass the loaded texture as `map`, not `files`,
so it does not suspend); drei's `<ContactShadows>` works as-is under the character
(`<ContactShadows position={[0,0.001,0]} opacity={0.7} scale={8} blur={2} far={2} />`) and is
deterministic.

**`<Character vrm actions position rotationY eyesOnCamera headToCamera mouth blinks expressions springBones>`**
— one posed character. `actions` is a list of `{ clip, weight: (t) => number, timeScale?, startAt? }`
(t in film seconds): weights blend clips, e.g. walk → talk is `weight: (t) => 1 - smoothstep(t,
2.6, 3.4)` on the walk and the complement on the talk; `startAt` is the film time a one-shot clip
begins. `position(t)` / `rotationY(t)` are metres and radians (0 = facing +Z, toward a camera on
the +Z side); `headToCamera` (0–1, or a function of t) turns the head toward the camera on top of
the clip; `mouth={{ cues, startAt }}` drives the five mouth shapes from Rhubarb cues; `blinks` is a
list of seconds (default one every ~3 s); `expressions={(t) => ({ happy: 0.3 })}` sets any VRM
expression. The clip list is read once at mount.

**`boneWorldPosition(vrm, "head")`** — where a bone is right now (a camera target, a DoF focus).

**`<Post focus focusRange bokehScale grain vignette bloom smaa>`** — pmndrs `postprocessing` on the
canvas: SMAA, depth of field (`focus` = a VRM → its head, an Object3D, a Vector3 or `[x,y,z]`;
`focusRange` and the DoF distances are **metres** in postprocessing ≥ 6.36), optional bloom,
vignette, seeded grain. Put it last inside the canvas; it takes over rendering (priority 1) and
renders with `deltaTime 0` so nothing drifts. `bokehScale={0}` turns the DoF off.

**`clip.ts`, `visemes.ts`, `GrainEffect.ts`** — the pieces under the hood: `buildClip(data, vrm)`
turns a clip JSON into a three.js `AnimationClip` for whichever VRM is loaded (so another VRM
plays the same clips); `mouthAt(cues, t)` / `blinkAt(t, times)` are pure functions; `GrainEffect`
is grain with a `seed` uniform.

A film that uses all of it, in outline:

```tsx
const assets = useLoaded(async () => ({
  vrm: await loadVrm(staticFile("cast/models/base-female/Base_Female.vrm")),
  walk: await loadClip(staticFile("cast/clips/Walk_Loop.clip.json")),
  talk: await loadClip(staticFile("cast/clips/Idle_Talking_Loop.clip.json")),
  cues: await loadRhubarb(staticFile("voice/line.rhubarb.json")),
  hdri: await loadHdri(staticFile("cast/env/hdri/lebombo_1k.hdr")),
  wood: await loadPbr(staticFile("cast/env/textures"), "wood_table_001", { repeat: 6 }),
}));
if (!assets) return null;
return (
  <AbsoluteFill>
    <CastCanvas width={1920} height={1080}>
      <CameraRig />                                   {/* your own: set camera.position / lookAt from useCurrentFrame() in useFrame */}
      <Hdri map={assets.hdri} background backgroundBlur={0.4} />
      <directionalLight position={[2.5, 4, 3]} intensity={2.4} color="#fff0dc" />
      <hemisphereLight args={["#dde6ff", "#5a4a40", 1]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[12, 12]} /><meshStandardMaterial {...assets.wood} /></mesh>
      <Character vrm={assets.vrm} actions={[{ clip: assets.walk, weight: walkW }, { clip: assets.talk, weight: (t) => 1 - walkW(t) }]}
        position={(t) => [0, 0, -2.2 + walked(t)]} mouth={{ cues: assets.cues, startAt: 3 }} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.7} scale={8} blur={2} far={2} />
      <Post focus={assets.vrm} focusRange={1.2} bokehScale={3} grain={0.03} vignette={0.45} />
    </CastCanvas>
    <div style={{ position: "absolute", left: 120, bottom: 110, fontSize: 72 }}>type over the picture</div>
  </AbsoluteFill>
);
```

## Measured (Apple M5, 16 GB, Remotion 4.0.541, `--gl=angle`, 1920×1080 at 30 fps)

| Job | Time |
|---|---|
| One still of the scene above (bundle + browser + load 16 MB VRM, HDRI, 3 texture sets) | 7–8 s |
| 300 frames (10 s) of that scene, Remotion's default concurrency, bundle and browser included | **19.7 s** (0.066 s per frame) |
| Peak memory, node + every headless-shell tab | 0.96 GB for the node process; the prototype measured 2.8 GB with every headless-shell tab counted |
| Same frame rendered twice in separate processes | identical PNG (md5) |
| The prototype this came from (character only, toon floor, no HDRI/PBR): 300 frames | 21.5 s ANGLE · ≈165 s SwiftShader (`--gl=swangle`) · 2.8 / 3.7 GB |
| `lipsync.sh` on a 7 s line (Rhubarb in Docker, after the one-time 160 MB download) | about 10 s |
| `retarget.mjs` for one clip (after the one-time 4 MB download) | under 1 s |

The VRM is copied into the bundle on every render (16 MB); the spring-bone replay costs
`frame × 1/fps` tiny steps per frame, so frame 600 of a 20 s film does 600 steps (still cheap).

## Making the character speak

```bash
bash <skill>/cast/scripts/lipsync.sh "Chiều nay ghé Hẻm 12 nhé" --out public/voice/line   # → line.wav + line.rhubarb.json
bash <skill>/cast/scripts/lipsync.sh --wav recording.wav --out public/voice/line          # a recorded or ElevenLabs line
```

Text goes through macOS `say` (voice `Linh` is Apple's Vietnamese voice; `--voice`, `--rate`);
the wav then goes through Rhubarb Lip Sync (MIT, English acoustic model, run in Docker on a Mac
because its macOS build crashes on Apple silicon). Play the wav with `<Audio>` at the same
`startAt` you give `mouth`. **On Vietnamese the mouth shapes are acoustic guesses**: they open and
close with the voice and read as speech, they are not the right vowel per syllable. A fully
mapped Vietnamese lipsync would need a Vietnamese phoneme model, which Rhubarb does not have.
`say` is a system voice, not a performance; ElevenLabs or a recording through `--wav` reads
warmer (ElevenLabs is the user's own key).

## Adding a clip, a VRM, a texture, an HDRI

- **Another body clip**: `node <skill>/cast/scripts/retarget.mjs --list` prints the 46 names in the
  Quaternius library (idle, walk, jog, sprint, sit, dance, jump, punch, sword, pistol, spell, swim,
  drive, hits, death, pick up, interact, push, roll, crouch…); `node <skill>/cast/scripts/retarget.mjs
  Jog_Fwd_Loop Jump_Start --out public/cast/clips` writes them. Run it from a folder with `three`
  installed. Clips from Mixamo or other FBX sources would need their own bone map; the script's
  `BONE_MAP` shows the shape.
- **Another VRM**: any `.vrm` (0.x or 1.0) loads with `loadVrm` and plays the same clips, since
  `buildClip` resolves bones against the loaded model's humanoid. CC0 VRoid sources: the VRoid Studio
  base models and `AvatarSample_1–4` (the VRoid FAQ lists which are CC0; `AvatarSample_E/F` are not).
  A model made in VRoid Studio by the user is theirs to use. The five mouth shapes, blink and
  look-at come with every VRoid export; long hair adds spring bones that the replay already handles.
- **Faces from text-to-3D or photo-to-3D** (a generated mesh, a scanned head) have no humanoid
  skeleton, no mouth shapes and no eye bones: they can stand in a scene but cannot walk, talk or
  look at the camera with these modules. Only a rigged humanoid with blend shapes does that; VRM is
  the format where all of it is already named.
- **Another PBR set**: Poly Haven's URL pattern is in `env/textures/LICENSE.md`; `loadPbr` wants
  the three files named `<id>_diff_<res>.jpg`, `<id>_nor_gl_<res>.jpg`, `<id>_arm_<res>.jpg` in a
  folder `<id>/`. AmbientCG sets (also CC0) come as `Color`, `NormalGL`, `Roughness`, `AmbientOcclusion`
  and need their own `TextureLoader` lines or a rename.
- **Another HDRI**: any equirectangular `.hdr` through `loadHdri`; 1k is enough for lighting and a
  blurred background, 2k+ when the HDRI is seen sharp.

## What it cannot do (yet)

- Vietnamese visemes are rough (above). Facial expressions are the five VRoid presets at
  whatever weight you set; there is no capture, no emotion from the voice.
- MToon is a toon shader: the character reads as clean stylised anime, not as a photoreal
  human, and it ignores the HDRI. The set around it can be as real as the textures and the
  light; the two looks sit in one frame.
- No cloth or hair physics beyond the VRM's own spring bones; no inverse kinematics (a hand
  does not reach a cup by itself; `Interact` and `PickUp_Table` are canned reaches).
- Clips are blended, not edited: foot sliding appears when a walk is blended with a stand
  while the character still moves; stop the translation as the walk weight fades (integrate the
  weight, as `walked(t)` does above).
- Everything is rendered in Chrome's WebGL through ANGLE: one 1080p frame is about 0.07 s on
  this Mac with the GPU, 0.5 s on SwiftShader; a 60 s film with the character is minutes, not
  hours, with a GPU, and 15–30 min without one.
