# Cluster live

The observability basics of a Kubernetes namespace, live every 15 s: request rate, error ratio and p50/p99 latency per service (Prometheus), each with its usual band and the same time yesterday, points outside it in red and a note in plain words ("p99 for checkout is 3.1× its usual level since 14:02"); CPU and memory per workload against requests and limits, restarts, and a forecast to the limit ("memory limit reached in ~40 min", "disk full in ~14 h"); pod phases, the log rate (Loki) and deploy markers from the rollouts. Hover for the baseline and the pods behind a point; click to drill down to a workload's pods, events and logs; expand to the other services and the nodes. The PromQL and LogQL are in Parameters. Runs signed out on clearly labelled sample data: connect your cluster to run on yours.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-cluster-live) · [open the example](https://www.seebra.io/?example=cluster-live) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fcluster-live) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Prometheus (sample; yours: http://localhost:9090/api/v1): <https://www.seebra.io/explore/examples/cluster-live/sample/prometheus/api/v1>
- Kubernetes API (sample; yours: kubectl proxy on http://localhost:8001): <https://www.seebra.io/explore/examples/cluster-live/sample/kubernetes>
- Loki (sample; yours: http://localhost:3100/loki/api/v1): <https://www.seebra.io/explore/examples/cluster-live/sample/loki/loki/api/v1>

## Steps

Queries:

- [Services: requests/s, errors, p50 and p99 (RED)](.seebra/query/2a49b334-6313-5407-a932-88ab3fead9ff.json)
- [The same services yesterday (offset 1d)](.seebra/query/5f6b2c6e-ebec-5d4b-a786-f945e42d1c00.json)
- [Workloads: CPU and memory against requests and limits, restarts, pod phases](.seebra/query/487bc0e7-07b8-514e-9eae-a27e5fcf9ab7.json)
- [Nodes: CPU and memory against allocatable](.seebra/query/122a220d-5d03-539a-952b-40f512b4eaad.json)
- [Volumes: used and capacity per PVC](.seebra/query/223d71ac-41a1-5e36-9ccd-e98e086e85cf.json)
- [Pods of the namespace](.seebra/query/bd0e09dd-87b2-5d8e-8eb3-6532921310a4.json)
- [Events of the namespace](.seebra/query/34484625-9669-5a08-9263-683e0df3acd1.json)
- [ReplicaSets of the namespace (rollouts)](.seebra/query/fb059b70-c7e1-5653-901c-34d9b223558e.json)
- [Log rate per app: all lines and errors (LogQL)](.seebra/query/f97a72eb-30e0-5067-bef9-1cae465b8dc6.json)
- [The newest error-ish log lines (LogQL)](.seebra/query/a34f715e-3ea2-59f0-b0dd-b212147b4dad.json)

Transformations:

- [Metrics as rows (ms, %, cores, MiB)](transforms/metrics-as-rows-ms-cores-mib.js) (javascript)
- [Usual band per service signal: rolling median ± k·MAD](transforms/usual-band-per-service-signal-rolling-median-k.js) (javascript)
- [Notes: outside the usual band, in plain words](transforms/notes-outside-the-usual-band-in-plain-words.js) (javascript)
- [Forecast: memory, volumes and nodes against their limits (Holt)](transforms/forecast-memory-volumes-and-nodes-against-their.js) (javascript)
- [Pods, events and rollouts](transforms/pods-events-and-rollouts.js) (javascript)
- [Log rate and lines](transforms/log-rate-and-lines.js) (javascript)

Graphs:

- [Cluster live: services, workloads, pods and logs](graphs/cluster-live-services-workloads-pods-and-logs.js)

Tables:

- Notes: what is outside its usual band
- Forecasts: what reaches its limit, and when

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/cluster-live`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
