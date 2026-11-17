# Heat pumps and the Carnot limit: why flow temperature matters

A year of metered COP from four houses with the same heat pump (heatpumpmonitor.org) against the Carnot limit and the temperature lift.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-heat-pump-carnot) · [open the example](https://www.seebra.io/?example=heat-pump-carnot) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fheat-pump-carnot) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- HeatpumpMonitor.org (OpenEnergyMonitor): <https://heatpumpmonitor.org>

## Steps

Queries:

- [System 802, Cheshire (underfloor + radiators): daily stats, Nov 2025 – Oct 2026](.seebra/query/1c137472-8dc0-53eb-baf6-0414bd5f8788.json)
- [System 254, Angus (radiators): daily stats, Nov 2025 – Oct 2026](.seebra/query/00658aad-16f5-52b4-a0e0-a7f75b37df0b.json)
- [System 357, Newcastle (radiators): daily stats, Nov 2025 – Oct 2026](.seebra/query/688de3c0-476f-5528-9b51-9b61a93feea7.json)
- [System 700, London (radiators): daily stats, Nov 2025 – Oct 2026](.seebra/query/3834fb55-22db-59ff-a235-a9d8b9f5078e.json)

Transformations:

- [Days: Cheshire (underfloor + radiators)](transforms/days-cheshire-underfloor-radiators.polars.py) (polars)
- [Days: Angus (radiators)](transforms/days-angus-radiators.polars.py) (polars)
- [Days: Newcastle (radiators)](transforms/days-newcastle-radiators.polars.py) (polars)
- [Days: London (radiators)](transforms/days-london-radiators.polars.py) (polars)
- [All days, with the Carnot COP](transforms/all-days-with-the-carnot-cop.sql) (sql)
- [COP per 2 K of outdoor temperature](transforms/cop-per-2-k-of-outdoor-temperature.polars.py) (polars)
- [The year per house (SCOP)](transforms/the-year-per-house-scop.polars.py) (polars)
- [COP against Carnot and lift](transforms/cop-against-carnot-and-lift.polars.py) (polars)
- [Carnot curves (theory)](transforms/carnot-curves-theory.polars.py) (polars)

Graphs:

- [COP against outdoor temperature, four houses](graphs/cop-against-outdoor-temperature-four-houses.js)
- [Measured COP against the Carnot limit](graphs/measured-cop-against-the-carnot-limit.js)
- [The Carnot limit and flow temperature](graphs/the-carnot-limit-and-flow-temperature.js)

Tables:

- The year per house
- One law: COP ≈ η × Carnot
- COP per outdoor temperature band

Studies:

- [Does a smaller lift give a higher COP?](.seebra/study/a267a05e-1309-5bf0-99d7-cc982aca6338.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/heat-pump-carnot`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
