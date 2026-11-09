# ears — an earshot server for the wamotion skill

[earshot](https://github.com/Leonxlnx/earshot) (MIT) kept warm in one process on one machine, so `hear.sh` in the
`wamotion` skill can hear a film without installing 4 GB of Python and torch on every laptop and without reloading
the models for every command. Optional: the skill works without ears, and a local earshot install works without this.

Every allowed earshot command is one endpoint, and the service runs the real `earshot` command line in-process, so a
call answers with the same text and `--json` as a local install at the same commit (`591fa3e`).

## API

```
GET  /v1/health           no token  → {ok, earshot:{version, commit}, models:{warm, loadSec}, queue:{running, waiting, max}, limits}
GET  /v1/commands         no token  → {commands:[…], how}
POST /v1/<command>        Authorization: Bearer <token>
                          multipart: args = JSON array of the command's arguments, plus one field per file
                          → {command, code, stdout, stderr, files:{name: base64}, timing:{queuedSec, wallSec, cpuSec}, input:{bytes, mediaSec}}
```

Commands: `measure describe match rank find compare ab realness timeline sheet critique`.
In `args`, files are not paths: upload each as a multipart field and write `@<field>`; for a file earshot should write
(`sheet -o`, `--out`) write `@out:<name>` and read it back from `files`. Everything else is passed to earshot unchanged.
`code ≠ 0` is still HTTP 200 — the earshot error is in `stderr`, as on the command line.

```bash
curl -s -H "Authorization: Bearer $WAMOTION_EARS_TOKEN" -F 'args=["@film","--fast","--json"]' -F film=@out/film.mp4 \
  https://ears.example.com/v1/critique | jq -r .stdout | jq .verdict
```

Errors: 400 bad argv (a path, or `-o` without `@out:`) · 401 no or unknown token · 404 unknown command · 413 over
`MAX_UPLOAD_MB` · 422 media over `MAX_MEDIA_SEC` · 429 queue full (`Retry-After`) · 504 job over `JOB_TIMEOUT_SEC` (the
service then restarts itself).

Tokens: static tokens from `WAMOTION_EARS_TOKENS` (`name:token,…`), or, when `WAMOTION_WEB_URL` is set, a session
token of a [Better Auth](https://www.better-auth.com) server with the bearer plugin (checked at
`<url>/api/auth/get-session`, cached 10 min). The token only names the caller in `usage.jsonl` (bytes, media seconds,
queue, wall and CPU seconds per job). There is no quota.

Uploads are stored by content hash under `/data/in` for `KEEP_INPUT_HOURS` (24) so a film asked about several times reuses
earshot's caches, then deleted together with earshot's decoded-audio cache. No sound library lives on this machine.

## Run

```bash
# dev, without earshot (tests use a fake CLI)
uv venv --python 3.12 .venv && uv pip install --python .venv/bin/python -e '.[test]' && .venv/bin/pytest

# docker on this machine (arm64 or amd64); models download into the volume on first start, or mount an existing earshot hf cache
# (ffmpeg 9 is a pinned static build inside the image, not Debian's 7.1: the two decode frames ~15 % apart and a borderline
#  cut flips — if a volume holds caches made by an older image, clear /data/earshot/emb/video and /data/earshot/decoded)
docker build -t wamotion-ears:local .
docker run -d --name wamotion-ears -p 8000:8000 -v ears-data:/data -e WAMOTION_EARS_TOKENS=dev:devtoken wamotion-ears:local
curl -s localhost:8000/v1/health

# then, for the skill
export WAMOTION_EARS_URL=http://localhost:8000 WAMOTION_EARS_TOKEN=devtoken

# one remote machine with TLS (Caddy): fill deploy/.env (or let the script write it), then
deploy/deploy.sh user@host
```

Environment: `WAMOTION_EARS_TOKENS`, `WAMOTION_WEB_URL` (optional), `MAX_UPLOAD_MB` (300), `MAX_MEDIA_SEC` (600),
`QUEUE_MAX` (8), `JOB_TIMEOUT_SEC` (900), `KEEP_INPUT_HOURS` (24), `EARSHOT_THREADS` (cores − 1), `PORT` (8000),
`WAMOTION_EARS_DATA` (/data), `EARSHOT_HOME` (/data/earshot).

## Client

`skills/wamotion/scripts/ears-client.mjs`, used by `hear.sh` when `WAMOTION_EARS_URL` is set. It falls back to a local
earshot install when the server does not answer, and prints one line and exits 0 when there is neither.
