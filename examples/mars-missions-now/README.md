# Missions at Mars now

Every spacecraft working at Mars in November 2026, and the ones that stopped: two rovers on the ground and a fleet of orbiters from six space agencies. When each arrived and how long it has been there, where the surface missions are on NASA's map, how high each orbiter flies, and what each one carries. Status and dates are sourced per mission. Caveat: "working" is the latest status a source states (status_as_of per row), and Odyssey (nearly out of fuel) and Tianwen-1 (no official update in 2026) are the least certain; orbits are nominal altitudes, and the rovers are drawn at their landing sites. Next: Landing on Mars for how they got there, Mars rovers up close for what the rovers carry, Mars rovers for their newest images, The road to Mars for who comes next.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-mars-missions-now) · [open the example](https://www.seebra.io/?example=mars-missions-now) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmars-missions-now) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- NASA 3D Resources (GitHub): <https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master>

## Steps

Queries:

- [Mars, NASA's colour map (Viking mosaic)](.seebra/query/1c95922c-f1d8-5c82-8c2e-cafd80900932.json)

Transformations:

- [Missions: where they work and years at Mars](transforms/missions-where-they-work-and-years-at-mars.js) (javascript)
- [Table: the columns to read first](transforms/table-the-columns-to-read-first.js) (javascript)

Graphs:

- [Start here](graphs/start-here.js)
- [Who is there, and since when (hover a bar)](graphs/who-is-there-and-since-when-hover-a-bar.js)
- [On the ground (hover a site)](graphs/on-the-ground-hover-a-site.js)
- [How high the orbiters fly](graphs/how-high-the-orbiters-fly.js)

Tables:

- Every spacecraft (click a source)

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/mars-missions-now/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/mars-missions-now.json](data/mars-missions-now.json) (32 KB), the data node *Spacecraft at Mars, November 2026 (curated, with sources)*: Curated by Seebra: every spacecraft at Mars and on its way as of mid-November 2026, from Wikipedia, NASA, ESA and news reports (each row's sources). status_as_of is the date of the latest source found, not a confirmation. Checked 2026-11-18.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/mars-missions-now`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
