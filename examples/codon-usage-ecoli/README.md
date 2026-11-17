# Codon usage bias: synonymous is not neutral

99 E. coli genes (Ensembl CDS, UniProt proteins): the genetic code read off the data, RSCU and Wright's Nc. Ribosomal proteins (median Nc 36.7) fall far below the mutation-only curve, regulators (51.3) stay near it: highly expressed genes use a preferred dialect of codons. Caveats: gene sets stand in for expression; short genes give noisy Nc.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-codon-usage-ecoli) · [open the example](https://www.seebra.io/?example=codon-usage-ecoli) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fcodon-usage-ecoli) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- UniProt REST: <https://rest.uniprot.org>
- Ensembl REST: <https://rest.ensembl.org>

## Steps

Queries:

- [E. coli K-12 ribosomal proteins (UniProt, keyword KW-0689)](.seebra/query/43bf989a-dc3d-581d-900e-70026463c287.json)
- [E. coli K-12 DNA-binding transcription regulators (KW-0805 and KW-0238)](.seebra/query/066e7fa5-3759-59ca-a1ad-c977fa46dbf1.json)
- [Coding sequences, batch 1 (28 ribosomal, 22 regulators)](queries/coding-sequences-batch-1-28-ribosomal-22.json)
- [Coding sequences, batch 2 (28 ribosomal, 22 regulators)](queries/coding-sequences-batch-2-28-ribosomal-22.json)

Transformations:

- [Ribosomal proteins](transforms/ribosomal-proteins.polars.py) (polars)
- [Transcription regulators](transforms/transcription-regulators.polars.py) (polars)
- [Genes: coding sequence and protein](transforms/genes-coding-sequence-and-protein.sql) (sql)
- [Codons beside their amino acids](transforms/codons-beside-their-amino-acids.polars.py) (polars)
- [The genetic code, read from the data](transforms/the-genetic-code-read-from-the-data.polars.py) (polars)
- [Codon usage (RSCU) per gene set](transforms/codon-usage-rscu-per-gene-set.polars.py) (polars)
- [Effective number of codons (Nc) per gene](transforms/effective-number-of-codons-nc-per-gene.polars.py) (polars)
- [Codon bias per gene set](transforms/codon-bias-per-gene-set.sql) (sql)

Graphs:

- [The genetic code from the data, coloured by codon preference](graphs/the-genetic-code-from-the-data-coloured-by-codon.js)
- [Nc against GC3s: ribosomal proteins fall below the mutation-only curve](graphs/nc-against-gc3s-ribosomal-proteins-fall-below.js)
- [Synonymous codons: ribosomal proteins against regulators](graphs/synonymous-codons-ribosomal-proteins-against.js)

Tables:

- Codon bias per gene set
- The genetic code (64 codons)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/codon-usage-ecoli`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
