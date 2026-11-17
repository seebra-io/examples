# How unique is an API? A study of the Explore catalog

Recomputes Explore's uniqueness score (TF-IDF distinctness × field rarity) from the public catalog: rarity drives the ranking more than the text, the real near-copies are vendor product lines, and per-country copies (energy) are a small effect. Sensitivity to k and to place names, a similarity network, and a study with Welch tests.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-api-uniqueness) · [open the example](https://www.seebra.io/?example=api-uniqueness) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fapi-uniqueness) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Seebra Explore catalog (CDN): <https://cdn.seebra.io/explorer>

## Steps

Queries:

- [The public Explore catalog: every API and example, with its description and categories](.seebra/query/046889d0-c24a-5568-aae8-c6ac553bf30e.json)

Transformations:

- [The APIs: one row each, with their field and Explore page](transforms/the-apis-one-row-each-with-their-field-and.polars.py) (polars)
- [Rarity: how crowded each API's least crowded category is](transforms/rarity-how-crowded-each-api-s-least-crowded.polars.py) (polars)
- [TF-IDF over the descriptions, and each API's 10 nearest (places removed, and kept)](transforms/tf-idf-over-the-descriptions-and-each-api-s-10.js) (javascript)
- [Uniqueness v1: distinct × rarity, with k = 3, 5, 10 and with place names kept](transforms/uniqueness-v1-distinct-rarity-with-k-3-5-10-and.polars.py) (polars)
- [Percentile: the share of APIs that score lower](transforms/percentile-the-share-of-apis-that-score-lower.polars.py) (polars)
- [Similarity network: each API's 3 nearest (places removed)](transforms/similarity-network-each-api-s-3-nearest-places.polars.py) (polars)
- [Uniqueness by field: every category, with its most and least unique API](transforms/uniqueness-by-field-every-category-with-its-most.polars.py) (polars)
- [Sensitivity: rank correlation of the v1 score with k = 3, k = 10 and place names kept](transforms/sensitivity-rank-correlation-of-the-v1-score.polars.py) (polars)
- [What drives the score: rank correlations with distinct, rarity, crowd and description length](transforms/what-drives-the-score-rank-correlations-with.polars.py) (polars)
- [Hypothesis: are energy and market APIs less distinct, and is it the place names?](transforms/hypothesis-are-energy-and-market-apis-less.polars.py) (polars)
- [The 15 most and 15 least unique APIs](transforms/the-15-most-and-15-least-unique-apis.sql) (sql)

Graphs:

- [How unique are the APIs? The score's distribution, by top-level field](graphs/how-unique-are-the-apis-the-score-s-distribution.js)
- [Most and least unique APIs, and what they are closest to](graphs/most-and-least-unique-apis-and-what-they-are.js)
- [Uniqueness by field: crowded categories against lonely ones](graphs/uniqueness-by-field-crowded-categories-against.js)
- [The similarity network: each API tied to its 3 nearest descriptions](graphs/the-similarity-network-each-api-tied-to-its-3.js)
- [Sensitivity: the v1 score against k = 3, k = 10 and place names kept](graphs/sensitivity-the-v1-score-against-k-3-k-10-and.js)
- [Per-country copies: what removing place names does to each field](graphs/per-country-copies-what-removing-place-names.js)

Tables:

- Most and least unique, with nearest neighbours
- Rank correlations and top-50 overlap
- Energy and markets against the rest
- What drives the score (Spearman)

Studies:

- [Which APIs are unique, and which fields are crowded with copies?](.seebra/study/da386970-18be-519b-8ab6-9652d9704fca.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/api-uniqueness`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
