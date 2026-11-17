# The skip zone: why far stations hear you and near ones don't

Live ionosonde readings (GIRO via KC2G): foF2, the secant law MUF = foF2·sec i, and the skip distance per amateur band.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-ionosphere-skip-zone) · [open the example](https://www.seebra.io/?example=ionosphere-skip-zone) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fionosphere-skip-zone) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- KC2G ionosonde stations (GIRO data): <https://prop.kc2g.com>

## Steps

Queries:

- [Newest ionogram per station](.seebra/query/83ccce87-93a6-54a8-8eed-bc4f0a038ea2.json)

Transformations:

- [Stations heard in the last 3 hours](transforms/stations-heard-in-the-last-3-hours.polars.py) (polars)
- [Hop distances 0–4000 km](transforms/hop-distances-0-4000-km.polars.py) (polars)
- [Secant law: MUF against distance](transforms/secant-law-muf-against-distance.sql) (sql)
- [Measured M(3000)F2 vs the mirror model](transforms/measured-m-3000-f2-vs-the-mirror-model.sql) (sql)
- [Skip distance per band and station](transforms/skip-distance-per-band-and-station.polars.py) (polars)
- [Skip zone per band](transforms/skip-zone-per-band.polars.py) (polars)

Graphs:

- [The ionosondes now](graphs/the-ionosondes-now.js)
- [MUF against distance: the skip zone](graphs/muf-against-distance-the-skip-zone.js)
- [M(3000)F2: measured vs mirror model](graphs/m-3000-f2-measured-vs-mirror-model.js)
- [foF2 against local solar time](graphs/fof2-against-local-solar-time.js)

Tables:

- Stations: foF2, hmF2, MUF(3000)
- Skip zone per band

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/ionosphere-skip-zone`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
