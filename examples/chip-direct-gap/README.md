# Direct and indirect band gaps: why LEDs are not silicon

Every stable element and binary compound with a gap in Alexandria (PBE) by family, from PubChem valences. Idea: an indirect gap needs a phonon to emit light; Si sits 1.9 eV above the direct line, GaAs, InP, GaN and Zn/Cd chalcogenides on it. Shares per family with Wilson intervals and a two-proportion test. Caveats: PBE gaps are 30–100% too small (Ge, InAs missing), small families.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-chip-direct-gap) · [open the example](https://www.seebra.io/?example=chip-direct-gap) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fchip-direct-gap) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Alexandria (PBE) OPTIMADE API: <https://alexandria.icams.rub.de/pbe/v1>
- PubChem PUG REST: <https://pubchem.ncbi.nlm.nih.gov/rest/pug>

## Steps

Queries:

- [Stable elements and binary compounds with a band gap (≤ 4 atoms per cell)](.seebra/query/123ab969-9919-531a-94df-f2c4f71a8e87.json)
- [Periodic table (electron configurations, electronegativity)](.seebra/query/d3cd78ca-9016-52e7-8ad5-d5e2d6e33556.json)

Transformations:

- [Materials: band gap and direct gap (eV)](transforms/materials-band-gap-and-direct-gap-ev.polars.py) (polars)
- [Elements: valence electrons and electronegativity](transforms/elements-valence-electrons-and-electronegativity.polars.py) (polars)
- [Materials by family (IV, III-V, II-VI, ...)](transforms/materials-by-family-iv-iii-v-ii-vi.polars.py) (polars)
- [Share of direct-gap materials per family (Wilson 95%)](transforms/share-of-direct-gap-materials-per-family-wilson.polars.py) (polars)
- [Two-proportion test: III-V and II-VI against the rest](transforms/two-proportion-test-iii-v-and-ii-vi-against-the.sql) (sql)
- [z and p for H1](transforms/z-and-p-for-h1.polars.py) (polars)

Graphs:

- [Band gaps by family: who is direct?](graphs/band-gaps-by-family-who-is-direct.js)
- [Direct against fundamental gap: the phonon a photon would need](graphs/direct-against-fundamental-gap-the-phonon-a.js)
- [Direct-gap share per family](graphs/direct-gap-share-per-family.js)

Tables:

- Direct-gap share per family
- H1: z-test
- Materials

Studies:

- [Are III-V and II-VI semiconductors more often direct-gap?](.seebra/study/6cc25f70-b39a-5395-b97f-6f7ee94fdd61.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/chip-direct-gap`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
