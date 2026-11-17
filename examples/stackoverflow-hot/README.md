# Hot Python questions on Stack Overflow

The 50 'hot' Python questions on Stack Overflow from the Stack Exchange API: views against age, whether they have an answer yet, and which other tags travel with Python right now (exploded and counted in Polars). Statistics idea: correlation is not causation. Spearman rank correlations of score, answers, views and age show what rises together, but age drives all of them, and the 'hot' list was chosen on those same numbers, so the sample is selected on the outcome (50 questions). Without a key the API allows 300 requests a day per IP.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-stackoverflow-hot) · [open the example](https://www.seebra.io/?example=stackoverflow-hot) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fstackoverflow-hot) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Stack Exchange: <https://api.stackexchange.com/2.3>

## Steps

Queries:

- [Hot questions](.seebra/query/a3952737-a13e-5d05-a8cb-a4d4b898f990.json)

Transformations:

- [Questions](transforms/questions.polars.py) (polars)
- [Tags with Python](transforms/tags-with-python.polars.py) (polars)
- [Correlation ≠ causation: Spearman ρ](transforms/correlation-causation-spearman.polars.py) (polars)

Graphs:

- [Views against age (click a dot to open the question)](graphs/views-against-age-click-a-dot-to-open-the.js)
- [Tags with Python](graphs/tags-with-python.js)
- [Correlation ≠ causation: what rises together](graphs/correlation-causation-what-rises-together.js)

Tables:

- Questions
- Co-tags

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/stackoverflow-hot`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
