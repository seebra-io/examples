# REST API workbench

Developing against a REST API: call endpoints, join their answers and check the shape of the data: which fields every record has, which users and posts match in a full join, and the distribution of body lengths with its quantiles before averaging it. Uses JSONPlaceholder as a stand-in (a fixture: every user has exactly 10 posts); point the datasource at http://localhost:<port> and Seebra calls your local API straight from the browser.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-api-workbench) · [open the example](https://www.seebra.io/?example=api-workbench) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fapi-workbench) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Tech

## Sources

- JSONPlaceholder (swap for localhost): <https://jsonplaceholder.typicode.com>

## Steps

Queries:

- [GET /posts](.seebra/query/2a68d868-bb31-557a-aae1-91b4045c55ca.json)
- [GET /users](.seebra/query/4daf4cfd-5cff-5fa7-8546-1ca865779a96.json)

Transformations:

- [Posts per user](transforms/posts-per-user.sql) (sql)
- [Post body length with quantiles](transforms/post-body-length-with-quantiles.polars.py) (polars)
- [Users](transforms/users.polars.py) (polars)
- [Field coverage (non-null per field)](transforms/field-coverage-non-null-per-field.polars.py) (polars)
- [Users joined with their posts](transforms/users-joined-with-their-posts.polars.py) (polars)

Graphs:

- [Body length: a distribution and its quantiles](graphs/body-length-a-distribution-and-its-quantiles.js)
- [Field coverage (check the response shape)](graphs/field-coverage-check-the-response-shape.js)

Tables:

- Users and their posts (full join)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/api-workbench`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
