# Ashby chart: why aircraft are aluminium, CFRP and spruce

Young's modulus against density for 438 materials on Wikidata, and the performance indices E/ρ, E^½/ρ, E^⅓/ρ: steel, aluminium and titanium tie as rods, but an aluminium panel weighs half a steel one and spruce a sixth.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-ashby-stiffness) · [open the example](https://www.seebra.io/?example=ashby-stiffness) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fashby-stiffness) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Wikidata Query Service: <https://query.wikidata.org>

## Steps

Queries:

- [Materials with a measured Young's modulus (P5480) and density (P2054), SI-normalized](.seebra/query/aa7bcbb3-c8d5-5e8e-861f-b5a025c525db.json)
- [Substances with bulk (P5668) and shear (P5673) modulus and density, SI-normalized](.seebra/query/04f4017d-8981-5ba3-acfb-9f2da225b127.json)

Transformations:

- [Engineering materials: one row each, a class, a sanity check](transforms/engineering-materials-one-row-each-a-class-a.polars.py) (polars)
- [Elements and minerals: Young's modulus and Poisson's ratio from K and G](transforms/elements-and-minerals-young-s-modulus-and.polars.py) (polars)
- [Both lists together](transforms/both-lists-together.sql) (sql)
- [Performance indices E/ρ, E^½/ρ, E^⅓/ρ, and the mass against steel](transforms/performance-indices-e-e-1-2-e-1-3-and-the-mass.polars.py) (polars)
- [Airframe candidates: mass of the same stiff part, relative to steel](transforms/airframe-candidates-mass-of-the-same-stiff-part.polars.py) (polars)
- [Candidates per design (tie, beam, panel)](transforms/candidates-per-design-tie-beam-panel.sql) (sql)
- [Per material class](transforms/per-material-class.sql) (sql)
- [Same material in both lists: measured E against 9KG/(3K+G)](transforms/same-material-in-both-lists-measured-e-against.polars.py) (polars)
- [Rows the sanity check set aside](transforms/rows-the-sanity-check-set-aside.sql) (sql)

Graphs:

- [Ashby chart: Young's modulus against density, with the three design lines through steel](graphs/ashby-chart-young-s-modulus-against-density-with.js)
- [Mass of the same stiff part against steel: tie, beam, panel](graphs/mass-of-the-same-stiff-part-against-steel-tie.js)
- [Measured E against E from K and G](graphs/measured-e-against-e-from-k-and-g.js)

Tables:

- Airframe candidates against steel
- Per class
- Set aside by the sanity check
- All materials with their indices and ranks

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/ashby-stiffness`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
