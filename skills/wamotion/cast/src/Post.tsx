import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import { DepthOfFieldEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, VignetteEffect, BloomEffect, BlendFunction } from "postprocessing";
import type { VRM } from "@pixiv/three-vrm";
import { GrainEffect } from "./GrainEffect";
import { boneWorldPosition } from "./Character";

export type PostProps = {
  /** depth of field: what is sharp. A VRM focuses on its head; an Object3D on itself; a Vector3 on that point. */
  focus?: VRM | THREE.Object3D | THREE.Vector3 | [number, number, number];
  /** metres in focus around the focus point (pmndrs postprocessing ≥ 6.36 measures these in metres); default 1.2 */
  focusRange?: number;
  /** blur size, 0 = no DoF; default 3 */
  bokehScale?: number;
  /** film grain amount, 0 = off; default 0.035 (seeded by frame number, so a frame always gets the same grain) */
  grain?: number;
  /** vignette darkness 0–1, 0 = off; default 0.5 */
  vignette?: number;
  /** bloom intensity, 0 = off; default 0 */
  bloom?: number;
  /** anti-aliasing (SMAA); default true */
  smaa?: boolean;
};

/**
 * pmndrs postprocessing on a Remotion <ThreeCanvas>: SMAA, depth of field, optional bloom, vignette, seeded grain.
 * It takes over rendering (useFrame priority 1) and renders with deltaTime 0, so no effect drifts with wall-clock
 * time. Put it last inside the canvas. The renderer's tone mapping and output colour space are applied by the final pass.
 */
export const Post: React.FC<PostProps> = ({ focus, focusRange = 1.2, bokehScale = 3, grain = 0.035, vignette = 0.5, bloom = 0, smaa = true }) => {
  const frame = useCurrentFrame();
  const frameRef = useRef(frame);
  frameRef.current = frame;
  const { gl, scene, camera, size } = useThree();

  const post = useMemo(() => {
    const composer = new EffectComposer(gl, { frameBufferType: THREE.HalfFloatType, multisampling: 0 });
    composer.setSize(size.width, size.height);
    composer.addPass(new RenderPass(scene, camera));
    const effects = [];
    if (smaa) effects.push(new SMAAEffect());
    const dof = bokehScale > 0 ? new DepthOfFieldEffect(camera, { focusDistance: 3, focusRange, bokehScale, resolutionScale: 0.5 }) : null;
    if (dof) effects.push(dof);
    if (bloom > 0) effects.push(new BloomEffect({ intensity: bloom, luminanceThreshold: 0.85, luminanceSmoothing: 0.2, mipmapBlur: true, blendFunction: BlendFunction.ADD }));
    if (vignette > 0) effects.push(new VignetteEffect({ offset: 0.3, darkness: vignette }));
    const grainFx = grain > 0 ? new GrainEffect(grain) : null;
    if (grainFx) effects.push(grainFx);
    if (effects.length) composer.addPass(new EffectPass(camera, ...effects));
    return { composer, dof, grainFx };
  }, [gl, scene, camera, size.width, size.height, focusRange, bokehScale, grain, vignette, bloom, smaa]);

  useEffect(() => () => post.composer.dispose(), [post]);

  useFrame(() => {
    const f = frameRef.current;
    if (post.dof && focus) {
      const target = post.dof.target ?? new THREE.Vector3();
      if (Array.isArray(focus)) target.set(focus[0], focus[1], focus[2]);
      else if (focus instanceof THREE.Vector3) target.copy(focus);
      else if ((focus as VRM).humanoid) boneWorldPosition(focus as VRM, "head", target);
      else (focus as THREE.Object3D).getWorldPosition(target);
      post.dof.target = target;
    }
    post.grainFx?.setSeed(f + 1);
    post.composer.render(0);
  }, 1);

  return null;
};
