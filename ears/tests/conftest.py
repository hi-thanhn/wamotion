"""Tests run without earshot or torch: a fake `cli_main` stands in for `earshot.cli.main` and behaves like it —
prints JSON to stdout with --json, writes the file named after -o, exits 1 with one stderr line on a missing file."""
from __future__ import annotations

import json
import os
import sys
import time

import pytest
from fastapi.testclient import TestClient

from wamotion_ears.auth import Auth
from wamotion_ears.config import Settings
from wamotion_ears.jobs import Jobs
from wamotion_ears.server import create_app


def fake_cli_main(argv: list[str]) -> int:
    command, rest = argv[0], argv[1:]
    if command == "doctor":
        return 0
    if command == "sleep":
        time.sleep(float(rest[0]))
        return 0
    if command == "boom":
        raise RuntimeError("kaboom")
    files = [a for a in rest if os.path.sep in a and not a.startswith("-")]
    for f in files:
        if "/out/" in f:
            continue
        if not os.path.exists(f):
            print(f"earshot {command}: error: no such file: {f}", file=sys.stderr)
            return 1
    if "-o" in rest:
        out = rest[rest.index("-o") + 1]
        with open(out, "wb") as fh:
            fh.write(b"PNG" + os.path.basename(files[0]).encode() if files else b"PNG")
        result = {"png": out, "events": 3}
    else:
        result = {"command": command, "argv": rest, "sizes": [os.path.getsize(f) for f in files if os.path.exists(f)]}
    if "--json" in rest:
        sys.stdout.write(json.dumps(result, indent=1) + "\n")
    else:
        sys.stdout.write(f"{command} ok: {len(files)} file(s)\n")
    return 0


@pytest.fixture
def settings(tmp_path) -> Settings:
    return Settings(data_dir=str(tmp_path / "data"), earshot_home=str(tmp_path / "home"), web_url=None,
                    static_tokens={"tok-alice": "static:alice"}, max_upload_bytes=1024 * 1024, max_media_sec=600,
                    queue_max=2, job_timeout_sec=5, keep_input_hours=24)


@pytest.fixture
def jobs(settings) -> Jobs:
    return Jobs(cli_main=fake_cli_main, queue_max=settings.queue_max, timeout_sec=settings.job_timeout_sec)


@pytest.fixture
def client(settings, jobs):
    app = create_app(settings, jobs, Auth(settings.static_tokens, None), warm=False)
    with TestClient(app) as c:
        yield c


AUTH = {"authorization": "Bearer tok-alice"}
