// Every dinosaur find (occurrence) at genus level: where it was dug up (lat,
// lng) and where that place was when the animal lived (paleolat, paleolng:
// PBDB's GPlates model at the find's middle age). Group from the genus rows.
(() => {
  const group = new Map(data[1].map(g => [g.genus, g.clade]));
  const period = (ma) => ma > 201.4 ? "Triassic" : ma > 145 ? "Jurassic" : "Cretaceous";
  return (data[0].records || []).map(r => {
    const mid = (r.max_ma + r.min_ma) / 2;
    const genus = r.genus || (r.accepted_name || "").split(" ")[0];
    return {
      genus,
      clade: group.get(genus) || "Unplaced dinosaur",
      family: r.family && r.family !== "NO_FAMILY_SPECIFIED" ? r.family : "",
      interval: r.late_interval ? r.early_interval + " – " + r.late_interval : r.early_interval,
      max_ma: r.max_ma, min_ma: r.min_ma,
      mid_ma: Math.round(mid * 10) / 10,
      period: period(mid),
      lat: r.lat == null ? null : +r.lat,
      lng: r.lng == null ? null : +r.lng,
      paleolat: r.paleolat == null ? null : +r.paleolat,
      paleolng: r.paleolng == null ? null : +r.paleolng,
      collection: "https://paleobiodb.org/classic/basicCollectionInfo?collection_no=" + r.collection_no
    };
  });
})()