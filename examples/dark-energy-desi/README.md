# Is dark energy weakening? DESI, supernovae and the Hubble tension

Is dark energy weakening? DESI DR2's 2025 BAO distances, Pantheon+'s 1,701 supernovae and Planck's acoustic angle, fitted live on a grid of ΛCDM and evolving dark energy (w0, wa). Each ruler alone fits ΛCDM; together they disfavour it by 2.7σ (best w0 ≈ −0.87, wa ≈ −0.3), close to DESI's 2.8σ. The Hubble tension is separate: the distance ladder gives 73.2, the sound-wave ruler 68.8, Planck 67.4. Caveats: diagonal supernova errors, θ* alone for the CMB.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-dark-energy-desi) · [open the example](https://www.seebra.io/?example=dark-energy-desi) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fdark-energy-desi) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- Pantheon+ data release (GitHub): <https://raw.githubusercontent.com/PantheonPlusSH0ES/DataRelease/main>
- BAO likelihood data (Cobaya, GitHub): <https://raw.githubusercontent.com/CobayaSampler/bao_data/master>

## Steps

Queries:

- [Pantheon+SH0ES: 1,701 type Ia supernova light curves' distances (text table)](.seebra/query/94ae4e38-b6fc-5af5-90b2-701c7db6b9c8.json)
- [DESI DR2 BAO: distances over the sound horizon at seven redshifts](.seebra/query/b555b539-46fa-56f9-b77f-10df9c46f64d.json)
- [DESI DR2 BAO: their covariance (13 × 13)](.seebra/query/f38405dc-5003-5692-a4de-a6c5b9d2ac93.json)

Transformations:

- [ΛCDM against evolving dark energy: grid fit of BAO, supernovae and the CMB](transforms/cdm-against-evolving-dark-energy-grid-fit-of-bao.js) (javascript)
- [The verdict per combination of rulers](transforms/the-verdict-per-combination-of-rulers.js) (javascript)
- [DESI's distances against ΛCDM](transforms/desi-s-distances-against-cdm.js) (javascript)
- [H0 three ways](transforms/h0-three-ways.js) (javascript)

Graphs:

- [Is dark energy constant? The rulers in the w0–wa plane](graphs/is-dark-energy-constant-the-rulers-in-the-w0-wa.js)
- [DESI's sound-wave ruler against ΛCDM](graphs/desi-s-sound-wave-ruler-against-cdm.js)
- [The supernova ruler against ΛCDM](graphs/the-supernova-ruler-against-cdm.js)
- [The Hubble tension: H0 three ways](graphs/the-hubble-tension-h0-three-ways.js)

Tables:

- Verdict
- DESI distances
- H0

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/dark-energy-desi`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
