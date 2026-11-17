# Caffeine in its receptor

Caffeine bound in its real target, the human adenosine A2A receptor (RCSB 5MZP, 2.1 Å), in 3D, against adenosine, the agonist it blocks (2YDO). Contacts are computed from the coordinates: per residue within 5 Å, an H-bond candidate (N/O under 3.5 Å), π-stacking (ring centroids within 5.5 Å) or hydrophobic (C–C under 4 Å), with GPCRdb helix positions and UniProt binding sites. Idea: a molecule blocks a receptor by fitting its pocket without activating it: caffeine keeps adenosine's purine contacts (stacking on Phe168, an H-bond to Asn253) but, with no ribose, none of the ribose contacts (Ser277, His278) agonists use. Caveats: static snapshots of thermostabilised, mutated receptors (5MZP has Ala at 88 and 277); distance cutoffs, not energies or affinity; A1 is a caffeine target too.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-caffeine-a2a) · [open the example](https://www.seebra.io/?example=caffeine-a2a) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fcaffeine-a2a) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- RCSB PDB files: <https://files.rcsb.org>
- GPCRdb: <https://gpcrdb.org/services>
- UniProt REST: <https://rest.uniprot.org>
- PubChem PUG REST: <https://pubchem.ncbi.nlm.nih.gov/rest/pug>

## Steps

Queries:

- [A2A with caffeine, 5MZP (PDB)](.seebra/query/f48e173c-1607-57b2-82b9-fb64ad3a2981.json)
- [A2A with adenosine, 2YDO (PDB)](.seebra/query/fd916d84-133b-5290-bfb2-aca31d23fc5d.json)
- [A2A residues: segments and generic numbers](.seebra/query/612333ea-84fb-5e11-884c-8e56cc3bcc1f.json)
- [P29274 features (binding sites, helices)](.seebra/query/79c7a6c6-b0f9-5742-b37f-bb4063d9c3a1.json)
- [Caffeine and adenosine properties](.seebra/query/954fc57b-8b37-5815-8ca1-63dec782b398.json)

Transformations:

- [Atoms of both entries (PDB text)](transforms/atoms-of-both-entries-pdb-text.js) (javascript)
- [Ligand atoms (caffeine in two orientations, adenosine)](transforms/ligand-atoms-caffeine-in-two-orientations.polars.py) (polars)
- [Receptor atoms with segment and generic number](transforms/receptor-atoms-with-segment-and-generic-number.polars.py) (polars)
- [Receptor atoms within 5 Å of a ligand](transforms/receptor-atoms-within-5-a-of-a-ligand.polars.py) (polars)
- [Contacts per residue](transforms/contacts-per-residue.polars.py) (polars)
- [π-stacking: ring centroids within 5.5 Å](transforms/stacking-ring-centroids-within-5-5-a.polars.py) (polars)
- [H-bond candidates (N/O pairs under 3.5 Å)](transforms/h-bond-candidates-n-o-pairs-under-3-5-a.polars.py) (polars)
- [Contact fingerprint](transforms/contact-fingerprint.polars.py) (polars)
- [Caffeine against adenosine, per residue](transforms/caffeine-against-adenosine-per-residue.polars.py) (polars)
- [Numbering check: where the entries differ from the wild type](transforms/numbering-check-where-the-entries-differ-from.polars.py) (polars)
- [Pocket Cα pairs for the fit of 2YDO onto 5MZP](transforms/pocket-c-pairs-for-the-fit-of-2ydo-onto-5mzp.polars.py) (polars)
- [Caffeine and adenosine (PubChem)](transforms/caffeine-and-adenosine-pubchem.polars.py) (polars)

Graphs:

- [Caffeine in the A2A pocket (3D)](graphs/caffeine-in-the-a2a-pocket-3d.js)
- [Contact fingerprint: caffeine fits where adenosine binds, without the ribose contacts](graphs/contact-fingerprint-caffeine-fits-where.js)

Tables:

- Caffeine against adenosine
- Mutations (numbering check)
- Properties (PubChem)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/caffeine-a2a`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
