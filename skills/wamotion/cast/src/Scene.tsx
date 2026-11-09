import React, { useEffect, useLayoutEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { cancelRender, continueRender, delayRender } from "remotion";

/**
 * Loads everything a scene needs before the canvas mounts (Remotion waits through delayRender). Returns null
 * until then. Load inside the canvas and frame 0 is drawn before the assets exist — so load first, mount after.
 */
export function useLoaded<T>(load: () => Promise<T>, label = "Loading 3D assets"): T | null {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    const handle = delayRender(label, { timeoutInMilliseconds: 180000 });
    load()
      .then((v) => {
        setValue(v);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
    // load once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

export type CastCanvasProps = {
  width: number;
  height: number;
  /** ACES tone mapping suits HDRI + PBR; "none" keeps colours as authored (what MToon-only scenes used); default "aces" */
  toneMapping?: "aces" | "none";
  /** exposure multiplier under tone mapping; default 1 */
  exposure?: number;
  /** multiplies the device pixel ratio; keep 1 for a render at the composition's size */
  dpr?: number;
  children: React.ReactNode;
};

/**
 * @remotion/three's <ThreeCanvas> with the settings a fixed-frame render wants: one draw per frame, no
 * MSAA (SMAA in <Post> does it), sRGB output, optional ACES tone mapping. Place it in an <AbsoluteFill>;
 * HTML (motion-graphics type) goes in sibling layers above or below it.
 */
export const CastCanvas: React.FC<CastCanvasProps> = ({ width, height, toneMapping = "aces", exposure = 1, dpr = 1, children }) => (
  <ThreeCanvas
    width={width}
    height={height}
    dpr={dpr}
    flat={toneMapping === "none"}
    gl={{
      antialias: false,
      alpha: true,
      stencil: false,
      powerPreference: "high-performance",
      toneMapping: toneMapping === "aces" ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping,
      toneMappingExposure: exposure,
      outputColorSpace: THREE.SRGBColorSpace,
    }}
  >
    {children}
  </ThreeCanvas>
);

export type HdriProps = {
  /** from loadHdri() */
  map: THREE.Texture;
  /** also show the HDRI behind the scene; a colour string shows that instead; default false (transparent) */
  background?: boolean | string;
  /** blur of the visible background 0–1; default 0 */
  backgroundBlur?: number;
  /** how strongly the HDRI lights PBR materials; default 1 */
  intensity?: number;
  /** turn the HDRI around Y, radians; default 0 */
  rotationY?: number;
};

/**
 * Image-based lighting from an equirectangular HDRI: sets scene.environment (and optionally background).
 * It lights meshStandardMaterial / meshPhysicalMaterial. VRM MToon materials do not read the environment —
 * they take light from <directionalLight> / <hemisphereLight> / <ambientLight>, so give the character its own.
 * Same as drei's <Environment map={…} /> without the Suspense; drei's version works too if the texture is passed as `map`.
 */
export const Hdri: React.FC<HdriProps> = ({ map, background = false, backgroundBlur = 0, intensity = 1, rotationY = 0 }) => {
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    scene.environment = map;
    scene.environmentIntensity = intensity;
    scene.environmentRotation.set(0, rotationY, 0);
    if (background === true) {
      scene.background = map;
      scene.backgroundBlurriness = backgroundBlur;
      scene.backgroundRotation.set(0, rotationY, 0);
    } else if (typeof background === "string") {
      scene.background = new THREE.Color(background);
    } else {
      scene.background = null;
    }
    return () => {
      scene.environment = null;
      scene.background = null;
    };
  }, [scene, map, background, backgroundBlur, intensity, rotationY]);
  return null;
};
