# Swedish wildlife

Recent photographed sightings in Sweden from GBIF (many from iNaturalist): the photos as a grid, which classes of life they show and who took them. Statistics: a count of sightings is not abundance, it follows observer effort. Bird records per province are divided by all photographed records there (the exposure) into a share with a 95% interval; the big provinces lead in counts, not in share. Caveats: a share is still not abundance, and GBIF's province names mix counties and historical provinces.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-swedish-wildlife) · [open the example](https://www.seebra.io/?example=swedish-wildlife) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fswedish-wildlife) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- GBIF: <https://api.gbif.org/v1>

## Steps

Queries:

- [Sightings with photos](.seebra/query/fca9fa50-d9ed-57fa-beed-263895df6b23.json)
- [All photographed records per province (effort)](.seebra/query/fee71895-d7c2-5fed-9690-7e907a9bd608.json)
- [Bird records per province](.seebra/query/14d6ca7b-1495-5c36-b707-bdb43d79267b.json)

Transformations:

- [Photos](transforms/photos.polars.py) (polars)
- [Sightings](transforms/sightings.polars.py) (polars)
- [Per class](transforms/per-class.sql) (sql)
- [Per observer (who the sample is)](transforms/per-observer-who-the-sample-is.sql) (sql)
- [Bird share per province (a rate needs an exposure)](transforms/bird-share-per-province-a-rate-needs-an-exposure.polars.py) (polars)

Graphs:

- [A few observers make most of the sample](graphs/a-few-observers-make-most-of-the-sample.js)
- [Birds per 100 photographed records, per province](graphs/birds-per-100-photographed-records-per-province.js)

Tables:

- Classes of life

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/swedish-wildlife`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
