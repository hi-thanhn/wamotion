// node --test skill/wamotion/scripts/ears-client.test.mjs — no network, no earshot: a fake fetch stands in for the API.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { after, before, test } from "node:test"

import { call, prepare } from "./ears-client.mjs"

let dir
before(async () => {
  dir = await mkdtemp(join(tmpdir(), "ears-client-"))
  await writeFile(join(dir, "film.mp4"), "MP4" + "x".repeat(100))
  await mkdir(join(dir, "sfx", "deep"), { recursive: true })
  await writeFile(join(dir, "sfx", "b.wav"), "b")
  await writeFile(join(dir, "sfx", "a.wav"), "a")
  await writeFile(join(dir, "sfx", "deep", "c.ogg"), "c")
  await writeFile(join(dir, "sfx", "readme.txt"), "no")
})
after(() => rm(dir, { recursive: true, force: true }))

function fakeFetch(reply, log = []) {
  return async (url, init) => {
    const form = init.body
    const seen = { url, auth: init.headers.authorization, args: JSON.parse(form.get("args")), fields: [] }
    for (const [name, value] of form.entries()) if (value instanceof Blob) seen.fields.push({ name, filename: value.name, size: value.size })
    log.push(seen)
    const { status = 200, body } = reply(seen)
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })
  }
}

test("prepare: files become @fN, a folder expands to its media files, -o becomes @out, the rest passes through", async () => {
  const p = await prepare(["rank", "a soft glass ting", "sfx", "--top", "5", "--json"], dir)
  assert.deepEqual(p.args, ["a soft glass ting", "@f1", "@f2", "@f3", "--top", "5", "--json"])
  assert.deepEqual(
    p.files.map((f) => f.path),
    [join(dir, "sfx", "a.wav"), join(dir, "sfx", "b.wav"), join(dir, "sfx", "deep", "c.ogg")]
  )
  const s = await prepare(["sheet", "film.mp4", "-o", "out/sheet.png", "--from", "2"], dir)
  assert.deepEqual(s.args, ["@f1", "-o", "@out:sheet.png", "--from", "2"])
  assert.deepEqual(s.outs, [{ name: "sheet.png", path: join(dir, "out", "sheet.png") }])
  await assert.rejects(prepare([], dir))
})

test("call: posts multipart with the token, writes the returned file where asked, returns the CLI's stdout/code", async () => {
  const log = []
  const fetchImpl = fakeFetch(
    () => ({ body: { code: 0, stdout: '{"png": "sheet.png"}\n', stderr: "", files: { "sheet.png": Buffer.from("PNG!").toString("base64") }, timing: { wallSec: 1 } } }),
    log
  )
  const run = await call(["sheet", "film.mp4", "-o", "out/sheet.png", "--json"], { url: "https://ears.example.com/", token: "tok", cwd: dir, fetchImpl })
  assert.equal(log[0].url, "https://ears.example.com/v1/sheet")
  assert.equal(log[0].auth, "Bearer tok")
  assert.deepEqual(log[0].args, ["@f1", "-o", "@out:sheet.png", "--json"])
  assert.deepEqual(log[0].fields, [{ name: "f1", filename: "film.mp4", size: 103 }])
  assert.equal(run.code, 0)
  assert.equal(run.uploadedBytes, 103)
  assert.deepEqual(JSON.parse(run.stdout), { png: join(dir, "out", "sheet.png") })
  assert.equal(await readFile(join(dir, "out", "sheet.png"), "utf8"), "PNG!")
})

test("call: earshot's own non-zero code passes through; API refusals throw with the status", async () => {
  const bad = await call(["describe", "film.mp4"], { url: "https://e", token: "t", cwd: dir, fetchImpl: fakeFetch(() => ({ body: { code: 1, stdout: "", stderr: "earshot describe: error: x" } })) })
  assert.equal(bad.code, 1)
  await assert.rejects(call(["describe", "film.mp4"], { url: "https://e", token: null, cwd: dir, fetchImpl: fakeFetch(() => ({ status: 401, body: { error: "send a token" } })) }), (e) => e.status === 401 && /WAMOTION_EARS_TOKEN/.test(e.message))
  await assert.rejects(
    call(["describe", "film.mp4"], {
      url: "https://e",
      token: "t",
      cwd: dir,
      fetchImpl: async () => {
        throw new TypeError("fetch failed")
      },
    }),
    (e) => e.status === null && /did not answer/.test(e.message)
  )
})

test("script entry: runs main() also when invoked through a symlink (the skill lives at ~/.claude/skills/wamotion → repo)", async () => {
  const real = join(dirname(fileURLToPath(import.meta.url)), "ears-client.mjs")
  const link = join(dir, "ears-client-link.mjs")
  await symlink(real, link)
  for (const entry of [real, link]) {
    const run = spawnSync(process.execPath, [entry, "describe", "x.mp3"], { env: { ...process.env, WAMOTION_EARS_URL: "" }, encoding: "utf8" })
    // main() ran: it refuses without a URL (exit 2) instead of exiting 0 with nothing said
    assert.equal(run.status, 2, entry)
    assert.match(run.stderr, /WAMOTION_EARS_URL is not set/)
  }
})
