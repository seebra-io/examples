# Life expectancy around the world

World Bank life expectancy at birth, each country's most recent year, joined in SQL with the World Bank's country list for region and income group (aggregates such as 'World' dropped) and with GDP per capita, with a summary per region. A least-squares regression of life expectancy on log GDP per capita shows how strongly the two go together, with a 95% band for the line, and which countries live longer or shorter than their income predicts; it is a correlation, not a cause.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-life-expectancy) · [open the example](https://www.seebra.io/?example=life-expectancy) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Flife-expectancy) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Health

## Sources

- World Bank: <https://api.worldbank.org/v2>

## Steps

Queries:

- [Life expectancy, latest](.seebra/query/b909c484-4b39-5e98-bf2a-88ffc2d6423f.json)
- [Countries](.seebra/query/afcd2242-ddbc-5ea5-81ac-369aae14bd3c.json)
- [GDP per capita, latest](.seebra/query/252f4670-d771-5140-a718-a8af90135e58.json)

Transformations:

- [Values](transforms/values.polars.py) (polars)
- [Regions and income](transforms/regions-and-income.polars.py) (polars)
- [GDP per capita (US$)](transforms/gdp-per-capita-us.polars.py) (polars)
- [Countries with region and GDP](transforms/countries-with-region-and-gdp.sql) (sql)
- [Per region](transforms/per-region.sql) (sql)
- [Regression on log GDP: correlation is not causation](transforms/regression-on-log-gdp-correlation-is-not.polars.py) (polars)

Graphs:

- [Every country by region (tick: region mean)](graphs/every-country-by-region-tick-region-mean.js)
- [Life expectancy on log GDP per capita: a correlation, not a cause](graphs/life-expectancy-on-log-gdp-per-capita-a.js)

Tables:

- Countries, longest first
- Regions
- Countries against the line (shortest-lived for their income first)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/life-expectancy`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
