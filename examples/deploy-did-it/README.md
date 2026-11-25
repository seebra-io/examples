# Did the deploy do it?

Every rollout of a deployment (Kubernetes ReplicaSets and events: image before → after) on its p99 latency, error ratio, traffic and restarts from Prometheus, with a verdict per rollout in plain words: the change of median with a 95% block-bootstrap interval, a Mann-Whitney test and its effect size. Caveats per rollout: traffic changes, other services moving too, rollouts close together, short windows, missing metrics. Drill down to a rollout's log messages (Loki), events and pods; expand to the other services at the same time. The PromQL is in Parameters. Runs signed out on clearly labelled sample data: connect your cluster to run on yours.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-deploy-did-it) · [open the example](https://www.seebra.io/?example=deploy-did-it) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fdeploy-did-it) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Kubernetes API (sample cluster; yours: kubectl proxy on http://localhost:8001): <https://www.seebra.io/explore/examples/deploy-did-it/sample/kubernetes>
- Prometheus (sample; yours: http://localhost:9090/api/v1): <https://www.seebra.io/explore/examples/deploy-did-it/sample/prometheus/api/v1>
- Loki (sample; yours: http://localhost:3100/loki/api/v1): <https://www.seebra.io/explore/examples/deploy-did-it/sample/loki/loki/api/v1>

## Steps

Queries:

- [ReplicaSets of the namespace (one per rollout)](.seebra/query/4074235f-3a56-54f1-86c7-ef30333299a6.json)
- [Events of the namespace](.seebra/query/ba218237-67a7-5dc3-a6dc-fd59187c87ac.json)
- [Pods of the namespace](.seebra/query/8e02a997-3364-52b7-8c05-37387286cbeb.json)
- [p99, errors, traffic, restarts and the neighbours' p99 over the window (one PromQL subquery)](.seebra/query/e668ed2b-3575-5025-be55-fd5a455e27d3.json)
- [Error-ish log lines over the window (LogQL)](.seebra/query/ddff9f94-98a2-5c94-988c-91b4868c7e09.json)

Transformations:

- [Rollouts: revision, time, image before → after](transforms/rollouts-revision-time-image-before-after.js) (javascript)
- [Signals as rows (ms, %, req/s)](transforms/signals-as-rows-ms-req-s.js) (javascript)
- [Before/after per rollout: medians, bootstrap CI, Mann-Whitney, caveats](transforms/before-after-per-rollout-medians-bootstrap-ci.js) (javascript)
- [The points each verdict compared](transforms/the-points-each-verdict-compared.js) (javascript)
- [Log lines with their template](transforms/log-lines-with-their-template.js) (javascript)
- [Drill down: messages before vs after each rollout](transforms/drill-down-messages-before-vs-after-each-rollout.js) (javascript)
- [Drill down: events and pods of each rollout](transforms/drill-down-events-and-pods-of-each-rollout.js) (javascript)
- [Expand: the other services at the same time](transforms/expand-the-other-services-at-the-same-time.js) (javascript)

Graphs:

- [p99, errors and traffic with the rollouts](graphs/p99-errors-and-traffic-with-the-rollouts.js)
- [Verdict per rollout](graphs/verdict-per-rollout.js)
- [Drill down: a rollout's logs, events and pods](graphs/drill-down-a-rollout-s-logs-events-and-pods.js)
- [Expand: did the other services move too?](graphs/expand-did-the-other-services-move-too.js)

Tables:

- Verdicts
- Rollouts

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/deploy-did-it`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
