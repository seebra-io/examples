# Can I fly ESSA → ESGG VFR now?

A VFR go/no-go from every METAR and TAF in Sweden and its neighbours (NOAA AWC), SIGMETs and SMHI's model along the route: each TAF group graded against the SERA VMC minima (1500 ft, 5 km) in each airport's ±1 h window. The aha: the TEMPO/PROB groups, not the prevailing forecast or the METAR, decide a VFR flight a few hours out. Not an official briefing.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-can-i-fly-vfr-sweden) · [open the example](https://www.seebra.io/?example=can-i-fly-vfr-sweden) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fcan-i-fly-vfr-sweden) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- NOAA Aviation Weather Center Data API: <https://aviationweather.gov/api/data>
- SMHI open data: point forecast snow1g (CC BY 4.0): <https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1>

## Steps

Queries:

- [METARs, 55–69°N 10–24°E (latest per station)](.seebra/query/b6bd7537-d70a-5143-943f-3f8a7375ad76.json)
- [TAFs, 55–69°N 10–24°E (latest per airport)](.seebra/query/332ded4f-9679-57b9-b08e-6eb678133599.json)
- [International SIGMETs (worldwide)](.seebra/query/1189a1ae-fee7-5e5a-800f-bf4dae39806b.json)
- [SMHI forecast at ESSA (59.65°N 17.92°E)](.seebra/query/e5756c17-e8ad-5734-baf8-16eb913b2b08.json)
- [SMHI forecast at 25% of the route (59.18°N 16.45°E)](.seebra/query/e1ebaa97-892d-5cf3-9f36-3ef487946f80.json)
- [SMHI forecast at 50% of the route (58.69°N 15.02°E)](.seebra/query/62158f7d-08bc-5d63-a045-c3110a86aa5d.json)
- [SMHI forecast at 75% of the route (58.18°N 13.63°E)](.seebra/query/9d2bed50-cd77-543a-a8be-a7a4c95a4bdc.json)
- [SMHI forecast at ESGG (57.66°N 12.28°E)](.seebra/query/ced0fa77-083c-5954-abf7-03eb5eda5580.json)

Transformations:

- [The route (edit here): ESSA → ESGG, alternates ESOE, ESGJ, ETD now + 2 h](transforms/the-route-edit-here-essa-esgg-alternates-esoe.polars.py) (polars)
- [Along the route: distance, when each airport is used, its ±1 h window](transforms/along-the-route-distance-when-each-airport-is.polars.py) (polars)
- [METARs with every field (AWC leaves out the ones no station reports)](transforms/metars-with-every-field-awc-leaves-out-the-ones.js) (javascript)
- [METARs decoded: flight category and SERA VMC minima](transforms/metars-decoded-flight-category-and-sera-vmc.polars.py) (polars)
- [TAF change groups (BASE, FM, BECMG, TEMPO, PROB) decoded](transforms/taf-change-groups-base-fm-becmg-tempo-prob.polars.py) (polars)
- [The hour grid (UTC, next 30 h)](transforms/the-hour-grid-utc-next-30-h.polars.py) (polars)
- [Prevailing forecast per airport and hour](transforms/prevailing-forecast-per-airport-and-hour.polars.py) (polars)
- [What each TAF allows, hour by hour (prevailing and TEMPO/PROB)](transforms/what-each-taf-allows-hour-by-hour-prevailing-and.polars.py) (polars)
- [Between the airports: SMHI's model along the route, hour by hour](transforms/between-the-airports-smhi-s-model-along-the.polars.py) (polars)
- [Verdict per airport in its window (TAF ± 1 h, METAR now)](transforms/verdict-per-airport-in-its-window-taf-1-h-metar.polars.py) (polars)
- [Verdict between the airports (model, at the time the aircraft passes)](transforms/verdict-between-the-airports-model-at-the-time.polars.py) (polars)
- [The route hour by hour: airports meeting VMC minima](transforms/the-route-hour-by-hour-airports-meeting-vmc.polars.py) (polars)
- [SIGMETs as polygons, those near Sweden first](transforms/sigmets-as-polygons-those-near-sweden-first.js) (javascript)
- [Every TAF in the box: share below VMC minima per hour ahead, prevailing vs all groups](transforms/every-taf-in-the-box-share-below-vmc-minima-per.polars.py) (polars)
- [Does each METAR fall inside its own TAF? (forensics)](transforms/does-each-metar-fall-inside-its-own-taf.polars.py) (polars)

Graphs:

- [Verdict: can ESSA → ESGG be flown VFR at the planned time, and what decides it](graphs/verdict-can-essa-esgg-be-flown-vfr-at-the.js)
- [The route over Sweden: METAR flight categories now, SMHI model points, SIGMETs](graphs/the-route-over-sweden-metar-flight-categories.js)
- [TAF timeline across the departure window: prevailing vs TEMPO/PROB, and the model between](graphs/taf-timeline-across-the-departure-window.js)
- [Why read past the TAF's first line: airports below VMC minima, prevailing vs everything the TAF allows](graphs/why-read-past-the-taf-s-first-line-airports.js)

Tables:

- Per airport: verdict, deciding group, METAR now
- All METARs in the box, decoded
- Does each METAR fall inside its TAF?

Studies:

- [Do TEMPO/PROB groups, not the prevailing forecast, decide VFR a few hours out?](.seebra/study/9ca10029-f19b-5ec3-9f67-ca7403a2f2a0.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/can-i-fly-vfr-sweden`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
