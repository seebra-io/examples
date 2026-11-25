# Reproduce Figure 1: near-stasis in Mesozoic tetrapods

Question: does a published diversity curve still stand when it is rebuilt from today's data? Benson et al. 2016 (PLOS Biology, doi:10.1371/journal.pbio.1002359) counted the non-marine tetrapods of the Mesozoic in the Paleobiology Database and found near-stasis: no long-term trend in genus or species counts unless the first Triassic bin is left out (their Figure 1), and a net diversification rate near zero after subsampling (Figure 5). This board rebuilds Figure 1B–C live from the PBDB, next to a link to the original figure, with the paper's Poisson trend lines, shareholder quorum subsampling (quorum 0.4), the paper's numbers beside today's and a study of the claim. Click a bin for the PBDB records behind it. Caveats: PBDB's 10-Myr bins and terrestrial filter approximate the paper's bins and taxon list; the PBDB has grown since 2015; this SQS is global and at genus level, the paper's regional and at species level. Cite the board, the paper and the PBDB from the Cite panel; Copy as Python reruns the pipeline.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-reproduce-benson-2016-fig1) · [open the example](https://www.seebra.io/?example=reproduce-benson-2016-fig1) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Freproduce-benson-2016-fig1) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Paleobiology Database (PBDB) data service 1.2: <https://paleobiodb.org/data1.2>
- Crossref: <https://api.crossref.org>
- DataCite: <https://api.datacite.org>

## Steps

Queries:

- [Genera per 10-Myr bin, non-marine tetrapods (PBDB diversity)](.seebra/query/547b0571-cf97-5c29-a9e9-9369bad7c2ef.json)
- [Species per 10-Myr bin, non-marine tetrapods (PBDB diversity)](.seebra/query/e44c050d-c894-55d8-a4da-869f5970f433.json)
- [Every non-marine tetrapod occurrence at genus level (for subsampling)](.seebra/query/ad393ba8-4ac7-5891-8349-d562b53d36f6.json)
- [The paper (Crossref)](.seebra/query/56daf381-98d7-5219-83eb-af1b8f75dead.json)
- [The paper's archived data at Dryad (DataCite)](.seebra/query/0ffc1f65-e27b-5458-ac1b-6688d354c0cb.json)

Transformations:

- [Bins: genera, species and occurrences](transforms/bins-genera-species-and-occurrences.js) (javascript)
- [Trend lines: Poisson GLMs of count on age (the paper's dashed lines)](transforms/trend-lines-poisson-glms-of-count-on-age-the.js) (javascript)
- [Subsampled genera per bin (SQS, quorum 0.4)](transforms/subsampled-genera-per-bin-sqs-quorum-0-4.js) (javascript)
- [The claim's data: ln(genera) against time, Mesozoic bins](transforms/the-claim-s-data-ln-genera-against-time-mesozoic.sql) (sql)
- [The paper's numbers and today's](transforms/the-paper-s-numbers-and-today-s.js) (javascript)
- [The paper and its data: citation details](transforms/the-paper-and-its-data-citation-details.js) (javascript)

Graphs:

- [Figure 1B–C, live: genera and species per bin, and after subsampling (click a bin)](graphs/figure-1b-c-live-genera-and-species-per-bin-and.js)
- [The paper, its original figure and its data](graphs/the-paper-its-original-figure-and-its-data.js)

Tables:

- The paper's numbers next to today's PBDB
- Per bin: occurrences, coverage, subsampled genera and the records behind each

Studies:

- [Does today's PBDB still show near-stasis?](.seebra/study/ddea9d89-af2b-558d-819f-84e43af83eda.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/reproduce-benson-2016-fig1`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
