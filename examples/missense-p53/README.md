# Which single changes break p53? AlphaMissense, gnomAD and ClinVar

Every single amino-acid change in p53, three ways: AlphaMissense's prediction, how many of gnomAD's 807,000 people carry it, and ClinVar's verdict, with AlphaFold's fold in 3D. Harm sits in the folded core (74% likely pathogenic, 229 of 231 ClinVar pathogenic changes); the disordered ends tolerate almost anything. AlphaMissense separates reviewed pathogenic from benign with AUC 0.99. Caveat: clonal blood mutations in gnomAD. Set gene and uniprot for another protein.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-missense-p53) · [open the example](https://www.seebra.io/?example=missense-p53) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmissense-p53) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- AlphaFold Protein Structure Database (EMBL-EBI, Google DeepMind): <https://alphafold.ebi.ac.uk>
- gnomAD GraphQL API (Broad Institute): <https://gnomad.broadinstitute.org>

## Steps

Queries:

- [The AlphaFold entry for {{uniprot}}: sequence, mean confidence, file links](.seebra/query/19e51b44-d2ce-53c3-904b-564d97488b99.json)
- [AlphaMissense: all 19 substitutions at every residue of {{uniprot}} (CSV)](.seebra/query/22c1d61c-46da-5ecf-948c-c1d63e989091.json)
- [AlphaMissense on GRCh38: the substitutions one DNA letter makes, with their genomic variant (CSV)](.seebra/query/70f10d86-1aef-5d72-8cdc-a9ce16b2590d.json)
- [AlphaFold's confidence per residue (pLDDT), model v6](.seebra/query/83e65735-09f9-5109-973b-d7bf00ef9309.json)
- [The AlphaFold model (PDB format), v6](.seebra/query/63c5e984-fef9-531a-bae7-47bb8fcbe704.json)
- [{{gene}} in gnomAD v4: every variant with allele counts, and ClinVar's classifications](queries/gene-in-gnomad-v4-every-variant-with-allele.json)

Transformations:

- [Every change: predicted (AlphaMissense), carried (gnomAD), diagnosed (ClinVar)](transforms/every-change-predicted-alphamissense-carried.js) (javascript)
- [The model's backbone with each residue's scores](transforms/the-model-s-backbone-with-each-residue-s-scores.js) (javascript)
- [One row per change one DNA letter can make](transforms/one-row-per-change-one-dna-letter-can-make.js) (javascript)
- [One row per residue](transforms/one-row-per-residue.js) (javascript)

Graphs:

- [Every single change: predicted, carried, diagnosed](graphs/every-single-change-predicted-carried-diagnosed.js)
- [Does evolution agree? Prediction by how common a change is](graphs/does-evolution-agree-prediction-by-how-common-a.js)
- [Would it have told the clinic? ClinVar against AlphaMissense](graphs/would-it-have-told-the-clinic-clinvar-against.js)
- [Fold or no fold: AlphaFold's confidence against harm](graphs/fold-or-no-fold-alphafold-s-confidence-against.js)
- [The AlphaFold model in 3D, by predicted harm](graphs/the-alphafold-model-in-3d-by-predicted-harm.js)

Tables:

- Changes
- Residues

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/missense-p53`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
