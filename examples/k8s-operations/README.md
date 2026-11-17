# Kubernetes operations: evict a pod

Pods that failed, are pending or keep restarting, the disruption budgets that protect workloads, and an eviction you run yourself: set namespace and pod, dry run, then evict. Changes your cluster; needs signing in, your organization's gateway and a token with a narrow Role.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-k8s-operations) · [open the example](https://www.seebra.io/?example=k8s-operations) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fk8s-operations) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Kubernetes API (your cluster, via your gateway): <https://kubernetes.default.svc>
- Kubernetes API, actions (narrow Role): <https://kubernetes.default.svc>

## Steps

Queries:

- [Pods (all namespaces)](.seebra/query/ae26725e-3fd3-522a-b874-6704c33d69b1.json)
- [PodDisruptionBudgets](.seebra/query/93cba030-5395-5ecb-85d2-81c2d20a08d0.json)
- [Evict: dry run (changes nothing)](queries/evict-dry-run-changes-nothing.json)
- [⚠ Evict (deletes the pod)](queries/evict-deletes-the-pod.json)

Transformations:

- [Pods that need a hand](transforms/pods-that-need-a-hand.polars.py) (polars)
- [Disruption budgets](transforms/disruption-budgets.polars.py) (polars)

Graphs:

- [Pods that need a hand: hover for the parameters](graphs/pods-that-need-a-hand-hover-for-the-parameters.js)
- [Disruption budgets: evictions allowed now](graphs/disruption-budgets-evictions-allowed-now.js)

Tables:

- Pods that need a hand
- Disruption budgets

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/k8s-operations`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
