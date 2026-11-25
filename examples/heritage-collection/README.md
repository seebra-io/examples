# Your collection on your website

A museum's own records in K-samsök, live, for its website and a gallery kiosk: a map of find places, a time line of dating, object names and materials, pictures with their licence and record, and the collection gaps (the share of records without coordinates, dating, a picture or a licence, by record type and object name) that public-access reporting asks about. Statens historiska museer by default; set org to another institution's K-samsök code, and parish to see that parish's ancient monuments in Fornsök and who else holds records from it. Statistics: the gaps, dating, names and materials are counted by K-samsök over the whole set; the map and the pictures are one page each (150 and 36 records, not a random sample). Caveat: a record dated over a range counts in every century it spans.

**Open it in Seebra:** [its page in Explore](https://www.seebra.io/explore/example-heritage-collection) · [open the example](https://www.seebra.io/?example=heritage-collection) · [edit with history](https://www.seebra.io/?board=git%3Ahttps%3A%2F%2Fgithub.com%2Fseebra-io%2Fexamples%23examples%2Fheritage-collection) (clones this repository into your browser: the board with this folder's commits, which you can change, commit and push)

Category: Culture

## Sources

- K-samsök (Riksantikvarieämbetet): <https://kulturarvsdata.se/ksamsok>

## Steps

Queries:

- [Records by type](.seebra/query/b308a56d-fb70-5047-b187-6b8e04644399.json)
- [… without coordinates](.seebra/query/2be888a9-5e68-5722-b795-f5f9f6825392.json)
- [… without dating](.seebra/query/f9916d9a-3214-5a41-aeeb-fbd4f39909ed.json)
- [… without an image](.seebra/query/7ea17378-c59e-59ab-a582-bd5ed44b09ed.json)
- [… with a licensed image](.seebra/query/f16e9db8-2e99-5b98-9398-69c5c7037b97.json)
- [… with a licensed record](.seebra/query/33161480-946e-5f9d-8e18-71264e923c2b.json)
- [Records by object name](.seebra/query/606fb055-22dd-54c3-8e7a-cb75c58f109f.json)
- [Object names without coordinates](.seebra/query/fa5e229a-0bf6-50e4-9339-2794552aa589.json)
- [Object names without dating](.seebra/query/884f8227-d0ef-501c-b526-d4661f378a28.json)
- [Object names without an image](.seebra/query/09ec97e3-8fb0-5f38-851b-6619ea76f02c.json)
- [Object names with a licensed image](.seebra/query/a17c4812-58d7-59fb-9b81-40e740fe2ebf.json)
- [Records by material](.seebra/query/2c50daad-26c4-5ecb-9652-49e677aca2c3.json)
- [Records by century of dating](.seebra/query/0342c9cd-4ff7-5318-ae46-6e4094e014a3.json)
- [Records with coordinates (one page)](.seebra/query/46fc5671-c5c7-5386-a5db-4214c184b9ab.json)
- [Records with a picture (one page)](.seebra/query/bdd0b1e3-df21-554a-8518-85fd1b45f89a.json)
- [Who holds records from the parish](.seebra/query/1f19c422-150a-5ab5-bf70-348a806752a9.json)
- [The parish's ancient monuments (Fornsök, one page)](.seebra/query/53b3baab-b414-5249-8d6e-ac593103c379.json)

Transformations:

- [Collection gaps by record type](transforms/collection-gaps-by-record-type.js) (javascript)
- [Collection gaps by object name](transforms/collection-gaps-by-object-name.js) (javascript)
- [Dating by century](transforms/dating-by-century.js) (javascript)
- [Object names and materials](transforms/object-names-and-materials.js) (javascript)
- [The records fetched](transforms/the-records-fetched.js) (javascript)
- [What the pages cover](transforms/what-the-pages-cover.js) (javascript)
- [Institutions with records from the parish](transforms/institutions-with-records-from-the-parish.js) (javascript)
- [Records with coordinates](transforms/records-with-coordinates.js) (javascript)
- [Pictures, with licence and record](transforms/pictures-with-licence-and-record.js) (javascript)
- [The parish's monuments](transforms/the-parish-s-monuments.js) (javascript)

Graphs:

- [The collection in K-samsök](graphs/the-collection-in-k-samsok.js)
- [Where: find places](graphs/where-find-places.js)
- [When: dating by century](graphs/when-dating-by-century.js)
- [What: object names and materials](graphs/what-object-names-and-materials.js)
- [Collection gaps: what is missing, by type and object name](graphs/collection-gaps-what-is-missing-by-type-and.js)
- [Wider: the same parish in Fornsök and other collections](graphs/wider-the-same-parish-in-fornsok-and-other.js)

Tables:

- Gaps by object name (table, for reporting)

## This folder

- The board's folder is a git working tree (.seebra format 2): code in `queries/`, `transforms/` and `graphs/`, named after the steps; data kept with the board in `data/`; the board's state in `.seebra/` (one JSON per step, `seebra.json` naming the board).
- Data results aren't kept, except what `data/` holds: the rest comes back when the board runs.
- This folder is the example's source. A merge to `main` builds it into what Seebra opens and publishes it (Seebra's `ops/examples-build`). Change it here, or in Seebra: **edit with history**, Edit in this clone, Commit…, Push.

## Next

- What changed in this example: `git log -- examples/heritage-collection`, or the git panel in Seebra (the Explorer's git chip, or File › History and commit…).
- Make your own copy in Seebra, then change a query or a graph and compare.
