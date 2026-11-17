# Cross-correlation: a dam's pulse down the Grand Canyon

Two weeks of 15-minute discharge at Lees Ferry and near Grand Canyon (USGS). Signals idea: time-delay estimation by cross-correlation, as in GPS and radar: Glen Canyon Dam's daily pulse takes about 21 h to cover 141 km (about 6.6 km/h), but a peak a day later is almost as high: a periodic signal fixes a delay only modulo its period. Caveats: tributaries, celerity is not water speed.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-river-pulse-xcorr) · [open the example](https://www.seebra.io/?example=river-pulse-xcorr) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Friver-pulse-xcorr) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- USGS Water Data (OGC API): <https://api.waterdata.usgs.gov/ogcapi/v0>

## Steps

Queries:

- [Colorado River at Lees Ferry, 15-min discharge](.seebra/query/63ad18dd-c02a-5db8-a5d8-b13349840c42.json)
- [Colorado River near Grand Canyon, 15-min discharge](.seebra/query/5806dcac-8c7f-504c-8159-b6772be2e4a6.json)

Transformations:

- [Both gauges on one clock (m³/s)](transforms/both-gauges-on-one-clock-m3-s.polars.py) (polars)
- [Lags 0–48 h](transforms/lags-0-48-h.polars.py) (polars)
- [Cross-correlation per lag](transforms/cross-correlation-per-lag.polars.py) (polars)
- [Travel time, runner-up and wave speed](transforms/travel-time-runner-up-and-wave-speed.polars.py) (polars)
- [Upstream moved by the travel time](transforms/upstream-moved-by-the-travel-time.polars.py) (polars)
- [Daily swing at both gauges](transforms/daily-swing-at-both-gauges.polars.py) (polars)

Graphs:

- [The dam's daily pulse at both gauges](graphs/the-dam-s-daily-pulse-at-both-gauges.js)
- [Cross-correlation against lag](graphs/cross-correlation-against-lag.js)
- [Lined up by the travel time](graphs/lined-up-by-the-travel-time.js)
- [The pulse flattens on the way](graphs/the-pulse-flattens-on-the-way.js)

Tables:

- Travel time and wave speed
- Daily swing per gauge

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/river-pulse-xcorr`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
