# Response spectra: which buildings an earthquake shakes

Ridgecrest M7.1 ShakeMap stations: SA(T)/PGA by distance, resonance and damping, and why distant quakes sway tall buildings.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-quake-response-spectra) · [open the example](https://www.seebra.io/?example=quake-response-spectra) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fquake-response-spectra) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Earth

## Sources

- USGS ShakeMap products: <https://earthquake.usgs.gov>

## Steps

Queries:

- [Ridgecrest M7.1 ShakeMap station list](.seebra/query/b9737cb0-d27b-5ff3-9de7-2b71b0cee0cd.json)

Transformations:

- [Amplitudes](transforms/amplitudes.polars.py) (polars)
- [Per station: larger horizontal](transforms/per-station-larger-horizontal.polars.py) (polars)
- [Spectrum as rows (T = 0, 0.3, 1, 3 s)](transforms/spectrum-as-rows-t-0-0-3-1-3-s.sql) (sql)
- [Median spectral shape per distance](transforms/median-spectral-shape-per-distance.polars.py) (polars)
- [Attenuation per period (κ, Q)](transforms/attenuation-per-period-q.polars.py) (polars)
- [Long/short ratio against distance](transforms/long-short-ratio-against-distance.polars.py) (polars)
- [Theory: damped oscillator](transforms/theory-damped-oscillator.polars.py) (polars)

Graphs:

- [Stations and their spectral ratio](graphs/stations-and-their-spectral-ratio.js)
- [The response spectrum shifts with distance](graphs/the-response-spectrum-shifts-with-distance.js)
- [Tall vs low buildings, station by station](graphs/tall-vs-low-buildings-station-by-station.js)
- [Resonance and damping (theory)](graphs/resonance-and-damping-theory.js)

Tables:

- Attenuation per period
- Spectral ratio trend

Studies:

- [Does distance shift shaking to long periods?](.seebra/study/f22f1aa9-f52c-53b0-926a-a883edd70d02.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/quake-response-spectra`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
