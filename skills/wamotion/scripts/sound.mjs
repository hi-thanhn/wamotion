#!/usr/bin/env node
// Wamotion sound bank, standalone. Node >= 20, no dependencies, offline.
// Ported from apps/sidecar/src/project/sound-bank.ts (word ranking only: the app's CLAP
// text-to-audio model is not shipped here, so ranking is by tags, UCS category, roles and
// the one-line description). `search --ears` re-orders the word matches by listening, through
// earshot's CLAP model via hear.sh, when earshot is installed.
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { copyFileSync, mkdirSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs"
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const BANK = resolve(HERE, "..", "bank")
const HEAR = join(HERE, "hear.sh")
const EARS_POOL = 30
const KINDS = ["whoosh", "impact", "riser", "sparkle", "transition", "foley", "ambience"]
const MOODS = ["calm", "warm", "upbeat", "tech", "playful", "cinematic", "tense"]

const USAGE = `Usage (run from any folder):
  node sound.mjs search <query words> [--kind <${KINDS.join("|")}>] [--limit n] [--ears]
  node sound.mjs get <id | query words> --to <dir> [--kind k] [--fps n]
  node sound.mjs music list [--mood <${MOODS.join("|")}>]
  node sound.mjs music get <id> --to <dir>
  node sound.mjs credits <dir>
An empty query browses the bank (with --kind, that kind only). Output is JSON.
--ears orders by listening (earshot, if installed; slower): the best ${EARS_POOL} word matches, or with --kind every sound of that kind.`

function loadBank() {
  let raw
  try {
    raw = readFileSync(join(BANK, "manifest.json"), "utf8")
  } catch {
    fail(
      `Sound bank not found at ${BANK}. bank/ ships inside the skill folder; reinstall the skill ` +
        "(https://github.com/hi-thanhn/wamotion) or copy bank/ next to scripts/."
    )
  }
  return JSON.parse(raw)
}

// ── word ranking (port of rankSfx without the CLAP cosine) ──
const STOP = new Set(["tiếng", "âm", "của", "và", "một", "như", "là", "có", "cho", "rồi", "thì", "cái", "con", "the", "a", "an", "of", "on", "with", "sound", "sfx"])
function tokens(text) {
  return String(text)
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .split(/[^\p{L}\p{N}-]+/u)
    .filter((t) => t.length > 0 && !STOP.has(t))
}
function rank(entries, query) {
  const qText = query.normalize("NFC").toLocaleLowerCase("vi")
  const q = new Set(tokens(query))
  // hyphenated query words also count as their parts ("ui-pop" → ui, pop)
  for (const t of [...q]) if (t.includes("-")) for (const p of t.split("-")) if (p) q.add(p)
  return entries
    .map((e) => {
      const matched = []
      let score = 0
      for (const tag of e.tags ?? []) {
        const parts = tokens(tag)
        if (parts.length > 0 && parts.every((p) => q.has(p))) {
          score += 1
          matched.push(tag)
        }
      }
      if (e.ucs && qText.includes(e.ucs.toLowerCase())) {
        score += 1
        matched.push(e.ucs)
      }
      for (const role of e.roles ?? []) {
        const parts = role.split(/[._]/).filter(Boolean)
        if (parts.length > 0 && parts.every((p) => q.has(p)) && !matched.includes(role)) {
          score += 1
          matched.push(role)
        }
      }
      if (q.has(e.kind)) score += 0.5
      const said = new Set(tokens(e.describe ?? ""))
      for (const t of q) if (said.has(t) && !matched.includes(t)) score += 0.2
      const idParts = new Set(e.id.split("-"))
      for (const t of q) if (idParts.has(t)) score += 0.3
      return { e, score, matched }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.e.id.localeCompare(b.e.id))
}

function sfxView(e, extra = {}) {
  return {
    id: e.id,
    kind: e.kind,
    roles: e.roles ?? [],
    describe: e.describe ?? "",
    durationSec: e.durationSec,
    peakLagSec: e.peakLagSec,
    license: e.license,
    ...extra,
  }
}
function musicView(t) {
  return {
    id: t.id,
    title: t.title,
    author: t.author,
    mood: t.mood,
    durationSec: t.durationSec,
    loop: t.loop,
    bpm: t.bpm ?? null,
    lufs: t.lufs,
    license: t.license,
  }
}

function parse(argv) {
  const pos = []
  const opt = {}
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a.startsWith("--")) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("--")) opt[key] = true
      else {
        opt[key] = next
        i += 1
      }
    } else pos.push(a)
  }
  return { pos, opt }
}

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exit(1)
}
function out(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
}

/** Copy one bank file into `dir`; returns where it landed and the `staticFile()` path when it is under public/. */
function copyInto(entry, dir) {
  const target = resolve(dir)
  mkdirSync(target, { recursive: true })
  const dest = join(target, `${entry.id}${extname(entry.file)}`)
  copyFileSync(join(BANK, entry.file), dest)
  const rel = relative(process.cwd(), dest) || basename(dest)
  const parts = dest.split(sep)
  const pub = parts.lastIndexOf("public")
  return { path: rel, ...(pub >= 0 ? { staticFile: parts.slice(pub + 1).join("/") } : {}) }
}

function search(pos, opt) {
  const bank = loadBank()
  const kind = typeof opt.kind === "string" ? opt.kind : null
  if (kind && !KINDS.includes(kind)) fail(`Unknown kind "${kind}". Kinds: ${KINDS.join(", ")}.`)
  const limit = Number(opt.limit ?? 8) || 8
  const query = pos.join(" ").trim()
  const pool = bank.sfx.filter((e) => !kind || e.kind === kind)
  if (!query) return out({ query, total: pool.length, results: pool.slice(0, limit).map((e) => sfxView(e)) })
  const all = rank(pool, query)
  if (opt.ears) {
    // With --kind, listen to the whole kind (words may miss a sound that fits); otherwise to the best word matches.
    const matched = new Set(all.map((r) => r.e))
    const rest = kind ? pool.filter((e) => !matched.has(e)).map((e) => ({ e, score: 0, matched: [] })) : []
    if (all.length + rest.length > 0) return searchByEar(query, all, kind ? [...all, ...rest] : all.slice(0, EARS_POOL), limit)
  }
  const ranked = all.slice(0, limit)
  out({
    query,
    matches: all.length,
    ...(ranked.length === 0 ? { note: "Nothing matched these words. Try plainer words (material, size, dry/wet), a --kind, or browse with an empty query." } : {}),
    results: ranked.map((r) => sfxView(r.e, { score: Math.round(r.score * 100) / 100, matched: r.matched })),
  })
}

function realOrSelf(p) {
  try {
    return realpathSync(p)
  } catch {
    return p
  }
}

/** Word matches re-ordered by earshot's `rank` (CLAP: how well each file fits the query); falls back to word order. */
function searchByEar(query, all, pool, limit) {
  const wordsOnly = (note) =>
    out({
      query,
      matches: all.length,
      note,
      results: all.slice(0, limit).map((r) => sfxView(r.e, { score: Math.round(r.score * 100) / 100, matched: r.matched })),
    })
  const byPath = new Map(pool.map((r) => [realOrSelf(join(BANK, r.e.file)), r]))
  const run = spawnSync("bash", [HEAR, "rank", query, ...byPath.keys(), "--json", "--top", String(limit)], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
  const stdout = run.stdout ?? ""
  // No ears: hear.sh prints one plain line and exits 0 (not installed, or the API did not answer and nothing local).
  if (run.status === 0 && stdout.trim() && !stdout.trimStart().startsWith("{")) return wordsOnly(`Ears are not available (${stdout.trim().split("\n")[0]}), so the order is by words only.`)
  let heard
  try {
    heard = JSON.parse(stdout)
  } catch {
    const why = (run.error?.message ?? run.stderr ?? "").trim().split("\n").pop() || `exit ${run.status}`
    return wordsOnly(`Ears failed (${why}), so the order is by words only.`)
  }
  const results = []
  for (const h of heard.results ?? []) {
    const r = byPath.get(realOrSelf(h.path))
    if (!r) continue
    results.push(
      sfxView(r.e, {
        score: Math.round(r.score * 100) / 100,
        matched: r.matched,
        ears: { z: h.z, cosine: h.cosine, verdict: h.verdict, soundsMostLike: h.sounds_most_like },
      })
    )
  }
  out({
    query,
    matches: all.length,
    heard: pool.length,
    note: `Ordered by listening (earshot CLAP) among ${pool.length} sounds (${all.length} matched the words${pool.length > all.length ? ", the rest are the same kind" : ""}). ears.z is how far above chance the sound fits the words; earshot's own test found "strong" the right kind of sound about 98% of the time.`,
    results,
  })
}

function get(pos, opt) {
  if (typeof opt.to !== "string") fail("Give --to <dir>, e.g. --to public/sfx")
  const bank = loadBank()
  const key = pos.join(" ").trim()
  if (!key) fail("Give a bank id or a few words describing the sound.")
  let entry = bank.sfx.find((e) => e.id === key)
  if (!entry) {
    const kind = typeof opt.kind === "string" ? opt.kind : null
    entry = rank(bank.sfx.filter((e) => !kind || e.kind === kind), key)[0]?.e
  }
  if (!entry) fail(`No bank sound matches "${key}". Try \`search\`.`)
  const placed = copyInto(entry, opt.to)
  const fps = Number(opt.fps)
  out({
    ...sfxView(entry),
    ...placed,
    ...(fps > 0 ? { leadFrames: Math.round(entry.peakLagSec * fps) } : {}),
    hint: "peakLagSec is the time from the file's start to its attack. To land the hit on frame hitFrame: <Sequence from={hitFrame - Math.round(peakLagSec * fps)}><Audio src={staticFile(...)} /></Sequence>.",
  })
}

function music(pos, opt) {
  const bank = loadBank()
  const [sub, id] = pos
  if (sub === "list" || sub === undefined) {
    const mood = typeof opt.mood === "string" ? opt.mood : null
    if (mood && !MOODS.includes(mood)) fail(`Unknown mood "${mood}". Moods: ${MOODS.join(", ")}.`)
    return out({
      note: "bpm is listed where the bank measured it; `node tempo.mjs <file>` measures any track. Tracks are levelled near -16 LUFS.",
      tracks: bank.music.filter((t) => !mood || t.mood === mood).map(musicView),
    })
  }
  if (sub === "get") {
    if (!id) fail("Give a track id (see `music list`).")
    if (typeof opt.to !== "string") fail("Give --to <dir>, e.g. --to public/music")
    const track = bank.music.find((t) => t.id === id)
    if (!track) fail(`No track "${id}". Tracks: ${bank.music.map((t) => t.id).join(", ")}.`)
    return out({ ...musicView(track), ...copyInto(track, opt.to) })
  }
  fail(USAGE)
}

function sha1(file) {
  return createHash("sha1").update(readFileSync(file)).digest("hex")
}
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else acc.push({ path: p, size: st.size })
  }
  return acc
}

/** Every bank file found under `dir` (matched by content, so renamed copies count too), with its licence. */
function credits(pos) {
  const dir = pos[0]
  if (!dir) fail("Give a folder to scan, e.g. `credits public`.")
  const bank = loadBank()
  const all = [...bank.sfx.map((e) => ({ ...e, lane: "sfx" })), ...bank.music.map((t) => ({ ...t, lane: "music" }))]
  const bySize = new Map()
  for (const e of all) {
    const size = statSync(join(BANK, e.file)).size
    if (!bySize.has(size)) bySize.set(size, [])
    bySize.get(size).push(e)
  }
  const found = new Map()
  for (const f of walk(resolve(dir))) {
    const candidates = bySize.get(f.size)
    if (!candidates) continue
    const h = sha1(f.path)
    const e = candidates.find((c) => sha1(join(BANK, c.file)) === h)
    if (!e) continue
    const prev = found.get(e.id)
    if (prev) prev.files.push(relative(process.cwd(), f.path))
    else found.set(e.id, { e, files: [relative(process.cwd(), f.path)] })
  }
  const items = [...found.values()].map(({ e, files }) => ({ id: e.id, lane: e.lane, title: e.title, author: e.author, source: e.source, url: e.url, license: e.license, files }))
  const line = (i) => `${i.title} by ${i.author} (${i.license}) ${i.url}`
  const music_ = items.filter((i) => i.lane === "music")
  const sfx = items.filter((i) => i.lane === "sfx")
  const text = [
    ...(music_.length ? ["Music:", ...music_.map(line)] : []),
    ...(sfx.length ? [...(music_.length ? [""] : []), "Sound effects:", ...sfx.map(line)] : []),
  ].join("\n")
  out({
    note: "CC0 and MIT need no attribution; credit is kind. Paste `text` into a credits.txt or the video description.",
    items,
    text,
  })
}

const { pos, opt } = parse(process.argv.slice(2))
const cmd = pos.shift()
if (cmd === "search") search(pos, opt)
else if (cmd === "get") get(pos, opt)
else if (cmd === "music") music(pos, opt)
else if (cmd === "credits") credits(pos)
else {
  process.stdout.write(`${USAGE}\n`)
  process.exit(cmd ? 2 : 0)
}
