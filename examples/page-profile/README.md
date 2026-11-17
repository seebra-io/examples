# Profile this page: where the main thread's time goes

Seebra profiles itself: a Javascript Variable datasource reads window.__seebraPerf (long animation frames with their scripts and Seebra spans, board moves, interactions, fetches, LCP, resource timing), re-read every 15 s by a timer. Long frames are joined to the scripts in them and to board moves to say who spent the frame budget: Seebra, a third party, or a request during a pan. Chrome/Edge APIs; numbers depend on the machine.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-page-profile) · [open the example](https://www.seebra.io/?example=page-profile) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fpage-profile) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- This page (JavaScript variables)

## Steps

Queries:

- [window.__seebraPerf: this session's profile](.seebra/query/b6a9f66c-a762-5998-a86d-cd9ebf73201c.json)

Transformations:

- [Load milestones and blocking time](transforms/load-milestones-and-blocking-time.sql) (sql)
- [Moving against still: the verdict](transforms/moving-against-still-the-verdict.sql) (sql)
- [Long frames, their span and top script](transforms/long-frames-their-span-and-top-script.sql) (sql)
- [Scripts in long frames, by party](transforms/scripts-in-long-frames-by-party.sql) (sql)
- [Resources by origin and type](transforms/resources-by-origin-and-type.sql) (sql)
- [The 25 slowest resources](transforms/the-25-slowest-resources.sql) (sql)
- [Everything on one time axis](transforms/everything-on-one-time-axis.sql) (sql)

Graphs:

- [The session: frames, scripts, fetches and moves](graphs/the-session-frames-scripts-fetches-and-moves.js)
- [Who spent the long frames](graphs/who-spent-the-long-frames.js)
- [Load time by origin](graphs/load-time-by-origin.js)

Tables:

- Moving against still
- Load milestones
- Long frames
- Slowest resources

Studies:

- [Do pans cause the long frames?](.seebra/study/da7c6717-e732-5612-8efe-5602ce6dc2c7.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/page-profile`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
