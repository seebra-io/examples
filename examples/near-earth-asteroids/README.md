# Asteroids passing Earth this week

NASA's NeoWs feed (JPL data) of near-Earth asteroids making their closest approach in the coming seven days: miss distance in lunar distances, estimated size and speed, and which are potentially hazardous (hover a dot for its record, click for its JPL page). Statistics: sizes span two orders of magnitude, so they are binned on a log scale, where the median and the geometric mean (the mean of the logs) describe a typical asteroid and the ordinary mean is pulled up by the few big ones. Sizes are modelled from brightness with an assumed albedo (min to max is a factor of about 2.2), small asteroids are only found when they pass close, and a week is a few dozen objects. Uses NASA's shared DEMO_KEY (30 requests an hour); put your own key in for more.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-near-earth-asteroids) · [open the example](https://www.seebra.io/?example=near-earth-asteroids) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fnear-earth-asteroids) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- NASA NeoWs: <https://api.nasa.gov/neo/rest/v1>

## Steps

Queries:

- [Next 7 days](.seebra/query/1a27ee48-8622-5e71-a38a-f07d81e37dab.json)

Transformations:

- [Approaches, one list (the feed is keyed by date)](transforms/approaches-one-list-the-feed-is-keyed-by-date.js) (javascript)
- [Close approaches](transforms/close-approaches.polars.py) (polars)
- [Closest 15](transforms/closest-15.polars.py) (polars)
- [Sizes on a log scale: quarter-decade bins, median and geometric mean](transforms/sizes-on-a-log-scale-quarter-decade-bins-median.polars.py) (polars)

Graphs:

- [When and how close (log scale; dashed: the Moon)](graphs/when-and-how-close-log-scale-dashed-the-moon.js)
- [Sizes on a log scale: median and geometric mean vs the mean](graphs/sizes-on-a-log-scale-median-and-geometric-mean.js)

Tables:

- Closest approaches

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/near-earth-asteroids`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
