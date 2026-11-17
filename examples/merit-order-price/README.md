# The merit order: why sunny noons are cheap

Germany's day-ahead price against load and residual load (Energy-Charts, May–June 2026): the empirical supply curve, the duck curve and which plants set the price.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-merit-order-price) · [open the example](https://www.seebra.io/?example=merit-order-price) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmerit-order-price) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Economy

## Sources

- Energy-Charts (Fraunhofer ISE): <https://api.energy-charts.info>

## Steps

Queries:

- [Germany: public net generation and load, 15 min, May–June 2026](.seebra/query/5328bbc1-8514-519f-b6cf-56e8937d9a62.json)
- [DE-LU day-ahead price, 15 min, May–June 2026](.seebra/query/808d593b-243c-5335-9c83-6911d0fd4f2d.json)

Transformations:

- [Sources to rows](transforms/sources-to-rows.polars.py) (polars)
- [Price to rows](transforms/price-to-rows.polars.py) (polars)
- [Quarter-hours with price](transforms/quarter-hours-with-price.polars.py) (polars)
- [Hourly means (GW)](transforms/hourly-means-gw.polars.py) (polars)
- [Empirical merit order (2.5 GW bins)](transforms/empirical-merit-order-2-5-gw-bins.polars.py) (polars)
- [The average day](transforms/the-average-day.polars.py) (polars)
- [Price on load vs residual load (least squares)](transforms/price-on-load-vs-residual-load-least-squares.sql) (sql)
- [Slope in three ranges (convexity)](transforms/slope-in-three-ranges-convexity.polars.py) (polars)

Graphs:

- [Price against residual load: the merit order](graphs/price-against-residual-load-the-merit-order.js)
- [The duck: residual load and price over the day](graphs/the-duck-residual-load-and-price-over-the-day.js)
- [Who runs at each residual load](graphs/who-runs-at-each-residual-load.js)

Tables:

- Which predictor explains the price
- The curve steepens: slope per range
- Merit order bins

Studies:

- [Does residual load, not load, set the price?](.seebra/study/810f4966-18e3-5783-995f-8dbe4334e0ed.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/merit-order-price`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
