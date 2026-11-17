# The hypsometric equation: why warm air stands tall

Open-Meteo's temperatures and geopotential heights at 13 pressure levels in 17 columns from pole to pole along 20° E. Physics idea: the hypsometric equation Δz = (R/g) T̄ ln(p₁/p₂) reproduces the model's layer thicknesses to about 0.25%; warm columns are tall, the tropopause falls from 16.5 km to 8–11 km. Caveats: one moment's model state; dry air; below-ground levels excluded.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-hypsometric-atmosphere) · [open the example](https://www.seebra.io/?example=hypsometric-atmosphere) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fhypsometric-atmosphere) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- Open-Meteo forecast: <https://api.open-meteo.com/v1>

## Steps

Queries:

- [Temperature and geopotential height at 13 pressure levels, 17 places along 20° E](.seebra/query/cf877c6f-bed0-5995-abfb-986ce2685795.json)

Transformations:

- [One row per column of air](transforms/one-row-per-column-of-air.polars.py) (polars)
- [One row per column and pressure level](transforms/one-row-per-column-and-pressure-level.sql) (sql)
- [Layers: model thickness against the hypsometric equation; lapse rate, scale height, speed of sound](transforms/layers-model-thickness-against-the-hypsometric.polars.py) (polars)
- [How well the hypsometric equation matches the model](transforms/how-well-the-hypsometric-equation-matches-the.polars.py) (polars)
- [Each column: 500 hPa height, 1000–500 hPa thickness and mean temperature](transforms/each-column-500-hpa-height-1000-500-hpa.polars.py) (polars)
- [Tropopause per column (lapse rate below 2 K/km)](transforms/tropopause-per-column-lapse-rate-below-2-k-km.polars.py) (polars)

Graphs:

- [Temperature profiles from pole to pole, and the tropopause](graphs/temperature-profiles-from-pole-to-pole-and-the.js)
- [Heights from temperatures: the hypsometric equation against the model](graphs/heights-from-temperatures-the-hypsometric.js)
- [Warm columns stand tall: 500 hPa height and thickness by latitude](graphs/warm-columns-stand-tall-500-hpa-height-and.js)
- [The 17 columns along 20° E](graphs/the-17-columns-along-20-e.js)

Tables:

- Columns: height, thickness, mean temperature
- Layers

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/hypsometric-atmosphere`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
