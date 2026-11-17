# Power laws in the doctoral-advisor network

Wikidata's 408,000 doctoral supervisions (P184): students per advisor are heavy-tailed (7 advisors with 100+ students, where a same-mean geometric expects 10⁻¹⁰), advisors per student are not. Fitting a power law the right way (Clauset, Shalizi & Newman): CCDF instead of histogram, maximum-likelihood α, x_min by KS distance, Vuong's likelihood-ratio test against an exponential. Caveats: Wikidata coverage bias; lognormal not fitted.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-advisor-power-law) · [open the example](https://www.seebra.io/?example=advisor-power-law) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fadvisor-power-law) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Wikidata Query Service (SPARQL): <https://query.wikidata.org>

## Steps

Queries:

- [Advisors by number of doctoral students (P184, out-degree)](.seebra/query/4c6857f2-5b1a-5b1c-8862-4b3ce24f8e02.json)
- [Students by number of doctoral advisors (P184, in-degree)](.seebra/query/3d338cdc-367a-53e1-beb7-06dc7d93cc9d.json)
- [The 30 advisors with the most doctoral students](.seebra/query/a7e3804a-2b5f-5375-a58f-12918bed4388.json)

Transformations:

- [Students per advisor: histogram and CCDF](transforms/students-per-advisor-histogram-and-ccdf.polars.py) (polars)
- [Advisors per student: histogram and CCDF](transforms/advisors-per-student-histogram-and-ccdf.polars.py) (polars)
- [Both directions of the advisor network](transforms/both-directions-of-the-advisor-network.sql) (sql)
- [The network in numbers: mean, median, maximum, concentration](transforms/the-network-in-numbers-mean-median-maximum.polars.py) (polars)
- [Maximum-likelihood α and KS distance for every x_min from 1 to 40](transforms/maximum-likelihood-and-ks-distance-for-every-x.polars.py) (polars)
- [The tail: the x_min with the smallest KS distance](transforms/the-tail-the-x-min-with-the-smallest-ks-distance.polars.py) (polars)
- [The naive way: least-squares lines on log-log plots](transforms/the-naive-way-least-squares-lines-on-log-log.polars.py) (polars)
- [Three fits to compare: students per advisor over the whole range and over its tail, advisors per student](transforms/three-fits-to-compare-students-per-advisor-over.sql) (sql)
- [Power law against exponential: log-likelihood ratio and Vuong's test](transforms/power-law-against-exponential-log-likelihood.polars.py) (polars)
- [Observed CCDF with the fitted power laws and a geometric distribution of the same mean](transforms/observed-ccdf-with-the-fitted-power-laws-and-a.polars.py) (polars)
- [The most prolific advisors, with their share of all recorded supervisions](transforms/the-most-prolific-advisors-with-their-share-of.polars.py) (polars)
- [Lorenz curve: the share of supervisions held by the top advisors](transforms/lorenz-curve-the-share-of-supervisions-held-by.polars.py) (polars)

Graphs:

- [Heavy tail vs thin tail: CCDFs of both directions of the network](graphs/heavy-tail-vs-thin-tail-ccdfs-of-both-directions.js)
- [Why a line through the log-log histogram misleads](graphs/why-a-line-through-the-log-log-histogram.js)
- [Choosing x_min: α and the KS distance](graphs/choosing-x-min-and-the-ks-distance.js)
- [The 30 most prolific doctoral advisors](graphs/the-30-most-prolific-doctoral-advisors.js)
- [Concentration: who supervises the supervisions](graphs/concentration-who-supervises-the-supervisions.js)

Tables:

- Power law vs exponential: likelihood-ratio tests
- The network in numbers
- x_min scan

Studies:

- [Is supervision a power law?](.seebra/study/7e075b51-c111-5f4c-9a45-ce8a977879ca.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/advisor-power-law`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
