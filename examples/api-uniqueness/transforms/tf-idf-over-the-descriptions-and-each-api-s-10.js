// JavaScript, as one step, because this is an all-pairs search: 508 TF-IDF vectors give 128,000 pairs, each a sparse dot product,
// and every API needs its 10 nearest. In Polars that is a self-join on shared words (one row per pair and word, millions here)
// and a top-k per API, which the runtime's dialect has no rank for; here it is an inverted index and a sort, under a second.
// The formula itself (mean of the k nearest, rarity, score, percentile) is in the Polars steps after this one.
// Tokens as frontend/scripts/uniqueness.py v1: title and tags counted twice, summary, description; stop words and place names out.
(() => {
  const STOP = new Set(`a an and are as at be by can for from has have how in into is it its of on or per that the their them then
there these this to was were which while with you your api apis data dataset datasets json get gets returns
return list lists endpoint endpoints query queries request requests key keys free open public use used using
via each every all any one more most also some such not only than other www http https com org net v1 v2 v3
about like etc e.g eg i.e ie good chart dashboard needs need give gives given time per day days new`.split(/\s+/));
  const PLACES = new Set(`sweden swedish norway norwegian denmark danish finland finnish iceland germany german france french spain
spanish italy italian netherlands dutch belgium belgian austria swiss switzerland poland polish uk british
england scotland ireland irish europe european eu us usa american united states america canada canadian
australia australian japan japanese china chinese india indian brazil korea korean mexico russia estonia
latvia lithuania portugal greece czech hungary romania new zealand nz world global national country countries
nordic baltic stockholm london paris berlin oslo helsinki copenhagen tokyo york california texas`.split(/\s+/));
  const apis = (data.items || data).filter(i => i.kind === 'api');
  const words = (text, dropPlaces) => ((text || '').toLowerCase().match(/[a-zåäöéü][a-zåäöéü0-9-]{2,}/g) || [])
    .map(w => w.replace(/^-+|-+$/g, ''))
    .filter(w => w.length > 2 && !STOP.has(w) && !(dropPlaces && PLACES.has(w)) && !/^\d+$/.test(w));
  const vectors = dropPlaces => {
    const docs = apis.map(i => {
      const tags = (i.tags || []).join(' ');
      const c = new Map();
      for (const w of words([i.title || '', tags, i.title || '', tags, i.summary || '', i.description || ''].join(' '), dropPlaces)) c.set(w, (c.get(w) || 0) + 1);
      return c;
    });
    const df = new Map();
    for (const d of docs) for (const w of d.keys()) df.set(w, (df.get(w) || 0) + 1);
    const n = docs.length;
    return docs.map(d => {
      const v = new Map();
      let norm = 0;
      for (const [w, c] of d) { const x = (1 + Math.log(c)) * Math.log((1 + n) / (1 + df.get(w))); v.set(w, x); norm += x * x; }
      norm = Math.sqrt(norm) || 1;
      for (const [w, x] of v) v.set(w, x / norm);
      return v;
    });
  };
  const K = 10, out = [], n = apis.length;
  for (const [variant, drop] of [['places removed', true], ['places kept', false]]) {
    const vs = vectors(drop);
    // an inverted index: for each word, the APIs that use it and their weights; one API's similarities to all others are then
    // a sum over its own words' lists (the sparse dot products of the cosine, all at once)
    const post = new Map();
    vs.forEach((v, j) => { for (const [w, y] of v) { if (!post.has(w)) post.set(w, []); post.get(w).push(j, y); } });
    vs.forEach((v, i) => {
      const s = new Float64Array(n);
      for (const [w, x] of v) { const p = post.get(w); for (let q = 0; q < p.length; q += 2) s[p[q]] += x * p[q + 1]; }
      const sims = [];
      for (let j = 0; j < n; j++) if (j !== i) sims.push([s[j], j]);
      // the same order as the Python script: highest similarity first, ties by the later catalog position
      sims.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
      sims.slice(0, K).forEach(([sim, j], r) => out.push({id: apis[i].id, variant, rank: r + 1, neighbour: apis[j].id, neighbour_title: apis[j].title, similarity: Math.round(sim * 1e6) / 1e6}));
    });
  }
  return out;
})()