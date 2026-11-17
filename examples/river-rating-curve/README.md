# River rating curve: the Missouri at Hermann

How a river gage turns water level into discharge: a power law Q = C (h − e)^b fitted in Polars to 4,117 USGS field measurements since 1928. Per decade, the stage that carries 40,000 ft³/s fell from 7.1 to 3.4 ft as the bed cut down (one all-years curve under-reports today's low flows by ~44%), and at flood stage the same level has carried 418,000 to 750,000 ft³/s: the 100-year flood sits where the curve is weakest.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-river-rating-curve) · [open the example](https://www.seebra.io/?example=river-rating-curve) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Friver-rating-curve) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- USGS Water Data (OGC API): <https://api.waterdata.usgs.gov/ogcapi/v0>

## Steps

Queries:

- [Field measurements: discharge and gage height, Missouri River at Hermann](.seebra/query/6013b66c-3dce-5677-8732-917aabb77e18.json)
- [Annual peak discharge and stage](.seebra/query/04301be6-a653-51dd-a129-33f955e3b075.json)

Transformations:

- [Measurements: stage and discharge per field visit](transforms/measurements-stage-and-discharge-per-field-visit.polars.py) (polars)
- [One rating curve for all years: Q = C (h − e)^b](transforms/one-rating-curve-for-all-years-q-c-h-e-b.polars.py) (polars)
- [A rating curve per decade, and the stage at fixed flows](transforms/a-rating-curve-per-decade-and-the-stage-at-fixed.polars.py) (polars)
- [All curves](transforms/all-curves.sql) (sql)
- [Curves from 0 to 40 ft](transforms/curves-from-0-to-40-ft.polars.py) (polars)
- [Each measurement against the all-years curve](transforms/each-measurement-against-the-all-years-curve.polars.py) (polars)
- [Rating shift: median residual per decade and flow class](transforms/rating-shift-median-residual-per-decade-and-flow.polars.py) (polars)
- [Annual peaks against the curve](transforms/annual-peaks-against-the-curve.polars.py) (polars)
- [Flood measurements foot by foot](transforms/flood-measurements-foot-by-foot.polars.py) (polars)
- [How far the measurements reach up the curve](transforms/how-far-the-measurements-reach-up-the-curve.polars.py) (polars)

Graphs:

- [The rating curve: 4,000 measurements, one power law, the flood peaks](graphs/the-rating-curve-4-000-measurements-one-power.js)
- [The rating shift: the stage that carries the same flow, by decade](graphs/the-rating-shift-the-stage-that-carries-the-same.js)
- [Measurements against one all-years curve: low flows drift, floods don't](graphs/measurements-against-one-all-years-curve-low.js)
- [Flood peaks: the top of the curve is the least measured](graphs/flood-peaks-the-top-of-the-curve-is-the-least.js)

Tables:

- All-years fit: e, b, C and the 95% interval of e
- Per-decade curves and the stage at 40k, 100k, 300k ft³/s
- Flood measurements per foot of stage
- Extrapolation at the record flood

Studies:

- [Has the rating shifted at low flow?](.seebra/study/c326faa9-5bf1-5bc8-8dbf-7291c7e91d46.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/river-rating-curve`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
