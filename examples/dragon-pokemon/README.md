# Dragon-type Pokémon

PokeAPI's Dragon type: every Dragon Pokémon's official artwork, which generation it came from, and the type chart: what Dragon hits hard and what hits it back. Statistics: a rate needs an exposure. Later generations look Dragon-heavy, but each brought a different number of new species, so the count is divided by that size and shown with a 95% interval (the generation sizes are the national Pokédex ranges, written into the step; alternate forms are left out). Next: the table's links lead to each Pokémon's own stats (base stats are a step away, one call per Pokémon).

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-dragon-pokemon) · [open the example](https://www.seebra.io/?example=dragon-pokemon) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fdragon-pokemon) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Fun

## Sources

- PokeAPI: <https://pokeapi.co/api/v2>

## Steps

Queries:

- [Dragon type](.seebra/query/cf909354-c0e8-5e16-b204-1c876aad6adb.json)

Transformations:

- [Roster (species, generation)](transforms/roster-species-generation.polars.py) (polars)
- [Artwork (image links for the grid)](transforms/artwork-image-links-for-the-grid.polars.py) (polars)
- [Dragon share per generation (a rate needs an exposure)](transforms/dragon-share-per-generation-a-rate-needs-an.polars.py) (polars)

Graphs:

- [Type chart](graphs/type-chart.js)
- [Dragon Pokémon per generation](graphs/dragon-pokemon-per-generation.js)
- [Dragon share of new species, with 95% interval](graphs/dragon-share-of-new-species-with-95-interval.js)

Tables:

- Roster

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/dragon-pokemon`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
