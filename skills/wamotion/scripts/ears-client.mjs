#!/usr/bin/env node
// Ears over HTTP: runs an earshot command on an ears server (ears/ in the repository) instead of a local install.
//   node ears-client.mjs <earshot command> [args…]       same arguments as `earshot <command> …`
// Needs WAMOTION_EARS_URL (e.g. https://ears.example.com, or http://localhost:8000) and WAMOTION_EARS_TOKEN. Files among the arguments are
// uploaded (a folder = every audio/video file in it); the value after -o / --out is written back where you asked.
// stdout, stderr and the exit code are the command's own, so `--json` prints the same JSON as a local earshot.
// When the API does not answer: falls back to the local install named by WAMOTION_EARS_LOCAL_PY (hear.sh sets it),
// else prints one line and exits 0 — the ears are optional. Node ≥ 20, no dependencies.
import { spawnSync } from "node:child_process"
import { openAsBlob, realpathSync } from "node:fs"
import { mkdir, readdir, stat, writeFile } from "node:fs/promises"
import { basename, dirname, extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const MEDIA_EXTS = new Set([".wav", ".flac", ".ogg", ".oga", ".mp3", ".m4a", ".aac", ".opus", ".aif", ".aiff", ".wma", ".mp4", ".mov", ".webm", ".mkv", ".m4v"])
const DIR_FILE_CAP = 200

async function kind(path) {
  try {
    const s = await stat(path)
    return s.isFile() ? "file" : s.isDirectory() ? "dir" : null
  } catch {
    return null
  }
}

async function mediaIn(dir, out) {
  const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))
  for (const entry of entries) {
    if (out.length >= DIR_FILE_CAP) return
    const full = join(dir, entry.name)
    if (entry.isDirectory()) await mediaIn(full, out)
    else if (entry.isFile() && MEDIA_EXTS.has(extname(entry.name).toLowerCase())) out.push(full)
  }
}

/** argv → {command, args with @fN / @out:name, files, outs}; exported for the test. */
export async function prepare(argv, cwd = process.cwd()) {
  const [command, ...rest] = argv
  if (!command) throw new Error("earshot needs a command")
  const out = { command, args: [], files: [], outs: [] }
  let previous = ""
  for (const token of rest) {
    if (previous === "-o" || previous === "--out") {
      let name = basename(token) || "out"
      if (out.outs.some((o) => o.name === name)) name = `${out.outs.length}-${name}`
      out.outs.push({ name, path: resolve(cwd, token) })
      out.args.push(`@out:${name}`)
    } else if (token.startsWith("-") || token === "") {
      out.args.push(token)
    } else {
      const path = resolve(cwd, token)
      const what = await kind(path)
      if (what === "file") {
        out.files.push({ field: `f${out.files.length + 1}`, path })
        out.args.push(`@f${out.files.length}`)
      } else if (what === "dir") {
        const found = []
        await mediaIn(path, found)
        if (found.length === 0) throw new Error(`no audio or video files in ${token}`)
        for (const file of found) {
          out.files.push({ field: `f${out.files.length + 1}`, path: file })
          out.args.push(`@f${out.files.length}`)
        }
      } else {
        out.args.push(token)
      }
    }
    previous = token
  }
  return out
}

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

/** One call. Returns {code, stdout, stderr, timing, uploadedBytes}; throws ApiError when the API did not take it. */
export async function call(argv, { url, token, cwd = process.cwd(), fetchImpl = fetch, timeoutMs = 20 * 60_000 } = {}) {
  const prepared = await prepare(argv, cwd)
  const form = new FormData()
  form.set("args", JSON.stringify(prepared.args))
  let uploadedBytes = 0
  for (const { field, path } of prepared.files) {
    const blob = await openAsBlob(path)
    uploadedBytes += blob.size
    form.append(field, blob, basename(path))
  }
  let response
  try {
    response = await fetchImpl(`${url.replace(/\/+$/, "")}/v1/${prepared.command}`, {
      method: "POST",
      headers: token ? { authorization: `Bearer ${token}` } : {},
      body: form,
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    throw new ApiError(`${url} did not answer: ${error?.message ?? error}`, null)
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const text = body?.error ?? `HTTP ${response.status}`
    throw new ApiError(response.status === 401 ? `${text} (set WAMOTION_EARS_TOKEN)` : text, response.status)
  }
  const body = await response.json()
  for (const { name, path } of prepared.outs) {
    const b64 = body.files?.[name]
    if (b64 === undefined) continue
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, Buffer.from(b64, "base64"))
  }
  let stdout = body.stdout ?? ""
  for (const { name, path } of prepared.outs) stdout = stdout.split(`"${name}"`).join(JSON.stringify(path))
  return { code: typeof body.code === "number" ? body.code : 1, stdout, stderr: body.stderr ?? "", timing: body.timing ?? {}, uploadedBytes }
}

async function main() {
  const argv = process.argv.slice(2)
  const url = process.env.WAMOTION_EARS_URL
  if (!url) {
    console.error("WAMOTION_EARS_URL is not set; this client needs an ears server (ears/ in the repository)")
    process.exit(2)
  }
  const localPy = process.env.WAMOTION_EARS_LOCAL_PY
  const fallback = (why) => {
    if (localPy) {
      process.stderr.write(`ears API ${why}; using the local earshot install instead\n`)
      const run = spawnSync(localPy, ["-m", "earshot", ...argv], { stdio: "inherit" })
      process.exit(run.status ?? 1)
    }
    process.stdout.write(`ears API ${why}, and earshot is not installed locally; optional — going on without ears\n`)
    process.exit(0)
  }
  try {
    const t = Date.now()
    const run = await call(argv, { url, token: process.env.WAMOTION_EARS_TOKEN })
    if (process.env.WAMOTION_EARS_TIMING) {
      process.stderr.write(`ears API: ${run.uploadedBytes} B up, queued ${run.timing.queuedSec ?? "?"} s, ran ${run.timing.wallSec ?? "?"} s, round trip ${((Date.now() - t) / 1000).toFixed(1)} s\n`)
    }
    process.stdout.write(run.stdout)
    process.stderr.write(run.stderr)
    process.exit(run.code)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400 || error.status === 404 || error.status === 413 || error.status === 422) {
        // the request itself was wrong: say so, do not retry locally with the same mistake
        process.stderr.write(`earshot ${argv[0] ?? ""}: error: ${error.message}\n`)
        process.exit(1)
      }
      fallback(`at ${url} ${error.status ? `answered ${error.status}: ` : ""}${error.message}`)
    }
    process.stderr.write(`earshot ${argv[0] ?? ""}: error: ${error?.message ?? error}\n`)
    process.exit(1)
  }
}

// Run when invoked as a script, also through a symlink (`~/.claude/skills/wamotion` → the repo): compare real paths,
// otherwise `bash hear.sh …` through the link exits 0 with no output and the agent goes on without ears unawares.
const invokedAs = (() => {
  try {
    return process.argv[1] ? realpathSync(resolve(process.argv[1])) : ""
  } catch {
    return ""
  }
})()
if (invokedAs && invokedAs === realpathSync(fileURLToPath(import.meta.url))) await main()
