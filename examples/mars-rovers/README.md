# Mars rovers

Perseverance and Curiosity's newest raw images from NASA: the latest 24 of each as image grids, and of the newest 100 which cameras took them and on which sol (a Mars day). Statistics: a rate needs an exposure. The same 100 images can cover one sol or many, so images per sol divides by the sols the window spans, including sols with none, with a Poisson 95% interval; per sol with images it would be a different number. Caveats: the window is cut by count, so its first sol is partly missing and its newest sols are still being downlinked; images come in bursts (mosaics, drives), so the Poisson interval is too narrow.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-mars-rovers) · [open the example](https://www.seebra.io/?example=mars-rovers) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fmars-rovers) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Space

## Sources

- NASA Mars raw images: <https://mars.nasa.gov>

## Steps

Queries:

- [Perseverance](.seebra/query/fed2ad4c-4d72-5689-8443-620617b206b7.json)
- [Curiosity](.seebra/query/3a09f65a-5f65-5155-b1a4-d169a5c57d1d.json)

Transformations:

- [Perseverance photos (the newest 24, image links for the grid)](transforms/perseverance-photos-the-newest-24-image-links.polars.py) (polars)
- [Curiosity photos (the newest 24, image links for the grid)](transforms/curiosity-photos-the-newest-24-image-links-for.polars.py) (polars)
- [Perseverance images (camera, sol)](transforms/perseverance-images-camera-sol.polars.py) (polars)
- [Images per camera](transforms/images-per-camera.sql) (sql)
- [Curiosity images (camera, sol)](transforms/curiosity-images-camera-sol.polars.py) (polars)
- [Perseverance images per sol: a rate needs an exposure](transforms/perseverance-images-per-sol-a-rate-needs-an.polars.py) (polars)
- [Curiosity images per sol: a rate needs an exposure](transforms/curiosity-images-per-sol-a-rate-needs-an.polars.py) (polars)

Graphs:

- [Which cameras took the newest 100 images](graphs/which-cameras-took-the-newest-100-images.js)
- [Images per sol: the same 100 images, different exposures](graphs/images-per-sol-the-same-100-images-different.js)

Tables:

- Perseverance cameras

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/mars-rovers`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
