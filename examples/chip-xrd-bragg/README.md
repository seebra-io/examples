# Bragg's law and the selection rules of semiconductor crystals

Simulated Cu Kα powder patterns of Si, Ge, diamond, GaAs, AlAs and InP from COD cell edges. Idea: Bragg's law plus the structure factor of a two-atom fcc basis: (200) is extinct in Si, faint in GaAs, strong in InP; a film's peak splitting grows as tan θ. Caveats: scattering factors approximated by Z, no thermal motion.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-chip-xrd-bragg) · [open the example](https://www.seebra.io/?example=chip-xrd-bragg) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fchip-xrd-bragg) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Crystallography Open Database (COD): <https://www.crystallography.net/cod>
- PubChem PUG REST: <https://pubchem.ncbi.nlm.nih.gov/rest/pug>

## Steps

Queries:

- [COD entries with formula Si](.seebra/query/7aaab52f-4d62-51a0-9a90-80c929e85112.json)
- [COD entries with formula Ge](.seebra/query/13d988c9-44af-5219-b336-c89f08edd3ca.json)
- [COD entries with formula C](.seebra/query/1535bb7c-7934-54f8-84d0-f1cc730d53d2.json)
- [COD entries with formula As Ga](.seebra/query/67923fa6-7b6e-512c-adc8-e3261f5d2eee.json)
- [COD entries with formula Al As](.seebra/query/3703b7f8-15c4-59ad-9ec8-0159108a6585.json)
- [COD entries with formula In P](.seebra/query/be9766b7-a7ee-5613-b7ba-fb4bac160595.json)
- [Periodic table (atomic numbers)](.seebra/query/24a9c25d-90c2-5193-ad54-6af7d564ba8e.json)

Transformations:

- [All COD entries of the six materials](transforms/all-cod-entries-of-the-six-materials.sql) (sql)
- [Reference cell per material (the most precise cubic entry near the median)](transforms/reference-cell-per-material-the-most-precise.polars.py) (polars)
- [Elements (atomic number Z)](transforms/elements-atomic-number-z.polars.py) (polars)
- [Reflections hkl and the diamond/zincblende selection rule](transforms/reflections-hkl-and-the-diamond-zincblende.sql) (sql)
- [Powder pattern: Bragg angles and intensities (Cu Kα1)](transforms/powder-pattern-bragg-angles-and-intensities-cu-k.sql) (sql)
- [Peak splitting of a layer on its substrate: Δ2θ = −2 tan θ · Δa/a](transforms/peak-splitting-of-a-layer-on-its-substrate-2-2.sql) (sql)

Graphs:

- [Powder patterns: (200) is missing in Si, faint in GaAs, strong in InP](graphs/powder-patterns-200-is-missing-in-si-faint-in.js)
- [Bragg's law: sin²θ against h² + k² + l²](graphs/bragg-s-law-sin2-against-h2-k2-l2.js)
- [Film on substrate: peak splitting grows with tan θ](graphs/film-on-substrate-peak-splitting-grows-with-tan.js)

Tables:

- Reference cells (COD)
- Reflections

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/chip-xrd-bragg`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
