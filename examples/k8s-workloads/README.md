# Kubernetes workload health

Your cluster's pods per namespace and phase, the containers that restart most and why, and those waiting in CrashLoopBackOff or ImagePullBackOff. Statistics: restart counts are a heavy tail (the share restarted at least k times, log-log, against a thin-tailed count with the same mean). Needs signing in and your cluster connected through your organization's gateway.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-k8s-workloads) · [open the example](https://www.seebra.io/?example=k8s-workloads) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fk8s-workloads) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Kubernetes API (your cluster, via your gateway): <https://kubernetes.default.svc>

## Steps

Queries:

- [Pods (all namespaces)](.seebra/query/4061a99e-003c-5495-92a7-2683023b7ecc.json)

Transformations:

- [Pods](transforms/pods.polars.py) (polars)
- [Containers](transforms/containers.polars.py) (polars)
- [Pods per namespace and phase](transforms/pods-per-namespace-and-phase.sql) (sql)
- [Restart counts: at least k (the tail)](transforms/restart-counts-at-least-k-the-tail.polars.py) (polars)
- [Most restarted containers](transforms/most-restarted-containers.sql) (sql)
- [Last termination of restarted containers](transforms/last-termination-of-restarted-containers.polars.py) (polars)
- [Waiting containers (and why)](transforms/waiting-containers-and-why.polars.py) (polars)

Graphs:

- [Pods per namespace, by phase](graphs/pods-per-namespace-by-phase.js)
- [Restarts are a heavy tail (log-log)](graphs/restarts-are-a-heavy-tail-log-log.js)
- [Most restarted containers, by last exit reason](graphs/most-restarted-containers-by-last-exit-reason.js)

Tables:

- Waiting containers
- Most restarted containers
- Last terminations

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/k8s-workloads`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
