# Kubernetes requests vs usage

CPU and memory each container uses (metrics-server) against what it requests: over- and under-provisioned containers and idle requests per namespace. Statistics: a ratio on a log scale and its spread, median against pooled. Needs signing in, metrics-server, and your cluster connected through your organization's gateway.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-k8s-requests-usage) · [open the example](https://www.seebra.io/?example=k8s-requests-usage) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fk8s-requests-usage) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Kubernetes API (your cluster, via your gateway): <https://kubernetes.default.svc>

## Steps

Queries:

- [Pod usage (metrics-server)](.seebra/query/6440582e-2a80-516a-ab0c-15a7edb00be9.json)
- [Pods (all namespaces)](.seebra/query/bdbf8960-8313-5abe-9efc-c5408488b0c9.json)

Transformations:

- [Usage per container](transforms/usage-per-container.polars.py) (polars)
- [Requests per container](transforms/requests-per-container.polars.py) (polars)
- [Usage over request, per container](transforms/usage-over-request-per-container.polars.py) (polars)
- [Request and usage, CPU and memory as rows](transforms/request-and-usage-cpu-and-memory-as-rows.sql) (sql)
- [Per namespace: quantiles of the ratio, pooled ratio and idle requests](transforms/per-namespace-quantiles-of-the-ratio-pooled.polars.py) (polars)

Graphs:

- [Request against usage, per container (log-log)](graphs/request-against-usage-per-container-log-log.js)
- [Usage over request per namespace: the spread](graphs/usage-over-request-per-namespace-the-spread.js)

Tables:

- Per namespace
- Per container

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/k8s-requests-usage`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
