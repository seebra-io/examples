# What's new in recalls

What is new in US recalls, with where each record came from: openFDA's drug and food enforcement reports and device recalls, newest first, one row per recall with its key (recall number), class, firm, reason, and its provenance: the record's own query at openFDA, the feed, when openFDA last updated it and when this board read it. openFDA publishes weekly, so new means in a feed's latest report; device recalls post daily. Next step: watch a feed (Source watch → Discover) to be told what is new since the last check, with a SHA-256 of each answer and a Wayback Machine copy, and verify a record against the source before you publish. A recall is the firm's or FDA's action, not proof of harm; openFDA data are not for medical decisions.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-recall-watch) · [open the example](https://www.seebra.io/?example=recall-watch) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Frecall-watch) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Health

## Sources

- openFDA: <https://api.fda.gov>

## Steps

Queries:

- [Drug enforcement reports (newest 100)](.seebra/query/25a1c38f-50e5-523e-9240-54f285a5add8.json)
- [Food enforcement reports (newest 100)](.seebra/query/9e5856f3-8120-5f7b-8b81-533980862987.json)
- [Device recalls (newest 25)](.seebra/query/89ae5529-4ea6-53b1-a887-5fbe95dfc613.json)

Transformations:

- [Every recall, with its provenance](transforms/every-recall-with-its-provenance.js) (javascript)
- [New in each feed's latest report](transforms/new-in-each-feed-s-latest-report.sql) (sql)
- [Recalls per report day and feed](transforms/recalls-per-report-day-and-feed.sql) (sql)

Graphs:

- [Recalls per report day: the newest on the right](graphs/recalls-per-report-day-the-newest-on-the-right.js)
- [In the latest reports: by class and feed](graphs/in-the-latest-reports-by-class-and-feed.js)

Tables:

- What's new, with provenance (record_url: the record at openFDA)
- Every recall read, with provenance

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/recall-watch`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
