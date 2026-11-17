# Fertiliser and diminishing returns

Cereal yield against fertiliser use in 180 countries (World Bank/FAO): a Mitscherlich curve fitted in Polars by grid search shows each extra kilogram buying less grain: the first 50 kg/ha return about 41 kg of grain per kg, the next 200 about 10. Countries past the bend (China, Egypt, Viet Nam) gain little more, and countries' paths since 2000 show yields rising on less fertiliser.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-nitrogen-response) · [open the example](https://www.seebra.io/?example=nitrogen-response) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fnitrogen-response) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- World Bank: <https://api.worldbank.org/v2>

## Steps

Queries:

- [Fertiliser consumption (kg/ha of arable land), latest](.seebra/query/7eb9ccc7-faab-5d1e-a64c-06d26eab8a5d.json)
- [Cereal yield (kg/ha), latest](.seebra/query/b1bb385f-454c-563b-a35c-14f5af9c977a.json)
- [Arable land (ha), latest](.seebra/query/ba9019d0-f1e7-5da6-8295-c87f7b651213.json)
- [Irrigated land (% of agricultural land), latest](.seebra/query/938b6445-3de4-54cb-b007-f947ac8dafbd.json)
- [Countries (region, income)](.seebra/query/46beb997-93f6-5806-9efb-83335779679d.json)
- [Fertiliser use 2000-2024, eight countries](.seebra/query/632abb41-9467-5581-88f4-03d9c0051a20.json)
- [Cereal yield 2000-2024, eight countries](.seebra/query/e2433166-bd77-5055-bd72-b9a5703d964f.json)

Transformations:

- [Countries: fertiliser, yield, arable land, irrigation](transforms/countries-fertiliser-yield-arable-land.polars.py) (polars)
- [Mitscherlich fit for 150 values of c (least squares A, Y0)](transforms/mitscherlich-fit-for-150-values-of-c-least.polars.py) (polars)
- [Best curve, its interval, and the straight line it beats](transforms/best-curve-its-interval-and-the-straight-line-it.polars.py) (polars)
- [Each country on the curve: prediction, residual, marginal product](transforms/each-country-on-the-curve-prediction-residual.polars.py) (polars)
- [The fitted curve and its slope, 0-800 kg/ha](transforms/the-fitted-curve-and-its-slope-0-800-kg-ha.polars.py) (polars)
- [Grain bought by each successive 50 kg/ha](transforms/grain-bought-by-each-successive-50-kg-ha.polars.py) (polars)
- [Per region: rate, yield, marginal product](transforms/per-region-rate-yield-marginal-product.polars.py) (polars)
- [Eight countries year by year](transforms/eight-countries-year-by-year.polars.py) (polars)
- [First and last year per country](transforms/first-and-last-year-per-country.polars.py) (polars)

Graphs:

- [Yield against fertiliser: a curve that flattens](graphs/yield-against-fertiliser-a-curve-that-flattens.js)
- [What one more kilogram buys](graphs/what-one-more-kilogram-buys.js)
- [Eight countries' paths along the curve](graphs/eight-countries-paths-along-the-curve.js)

Tables:

- The fitted curve
- Grain per successive 50 kg/ha
- Per region
- Eight countries, first and last year
- Countries on the curve

Studies:

- [Does extra fertiliser buy less and less grain?](.seebra/study/bf90f22a-c482-55c9-bb9e-452bd1240f58.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/nitrogen-response`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
