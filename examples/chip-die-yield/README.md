# Die yield: why big chips are expensive and chiplets exist

Real die areas from Wikidata (Apple A-series to M1 Max, console APUs, GPUs, camera sensors) under Poisson, Murphy and negative-binomial yield models. Idea: yield falls exponentially with area, so a good mm² of a big die costs more, and splitting into tested chiplets recovers it. Caveats: defect densities and the chiplet overhead are scenarios; few die areas on Wikidata.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-chip-die-yield) · [open the example](https://www.seebra.io/?example=chip-die-yield) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fchip-die-yield) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Wikidata Query Service: <https://query.wikidata.org>

## Steps

Queries:

- [Chips and image sensors with a die area (mm²)](.seebra/query/5e00250a-9505-5563-a5ae-f6bf5861fbd8.json)

Transformations:

- [Dies: area, kind, process, maker](transforms/dies-area-kind-process-maker.polars.py) (polars)
- [Dies per 300 mm wafer and yield under three defect models](transforms/dies-per-300-mm-wafer-and-yield-under-three.sql) (sql)
- [Yield curves over die area (for the chart)](transforms/yield-curves-over-die-area-for-the-chart.sql) (sql)
- [Chiplets: the same silicon as n smaller dies](transforms/chiplets-the-same-silicon-as-n-smaller-dies.sql) (sql)
- [What yield does to cost: smallest against largest logic die](transforms/what-yield-does-to-cost-smallest-against-largest.polars.py) (polars)

Graphs:

- [Yield falls exponentially with die area](graphs/yield-falls-exponentially-with-die-area.js)
- [Cost of a good mm² against die area](graphs/cost-of-a-good-mm2-against-die-area.js)
- [Why chiplets: silicon saved by splitting a big die](graphs/why-chiplets-silicon-saved-by-splitting-a-big.js)

Tables:

- Smallest against largest logic die
- Dies (Wikidata)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/chip-die-yield`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
