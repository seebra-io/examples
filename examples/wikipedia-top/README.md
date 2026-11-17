# Wikipedia top

English Wikipedia's most-viewed articles on 1 November 2026 from the Wikimedia pageviews API, without the main page and special, project and talk pages (click a bar or dot to read the article). Statistics idea: Zipf's law. On log-log axes views against rank fall close to a straight line, a power law views ≈ C · rank^(−s); the fit gives s. Caveats: the API lists only the top 1000, views include some automated traffic, and news spikes bend the head of the curve.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-wikipedia-top) · [open the example](https://www.seebra.io/?example=wikipedia-top) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fwikipedia-top) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Culture

## Sources

- Wikimedia REST: <https://wikimedia.org/api/rest_v1>

## Steps

Queries:

- [Top articles](.seebra/query/9a3f697f-62f0-5aba-87aa-9a352f77b6cb.json)

Transformations:

- [Articles, ranked](transforms/articles-ranked.polars.py) (polars)
- [Top 25](transforms/top-25.sql) (sql)
- [Zipf's law: log views on log rank](transforms/zipf-s-law-log-views-on-log-rank.polars.py) (polars)

Graphs:

- [Views, top 20](graphs/views-top-20.js)
- [Zipf's law: rank against views, log–log](graphs/zipf-s-law-rank-against-views-log-log.js)

Tables:

- Top 25

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/wikipedia-top`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
