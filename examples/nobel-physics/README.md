# Nobel physics

The Nobel Prize API's physics laureates, read as a table in Polars (one row per prize; John Bardeen has two), counted per decade and by country of birth. Statistics: a trend with an uncertainty band. The mean age at the award stayed near 50 until the 1960s and passed 70 in the 2020s; the band is the 95% interval of each decade's mean, and the ages' own spread is far wider. Caveats: age is award year minus birth year (within a year), a decade holds only 7 to 28 laureates (the 2020s are not over), and a rising age may reflect a longer wait between discovery and prize rather than older discoverers. Hover a dot for the laureate; click it for Wikipedia.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-nobel-physics) · [open the example](https://www.seebra.io/?example=nobel-physics) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fnobel-physics) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Nobel Prize API: <https://api.nobelprize.org/2.1>

## Steps

Queries:

- [Physics laureates](.seebra/query/a95130d8-8894-51d4-bef7-a151c4897fa5.json)

Transformations:

- [Prizes](transforms/prizes.polars.py) (polars)
- [Per decade](transforms/per-decade.polars.py) (polars)
- [Age at the award per decade (mean, 95% interval, spread)](transforms/age-at-the-award-per-decade-mean-95-interval.polars.py) (polars)

Graphs:

- [Laureates per decade, by country of birth](graphs/laureates-per-decade-by-country-of-birth.js)
- [Age at the award: a trend with its uncertainty band](graphs/age-at-the-award-a-trend-with-its-uncertainty.js)

Tables:

- Laureates

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/nobel-physics`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
