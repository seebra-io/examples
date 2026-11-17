# Hardy–Weinberg, and why pooled populations break it

Genotypes of five famous variants (LCT, SLC24A5, ALDH2, ACTN3, HbS) in 26 populations of 1000 Genomes (Ensembl, IGSR). Each population sits on the p², 2pq, q² parabola; pooled, heterozygotes vanish by exactly F_ST (SLC24A5: F 0.67 against 0.65), the Wahlund effect. HbS in Africa has too many heterozygotes: selection. With a study plan.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-hardy-weinberg-wahlund) · [open the example](https://www.seebra.io/?example=hardy-weinberg-wahlund) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fhardy-weinberg-wahlund) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Ensembl REST: <https://rest.ensembl.org>
- IGSR (1000 Genomes data portal): <https://www.internationalgenome.org/api/beta>

## Steps

Queries:

- [rs4988235 LCT/MCM6 genotypes per population](.seebra/query/a79d8b12-36ae-569d-b528-27ffb1d28ee1.json)
- [rs1426654 SLC24A5 genotypes per population](.seebra/query/97f99d3c-65a9-5fab-b91d-0a002d7967e6.json)
- [rs671 ALDH2 genotypes per population](.seebra/query/30b2fd4b-0f8c-5a2f-bd29-42bd64a6eddb.json)
- [rs1815739 ACTN3 genotypes per population](.seebra/query/efc53e57-10af-5294-b387-83a653547628.json)
- [rs334 HBB genotypes per population](.seebra/query/62bb3774-51ec-5b14-b15a-32d65a240170.json)
- [Populations: names, sampling sites, super-populations](queries/populations-names-sampling-sites-super.json)

Transformations:

- [rs4988235 (LCT/MCM6) genotype counts](transforms/rs4988235-lct-mcm6-genotype-counts.polars.py) (polars)
- [rs1426654 (SLC24A5) genotype counts](transforms/rs1426654-slc24a5-genotype-counts.polars.py) (polars)
- [rs671 (ALDH2) genotype counts](transforms/rs671-aldh2-genotype-counts.polars.py) (polars)
- [rs1815739 (ACTN3) genotype counts](transforms/rs1815739-actn3-genotype-counts.polars.py) (polars)
- [rs334 (HBB) genotype counts](transforms/rs334-hbb-genotype-counts.polars.py) (polars)
- [Genotype counts, five variants](transforms/genotype-counts-five-variants.sql) (sql)
- [1000 Genomes populations (IGSR)](transforms/1000-genomes-populations-igsr.polars.py) (polars)
- [Hardy–Weinberg test per variant and sample](transforms/hardy-weinberg-test-per-variant-and-sample.polars.py) (polars)
- [Wahlund: pooled F against F_ST](transforms/wahlund-pooled-f-against-f-st.polars.py) (polars)
- [Per variant: populations off equilibrium, pooled F](transforms/per-variant-populations-off-equilibrium-pooled-f.sql) (sql)

Graphs:

- [Heterozygotes against allele frequency: populations on the parabola, pooled samples below](graphs/heterozygotes-against-allele-frequency.js)
- [Pooled F against F_ST: the Wahlund effect](graphs/pooled-f-against-f-st-the-wahlund-effect.js)
- [Allele frequencies at the sampling sites](graphs/allele-frequencies-at-the-sampling-sites.js)

Tables:

- Per variant
- Hardy–Weinberg tests

Studies:

- [Study: is pooling the reason for the heterozygote deficit?](.seebra/study/d1fb4dd4-12cf-5726-8d9b-ad82fe352a65.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/hardy-weinberg-wahlund`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
