# Influenza's R: exponential growth, herd immunity and final size

US flu seasons since 2016–17 (CDC FluView via Delphi), ILI+ on a log scale: exponential growth doubling in 8–20 days, so R is 1.1–1.3. The SIR model then gives a herd-immunity threshold near 13% and a final size near 26%. Caveats: ILI+ is a proxy; R depends on the generation interval; effective R, not R0. With a study plan.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-flu-growth-r0) · [open the example](https://www.seebra.io/?example=flu-growth-r0) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fflu-growth-r0) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Health

## Sources

- Delphi Epidata (CMU): <https://api.delphi.cmu.edu/epidata>

## Steps

Queries:

- [FluView: weekly ILI, US national](.seebra/query/cb9b1a25-54b3-5dc9-bcad-43155e717ac4.json)
- [FluView clinical labs: % positive for influenza, US national](.seebra/query/561b1a24-b76b-5350-8b05-0e8fb4a24256.json)

Transformations:

- [Weekly ILI+ per season](transforms/weekly-ili-per-season.polars.py) (polars)
- [Exponential growth per season (log-linear fit)](transforms/exponential-growth-per-season-log-linear-fit.polars.py) (polars)
- [R, herd-immunity threshold and final size per season](transforms/r-herd-immunity-threshold-and-final-size-per.polars.py) (polars)
- [Across seasons](transforms/across-seasons.sql) (sql)

Graphs:

- [Seasons on a log scale: exponential growth is a straight line](graphs/seasons-on-a-log-scale-exponential-growth-is-a.js)
- [R, herd-immunity threshold and final size per season](graphs/r-herd-immunity-threshold-and-final-size-per.js)

Tables:

- Seasons
- Across seasons

Studies:

- [Study: do faster-growing seasons peak higher?](.seebra/study/f0e0a537-273b-5161-a01e-0c0112272cdd.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/flu-growth-r0`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
