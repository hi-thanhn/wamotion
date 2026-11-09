"""One JSON line per job: who, which command, how many bytes and seconds of media, how long it queued and
ran, how many CPU seconds it cost, the exit code. For measuring only — nothing reads this to allow or refuse a call.
"""
from __future__ import annotations

import json
import os
import sys
import threading
import time

ROTATE_BYTES = 50 * 1024 * 1024
_lock = threading.Lock()


def record(path: str, **fields) -> dict:
    row = {"ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), **fields}
    line = json.dumps(row, ensure_ascii=False, separators=(",", ":"))
    print(f"usage {line}", file=sys.stderr, flush=True)
    with _lock:
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            if os.path.exists(path) and os.path.getsize(path) > ROTATE_BYTES:
                os.replace(path, path + ".1")
            with open(path, "a", encoding="utf-8") as fh:
                fh.write(line + "\n")
        except OSError as e:
            print(f"wamotion-ears: could not write {path}: {e}", file=sys.stderr, flush=True)
    return row
