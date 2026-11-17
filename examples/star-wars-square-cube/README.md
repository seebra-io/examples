# Star Wars bodies and the square-cube law

SWAPI's 82 characters: mass grows as height^1.54 ± 0.12, flatter than the BMI's 2 and far from the square-cube law's 3, so tall aliens are lanky and small ones dense (costumes and CGI, not biology). Jabba weighs 19× a Star Wars body of his height; starship cost grows as length^1.4. Fan-made data from Lucasfilm's films.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-star-wars-square-cube) · [open the example](https://www.seebra.io/?example=star-wars-square-cube) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fstar-wars-square-cube) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Fun

## Sources

- SWAPI, the Star Wars API (swapi.info mirror): <https://swapi.info/api>

## Steps

Queries:

- [All 82 characters: height, mass, species, homeworld, films](.seebra/query/9399f611-9520-5256-a0db-4d8bba6f1228.json)
- [All 37 species, with their average height and lifespan](.seebra/query/f06be086-13a5-5a7f-84ff-341926ca710e.json)
- [All 60 planets: population, diameter, climate, gravity](.seebra/query/3d62f8a1-6ec2-575e-aa9a-6bcbbc494edc.json)
- [The six films of the original and prequel trilogies](.seebra/query/f070703d-3ef0-54f0-a235-bc1010124794.json)
- [All 36 starships: cost, length, crew, hyperdrive class](.seebra/query/1b6a5d5e-0169-5451-9e56-77379309be42.json)

Transformations:

- [Characters in numbers: height (cm), mass (kg), BMI, species and homeworld](transforms/characters-in-numbers-height-cm-mass-kg-bmi.polars.py) (polars)
- [Who is fitted: everyone, everyone but Jabba, humans, aliens](transforms/who-is-fitted-everyone-everyone-but-jabba-humans.sql) (sql)
- [The scaling law: log mass on log height, per group, against 2 (BMI) and 3 (square-cube)](transforms/the-scaling-law-log-mass-on-log-height-per-group.polars.py) (polars)
- [Who is unusually heavy or light for their height](transforms/who-is-unusually-heavy-or-light-for-their-height.polars.py) (polars)
- [Per species: characters against the species' average height](transforms/per-species-characters-against-the-species.polars.py) (polars)
- [Starships in numbers: cost, length, crew, hyperdrive](transforms/starships-in-numbers-cost-length-crew-hyperdrive.polars.py) (polars)
- [Do starships scale too? Cost against length](transforms/do-starships-scale-too-cost-against-length.polars.py) (polars)
- [Per film: characters, and how many SWAPI can weigh](transforms/per-film-characters-and-how-many-swapi-can-weigh.polars.py) (polars)
- [Homeworlds: population, size, gravity, and their characters' weight](transforms/homeworlds-population-size-gravity-and-their.polars.py) (polars)

Graphs:

- [Mass against height on log axes: Star Wars bodies against the square-cube law](graphs/mass-against-height-on-log-axes-star-wars-bodies.js)
- [Heavier or lighter than a Star Wars body of the same height](graphs/heavier-or-lighter-than-a-star-wars-body-of-the.js)
- [Characters against their species' average height](graphs/characters-against-their-species-average-height.js)
- [Starships: cost against length, coloured by hyperdrive class](graphs/starships-cost-against-length-coloured-by.js)
- [Per film: characters SWAPI can and can't weigh](graphs/per-film-characters-swapi-can-and-can-t-weigh.js)
- [Homeworlds: population against diameter, by climate](graphs/homeworlds-population-against-diameter-by.js)

Tables:

- Scaling exponents per group
- Every weighed character against the law
- Starship scaling

Studies:

- [Do Star Wars bodies obey the square-cube law?](.seebra/study/28370799-088e-5fda-8b0a-f6ef0bd0d2f5.json)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/star-wars-square-cube`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
