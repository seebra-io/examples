// The same gaps for the 25 commonest object names (K-samsök's itemName, the
// museum's own word: "kniv", "mynt", "fotografi"). A facet lists only its 100
// largest terms, so a name missing from a gap's list has fewer records there
// than that list's smallest: it is shown as "< n" (an upper bound), not as 0.
(() => {
  const list = (a) => (((a || {}).result || {}).term || []);
  const terms = (a) => new Map(list(a).map((t) => [t.indexFields.value, t.records]));
  const floor = (a) => { const l = list(a); return l.length >= 100 ? l[l.length - 1].records : 0; };
  const [all, noGeo, noTime, noImg, imgLic] = data.map(terms);
  const floors = data.map(floor);
  const pct = (k, n) => (n ? Math.round((1000 * k) / n) / 10 : null);
  const count = (m, f, name) => (m.has(name) ? {n: m.get(name), bound: false} : {n: f, bound: f > 0});
  return [...all]
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([name, records]) => {
      const g = count(noGeo, floors[1], name), t = count(noTime, floors[2], name), i = count(noImg, floors[3], name);
      const with_image = Math.max(0, records - i.n);
      const licensed = imgLic.get(name) ?? 0;
      return {
        name, records,
        no_coordinates: g.n, no_coordinates_bound: g.bound,
        no_dating: t.n, no_dating_bound: t.bound,
        no_image: i.n, no_image_bound: i.bound,
        with_image, image_no_licence: Math.max(0, with_image - licensed),
        pct_no_coordinates: pct(g.n, records),
        pct_no_dating: pct(t.n, records),
        pct_no_image: pct(i.n, records),
        pct_image_no_licence: pct(Math.max(0, with_image - licensed), with_image),
      };
    });
})()
