# The local universe in 3D

Question: what is around the Milky Way, and how well do we know how far it is? The Local Group to scale with glowing cores sized by luminosity (McConnachie's catalogue, 2021 update) and each distance's error drawn along the line of sight; then out to ~80 Mpc: the 869 galaxies of Karachentsev's Updated Nearby Galaxy Catalog and 12,700 of the 2MASS Redshift Survey, live from NASA's HEASARC, log or linear, Galactic or supergalactic, with rings in Mpc and Mly and Virgo, Fornax, the Norma Cluster (Great Attractor), the Local Void and Laniakea. Hover a galaxy for its distance, method and the method's error; click for NED. A strip chart shows which method measured each distance. Caveat: errors grow with distance (TRGB ~5%, Tully–Fisher 20–25%); beyond 11 Mpc distances are velocity / H0, a redshift distance and not a measured one (Virgo smears into a finger along the line of sight); the empty wedge is the Zone of Avoidance behind the Milky Way's plane. Next: our neighbourhood in the Milky Way, Kepler's third law in exoplanets.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-local-universe-3d) · [open the example](https://www.seebra.io/?example=local-universe-3d) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Flocal-universe-3d) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- NASA HEASARC Xamin (catalogue queries): <https://heasarc.gsfc.nasa.gov/xamin>

## Steps

Queries:

- [Updated Nearby Galaxy Catalog (Karachentsev et al. 2013), 869 galaxies](.seebra/query/e3f63fde-4712-52a8-8fb8-74dde594bef3.json)
- [2MASS Redshift Survey galaxies under 6,000 km/s (Huchra et al. 2012)](.seebra/query/95024cf5-639a-5489-93ba-a487dfbd42a0.json)

Transformations:

- [UNGC galaxies, one row each, with the method's typical error](transforms/ungc-galaxies-one-row-each-with-the-method-s.js) (javascript)
- [2MRS galaxies, one row each, distance = cz / H0](transforms/2mrs-galaxies-one-row-each-distance-cz-h0.js) (javascript)
- [Local Group galaxies, one row each](transforms/local-group-galaxies-one-row-each.js) (javascript)
- [UNGC: galaxies per distance method, how far each reaches](transforms/ungc-galaxies-per-distance-method-how-far-each.sql) (sql)

Graphs:

- [The Local Group to scale: glowing by luminosity, with each distance's error (hover; click for NED)](graphs/the-local-group-to-scale-glowing-by-luminosity.js)
- [Out to 80 Mpc: the Local Volume, the 2MASS galaxies, Virgo and the Great Attractor (log or linear; hover; click for NED)](graphs/out-to-80-mpc-the-local-volume-the-2mass.js)
- [How each distance was measured: precise methods reach only so far](graphs/how-each-distance-was-measured-precise-methods.js)

Tables:

- Distance methods in the UNGC
- The Local Group, nearest first
- Every UNGC galaxy (ned: its NED page)

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/local-universe-3d/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/local-universe.json](data/local-universe.json) (63 KB), the data node *The Local Group (McConnachie 2012, 2021 update) and named landmarks (sourced)*: The Local Group from McConnachie 2012 (January 2021 update, CADC), extinction-corrected where E(B-V) <= 0.3, plus named landmarks with their papers (Mei 2007, Blakeslee 2009, Tully 2008-2019). Checked 2026-11-18.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/local-universe-3d`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
