# Rhubarb Lip Sync 1.14.0 — MIT (see LICENSE.md, copied from the release zip)

- Release: https://github.com/DanielSWolf/rhubarb-lip-sync/releases/tag/v1.14.0
- macOS zip: https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.14.0/Rhubarb-Lip-Sync-1.14.0-macOS.zip
  (x86_64 only; on this Apple-silicon Mac it exits with SIGSEGV (139) under Rosetta before analysing anything)
- Linux zip: https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.14.0/Rhubarb-Lip-Sync-1.14.0-Linux.zip
  — this is the one actually used, run through Docker (`--platform linux/amd64`, `debian:bookworm-slim`) by `scripts/lipsync.sh`.
- The binaries (~160 MB with the PocketSphinx models) are not committed; the script downloads them into `tools/rhubarb/bin/`.
- LICENSE.md also lists Rhubarb's bundled third-party components (PocketSphinx, Flite, WebRTC VAD, …).
