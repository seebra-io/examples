# Kubernetes capacity and bin-packing

Each node's allocatable CPU and memory against the requests of the pods on it: headroom, stranded resources, and how many more typical pods fit. Statistics: utilisation is a distribution over nodes, and free capacity only counts where a whole pod fits. Needs signing in and your cluster connected through your organization's gateway.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-k8s-capacity) · [open the example](https://www.seebra.io/?example=k8s-capacity) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fk8s-capacity) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Kubernetes API (your cluster, via your gateway): <https://kubernetes.default.svc>

## Steps

Queries:

- [Nodes](.seebra/query/aa34bbfd-44b1-5697-924d-328bd9921abc.json)
- [Pods (all namespaces)](.seebra/query/7e7aaaaf-9d3d-553c-8e18-b483ae7d9feb.json)

Transformations:

- [Allocatable per node](transforms/allocatable-per-node.polars.py) (polars)
- [Requests per pod](transforms/requests-per-pod.polars.py) (polars)
- [Requests per node](transforms/requests-per-node.sql) (sql)
- [Headroom per node (and how many typical pods still fit)](transforms/headroom-per-node-and-how-many-typical-pods.polars.py) (polars)

Graphs:

- [Requested share of each node, CPU and memory](graphs/requested-share-of-each-node-cpu-and-memory.js)
- [Bin-packing: CPU against memory per node](graphs/bin-packing-cpu-against-memory-per-node.js)
- [How many more typical pods fit, per node](graphs/how-many-more-typical-pods-fit-per-node.js)

Tables:

- Headroom per node
- Requests per pod

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/k8s-capacity`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
