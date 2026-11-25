# Ten years of gravitational waves: what 391 black-hole and neutron-star mergers teach

Every confident gravitational-wave merger GWOSC lists (391, GWTC-1 to GWTC-5.0): the two masses with both theoretical gaps, the black-hole mass spectrum (peaks near 10 and 35 solar masses; 32 mergers inside the pair-instability gap, up to GW231123), the energy radiated (median 4.5% of the mass), effective spins, detections run by run, and any merger's chirp drawn and played as sound. Caveats: detected, not true, populations; 109 recent candidates lack parameters.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-gravitational-waves) · [open the example](https://www.seebra.io/?example=gravitational-waves) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fgravitational-waves) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- Gravitational Wave Open Science Center (GWOSC): <https://gwosc.org>

## Steps

Queries:

- [Every confident merger in the cumulative GWTC catalogue (latest version of each)](.seebra/query/8c47caec-7b19-56ee-a9ed-9c43782426f5.json)

Transformations:

- [Mergers: masses, kind, energy radiated, gaps, runs](transforms/mergers-masses-kind-energy-radiated-gaps-runs.js) (javascript)
- [One row per merger](transforms/one-row-per-merger.js) (javascript)
- [Per observing run](transforms/per-observing-run.js) (javascript)

Graphs:

- [Every merger's two masses, and the two gaps](graphs/every-merger-s-two-masses-and-the-two-gaps.js)
- [The black-hole mass spectrum: two peaks and a tenanted gap](graphs/the-black-hole-mass-spectrum-two-peaks-and-a.js)
- [E = mc²: the mass radiated as gravitational waves](graphs/e-mc2-the-mass-radiated-as-gravitational-waves.js)
- [How they spin: born together or met in a cluster?](graphs/how-they-spin-born-together-or-met-in-a-cluster.js)
- [Ten years of detections, run by run, and how far](graphs/ten-years-of-detections-run-by-run-and-how-far.js)
- [The chosen merger's chirp: see it and hear it](graphs/the-chosen-merger-s-chirp-see-it-and-hear-it.js)

Tables:

- Mergers
- Observing runs

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/gravitational-waves`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
