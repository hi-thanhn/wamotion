"""One worker thread, one earshot call at a time, models loaded once.

The job runs `earshot.cli.main(argv)` in this process with stdout/stderr captured, exactly what `python -m earshot …`
prints — so the API answers with the same text and JSON as a local install, and the CLAP + AST models stay warm between
calls like `earshot mcp --warm`. torch and the redirect are not thread-safe, hence the single worker.
"""
from __future__ import annotations

import asyncio
import contextlib
import io
import os
import resource
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from typing import Callable

CliMain = Callable[[list[str]], int | None]


class QueueFull(Exception):
    pass


class JobTimeout(Exception):
    pass


@dataclass
class Result:
    code: int
    stdout: str
    stderr: str
    queued_sec: float
    wall_sec: float
    cpu_sec: float


def earshot_cli_main(argv: list[str]) -> int | None:
    from earshot import cli  # imported here: the tests inject a fake and never need torch
    return cli.main(argv)


def _cpu_now() -> float:
    """CPU seconds of this process and its finished children (ffmpeg / ffprobe) — exact while one job holds the worker"""
    children = resource.getrusage(resource.RUSAGE_CHILDREN)
    return time.process_time() + children.ru_utime + children.ru_stime


class Jobs:
    def __init__(self, cli_main: CliMain = earshot_cli_main, queue_max: int = 8, timeout_sec: float = 900,
                 on_timeout: Callable[[], None] | None = None) -> None:
        self.cli_main = cli_main
        self.queue_max = queue_max
        self.timeout_sec = timeout_sec
        self.on_timeout = on_timeout
        self._executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="earshot")
        self._counts = threading.Lock()
        self.waiting = 0
        self.running = 0
        self.warm = False
        self.warm_error: str | None = None
        self.load_sec: float | None = None
        self.started = time.time()

    # ------------------------------------------------------------------------------------------------- warm-up
    def start_warm(self, fetch_models: bool = True) -> None:
        """load the models on the worker thread; the first job queues behind it"""
        self._executor.submit(self._warm, fetch_models)

    def _warm(self, fetch_models: bool) -> None:
        t = time.time()
        try:
            if fetch_models:
                # downloads the pinned model files that are missing from EARSHOT_HOME (about 1.1 GB the first time)
                code = self._capture(["doctor", "--fetch"]).code
                if code not in (0, None):
                    raise RuntimeError(f"earshot doctor --fetch exited with {code}")
            import numpy as np  # noqa: WPS433
            from earshot import features
            from earshot.models import ast, clap
            clap.get()
            ast.get()
            features.measure(np.random.RandomState(0).randn(48000).astype(np.float32) * 0.1)
            with contextlib.suppress(Exception):
                from earshot import vocab
                vocab.get()
            self.warm = True
            self.load_sec = round(time.time() - t, 1)
            print(f"wamotion-ears: models warm in {self.load_sec} s", file=sys.stderr, flush=True)
        except Exception as e:  # noqa: BLE001 — the API still answers; health says why the models are cold
            self.warm_error = f"{type(e).__name__}: {e}"
            print(f"wamotion-ears: warm-up failed: {self.warm_error}", file=sys.stderr, flush=True)

    # ------------------------------------------------------------------------------------------------- one job
    def _capture(self, argv: list[str]) -> Result:
        out, err = io.StringIO(), io.StringIO()
        t0, c0 = time.time(), _cpu_now()
        code: int | None
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            try:
                code = self.cli_main(argv)
            except SystemExit as e:  # argparse: usage error 2, --help 0
                code = e.code if isinstance(e.code, int) else (0 if e.code is None else 1)
            except Exception as e:  # noqa: BLE001 — earshot's own main already turns errors into one line; this is for the rest
                print(f"earshot {argv[0] if argv else ''}: error: {type(e).__name__}: {e}", file=err)
                code = 1
        return Result(code=code or 0, stdout=out.getvalue(), stderr=err.getvalue(), queued_sec=0.0,
                      wall_sec=time.time() - t0, cpu_sec=max(0.0, _cpu_now() - c0))

    def _run_sync(self, argv: list[str], queued_at: float) -> Result:
        with self._counts:
            self.waiting -= 1
            self.running += 1
        try:
            result = self._capture(argv)
            result.queued_sec = max(0.0, time.time() - queued_at - result.wall_sec)
            return result
        finally:
            with self._counts:
                self.running -= 1

    async def run(self, argv: list[str]) -> Result:
        with self._counts:
            if self.waiting + self.running >= self.queue_max:
                raise QueueFull()
            self.waiting += 1
        loop = asyncio.get_running_loop()
        future = loop.run_in_executor(self._executor, self._run_sync, argv, time.time())
        try:
            return await asyncio.wait_for(asyncio.shield(future), self.timeout_sec)
        except asyncio.TimeoutError:
            # a thread cannot be killed: tell the caller, then let the process be restarted (docker restart: always)
            if self.on_timeout:
                loop.call_later(1.0, self.on_timeout)
            raise JobTimeout() from None

    def health(self) -> dict:
        return {
            "warm": self.warm,
            "loadSec": self.load_sec,
            **({"error": self.warm_error} if self.warm_error else {}),
            "queue": {"running": self.running, "waiting": self.waiting, "max": self.queue_max},
        }


def exit_for_restart() -> None:
    sys.stderr.write("wamotion-ears: a job ran past JOB_TIMEOUT_SEC; exiting so the supervisor restarts the worker\n")
    sys.stderr.flush()
    os._exit(75)
