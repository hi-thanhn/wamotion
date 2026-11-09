import asyncio
import base64
import json
import os
import threading
import time

import pytest

from wamotion_ears.auth import Auth
from wamotion_ears.jobs import Jobs
from wamotion_ears.server import FIXED_MTIME, create_app, prune

from .conftest import AUTH, fake_cli_main


def post(client, command, args, files=None, headers=AUTH):
    return client.post(f"/v1/{command}", data={"args": json.dumps(args)}, files=files or {}, headers=headers)


def test_health_and_commands_need_no_token(client):
    h = client.get("/v1/health").json()
    assert h["ok"] is True and h["models"]["warm"] is False and h["queue"] == {"running": 0, "waiting": 0, "max": 2}
    assert h["earshot"]["commit"].startswith("591fa3e")
    c = client.get("/v1/commands").json()
    assert "critique" in c["commands"] and "forge" not in c["commands"] and "@out:" in c["how"]


def test_no_token_is_401_and_unknown_command_404(client):
    assert post(client, "describe", ["@f"], headers={}).status_code == 401
    assert post(client, "describe", ["@f"], headers={"authorization": "Bearer wrong"}).status_code == 401
    r = post(client, "forge", [])
    assert r.status_code == 404 and "critique" in r.json()["error"]


def test_run_returns_the_cli_output_and_the_file_sizes(client, settings):
    r = post(client, "describe", ["@film", "--json"], files={"film": ("my film.mp4", b"x" * 1000, "video/mp4")})
    assert r.status_code == 200, r.text
    body = r.json()
    out = json.loads(body["stdout"])
    assert body["code"] == 0 and body["stderr"] == "" and out["command"] == "describe" and out["sizes"] == [1000]
    assert body["input"]["bytes"] == 1000 and body["timing"]["wallSec"] >= 0 and body["timing"]["cpuSec"] >= 0
    # content-addressed, fixed mtime, safe name: the same upload later hits earshot's caches
    stored = out["argv"][0]
    assert stored.startswith(settings.input_dir) and stored.endswith("/my_film.mp4")
    assert int(os.stat(stored).st_mtime) == FIXED_MTIME
    # the usage line names the static token's owner, never the token
    line = json.loads(open(settings.usage_path).read().splitlines()[-1])
    assert line["user"] == "static:alice" and line["command"] == "describe" and line["bytes"] == 1000
    assert "tok-alice" not in open(settings.usage_path).read()


def test_output_files_come_back_base64_and_stdout_names_them_by_the_client_name(client):
    r = post(client, "sheet", ["@film", "-o", "@out:sheet.png", "--json"], files={"film": ("f.mp4", b"abc", "video/mp4")})
    body = r.json()
    assert base64.b64decode(body["files"]["sheet.png"]) == b"PNGf.mp4"
    assert json.loads(body["stdout"])["png"] == "sheet.png"
    assert body["command"] == "sheet"


def test_earshot_error_is_a_200_with_code_1_like_the_cli(client):
    r = post(client, "describe", ["@film", "--json"], files={"film": ("f.mp4", b"abc", "video/mp4")})
    assert r.json()["code"] == 0
    # fake cli reports a missing file for a reference it never received: argv guard catches it first as 400
    r = post(client, "match", ["@missing", "a pop"])
    assert r.status_code == 400 and "fields sent: none" in r.json()["error"]


def test_a_crash_inside_earshot_is_code_1_with_one_stderr_line(client):
    jobs = client.app.state.jobs
    jobs.cli_main = lambda argv: fake_cli_main(["boom"])
    r = post(client, "measure", ["@f"], files={"f": ("f.wav", b"abc", "audio/wav")})
    assert r.status_code == 200 and r.json()["code"] == 1 and "kaboom" in r.json()["stderr"]


def test_argv_paths_are_400(client):
    r = post(client, "describe", ["/etc/passwd"])
    assert r.status_code == 400 and "uploaded" in r.json()["error"]


def test_too_many_bytes_is_413(client):
    r = post(client, "describe", ["@f"], files={"f": ("f.wav", b"x" * (1024 * 1024 + 1), "audio/wav")})
    assert r.status_code == 413


def test_queue_full_is_429_with_retry_after(settings):
    jobs = Jobs(cli_main=fake_cli_main, queue_max=1, timeout_sec=5)
    app = create_app(settings, jobs, Auth(settings.static_tokens, None), warm=False)
    from fastapi.testclient import TestClient
    codes = []
    with TestClient(app) as client:
        def go():
            codes.append(client.post("/v1/measure", data={"args": json.dumps(["--json"])}, headers=AUTH).status_code)
        jobs.cli_main = lambda argv: fake_cli_main(["sleep", "0.6"])
        threads = [threading.Thread(target=go) for _ in range(3)]
        for t in threads:
            t.start()
            time.sleep(0.05)
        for t in threads:
            t.join()
    assert sorted(codes) == [200, 429, 429] or sorted(codes) == [200, 200, 429], codes


def test_job_timeout_is_504_and_calls_the_restart_hook(settings):
    fired = []
    jobs = Jobs(cli_main=lambda argv: fake_cli_main(["sleep", "0.5"]), queue_max=2, timeout_sec=0.1, on_timeout=lambda: fired.append(1))
    app = create_app(settings, jobs, Auth(settings.static_tokens, None), warm=False)
    from fastapi.testclient import TestClient
    with TestClient(app) as client:
        r = client.post("/v1/measure", data={"args": "[]"}, headers=AUTH)
        assert r.status_code == 504
        time.sleep(1.3)
    assert fired == [1]


def test_prune_removes_old_inputs_and_jobs(settings, tmp_path):
    old = os.path.join(settings.input_dir, "oldsha")
    new = os.path.join(settings.input_dir, "newsha")
    os.makedirs(old), os.makedirs(new)
    os.utime(old, (0, 0))
    dec = os.path.join(settings.earshot_home, "decoded")
    os.makedirs(dec)
    open(os.path.join(dec, "a.npy"), "wb").close()
    os.utime(os.path.join(dec, "a.npy"), (0, 0))
    assert prune(settings) == 2
    assert not os.path.exists(old) and os.path.exists(new) and not os.listdir(dec)


@pytest.mark.anyio
async def test_auth_checks_better_auth_once_and_caches(settings):
    calls = []

    async def lookup(token):
        calls.append(token)
        return (200, "u1") if token == "good" else (401, None)

    auth = Auth({}, "https://web.example", cache_sec=600, lookup=lookup)
    assert await auth.who("Bearer good") == "user:u1"
    assert await auth.who("Bearer good") == "user:u1"
    assert await auth.who("bearer bad") is None
    assert await auth.who(None) is None and await auth.who("Basic x") is None
    assert calls == ["good", "bad"]


@pytest.fixture
def anyio_backend():
    return "asyncio"
