# Aliasing: a fake two-week tide

Four months of hourly water levels at San Francisco (NOAA), read every 1, 6, 11, 24 and 25 hours, with a Fourier transform of each in SQL. Signals idea: Nyquist–Shannon and aliasing: read once a day, the 12.42-hour tide becomes a fake 14.7-day wave as large as the real one, exactly where alias theory puts it; daily means (a low-pass filter) remove it. Caveat: the alias period happens to be close to the real spring–neap cycle.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-tide-aliasing) · [open the example](https://www.seebra.io/?example=tide-aliasing) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Ftide-aliasing) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Science

## Sources

- NOAA CO-OPS Tides & Currents: <https://api.tidesandcurrents.noaa.gov/api/prod>

## Steps

Queries:

- [San Francisco hourly heights, Jul–Oct 2025](.seebra/query/403cbb12-01a5-5176-9bd0-73f4dbc10168.json)

Transformations:

- [Hourly water levels](transforms/hourly-water-levels.polars.py) (polars)
- [Sampling schemes (every 1, 6, 11, 24, 25 h)](transforms/sampling-schemes-every-1-6-11-24-25-h.polars.py) (polars)
- [The gauge read at each rate](transforms/the-gauge-read-at-each-rate.polars.py) (polars)
- [Daily means (filtered, then sampled)](transforms/daily-means-filtered-then-sampled.polars.py) (polars)
- [All sampled series](transforms/all-sampled-series.sql) (sql)
- [Frequency grid (cycles per day)](transforms/frequency-grid-cycles-per-day.polars.py) (polars)
- [Amplitude spectrum per scheme (DFT)](transforms/amplitude-spectrum-per-scheme-dft.sql) (sql)
- [Tidal constituents and their aliases](transforms/tidal-constituents-and-their-aliases.polars.py) (polars)
- [Strongest line per scheme against theory](transforms/strongest-line-per-scheme-against-theory.polars.py) (polars)
- [The folding rule per sampling rate](transforms/the-folding-rule-per-sampling-rate.polars.py) (polars)

Graphs:

- [The tide, and what a once-a-day reading makes of it](graphs/the-tide-and-what-a-once-a-day-reading-makes-of.js)
- [Spectra per sampling rate, with alias theory](graphs/spectra-per-sampling-rate-with-alias-theory.js)
- [The folding rule: true against apparent frequency](graphs/the-folding-rule-true-against-apparent-frequency.js)

Tables:

- Strongest line per scheme, against the M2 alias
- Constituents and their aliases

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/tide-aliasing`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
