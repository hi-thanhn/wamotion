"""`python -m wamotion_ears` — serve on 0.0.0.0:$PORT (8000). TLS and the public name belong to Caddy (deploy/)."""
import os

import uvicorn

from .config import Settings
from .server import create_app

if __name__ == "__main__":
    settings = Settings()
    os.environ.setdefault("EARSHOT_HOME", settings.earshot_home or "")
    if not os.environ.get("EARSHOT_THREADS"):
        os.environ["EARSHOT_THREADS"] = str(max(1, (os.cpu_count() or 2) - 1))  # a dedicated machine: use it, keep one core for I/O
    uvicorn.run(create_app(settings), host="0.0.0.0", port=settings.port, log_level="info", timeout_keep_alive=30)
