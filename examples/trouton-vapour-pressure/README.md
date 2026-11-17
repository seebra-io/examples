# Trouton's rule: the vapour pressure from the boiling point

Wikidata vapour pressures and boiling points for 326 pure liquids: Clausius–Clapeyron with Trouton's constant entropy of vaporisation predicts most vapour pressures within a factor of 2 from the boiling point alone; hydrogen-bonded liquids (alcohols, glycols, acids) evaporate about half as readily as predicted.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-trouton-vapour-pressure) · [open the example](https://www.seebra.io/?example=trouton-vapour-pressure) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Ftrouton-vapour-pressure) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Wikidata Query Service: <https://query.wikidata.org>

## Steps

Queries:

- [Vapour pressures with their temperature, and boiling points (Wikidata, as entered)](.seebra/query/3442c3c7-78b2-5a13-97b0-464aeb44affc.json)

Transformations:

- [Values in SI units (Pa, K)](transforms/values-in-si-units-pa-k.polars.py) (polars)
- [One liquid each: implied ΔS_vap and Trouton's prediction](transforms/one-liquid-each-implied-s-vap-and-trouton-s.polars.py) (polars)
- [Per class: ΔS_vap and how often the boiling point predicts P within ×2](transforms/per-class-s-vap-and-how-often-the-boiling-point.polars.py) (polars)
- [Welch's t: O–H donors against non-donors](transforms/welch-s-t-o-h-donors-against-non-donors.polars.py) (polars)
- [Data check: readings no liquid could give](transforms/data-check-readings-no-liquid-could-give.sql) (sql)

Graphs:

- [One line for every liquid: the reduced Clausius–Clapeyron plot](graphs/one-line-for-every-liquid-the-reduced-clausius.js)
- [Trouton's rule: the entropy of vaporisation per class of liquid](graphs/trouton-s-rule-the-entropy-of-vaporisation-per.js)
- [The vapour pressure from the boiling point alone](graphs/the-vapour-pressure-from-the-boiling-point-alone.js)

Tables:

- Per class of liquid
- O–H donors vs non-donors (Welch)
- Readings to check on Wikidata
- Liquids

Studies:

- [Do hydrogen-bond donors evaporate less than Trouton predicts?](.seebra/study/f352d160-c271-56ee-b918-b7027b06baa2.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/trouton-vapour-pressure`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
