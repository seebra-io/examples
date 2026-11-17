# Gompertz's law: the risk of dying doubles about every seven years

Eurostat life tables for eight countries, 2003 and 2023: from 35 to 84 the log death rate is a straight line, and the risk doubles every 6.6–10 years everywhere. Countries and decades differ in the level, not the rate of ageing (Strehler–Mildvan, r = −0.93). Off the line: the accident hump and the oldest ages.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-gompertz-mortality) · [open the example](https://www.seebra.io/?example=gompertz-mortality) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fgompertz-mortality) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Health

## Sources

- Eurostat SDMX 2.1 API: <https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1>

## Steps

Queries:

- [Life tables 2003: death rate by age and sex (demo_mlifetable)](.seebra/query/ea98e357-c8f9-5ff3-8a21-7923c13c731a.json)
- [Life tables 2023: death rate by age and sex (demo_mlifetable)](.seebra/query/a3a6a38c-73b3-5ba0-aac8-20a36a8f361f.json)

Transformations:

- [Death rates, 2003 and 2023](transforms/death-rates-2003-and-2023.sql) (sql)
- [Death rate by age](transforms/death-rate-by-age.polars.py) (polars)
- [Gompertz fit per country, sex and year (ages 35–84)](transforms/gompertz-fit-per-country-sex-and-year-ages-35-84.polars.py) (polars)
- [Observed against the Gompertz line](transforms/observed-against-the-gompertz-line.polars.py) (polars)
- [Rate of ageing against level, per sex and year](transforms/rate-of-ageing-against-level-per-sex-and-year.sql) (sql)

Graphs:

- [Death rate by age, log scale: Gompertz's straight line](graphs/death-rate-by-age-log-scale-gompertz-s-straight.js)
- [Level against doubling time, 2003 → 2023](graphs/level-against-doubling-time-2003-2023.js)

Tables:

- Gompertz fits
- Per sex and year

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/gompertz-mortality`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
