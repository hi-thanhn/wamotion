# One review round by fresh eyes

An agent grading its own film tends to praise it. In the Wamotion app every film gets one
round of review by a subagent that has not seen the code, looking only at real rendered
frames; in blind A/B tests (Drone Emprit, Opus) the film with that round beat the film
without it. This file is the same round without the app. It is one round: after it,
review again only when the user asks.

## 1. Render real frames

From the finished film, either way works:

**Stills from the composition** (no full render needed). Pick frames that show the film:
the opening, each change of idea, the peak, the last frame. In the app that is the 5 %,
50 %, 75 % and 95 % point of every few seconds of film.

```bash
mkdir -p review
for f in 6 45 90 135 180 225 270 315 380 445; do
  npx remotion still src/index.ts <CompositionId> review/f-$f.jpg --frame=$f --image-format=jpeg --log=error
done
```

(Add `--gl=angle` when the film uses WebGL or three.js — the default renderer draws it blank.)

**From an mp4 you already rendered**: one frame every second, plus a contact sheet.

```bash
mkdir -p review
ffmpeg -v error -i out/film.mp4 -vf "fps=1" review/f-%03d.jpg
ffmpeg -v error -i out/film.mp4 -vf "fps=1,scale=480:-1,tile=5x4" -frames:v 1 review/sheet.jpg
```

**Phone width**: the app also shows the reviewer each 75 % frame at 360 px wide, the size a
viewer in a feed sees, so "can it be read at phone size" is answered on a real image:

```bash
for f in review/f-*.jpg; do ffmpeg -v error -y -i "$f" -vf scale=360:-1 "${f%.jpg}-phone.jpg"; done
```

## 2. Hand them to a fresh subagent

Spawn a subagent (the Task/Agent tool in Claude Code) and give it only the prompt below,
with the paths filled in. Leave out the code, your plan and your opinion of the film — the
point is a viewer's eyes.

```text
You are reviewing a short film you have not seen made. Do not open any code. Edit nothing.

STEP 1 — Open (Read) EVERY image below, in order, BEFORE reading the rest of this message.
Judge what a viewer sees, not what the author meant: the opening, the peak, the ending,
what repeats.
  <list every frame path, in film order; then the -phone.jpg images>

STEP 2 — TELLS. Each is a coded sign that a film was made on autopilot. For EVERY code,
answer yes/no from the images, and when yes, at which frames. Do not grade taste; answer
what you can point at.
  T1  Text meant to be read is too small: a caption under ~5 % of the frame height, a label under ~3 %, or anything unreadable on the phone-width frame.
  T2  Flat picture: everything sits on one plane — no light, shadow, surface, depth or horizon anywhere in the frame.
  T3  Generic: placeholder-looking content, stock shapes or lines that any brand could have used; nothing in the frame belongs only to this one.
  T4  No landing: a move ends without a rest, a thing never holds still long enough to be read, or the last shot has no final frame worth holding.
  T5  Colours fight: more than one accent competes for the eye, or an accent clashes with the brand's colour.
  T6  Linear motion: a constant-speed move, or every element entering the same way (the same fade-up, the same scale-in) in every shot.

STEP 3 — QUESTIONS. Answer each yes/no with the frame that shows it.
  R1  Can every on-screen text be read in one second at phone size? Anything cut off, overlapping, or wrapping into an orphan word?
  R6  Is anything overflowing the frame, clipped by another element, or sitting inside the platform safe area?
  R7  Between first and last frame of a moment, is something visibly different? A moment whose frames match is standing still.
  R9  Is anything standing DEAD for more than 2 s — same crop, same scale, same position, nothing breathing? A hold is fine; a frozen hold is not.
  R4  Does each moment serve the brief's goal for this audience, or is it decoration? Is the call to action visible and unmistakable at the end?
  R8  Would the audience named in the brief understand what is being sold after these frames alone, with the sound off?
  Brief: <goal · audience · call to action, in the user's words>

STEP 3b — THE CONTRACT (only if the user listed any). Answer EVERY item from the images,
sound off, as a stranger:
  B1 must have — is it in the film and clear? Missing, unreadable or only implied = fail.
  B2 avoid — is it absent? Present = fail.
  B3 facts — does each figure or claim appear exactly as given? Changed, rounded or invented = fail.
  <[mustHave] item … / [avoid] item … / [fact] item …>

STEP 4 — Report as a list. Each finding: code · frame · what is wrong · the exact change ·
how to check it. Mark a finding BLOCKING only when the film is broken: R1, R6, R7 or R9 is a
real problem the audience would notice, or a contract item fails. Everything else is a
note. Name the one change that would most raise the film, not only what is wrong. Also list
what works and should survive the fixes.
```

## 3. Answer each finding, once

For every finding, either change the film or reject it with a reason the user would accept
("the lamp is on from the start on purpose: the change the film shows is the queue, not the
light"). Tell the user, briefly, what you fixed and what you rejected and why.

What holds a film back is only what is broken: unreadable or off-frame text, a silent film,
a frozen picture, a film that does not render, or something the user asked for that is
missing. Every other finding is a note — act on it when you agree.

Sound is not in the frames. If earshot is installed, `scripts/hear.sh out/film.mp4` scores
the soundtrack against seven professional launch films; it is optional and the reviewer
does not need it.
