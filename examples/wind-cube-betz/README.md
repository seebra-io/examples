# Wind power: the cube law and the Betz limit

Westermost Rough's metered output (Elexon) against ERA5 wind: the power curve, P ∝ v³, Cp against Betz's 16/27.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-wind-cube-betz) · [open the example](https://www.seebra.io/?example=wind-cube-betz) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fwind-cube-betz) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Elexon BMRS (Insights API): <https://data.elexon.co.uk/bmrs/api/v1>
- Open-Meteo historical weather (ERA5): <https://archive-api.open-meteo.com/v1>

## Steps

Queries:

- [Westermost Rough metered output (B1610), Sep–Oct 2026](.seebra/query/4f176fec-d4df-5d91-8d87-74ff213ff691.json)
- [ERA5 at the farm: wind at 100 m, temperature, pressure](.seebra/query/d9475b3d-127e-5511-8d53-08da1989e5ca.json)

Transformations:

- [Hourly output (MW)](transforms/hourly-output-mw.polars.py) (polars)
- [Hourly wind and air density](transforms/hourly-wind-and-air-density.polars.py) (polars)
- [Output against the power in the wind](transforms/output-against-the-power-in-the-wind.polars.py) (polars)
- [Measured power curve and Cp](transforms/measured-power-curve-and-cp.polars.py) (polars)
- [Cube law: ln P on ln v](transforms/cube-law-ln-p-on-ln-v.polars.py) (polars)
- [Two months in numbers](transforms/two-months-in-numbers.polars.py) (polars)

Graphs:

- [Power curve, power in the wind and Betz](graphs/power-curve-power-in-the-wind-and-betz.js)
- [Power coefficient against the Betz limit](graphs/power-coefficient-against-the-betz-limit.js)
- [Hours and energy by wind speed](graphs/hours-and-energy-by-wind-speed.js)

Tables:

- The two months in numbers
- Cube-law fit
- Power curve bins

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/wind-cube-betz`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
