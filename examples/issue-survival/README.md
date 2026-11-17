# How long issues stay open

The 100 issues opened in the Polars repository in early March 2025 (GitHub search): closed, or still open. Statistics idea: survival analysis with censoring: an open issue lasted at least this long, and the Kaplan–Meier estimator with Greenwood's band gives the share still open after t days, for bugs and enhancements; its median is far above the median of the closed issues alone, which ignores the open ones. Caveats: one repository and two weeks; 'closed' includes 'not planned'.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-issue-survival) · [open the example](https://www.seebra.io/?example=issue-survival) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fissue-survival) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- GitHub: <https://api.github.com>

## Steps

Queries:

- [Polars issues opened 1–15 March 2025](.seebra/query/1937b329-be0e-588f-9c56-ce8345966a44.json)

Transformations:

- [Issues: days open, closed or censored](transforms/issues-days-open-closed-or-censored.polars.py) (polars)
- [All issues and per kind](transforms/all-issues-and-per-kind.sql) (sql)
- [Survival with censoring: Kaplan–Meier and Greenwood's band](transforms/survival-with-censoring-kaplan-meier-and.polars.py) (polars)
- [Median time open: Kaplan–Meier against ignoring the open ones](transforms/median-time-open-kaplan-meier-against-ignoring.polars.py) (polars)

Graphs:

- [Survival with censoring: share of issues still open](graphs/survival-with-censoring-share-of-issues-still.js)
- [Each issue: closed or censored](graphs/each-issue-closed-or-censored.js)

Tables:

- Median days open, three ways
- Issues

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/issue-survival`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
