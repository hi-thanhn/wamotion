---
name: vector-art
description: How to design the characters, objects and scenes of a video as vector art that looks drawn by a designer — built in layers, looked at large, moved part by part in Remotion. Read it before you draw a mascot, a product or a key object, when the user says the drawing looks flat or like clip-art, or when a part of a drawing has to move.
---

# Vector art for a Wamotion video

Everything on screen is SVG written in TSX, so you are the illustrator. What separates a drawing that reads as
"designed" from one that reads as clip-art is not more paths; it is the order you build in, the layers you keep,
and whether you looked at it large before you shipped it. This is how illustrators work and how the best
text-to-vector systems are built (layered construction, then a look-and-revise loop).

## Design it on its own first

A character or key object drawn straight into `worlds/film.tsx`, at the size it has on screen, comes out small and
rough, because you are laying out the frame, timing and words at the same time and you never see the drawing at
full size. Draw it as its own component — `shared/<slug>.tsx`, `export default function May({ pose, mood })` —
with its own `viewBox`, then place it in the film. The film file stays about the film; the drawing gets your full
attention, and the user can point at it and ask for changes in one place. When a real picture exists — the client's
logo, a photo of the product, a sketch they made — `wamotion vector trace <file>` turns it into SVG paths to draw on
top of; a traced shape beats one redrawn from memory.

## Build in the order a designer builds

1. **A plan of layers before any path.** Write the `<g id>` list back to front: ground shadow · body mass · head ·
   face · limbs · props · highlights. Each group is one thing the user might name ("the left hand") and one thing
   that might move. This is the construction order layered vectorization models are trained to imitate.
2. **Big masses with simple shapes first** — `ellipse`, `rect` with `rx`, one `path` with few anchors. Get the
   silhouette right at this stage: a silhouette that reads at 64 px reads at any size.
3. **Then light.** Pick one light direction for the whole video and keep it. Add a shadow shape (the body colour,
   one step darker, offset away from the light) and a highlight shape (one step lighter, toward it). Two tones
   per mass is what makes a flat drawing look like it has volume; a gradient alone looks like a web button.
4. **Then detail and material.** Line work (one stroke width for the whole drawing, or none at all; mixing reads
   as unfinished), a texture once (a `<filter>` with grain or halftone defined once in `<defs>` and reused),
   a few deliberate imperfections. Stop before the drawing is "complete": a mascot with three well-placed
   details looks more designed than one with twenty.
5. **Keep each part whole.** Draw the arm as a full arm even where the body covers it, and let the layer order do
   the hiding. A part that is whole can rotate, swing or scale without tearing; a part cut to its visible outline
   cannot.

## Colour, line, character

- **Palette from the brand, not from the drawing.** Take fills from the client's kit (`wamotion client get`) or
  the video style's `look`: four to six colours plus their darker/lighter steps. More colours than that and the
  frame stops belonging to one brand.
- **One shape language.** Round everything or round nothing; the eye catches one sharp corner in a soft design.
- **Faces: fewest marks that carry the feeling.** Two eye shapes, one mouth path, maybe a blush. Keep eyes, mouth
  and brows as separate groups so a blink or a smile is a swap of a few paths, not a redraw.
- **Hands and props are usually the weak spot** — draw them as simple mitt or capsule shapes with one bent line,
  not five fingers.
- Text stays real text in the film (a font with Vietnamese glyphs), never outlined paths: outlined text loses its
  diacritics and its ability to be edited.

## Look at it large, then fix what you see

You cannot judge a drawing from the film's contact sheet; the mascot is 200 px tall there. Render the component
on its own at 1024 px or more — `wamotion vector look shared/<slug>.tsx` when that command exists, otherwise a
temporary composition rendered with `shot render` — and look at the image before you move on. What usually shows
up on the first look: the silhouette has no clear read, the shadow is on the wrong side, two line widths, a
part that is not whole, a colour outside the palette. Fix, look again. Two or three rounds is normal; this
look-and-revise loop is what raises vector output in every study of it.

## Moving the parts in Remotion

- Time everything from `useCurrentFrame()`; no CSS animation, no GSAP ticking on its own.
- Rotate a part around its joint: give the `<g>` `style={{ transformBox: "fill-box", transformOrigin: "20% 90%" }}`
  (the shoulder, in the part's own box) and `transform: rotate(${deg}deg)`. Keep rotations small (5–15°) and
  eased; a mascot that over-swings reads as cheap.
- Breathing, a blink, a bob: tiny scale/translate loops on the body, an eyelid group that swaps in for 3 frames,
  a 2 % vertical sine — this is what makes a still drawing feel alive without animating anything.
- A line drawing itself: `@remotion/paths` — `evolvePath(progress, d)` gives `strokeDasharray`/`strokeDashoffset`
  for a path revealing along its length; `interpolatePath(t, dA, dB)` morphs one shape into another when both
  have compatible structure.
- Gradients, clips and filters defined in `<defs>` need unique ids (`useId()`), because two instances of the same
  component in one frame share one SVG id space.

## Cost of the drawing

Filters and many small paths cost paint time on every frame: one texture filter on a group is fine, a filter per
part or a thousand anchors in a static background makes playback stutter. A large static drawing can be an
`<Img>` of the SVG file instead of inline JSX; `wamotion shot check` reports paint cost.

## Three different examples

**A mascot (a tooth named Mây).** Groups: shadow · body · face · left arm · right arm · blush · sparkle. Body is
one rounded path; two eyes are ellipses with a smaller highlight circle; mouth is one path that has a `smile`
and a `worried` variant. The arms are whole capsules rotated at the shoulder. Three poses are three sets of
numbers, not three drawings.

**A product (a bubble tea cup).** Groups: cup shadow · cup body · tea fill · pearls · lid · straw · label.
The fill is a `clipPath` on the cup body so it can rise; pearls are a handful of circles with one darker
highlight each; the label carries the brand colour and real text.

**A scene (a dental chair in a bright room).** Groups: wall · floor · window · chair base · chair back · lamp ·
plant. One light direction from the window, a texture filter once on the wall; nothing in the room is drawn more
carefully than the thing the story is about.
