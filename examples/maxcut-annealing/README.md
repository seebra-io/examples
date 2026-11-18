# Max-cut three ways

Split a graph's nodes in two so that as many links as possible are cut: every split tried (exact), simulated annealing at nine schedule lengths, and how the same problem maps onto D-Wave's quantum annealer (an Ising model with J = +1 per link). How rare the best cut is, how often annealing finds it, and a study of whether slower schedules help. Caveat: at this size a laptop is exact; whether quantum annealing beats the best classical methods on large problems is open. Next: change the graph in the Graph step, or send it to D-Wave with your own Leap token (coming).

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-maxcut-annealing) · [open the example](https://www.seebra.io/?example=maxcut-annealing) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmaxcut-annealing) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Steps

Transformations:

- [Graph: the links to cut (pick one here)](transforms/graph-the-links-to-cut-pick-one-here.js) (javascript)
- [Every split: how many links each cuts](transforms/every-split-how-many-links-each-cuts.js) (javascript)
- [Best split: each node's side](transforms/best-split-each-node-s-side.js) (javascript)
- [Annealing runs: 50 per schedule, and random splits](transforms/annealing-runs-50-per-schedule-and-random-splits.js) (javascript)
- [Per schedule: how often the best was found](transforms/per-schedule-how-often-the-best-was-found.sql) (sql)

Graphs:

- [Start here](graphs/start-here.js)
- [The best split (hover a node)](graphs/the-best-split-hover-a-node.js)
- [How rare the best cut is](graphs/how-rare-the-best-cut-is.js)
- [Slower annealing, better cuts?](graphs/slower-annealing-better-cuts.js)

Tables:

- Per schedule

Studies:

- [Does a slower annealing schedule find the best cut more often?](.seebra/study/55a5a6a8-ecb2-57c6-9382-54e489afd096.json)

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/maxcut-annealing/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/maxcut-graphs.json](data/maxcut-graphs.json) (2.0 KB), the data node *Four small graphs, each with its exact max cut*: Computed, not collected: four small graphs (Petersen and others) with their maximum cut found by exhaustive search over every split. Nothing to cite: the numbers can be checked by running the search again.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/maxcut-annealing`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
