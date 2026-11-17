# Mars in 3D: the spacecraft

NASA's own 3D models of four Mars missions side by side: Mars Reconnaissance Orbiter, Mars Global Surveyor, the Opportunity rover and the Ingenuity helicopter. Switch between the scale their files have and the same size; hover one for what it did and its size in the file, click for NASA's file. Beside them, every Mars model science.nasa.gov lists, each a query away from 3D. Caveat: glTF's unit is the metre, but not every model keeps to it, so check a size against the mission's published one before comparing. Next: Perseverance: who built what, Mars rovers for their newest images, NASA in 3D for the whole catalog.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-mars-fleet-3d) · [open the example](https://www.seebra.io/?example=mars-fleet-3d) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmars-fleet-3d) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- NASA Science (WordPress REST API): <https://science.nasa.gov/wp-json/wp/v2>
- NASA Science files: <https://assets.science.nasa.gov/content/dam/science>

## Steps

Queries:

- [Mars Reconnaissance Orbiter (A), NASA's 3D model](.seebra/query/87775acc-ca05-50c3-be37-492af0c83d51.json)
- [Mars Global Surveyor, NASA's 3D model](.seebra/query/0861cba4-8036-5c8c-93ac-947ba297244f.json)
- [Opportunity (MER-B), NASA's 3D model](.seebra/query/853cc919-07d9-5561-87f7-7029e36b4595.json)
- [Ingenuity, NASA's 3D model](.seebra/query/bde46c26-9bac-5e53-9581-eed42bb128ec.json)
- [Mars models on science.nasa.gov](.seebra/query/f5d2a30d-f17e-5749-8811-d1523b8f17ff.json)

Transformations:

- [Mars models, one row per file](transforms/mars-models-one-row-per-file.js) (javascript)

Graphs:

- [Four Mars missions in 3D (hover one, switch the scale top right)](graphs/four-mars-missions-in-3d-hover-one-switch-the.js)

Tables:

- Every Mars model (url: the file; a query of it opens it in 3D)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/mars-fleet-3d`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
