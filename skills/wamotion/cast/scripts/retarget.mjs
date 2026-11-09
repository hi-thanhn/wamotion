// Retarget Quaternius Universal Animation Library clips (CC0; Rigify DEF-* rig, T-pose bind, +Z facing, Y up)
// onto the VRM humanoid. Runs once per clip; the output JSON is what src/clip.ts turns into a three.js
// AnimationClip for whichever VRM is loaded.
//
// Method: both rigs rest in a T-pose and three-vrm's *normalized* humanoid has identity world rotation at rest,
// so for every mapped bone we store its WORLD-space rotation delta from rest, D(t) = Rw(t) * inv(Rw_rest),
// sampled at 30 fps, plus the hips world position. src/clip.ts turns the world deltas into local rotations
// against the VRM's own parent chain (optional bones like upperChest or toes may be missing) and scales the
// hips path by the VRM's hips height. VRM 0.x models get the 180° Y flip, like VRMA does.
//
// Usage:
//   node <skill>/cast/scripts/retarget.mjs --list                       # names of the 46 clips in the source library
//   node <skill>/cast/scripts/retarget.mjs Wave_Loop Jump --out public/clips   # write <dir>/<name>.clip.json
// Run from a project folder where `three` is installed (the Remotion project).
// The source glTF (4 MB) is downloaded once into scripts/ual-source/ (git-ignored).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readGltf } from "./gltf-read.mjs";

// `three` comes from the Remotion project this is run from (any version); the script itself installs nothing.
const THREE = await (async () => {
  try {
    // import.meta.resolve is relative to this file, so walk from the project folder by hand
    const dir = [process.cwd(), ...process.cwd().split(path.sep).map((_, i, a) => a.slice(0, a.length - i).join(path.sep))]
      .map((d) => path.join(d, "node_modules/three/build/three.module.js")).find((f) => fs.existsSync(f));
    if (!dir) throw new Error("no three");
    return await import(pathToFileURL(dir).href);
  } catch {
    console.error("retarget.mjs: run this from a project folder that has `three` installed (npm i three)");
    process.exit(2);
  }
})();

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(here, "ual-source");
const SRC = path.join(SRC_DIR, "AnimationLibrary_Godot_Standard.gltf");
const FPS = 30;
const BASE = "https://raw.githubusercontent.com/J-Ponzo/gltf-universal-animation-library/main/glTF/";

const BONE_MAP = {
  "DEF-hips": "hips", "DEF-spine.001": "spine", "DEF-spine.002": "chest", "DEF-spine.003": "upperChest",
  "DEF-neck": "neck", "DEF-head": "head",
  "DEF-shoulder.L": "leftShoulder", "DEF-upper_arm.L": "leftUpperArm", "DEF-forearm.L": "leftLowerArm", "DEF-hand.L": "leftHand",
  "DEF-shoulder.R": "rightShoulder", "DEF-upper_arm.R": "rightUpperArm", "DEF-forearm.R": "rightLowerArm", "DEF-hand.R": "rightHand",
  "DEF-thigh.L": "leftUpperLeg", "DEF-shin.L": "leftLowerLeg", "DEF-foot.L": "leftFoot", "DEF-toe.L": "leftToes",
  "DEF-thigh.R": "rightUpperLeg", "DEF-shin.R": "rightLowerLeg", "DEF-foot.R": "rightFoot", "DEF-toe.R": "rightToes",
  "DEF-thumb.01.L": "leftThumbMetacarpal", "DEF-thumb.02.L": "leftThumbProximal", "DEF-thumb.03.L": "leftThumbDistal",
  "DEF-f_index.01.L": "leftIndexProximal", "DEF-f_index.02.L": "leftIndexIntermediate", "DEF-f_index.03.L": "leftIndexDistal",
  "DEF-f_middle.01.L": "leftMiddleProximal", "DEF-f_middle.02.L": "leftMiddleIntermediate", "DEF-f_middle.03.L": "leftMiddleDistal",
  "DEF-f_ring.01.L": "leftRingProximal", "DEF-f_ring.02.L": "leftRingIntermediate", "DEF-f_ring.03.L": "leftRingDistal",
  "DEF-f_pinky.01.L": "leftLittleProximal", "DEF-f_pinky.02.L": "leftLittleIntermediate", "DEF-f_pinky.03.L": "leftLittleDistal",
  "DEF-thumb.01.R": "rightThumbMetacarpal", "DEF-thumb.02.R": "rightThumbProximal", "DEF-thumb.03.R": "rightThumbDistal",
  "DEF-f_index.01.R": "rightIndexProximal", "DEF-f_index.02.R": "rightIndexIntermediate", "DEF-f_index.03.R": "rightIndexDistal",
  "DEF-f_middle.01.R": "rightMiddleProximal", "DEF-f_middle.02.R": "rightMiddleIntermediate", "DEF-f_middle.03.R": "rightMiddleDistal",
  "DEF-f_ring.01.R": "rightRingProximal", "DEF-f_ring.02.R": "rightRingIntermediate", "DEF-f_ring.03.R": "rightRingDistal",
  "DEF-f_pinky.01.R": "rightLittleProximal", "DEF-f_pinky.02.R": "rightLittleIntermediate", "DEF-f_pinky.03.R": "rightLittleDistal",
};

async function ensureSource() {
  fs.mkdirSync(SRC_DIR, { recursive: true });
  for (const f of ["AnimationLibrary_Godot_Standard.gltf", "AnimationLibrary_Godot_Standard.bin"]) {
    const p = path.join(SRC_DIR, f);
    if (fs.existsSync(p)) continue;
    console.log("downloading", BASE + f);
    const r = await fetch(BASE + f);
    if (!r.ok) throw new Error(`${r.status} ${f}`);
    fs.writeFileSync(p, Buffer.from(await r.arrayBuffer()));
  }
}

function buildRig(json) {
  const objs = json.nodes.map((n) => {
    const o = new THREE.Object3D();
    o.name = n.name;
    if (n.translation) o.position.fromArray(n.translation);
    if (n.rotation) o.quaternion.fromArray(n.rotation);
    if (n.scale) o.scale.fromArray(n.scale);
    return o;
  });
  json.nodes.forEach((n, i) => (n.children || []).forEach((c) => objs[i].add(objs[c])));
  const root = new THREE.Object3D();
  json.scenes[0].nodes.forEach((i) => root.add(objs[i]));
  root.updateMatrixWorld(true);
  return { objs, root };
}

const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _va = new THREE.Vector3(), _vb = new THREE.Vector3();

function makeSampler(json, accessor, anim) {
  const channels = anim.channels.map((ch) => {
    const s = anim.samplers[ch.sampler];
    return { node: ch.target.node, path: ch.target.path, interp: s.interpolation ?? "LINEAR", t: accessor(s.input), v: accessor(s.output) };
  });
  const duration = Math.max(...channels.map((c) => c.t.data[c.t.count - 1]));
  return {
    duration,
    apply(objs, time) {
      for (const c of channels) {
        const times = c.t.data, n = c.t.count, size = c.v.size;
        let k = 0;
        while (k < n - 1 && times[k + 1] <= time) k++;
        const k1 = Math.min(k + 1, n - 1);
        const a = (k1 === k || c.interp === "STEP") ? 0 : (time - times[k]) / (times[k1] - times[k]);
        const f = THREE.MathUtils.clamp(a, 0, 1);
        const o = objs[c.node];
        const v = c.v.data;
        if (c.path === "rotation") {
          _qa.fromArray(v, k * 4); _qb.fromArray(v, k1 * 4);
          o.quaternion.copy(_qa).slerp(_qb, f);
        } else {
          _va.fromArray(v, k * size); _vb.fromArray(v, k1 * size);
          _va.lerp(_vb, f);
          if (c.path === "translation") o.position.copy(_va); else if (c.path === "scale") o.scale.copy(_va);
        }
      }
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const OUT_DIR = outIdx >= 0 ? path.resolve(args[outIdx + 1]) : path.join(here, "../clips");
  const names = args.filter((a, i) => a !== "--out" && a !== "--list" && i !== outIdx + 1);
  await ensureSource();
  const { json, accessor } = readGltf(SRC);
  if (args.includes("--list") || names.length === 0) {
    for (const a of json.animations) console.log(`${a.name}`);
    if (names.length === 0) return;
  }
  const { objs, root } = buildRig(json);
  const byName = new Map(objs.map((o) => [o.name, o]));
  const restWorld = new Map();
  for (const src of Object.keys(BONE_MAP)) {
    const o = byName.get(src);
    if (!o) throw new Error(`missing source bone ${src}`);
    restWorld.set(src, o.getWorldQuaternion(new THREE.Quaternion()));
  }
  const restHips = byName.get("DEF-hips").getWorldPosition(new THREE.Vector3());
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const name of names) {
    const anim = json.animations.find((a) => a.name === name);
    if (!anim) throw new Error(`clip ${name} not in source; run with --list to see the names`);
    const sampler = makeSampler(json, accessor, anim);
    const frames = Math.max(1, Math.round(sampler.duration * FPS));
    const bones = {};
    for (const vrmName of Object.values(BONE_MAP)) bones[vrmName] = new Array(frames * 4);
    const hips = new Array(frames * 3);
    for (let k = 0; k < frames; k++) {
      sampler.apply(objs, k / FPS);
      root.updateMatrixWorld(true);
      for (const [src, dst] of Object.entries(BONE_MAP)) {
        const o = byName.get(src);
        o.getWorldQuaternion(_qa);
        _qb.copy(restWorld.get(src)).invert();
        _qa.multiply(_qb);
        _qa.normalize();
        _qa.toArray(bones[dst], k * 4);
      }
      byName.get("DEF-hips").getWorldPosition(_va).toArray(hips, k * 3);
    }
    const round = (arr) => arr.map((x) => Math.round(x * 1e5) / 1e5);
    const out = {
      name, fps: FPS, frames, duration: frames / FPS, loop: /_Loop$/.test(name),
      space: "world-delta-from-T-pose, +Z facing, Y up (VRM 1.0 convention)",
      restHipsY: Math.round(restHips.y * 1e5) / 1e5,
      hipsPosition: round(hips),
      bones: Object.fromEntries(Object.entries(bones).map(([k, v]) => [k, round(v)])),
      source: "Quaternius Universal Animation Library (CC0) via github.com/J-Ponzo/gltf-universal-animation-library",
    };
    const file = path.join(OUT_DIR, `${name}.clip.json`);
    fs.writeFileSync(file, JSON.stringify(out));
    console.log(`${name}: ${frames} frames (${out.duration.toFixed(3)} s), ${Object.keys(bones).length} bones → ${path.relative(process.cwd(), file)} ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
