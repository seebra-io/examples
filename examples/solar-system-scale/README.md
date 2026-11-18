# The solar system to scale

The Sun to Jupiter with every distance to scale: each planet where JPL's Keplerian elements put it today, wearing NASA's textures (NASA's Sun, Mercury and Venus models, NASA 3D Resources' Earth, Mars and Jupiter), and 3,000 numbered asteroids plus the Jupiter trojans from JPL's Small-Body Database, each on its own orbit. Run time forward a month a second; hover a planet for its orbit and distance, an asteroid for its name and group. Beside it the Kirkwood gaps: asteroids by orbit size, with Jupiter's resonances (3:1, 5:2, 7:3, 2:1) emptying their distances and gathering the Hildas (3:2) and the trojans. Awareness: planets are drawn 1000 times and the Sun 20 times their size, or they would not show (True sizes); the elements are JPL's approximation for 1800-2050 (arcminutes for the inner planets); numbered asteroids are the first found, so biased to the large and bright. Next: NASA in 3D, Mars in 3D.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-solar-system-scale) · [open the example](https://www.seebra.io/?example=solar-system-scale) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fsolar-system-scale) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- NASA Science files (Eyes on the Solar System models): <https://assets.science.nasa.gov/content/dam/science>
- NASA 3D Resources (GitHub): <https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master>
- JPL Small-Body Database Query API: <https://ssd-api.jpl.nasa.gov>

## Steps

Queries:

- [3,000 numbered asteroids (orbital elements)](.seebra/query/a05fe6a9-471f-570f-b6fc-ff917ddc3f4b.json)
- [Jupiter trojans (orbital elements)](.seebra/query/4fb91dd5-1eed-5899-9d5e-11a3a0a1b336.json)
- [The Sun, NASA's model](.seebra/query/98153760-cef4-5c8c-a908-7c5164b62513.json)
- [Mercury, NASA's model](.seebra/query/93643ad4-38ab-5b40-8ae3-6b30a4f13ab6.json)
- [Venus, NASA's model](.seebra/query/207465a6-dbdb-5895-b696-47f598357436.json)
- [Earth's texture (NASA 3D Resources)](.seebra/query/6d8ef275-bccd-5ac4-a5fb-22af95aa5eef.json)
- [Mars' texture (NASA 3D Resources)](.seebra/query/1e0be92e-7fbc-55ba-9822-89f65b555a5b.json)
- [Jupiter's texture (NASA 3D Resources)](.seebra/query/e7c0a060-27ec-5cec-9912-7e24609eb52b.json)

Transformations:

- [Asteroids, one row each](transforms/asteroids-one-row-each.js) (javascript)
- [Per group: how many, where](transforms/per-group-how-many-where.polars.py) (polars)

Graphs:

- [The Sun to Jupiter, distances to scale (▶ runs time; hover a planet or an asteroid)](graphs/the-sun-to-jupiter-distances-to-scale-runs-time.js)
- [The Kirkwood gaps: asteroids by orbit size](graphs/the-kirkwood-gaps-asteroids-by-orbit-size.js)

Tables:

- Asteroid groups
- Every asteroid shown

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/solar-system-scale/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/solar-system-elements.json](data/solar-system-elements.json) (3.9 KB), the data node *The planets' orbital elements (JPL, Standish) and the belt's resonances*: The planets' orbital elements from E. M. Standish, Keplerian Elements for Approximate Positions of the Major Planets (JPL Solar System Dynamics, Table 1, valid 1800-2050), mean radii from NASA's planetary fact sheets, and the asteroid belt's resonances, as the file's source fields cite.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/solar-system-scale`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
