# Genes in their domains: a chromosome's TADs, functions and organs

Chromosome 7's protein-coding genes (Human Protein Atlas) in the 3D domains Hi-C finds (ENCODE, GM12878): a zoomable track of nested domains and genes, the function hierarchy (system › process › gene), organ-specific genes by system, and a test: genes that share a domain share a system (purity 0.68 against 0.44 shuffled, 0.57 within 5 Mb). Also the protein complexes they build (Complex Portal), each opening in 3D from its PDB structure. The chrom parameter picks the chromosome.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-gene-domains) · [open the example](https://www.seebra.io/?example=gene-domains) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fgene-domains) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- Human Protein Atlas: <https://www.proteinatlas.org/api>
- ENCODE portal (files): <https://www.encodeproject.org/files>
- Complex Portal (EBI), complex tables: <https://ftp.ebi.ac.uk/pub/databases/intact/complex/current/complextab>
- RCSB PDB (structure files): <https://files.rcsb.org/download>
- PDBe API: <https://www.ebi.ac.uk/pdbe/api>

## Steps

Queries:

- [Protein-coding genes on the chromosome (HPA: position, keywords, RNA in 19 tissues)](.seebra/query/c508b211-39a8-545d-b92a-a3edeb98a488.json)
- [Contact domains (TADs), GM12878 in situ Hi-C: ENCODE ENCFF203AKP, all chromosomes (gzipped BEDPE)](.seebra/query/3602d48c-9019-518c-a2f2-f5968b227239.json)
- [Every human gene: name, UniProt ids, chromosome (HPA), to name the subunits encoded elsewhere](.seebra/query/802a5711-733b-5f7d-9ca7-76211dd1d3c4.json)
- [Every curated human protein complex (Complex Portal, ComplexTAB)](.seebra/query/bf5af5ef-72b7-50e3-820c-fbefaf2551db.json)
- [The selected structure, {{pdb}} (PDB format)](.seebra/query/f387bde6-770c-54b9-b370-c7a31a086165.json)
- [Which protein each chain of {{pdb}} is (PDBe SIFTS mapping to UniProt)](.seebra/query/db6531ff-8174-5364-b2fb-aa88c82d225e.json)

Transformations:

- [Genes: position, system › process, organs](transforms/genes-position-system-process-organs.js) (javascript)
- [Domains nested, and each gene in its domain](transforms/domains-nested-and-each-gene-in-its-domain.js) (javascript)
- [Do domains hold one function? Purity against 1,000 shuffles](transforms/do-domains-hold-one-function-purity-against-1.js) (javascript)
- [The chromosome's genes in curated complexes: function, family, subunits, structures](transforms/the-chromosome-s-genes-in-curated-complexes.js) (javascript)
- [The selected structure: each chain's backbone, protein, gene and chromosome](transforms/the-selected-structure-each-chain-s-backbone.js) (javascript)
- [One row per complex](transforms/one-row-per-complex.js) (javascript)
- [One row per gene](transforms/one-row-per-gene.js) (javascript)
- [One row per domain](transforms/one-row-per-domain.js) (javascript)
- [Domains by purity](transforms/domains-by-purity.js) (javascript)

Graphs:

- [The chromosome: domains (TADs) and genes, zoomable](graphs/the-chromosome-domains-tads-and-genes-zoomable.js)
- [What the genes do: system › process › gene](graphs/what-the-genes-do-system-process-gene.js)
- [Where they are active: organ-specific genes by system](graphs/where-they-are-active-organ-specific-genes-by.js)
- [Do genes in one domain share a function?](graphs/do-genes-in-one-domain-share-a-function.js)
- [The complexes they build: genes, complex families and what they do](graphs/the-complexes-they-build-genes-complex-families.js)
- [The selected complex in 3D: chains by protein, this chromosome's bright](graphs/the-selected-complex-in-3d-chains-by-protein.js)

Tables:

- Complexes
- Domains by purity
- Genes
- Domains

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/gene-domains`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
