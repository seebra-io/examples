# How bridges wear out

US National Bridge Inventory (FHWA, 2025): condition ratings by age, material and reconstruction. The poor share doubles every ~7 years until 45, then repairs bend the curve; ageing alone takes 41,319 poor bridges to ~56,000 by 2035.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-bridge-deterioration) · [open the example](https://www.seebra.io/?example=bridge-deterioration) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fbridge-deterioration) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- US National Bridge Inventory (FHWA, via BTS NTAD ArcGIS): <https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_National_Bridge_Inventory/FeatureServer/0>

## Steps

Queries:

- [Bridges per year built and lowest condition rating](.seebra/query/8f81e594-587f-568b-9e80-78f2fe494d57.json)
- [Bridges and mean lowest rating per main-span material and year built](.seebra/query/9b11b3e1-771b-5777-afcf-9dd0e5acaf1b.json)
- [Bridges per main-span material and lowest rating](.seebra/query/8c2df971-a767-52a6-b8b6-0a4741d7849e.json)
- [Reconstructed bridges: mean lowest rating per year of reconstruction](.seebra/query/c2f1db64-0c5e-515f-8e67-4386e8acfff3.json)
- [Reconstructed bridges: mean lowest rating per year built](.seebra/query/40508eb7-fa1e-544d-b7c6-db24e44d439f.json)
- [Never-reconstructed bridges: mean lowest rating per year built](.seebra/query/f4964714-5971-5fe6-91d9-1aef4993d36f.json)

Transformations:

- [Rating distribution per 5-year age band](transforms/rating-distribution-per-5-year-age-band.polars.py) (polars)
- [Per age band: bridges, mean lowest rating, poor share](transforms/per-age-band-bridges-mean-lowest-rating-poor.polars.py) (polars)
- [Age at which half the bridges have dropped below each rating](transforms/age-at-which-half-the-bridges-have-dropped-below.polars.py) (polars)
- [Wear-in: the poor share grows exponentially with age, fit ln(share poor) on age over 5–44 years](transforms/wear-in-the-poor-share-grows-exponentially-with.polars.py) (polars)
- [If nothing were replaced: poor bridges in 2035 and 2045 from today's age-specific poor shares](transforms/if-nothing-were-replaced-poor-bridges-in-2035.polars.py) (polars)
- [Mean lowest rating per material and 10-year age band](transforms/mean-lowest-rating-per-material-and-10-year-age.polars.py) (polars)
- [Per material: bridges, poor share, mean age, and the mean rating at 40–59 years](transforms/per-material-bridges-poor-share-mean-age-and-the.polars.py) (polars)
- [Which clock does a reconstructed bridge follow? Mean rating per 10 years since built, and since reconstruction](transforms/which-clock-does-a-reconstructed-bridge-follow.polars.py) (polars)

Graphs:

- [Condition ratings by age: the whole inventory as a distribution](graphs/condition-ratings-by-age-the-whole-inventory-as.js)
- [Poor share against age: exponential wear-in, then the bend](graphs/poor-share-against-age-exponential-wear-in-then.js)
- [The interstate cohorts age: poor bridges in 2035 and 2045 at today's age-specific shares](graphs/the-interstate-cohorts-age-poor-bridges-in-2035.js)
- [Materials at the same age](graphs/materials-at-the-same-age.js)
- [Does reconstruction reset the clock?](graphs/does-reconstruction-reset-the-clock.js)

Tables:

- Age at which half the bridges are below each rating
- Wear-in fit: growth rate and doubling time of the poor share
- Materials: poor share, mean age, rating at 40–59 years
- Cohorts and their projected poor bridges

Studies:

- [Does the poor share grow exponentially with a bridge's age?](.seebra/study/ee16a408-5bfa-548d-a0c4-d9005a3b991b.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/bridge-deterioration`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
