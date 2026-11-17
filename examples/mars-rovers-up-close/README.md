# Mars rovers up close

NASA's Mars rovers side by side and to scale in 3D: Sojourner (1997), Spirit and Opportunity (2004), Curiosity (2012) and Perseverance (2021). Hover a dot for a camera, instrument, solar panel, RTG, antenna or computer: what it does, its mass and power where a source states them, and a link to the source. Beside it, mass and power across the generations (a hundred times heavier, seven times the power) and where the watts go (MOXIE and Ingenuity drew more than the MMRTG makes). Caveats: shapes are simplified and positions approximate, not NASA's models; figures are from Wikipedia's rover and instrument pages; empty mass or power means no stated figure. Next: the raw images example shows what the cameras see today.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-mars-rovers-up-close) · [open the example](https://www.seebra.io/?example=mars-rovers-up-close) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmars-rovers-up-close) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- Seebra example data: <https://www.seebra.io/explore/data>

## Steps

Queries:

- [Mars rover parts (curated, with sources)](.seebra/query/fb427df6-c701-5995-8ec9-d7aacdf4200b.json)

Transformations:

- [Parts: cameras, instruments, power, comms](transforms/parts-cameras-instruments-power-comms.polars.py) (polars)
- [The rovers](transforms/the-rovers.polars.py) (polars)
- [Parts per rover, for reading](transforms/parts-per-rover-for-reading.sql) (sql)

Graphs:

- [Mars rovers up close (3D, hover the dots)](graphs/mars-rovers-up-close-3d-hover-the-dots.js)
- [Mass and power across four generations](graphs/mass-and-power-across-four-generations.js)
- [Where the watts go](graphs/where-the-watts-go.js)

Tables:

- Every part (click a source)
- The rovers

## Data

Kept with the board, so it loads without www.seebra.io: the rows load from these files, not from the query (which stays, as where they came from).

- [data/mars-rover-parts-curated-with-sources-data.json](data/mars-rover-parts-curated-with-sources-data.json): a copy of `mars-rover-parts.json` as bundled with Seebra (<https://www.seebra.io/explore/data/mars-rover-parts.json>), taken when this folder was generated.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/mars-rovers-up-close`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
