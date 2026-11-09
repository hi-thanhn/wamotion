"""Settings, all from environment variables. Nothing here is read by a client."""
from __future__ import annotations

import os
from dataclasses import dataclass, field

# earshot commands the API runs. Not here on purpose: forge / fit / gallery (write files anywhere), sfx / kit (no models,
# run locally), profile (built locally, sent as --profile @f), llm (uploads audio to Gemini), mcp, doctor.
ALLOWED_COMMANDS = ("measure", "describe", "match", "rank", "find", "compare", "ab", "realness", "timeline", "sheet", "critique")


def _int(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    try:
        return int(raw) if raw else default
    except ValueError:
        return default


def parse_static_tokens(raw: str) -> dict[str, str]:
    """`WAMOTION_EARS_TOKENS="alice:tok1,bob:tok2"` or bare `tok1,tok2` → {token: name}. Names appear in usage.jsonl, tokens never."""
    out: dict[str, str] = {}
    for i, item in enumerate(x.strip() for x in raw.split(",")):
        if not item:
            continue
        name, sep, token = item.partition(":")
        if sep and token:
            out[token.strip()] = f"static:{name.strip() or i}"
        else:
            out[name] = f"static:{i}"
    return out


@dataclass
class Settings:
    data_dir: str = field(default_factory=lambda: os.environ.get("WAMOTION_EARS_DATA", os.path.abspath("data")))
    earshot_home: str | None = field(default_factory=lambda: os.environ.get("EARSHOT_HOME") or None)
    web_url: str | None = field(default_factory=lambda: (os.environ.get("WAMOTION_WEB_URL") or "").rstrip("/") or None)
    static_tokens: dict[str, str] = field(default_factory=lambda: parse_static_tokens(os.environ.get("WAMOTION_EARS_TOKENS", "")))
    max_upload_bytes: int = field(default_factory=lambda: _int("MAX_UPLOAD_MB", 300) * 1024 * 1024)
    max_media_sec: int = field(default_factory=lambda: _int("MAX_MEDIA_SEC", 600))
    queue_max: int = field(default_factory=lambda: _int("QUEUE_MAX", 8))
    job_timeout_sec: int = field(default_factory=lambda: _int("JOB_TIMEOUT_SEC", 900))
    keep_input_hours: int = field(default_factory=lambda: _int("KEEP_INPUT_HOURS", 24))
    session_cache_sec: int = field(default_factory=lambda: _int("SESSION_CACHE_SEC", 600))
    port: int = field(default_factory=lambda: _int("PORT", 8000))

    def __post_init__(self) -> None:
        if not self.earshot_home:
            self.earshot_home = os.path.join(self.data_dir, "earshot")

    @property
    def input_dir(self) -> str:
        return os.path.join(self.data_dir, "in")

    @property
    def jobs_dir(self) -> str:
        return os.path.join(self.data_dir, "jobs")

    @property
    def usage_path(self) -> str:
        return os.path.join(self.data_dir, "usage.jsonl")
