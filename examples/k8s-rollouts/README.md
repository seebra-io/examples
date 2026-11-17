# Kubernetes rollouts and image drift

Deployments' desired, updated and available replicas, unfinished or stuck rollouts, pods still running an old image, and the versions of each image across deployments. Statistics: a version distribution, by its modal share and Simpson's diversity. Needs signing in and your cluster connected through your organization's gateway.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-k8s-rollouts) · [open the example](https://www.seebra.io/?example=k8s-rollouts) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fk8s-rollouts) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Kubernetes API (your cluster, via your gateway): <https://kubernetes.default.svc>

## Steps

Queries:

- [Deployments (all namespaces)](.seebra/query/b4f26ecb-9db0-56d4-82d0-54742ce9e791.json)
- [Pods (all namespaces)](.seebra/query/2c05b48e-6bd8-59fe-9081-ce385263e7f5.json)

Transformations:

- [Rollouts](transforms/rollouts.polars.py) (polars)
- [Template images](transforms/template-images.polars.py) (polars)
- [Versions per image: mode and diversity](transforms/versions-per-image-mode-and-diversity.polars.py) (polars)
- [Running pods against their template](transforms/running-pods-against-their-template.polars.py) (polars)

Graphs:

- [Replicas per deployment: desired, updated, available](graphs/replicas-per-deployment-desired-updated.js)
- [Image versions per repository (drift)](graphs/image-versions-per-repository-drift.js)

Tables:

- Rollouts
- Running pods against their template
- Versions per image

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/k8s-rollouts`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
