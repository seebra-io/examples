# Alpha decay: tunnelling explains 40 decades of half-life

IAEA's chart of nuclides: every ground state, the valley of stability, and the α emitters. Physics idea: Gamow's quantum tunnelling through the Coulomb barrier, computed from Z, A and Q alone, puts 142 even–even emitters spanning 42 decades of half-life on one line (slope 0.99, scatter 0.4 dex). Caveats: no preformation or centrifugal barrier; odd nuclei are hindered.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-alpha-decay-tunnelling) · [open the example](https://www.seebra.io/?example=alpha-decay-tunnelling) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Falpha-decay-tunnelling) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- IAEA LiveChart of Nuclides API: <https://nds.iaea.org/relnsd/v1>

## Steps

Queries:

- [All nuclides' ground states (CSV)](.seebra/query/f659c753-bd36-59f2-b23f-b3b86f8ef68e.json)

Transformations:

- [CSV rows (the columns' types change after row 100)](transforms/csv-rows-the-columns-types-change-after-row-100.js) (javascript)
- [Nuclides with decay mode, half-life and Q_α](transforms/nuclides-with-decay-mode-half-life-and-q.polars.py) (polars)
- [α emitters: daughter, reduced mass, radius and turning point](transforms/emitters-daughter-reduced-mass-radius-and.polars.py) (polars)
- [Gamow's tunnelling exponent (WKB)](transforms/gamow-s-tunnelling-exponent-wkb.sql) (sql)
- [log₁₀ t½ against the exponent, per nucleon parity](transforms/log10-t1-2-against-the-exponent-per-nucleon.polars.py) (polars)
- [Geiger–Nuttall and Gamow views](transforms/geiger-nuttall-and-gamow-views.sql) (sql)

Graphs:

- [The chart of nuclides: the valley of stability and how nuclei decay](graphs/the-chart-of-nuclides-the-valley-of-stability.js)
- [Geiger–Nuttall becomes one line: quantum tunnelling](graphs/geiger-nuttall-becomes-one-line-quantum.js)

Tables:

- Fit per parity
- α emitters with their tunnelling exponent

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/alpha-decay-tunnelling`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
