import { BlendFunction, Effect } from "postprocessing";
import { Uniform } from "three";

const fragment = /* glsl */ `
uniform float seed;
uniform float amount;
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float n = hash(uv * resolution + vec2(seed * 17.0, seed * 3.0)) - 0.5;
  outputColor = vec4(inputColor.rgb + n * amount, inputColor.a);
}
`;

/** Film grain seeded by the frame number — no time uniform, so the same frame always gets the same grain. */
export class GrainEffect extends Effect {
  constructor(amount = 0.05) {
    super("GrainEffect", fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["seed", new Uniform(0)],
        ["amount", new Uniform(amount)],
      ]),
    });
  }
  setSeed(seed: number) {
    (this.uniforms.get("seed") as Uniform).value = seed;
  }
}
