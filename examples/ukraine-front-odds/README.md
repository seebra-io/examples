# Ukraine: front, forces and odds

Question: who is gaining ground in Ukraine, where are the forces, and what do markets give for a ceasefire, a peace deal or territorial concessions by a given month? The map lays DeepStateMap's areas of control (now, and the line of 1 January 2026 dashed) on GMRT terrain, with its attack directions, the Russian units and airfields it places, and 120 days of its located updates (each a place it reports changing hands). The area step measures the net change in km² since 1 January; the weekly chart counts reported advances by side. The odds chart is the ontology's 'outcome by deadline': each Polymarket 'by ...?' event is a probability curve over its deadlines (a cumulative distribution), so you can read the chance of a ceasefire before a month and year; Manifold adds play-money forecasts; UN News and GDELT the diplomacy. Caveats: DeepStateMap is a Ukrainian volunteer project (sources: its own, the General Staff, geolocated footage); its unit positions are its placements, not verified here, and a quiet sector is unreported rather than unchanged. Market prices are not probabilities (fees, thin trading; hollow dots break the ordering). GDELT allows one request every 5 seconds per address and may refuse: rerun it. Terrain is about 7 km per cell.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-ukraine-front-odds) · [open the example](https://www.seebra.io/?example=ukraine-front-odds) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fukraine-front-odds) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Society

## Sources

- DeepStateMap.Live: <https://deepstatemap.live/api>
- GMRT (Global Multi-Resolution Topography): <https://www.gmrt.org/services>
- Polymarket (Gamma API): <https://gamma-api.polymarket.com>
- Manifold Markets: <https://api.manifold.markets/v0>
- GDELT DOC 2.0: <https://api.gdeltproject.org/api/v2/doc>
- UN News (RSS): <https://news.un.org/feed/subscribe/en/news/region>

## Steps

Queries:

- [Map now (latest snapshot)](.seebra/query/deee6177-1789-5b79-b026-f567bd808039.json)
- [Map on 31 December 2025 (snapshot 1767200597)](.seebra/query/28243151-21a8-594d-a7b1-61d486087eeb.json)
- [Update log (every snapshot, with its note)](.seebra/query/f17c8fb6-8acb-5e71-b7be-5cec3453ce91.json)
- [Elevation grid around Ukraine (ESRI ASCII, ~4 km)](.seebra/query/d4f40a3b-5b01-52c2-875d-4086caa378a5.json)
- [Open Ukraine markets, by volume](.seebra/query/bb1ca356-b1dd-59ae-8b78-1ffb14e4ea5c.json)
- [Open Ukraine markets (play money)](.seebra/query/7d0cf03b-aab4-57c3-bb5f-f0f13c5b86c4.json)
- [News on talks, ceasefire and sanctions (14 days)](.seebra/query/b8a1e97e-4b97-5a7f-baf0-96257c6219c5.json)
- [UN News: Europe](.seebra/query/cfc0a451-49ca-5081-b296-6e408f65dbbe.json)

Transformations:

- [Terrain grid](transforms/terrain-grid.js) (javascript)
- [Control now: areas, attack directions, units, airfields](transforms/control-now-areas-attack-directions-units.js) (javascript)
- [Control on 31 December 2025](transforms/control-on-31-december-2025.js) (javascript)
- [Area by status, now and on 1 January (km²)](transforms/area-by-status-now-and-on-1-january-km2.js) (javascript)
- [Located updates (120 days)](transforms/located-updates-120-days.js) (javascript)
- [Reported advances per week and side](transforms/reported-advances-per-week-and-side.polars.py) (polars)
- [Markets: probability by deadline](transforms/markets-probability-by-deadline.js) (javascript)
- [Outcome curves (by deadline, consistency)](transforms/outcome-curves-by-deadline-consistency.polars.py) (polars)
- [Play-money forecasts](transforms/play-money-forecasts.js) (javascript)
- [UN News on the war](transforms/un-news-on-the-war.js) (javascript)
- [News articles (GDELT)](transforms/news-articles-gdelt.js) (javascript)

Graphs:

- [Front, forces and recent changes on the terrain](graphs/front-forces-and-recent-changes-on-the-terrain.js)
- [Probability by deadline (Polymarket)](graphs/probability-by-deadline-polymarket.js)
- [Reported advances per week](graphs/reported-advances-per-week.js)

Tables:

- Area held, now and on 1 January
- Reported changes (newest first)
- Every open market
- Manifold forecasts
- UN News
- News on talks, ceasefire and sanctions (GDELT)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/ukraine-front-odds`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
