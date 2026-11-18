# The road to Mars

Who goes to Mars next, and how sure each date is: missions on their way, funded, proposed and cancelled, as of November 2026. Each launch is a range, from the earliest to the latest year the sources support, against the launch windows that open about every 26 months; a second chart shows how far the target dates have slipped. Status and dates are sourced per mission. Caveat: a target date is a plan, not a forecast; the earliest-latest ranges are this board's reading of the sources, not agency figures, and several 2026 updates come from news reports rather than agency pages. Next: Missions at Mars now for who is there today, Landing on Mars for every landing so far, Upcoming rocket launches for the next launches of every kind.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-mars-road-ahead) · [open the example](https://www.seebra.io/?example=mars-road-ahead) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmars-road-ahead) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Steps

Transformations:

- [Missions, ranked by how certain they are](transforms/missions-ranked-by-how-certain-they-are.js) (javascript)
- [Launch windows](transforms/launch-windows.js) (javascript)
- [Table: the columns to read first](transforms/table-the-columns-to-read-first.js) (javascript)

Graphs:

- [Start here](graphs/start-here.js)
- [What's next, and how sure (hover a mission)](graphs/what-s-next-and-how-sure-hover-a-mission.js)
- [How far the dates have slipped](graphs/how-far-the-dates-have-slipped.js)

Tables:

- Every mission (click a source)

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/mars-road-ahead/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/mars-road-ahead.json](data/mars-road-ahead.json) (34 KB), the data node *Missions to Mars: on the way, planned, proposed and cancelled (curated, with sources)*: Curated by Seebra: missions to Mars en route, planned, proposed or cancelled as of 18 November 2026, and the launch windows, from Wikipedia, agencies and news reports (each row's source; secondary-only rows are marked uncertain). Checked 2026-11-18.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/mars-road-ahead`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
