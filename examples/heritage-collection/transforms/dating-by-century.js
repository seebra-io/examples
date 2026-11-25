// Records per century of dating, over the whole set (K-samsök's century
// facet). A record dated 1000-1300 counts in each century it spans, so the
// bars overlap: they add up to more than the records. 1100 is the 1100s
// (1100-1199); -500 is 500-401 BC.
(() => {
  const terms = (((data || {}).result || {}).term || []);
  const label = (c) => (c < 0 ? `${-c} BC` : `${c}s`);
  return terms
    .filter((t) => t.records > 0)
    .map((t) => ({century: Number(t.indexFields.value), records: t.records}))
    .filter((r) => Number.isFinite(r.century) && r.century <= new Date().getFullYear())
    .sort((a, b) => a.century - b.century)
    .map((r) => ({...r, label: label(r.century)}));
})()
