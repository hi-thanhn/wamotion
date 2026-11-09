# Data source

The real git history of Remotion, https://github.com/remotion-dev/remotion, cloned 2026-11-09 with
`git clone --filter=blob:none` (commit in `HEAD.txt`). The source is under the Remotion License
(`LICENSE-remotion.md`: free for individuals and small companies, source available); only the
commit metadata and file paths are used here, no source code and no Remotion logo or brand mark.

- `commits.tsv` — all 40,869 commits, newest first, tab-separated: hash, ISO date, author, subject.
  First commit 2020-06-23 21:49:07 +0200, latest 2026-11-09.
- `tree-HEAD.txt` — the 14,753 file paths in the repository at HEAD (directories are the path segments).
- `git-log.txt` — the same commits with the list of files each one touched (one path per line under a
  `COMMIT<TAB>hash<TAB>date<TAB>author<TAB>subject` line). It covers the 10,417 most recent commits (back to 2026-02-18);
  older trees could not be fetched, so for earlier commits only `commits.tsv` (complete) gives the timing.

Credit line: "Commit history: github.com/remotion-dev/remotion". Authors' names are in the data; show them
only in aggregate (a count), not as a list.
