// What the collection holds: the 20 commonest object names and materials,
// over the whole set (facets, counted by K-samsök; a record with two
// materials counts under both). share: of all the institution's records.
(() => {
  const [names, materials, types] = data;
  const total = ((((types || {}).result || {}).term) || []).reduce((s, t) => s + t.records, 0);
  const rows = (a, kind) => ((((a || {}).result || {}).term) || [])
    .filter((t) => t.records > 0)
    .slice(0, 20)
    .map((t, i) => ({kind, value: t.indexFields.value, records: t.records, rank: i + 1,
                     share: total ? Math.round((1000 * t.records) / total) / 10 : null}));
  return [...rows(names, "object name"), ...rows(materials, "material")];
})()
