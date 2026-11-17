# Sidebands in the power demand: the modulation theorem

The Fourier spectrum of 8 weeks of German load: daily harmonics flanked by weekly sidebands at k ± j/7, windows, leakage and resolution.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-load-spectrum-sidebands) · [open the example](https://www.seebra.io/?example=load-spectrum-sidebands) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fload-spectrum-sidebands) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Energy-Charts (Fraunhofer ISE): <https://api.energy-charts.info>

## Steps

Queries:

- [Germany: public net generation and load, 15 min, 24 Aug – 18 Oct 2026](.seebra/query/36e86d3f-0b60-5b1b-8db5-c5ba418d2a4c.json)

Transformations:

- [Hourly load, centred and detrended](transforms/hourly-load-centred-and-detrended.polars.py) (polars)
- [Three windows](transforms/three-windows.sql) (sql)
- [Frequency grid (1/112 per day)](transforms/frequency-grid-1-112-per-day.polars.py) (polars)
- [Amplitude spectra (DFT)](transforms/amplitude-spectra-dft.sql) (sql)
- [Theory: k ± j/7 per day](transforms/theory-k-j-7-per-day.polars.py) (polars)
- [Strongest lines, matched to theory](transforms/strongest-lines-matched-to-theory.polars.py) (polars)
- [Leakage: power between the lines](transforms/leakage-power-between-the-lines.polars.py) (polars)
- [Resolution: is the sideband separate?](transforms/resolution-is-the-sideband-separate.polars.py) (polars)
- [Daily envelope](transforms/daily-envelope.polars.py) (polars)
- [Weekday, Saturday, Sunday](transforms/weekday-saturday-sunday.polars.py) (polars)

Graphs:

- [The signal: 8 weeks of load](graphs/the-signal-8-weeks-of-load.js)
- [Spectrum: harmonics and sidebands](graphs/spectrum-harmonics-and-sidebands.js)
- [Zoom on 1 per day: the sidebands](graphs/zoom-on-1-per-day-the-sidebands.js)
- [The weekly envelope](graphs/the-weekly-envelope.js)

Tables:

- Peaks and the lines they match
- Leakage per window
- Record length and resolution
- The weekly pattern

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/load-spectrum-sidebands`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
