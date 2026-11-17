# Copenhagen's wettest days

Daily precipitation over Copenhagen 1940–2025 (Open-Meteo's ERA5 archive) and each year's wettest day. Statistics idea: extreme values: a Gumbel fit to the annual maxima gives return levels, the rain expected once in 10, 50 or 100 years on average, with 95% intervals, and the two halves of the record fitted apart. Caveats: a reanalysis grid cell smooths cloudbursts (2 July 2011), a 100-year level extrapolates, and the fit assumes a stable climate.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-copenhagen-rain-extremes) · [open the example](https://www.seebra.io/?example=copenhagen-rain-extremes) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fcopenhagen-rain-extremes) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- Open-Meteo historical weather (ERA5): <https://archive-api.open-meteo.com/v1>

## Steps

Queries:

- [Daily precipitation 1940–2025, Copenhagen](.seebra/query/84f92ab7-cfd4-5961-8718-863b06f0c73a.json)

Transformations:

- [Days](transforms/days.polars.py) (polars)
- [Each year's wettest day](transforms/each-year-s-wettest-day.polars.py) (polars)
- [All years and the two halves](transforms/all-years-and-the-two-halves.sql) (sql)
- [Extreme values: Gumbel fit and plotting positions](transforms/extreme-values-gumbel-fit-and-plotting-positions.polars.py) (polars)
- [Return levels (2 to 200 years) with 95% intervals](transforms/return-levels-2-to-200-years-with-95-intervals.polars.py) (polars)

Graphs:

- [Extreme values: Gumbel plot and return levels](graphs/extreme-values-gumbel-plot-and-return-levels.js)
- [The wettest day of each year](graphs/the-wettest-day-of-each-year.js)

Tables:

- Return levels per period
- Wettest day per year

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/copenhagen-rain-extremes`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
