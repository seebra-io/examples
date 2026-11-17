# Uppsala since 1840: when warming leaves the noise

Uppsala's daily minimum temperature since 1840, read as one CSV straight from NOAA's public GHCN-Daily S3 bucket. Every season warmed about 3 °C against 1850–1900, but signal-to-noise is 1.4 in winter and 3.5 in summer: 28 of the last 30 summers were warmer than any pre-industrial one, against 14 of 30 winters (time of emergence). The frost-free season grew from 118 to 151 days. Caveats: not homogenised, urban heat island, gaps.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-uppsala-time-of-emergence) · [open the example](https://www.seebra.io/?example=uppsala-time-of-emergence) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fuppsala-time-of-emergence) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- NOAA GHCN-Daily on AWS (public S3 bucket): <https://s3.amazonaws.com>

## Steps

Queries:

- [Uppsala, every day since 1836 (CSV object)](.seebra/query/664c57cf-2e66-5363-a56b-482bf16783cb.json)

Transformations:

- [Daily minima with seasons](transforms/daily-minima-with-seasons.sql) (sql)
- [Season means per year](transforms/season-means-per-year.sql) (sql)
- [Signal, noise and emergence per season](transforms/signal-noise-and-emergence-per-season.sql) (sql)
- [Anomalies vs 1850–1900](transforms/anomalies-vs-1850-1900.sql) (sql)
- [Frost nights and the frost-free season](transforms/frost-nights-and-the-frost-free-season.sql) (sql)
- [Frost in 30-year periods](transforms/frost-in-30-year-periods.sql) (sql)

Graphs:

- [Every season warmed about 3 °C](graphs/every-season-warmed-about-3-c.js)
- [Same warming, different noise: summer has emerged](graphs/same-warming-different-noise-summer-has-emerged.js)
- [The frost-free season, 1840–2025](graphs/the-frost-free-season-1840-2025.js)

Tables:

- Signal-to-noise per season
- Frost per 30-year period

Studies:

- [Has summer emerged from its noise, and winter not?](.seebra/study/a9a5b1a9-7a85-5a12-a61b-2ff15840b5db.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/uppsala-time-of-emergence`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
