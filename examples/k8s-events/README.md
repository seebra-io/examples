# Kubernetes warning events

Your cluster's warning events over the last hour, by reason and object, and the ones that keep recurring. Statistics: events as a Poisson process, with a dispersion index and burst minutes (Bonferroni over the window). Needs signing in and your cluster connected through your organization's gateway.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-k8s-events) · [open the example](https://www.seebra.io/?example=k8s-events) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fk8s-events) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Kubernetes API (your cluster, via your gateway): <https://kubernetes.default.svc>

## Steps

Queries:

- [Warning events (all namespaces)](.seebra/query/bd35aec2-0c43-5207-af38-998433b2157e.json)

Transformations:

- [Warning events](transforms/warning-events.polars.py) (polars)
- [Warnings per minute, against a Poisson process](transforms/warnings-per-minute-against-a-poisson-process.polars.py) (polars)
- [Warnings per reason and kind](transforms/warnings-per-reason-and-kind.sql) (sql)
- [Recurring warnings: occurrences per hour](transforms/recurring-warnings-occurrences-per-hour.polars.py) (polars)

Graphs:

- [Warnings per minute, and the bursts](graphs/warnings-per-minute-and-the-bursts.js)
- [Warnings per reason](graphs/warnings-per-reason.js)
- [Recurring warnings, per hour](graphs/recurring-warnings-per-hour.js)

Tables:

- Warnings per reason
- Warning events

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/k8s-events`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
