"""The one place a client's argv is turned into the argv earshot runs.

A client sends the earshot command's arguments exactly as it would type them, except that files are not paths:
  `@<field>`      the uploaded multipart field of that name
  `@out:<name>`   a file earshot should write and the API should return (the value of `-o` / `--out`)
Every other token is passed through unchanged. Paths are refused: a token that starts with `/` or `~`, or contains `/`,
`\\` or `..`, is an error — the server never reads a file the client did not upload in this request.
"""
from __future__ import annotations

import os
import re

OUT_PREFIX = "@out:"
_SAFE_NAME = re.compile(r"[^A-Za-z0-9._-]+")


class ArgvError(ValueError):
    """a 400 for the client, worded for the agent that will read it"""


def safe_name(name: str, fallback: str = "file") -> str:
    """a bare file name: no directories, no odd characters, never empty, never a dot-file"""
    base = os.path.basename(name.replace("\\", "/")).strip()
    base = _SAFE_NAME.sub("_", base).lstrip(".")
    return base[:120] or fallback


def resolve(args: list[str], uploads: dict[str, str], out_dir: str) -> tuple[list[str], dict[str, str]]:
    """(argv for earshot, {returned file name: absolute path}) or ArgvError"""
    if not isinstance(args, list) or not all(isinstance(a, str) for a in args):
        raise ArgvError("args must be a JSON array of strings")
    argv: list[str] = []
    outs: dict[str, str] = {}
    previous = ""
    for token in args:
        if token.startswith(OUT_PREFIX):
            name = safe_name(token[len(OUT_PREFIX):], "out")
            path = os.path.join(out_dir, name)
            outs[name] = path
            argv.append(path)
        elif token.startswith("@") and len(token) > 1:
            field = token[1:]
            if field not in uploads:
                raise ArgvError(f"{token} refers to an uploaded file, but no multipart field named {field!r} was sent "
                                f"(fields sent: {', '.join(sorted(uploads)) or 'none'})")
            argv.append(uploads[field])
        else:
            if token.startswith(("/", "~")) or "/" in token or "\\" in token or ".." in token:
                raise ArgvError(f"{token!r} looks like a path; the API reads only files uploaded in this request — "
                                "send the file as a multipart field and write @<field> in its place")
            if token.startswith("--out=") or (token.startswith("-o") and len(token) > 2 and not token.startswith("--")):
                raise ArgvError("write the output file as `-o @out:<name>` (or `--out @out:<name>`); it is returned in `files`")
            argv.append(token)
        if previous in ("-o", "--out") and not argv[-1].startswith(out_dir):
            raise ArgvError(f"the value of {previous} must be @out:<name>; the API returns that file in `files`")
        previous = token
    return argv, outs
