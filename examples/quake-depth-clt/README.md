# Central limit theorem: earthquake depths

Depths of the past month's M2.5+ earthquakes (USGS): a strongly skewed population. Statistics idea: the central limit theorem: 500 random samples of 1, 5, 30 and 100 quakes, drawn in Polars, have means that approach the normal curve while their spread shrinks as σ/√n and their skewness as γ/√n. Caveats: the population is one month's feed, not all quakes, and aftershocks make quakes dependent; the resampled draws are independent.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-quake-depth-clt) · [open the example](https://www.seebra.io/?example=quake-depth-clt) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fquake-depth-clt) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- USGS earthquakes: <https://earthquake.usgs.gov/earthquakes/feed/v1.0>

## Steps

Queries:

- [M2.5+ past 30 days](.seebra/query/0bbf3463-6997-5212-8c3e-c88785a9aaf4.json)

Transformations:

- [Quakes with depth](transforms/quakes-with-depth.polars.py) (polars)
- [The population: mean, sd, skewness of depth](transforms/the-population-mean-sd-skewness-of-depth.polars.py) (polars)
- [500 random samples of n = 1, 5, 30, 100: their mean depth](transforms/500-random-samples-of-n-1-5-30-100-their-mean.polars.py) (polars)
- [Standardised means z = (mean − μ) / (σ/√n)](transforms/standardised-means-z-mean-n.polars.py) (polars)
- [Central limit theorem: spread σ/√n and skewness γ/√n](transforms/central-limit-theorem-spread-n-and-skewness-n.polars.py) (polars)

Graphs:

- [The population: depths of a month's quakes](graphs/the-population-depths-of-a-month-s-quakes.js)
- [Central limit theorem: sample means approach the normal curve](graphs/central-limit-theorem-sample-means-approach-the.js)

Tables:

- Sample means against σ/√n and γ/√n
- Quakes

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/quake-depth-clt`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
