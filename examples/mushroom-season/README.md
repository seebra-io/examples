# Mushroom season in Sweden

When do mushrooms fruit in Sweden? GBIF records per month (2000–2025) for the chanterelle, funnel chanterelle, porcini, fly agaric and false morel, against all fungi. Statistics idea: months are circular, so the season's centre is a circular mean (each month an angle on the year's clock) and its length R says how concentrated the season is; records follow effort (people search in autumn), so a second mean weights each month by the species' share over all fungi's share. Beside it, Mushroom Observer's 2025 chanterelle photos with the community's identification votes: in North America the 'chanterelle' is many species. Caveats: records are presence-only and follow observers; GBIF mixes citizen science and collections; Mushroom Observer is mostly North American. Next: hover the clock for dates, click an arrow for GBIF's map, swap a taxonKey (any species from GBIF's species search) or country.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-mushroom-season) · [open the example](https://www.seebra.io/?example=mushroom-season) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmushroom-season) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- GBIF: <https://api.gbif.org/v1>
- Mushroom Observer: <https://mushroomobserver.org/api2>

## Steps

Queries:

- [All fungi (Fungi): Swedish records per month, 2000–2025](.seebra/query/1c964ed5-ffcd-5b18-a397-7478b79a5de2.json)
- [Chanterelle (Cantharellus cibarius): Swedish records per month, 2000–2025](.seebra/query/34bd0b90-f537-5512-bec6-8e904619cfde.json)
- [Funnel chanterelle (Craterellus tubaeformis): Swedish records per month, 2000–2025](.seebra/query/3692248c-6593-554b-b359-dbc30ec2bac3.json)
- [Porcini (Boletus edulis): Swedish records per month, 2000–2025](.seebra/query/3d66c81f-c02b-5480-8da6-96d8b046b435.json)
- [Fly agaric (Amanita muscaria): Swedish records per month, 2000–2025](.seebra/query/df07fa4e-4150-56ca-8531-e7e5d7c2e646.json)
- [False morel (Gyromitra esculenta): Swedish records per month, 2000–2025](.seebra/query/4930465b-771d-5ba2-882e-3ae61ae4e8a6.json)
- [Mushroom Observer: chanterelle observations with photos, 2025](.seebra/query/c7b7ac9f-10fc-5966-bc3d-b2db53974e6c.json)

Transformations:

- [All fungi per month](transforms/all-fungi-per-month.polars.py) (polars)
- [Chanterelle per month](transforms/chanterelle-per-month.polars.py) (polars)
- [Funnel chanterelle per month](transforms/funnel-chanterelle-per-month.polars.py) (polars)
- [Porcini per month](transforms/porcini-per-month.polars.py) (polars)
- [Fly agaric per month](transforms/fly-agaric-per-month.polars.py) (polars)
- [False morel per month](transforms/false-morel-per-month.polars.py) (polars)
- [Records per species and month](transforms/records-per-species-and-month.sql) (sql)
- [Share of each species' records per month, against all fungi](transforms/share-of-each-species-records-per-month-against.polars.py) (polars)
- [Circular statistics: mean fruiting date and season length](transforms/circular-statistics-mean-fruiting-date-and.js) (javascript)
- [The season per species, readable](transforms/the-season-per-species-readable.polars.py) (polars)
- [Mushroom Observer's observations, flat](transforms/mushroom-observer-s-observations-flat.js) (javascript)
- [Observations: consensus name, confidence, photo](transforms/observations-consensus-name-confidence-photo.polars.py) (polars)
- [Chanterelle names and how sure the community is](transforms/chanterelle-names-and-how-sure-the-community-is.sql) (sql)

Graphs:

- [When each species is recorded (share of its Swedish records per month)](graphs/when-each-species-is-recorded-share-of-its.js)
- [The season clock: mean fruiting date and how concentrated it is](graphs/the-season-clock-mean-fruiting-date-and-how.js)
- [Which chanterelle? Names and confidence on Mushroom Observer](graphs/which-chanterelle-names-and-confidence-on.js)

Tables:

- The season per species (day of year; links to GBIF)
- Observations (click through to Mushroom Observer)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/mushroom-season`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
