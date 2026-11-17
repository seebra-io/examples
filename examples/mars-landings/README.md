# Landing on Mars

Every attempt to land on Mars, 1971–2021: where each one came down on NASA's map, how it went (10 of 16 worked), the landing system (parachutes and rockets, airbags, sky crane) and how long it lasted. Positions and stories are sourced per mission. Caveat: Mars 2's crash site is an estimate and Mars Polar Lander's is its target. Next: Mars rovers up close for the rovers to scale, Mars in 3D for NASA's models, Mars rovers for the newest images.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-mars-landings) · [open the example](https://www.seebra.io/?example=mars-landings) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmars-landings) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- Seebra example data: <https://www.seebra.io/explore/data>
- NASA 3D Resources (GitHub): <https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master>

## Steps

Queries:

- [Mars landing attempts (curated from Wikipedia, with sources)](.seebra/query/0f1ba67f-1437-52b3-a4ac-0a100a898173.json)
- [Mars, NASA's colour map (Viking mosaic)](.seebra/query/c772076b-5c11-538b-bdc1-6c89fc88c520.json)

Transformations:

- [Landings: year and days on the surface](transforms/landings-year-and-days-on-the-surface.js) (javascript)

Graphs:

- [Start here](graphs/start-here.js)
- [Where they came down (hover a site)](graphs/where-they-came-down-hover-a-site.js)
- [Fifty years of trying](graphs/fifty-years-of-trying.js)

Tables:

- Every attempt (click a source)

## Data

Kept with the board, so it loads without www.seebra.io: the rows load from these files, not from the query (which stays, as where they came from).

- [data/mars-landing-attempts-curated-from-wikipedia.json](data/mars-landing-attempts-curated-from-wikipedia.json): a copy of `mars-landings.json` as bundled with Seebra (<https://www.seebra.io/explore/data/mars-landings.json>), taken when this folder was generated.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/mars-landings`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
