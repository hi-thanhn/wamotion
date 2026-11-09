import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VRM } from "@pixiv/three-vrm";
import { buildClip, type ClipData } from "./clip";
import { blinkAt, mouthAt, type RhubarbFile } from "./visemes";

export type CharacterAction = {
  clip: ClipData;
  /** blend weight at film time t (seconds); weights of all actions are used as given, not normalised */
  weight: (t: number) => number;
  /** playback speed, default 1 */
  timeScale?: number;
  /** film time (s) at which this clip is at its frame 0, default 0 */
  startAt?: number;
};

export type CharacterProps = {
  vrm: VRM;
  actions: CharacterAction[];
  /** where the character stands at film time t, metres; default [0,0,0] */
  position?: (t: number) => [number, number, number];
  /** heading in radians at film time t (0 = facing +Z, toward a camera on +Z); default 0 */
  rotationY?: (t: number) => number;
  /** eyes track the camera (VRM lookAt); default true */
  eyesOnCamera?: boolean;
  /** how far the head turns toward the camera on top of the clip, 0–1; default 0.4 */
  headToCamera?: number | ((t: number) => number);
  /** Rhubarb cues + the film time (s) the voice line starts; mouth shapes follow */
  mouth?: { cues: RhubarbFile; startAt: number };
  /** film times (s) of blinks; default one every ~3 s */
  blinks?: number[];
  /** VRM expression weights at film time t, e.g. { happy: 0.3 }; names: vrm.expressionManager.expressions */
  expressions?: (t: number) => Record<string, number>;
  /**
   * Spring bones (hair, skirt, bust) are a simulation with state. For the same pixels from any render worker the
   * simulation is replayed from frame 0 every frame with a fixed 1/fps step (cheap: a 20 s film is 600 steps at
   * most). Set false to skip them entirely (they then stay at rest).
   */
  springBones?: boolean;
};

const _v = new THREE.Vector3();
const _camLocal = new THREE.Vector3();
const _headLocal = new THREE.Vector3();
const _e = new THREE.Euler();
const _q = new THREE.Quaternion();
const defaultBlinks = (seconds: number) => Array.from({ length: Math.ceil(seconds / 3) }, (_, i) => 0.9 + i * 3.1);

/**
 * One VRM character posed entirely from the current Remotion frame: clip blend, position/heading, eyes and
 * head toward the camera, mouth from Rhubarb cues, blinks, expressions, spring bones. Nothing in it advances
 * with wall-clock time, so a frame renders the same on any worker. Runs in useFrame at priority 0, before
 * <Post> (priority 1) renders the frame.
 */
export const Character: React.FC<CharacterProps> = ({
  vrm,
  actions,
  position,
  rotationY,
  eyesOnCamera = true,
  headToCamera = 0.4,
  mouth,
  blinks,
  expressions,
  springBones = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const frameRef = useRef(frame);
  frameRef.current = frame;
  const { camera } = useThree();
  const blinkTimes = useMemo(() => blinks ?? defaultBlinks(durationInFrames / fps), [blinks, durationInFrames, fps]);
  // loadVrm() turns a VRM 0.x model 180° so it faces +Z; keep that under whatever heading the film asks for
  const baseYaw = useMemo(() => vrm.scene.rotation.y, [vrm]);

  const rig = useMemo(() => {
    const mixer = new THREE.AnimationMixer(vrm.humanoid.normalizedHumanBonesRoot);
    const list = actions.map((a) => {
      const action = mixer.clipAction(buildClip(a.clip, vrm));
      action.setLoop(a.clip.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      action.clampWhenFinished = true;
      action.enabled = true;
      action.play();
      return { ...a, action };
    });
    return { mixer, list };
    // the clip list is treated as fixed for the life of the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vrm]);

  useLayoutEffect(() => {
    if (vrm.lookAt) vrm.lookAt.target = eyesOnCamera ? camera : null;
  }, [vrm, camera, eyesOnCamera]);

  /** Body pose at frame k (used for the replay, then for the frame itself). Pure in k: no mixer clock. */
  const pose = (k: number) => {
    const t = k / fps;
    rig.mixer.setTime(0); // resets every action's time
    for (const a of rig.list) {
      a.action.setEffectiveWeight(a.weight(t));
      const d = a.clip.duration;
      const local = Math.max(0, t - (a.startAt ?? 0)) * (a.timeScale ?? 1);
      a.action.time = a.clip.loop ? local % d : Math.min(local, Math.max(0, d - 1 / a.clip.fps));
    }
    rig.mixer.update(0); // deltaTime 0 evaluates the clips at the times just set
    const p = position ? position(t) : [0, 0, 0];
    vrm.scene.position.set(p[0], p[1], p[2]);
    vrm.scene.rotation.set(0, baseYaw + (rotationY ? rotationY(t) : 0), 0);
    const head = vrm.humanoid.getNormalizedBoneNode("head");
    const gain = typeof headToCamera === "function" ? headToCamera(t) : headToCamera;
    if (head && vrm.lookAt && gain > 0) {
      vrm.scene.updateMatrixWorld(true);
      const root = vrm.humanoid.normalizedHumanBonesRoot;
      _camLocal.copy(camera.position);
      root.worldToLocal(_camLocal);
      head.getWorldPosition(_headLocal);
      root.worldToLocal(_headLocal);
      _v.subVectors(_camLocal, _headLocal).normalize();
      const fz = vrm.lookAt.faceFront.z; // +1 for VRM 1.0, -1 for VRM 0.x
      const yaw = Math.atan2(fz * _v.x, fz * _v.z);
      const pitch = Math.atan2(_v.y, Math.hypot(_v.x, _v.z));
      _e.set(THREE.MathUtils.clamp(-fz * pitch * gain, -0.35, 0.35), THREE.MathUtils.clamp(yaw * gain, -0.6, 0.6), 0, "YXZ");
      head.quaternion.multiply(_q.setFromEuler(_e));
    }
    vrm.humanoid.update();
  };

  useFrame(() => {
    const f = frameRef.current;
    const t = f / fps;
    camera.updateMatrixWorld();
    if (springBones && vrm.springBoneManager) {
      vrm.springBoneManager.reset();
      for (let k = 0; k <= f; k++) {
        pose(k);
        vrm.springBoneManager.update(1 / fps);
      }
    } else {
      pose(f);
    }
    const em = vrm.expressionManager;
    if (em) {
      const m = mouth ? mouthAt(mouth.cues, t - mouth.startAt) : {};
      em.setValue("aa", m.aa ?? 0);
      em.setValue("ih", m.ih ?? 0);
      em.setValue("ou", m.ou ?? 0);
      em.setValue("ee", m.ee ?? 0);
      em.setValue("oh", m.oh ?? 0);
      em.setValue("blink", blinkAt(t, blinkTimes));
      if (expressions) for (const [name, w] of Object.entries(expressions(t))) em.setValue(name, w);
      em.update();
    }
    vrm.lookAt?.update(1 / fps);
    vrm.scene.updateMatrixWorld(true);
  }, 0);

  return <primitive object={vrm.scene} />;
};

/** World position of a humanoid bone right now (for a DoF focus or a camera target). */
export function boneWorldPosition(vrm: VRM, bone: Parameters<VRM["humanoid"]["getNormalizedBoneNode"]>[0] = "head", out = new THREE.Vector3()) {
  const node = vrm.humanoid.getNormalizedBoneNode(bone);
  return node ? node.getWorldPosition(out) : out.set(0, 0, 0);
}
