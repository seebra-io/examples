# Crypto markets

CoinGecko's 20 largest coins by market cap: Polars turns the answer into rows and the 7-day hourly price sparkline into log returns, then a chart shows the day's moves, each coin's volatility against its week, and the correlation matrix of hourly returns (most coins move with Bitcoin). Prices are in US$; a week of hours is a small sample.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-crypto-markets) · [open the example](https://www.seebra.io/?example=crypto-markets) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fcrypto-markets) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Economy

## Sources

- CoinGecko: <https://api.coingecko.com/api/v3>

## Steps

Queries:

- [Markets](.seebra/query/b5888776-e628-5730-9063-5075f0d6d5db.json)

Transformations:

- [Coins](transforms/coins.polars.py) (polars)
- [Hourly log returns (7-day sparkline)](transforms/hourly-log-returns-7-day-sparkline.polars.py) (polars)
- [Log returns and volatility per coin](transforms/log-returns-and-volatility-per-coin.polars.py) (polars)
- [Correlation of hourly log returns (every pair)](transforms/correlation-of-hourly-log-returns-every-pair.polars.py) (polars)

Graphs:

- [24h change (%)](graphs/24h-change.js)
- [Log returns and volatility: the week against its spread](graphs/log-returns-and-volatility-the-week-against-its.js)
- [Correlation of hourly log returns: one market factor](graphs/correlation-of-hourly-log-returns-one-market.js)

Tables:

- Coins

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/crypto-markets`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
