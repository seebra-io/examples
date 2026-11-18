# Perseverance: who built what

NASA's own 3D model of the Perseverance rover, with Ingenuity beside it: hover a part (cameras, instruments, the arm and drill, the power source, antennas, wheels) and it lights up with what it does and which organizations designed, built or led it; click for the source. Beside it, every organization against the rover's systems, and the countries they're in. Perseverance is mostly JPL's, with instruments from France (SuperCam's mast unit), Spain (MEDA, the high-gain antenna), Norway (RIMFAX), Italy (LaRA) and Finland (MEDA's sensors), and companies from Austria to Japan. Caveats: only claims a fetched source states (JPL pages often name no outside builder, so a part with only JPL may have had others); a few countries are inferred (marked); dots mark parts the model has no shape for, at approximate positions; organization counts say nothing of money or effort. Next: Mars rovers up close compares four generations, and the raw images example shows what the cameras see.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-perseverance-builders) · [open the example](https://www.seebra.io/?example=perseverance-builders) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fperseverance-builders) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Steps

Transformations:

- [Parts and systems](transforms/parts-and-systems.polars.py) (polars)
- [Who built what](transforms/who-built-what.polars.py) (polars)
- [Builders with their parts' systems](transforms/builders-with-their-parts-systems.sql) (sql)

Graphs:

- [Perseverance and Ingenuity (hover a part, click for the source)](graphs/perseverance-and-ingenuity-hover-a-part-click.js)
- [Every organization against the rover's systems](graphs/every-organization-against-the-rover-s-systems.js)
- [Organizations per country](graphs/organizations-per-country.js)

Tables:

- Who built what (click a source)
- The parts

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/perseverance-builders/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/ingenuity.glb](data/ingenuity.glb) (2.0 MB), the data node *Ingenuity, NASA's 3D model*: NASA's 3D model of the Ingenuity helicopter (NASA/JPL-Caltech, NASA 3D Resources, free and without copyright: https://github.com/nasa/NASA-3D-Resources), re-encoded with meshopt for the browser.
- [data/perseverance-builders.json](data/perseverance-builders.json) (38 KB), the data node *Parts and builders (curated, with sources)*: Curated by Seebra: Perseverance's and Ingenuity's parts and the organizations that designed or built them, from NASA/JPL, Wikipedia and the builders' own pages (each builder row's source; claims no source stated were left out). Part positions on NASA's 3D model are approximate.
- [data/perseverance.glb](data/perseverance.glb) (5.6 MB), the data node *Perseverance, NASA's 3D model*: NASA's 3D model of Perseverance (NASA/JPL-Caltech, NASA 3D Resources, free and without copyright: https://github.com/nasa/NASA-3D-Resources), re-encoded with meshopt for the browser.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/perseverance-builders`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
