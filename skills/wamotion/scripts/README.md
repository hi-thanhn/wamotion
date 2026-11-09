# Scripts

Nothing to install: run each with the system's Node (≥ 20) or bash, from any folder, by
its full path — `node <skill>/scripts/sound.mjs search "soft paper slide"`,
`node <skill>/scripts/tempo.mjs music/track.mp3`, `bash <skill>/scripts/hear.sh out/film.mp4`.
`sound.mjs` reads `../bank/` relative to itself and prints JSON; paths it prints are relative
to the folder you run it from. `tempo.mjs` decodes with `ffmpeg` on PATH, or with Remotion's
bundled ffmpeg (`npx --no-install remotion ffmpeg`) when run inside a Remotion project.
`hear.sh` uses an earshot install at `~/Library/Application Support/wamotion/earshot` (macOS)
or `$XDG_DATA_HOME/wamotion/earshot`; `WAMOTION_EARSHOT_DIR` points it elsewhere. With
`WAMOTION_EARS_URL` (+ `WAMOTION_EARS_TOKEN`) set it runs the command on an ears server you
host yourself (`ears/` in the repository) through `ears-client.mjs` instead (files are
uploaded, `-o`/`--out` files written back, same stdout and exit code), falling back to the
local install when the server does not answer. With neither it prints one line and exits 0.
Every earshot command is described in `../references/ears.md`;
`node --test scripts/ears-client.test.mjs` checks the client without a network.

`sound.mjs search "<words>" --ears` ranks by words first, then hands the best 30 matches (with `--kind`, every sound
of that kind) to `hear.sh rank` (found next to `sound.mjs`) and returns them in earshot's order, each with an
`ears` object (`z`, `cosine`, `verdict`, `soundsMostLike`) next to the word `score`. It takes
about 8 s (one earshot process loading its model; about 1 s when the same query was asked
before). Without earshot it returns the word order with a `note` saying so.
