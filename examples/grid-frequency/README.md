# Grid frequency: the power balance meter

One day of the European grid's frequency, every second (Energy-Charts, Freiburg). Control idea: frequency is the grid's balance meter, held by primary control acting as a proportional controller. Folded at the quarter-hour, a sawtooth appears: power is scheduled in 15-minute blocks, and a paired test over the 96 quarter-hours shows the jump when each one turns. Caveats: one day, one point; FCR power implied from the droop; inertia not in the data.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-grid-frequency) · [open the example](https://www.seebra.io/?example=grid-frequency) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fgrid-frequency) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- Energy-Charts (Fraunhofer ISE): <https://api.energy-charts.info>

## Steps

Queries:

- [Grid frequency, 1 s, Freiburg, 10 Nov 2026](.seebra/query/4c1afc4e-82f9-5adc-8315-31bee406031c.json)

Transformations:

- [Seconds: Δf, df/dt and implied primary control](transforms/seconds-f-df-dt-and-implied-primary-control.polars.py) (polars)
- [Per minute: mean, range, fastest change](transforms/per-minute-mean-range-fastest-change.polars.py) (polars)
- [The day folded at the quarter-hour](transforms/the-day-folded-at-the-quarter-hour.polars.py) (polars)
- [Distribution of Δf (5 mHz bins)](transforms/distribution-of-f-5-mhz-bins.polars.py) (polars)
- [The day in numbers](transforms/the-day-in-numbers.polars.py) (polars)
- [Per quarter-hour and window](transforms/per-quarter-hour-and-window.sql) (sql)
- [First 2 minutes against the rest, per quarter-hour](transforms/first-2-minutes-against-the-rest-per-quarter.polars.py) (polars)
- [Paired t-test over the 96 quarter-hours](transforms/paired-t-test-over-the-96-quarter-hours.polars.py) (polars)

Graphs:

- [The day: frequency minus 50 Hz, minute by minute](graphs/the-day-frequency-minus-50-hz-minute-by-minute.js)
- [Folded at the quarter-hour: the schedule sawtooth](graphs/folded-at-the-quarter-hour-the-schedule-sawtooth.js)
- [How far from 50 Hz, second by second](graphs/how-far-from-50-hz-second-by-second.js)
- [Each quarter-hour: first 2 minutes against the rest](graphs/each-quarter-hour-first-2-minutes-against-the.js)

Tables:

- The day in numbers
- Paired test: first 2 minutes against the rest

Studies:

- [Does the frequency jump when the quarter-hour turns?](.seebra/study/2b757cac-4452-5a50-ba53-d90a6fb00528.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/grid-frequency`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
