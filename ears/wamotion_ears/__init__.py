"""Wamotion ears API: earshot kept warm in one process, every allowed earshot command one HTTP endpoint."""

__version__ = "0.1.0"

# The earshot commit the wamotion skill pins (skills/wamotion/scripts/hear.sh) — the same one the Dockerfile installs,
# so the API and a local install answer with the same numbers for the same file.
EARSHOT_COMMIT = "591fa3e028032e6dce56620a20e932e35667e8d8"
