// How much of each search the board shows: shown is the records fetched (one
// page, in K-samsök's order: not a random sample), of is totalHits, all that
// match. The gaps, the dating and the names and materials are counted over
// the whole set by K-samsök itself and need no sample.
(() => {
  const sets = ["place sample", "image sample", "parish"];
  return data.map((a, i) => {
    const r = (a || {}).result || {};
    const shown = (r.records || []).length;
    return {set: sets[i], shown, of: r.totalHits ?? null,
            share: r.totalHits ? Math.round((1000 * shown) / r.totalHits) / 10 : null};
  });
})()
