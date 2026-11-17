# The C-value paradox: genome size against gene number

1,000 annotated reference genomes (NCBI Datasets) of bacteria, archaea, fungi, plants and animals. Genes scale with genome size in bacteria (b = 1.01, about 900 genes per Mb) but hardly in animals (b = 0.15) or plants (0.26): most of a big genome is not genes. Caveats: NCBI's first 200 per group, annotation-dependent counts.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-c-value-paradox) · [open the example](https://www.seebra.io/?example=c-value-paradox) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fc-value-paradox) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- NCBI Datasets v2: <https://api.ncbi.nlm.nih.gov/datasets/v2>

## Steps

Queries:

- [Bacteria: annotated reference genomes](.seebra/query/3320be80-9357-5078-a35e-19dd7cff6f7a.json)
- [Archaea: annotated reference genomes](.seebra/query/cdcc3e42-c752-597d-972b-92cb68d1f33e.json)
- [Fungi: annotated reference genomes](.seebra/query/e6acfbb6-3ecb-585f-87c5-ef3c109b8578.json)
- [Plants (Viridiplantae): annotated reference genomes](.seebra/query/8284e352-1037-5845-8256-091dc34f1273.json)
- [Animals (Metazoa): annotated reference genomes](.seebra/query/97a47518-ea02-5e53-b497-06ba088ed821.json)

Transformations:

- [Bacteria: size and genes](transforms/bacteria-size-and-genes.polars.py) (polars)
- [Archaea: size and genes](transforms/archaea-size-and-genes.polars.py) (polars)
- [Fungi: size and genes](transforms/fungi-size-and-genes.polars.py) (polars)
- [Plants (Viridiplantae): size and genes](transforms/plants-viridiplantae-size-and-genes.polars.py) (polars)
- [Animals (Metazoa): size and genes](transforms/animals-metazoa-size-and-genes.polars.py) (polars)
- [Genomes of five groups](transforms/genomes-of-five-groups.sql) (sql)
- [Genome size, genes and gene density](transforms/genome-size-genes-and-gene-density.polars.py) (polars)
- [Scaling law per group: genes = a · size^b](transforms/scaling-law-per-group-genes-a-size-b.polars.py) (polars)
- [Prokaryotes against eukaryotes](transforms/prokaryotes-against-eukaryotes.sql) (sql)

Graphs:

- [Genes against genome size: slope 1 in prokaryotes, near 0 in eukaryotes](graphs/genes-against-genome-size-slope-1-in-prokaryotes.js)
- [Gene density falls as eukaryote genomes grow](graphs/gene-density-falls-as-eukaryote-genomes-grow.js)

Tables:

- Scaling per group
- Prokaryotes against eukaryotes

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/c-value-paradox`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
