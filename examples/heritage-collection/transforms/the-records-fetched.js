// One row per record from K-samsök's search answers (JSON-LD, each record a
// @graph of nodes: the Entity, and its Contexts, names, materials and Images
// as blank nodes it refers to by @id). set says which search found it:
//   place sample  the institution's records that carry coordinates
//   image sample  its records with a picture
//   parish        the parish's ancient monuments and sites (RAÄ, Fornsök)
// Fields: what it is (label, name, type), when (from/to years, as dated),
// where (place, parish, municipality, county; lon/lat, WGS84), its picture
// (thumbnail, image licence and credit), its record's licence, and links:
// record (the museum's own page: DigitaltMuseum, samlingar.shm.se, Fornsök)
// and uri (K-samsök's identifier, which redirects there too).
(() => {
  const sets = ["place sample", "image sample", "parish"];
  const val = (x) => {
    if (x == null) return null;
    if (Array.isArray(x)) return val(x[0]);
    if (typeof x === "object") return x["@value"] ?? x["@id"] ?? null;
    return String(x);
  };
  const all = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const tail = (u) => (u ? String(u).split(/[#/]/).pop() : null);
  const https = (u) => (u ? String(u).replace(/^http:\/\//, "https://") : null);
  const LICENCES = {"cc0": "CC0", "by": "CC BY", "by-sa": "CC BY-SA", "by-nd": "CC BY-ND", "by-nc": "CC BY-NC",
                    "by-nc-sa": "CC BY-NC-SA", "by-nc-nd": "CC BY-NC-ND", "pdmark": "Public domain", "inc": "In copyright"};
  const licence = (u) => {
    if (!u) return null;
    const s = String(u).toLowerCase();
    const cc = s.match(/creativecommons\.org\/(?:licenses|publicdomain)\/([a-z-]+)/);
    const k = cc ? (cc[1] === "zero" ? "cc0" : cc[1] === "mark" ? "pdmark" : cc[1]) : tail(s);
    return LICENCES[k] || k;
  };
  const TYPES = {object: "objekt/föremål", photo: "foto", art: "konstverk", monument: "kulturlämning",
                 building: "byggnad", map: "karta", document: "dokument", collection: "samling", event: "historisk händelse"};
  const year = (s) => { const n = parseInt(s, 10); return Number.isFinite(n) ? n : null; };
  // a point, or a polygon's (a site's outline) mean vertex
  const point = (c) => {
    const m = String(val(c) || "").match(/coordinates[^>]*>([^<]+)</);
    const xy = m ? m[1].trim().split(/\s+/).map((p) => p.split(",").map(Number)).filter((p) => p.length >= 2 && p.every(Number.isFinite)) : [];
    return xy.length ? [d3mean(xy, 0), d3mean(xy, 1)] : null;
  };
  const d3mean = (xy, k) => Math.round(1e5 * xy.reduce((s, p) => s + p[k], 0) / xy.length) / 1e5;
  // some services write their keys with the ksam: prefix (RAÄ's), some without
  const bare = (n) => Object.fromEntries(Object.entries(n).map(([k, v]) => [k.replace(/^ksam:/, ""), k === "@type" ? String(v).replace(/^ksam:/, "") : v]));
  return data.flatMap((answer, i) => (((answer || {}).result || {}).records || []).map((r) => {
    const g = (((r || {}).record || {})["@graph"] || []).map(bare);
    const byId = new Map(g.map((n) => [n["@id"], n]));
    const ref = (x) => all(x).map((y) => byId.get(y && y["@id"])).filter(Boolean);
    const e = g.find((n) => n["@type"] === "Entity") || {};
    const contexts = ref(e.context);
    const where = contexts.find((c) => c.coordinates) || contexts.find((c) => c.parishName || c.placeName) || {};
    const made = contexts.find((c) => /produce|create/.test(val(c.contextType) || "") && (c.fromTime || c.toTime))
      || contexts.find((c) => c.fromTime || c.toTime) || {};
    const img = ref(e.image)[0] || {};
    const xy = point(where.coordinates);
    const from = year(made.fromTime), to = year(made.toTime);
    const html = all(e.presentation).length ? null : null;
    return {
      set: sets[i],
      label: (val(e.itemLabel) || val(ref(e.itemName)[0] && ref(e.itemName)[0].name) || "").replace(/,\s*$/, ""),
      name: val(ref(e.itemName)[0] && ref(e.itemName)[0].name),
      type: TYPES[tail(val(e.itemType))] || tail(val(e.itemType)),
      class: val(e.itemClassName),
      material: ref(e.itemMaterial).map((m) => val(m.material)).filter(Boolean).join(", ") || null,
      from, to,
      dated: from != null || to != null
        ? (from === to || to == null ? `${from}` : from == null ? `${to}` : `${from} to ${to}`)
          + (val(made.fromPeriodName) ? ` (${val(made.fromPeriodName)}${val(made.toPeriodName) && val(made.toPeriodName) !== val(made.fromPeriodName) ? " to " + val(made.toPeriodName) : ""})` : "")
        : null,
      place: val(where.placeName) || null,
      parish: val(where.parishName) || null,
      municipality: val(where.municipalityName) || null,
      county: val(where.countyName) || null,
      province: val(where.provinceName) || null,
      lon: xy ? xy[0] : null,
      lat: xy ? xy[1] : null,
      thumbnail: https(val(e.thumbnail) || val(img.thumbnailSource)),
      image_licence: licence(val(img.mediaLicenseUrl) || val(img.mediaLicense)),
      image_credit: val(img.byline) || val(img.copyright) || null,
      licence: licence(val(e.itemLicenseUrl) || val(e.itemLicense)),
      org: val(e.serviceOrganization),
      institution: val(e.serviceOrganizationFull) || val(e.serviceOrganization),
      record: https(val(e.url)) || https(e["@id"]),
      uri: e["@id"] || null,
    };
  }));
})()
