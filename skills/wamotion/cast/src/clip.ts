import * as THREE from "three";
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";

/** Output of cast/scripts/retarget.mjs: world-space rotation deltas from the T-pose, sampled per frame. */
export type ClipData = {
  name: string;
  fps: number;
  frames: number;
  duration: number;
  loop: boolean;
  restHipsY: number;
  hipsPosition: number[]; // xyz per frame, source rig world space
  bones: Record<string, number[]>; // xyzw per frame
};

const _q = new THREE.Quaternion();
const _p = new THREE.Quaternion();

/**
 * Turns the world-delta clip into a three.js AnimationClip for THIS vrm's normalized humanoid:
 * local = inv(delta(parent)) * delta(bone), parent = nearest humanoid ancestor the model actually has.
 * VRM 0.x gets the 180° Y conjugation (x, z negated) the same way @pixiv/three-vrm-animation does.
 */
export function buildClip(data: ClipData, vrm: VRM): THREE.AnimationClip {
  const humanoid = vrm.humanoid;
  const v0 = vrm.meta.metaVersion === "0";
  const nodeToName = new Map<THREE.Object3D, VRMHumanBoneName>();
  for (const [name, bone] of Object.entries(humanoid.normalizedHumanBones)) {
    if (bone?.node) nodeToName.set(bone.node, name as VRMHumanBoneName);
  }
  const parentName = (name: VRMHumanBoneName): VRMHumanBoneName | null => {
    let n: THREE.Object3D | null = humanoid.getNormalizedBoneNode(name)?.parent ?? null;
    while (n) {
      const found = nodeToName.get(n);
      if (found) return found;
      n = n.parent;
    }
    return null;
  };
  const times = new Float32Array(data.frames);
  for (let k = 0; k < data.frames; k++) times[k] = k / data.fps;
  const tracks: THREE.KeyframeTrack[] = [];
  for (const [name, world] of Object.entries(data.bones)) {
    const node = humanoid.getNormalizedBoneNode(name as VRMHumanBoneName);
    if (!node) continue;
    const parent = parentName(name as VRMHumanBoneName);
    const parentWorld = parent ? data.bones[parent] : null;
    const values = new Float32Array(data.frames * 4);
    for (let k = 0; k < data.frames; k++) {
      _q.fromArray(world, k * 4);
      if (parentWorld) {
        _p.fromArray(parentWorld, k * 4).invert();
        _q.premultiply(_p);
      }
      if (v0) _q.set(-_q.x, _q.y, -_q.z, _q.w);
      _q.toArray(values, k * 4);
    }
    tracks.push(new THREE.QuaternionKeyframeTrack(`${node.name}.quaternion`, times as unknown as number[], values as unknown as number[]));
  }
  const hips = humanoid.getNormalizedBoneNode("hips");
  const hipsRestY = humanoid.normalizedRestPose.hips?.position?.[1] ?? data.restHipsY;
  if (hips) {
    const scale = hipsRestY / data.restHipsY;
    const values = new Float32Array(data.frames * 3);
    for (let k = 0; k < data.frames; k++) {
      const x = data.hipsPosition[k * 3], y = data.hipsPosition[k * 3 + 1], z = data.hipsPosition[k * 3 + 2];
      values[k * 3] = (v0 ? -x : x) * scale;
      values[k * 3 + 1] = y * scale;
      values[k * 3 + 2] = (v0 ? -z : z) * scale;
    }
    tracks.push(new THREE.VectorKeyframeTrack(`${hips.name}.position`, times as unknown as number[], values as unknown as number[]));
  }
  return new THREE.AnimationClip(data.name, data.duration, tracks);
}
