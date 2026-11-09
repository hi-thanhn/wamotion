"""Who is calling: a Bearer session token checked against an optional Better Auth server (WAMOTION_WEB_URL)
(`GET /api/auth/get-session`, bearer plugin), or a static token from WAMOTION_EARS_TOKENS. The answer is only a name for
usage.jsonl — there is no quota and no tier. Raw tokens are never kept: the cache is keyed on a hash.
"""
from __future__ import annotations

import hashlib
import time
from typing import Awaitable, Callable

import httpx

# (status, user id or None) for a token — injectable for tests
SessionLookup = Callable[[str], Awaitable[tuple[int, str | None]]]


def bearer(header: str | None) -> str | None:
    if not header:
        return None
    scheme, _, token = header.strip().partition(" ")
    return token.strip() or None if scheme.lower() == "bearer" else None


class Auth:
    def __init__(self, static_tokens: dict[str, str], web_url: str | None, cache_sec: int = 600, negative_sec: int = 60,
                 lookup: SessionLookup | None = None) -> None:
        self.static = dict(static_tokens)
        self.web_url = web_url
        self.cache_sec = cache_sec
        self.negative_sec = negative_sec
        self._lookup = lookup or self._better_auth
        self._cache: dict[str, tuple[float, str | None]] = {}

    @property
    def configured(self) -> bool:
        return bool(self.static) or self.web_url is not None

    async def _better_auth(self, token: str) -> tuple[int, str | None]:
        assert self.web_url
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"{self.web_url}/api/auth/get-session", headers={"authorization": f"Bearer {token}"})
        if r.status_code != 200:
            return r.status_code, None
        try:
            data = r.json()
        except ValueError:
            return 502, None
        user = (data or {}).get("user") if isinstance(data, dict) else None
        uid = user.get("id") if isinstance(user, dict) else None
        return (200, str(uid)) if uid else (401, None)

    async def who(self, authorization: str | None) -> str | None:
        """a name for the caller, or None when the token is missing or not accepted"""
        token = bearer(authorization)
        if not token:
            return None
        if token in self.static:
            return self.static[token]
        if not self.web_url:
            return None
        key = hashlib.sha256(token.encode()).hexdigest()
        hit = self._cache.get(key)
        now = time.time()
        if hit and hit[0] > now:
            return hit[1]
        try:
            status, uid = await self._lookup(token)
        except (httpx.HTTPError, OSError):
            status, uid = 503, None
        # a web outage must not lock everyone out for long, nor let anyone in: short negative cache, no positive guess
        ttl = self.cache_sec if uid else (self.negative_sec if status in (401, 403) else 5)
        self._cache[key] = (now + ttl, f"user:{uid}" if uid else None)
        if len(self._cache) > 5000:
            for k in [k for k, (exp, _) in self._cache.items() if exp <= now][:1000]:
                self._cache.pop(k, None)
        return self._cache[key][1]
