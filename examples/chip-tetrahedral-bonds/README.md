# Why semiconductors are tetrahedral: the Mooser–Pearson map

Octet AB compounds (Alexandria ground states, PubChem electronegativities) on Δχ against mean principal quantum number. Idea: covalent bonds between light atoms are tetrahedral (zincblende, wurtzite), ionic ones rock salt; one Δχ threshold sorts 87%, Fisher's line 91%. Caveats: Pauling Δχ is a crude ionicity; PBE puts Li halides in wurtzite.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-chip-tetrahedral-bonds) · [open the example](https://www.seebra.io/?example=chip-tetrahedral-bonds) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fchip-tetrahedral-bonds) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Alexandria (PBE) OPTIMADE API: <https://alexandria.icams.rub.de/pbe/v1>
- PubChem PUG REST: <https://pubchem.ncbi.nlm.nih.gov/rest/pug>

## Steps

Queries:

- [Stable binary compounds AB with 2 or 4 atoms per cell](.seebra/query/8f40f19a-619b-519b-ba7e-c17ff97b96e2.json)
- [Periodic table (configuration, electronegativity)](.seebra/query/1f8f65f2-2342-57a3-9a61-816046f8a7ef.json)

Transformations:

- [Elements: valence, period, electronegativity](transforms/elements-valence-period-electronegativity.polars.py) (polars)
- [Octet compounds AB: Δχ, mean principal quantum number, coordination](transforms/octet-compounds-ab-mean-principal-quantum-number.polars.py) (polars)
- [One threshold on Δχ: where does tetrahedral give way to octahedral?](transforms/one-threshold-on-where-does-tetrahedral-give-way.polars.py) (polars)
- [Fisher's linear discriminant on (Δχ, n̄): the Mooser–Pearson line](transforms/fisher-s-linear-discriminant-on-n-the-mooser.polars.py) (polars)
- [Each compound against both rules](transforms/each-compound-against-both-rules.polars.py) (polars)
- [How well do the rules separate the structures?](transforms/how-well-do-the-rules-separate-the-structures.sql) (sql)
- [Coordination per family](transforms/coordination-per-family.sql) (sql)

Graphs:

- [Mooser–Pearson map: covalent and light means tetrahedral](graphs/mooser-pearson-map-covalent-and-light-means.js)
- [How well one Δχ threshold separates them](graphs/how-well-one-threshold-separates-them.js)

Tables:

- Rules against the structures
- Coordination per family
- Compounds and both rules

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/chip-tetrahedral-bonds`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
