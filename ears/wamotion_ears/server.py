"""The HTTP surface.

GET  /v1/health            no token: version, whether the models are warm, queue depth
GET  /v1/commands          no token: the commands this API runs and how to send files
POST /v1/<command>         Bearer token; multipart with `args` (JSON array) and the files argv refers to as @<field>
                           → 200 {command, code, stdout, stderr, files, timing, input} — code ≠ 0 is still 200: the
                             earshot error is in stderr, as on the command line
Errors: 400 bad argv · 401 no/unknown token · 404 unknown command · 413 too many bytes · 422 media too long ·
        429 queue full (Retry-After) · 504 job over the time limit
"""
from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import os
import shutil
import subprocess
import time
import uuid
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, Header, Request
from fastapi.responses import JSONResponse

from . import EARSHOT_COMMIT, __version__, usage
from .argv import ArgvError, resolve, safe_name
from .auth import Auth
from .config import ALLOWED_COMMANDS, Settings
from .jobs import JobTimeout, Jobs, QueueFull, exit_for_restart

FIXED_MTIME = 1_600_000_000  # earshot keys its caches on path|size|mtime|content: same upload → same key across jobs

HOW_TO_SEND = ("POST multipart to /v1/<command> with a field `args` holding a JSON array of the command's arguments. Files are "
               "not paths: upload each as its own multipart field and write @<field> in args; for a file earshot should write "
               "(sheet -o, --out) write @out:<name> and read it back from `files`. Everything else — flags, queries, numbers — "
               "is passed to earshot unchanged. Example: args=[\"@film\",\"--fast\",\"--json\"] with a file field `film`.")


def _error(status: int, message: str, **extra: Any) -> JSONResponse:
    return JSONResponse({"error": message, **extra}, status_code=status)


def media_seconds(path: str) -> float | None:
    """duration by ffprobe; None when the file is not media (earshot will say so itself)"""
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", path],
                             capture_output=True, text=True, timeout=30, check=False).stdout
        value = json.loads(out or "{}").get("format", {}).get("duration")
        return float(value) if value is not None else None
    except (OSError, ValueError, subprocess.TimeoutExpired):
        return None


def earshot_version() -> str | None:
    try:
        from earshot import __version__ as v
        return str(v)
    except Exception:  # noqa: BLE001
        return None


async def _store_upload(settings: Settings, field: str, upload, budget: list[int]) -> str:
    """content-addressed path under <data>/in/<sha1>/<name>, mtime fixed; raises ValueError when the byte budget is spent"""
    sha = hashlib.sha1()
    tmp = os.path.join(settings.input_dir, f".tmp-{uuid.uuid4().hex}")
    os.makedirs(settings.input_dir, exist_ok=True)
    with open(tmp, "wb") as fh:
        while chunk := await upload.read(1024 * 1024):
            budget[0] -= len(chunk)
            if budget[0] < 0:
                fh.close()
                os.unlink(tmp)
                raise ValueError("too large")
            sha.update(chunk)
            fh.write(chunk)
    name = safe_name(upload.filename or field, field)
    folder = os.path.join(settings.input_dir, sha.hexdigest())
    os.makedirs(folder, exist_ok=True)
    final = os.path.join(folder, name)
    if os.path.exists(final):
        os.unlink(tmp)
    else:
        os.replace(tmp, final)
        os.utime(final, (FIXED_MTIME, FIXED_MTIME))
    os.utime(folder, None)  # the folder's mtime is "last used": the pruner reads it
    return final


def prune(settings: Settings, now: float | None = None) -> int:
    """delete uploads and decoded-audio cache older than KEEP_INPUT_HOURS; returns how many entries went"""
    now = now or time.time()
    cutoff = now - settings.keep_input_hours * 3600
    gone = 0
    for root in (settings.input_dir, settings.jobs_dir):
        if not os.path.isdir(root):
            continue
        for entry in os.scandir(root):
            try:
                if entry.stat().st_mtime < cutoff:
                    shutil.rmtree(entry.path, ignore_errors=True) if entry.is_dir() else os.unlink(entry.path)
                    gone += 1
            except OSError:
                pass
    decoded = os.path.join(settings.earshot_home or "", "decoded")
    if os.path.isdir(decoded):
        for entry in os.scandir(decoded):
            try:
                if entry.is_file() and entry.stat().st_mtime < cutoff:
                    os.unlink(entry.path)
                    gone += 1
            except OSError:
                pass
    return gone


def create_app(settings: Settings | None = None, jobs: Jobs | None = None, auth: Auth | None = None,
               warm: bool = True) -> FastAPI:
    settings = settings or Settings()
    if settings.earshot_home:
        os.environ.setdefault("EARSHOT_HOME", settings.earshot_home)
    jobs = jobs or Jobs(queue_max=settings.queue_max, timeout_sec=settings.job_timeout_sec, on_timeout=exit_for_restart)
    auth = auth or Auth(settings.static_tokens, settings.web_url, cache_sec=settings.session_cache_sec)
    for d in (settings.input_dir, settings.jobs_dir):
        os.makedirs(d, exist_ok=True)

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        if not auth.configured:
            print("wamotion-ears: WARNING no WAMOTION_WEB_URL and no WAMOTION_EARS_TOKENS — every call will be 401", flush=True)
        if warm:
            jobs.start_warm()

        async def pruner():
            while True:
                await asyncio.sleep(3600)
                await asyncio.get_running_loop().run_in_executor(None, prune, settings)
        task = asyncio.create_task(pruner())
        try:
            yield
        finally:
            task.cancel()

    app = FastAPI(title="Wamotion ears", version=__version__, lifespan=lifespan, docs_url=None, redoc_url=None)
    app.state.settings, app.state.jobs, app.state.auth = settings, jobs, auth

    @app.get("/v1/health")
    async def health() -> dict:
        h = jobs.health()
        return {
            "ok": True,
            "service": {"name": "wamotion-ears", "version": __version__, "uptimeSec": round(time.time() - jobs.started)},
            "earshot": {"version": earshot_version(), "commit": EARSHOT_COMMIT},
            "models": {k: v for k, v in h.items() if k != "queue"},
            "queue": h["queue"],
            "limits": {"maxUploadMb": settings.max_upload_bytes // (1024 * 1024), "maxMediaSec": settings.max_media_sec,
                       "jobTimeoutSec": settings.job_timeout_sec, "keepInputHours": settings.keep_input_hours},
        }

    @app.get("/v1/commands")
    async def commands() -> dict:
        return {"commands": list(ALLOWED_COMMANDS), "how": HOW_TO_SEND,
                "note": "Same earshot build and flags as a local install; `--json` gives the full result in stdout."}

    @app.post("/v1/{command}")
    async def run(command: str, request: Request, authorization: str | None = Header(default=None)):
        if command not in ALLOWED_COMMANDS:
            return _error(404, f"unknown command {command!r}; this API runs: {', '.join(ALLOWED_COMMANDS)}")
        who = await auth.who(authorization)
        if not who:
            return _error(401, "send `Authorization: Bearer <token>` — a Wamotion session token, or a token the operator gave you "
                               "(WAMOTION_EARS_TOKEN on your side)")
        try:
            form = await request.form()
        except Exception as e:  # noqa: BLE001
            return _error(400, f"could not read the multipart body: {type(e).__name__}")
        raw_args = form.get("args")
        try:
            args = json.loads(raw_args) if isinstance(raw_args, str) else []
        except ValueError:
            return _error(400, "`args` must be a JSON array of strings")

        job_dir = os.path.join(settings.jobs_dir, uuid.uuid4().hex)
        out_dir = os.path.join(job_dir, "out")
        os.makedirs(out_dir, exist_ok=True)
        uploads: dict[str, str] = {}
        in_bytes = 0
        budget = [settings.max_upload_bytes]
        media_sec: float | None = None
        try:
            for field, value in form.multi_items():
                if field == "args" or isinstance(value, str):
                    continue
                try:
                    path = await _store_upload(settings, field, value, budget)
                except ValueError:
                    return _error(413, f"the files of one request may total at most {settings.max_upload_bytes // (1024 * 1024)} MB")
                uploads[field] = path
                in_bytes += os.path.getsize(path)
                seconds = await asyncio.get_running_loop().run_in_executor(None, media_seconds, path)
                if seconds is not None:
                    media_sec = max(media_sec or 0.0, seconds)
                    if seconds > settings.max_media_sec:
                        return _error(422, f"{os.path.basename(path)} is {seconds:.0f} s of media; this API takes files up to "
                                           f"{settings.max_media_sec} s — trim it (earshot's --start/--end work on the trimmed file)")
            try:
                argv, outs = resolve(args, uploads, out_dir)
            except ArgvError as e:
                return _error(400, str(e))
            try:
                result = await jobs.run([command, *argv])
            except QueueFull:
                return JSONResponse({"error": f"the ears are busy ({jobs.queue_max} jobs queued); try again in a minute"},
                                    status_code=429, headers={"Retry-After": "60"})
            except JobTimeout:
                return _error(504, f"the job ran past {settings.job_timeout_sec} s and was stopped; the service restarts itself")
            files: dict[str, str] = {}
            for name, path in outs.items():
                if os.path.isfile(path):
                    with open(path, "rb") as fh:
                        files[name] = base64.b64encode(fh.read()).decode("ascii")
            # stdout may name the server-side output path (sheet prints `png`); give the client its own name back
            stdout = result.stdout
            for name, path in outs.items():
                stdout = stdout.replace(path, name)
            usage.record(settings.usage_path, user=who, command=command, bytes=in_bytes, mediaSec=media_sec and round(media_sec, 2),
                         queuedSec=round(result.queued_sec, 2), wallSec=round(result.wall_sec, 2), cpuSec=round(result.cpu_sec, 2),
                         code=result.code)
            return {
                "command": command,
                "code": result.code,
                "stdout": stdout,
                "stderr": result.stderr,
                "files": files,
                "timing": {"queuedSec": round(result.queued_sec, 2), "wallSec": round(result.wall_sec, 2),
                           "cpuSec": round(result.cpu_sec, 2)},
                "input": {"bytes": in_bytes, "mediaSec": media_sec and round(media_sec, 2)},
            }
        finally:
            shutil.rmtree(job_dir, ignore_errors=True)

    return app
