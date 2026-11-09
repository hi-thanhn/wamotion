// Minimal glTF 2.0 reader (JSON + external .bin) for nodes and animation samplers.
// Used by retarget.mjs; no three.js loader so it runs in plain Node.
import fs from "node:fs";
import path from "node:path";

const COMP = { 5120: [Int8Array, 1], 5121: [Uint8Array, 1], 5122: [Int16Array, 2], 5123: [Uint16Array, 2], 5125: [Uint32Array, 4], 5126: [Float32Array, 4] };
const SIZE = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };

export function readGltf(file) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const dir = path.dirname(file);
  const buffers = json.buffers.map((b) => {
    if (b.uri?.startsWith("data:")) return Buffer.from(b.uri.split(",")[1], "base64");
    return fs.readFileSync(path.join(dir, decodeURIComponent(b.uri)));
  });
  const accessor = (i) => {
    const a = json.accessors[i];
    const bv = json.bufferViews[a.bufferView];
    const [T, bytes] = COMP[a.componentType];
    const n = SIZE[a.type];
    const buf = buffers[bv.buffer];
    const off = (bv.byteOffset ?? 0) + (a.byteOffset ?? 0);
    const stride = bv.byteStride ?? n * bytes;
    const out = new Float64Array(a.count * n);
    for (let k = 0; k < a.count; k++) {
      const view = new T(buf.buffer, buf.byteOffset + off + k * stride, n);
      for (let c = 0; c < n; c++) out[k * n + c] = a.normalized ? view[c] / ((1 << (bytes * 8 - 1)) - 1) : view[c];
    }
    return { data: out, count: a.count, size: n };
  };
  return { json, accessor };
}
