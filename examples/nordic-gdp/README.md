# Nordic GDP

World Bank GDP per capita for the five Nordic countries since 2000, with yearly growth computed in Polars, and a principal component analysis (PCA) of the panel of yearly log growth: how much the five economies move as one, which years broke together, and which country goes its own way. Values are in current US$, so exchange rates are part of every move.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-nordic-gdp) · [open the example](https://www.seebra.io/?example=nordic-gdp) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fnordic-gdp) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Economy

## Sources

- World Bank: <https://api.worldbank.org/v2>

## Steps

Queries:

- [GDP per capita](.seebra/query/6fdb66db-f691-5594-94b0-e1f9406baaf8.json)

Transformations:

- [Rows](transforms/rows.polars.py) (polars)
- [Yearly growth](transforms/yearly-growth.polars.py) (polars)
- [Panel: log growth, one column per country](transforms/panel-log-growth-one-column-per-country.polars.py) (polars)
- [PCA: each year on the components](transforms/pca-each-year-on-the-components.polars.py) (polars)
- [PCA: what each component is made of](transforms/pca-what-each-component-is-made-of.polars.py) (polars)
- [PCA: variance explained](transforms/pca-variance-explained.polars.py) (polars)

Graphs:

- [GDP per capita (current US$)](graphs/gdp-per-capita-current-us.js)
- [Yearly growth per country](graphs/yearly-growth-per-country.js)
- [PCA of the panel: one shared Nordic year (PC1)](graphs/pca-of-the-panel-one-shared-nordic-year-pc1.js)
- [PCA loadings: who moves each component](graphs/pca-loadings-who-moves-each-component.js)

Tables:

- Yearly growth

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/nordic-gdp`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
