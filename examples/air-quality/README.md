# Air quality in eight cities

Open-Meteo's CAMS air-quality model for eight cities: hourly fine particles (PM2.5) for the past three days and the next two, against the WHO 24-hour guideline (15 µg/m³), and daily means of PM2.5, PM10, NO₂ and ozone. Statistics: the guideline is a 99th percentile (no more than 3–4 days a year above it), so the second graph shows each city's distribution of hours as quantiles and counts the days whose mean exceeds 15. Modelled values, not station measurements; five days are a small sample of a year.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-air-quality) · [open the example](https://www.seebra.io/?example=air-quality) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fair-quality) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Health

## Sources

- Open-Meteo air quality: <https://air-quality-api.open-meteo.com/v1>

## Steps

Queries:

- [Hourly pollutants](.seebra/query/eb9d1313-854f-53b2-ad28-d8d6934e97e0.json)

Transformations:

- [Hours per city](transforms/hours-per-city.polars.py) (polars)
- [Daily means](transforms/daily-means.sql) (sql)
- [Quantiles and days over the WHO guideline](transforms/quantiles-and-days-over-the-who-guideline.polars.py) (polars)

Graphs:

- [PM2.5 by the hour (µg/m³; dashed: WHO 24-hour guideline)](graphs/pm2-5-by-the-hour-g-m3-dashed-who-24-hour.js)
- [Distribution and exceedance: quantiles of hourly PM2.5 per city](graphs/distribution-and-exceedance-quantiles-of-hourly.js)

Tables:

- Daily means (µg/m³)
- Quantiles and days over 15 µg/m³

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/air-quality`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
