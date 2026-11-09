import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import type { ClipData } from "./clip";
import type { RhubarbFile } from "./visemes";

/**
 * Loads a .vrm (0.x or 1.0) and makes it ready for a fixed-frame render: faces +Z, skeletons combined,
 * skinned meshes never frustum-culled (their rest-pose bounds would cull a posed body).
 * MToon materials and their outline meshes come from the file as they are.
 */
export async function loadVrm(url: string): Promise<VRM> {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));
  const gltf = await loader.loadAsync(url);
  const vrm = gltf.userData.vrm as VRM;
  VRMUtils.removeUnnecessaryVertices(gltf.scene);
  VRMUtils.combineSkeletons(gltf.scene);
  VRMUtils.rotateVRM0(vrm);
  vrm.scene.traverse((o) => {
    o.frustumCulled = false;
  });
  return vrm;
}

/** A retargeted clip JSON written by cast/scripts/retarget.mjs. */
export async function loadClip(url: string): Promise<ClipData> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`clip ${url}: ${r.status}`);
  return (await r.json()) as ClipData;
}

/** Mouth cues written by cast/scripts/lipsync.sh (Rhubarb JSON). */
export async function loadRhubarb(url: string): Promise<RhubarbFile> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`rhubarb ${url}: ${r.status}`);
  return (await r.json()) as RhubarbFile;
}

/** An equirectangular .hdr, ready for `scene.environment` / `scene.background` (see <Hdri> in Scene.tsx). */
export async function loadHdri(url: string): Promise<THREE.DataTexture> {
  const tex = await new RGBELoader().loadAsync(url);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

export type PbrMaps = {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metalnessMap: THREE.Texture;
  aoMap: THREE.Texture;
};

/**
 * A Poly Haven texture set (`<id>_diff_1k.jpg`, `<id>_nor_gl_1k.jpg`, `<id>_arm_1k.jpg`) as props for
 * <meshStandardMaterial {...maps} />. The ARM file carries AO (R), roughness (G) and metalness (B), which is
 * exactly where three.js reads them, so one texture serves three slots. `repeat` tiles the set over the surface
 * (a 4 m floor with repeat 4 keeps the texels at the size they were photographed at, about 1 m per tile).
 */
export async function loadPbr(dir: string, id: string, opts: { repeat?: number | [number, number]; res?: string } = {}): Promise<PbrMaps> {
  const res = opts.res ?? "1k";
  const loader = new THREE.TextureLoader();
  const [map, normalMap, arm] = await Promise.all(
    ["diff", "nor_gl", "arm"].map((m) => loader.loadAsync(`${dir}/${id}/${id}_${m}_${res}.jpg`)),
  );
  map.colorSpace = THREE.SRGBColorSpace;
  const rep = Array.isArray(opts.repeat) ? opts.repeat : [opts.repeat ?? 1, opts.repeat ?? 1];
  for (const t of [map, normalMap, arm]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rep[0], rep[1]);
    t.anisotropy = 8;
  }
  return { map, normalMap, roughnessMap: arm, metalnessMap: arm, aoMap: arm };
}
