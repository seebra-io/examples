# Earthquakes

USGS's magnitude 4.5+ earthquakes of the past week, read from GeoJSON with Polars, ranked, and plotted on a world projection (hover a quake for its place, depth and time; click for its USGS event page). Statistics: the Gutenberg–Richter law, a power law: the number of quakes at least as strong as M falls about tenfold per magnitude, so on a log axis it is a straight line whose slope is the b-value (Aki's maximum-likelihood estimate, with its standard error). A week has only about a hundred M4.5+ quakes, so b is uncertain to about ±0.1; the catalogue mixes magnitude types (mb, Mww) and is complete only above about M4.5.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-earthquakes) · [open the example](https://www.seebra.io/?example=earthquakes) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fearthquakes) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- USGS earthquakes: <https://earthquake.usgs.gov/earthquakes/feed/v1.0>

## Steps

Queries:

- [M4.5+ past week](.seebra/query/9d02ce80-cc3c-5266-8fab-29033f68b119.json)

Transformations:

- [Quakes](transforms/quakes.polars.py) (polars)
- [Strongest](transforms/strongest.polars.py) (polars)
- [Gutenberg–Richter: quakes at least this strong (power law, b-value)](transforms/gutenberg-richter-quakes-at-least-this-strong.polars.py) (polars)

Graphs:

- [Where they struck](graphs/where-they-struck.js)
- [Gutenberg–Richter: a power law is a straight line on a log axis](graphs/gutenberg-richter-a-power-law-is-a-straight-line.js)

Tables:

- M5+ quakes, strongest first

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/earthquakes`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
