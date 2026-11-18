# Our neighbourhood in the Milky Way, in 3D

Question: where are we in the Galaxy, and what is measured rather than drawn? The Milky Way in 3D with a glowing bar and bulge, gas haze, dust lanes and the spiral arms Reid et al. (2019) fitted to ~200 maser parallaxes (Perseus, Scutum–Centaurus, Sagittarius–Carina, Norma, Outer, the Local arm): solid where masers were measured, dashed where the fit is carried on. The Sun sits 8.18 kpc from Sgr A* (GRAVITY 2019); the Orion Nebula, Pleiades, Hyades, Carina, Eagle, Crab, Omega Centauri and Cygnus X-1 at their measured distances. Two scales down: every star within 100 light years in true 3D (HYG, by spectral type, planet hosts live from the NASA Exoplanet Archive), Gaia DR3's live census of the same sphere as an HR diagram, and the solar system to Alpha Centauri on a log scale (Kuiper belt, heliopause, both Voyagers now, Oort cloud, Hale-Bopp, NEOWISE, Sedna). Hover anything for its number and source; fly to the Sun, Sgr A* or the Orion Nebula. Caveat: we see the Galaxy from inside, so its structure is inferred and the far side is barely mapped; the bar, gas and dust are an artist's model of published scales; the Oort cloud is hypothesised, never observed; HYG misses faint red dwarfs. Next: the local universe in 3D, the solar system to scale, Stefan–Boltzmann on the HR diagram.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-milky-way-3d) · [open the example](https://www.seebra.io/?example=milky-way-3d) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmilky-way-3d) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- ESA Gaia archive TAP: <https://gea.esac.esa.int/tap-server/tap>
- NASA Exoplanet Archive TAP: <https://exoplanetarchive.ipac.caltech.edu/TAP>

## Steps

Queries:

- [Gaia DR3: every well-measured source within 100 light years (CSV)](.seebra/query/a7775af4-08e5-5ea1-9d6e-122666073825.json)
- [Stars with known planets within 100 light years (pscomppars)](.seebra/query/0fc29766-1a74-5ee0-bcb3-f0dc4570102a.json)

Transformations:

- [Stars within 100 ly, one row each](transforms/stars-within-100-ly-one-row-each.js) (javascript)
- [HYG against Gaia: stars per class within 100 ly](transforms/hyg-against-gaia-stars-per-class-within-100-ly.js) (javascript)
- [Objects in the galaxy view, with distance and source](transforms/objects-in-the-galaxy-view-with-distance-and.js) (javascript)
- [The arms' log-spiral parameters (Reid et al. 2019, Table 2)](transforms/the-arms-log-spiral-parameters-reid-et-al-2019.js) (javascript)

Graphs:

- [The Milky Way: arms where the masers are, the bar, gas and dust, the Sun (hover; fly to)](graphs/the-milky-way-arms-where-the-masers-are-the-bar.js)
- [The Sun's neighbourhood: every star within 100 light years, by spectral type (hover; click for SIMBAD)](graphs/the-sun-s-neighbourhood-every-star-within-100.js)
- [Gaia DR3's census of the same 100 light years, live: a colour-magnitude diagram (hover; click for SIMBAD)](graphs/gaia-dr3-s-census-of-the-same-100-light-years.js)
- [From the Sun to the nearest stars, log scale: Kuiper belt, heliopause, Voyagers, Oort cloud, comets](graphs/from-the-sun-to-the-nearest-stars-log-scale.js)

Tables:

- Objects in the galaxy view: distances and their sources
- Spiral arms: Reid et al. 2019's log-spiral fits
- Two censuses of 100 ly: HYG's types against Gaia's colours
- Every HYG star within 100 light years

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/milky-way-3d/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/milky-way.json](data/milky-way.json) (14 KB), the data node *The Milky Way: Reid 2019 arms, bar and disc scales, objects, the outer solar system (sourced)*: Curated by Seebra from the sources each row cites: Reid et al. 2019 spiral-arm fits, GRAVITY 2019/2021 for the Sun's distance, published distances of the named objects, Voyager positions and heliosphere crossings, NASA's Oort-cloud ranges, and JPL SBDB comet elements. Checked 2026-11-18.
- [data/nearby-stars-100ly.json](data/nearby-stars-100ly.json) (316 KB), the data node *Stars within 100 light years (HYG v4.4, Galactic x, y, z)*: Every star within 100 light years from the HYG database v4.4 (CC BY-SA 4.0), with Galactic x, y, z. HYG misses many faint red dwarfs. Checked 2026-11-18.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/milky-way-3d`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
