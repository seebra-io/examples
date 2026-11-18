# Your own data

Where to get your own data out of 22 common platforms (Spotify, Google Timeline, Apple Health, Strava, Netflix, your bank and more), which file in each export matters, and what to look at. Two worked examples run on made-up samples shaped like the real files: Spotify's listening history and Netflix's viewing history. Drop your own export on the board and point the transformation at it.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-your-own-data) · [open the example](https://www.seebra.io/?example=your-own-data) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fyour-own-data) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

## Steps

Transformations:

- [Guide: where and how to export](transforms/guide-where-and-how-to-export.js) (javascript)
- [Plays: local time, minutes, skipped](transforms/plays-local-time-minutes-skipped.js) (javascript)
- [Artists: hours, skips, first and last played](transforms/artists-hours-skips-first-and-last-played.sql) (sql)
- [Titles: series, season, episode, date](transforms/titles-series-season-episode-date.js) (javascript)
- [Binges: 3+ episodes of a series in a day](transforms/binges-3-episodes-of-a-series-in-a-day.sql) (sql)

Graphs:

- [Start here](graphs/start-here.js)
- [Which data, and how long the export takes (hover a platform)](graphs/which-data-and-how-long-the-export-takes-hover-a.js)
- [Spotify: when you listen](graphs/spotify-when-you-listen.js)
- [Spotify: your artists, month by month](graphs/spotify-your-artists-month-by-month.js)
- [Spotify: played a lot, skipped a lot?](graphs/spotify-played-a-lot-skipped-a-lot.js)
- [Netflix: every day you watched](graphs/netflix-every-day-you-watched.js)

Tables:

- Export guide: links, steps and the file that matters
- Spotify: artists
- Netflix: binges

## Data

Board files: curated data kept with the board, not live. The rows load from these files (in the app from `https://cdn.seebra.io/explore/examples/your-own-data/data/…`); no API is called and nothing is refetched. Each row's `source` field, where it has one, cites where that row came from.

- [data/NetflixViewingHistory.csv](data/NetflixViewingHistory.csv) (3.4 KB), the data node *Sample: Netflix viewing history (made up)*: Made up: a sample in the shape of Netflix's viewing history export (NetflixViewingHistory.csv), so the board runs before you have your own. Not anyone's real viewing.
- [data/personal-exports.json](data/personal-exports.json) (14 KB), the data node *Export guide: 22 platforms*: Curated by Seebra: where to download your own data from 22 platforms (GDPR access and portability), the file that matters and what to look at. Each row links the platform's page (where). Links checked 2026-11-15; menus change often.
- [data/Streaming_History_Audio_sample.json](data/Streaming_History_Audio_sample.json) (2.9 MB), the data node *Sample: Spotify extended streaming history (made up)*: Made up: a sample in the shape of Spotify's extended streaming history export (Streaming_History_Audio_*.json), so the board runs before you have your own. Not anyone's real listening.

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/your-own-data`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
