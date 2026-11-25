# Why did methane surge? Its budget, its short memory and its push on the climate

Forty years of global methane (NOAA): the 2000–2006 pause, the record 2020–2022 surge, and the budget behind it. About 600 Tg are emitted and almost as much destroyed each year, so the record 2021 was an 8.5% imbalance. Its 9-year lifetime gives it a short memory: cut 30% by 2030 and it falls back to its 1980s level by 2050. ENSO explains about 1% of the wobble. Methane is 18% of the long-lived gases' forcing.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-methane-budget) · [open the example](https://www.seebra.io/?example=methane-budget) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmethane-budget) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- NOAA Global Monitoring Laboratory (trends): <https://gml.noaa.gov/webdata/ccgg/trends>
- NOAA Climate Prediction Center (indices): <https://www.cpc.ncep.noaa.gov/data/indices>

## Steps

Queries:

- [Global methane, monthly means and trend (ppb)](.seebra/query/b9a436ab-e807-5594-97f2-f888a9b5a90c.json)
- [Global methane, annual increase (ppb/yr)](.seebra/query/ba2f99d0-13f1-5dd2-b189-39bb703636b8.json)
- [Global CO₂, monthly means (ppm)](.seebra/query/d3ac8fe5-e6c3-5112-8a62-7156312950d2.json)
- [Global N₂O, monthly means (ppb)](.seebra/query/6ce1434f-6762-5685-b6a8-21ac4ac0bf44.json)
- [Oceanic Niño Index (ENSO), three-month seasons since 1950](.seebra/query/0553f3fc-fb3c-5d58-93ea-9f00a2ceb208.json)

Transformations:

- [Growth, ENSO, the budget, three futures and the forcing](transforms/growth-enso-the-budget-three-futures-and-the.js) (javascript)
- [One row per year](transforms/one-row-per-year.js) (javascript)
- [The three futures, every five years](transforms/the-three-futures-every-five-years.js) (javascript)

Graphs:

- [Forty years of methane, era by era](graphs/forty-years-of-methane-era-by-era.js)
- [How fast it rises, and ENSO](graphs/how-fast-it-rises-and-enso.js)
- [The budget: two big flows and a thin gap](graphs/the-budget-two-big-flows-and-a-thin-gap.js)
- [A short memory: three futures from today's emissions](graphs/a-short-memory-three-futures-from-today-s.js)
- [The push on the climate: CO₂, CH₄ and N₂O](graphs/the-push-on-the-climate-co2-ch4-and-n2o.js)

Tables:

- Years
- Futures

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/methane-budget`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
