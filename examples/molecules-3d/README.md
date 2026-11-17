# Molecules in 3D

A small molecule from PubChem (caffeine; change the name in the query's path) as ball and stick from its computed 3D conformer, with its properties; and a protein from the RCSB Protein Data Bank (haemoglobin, 4HHB) as a backbone per chain with its haem groups. Statistics: the bond lengths, computed from the atoms' coordinates, form a distribution per bond kind: bands by kind, double bonds shorter than single ones, and the conjugated ring's C–N bonds spread between the two (a computed conformer with few bonds per kind, not a measurement). Hover atoms, bonds and chains; drag to orbit.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-molecules-3d) · [open the example](https://www.seebra.io/?example=molecules-3d) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmolecules-3d) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- PubChem PUG REST: <https://pubchem.ncbi.nlm.nih.gov/rest/pug>
- RCSB PDB files: <https://files.rcsb.org>

## Steps

Queries:

- [Caffeine 3D conformer](.seebra/query/6fb19715-dd83-5cf9-beb2-6a75267233d8.json)
- [Caffeine properties](.seebra/query/7542ba83-00ef-5ee9-bad3-50580a277c91.json)
- [Haemoglobin 4HHB (PDB)](.seebra/query/d88d5c25-6147-55f2-944e-5af4ed411ce6.json)

Transformations:

- [Atoms (3D conformer)](transforms/atoms-3d-conformer.polars.py) (polars)
- [Bonds with their lengths](transforms/bonds-with-their-lengths.polars.py) (polars)
- [Bond length per kind (distribution)](transforms/bond-length-per-kind-distribution.polars.py) (polars)
- [Properties](transforms/properties.polars.py) (polars)
- [Atoms](transforms/atoms.js) (javascript)
- [Per chain](transforms/per-chain.sql) (sql)

Graphs:

- [Caffeine (3D)](graphs/caffeine-3d.js)
- [Bond lengths cluster by kind (a distribution per bond type)](graphs/bond-lengths-cluster-by-kind-a-distribution-per.js)
- [Haemoglobin (3D)](graphs/haemoglobin-3d.js)

Tables:

- Properties
- Chains

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/molecules-3d`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
