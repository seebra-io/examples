# Benford's law in country statistics

Population, land area, GDP and CO₂ emissions of every country from the World Bank, and the first significant digit of each. Statistics idea: Benford's law: quantities spanning several orders of magnitude start with 1 about 30% of the time and with 9 under 5% (log10(1 + 1/d)); a chi-square test and the mean absolute deviation say how close each comes. Caveats: ~215 countries is a small sample for a digit test, values are each country's latest year, and conformity is not proof of honest numbers.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-benford-countries) · [open the example](https://www.seebra.io/?example=benford-countries) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fbenford-countries) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Society

## Sources

- World Bank: <https://api.worldbank.org/v2>

## Steps

Queries:

- [Population, latest](.seebra/query/e18d5075-3c52-5df7-831b-4e2cfcc0aed8.json)
- [Land area (km²), latest](.seebra/query/45ee7cd2-9dba-5d0a-9b18-99b8ba6baed3.json)
- [GDP (current US$), latest](.seebra/query/7aaf522f-65a4-5af3-8a2b-3d45809a2327.json)
- [CO₂ emissions excl. land use (Mt CO₂e), latest](.seebra/query/9290ea5c-384a-5474-b572-b04549308e4b.json)
- [Countries](.seebra/query/6d65800e-6255-54b0-adcd-caa2d519df2f.json)

Transformations:

- [Countries with their first digits](transforms/countries-with-their-first-digits.polars.py) (polars)
- [First digits per quantity](transforms/first-digits-per-quantity.sql) (sql)
- [Benford's law: observed against log10(1 + 1/d), chi-square and MAD](transforms/benford-s-law-observed-against-log10-1-1-d-chi.polars.py) (polars)
- [Conformity per quantity](transforms/conformity-per-quantity.sql) (sql)

Graphs:

- [Benford's law: first digits against log10(1 + 1/d)](graphs/benford-s-law-first-digits-against-log10-1-1-d.js)
- [Population against area, coloured by first digit](graphs/population-against-area-coloured-by-first-digit.js)

Tables:

- Conformity per quantity (χ², MAD)
- Countries

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/benford-countries`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
