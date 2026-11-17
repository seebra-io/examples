# Iran: sites, airspace and odds

Question: what is the state of the Iran conflict, and what do markets give for a nuclear deal, strikes, a leadership change or the Strait of Hormuz by a given month? The map lays Iran's nuclear and military sites (coordinates from Wikipedia, each linked), USGS's seismic events of the last 30 days (with the distance to the nearest site) and the aircraft OpenSky sees now on GMRT terrain: an empty Iran beside busy Gulf skies is what a closed airspace looks like. The odds chart is the ontology's 'outcome by deadline': each Polymarket 'by ...?' event is a probability curve over its deadlines (cumulative), and 'continues through ...?' a survival curve (the Israel-Iran ceasefire); Manifold adds play-money forecasts; UN News and GDELT the diplomacy. Caveats: there is no front line here, so 'who is winning' is read from the markets and the news, not from a map; nearly every seismic event in Iran is an earthquake (USGS labels an explosion only when it knows); OpenSky's receivers are sparse in the region, so an empty area can be missing coverage. Market prices are not probabilities (fees, thin trading; hollow dots break the ordering). GDELT allows one request every 5 seconds per address and may refuse: rerun it.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-iran-sites-odds) · [open the example](https://www.seebra.io/?example=iran-sites-odds) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Firan-sites-odds) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Society

## Sources

- GMRT (Global Multi-Resolution Topography): <https://www.gmrt.org/services>
- Wikipedia (MediaWiki API): <https://en.wikipedia.org/w>
- USGS Earthquake Catalog: <https://earthquake.usgs.gov/fdsnws/event/1>
- adsb.lol (ADS-B): <https://api.adsb.lol/v2>
- Polymarket (Gamma API): <https://gamma-api.polymarket.com>
- Manifold Markets: <https://api.manifold.markets/v0>
- GDELT DOC 2.0: <https://api.gdeltproject.org/api/v2/doc>
- UN News (RSS): <https://news.un.org/feed/subscribe/en/news/region>

## Steps

Queries:

- [Elevation grid around Iran (ESRI ASCII, ~4 km)](.seebra/query/ccfd0e6f-ccd8-52cb-8697-c66247eff63f.json)
- [Sites: coordinates and descriptions](.seebra/query/e2e12f92-ad2d-5a6c-b5e2-6bf947adebb3.json)
- [Seismic events M2.5+ in the region (last 30 days)](.seebra/query/cac71931-cde2-55b3-b92c-c4160724cc78.json)
- [Aircraft within 250 nm of Tehran](.seebra/query/1ad31351-9455-51c6-afec-5d9e6feda37c.json)
- [Aircraft within 250 nm of central Iran](.seebra/query/651fc14c-e187-5dee-8fa6-68b5002e69af.json)
- [Aircraft within 250 nm of the Gulf (comparison)](.seebra/query/dee660be-bed9-54fc-b7b4-4f781e99d913.json)
- [Open Iran markets, by volume](.seebra/query/e9b8d4be-94b8-5455-9025-20834ddaa8f1.json)
- [Open Iran markets (play money)](.seebra/query/4ae0ad91-ec88-5486-b206-cda5d1dbb637.json)
- [News on talks, the IAEA and sanctions (14 days)](.seebra/query/8f7816cf-8da7-55d8-bb32-10f832ca92ff.json)
- [UN News: Middle East](.seebra/query/c1f12b41-cd9d-5fd4-bb96-c8dd9e17fc96.json)

Transformations:

- [Terrain grid](transforms/terrain-grid.js) (javascript)
- [Sites with coordinates](transforms/sites-with-coordinates.js) (javascript)
- [Seismic events, with the nearest site](transforms/seismic-events-with-the-nearest-site.js) (javascript)
- [Aircraft now, by circle](transforms/aircraft-now-by-circle.js) (javascript)
- [Aircraft per circle](transforms/aircraft-per-circle.js) (javascript)
- [Markets: probability by deadline](transforms/markets-probability-by-deadline.js) (javascript)
- [Outcome curves (by deadline, consistency)](transforms/outcome-curves-by-deadline-consistency.polars.py) (polars)
- [Play-money forecasts](transforms/play-money-forecasts.js) (javascript)
- [UN News on Iran and the Gulf](transforms/un-news-on-iran-and-the-gulf.js) (javascript)
- [News articles (GDELT)](transforms/news-articles-gdelt.js) (javascript)

Graphs:

- [Sites and seismic events on the terrain](graphs/sites-and-seismic-events-on-the-terrain.js)
- [Airspace now: who is flying over Iran](graphs/airspace-now-who-is-flying-over-iran.js)
- [Probability by deadline (Polymarket)](graphs/probability-by-deadline-polymarket.js)

Tables:

- Sites
- Seismic events (newest first)
- Every open market
- Manifold forecasts
- Aircraft per circle now
- UN News
- News on talks, the IAEA and sanctions (GDELT)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/iran-sites-odds`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
